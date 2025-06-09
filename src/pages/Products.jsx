import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

function Products() {
  const { isLoggedIn } = useAuth();
  const [products, setProducts] = useState([]);
  const [userCart, setUserCart] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message || 'Failed to load products.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchCart = async () => {
      if (!isLoggedIn) return setUserCart({});
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/cart', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) {
          if (response.status === 404) return setUserCart({});
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const cartMap = data.items.reduce((acc, item) => {
          acc[item.product._id] = item;
          return acc;
        }, {});
        setUserCart(cartMap);
      } catch (err) {
        console.error('Cart fetch error:', err);
      }
    };
    fetchCart();
  }, [isLoggedIn]);

  const findItemInCart = (id) => userCart[id];

  const handleAddToCart = async (product) => {
    if (!isLoggedIn) return;
    setUserCart(prev => ({ ...prev, [product._id]: { _id: 'temp', product, quantity: 1 } }));
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId: product._id, quantity: 1 })
      });
      if (!response.ok) throw new Error(await response.json());
      const cartData = await response.json();
      const item = cartData.items.find(i => i.product._id === product._id);
      if (item) setUserCart(prev => ({ ...prev, [product._id]: item }));
    } catch (err) {
      console.error(err);
      setUserCart(prev => { const clone = { ...prev }; delete clone[product._id]; return clone; });
    }
  };

  const handleBuyNow = async (product) => {
    const item = findItemInCart(product._id);
    if (!item) await handleAddToCart(product);
    navigate('/cart');
  };

  const handleUpdateQuantity = async (item, quantity) => {
    if (quantity < 1) return handleRemoveItem(item.product._id);
    setUserCart(prev => ({ ...prev, [item.product._id]: { ...item, quantity } }));
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/cart/${item._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ quantity }),
      });
      if (!res.ok) throw new Error('Update failed');
    } catch (err) {
      console.error('Qty update error', err);
    }
  };

  const handleRemoveItem = async (productId) => {
    const item = userCart[productId];
    if (!item) return;
    setUserCart(prev => { const clone = { ...prev }; delete clone[productId]; return clone; });
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/cart/${item._id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Delete failed');
    } catch (err) {
      console.error('Delete error', err);
    }
  };

  const filteredProducts = products
    .filter(product => selectedCategory ? product.category === selectedCategory : true)
    .sort((a, b) => {
      if (sortOrder === 'lowToHigh') return a.price - b.price;
      if (sortOrder === 'highToLow') return b.price - a.price;
      return 0;
    });

  if (loading) {
    return (
      <div className="pt-20 flex justify-center items-center min-h-screen bg-white text-gray-700">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-20 text-red-500 min-h-screen bg-white flex justify-center items-center">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="pt-36 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-blue-50 to-purple-50 min-h-screen text-gray-800">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12">Explore Our Products</h1>

        {/* Filter + Sort UI */}
        {/* Filter + Sort UI */}
<div className="mb-12 grid gap-4 sm:flex sm:items-center sm:justify-between">
  {/* Category Filter */}
  <div className="w-full sm:w-auto">
    <label className="block text-sm font-medium text-gray-600 mb-1">Category</label>
    <select
      value={selectedCategory}
      onChange={(e) => setSelectedCategory(e.target.value)}
      className="bg-white border border-gray-300 rounded-lg pr-10 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
    >
      <option value="">All</option>
      <option value="Remotes">Remotes</option>
      <option value="Wires">Wires</option>
      <option value="Stands">Stands</option>
      <option value="Adapters">Adapters</option>
    </select>
  </div>

  {/* Sort Filter */}
  <div className="w-full sm:w-auto pr-10">
    <label className="block text-sm font-medium text-gray-600 mb-1">Sort By</label>
    <select
      value={sortOrder}
      onChange={(e) => setSortOrder(e.target.value)}
      className="bg-white border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
    >
      <option value="">Default</option>
      <option value="lowToHigh">Price: Low to High</option>
      <option value="highToLow">Price: High to Low</option>
    </select>
  </div>
</div>


        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center text-gray-400 text-lg">No products found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map(product => {
              const inCart = findItemInCart(product._id);
              return (
                <div
  key={product._id}
  className={`bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-xl transition hover:scale-[1.02] p-4 flex flex-col ${!product.inStock && 'opacity-50'}`}
>
  {/* Clickable top part */}
  <div
    onClick={() => navigate(`/product/${product._id}`)}
    className="cursor-pointer"
  >
    <div className="relative">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-52 object-contain bg-gray-50 rounded-xl shadow-sm"
      />
    </div>
    <div className="p-3 flex flex-col">
      <p className="text-sm text-gray-500 mb-1">{product.category}</p>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold truncate">{product.name}</h2>
        <span className="text-blue-600 font-bold">₹{product.price.toFixed(2)}</span>
      </div>
      <p className="text-sm mb-2">
        {product.inStock ? (
          <span className="text-green-500">In Stock</span>
        ) : (
          <span className="text-red-500">Out of Stock</span>
        )}
      </p>
    </div>
  </div>

  {/* Non-clickable action buttons */}
  <div className="mt-auto space-y-2 px-3">
    {product.inStock && (
      findItemInCart(product._id) ? (
        <div className="flex justify-between items-center bg-gray-100 rounded-full px-4 py-2">
          <button onClick={() => handleUpdateQuantity(findItemInCart(product._id), findItemInCart(product._id).quantity - 1)} className="text-gray-700">−</button>
          <span className="text-gray-800 font-semibold">{findItemInCart(product._id).quantity}</span>
          <button onClick={() => handleUpdateQuantity(findItemInCart(product._id), findItemInCart(product._id).quantity + 1)} className="text-gray-700">+</button>
        </div>
      ) : (
        <button
          onClick={() => handleAddToCart(product)}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold py-2 rounded-xl shadow-md hover:shadow-lg transition"
        >
          Add to Cart
        </button>
      )
    )}

    {product.inStock && (
      <button
        onClick={() => handleBuyNow(product)}
        className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-2 rounded-xl shadow-md hover:shadow-lg transition"
      >
        Buy Now
      </button>
    )}
  </div>
</div>

              
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;
