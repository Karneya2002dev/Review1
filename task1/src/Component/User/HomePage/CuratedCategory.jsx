import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowDown } from "lucide-react";

export default function CuratedCategories() {
  const [categories, setCategories] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.log(err));
  }, []);

  const visibleCategories = showAll
    ? categories
    : categories.slice(0, 7);

  return (
    <div className="bg-gray-100 py-10 px-6">

      {/* Title */}
    

      {/* Horizontal Scroll */}
<div className="bg-gray-100 py-10 px-6">

  {/* Title */}
  <h2 className="text-4xl font-semibold text-center mb-10 font-poppins tracking-tight">
    Curated For You
  </h2>

  {/* Categories Grid */}
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-8 justify-items-center">

    {visibleCategories.map((cat) => (
      <div
        key={cat.id}
        className="flex flex-col items-center cursor-pointer group"
      >
        <div className="w-28 h-28 rounded-full overflow-hidden shadow-md border-4 border-white group-hover:scale-105 transition">
          <img
            src={`http://localhost:5000/uploads/${cat.image}`}
            alt={cat.name}
            className="w-full h-full object-cover"
          />
        </div>

        <p className="mt-3 text-sm text-center font-medium group-hover:text-green-600">
          {cat.name}
        </p>
      </div>
    ))}

    {/* Show More Button */}
    {categories.length > 7 && (
      <div
        onClick={() => setShowAll(!showAll)}
        className="flex flex-col items-center cursor-pointer group"
      >
        <div className="w-28 h-28 rounded-full border-2 border-green-600 flex items-center justify-center group-hover:bg-green-50 transition">

          <ArrowDown
            size={28}
            className={`text-green-600 transition ${
              showAll ? "rotate-180" : ""
            }`}
          />

        </div>

        <p className="mt-3 text-sm font-medium">
          {showAll ? "Show Less" : "Show More"}
        </p>
      </div>
    )}

  </div>
</div>
</div>
  );
}