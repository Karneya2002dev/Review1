import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowDown } from "lucide-react";
import banner1 from "../../../assets/banner1.png";
import banner2 from "../../../assets/banner2.jpeg";
import { MessageCircle } from "lucide-react";


export default function CuratedCategories() {
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
      <div className="px-6 mt-3">
        <div className="rounded-xl overflow-hidden shadow-md">
          <img
            src={banner2}
            alt="Offer Banner"
            className="w-full h-30 object-cover"
          />
        </div>
      </div>

      {/* 💬 WhatsApp Floating Button */}
      <div className="fixed bottom-6 right-6 flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-lg border">
        <span className="text-sm font-medium">Click to chat</span>

        <div className="bg-green-500 p-2 rounded-full">
          <MessageCircle className="text-white" size={18} />
        </div>
      </div>

    </div>
  );
}
  
