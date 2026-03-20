import React from 'react';
import { Phone, Mail, ArrowUp } from 'lucide-react';
import imagee from "../../../assets/footer.png";

const Footer = () => {
  const categories = [
    "Fruits & Vegetables", "Staples", "Snacks & Namkeens", "Beverages", 
    "Chilled & Dairy Foods", "Ready To Cook", "Ready To Eat", "Baby Care", 
    "Household Essentials", "Cleaning Needs", "Feminine Care", "Health Care", 
    "Personal Care", "Stationaries", "Skin Care", "Oral Care", 
    "Men's Grooming", "Creams & Lotions", "Crockeries"
  ];

  return (
    <footer className="bg-white text-gray-800 py-10 px-6 md:px-16 border-t border-gray-100 font-sans relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Column 1: Logo & Address */}
        {/* Column 1: Logo & Address */}
<div className="space-y-4">
  <div className="mb-4">
    {/* Using the actual brand logo image */}
    <img 
      src={imagee}
      alt="Pothys Mart Logo" 
      className="h-16 w-auto object-contain"
    />
  </div>
  
  <p className="text-sm leading-relaxed text-gray-700">
    407/7, G.S.T Road, Zamin Pallavaram,<br />
    Chromepet,<br />
    Chengalpattu,<br />
    Tamil Nadu - 600044
  </p>
  
  <div className="flex flex-wrap gap-x-2 gap-y-1 text-[11px] text-gray-500 pt-2 border-t border-gray-100 mt-2">
    <span className="cursor-pointer hover:underline">Privacy Policy</span> | 
    <span className="cursor-pointer hover:underline">Refund Policy</span> | 
    <span className="cursor-pointer hover:underline">Shipping Policy</span> | 
    <span className="cursor-pointer hover:underline">Terms and Condition</span>
  </div>
  
  <p className="text-[11px] text-gray-400 mt-4">
    Copyright © 2026 Pothys Mart. All Right Reserved
  </p>
</div>
        {/* Column 2: Need Help */}
        <div>
          <h3 className="font-bold text-lg mb-4">Need Help</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="text-green-600 border-2 border-green-600 rounded-lg p-1">
                <Phone size={20} />
              </div>
              <span className="font-semibold text-gray-800">7305393222 / 04443666333</span>
            </div>
            <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
              <Mail size={20} className="text-gray-700" />
              <span className="text-sm text-gray-700">supermarket.chr@pothys.com</span>
            </div>
          </div>
        </div>

        {/* Column 3: Categories */}
        <div className="md:col-span-2">
          <h3 className="font-bold text-lg mb-4">Categories</h3>
          <div className="text-sm text-gray-600 leading-7">
            {categories.map((cat, index) => (
              <span key={index}>
                <a href="#" className="hover:text-green-600">{cat}</a>
                {index !== categories.length - 1 && <span className="mx-2 text-gray-300">|</span>}
              </span>
            ))}
          </div>

          <div className="mt-8">
            <h3 className="font-bold text-lg mb-2">Links</h3>
            <div className="flex gap-4 text-sm font-medium">
              <a href="#" className="hover:text-green-600">Home</a>
              <a href="#" className="hover:text-green-600">Deals</a>
              <a href="#" className="hover:text-green-600">New Arrivals</a>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="font-bold text-lg mb-4">Download Our App</h3>
            <div className="flex gap-3">
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="h-10 cursor-pointer" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" className="h-10 cursor-pointer" />
            </div>
          </div>
        </div>
      </div>

      {/* Floating Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-4 items-end">
        <button className="bg-white border shadow-lg rounded-full px-4 py-2 flex items-center gap-2 hover:bg-gray-50 transition">
          <span className="text-sm font-medium">Click to chat</span>
          <div className="bg-green-500 p-1 rounded-full text-white">
            <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" className="w-6 h-6" alt="WA" />
          </div>
        </button>
        <button className="bg-white border-2 border-green-600 text-green-600 rounded-full p-2 hover:bg-green-50 transition">
          <ArrowUp size={24} />
        </button>
      </div>
    </footer>
  );
};

export default Footer;