// components/Sidebar.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserSidebar = ({ setActive }) => {
  const [categories, setCategories] = useState([]);
  const [stack, setStack] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("Error fetching categories", err);
      }
    };

    fetchCategories();
  }, []);

  // Current level
  const currentLevel =
    stack.length === 0
      ? categories
      : stack[stack.length - 1].subCategories || [];

  // 🔥 Handle Click
  const handleClick = (item) => {
    if (item.subCategories && item.subCategories.length > 0) {
      // go deeper
      setStack([...stack, item]);
    } else {
      // FINAL LEVEL → Navigate
      const parent = stack[0]?.name || item.name;
      const sub = item.name;

      setActive(sub);

      navigate(
        `/products?category=${encodeURIComponent(
          parent
        )}&sub=${encodeURIComponent(sub)}`
      );

      // optional: reset stack after selection
      setStack([]);
    }
  };

  // 🔙 Back
  const handleBack = () => {
    setStack((prev) => prev.slice(0, -1));
  };

  // 🧠 Navigate when clicking top-level category (without subcategories)
  const handleTopLevelClick = (item) => {
    if (!item.subCategories || item.subCategories.length === 0) {
      setActive(item.name);

      navigate(
        `/products?category=${encodeURIComponent(item.name)}`
      );
    } else {
      setStack([item]);
    }
  };

  return (
    <div className="w-[260px] bg-[#eef3ef] p-4 rounded-xl">
      <h2 className="text-lg font-semibold mb-3">Categories</h2>

      <div className="bg-white rounded-lg border overflow-hidden">
        
        {/* Header */}
        <div className="bg-green-600 text-white px-4 py-3 flex items-center gap-2">
          {stack.length > 0 && (
            <button onClick={handleBack} className="font-bold">
              ←
            </button>
          )}
          <span>
            {stack.length === 0
              ? "All Categories"
              : stack[stack.length - 1].name}
          </span>
        </div>

        {/* List */}
        <div className="p-2">
          {currentLevel.map((item) => (
            <div
              key={item._id}
              onClick={() =>
                stack.length === 0
                  ? handleTopLevelClick(item)
                  : handleClick(item)
              }
              className="flex justify-between items-center px-3 py-2 rounded-md cursor-pointer hover:bg-gray-100"
            >
              <span>{item.name}</span>
              {item.subCategories?.length > 0 && <span>›</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserSidebar;