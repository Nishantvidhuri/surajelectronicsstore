import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // Assuming AuthContext has user info

function AddressModal({ isOpen, onClose, onSaveAddress }) {
  const { user } = useAuth(); // Get user from AuthContext
  const [addressOption, setAddressOption] = useState('manual'); // 'manual' or 'saved'
  const [userDefaultAddress, setUserDefaultAddress] = useState(null); // To store fetched default address
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cod'); // Added for payment method selection

  const [addressData, setAddressData] = useState({
    area: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '', // Added pincode to initial state
    isDefault: false,
    instructions: '',
  });

  // Load user's default address if available and modal is open
  useEffect(() => {
    if (isOpen && user && user.shippingAddress && user.shippingAddress.area) { // Assuming user.shippingAddress holds default address and has at least 'area'
      setUserDefaultAddress(user.shippingAddress);
      setAddressOption('saved'); // Pre-select saved address if available
    } else if (isOpen) {
      setAddressOption('manual'); // If no saved address or modal just opened, default to manual
    }
  }, [isOpen, user]);

  // Placeholder list of Indian states
  const indianStates = [
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
    'Andaman and Nicobar Islands',
    'Chandigarh',
    'Dadra and Nagar Haveli and Daman and Diu',
    'Lakshadweep',
    'Delhi',
    'Puducherry',
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleOptionChange = (e) => {
    setAddressOption(e.target.value);
  };

  const handlePaymentMethodChange = (e) => {
    setSelectedPaymentMethod(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (addressOption === 'saved' && userDefaultAddress) {
      // Use the saved address for the order
      onSaveAddress(userDefaultAddress, false, selectedPaymentMethod); // Pass selectedPaymentMethod
    } else if (addressOption === 'manual') {
      // Use the manually entered address for the order
      onSaveAddress(addressData, addressData.isDefault, selectedPaymentMethod); // Pass selectedPaymentMethod
    }
    // onClose(); // Let onSaveAddress handle closing or further actions
  };

  if (!isOpen) return null;

return (
  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white border border-gray-200 p-8 rounded-lg shadow-2xl w-full max-w-md relative">
      
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>

      <h2 className="text-2xl font-bold mb-6 text-gray-800">Enter Delivery Address</h2>

      {/* Saved Address Option */}
      {user && userDefaultAddress && userDefaultAddress.area && (
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <input
              type="radio"
              id="savedAddressOption"
              name="addressOption"
              value="saved"
              checked={addressOption === 'saved'}
              onChange={handleOptionChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <label htmlFor="savedAddressOption" className="ml-2 text-gray-800 font-medium">Use My Saved Address</label>
          </div>
          {addressOption === 'saved' && (
            <div className="bg-gray-100 p-3 rounded-md text-gray-700 border border-gray-200">
              <p>{userDefaultAddress.area}</p>
              {userDefaultAddress.landmark && <p>Landmark: {userDefaultAddress.landmark}</p>}
              <p>{userDefaultAddress.city}, {userDefaultAddress.state}</p>
              <p>{userDefaultAddress.pincode}</p>
              {userDefaultAddress.instructions && <p>Instructions: {userDefaultAddress.instructions}</p>}
            </div>
          )}
        </div>
      )}

      {/* Manual Entry Option */}
      <div className="mb-6">
        <div className="flex items-center">
          <input
            type="radio"
            id="manualAddressOption"
            name="addressOption"
            value="manual"
            checked={addressOption === 'manual'}
            onChange={handleOptionChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
          />
          <label htmlFor="manualAddressOption" className="ml-2 text-gray-800 font-medium">Enter New Address Manually</label>
        </div>
      </div>

      {/* Manual Form */}
      {addressOption === 'manual' && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="area" className="block text-sm font-medium text-gray-600 mb-1">Area, Street, Sector, Village</label>
            <input
              type="text"
              id="area"
              name="area"
              value={addressData.area}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white rounded-md text-gray-800 border border-gray-300 focus:border-blue-500 outline-none"
              required
            />
          </div>
          <div>
            <label htmlFor="landmark" className="block text-sm font-medium text-gray-600 mb-1">Landmark (Optional)</label>
            <input
              type="text"
              id="landmark"
              name="landmark"
              value={addressData.landmark}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white rounded-md text-gray-800 border border-gray-300 focus:border-blue-500 outline-none"
              placeholder="E.g. near Apollo hospital"
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="city" className="block text-sm font-medium text-gray-600 mb-1">Town/City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={addressData.city}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white rounded-md text-gray-800 border border-gray-300 focus:border-blue-500 outline-none"
                required
              />
            </div>
            <div className="flex-1">
              <label htmlFor="state" className="block text-sm font-medium text-gray-600 mb-1">State</label>
              <select
                id="state"
                name="state"
                value={addressData.state}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white rounded-md text-gray-800 border border-gray-300 focus:border-blue-500 outline-none"
                required
              >
                <option value="">Choose a state</option>
                {indianStates.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="pincode" className="block text-sm font-medium text-gray-600 mb-1">Pincode</label>
            <input
              type="text"
              id="pincode"
              name="pincode"
              value={addressData.pincode}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white rounded-md text-gray-800 border border-gray-300 focus:border-blue-500 outline-none"
              required
            />
          </div>
          <div>
            <label htmlFor="instructions" className="block text-sm font-medium text-gray-600 mb-1">Delivery Instructions (Optional)</label>
            <textarea
              id="instructions"
              name="instructions"
              value={addressData.instructions}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 bg-white rounded-md text-gray-800 border border-gray-300 focus:border-blue-500 outline-none"
              placeholder="E.g., leave at doorstep, call before arriving"
            ></textarea>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isDefault"
              name="isDefault"
              checked={addressData.isDefault}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label htmlFor="isDefault" className="ml-2 text-sm text-gray-700">Save as my default address</label>
          </div>
        </form>
      )}

      {/* Payment Method */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Select Payment Method</h3>
        <div className="space-y-3">
          <label className="flex items-center text-gray-800 cursor-pointer">
            <input
              type="radio"
              name="paymentMethod"
              value="cod"
              checked={selectedPaymentMethod === 'cod'}
              onChange={handlePaymentMethodChange}
              className="h-4 w-4 text-blue-600 border-gray-300"
            />
            <span className="ml-2">Cash on Delivery (COD)</span>
          </label>
          <label className="flex items-center text-gray-800 cursor-pointer">
            <input
              type="radio"
              name="paymentMethod"
              value="razorpay"
              checked={selectedPaymentMethod === 'razorpay'}
              onChange={handlePaymentMethodChange}
              className="h-4 w-4 text-blue-600 border-gray-300"
            />
            <span className="ml-2">Pay with Razorpay</span>
          </label>
        </div>
      </div>

      {/* Place Order Button */}
      <button
        onClick={handleSubmit}
        className="w-full mt-6 flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2m-9 0V3h8v2m-9 0a2 2 0 002 2h8a2 2 0 002-2M9 10h.01M15 10h.01M9 14h.01M15 14h.01M9 18h.01M15 18h.01"></path>
        </svg>
        Place Order
      </button>
    </div>
  </div>
);

}

export default AddressModal; 