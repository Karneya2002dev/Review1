import React, { useState, useEffect } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react"; // For a cleaner look

const UserSidebar = ({ setActiveCategory, setActiveSubCategory }) => {
  const [categories, setCategories] = useState([]);
  const [stack, setStack] = useState([]);
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error(err));
  }, []);

  const currentLevel =
    stack.length === 0
      ? categories
      : stack[stack.length - 1].subCategories || [];

  const handleClick = (item) => {
    if (item.subCategories && item.subCategories.length > 0) {
      setStack([...stack, item]);
    } else {
      setActiveCategory(stack[0]?.id || item.category_id || item.id);
      setActiveSubCategory(item.id);
      setActiveId(item.id);
    }
  };

  const handleTopLevelClick = (item) => {
    if (!item.subCategories || item.subCategories.length === 0) {
      setActiveCategory(item.id);
      setActiveSubCategory(null);
      setActiveId(item.id);
    } else {
      setStack([item]);
      setActiveId(item.id);
    }
  };

  const handleBack = (e) => {
    e.stopPropagation(); // Prevent trigger parent click
    setStack((prev) => prev.slice(0, -1));
  };

  return (
    /* Responsive Container: 
       - w-full on mobile, fixed w-64/72 on desktop 
       - Adjusts margins/padding for different screen sizes
    */
    <div className="w-full lg:w-72 bg-[#eef3ef] p-3 md:p-4 lg:rounded-xl">
      <h2 className="text-base md:text-lg font-bold mb-3 text-gray-800 px-1">
        Categories
      </h2>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        
        {/* HEADER: Dynamic height for touch targets */}
        <div className="bg-green-600 text-white px-4 py-3 md:py-4 flex items-center gap-3">
          {stack.length > 0 && (
            <button 
              onClick={handleBack}
              className="hover:bg-green-700 p-1 rounded-full transition-colors"
              aria-label="Go back"
            >
              <ChevronLeft size={20} />
            </button>
          )}
          <span className="font-medium text-sm md:text-base truncate">
            {stack.length === 0
              ? "All Categories"
              : stack[stack.length - 1].name}
          </span>
        </div>

        {/* LIST: Uses a scroll area for long lists on mobile */}
        <div className="p-1 md:p-2 max-h-[60vh] lg:max-h-none overflow-y-auto">
          {currentLevel.length > 0 ? (
            currentLevel.map((item) => {
              const isActive = activeId === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() =>
                    stack.length === 0
                      ? handleTopLevelClick(item)
                      : handleClick(item)
                  }
                  className={`px-3 py-3 md:py-2.5 my-1 rounded-md cursor-pointer flex justify-between items-center transition-all
                    ${isActive 
                      ? "bg-green-100 text-green-700 font-semibold border-l-4 border-green-600" 
                      : "hover:bg-gray-100 text-gray-600 active:bg-gray-200"}
                  `}
                >
                  <span className="text-sm md:text-base">{item.name}</span>
                  {item.subCategories?.length > 0 && (
                    <ChevronRight size={16} className={isActive ? "text-green-600" : "text-gray-400"} />
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-4 text-center text-gray-400 text-sm italic">
              No categories found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSidebar;