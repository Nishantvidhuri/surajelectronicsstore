import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const { register, isLoggedIn } = useAuth();
    const navigate = useNavigate();

    // Redirect if already logged in
    useEffect(() => {
        if (isLoggedIn) {
            navigate('/'); // Redirect to home page
        }
    }, [isLoggedIn, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Basic validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('https://backendsurajelectronic.onrender.com/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            // Show success message
            setSuccess(true);

            // Clear form
            setFormData({
                username: '',
                email: '',
                phone: '',
                password: '',
                confirmPassword: ''
            });

            // Redirect to login page after 2 seconds
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err) {
            setError(err.message || 'Failed to register. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-8 mt-16 sm:mt-20 md:mt-24 lg:mt-32">
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Create Account</h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-600 rounded-lg">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-600 rounded-lg">
                        Registration successful! Redirecting to login...
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Username:</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 bg-gray-100 rounded-lg text-gray-800 border border-gray-300 focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                            placeholder="Choose a username"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 bg-gray-100 rounded-lg text-gray-800 border border-gray-300 focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Phone Number:</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 bg-gray-100 rounded-lg text-gray-800 border border-gray-300 focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                            placeholder="Enter your phone number"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Password:</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 bg-gray-100 rounded-lg text-gray-800 border border-gray-300 focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                            placeholder="Create a password"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Confirm Password:</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 bg-gray-100 rounded-lg text-gray-800 border border-gray-300 focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                            placeholder="Confirm your password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || success}
                        className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:bg-blue-700 focus:shadow-outline focus:outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Creating Account...' : success ? 'Registration Successful!' : 'Sign Up'}
                    </button>
                </form>

                <p className="mt-4 text-center text-gray-700">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-500 hover:underline">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Register;