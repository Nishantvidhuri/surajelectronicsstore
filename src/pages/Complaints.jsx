import { useState, Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';

const faultOptions = ['no indicator', 'no display', 'no sound', 'restart', 'led blinking'];

function Complaints() {
  const [formData, setFormData] = useState({
    address: '',
    phoneNumber: '',
    inches: '',
    company: '',
    fault: faultOptions[0],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFaultChange = (value) => {
    setFormData((prev) => ({ ...prev, fault: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("https://backendsurajelectronic.onrender.com/api/complaints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          issue: formData.fault,
          model: `${formData.inches} inch ${formData.company}`,
          address: formData.address,
          phoneNumber: formData.phoneNumber,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Failed to submit complaint");

      alert("Complaint submitted successfully!");
      setFormData({
        address: '',
        phoneNumber: '',
        inches: '',
        company: '',
        fault: faultOptions[0],
      });
    } catch (err) {
      console.error("Error submitting complaint:", err.message);
      alert("Submission failed: " + err.message);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-white via-blue-50 to-purple-100 text-gray-800 px-4 pt-36 pb-20 relative">
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-blue-300/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-pink-400/20 rounded-full blur-[120px]" />
      </div>

      {/* Form Card */}
      <div className="relative z-10 max-w-xl mx-auto bg-white/80 backdrop-blur-xl border border-white/30 shadow-xl rounded-2xl p-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Submit a Complaint</h2>
          <p className="text-gray-500 text-sm mt-1">We’re here to help. Fill out your issue or contact us directly.</p>
        </div>

        {/* Call / WhatsApp Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
          <a
            href="tel:+919871202673"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-6 py-2 rounded-xl transition w-full sm:w-auto text-center"
          >
            📞 Call Now
          </a>
          <a
            href="https://wa.me/919871202673"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 hover:bg-green-600 text-white text-sm px-6 py-2 rounded-xl transition w-full sm:w-auto text-center"
          >
            💬 WhatsApp
          </a>
        </div>

        {/* Complaint Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input label="Address" name="address" value={formData.address} onChange={handleChange} placeholder="Enter your address" />
          <Input label="Phone Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Enter phone number" type="tel" />
          <Input label="Inches" name="inches" value={formData.inches} onChange={handleChange} placeholder="TV size in inches" type="number" />
          <Input label="Company" name="company" value={formData.company} onChange={handleChange} placeholder="TV brand/company" />

          {/* Fault Listbox */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fault</label>
            <Listbox value={formData.fault} onChange={handleFaultChange}>
              <div className="relative">
                <Listbox.Button className="relative w-full bg-white border border-gray-300 rounded-lg py-3 pl-4 pr-10 text-left shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
                  <span className="block truncate">{formData.fault}</span>
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 pointer-events-none">▼</span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute z-20 bottom-full mb-2 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto text-sm">
                    {faultOptions.map((fault, idx) => (
                      <Listbox.Option
                        key={idx}
                        className={({ active }) => `cursor-pointer select-none py-2 pl-10 pr-4 ${active ? 'bg-blue-100 text-blue-900' : 'text-gray-800'}`}
                        value={fault}
                      >
                        {({ selected }) => (
                          <>
                            <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                              {fault}
                            </span>
                            {selected && (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">✓</span>
                            )}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:shadow-md transition-all duration-300"
          >
            📥 Request a Callback
          </button>
        </form>
      </div>
    </div>
  );
}

const Input = ({ label, name, value, onChange, placeholder , type = 'text' }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required
      placeholder={placeholder}
      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
    />
  </div>
);

export default Complaints;
