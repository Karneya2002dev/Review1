import React from "react";
import { useParams, Link } from "react-router-dom";
import { Check, ShoppingBag, ArrowRight, Package, Truck } from "lucide-react";

const OrderSuccess = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-[#F0F7F4] flex items-center justify-center px-4">
      {/* Custom Animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scaleIn {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes drawCheck {
          to { stroke-dashoffset: 0; }
        }
        @keyframes fadeInUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-scale-in { animation: scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fade-up { opacity: 0; animation: fadeInUp 0.6s ease-out forwards; }
        .delay-1 { animation-delay: 0.2s; }
        .delay-2 { animation-delay: 0.4s; }
        .delay-3 { animation-delay: 0.6s; }
      `}} />

      <div className="max-w-md w-full text-center">
        {/* SUCCESS ICON CIRCLE */}
        <div className="relative mb-8 flex justify-center">
          <div className="absolute inset-0 bg-emerald-200 rounded-full blur-2xl opacity-30 animate-pulse"></div>
          <div className="relative w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl shadow-emerald-200/50 animate-scale-in border border-emerald-50">
            <svg 
              className="w-12 h-12 text-emerald-500" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth="3"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M5 13l4 4L19 7" 
                style={{ 
                  strokeDasharray: 50, 
                  strokeDashoffset: 50, 
                  animation: 'drawCheck 0.5s ease-in-out 0.5s forwards' 
                }}
              />
            </svg>
          </div>
        </div>

        {/* MAIN CONTENT CARD */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-emerald-100 animate-fade-up delay-1">
          <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">
            Order Confirmed!
          </h1>
          <p className="text-emerald-600 font-bold text-sm uppercase tracking-widest mb-6">
            Thank you for your purchase
          </p>
          
          <div className="bg-emerald-50/50 rounded-2xl p-4 mb-8 inline-block w-full border border-emerald-100">
            <p className="text-slate-500 text-xs font-semibold uppercase">Order ID</p>
            <p className="text-slate-900 font-mono font-bold text-lg">#{id || "7721-X90"}</p>
          </div>

          {/* PROGRESS STEPS (Visual only) */}
          <div className="flex justify-between items-center mb-8 px-4 opacity-60">
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                <Check size={14} />
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase">Placed</span>
            </div>
            <div className="h-0.5 flex-1 bg-emerald-100 mx-2 -mt-6"></div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                <Package size={14} />
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase">Packing</span>
            </div>
            <div className="h-0.5 flex-1 bg-slate-100 mx-2 -mt-6"></div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                <Truck size={14} />
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase">Shipped</span>
            </div>
          </div>

          <p className="text-slate-500 text-sm leading-relaxed mb-8">
            We've sent a confirmation email to your inbox. Your package will arrive in <span className="text-slate-900 font-bold">2-4 business days.</span>
          </p>

          <div className="space-y-3">
            <Link
              to="/"
              className="group w-full bg-[#064E3B] hover:bg-[#053d2e] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all transform active:scale-95 shadow-lg shadow-emerald-900/20"
            >
              <ShoppingBag size={18} />
              Continue Shopping
            </Link>
            
            <Link
              to="/orders"
              className="w-full text-emerald-700 hover:text-emerald-800 font-bold py-3 text-sm flex items-center justify-center gap-1 transition-colors"
            >
              Track My Order <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* FOOTER HINT */}
        <p className="mt-8 text-slate-400 text-xs animate-fade-up delay-3">
          Need help? <a href="#" className="underline hover:text-emerald-600">Contact Support</a>
        </p>
      </div>
    </div>
  );
};

export default OrderSuccess;