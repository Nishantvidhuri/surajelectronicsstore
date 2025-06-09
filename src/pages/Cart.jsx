import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AddressModal from '../components/AddressModal';
import Toast from '../components/Toast';
import { useNavigate } from 'react-router-dom';
import { RAZORPAY_KEY_ID } from '../config/razorpay';

function Cart() {
  const { isLoggedIn, user } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState({ text: '', type: '' });
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      if (!isLoggedIn) {
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/cart', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch cart');
        }

        const data = await response.json();
        // Assuming data is an object like { user: ..., items: [...] }
        // And each item has _id, product { _id, name, price, image }, quantity
        setCart(data);
      } catch (err) {
        console.error('Fetch cart error:', err);
        setError(err.message || 'Failed to load cart.');
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [isLoggedIn]);

  const handleUpdateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return; // Prevent quantity less than 1
    
    try {
       const token = localStorage.getItem('token');
       const response = await fetch(`http://localhost:5000/api/cart/${itemId}`, {
         method: 'PUT',
         headers: {
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${token}`
         },
         body: JSON.stringify({ quantity })
       });

       if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to update quantity.');
       }

       // Update the cart state with the new quantity
       setCart(prevCart => ({
         ...prevCart,
         items: prevCart.items.map(item =>
           item._id === itemId ? { ...item, quantity: quantity } : item
         )
       }));

    } catch (err) {
       console.error('Update quantity error:', err.message);
       // TODO: Show error message to user
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
       const response = await fetch(`http://localhost:5000/api/cart/${itemId}`, {
         method: 'DELETE',
         headers: {
           'Authorization': `Bearer ${token}`
         }
       });

       if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to remove item.');
       }

       // Remove the item from cart state
       setCart(prevCart => ({
         ...prevCart,
         items: prevCart.items.filter(item => item._id !== itemId)
       }));

    } catch (err) {
       console.error('Remove item error:', err.message);
       // TODO: Show error message to user
    }
  };

  const handleClearCart = async () => {
     try {
       const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/cart', {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
           const errorData = await response.json();
           throw new Error(errorData.message || 'Failed to clear cart.');
        }

        // Set cart to empty
        setCart(prevCart => ({ ...prevCart, items: [] }));

        console.log('Cart cleared successfully.');
        // TODO: Show success message to user

     } catch (err) {
        console.error('Clear cart error:', err.message);
        // TODO: Show error message to user
     }
  };
  console.log(cart)
  const handleCheckout = () => {
    console.log('Proceed to checkout');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveAddress = async (addressData, isDefault, paymentMethod) => {
    console.log('Address saved:', addressData, 'Is Default:', isDefault, 'Payment Method:', paymentMethod);

    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');

      // 1. If isDefault is true, update the user's profile with this address
      if (isDefault) {
        try {
          const profileUpdateResponse = await fetch('http://localhost:5000/api/auth/profile', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ shippingAddress: addressData }), // Send address to be saved as default
          });

          if (!profileUpdateResponse.ok) {
            const errorData = await profileUpdateResponse.json();
            console.error('Failed to update user profile with default address:', errorData.message);
          }
          console.log('User default address updated successfully.');
        } catch (profileError) {
          console.error('Error updating user profile with default address:', profileError.message);
        }
      }

      // 2. Proceed with placing the order using the provided addressData
      const orderPayload = {
        address: addressData,
        paymentMethod: paymentMethod, // Include the selected payment method
      };

      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to place order.');
      }

      const orderData = await response.json();
      console.log('Order placed successfully (backend order):', orderData);

      // Clear the cart in the frontend state
      setCart(prevCart => ({ ...prevCart, items: [] }));

      if (paymentMethod === 'razorpay') {
        setToastMessage({ text: 'Order placed successfully! Proceeding to payment.', type: 'success' });
        handleCloseModal(); // Close modal

        console.log('Current user object before handlePayment:', user);
        console.log('Attempting to initialize Razorpay SDK...');
        const res = await initializeRazorpay();
        console.log('Razorpay SDK initialized result:', res);
        
        if (!res) {
          setShowToast(true);
          setToastMessage('Razorpay SDK failed to load');
          setToastType('error');
          setLoading(false);
          return;
        }

        console.log('Calling handlePayment with orderData:', orderData);
        await handlePayment(orderData, user);
        setLoading(false); // Ensure loader is off after handlePayment completes
      } else if (paymentMethod === 'cod') {
        // For COD, the order is already placed on the backend, just show success and navigate
        setShowToast(true);
        setToastMessage(`Order placed successfully! Order ID: ${orderData._id}. Payment will be collected on delivery.`);
        setToastType('success');
        setLoading(false);
        handleCloseModal();
        navigate('/orders');
      }

    } catch (err) {
      console.error('Place order error:', err.message);
      setError(err.message || 'Failed to place order.');
      setToastMessage({ text: err.message || 'Failed to place order.', type: 'error' });
      setLoading(false);
    }
  };

  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        console.log('Razorpay SDK loaded successfully.');
        resolve(true);
      };
      script.onerror = () => {
        console.error('Razorpay SDK failed to load.');
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (orderData, user) => {
    console.log('Inside handlePayment, orderData:', orderData);
    try {
      console.log('Making request to create Razorpay payment...');
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/orders/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: orderData.totalPrice * 100, // Convert to paise
          currency: 'INR',
        }),
      });
      console.log('Response from create-payment:', res);
      const data = await res.json();
      console.log('Data from create-payment:', data);

      if (!res.ok) {
        throw new Error(data.message || 'Failed to create Razorpay order');
      }
      
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: 'Suraj Electronics',
        description: 'Payment for your order',
        order_id: data.id,
        handler: async function (response) {
          console.log('Payment handler triggered. Response:', response);
          try {
            const verifyRes = await fetch('http://localhost:5000/api/orders/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                orderData: orderData,
              }),
            });
            console.log('Response from verify-payment:', verifyRes);
            const verifyData = await verifyRes.json();
            console.log('Data from verify-payment:', verifyData);

            if (verifyData.success) {
              setShowToast(true);
              setToastMessage(`Order placed successfully! Order ID: ${verifyData.order._id}`);
              setToastType('success');
              setLoading(false);
              navigate('/orders');
            } else {
              setShowToast(true);
              setToastMessage('Payment verification failed');
              setToastType('error');
              setLoading(false);
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            setShowToast(true);
            setToastMessage('Payment verification failed');
            setToastType('error');
            setLoading(false);
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone || '',
        },
        theme: {
          color: '#3B82F6',
        },
      };

      console.log('Creating new Razorpay instance with options:', options);
      const razorpay = new window.Razorpay(options);
      console.log('Opening Razorpay payment dialog...');

      razorpay.on('close', () => {
        console.log('Razorpay dialog closed.');
        setLoading(false);
      });

      razorpay.open();
    } catch (error) {
      console.error('Payment initialization error:', error);
      setShowToast(true);
      setToastMessage('Failed to initialize payment');
      setToastType('error');
      setLoading(false);
    }
  };

  const calculateItemTotal = (item) => {
    return (item.quantity * item.product.price);
  };

  const calculateSubtotal = () => {
    console.log("cart:",cart)
    if (!cart || !cart.items) return '0.00';
    return cart.items.reduce((sum, item) => sum + (item.quantity * item.product.price), 0);
  };

  if (!isLoggedIn) {
    return <div className="pt-20 flex justify-center items-center text-white min-h-screen bg-gray-900">Please log in to view your cart.</div>;
  }

  if (loading) {
    return (
      <div className="pt-20 flex justify-center items-center min-h-screen bg-white text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="pt-20 flex justify-center items-center text-red-400 min-h-screen bg-gray-900">Error: {error}</div>;
  }

  return (
    <div className="pt-40 py-8 min-h-screen bg-gray-50 text-gray-800 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Shopping Bag ({cart?.items?.length || 0})</h1>
  
        {!cart || !cart.items || cart.items.length === 0 ? (
          <div className="text-center text-gray-500 text-xl mt-10">Your cart is empty.</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-md">
                {/* Table Header */}
                <div className="hidden md:grid grid-cols-5 gap-4 text-gray-600 text-sm font-semibold border-b border-gray-300 pb-4 mb-4">
                  <div className="col-span-2">Product</div>
                  <div className="text-center">Price</div>
                  <div className="text-center">Quantity</div>
                  <div className="text-right">Total Price</div>
                </div>
  
                {/* Cart Items */}
                <div className="space-y-6">
                  {cart.items.map(item => (
                    <div key={item._id} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center border-b border-gray-200 pb-6 md:pb-0 md:border-b-0">
                      <div className="col-span-2 flex items-center gap-4">
                        {item.product.image && (
                          <img src={item.product.image} alt={item.product.name} className="w-24 h-24 object-cover rounded-md" />
                        )}
                        <div>
                          <h2 className="text-lg font-bold mb-1">{item.product.name}</h2>
                        </div>
                      </div>
                      <div className="md:hidden text-right text-base font-bold text-green-600">₹{item.product.price}</div>
                      <div className="hidden md:flex justify-center text-base font-bold text-green-600">₹{item.product.price}</div>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center space-x-2 bg-gray-100 border border-gray-300 rounded-full px-3 py-1">
                          <button onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)} className="text-gray-700">-</button>
                          <span className="text-gray-800 font-semibold">{item.quantity}</span>
                          <button onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)} className="text-gray-700">+</button>
                        </div>
                        <button onClick={() => handleRemoveItem(item._id)} className="text-gray-400 hover:text-red-500 transition p-2 rounded-full hover:bg-gray-100" title="Remove Item">
                          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      <div className="md:hidden text-right text-base font-bold text-green-600">₹{calculateItemTotal(item)}</div>
                      <div className="hidden md:flex justify-end text-base font-bold text-green-600">₹{calculateItemTotal(item)}</div>
                    </div>
                  ))}
                </div>
  
                {cart.items.length > 0 && (
                  <div className="mt-6 text-right">
                    <button onClick={handleClearCart} className="text-red-500 hover:text-red-400 transition">Clear Cart</button>
                  </div>
                )}
              </div>
            </div>
  
            {/* Order Summary */}
            <div className="lg:col-span-1 space-y-8">
              <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-md space-y-4">
                <h2 className="text-2xl font-bold border-b border-gray-200 pb-4">Cart Total</h2>
                <div className="flex justify-between text-xl font-bold">
                  <span>Subtotal:</span>
                  <span className="text-green-600">₹{calculateSubtotal()}</span>
                </div>
                <div className="flex justify-between text-lg text-gray-500">
                  <span>Shipping:</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-lg text-gray-500">
                  <span>Discount:</span>
                  <span>₹0.00</span>
                </div>
                <div className="flex justify-between text-xl font-bold border-t border-gray-300 pt-4">
                  <span>Order Total:</span>
                  <span className="text-green-600">₹{calculateSubtotal()}</span>
                </div>
                <button onClick={handleCheckout} className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-lg font-semibold mt-4">
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
  
      {/* Modal and Toast stays as-is */}
      <AddressModal isOpen={isModalOpen} onClose={handleCloseModal} onSaveAddress={handleSaveAddress} />
      <Toast message={toastMessage.text} type={toastMessage.type} />
    </div>
  );
  
}

export default Cart; 