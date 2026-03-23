import {
  MapPin,
  ChevronDown,
  Search,
  ShoppingCart,
  Headphones
} from "lucide-react";
import img1 from "../../../assets/logo.png";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function Header() {
  const [categories, setCategories] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [cartAnimate, setCartAnimate] = useState(false);

  // ✅ FETCH CATEGORIES
  useEffect(() => {
    axios.get("http://localhost:5000/api/categories")
      .then(res => setCategories(res.data))
      .catch(err => console.log(err));
  }, []);

  // ✅ GET USER
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

  // ✅ FETCH CART COUNT
  const fetchCartCount = async () => {
    try {
      const user_id = localStorage.getItem("user_id");
      if (!user_id) return;

      const res = await axios.get(
        `http://localhost:5000/api/cart/count/${user_id}`
      );

      setCartCount(res.data.count || 0);

      // 🔥 trigger animation
      setCartAnimate(true);
      setTimeout(() => setCartAnimate(false), 300);

    } catch (err) {
      console.log(err);
    }
  };

  // ✅ LOAD COUNT ON PAGE LOAD
  useEffect(() => {
    fetchCartCount();
  }, []);

  // ✅ LISTEN FOR CART UPDATES (REAL-TIME)
  useEffect(() => {
    const handleCartUpdate = () => {
      fetchCartCount();
    };

    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  // ✅ LOGOUT
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setUser(null);
    toast.success("Logged out successfully 👋");

    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-white shadow">

      {/* 🔝 Top Bar */}
      <div className="bg-green-600 text-white text-sm px-6 py-2 flex justify-between">
        <div className="flex items-center gap-6">
          <NavLink to="/" className="font-semibold hover:underline">
            HOME
          </NavLink>

          <div className="flex items-center gap-1 cursor-pointer">
            <MapPin size={16} />
            <span>
              Deliver to : <b>Anna Nagar - 625007</b>
            </span>
            <ChevronDown size={16} />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1">
            <Headphones size={16} />
            <span>Call: +91-7305393222</span>
          </div>

          {user ? (
            <div className="flex items-center gap-3">
              <span>
                Welcome, <b>{user.name}</b>
              </span>

              <button onClick={handleLogout} className="hover:underline">
                Logout
              </button>
            </div>
          ) : (
            <>
              <NavLink to="/login" className="hover:underline">
                Login
              </NavLink>
              <NavLink to="/signup" className="hover:underline">
                Signup
              </NavLink>
            </>
          )}
        </div>
      </div>

      {/* 🔽 Main Header */}
      <div className="bg-gray-100 px-6 py-4 flex items-center justify-between">

        {/* LEFT */}
        <div className="flex items-center gap-6 relative">

          <NavLink to="/">
            <img src={img1} alt="Logo" className="h-10 hover:scale-105 transition" />
          </NavLink>

          {/* CATEGORY */}
          <div
            className="relative"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <div className="flex items-center gap-1 cursor-pointer font-medium hover:text-green-600">
              Shop by Category
              <ChevronDown size={16} className={showDropdown ? "rotate-180" : ""} />
            </div>

            <div className={`absolute top-10 left-0 bg-white shadow-xl rounded w-60 z-50 ${
              showDropdown ? "block" : "hidden"
            }`}>
              {categories.map(cat => (
                <NavLink
                  key={cat.id}
                  to={`/category/${cat.id}`}
                  className="block px-4 py-3 hover:bg-green-50"
                >
                  {cat.name}
                </NavLink>
              ))}
            </div>
          </div>

          <NavLink to="/" className="hover:text-green-600">Home</NavLink>
          <NavLink to="/deals" className="hover:text-green-600">Deals</NavLink>
          <NavLink to="/new-arrivals" className="hover:text-green-600">New Arrivals</NavLink>
        </div>

        {/* SEARCH */}
        <div className="flex items-center w-100 bg-gray-200 rounded-full overflow-hidden">
          <input
            type="text"
            placeholder="Search our products"
            className="flex-1 px-4 py-2 bg-transparent outline-none"
          />
          <button className="bg-gray-400 p-3 hover:bg-green-600">
            <Search className="text-white" size={18} />
          </button>
        </div>

        {/* 🛒 CART */}
        {/* 🛒 CART + ORDERS */}
<div className="flex items-center gap-6">

  {/* MY ORDERS */}
  {user && (
    <NavLink
      to="/orders"
      className="text-sm font-medium hover:text-green-600 transition flex items-center gap-1"
    >
      My Orders
    </NavLink>
  )}

  {/* 🛒 CART (UNCHANGED - with animations preserved) */}
  <NavLink
    to="/cart"
    className={`relative transition ${
      cartAnimate ? "scale-125" : "scale-100"
    }`}
  >
    <ShoppingCart id="cart-icon" size={24} />

    <span
      className={`absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 rounded-full transition ${
        cartAnimate ? "animate-bounce" : ""
      }`}
    >
      {cartCount}
    </span>
  </NavLink>

</div>
      </div>
    </div>
  );
}