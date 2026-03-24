import {
  MapPin,
  ChevronDown,
  Search,
  ShoppingCart,
  Headphones,
  Menu, // New
  X    // New
} from "lucide-react";
import img1 from "../../../assets/logo.png";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useCart } from "./Context/CartContext";

export default function Header() {
  const { cartCount, setCartCount } = useCart();
  const [categories, setCategories] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Mobile menu state
  const [user, setUser] = useState(null);
  const [cartAnimate, setCartAnimate] = useState(false);

  // ... (Your existing useEffects for categories, user, and cart count remain the same)
  useEffect(() => {
    axios.get("http://localhost:5000/api/categories")
      .then(res => setCategories(res.data))
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    const name = localStorage.getItem("name");
    if (name) {
      setUser({ name });
      if (!sessionStorage.getItem("welcomeShown")) {
        toast.success(`Welcome ${name} 🎉`);
        sessionStorage.setItem("welcomeShown", "true");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setUser(null);
    toast.success("Logged out successfully 👋");
    setTimeout(() => { window.location.reload(); }, 1000);
  };
  useEffect(() => {
  const handleCartUpdate = () => {
    setCartAnimate(true);
    setTimeout(() => setCartAnimate(false), 300);
  };

  window.addEventListener("cartUpdated", handleCartUpdate);

  return () => {
    window.removeEventListener("cartUpdated", handleCartUpdate);
  };
}, []);

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-white shadow">
      
      {/* 🔝 Top Bar - Hidden on small mobile, scrollable on medium */}
      <div className="bg-green-600 text-white text-[10px] md:text-sm px-4 md:px-6 py-2 flex justify-between items-center overflow-x-auto whitespace-nowrap">
        <div className="flex items-center gap-4 md:gap-6">
          <NavLink to="/" className="font-semibold hover:underline">HOME</NavLink>
          <div className="flex items-center gap-1 cursor-pointer">
            <MapPin size={14} />
            <span className="hidden sm:inline">Deliver to : <b>Anna Nagar - 625007</b></span>
            <span className="sm:hidden"><b>625007</b></span>
            <ChevronDown size={14} />
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <div className="hidden md:flex items-center gap-1">
            <Headphones size={14} />
            <span>+91-7305393222</span>
          </div>

          {user ? (
            <div className="flex items-center gap-3">
              <span>Hi, <b>{user.name.split(' ')[0]}</b></span>
              <button onClick={handleLogout} className="hover:underline">Logout</button>
            </div>
          ) : (
            <div className="flex gap-3">
              <NavLink to="/login" className="hover:underline">Login</NavLink>
              <NavLink to="/signup" className="hover:underline">Signup</NavLink>
            </div>
          )}
        </div>
      </div>

      {/* 🔽 Main Header */}
      <div className="bg-gray-100 px-4 md:px-6 py-3 flex items-center justify-between gap-4">
        
        {/* LEFT: Logo & Hamburger */}
        <div className="flex items-center gap-4">
          <button 
            className="lg:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
          
          <NavLink to="/">
            <img src={img1} alt="Logo" className="h-8 md:h-10 hover:scale-105 transition" />
          </NavLink>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6">
             <div
                className="relative"
                onMouseEnter={() => setShowDropdown(true)}
                onMouseLeave={() => setShowDropdown(false)}
              >
                <div className="flex items-center gap-1 cursor-pointer font-medium hover:text-green-600">
                  Shop by Category
                  <ChevronDown size={16} className={showDropdown ? "rotate-180" : ""} />
                </div>
                {showDropdown && (
                  <div className="absolute top-full left-0 bg-white shadow-xl rounded w-60 z-50 py-2">
                    {categories.map(cat => (
                      <NavLink key={cat.id} to={`/category/${cat.id}`} className="block px-4 py-2 hover:bg-green-50">
                        {cat.name}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
              <NavLink to="/deals" className="hover:text-green-600 font-medium">Deals</NavLink>
              <NavLink to="/new-arrivals" className="hover:text-green-600 font-medium">New Arrivals</NavLink>
          </nav>
        </div>

        {/* CENTER: Search Bar - Hidden on small mobile, visible on tablet+ */}
        <div className="hidden md:flex items-center flex-1 max-w-md bg-white border border-gray-300 rounded-full overflow-hidden">
          <input
            type="text"
            placeholder="Search products..."
            className="flex-1 px-4 py-2 bg-transparent outline-none text-sm"
          />
          <button className="bg-green-600 p-2.5 hover:bg-green-700 transition">
            <Search className="text-white" size={18} />
          </button>
        </div>

        {/* RIGHT: Cart & Orders */}
        <div className="flex items-center gap-3 md:gap-6">
          {user && (
            <NavLink to="/orders" className="hidden sm:block text-sm font-medium hover:text-green-600">
              My Orders
            </NavLink>
          )}

        <NavLink to="/cart" className="relative group">
  
  <div className={`
    relative p-2 rounded-full transition-all duration-300
    ${cartAnimate ? "scale-125 bg-green-100" : "scale-100"}
    group-hover:bg-gray-100
  `}>
    
    {/* ✅ FIXED ICON */}
    <ShoppingCart 
      size={22} 
      className={`
        transition-all duration-300
        ${cartAnimate ? "text-green-600" : "text-gray-700"}
        group-hover:text-green-600
      `}
    />

    {/* ✅ BADGE */}
    {cartCount > 0 && (
      <span
        className={`
          absolute -top-1.5 -right-1.5 
          min-w-[18px] h-[18px] flex items-center justify-center
          text-[10px] font-bold text-white
          bg-red-500 rounded-full px-1
          shadow-md
          transition-all duration-300
          ${cartAnimate ? "animate-bounce scale-110" : "scale-100"}
        `}
      >
        {cartCount}
      </span>
    )}

  </div>
</NavLink>
        </div>
      </div>

      {/* 📱 Mobile Search Bar (Only visible on small screens) */}
      <div className="md:hidden px-4 pb-3 bg-gray-100">
        <div className="flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden">
          <input
            type="text"
            placeholder="Search products..."
            className="flex-1 px-3 py-2 text-sm outline-none"
          />
          <div className="p-2 text-gray-500">
            <Search size={18} />
          </div>
        </div>
      </div>

      {/* 📱 Mobile Slide-out Menu */}
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity lg:hidden ${isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`} onClick={() => setIsMenuOpen(false)}>
        <div 
          className={`bg-white w-3/4 max-w-sm h-full p-6 transform transition-transform ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-green-600">Menu</h2>
            <X size={24} onClick={() => setIsMenuOpen(false)} />
          </div>
          
          <nav className="flex flex-col gap-4">
            <NavLink to="/" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium border-b pb-2">Home</NavLink>
            <div className="py-2">
              <p className="text-gray-500 text-sm mb-2">Categories</p>
              <div className="grid grid-cols-1 gap-2 pl-4">
                {categories.map(cat => (
                  <NavLink key={cat.id} to={`/category/${cat.id}`} onClick={() => setIsMenuOpen(false)} className="text-base text-gray-700">
                    {cat.name}
                  </NavLink>
                ))}
              </div>
            </div>
            <NavLink to="/deals" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium border-b pb-2">Deals</NavLink>
            <NavLink to="/new-arrivals" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium border-b pb-2">New Arrivals</NavLink>
            {user && (
              <NavLink to="/orders" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium border-b pb-2">My Orders</NavLink>
            )}
          </nav>
        </div>
      </div>

    </div>
  );
}