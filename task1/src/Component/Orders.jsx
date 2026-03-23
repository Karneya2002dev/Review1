import React, { useEffect, useState } from "react";
import axios from "axios";
import { Package, Calendar, ChevronRight, Box, Clock, CheckCircle2, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const user_id = localStorage.getItem("user_id");

  useEffect(() => {
    if (user_id) fetchOrders();
  }, [user_id]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/orders/${user_id}`);
      setOrders(res.data);
    } catch (err) {
      console.log("Fetch orders error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Helper for status colors
  const getStatusStyle = (status) => {
    const s = status?.toLowerCase();
    if (s === 'delivered') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (s === 'processing' || s === 'placed') return 'bg-blue-100 text-blue-700 border-blue-200';
    if (s === 'cancelled') return 'bg-rose-100 text-rose-700 border-rose-200';
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F7F4]">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F7F4] pt-32 pb-20 px-4 md:px-12">
      <div className="max-w-5xl mx-auto">
        
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Purchase History</h1>
            <p className="text-emerald-700 font-medium mt-1">Manage and track your recent orders</p>
          </div>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 bg-white text-emerald-700 px-5 py-2.5 rounded-2xl font-bold shadow-sm border border-emerald-100 hover:bg-emerald-50 transition-all text-sm w-fit"
          >
            <ShoppingBag size={18} />
            Shop More
          </Link>
        </header>

     {orders.map((order, index) => (
  <div 
    key={order.id} 
    className="group bg-white rounded-4xl p-6 md:p-8 border border-emerald-50 shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300"
  >
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
      
      {/* LEFT: Order Info */}
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-emerald-400 shrink-0 shadow-lg">
          <Package size={24} />
        </div>

        <div>
          <div className="flex items-center gap-3">
            <p className="font-black text-xl text-slate-900">
              #{order.order_number}
            </p>

            <span className={`text-[10px] uppercase px-3 py-1 rounded-full border ${getStatusStyle(order.status)}`}>
              {order.status || "Processing"}
            </span>
          </div>

          <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {new Date(order.created_at).toLocaleDateString()}
            </span>

            <span className="flex items-center gap-1">
              <Clock size={14} />
              {new Date(order.created_at).toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="text-right">
        <p className="text-xs text-slate-400">Total</p>
        <p className="text-xl font-bold">₹{order.total}</p>
      </div>
    </div>

    {/* 🔥 ORDER ITEMS SECTION */}
    <div className="mt-6 border-t pt-6 space-y-3">
      <p className="text-xs font-bold text-slate-400 uppercase">
        Items Ordered
      </p>

      {order.items && order.items.length > 0 ? (
        order.items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between bg-slate-50 p-3 rounded-xl"
          >
            <div className="flex items-center gap-3">
              <img
                src={`http://localhost:5000/uploads/${item.image}`}
                alt={item.name}
                className="w-12 h-12 object-contain rounded-lg bg-white"
              />

              <div>
                <p className="font-semibold text-sm text-slate-800">
                  {item.name}
                </p>
                <p className="text-xs text-slate-500">
                  Qty: {item.quantity}
                </p>
              </div>
            </div>

            <p className="text-sm font-bold text-slate-700">
              ₹{item.price}
            </p>
          </div>
        ))
      ) : (
        <p className="text-sm text-slate-400">No items found</p>
      )}
    </div>

    {/* PAYMENT */}
    <div className="mt-4 flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg w-fit">
      <CheckCircle2 size={14} />
      Paid via {order.payment_method?.toUpperCase() || "COD"}
    </div>
  </div>
))}
        <footer className="mt-12 text-center">
          <p className="text-slate-400 text-sm font-medium">
            Showing your last {orders.length} orders. Need detailed invoices? <button className="text-emerald-600 underline font-bold">Download All</button>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Orders;