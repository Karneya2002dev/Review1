import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowDown } from "lucide-react";
import banner1 from "../../../assets/brand.jpg";

import { MessageCircle } from "lucide-react";


export default function BrandBanner() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.log(err));
  }, []);



  return (
    <div className="bg-gray-100">

      {/* 🔥 Top Banner */}
      <div className="px-6">
        <div className="overflow-hidden shadow-md">
          <img
            src={banner1}
            alt="Main Banner"
            className="w-full h-75 object-cover"
          />
        </div>
      </div>

      {/* 🔥 Offer Banner */}
   

      {/* 💬 WhatsApp Floating Button */}
     

    </div>
  );
}
  
