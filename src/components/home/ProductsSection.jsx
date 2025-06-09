import { useRef } from 'react';
import { Link } from 'react-router-dom';

function ProductCard({ product }) {
  const originalPrice = (product.price / 0.75).toFixed(2);

  return (
    <div className="min-w-[250px] max-w-[250px] bg-white border border-gray-100 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 group overflow-hidden mx-2">
      {/* Image */}
      <div className="aspect-square bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4 relative">
        <img
          src={product.image || 'https://via.placeholder.com/300'}
          alt={product.name}
          className="max-w-[85%] max-h-[85%] object-contain group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 bg-pink-600 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-sm">
          -25%
        </div>
      </div>

      {/* Info */}
      <div className="p-4 space-y-2">
        <h3 className="text-gray-800 text-sm font-semibold capitalize line-clamp-1">{product.name}</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 line-through">₹{originalPrice}</span>
          <span className="text-pink-600 font-bold text-base">₹{product.price}</span>
        </div>
        <button className="w-full mt-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm py-2 rounded-xl font-medium hover:scale-[1.02] active:scale-95 transition">
          Add to Cart
        </button>
      </div>
    </div>
  );
}

function ProductsSection({ products }) {
  const scrollRef = useRef();

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: dir === 'left' ? -300 : 300,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="relative w-full py-20 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
        <div className="absolute top-[-5%] right-[-5%] w-[400px] h-[400px] bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-10%] left-[20%] w-[400px] h-[400px] bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Our Latest Products
          </h2>
          <p className="text-gray-600 text-lg max-w-xl mx-auto">
            Scroll through our hand-picked electronics.
          </p>
        </div>

        {/* Scroll Buttons */}
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={() => scroll('left')}
            className="absolute -left-10 top-1/2 -translate-y-1/2 z-10 bg-white shadow-xl border border-gray-200 p-3 rounded-full transition-all duration-300 hover:scale-110 hover:bg-gray-100 active:scale-95 hidden md:flex items-center justify-center"
          >
            <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Product List (Filtered for inStock) */}
          <div
            ref={scrollRef}
            className="flex overflow-x-auto scroll-smooth scrollbar-hide px-2"
          >
            {products.filter(p => p.inStock).map((product) => (
              <Link to={`/product/${product._id}`} key={product._id}>
                <ProductCard product={product} />
              </Link>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scroll('right')}
            className="absolute -right-16 top-1/2 -translate-y-1/2 z-10 bg-white shadow-xl border border-gray-200 p-3 rounded-full transition-all duration-300 hover:scale-110 hover:bg-gray-100 active:scale-95 hidden md:flex items-center justify-center"
          >
            <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

export default ProductsSection;
