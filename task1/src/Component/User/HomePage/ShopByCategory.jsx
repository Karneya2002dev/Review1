import { useEffect, useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";

export default function ShopByCategory() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="bg-[#f3f5f4]">

      {/* Title */}
       <h2 className="text-4xl font-semibold text-center mb-10 font-poppins tracking-tight">
    Shop By Category
  </h2>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">

        {categories.map((cat) => (
          <NavLink
            key={cat.id}
            to={`/category/${cat.id}`}
            className="bg-white rounded-xl p-4 shadow-sm hover:shadow-lg transition group"
          >

            {/* Image */}
            <div className="w-full h-32 rounded-lg overflow-hidden mb-3">
              <img
                src={`http://localhost:5000/uploads/${cat.image}`}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition"
              />
            </div>

            {/* Name */}
            <p className="text-center text-sm font-medium group-hover:text-green-600">
              {cat.name}
            </p>

          </NavLink>
        ))}

      </div>
    </div>
  );
}