import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FaTools, FaCheckCircle, FaShieldAlt, FaPlug, FaTags, FaThumbsUp } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(0);
  const [cartItemId, setCartItemId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`https://backendsurajelectronic.onrender.com/api/products/${id}`);
        const data = await res.json();
        setProduct(data);

        const allRes = await fetch('https://backendsurajelectronic.onrender.com/api/products');
        const all = await allRes.json();
        const related = all.filter(p => p.category === data.category && p._id !== data._id);
        setRelatedProducts(related.slice(0, 4));

        const token = localStorage.getItem('token');
        if (token) {
          const cartRes = await fetch('https://backendsurajelectronic.onrender.com/api/cart', {
            headers: { 'Authorization': `Bearer ${token}` },
          });
          if (cartRes.ok) {
            const cartData = await cartRes.json();
            const cartItem = cartData.items.find(item => item.product._id === data._id);
            if (cartItem) {
              setQuantity(cartItem.quantity);
              setCartItemId(cartItem._id);
            }
          }
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isLoggedIn) return navigate('/login');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://backendsurajelectronic.onrender.com/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: product._id, quantity: 1 }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error('Add to cart failed');
      const cartItem = result.items.find(item => item.product._id === product._id);
      if (cartItem) {
        setQuantity(cartItem.quantity);
        setCartItemId(cartItem._id);
      }
    } catch (err) {
      console.error('Add to cart error:', err);
    }
  };

  const updateCartQuantity = async (newQty) => {
    if (!isLoggedIn) return;
    try {
      const token = localStorage.getItem('token');
      if (newQty < 1 && cartItemId) {
        const res = await fetch(`https://backendsurajelectronic.onrender.com/api/cart/${cartItemId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Delete failed');
        setQuantity(0);
        setCartItemId(null);
        return;
      }

      const res = await fetch(`https://backendsurajelectronic.onrender.com/api/cart/${cartItemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: newQty }),
      });
      if (!res.ok) throw new Error('Update failed');
      setQuantity(newQty);
    } catch (err) {
      console.error('Update quantity error:', err);
    }
  };

  if (loading) return <div className="pt-36 text-center text-gray-500">Loading...</div>;
  if (!product) return <div className="pt-36 text-center text-red-500">Product not found</div>;

  return (
    <div className="pt-36 pb-20 bg-gradient-to-b from-slate-50 via-white to-slate-100 min-h-screen px-4 sm:px-10">
      <div className="bg-white shadow-xl rounded-3xl p-8 max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="flex flex-col items-center justify-center">
          <img
            src={product.image}
            alt={product.name}
            className="w-full max-w-md h-[350px] object-contain bg-white border rounded-2xl shadow-lg"
          />
          <p className="text-xs text-gray-400 mt-2">*Product images are for reference only</p>
        </div>

        {/* Product Details */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-1">{product.name}</h1>
            <p className="text-sm text-gray-500 mb-4">{product.category}</p>

            <div className="flex items-center gap-4 mb-4">
              <span className="text-3xl font-bold text-blue-600">₹{product.price}</span>
              <span className={`text-xs font-medium px-3 py-1 rounded-full ${product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            <p className="text-sm text-gray-700 leading-relaxed mb-6">
              {product.description || 'No description available.'}
            </p>
          </div>

          {/* Quantity Control + Buy Now */}
          <div className="mb-6 flex items-center gap-4">
            {quantity > 0 ? (
              <div className="flex items-center border rounded-full px-3 py-1 shadow-inner bg-gray-50">
                <button onClick={() => updateCartQuantity(quantity - 1)} className="px-2 text-xl text-gray-600 hover:text-black">−</button>
                <span className="px-4">{quantity}</span>
                <button onClick={() => updateCartQuantity(quantity + 1)} className="px-2 text-xl text-gray-600 hover:text-black">+</button>
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-full shadow transition-all"
              >
                Add to Cart
              </button>
            )}

            <button
              onClick={() => navigate('/cart')}
              className="bg-indigo-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-indigo-700 transition"
            >
              Buy Now
            </button>
          </div>

          {/* Feature Icons */}
          <div className="mt-10">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Why Customers Love It</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[
                { icon: <FaTools className="text-blue-500 text-2xl" />, title: "Strong Build", desc: "Built for daily rough use" },
                { icon: <FaCheckCircle className="text-green-500 text-2xl" />, title: "Perfect Fit", desc: "Secure & compatible installation" },
                { icon: <FaShieldAlt className="text-purple-500 text-2xl" />, title: "Durable Design", desc: "Made to last long" },
                { icon: <FaPlug className="text-yellow-400 text-2xl" />, title: "Efficient", desc: "Reliable, lag-free usage" },
                { icon: <FaTags className="text-red-500 text-2xl" />, title: "Best Price", desc: "Genuine product, affordable rate" },
                { icon: <FaThumbsUp className="text-indigo-500 text-2xl" />, title: "Trusted", desc: "Most loved by our customers" }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-white shadow-md p-5 rounded-xl hover:shadow-lg transition-all">
                  <div className="shrink-0">{item.icon}</div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800">{item.title}</h4>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="max-w-7xl mx-auto mt-20">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Recommended for You</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((item) => (
              <div key={item._id} className="bg-white rounded-2xl border shadow hover:shadow-md p-4 transition-all flex flex-col">
                <img src={item.image} alt={item.name} className="w-full h-36 object-contain mb-3" />
                <h3 className="text-base font-semibold text-gray-800 truncate">{item.name}</h3>
                <p className="text-xs text-gray-500 mb-1">{item.category}</p>
                <p className="text-sm text-blue-600 font-bold mb-3">₹{item.price}</p>
                <button onClick={() => navigate(`/product/${item._id}`)} className="mt-auto w-full bg-gray-900 hover:bg-gray-800 text-white text-sm py-2 rounded-lg">
                  View Product
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
