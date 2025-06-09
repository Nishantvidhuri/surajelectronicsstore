import { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';
import HeroSection from '../components/home/HeroSection';
import ProductsSection from '../components/home/ProductsSection';
import StatsSection from '../components/home/StatsSection';
import ReviewsSection from '../components/home/ReviewsSection';
import MapSection from '../components/home/MapSection';
import ContactSection from '../components/home/ContactSection';

function Home() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleBuyNow = async (productId) => {
    if (!isLoggedIn) {
      setToastMessage('Please log in to add items to your cart.');
      setToastType('error');
      setShowToast(true);
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add item to cart.');
      }

      setToastMessage('Item added to cart! Redirecting...');
      setToastType('success');
      setShowToast(true);
      setTimeout(() => navigate('/cart'), 1500);
    } catch (err) {
      console.error('Error adding to cart:', err);
      setToastMessage(err.message || 'Failed to add item to cart.');
      setToastType('error');
      setShowToast(true);
    }
  };

  const ProductCard = ({ product }) => {
    const originalPrice = (product.price / 0.75).toFixed(2);

    return (
      <div className="w-full max-w-xs bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 group relative">
        {/* Product Image */}
        <div className="aspect-square bg-gradient-to-br from-gray-100 to-white flex items-center justify-center p-4">
          <img
            src={product.image || 'https://via.placeholder.com/300'}
            alt={product.name}
            className="max-w-[85%] max-h-[85%] object-contain group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Discount Badge */}
        <div className="absolute top-3 left-3 bg-pink-600 text-white text-[11px] font-semibold px-3 py-1 rounded-full shadow-md z-10">
          -25%
        </div>

        {/* Info Section */}
        <div className="bg-white p-4 flex flex-col gap-2">
          <h3 className="text-gray-800 text-lg font-semibold capitalize">{product.name}</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400 line-through">₹{originalPrice}</span>
            <span className="text-pink-600 font-bold text-lg">₹{product.price}</span>
          </div>
          <button
            onClick={() => handleBuyNow(product._id)}
            className="mt-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:scale-105 active:scale-100 transition-all duration-200"
          >
            Add to Cart
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="pt-20 flex justify-center items-center min-h-screen bg-gray-50 text-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-20 flex justify-center items-center text-red-500 min-h-screen bg-gray-50">
        Error: {error}
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white text-gray-800">
      <HeroSection />
      <ProductsSection
        products={products.filter(p => p.inStock)}
        onBuyNow={handleBuyNow}
        CardComponent={ProductCard}
      />
      <StatsSection />
      <ReviewsSection />
      <MapSection />
      <ContactSection />
      <Toast
        message={toastMessage}
        type={toastType}
        show={showToast}
        onClose={() => setShowToast(false)}
      />
    </main>
  );
}

export default Home;
