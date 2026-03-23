import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const user_id = localStorage.getItem("user_id");
    const navigate = useNavigate();

    useEffect(() => {
        if (user_id) fetchCart();
    }, []);

    useEffect(() => {
        const handleCartUpdate = () => {
            if (user_id) {
                fetchCart(); // 🔥 refresh cart data
            }
        };

        window.addEventListener("cartUpdated", handleCartUpdate);

        return () => {
            window.removeEventListener("cartUpdated", handleCartUpdate);
        };
    }, [user_id]);

    const fetchCart = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/cart/${user_id}`);
            setCartItems(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const updateQty = async (id, action) => {
        try {
            await axios.put(`http://localhost:5000/api/cart/${action}/${id}`);
            window.dispatchEvent(new Event("cartUpdated")); // 🔥 only this
        } catch (err) {
            toast.error("Failed to update quantity");
        }
    };

    const removeItem = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/cart/${id}`);
            toast.success("Item removed from cart");
            window.dispatchEvent(new Event("cartUpdated")); // 🔥 only this
        } catch (err) {
            toast.error("Error removing item");
        }
    };
    const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#008744]"></div>
        </div>
    );

    return (
        <div className="bg-[#f8fafc] min-h-screen pt-28 pb-12 px-4 md:px-12">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-[#008744] rounded-2xl shadow-lg shadow-[#008744]/20">
                        <ShoppingBag className="text-white h-6 w-6" />
                    </div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">Your Shopping Cart</h2>
                </div>

                {cartItems.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center bg-white py-20 rounded-[3rem] shadow-sm border border-slate-100"
                    >
                        <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag className="h-10 w-10 text-slate-300" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-2">Your cart feels a bit light</h3>
                        <p className="text-slate-500 mb-8 max-w-sm mx-auto">Looks like you haven't added any of our premium products to your cart yet.</p>
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 bg-[#008744] text-white px-8 py-4 rounded-2xl font-bold hover:bg-[#007038] transition-all shadow-xl shadow-[#008744]/20"
                        >
                            Start Shopping <ArrowRight size={18} />
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-10">

                        {/* LEFT - Cart Items */}
                        <div className="lg:col-span-2 space-y-6">
                            <AnimatePresence>
                                {cartItems.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="group flex flex-col sm:flex-row items-center gap-6 bg-white p-6 rounded-4xl shadow-sm border border-slate-100 hover:shadow-md transition-all"
                                    >
                                        <div className="w-32 h-32 bg-slate-50 rounded-2xl overflow-hidden shrink-0 border border-slate-100 p-2">
                                            <img
                                                src={`http://localhost:5000/uploads/${item.image}`}
                                                alt={item.name}
                                                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>

                                        <div className="flex-1 text-center sm:text-left">
                                            <h3 className="font-bold text-xl text-slate-800 mb-1">{item.name}</h3>
                                            <p className="text-[#008744] font-black text-lg">₹{item.price.toLocaleString()}</p>

                                            <div className="flex items-center justify-center sm:justify-start gap-4 mt-4">
                                                <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
                                                    <button
                                                        onClick={() => updateQty(item.id, "decrease")}
                                                        className="p-2 hover:bg-white hover:text-[#008744] rounded-lg transition-all shadow-sm"
                                                    >
                                                        <Minus size={16} />
                                                    </button>
                                                    <span className="w-10 text-center font-bold text-slate-700">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQty(item.id, "increase")}
                                                        className="p-2 hover:bg-white hover:text-[#008744] rounded-lg transition-all shadow-sm"
                                                    >
                                                        <Plus size={16} />
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="hidden sm:block text-right">
                                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Subtotal</p>
                                            <p className="text-xl font-black text-slate-800">₹{(item.price * item.quantity).toLocaleString()}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* RIGHT - Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 sticky top-32">
                                <h3 className="text-2xl font-black text-slate-800 mb-6">Order Summary</h3>

                                <div className="space-y-4">
                                    <div className="flex justify-between text-slate-500 font-medium">
                                        <span>Subtotal</span>
                                        <span className="text-slate-800">₹{totalPrice.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-500 font-medium">
                                        <span>Shipping</span>
                                        <span className="text-emerald-600 font-bold underline underline-offset-4 decoration-dotted">Free Delivery</span>
                                    </div>
                                    <div className="flex justify-between text-slate-500 font-medium">
                                        <span>Taxes (GST)</span>
                                        <span className="text-slate-800 text-xs">Calculated at checkout</span>
                                    </div>

                                    <div className="pt-6 mt-6 border-t border-slate-100">
                                        <div className="flex justify-between items-end mb-8">
                                            <div>
                                                <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Total Amount</p>
                                                <p className="text-3xl font-black text-slate-900">₹{totalPrice.toLocaleString()}</p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => navigate("/checkout")}
                                            className="w-full bg-[#008744] hover:bg-[#007038] text-white font-black py-5 rounded-2xl shadow-2xl shadow-[#008744]/25 transition-all flex items-center justify-center gap-3"
                                        >
                                            <CreditCard size={20} />
                                            Proceed to Checkout
                                        </button>

                                        <div className="mt-6 flex items-center justify-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-tighter">
                                            <div className="h-px w-8 bg-slate-200"></div>
                                            Secure SSL Encrypted Checkout
                                            <div className="h-px w-8 bg-slate-200"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;