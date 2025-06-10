import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("https://backendsurajelectronic.onrender.com/api/products");
        const data = await res.json();
        setAllProducts(data);
      } catch (err) {
        console.error("Product fetch error", err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const results = allProducts.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(results);
  }, [searchTerm, allProducts]);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
    setSearchTerm("");
    setMobileMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-white shadow-md" : "bg-white/90 backdrop-blur-md"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-0">
        
        {/* Logo & Toggle */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <Link to="/">
            <img src="/icons/logo.png" alt="Logo" className="h-12 w-auto sm:h-16" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden"
          >
            <svg className="h-7 w-7 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:max-w-md">
          <div className="flex items-center bg-gray-100 px-4 py-2 rounded-full border border-gray-200 hover:border-gray-300 focus-within:border-blue-500 transition">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="bg-transparent outline-none flex-grow text-gray-700 text-sm"
            />
            <button className="ml-2 text-gray-500 hover:text-blue-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>

          {/* Search Suggestion Dropdown */}
          {searchTerm && filteredProducts.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-50 mt-1 max-h-80 overflow-y-auto">
             {filteredProducts.slice(0, 10).map((product) => (
  <div
    key={product._id}
    onClick={() => handleProductClick(product._id)}
    className="cursor-pointer px-4 py-2 hover:bg-gray-100 flex items-center gap-3 transition-all"
  >
    <img
      src={product.image || 'https://via.placeholder.com/40'}
      alt={product.name}
      className="w-10 h-10 object-contain rounded-md border"
    />
    <span className="text-sm text-gray-800">{product.name}</span>
  </div>
))}

            </div>
          )}
        </div>

        {/* Desktop Links */}
        <nav className="hidden lg:flex items-center space-x-6">
          <Link to="/products" className="nav-link">Products</Link>
          <Link to="/complaints" className="nav-link">Complaints</Link>

          {isLoggedIn && user?.isAdmin && (
            <>
              <Link to="/admin" className="nav-link">Dashboard</Link>
              <Link to="/admin/users" className="nav-link">Users</Link>
            </>
          )}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/cart">
            <img src="/icons/cart.png" alt="Cart" className="h-6 w-6" />
          </Link>

          {isLoggedIn ? (
          <div className="relative group">
          <img
            src="/icons/usericon.png"
            alt="User"
            className="h-9 w-9 rounded-full border cursor-pointer"
          />
          <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-200 shadow-xl rounded-xl p-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 opacity-0 translate-y-2 z-50">
            <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 transition">Profile</Link>
            <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 transition">Orders</Link>
            {user?.isAdmin && (
              <>
                <Link to="/admin/products" className="block px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 transition">Admin Products</Link>
                <Link to="/admin/orders" className="block px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 transition">Admin Orders</Link>
              </>
            )}
            <button
              onClick={logout}
              className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-md transition"
            >
              Sign Out
            </button>
          </div>
        </div>
        
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="bg-blue-600 text-white px-4 py-1 rounded-full hover:bg-blue-700 transition">Sign Up</Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-md px-4 py-4 space-y-4">
          <Link to="/products" className="block text-gray-700" onClick={() => setMobileMenuOpen(false)}>Products</Link>
          <Link to="/complaints" className="block text-gray-700" onClick={() => setMobileMenuOpen(false)}>Complaints</Link>
          

          {isLoggedIn && user?.isAdmin && (
            <>
              <Link to="/admin" className="block text-gray-700" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
              <Link to="/admin/users" className="block text-gray-700" onClick={() => setMobileMenuOpen(false)}>Users</Link>
            </>
          )}

          <Link to="/cart" className="block text-gray-700" onClick={() => setMobileMenuOpen(false)}>Cart</Link>

          {isLoggedIn ? (
            <>
              <Link to="/profile" className="block text-gray-700" onClick={() => setMobileMenuOpen(false)}>Profile</Link>
              <Link to="/orders" className="block text-gray-700" onClick={() => setMobileMenuOpen(false)}>Orders</Link>
              {user?.isAdmin && (
                <>
                  <Link to="/admin/products" className="block text-gray-700" onClick={() => setMobileMenuOpen(false)}>Admin Products</Link>
                  <Link to="/admin/orders" className="block text-gray-700" onClick={() => setMobileMenuOpen(false)}>Admin Orders</Link>
                </>
              )}
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="block text-red-500 w-full text-left"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="block text-gray-700" onClick={() => setMobileMenuOpen(false)}>Login</Link>
              <Link to="/register" className="block text-blue-600 font-semibold" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
