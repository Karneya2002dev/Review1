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

export default function Header() {
  const [categories, setCategories] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Fetch categories
  useEffect(() => {
    axios.get("http://localhost:5000/api/categories")
      .then(res => setCategories(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-white shadow">

      {/* 🔝 Top Bar */}
      <div className="bg-green-600 text-white text-sm px-6 py-2 flex justify-between">

        <div className="flex items-center gap-6">
          <NavLink to="/" className="font-semibold hover:underline">
            HOME
          </NavLink>

          <div className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition">
            <MapPin size={16} />
            <span>
              Deliver to : <b>Anna Nagar - 625007</b>
            </span>
            <ChevronDown size={16} />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1 hover:opacity-80 transition">
            <Headphones size={16} />
            <span>Call: +91-7305393222</span>
          </div>

          <NavLink to="/login" className="hover:underline">
            Login
          </NavLink>
        </div>
      </div>

      {/* 🔽 Main Header */}
      <div className="bg-gray-100 px-6 py-4 flex items-center justify-between">

        {/* Left */}
        <div className="flex items-center gap-6 relative">

          {/* Logo */}
          <NavLink to="/">
            <img
              src={img1}
              alt="Logo"
              className="h-10 cursor-pointer hover:scale-105 transition"
            />
          </NavLink>

          {/* 🔥 Category Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <div className="flex items-center gap-1 cursor-pointer font-medium hover:text-green-600 transition">
              Shop by Category
              <ChevronDown
                size={16}
                className={`transition-transform duration-300 ${
                  showDropdown ? "rotate-180" : ""
                }`}
              />
            </div>

            {/* Dropdown */}
            <div
              className={`absolute top-10 left-0 bg-white shadow-xl rounded w-60 z-50 transition-all duration-300 ${
                showDropdown
                  ? "opacity-100 translate-y-0 visible"
                  : "opacity-0 -translate-y-2 invisible"
              }`}
            >
              {categories.length > 0 ? (
                categories.map(cat => (
                  <NavLink
                    key={cat.id}
                    to={`/category/${cat.id}`}
                    className="block px-4 py-3 hover:bg-green-50 hover:text-green-600 transition border-b last:border-none"
                  >
                    {cat.name}
                  </NavLink>
                ))
              ) : (
                <div className="p-3 text-sm text-gray-500">
                  No categories
                </div>
              )}
            </div>
          </div>

          {/* Menu */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              `relative font-medium transition ${
                isActive ? "text-green-600" : "hover:text-green-600"
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/deals"
            className="relative font-medium hover:text-green-600 transition"
          >
            Deals
          </NavLink>

          <NavLink
            to="/new-arrivals"
            className="relative font-medium hover:text-green-600 transition"
          >
            New Arrivals
          </NavLink>

        </div>

        {/* 🔍 Search */}
        <div className="flex items-center w-100 bg-gray-200 rounded-full overflow-hidden hover:shadow-md transition">

          <input
            type="text"
            placeholder="Search our products"
            className="flex-1 px-4 py-2 bg-transparent outline-none"
          />

          <button className="bg-gray-400 p-3 hover:bg-green-600 transition">
            <Search className="text-white" size={18} />
          </button>
        </div>

        {/* 🛒 Cart */}
        <NavLink
          to="/cart"
          className="relative hover:scale-110 transition"
        >
          <ShoppingCart size={24} />

          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 rounded-full">
            0
          </span>
        </NavLink>

      </div>
    </div>
  );
}