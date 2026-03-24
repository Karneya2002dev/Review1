import React, { useEffect, useState } from "react";
import axios from "axios";
import { CreditCard, Truck, MapPin, ArrowLeft, CheckCircle2, ShieldCheck, Leaf } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  // ✅ check if any product is out of stock
const isOutOfStock = cartItems.some(item => item.stock === 0);

  const user_id = localStorage.getItem("user_id");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  useEffect(() => {
    if (user_id) {
      fetchCart();
      fetchUser();
    }
  }, [user_id]);

  const fetchUser = async () => {
    try {
     const res = await axios.get(`http://localhost:5000/api/users/${user_id}`);
      setForm({
        name: res.data?.name || "",
        phone: res.data?.phone || "",
        address: res.data?.address || "",
        city: res.data?.city || "",
        pincode: res.data?.pincode || "",
      });
    } catch (err) {
      console.log("User fetch error:", err);
    }
  };

  const fetchCart = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/cart/${user_id}`);
      setCartItems(res.data);
    } catch (err) {
      console.log("Cart fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const updateAddress = async () => {
    try {
      await axios.put(`http://localhost:5000/api/users/${user_id}`, form);
      alert("Address updated ✅");
    } catch (err) {
      alert("Failed to update address ❌");
    }
  };

 const handleOrder = async () => {
  if (!form.name || !form.phone || !form.address) {
    alert("Please fill all required fields");
    return;
  }

  try {
    const res = await axios.post("http://localhost:5000/api/orders", {
      user_id,
      address: form,
      total: totalPrice,
      payment_method: paymentMethod,
    });

    const orderNumber = res.data.order_number;

    // ✅ refresh cart globally
    window.dispatchEvent(new Event("cartUpdated"));

    // ✅ navigate to success page
    navigate(`/order-success/${orderNumber}`);

  } catch (err) {
    console.log("ORDER ERROR:", err.response?.data || err);
    alert(err.response?.data?.message || "Order failed ❌");
  }
};
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4 bg-[#F0F4F2]">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-emerald-800 font-medium animate-pulse">Setting up your secure checkout...</p>
      </div>
    );
  }

 return (
  <div className="bg-linear-to-br from-emerald-50 via-white to-emerald-100 min-h-screen pt-24 pb-16 px-4 md:px-10">
    <div className="max-w-7xl mx-auto">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-10">
        <Link
          to="/cart"
          className="flex items-center gap-2 text-emerald-700 hover:text-emerald-900 font-medium transition"
        >
          <ArrowLeft size={18} />
          Back to Cart
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
          Checkout
        </h1>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">

        {/* LEFT SECTION */}
        <div className="lg:col-span-8 space-y-8">

          {/* SHIPPING CARD */}
          <div className="bg-white rounded-2xl shadow-md border p-8">
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="text-emerald-600" />
              <h2 className="text-xl font-semibold text-slate-800">
                Shipping Details
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {[
                { label: "Full Name", name: "name" },
                { label: "Phone", name: "phone" },
                { label: "City", name: "city" },
                { label: "Pincode", name: "pincode" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="text-sm text-slate-500">
                    {field.label}
                  </label>
                  <input
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange}
                    className="w-full mt-1 px-4 py-3 rounded-lg border focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder={field.label}
                  />
                </div>
              ))}
            </div>

            <div className="mt-5">
              <label className="text-sm text-slate-500">Address</label>
              <textarea
                name="address"
                rows="3"
                value={form.address}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-3 rounded-lg border focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <button
              onClick={updateAddress}
              className="mt-5 text-sm text-emerald-600 font-semibold hover:underline"
            >
              Save Address
            </button>
          </div>

          {/* PAYMENT CARD */}
          <div className="bg-white rounded-2xl shadow-md border p-8">
            <div className="flex items-center gap-3 mb-6">
              <CreditCard className="text-emerald-600" />
              <h2 className="text-xl font-semibold text-slate-800">
                Payment Method
              </h2>
            </div>

            <div className="space-y-4">
              {[
                { id: "cod", title: "Cash on Delivery", desc: "Pay when you receive" },
                { id: "online", title: "Online Payment", desc: "UPI / Cards / Wallets" },
              ].map((method) => (
                <div
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`flex items-center justify-between p-5 rounded-xl border cursor-pointer transition ${
                    paymentMethod === method.id
                      ? "border-emerald-500 bg-emerald-50"
                      : "hover:border-emerald-300"
                  }`}
                >
                  <div>
                    <p className="font-semibold text-slate-800">
                      {method.title}
                    </p>
                    <p className="text-sm text-slate-500">{method.desc}</p>
                  </div>

                  <div className="w-5 h-5 border-2 rounded-full flex items-center justify-center border-emerald-500">
                    {paymentMethod === method.id && (
                      <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SUMMARY */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-2xl shadow-xl border p-6 sticky top-28">

            <h2 className="text-lg font-bold mb-4 flex justify-between">
              Order Summary
              <span className="text-sm font-normal text-slate-500">
                {cartItems.length} items
              </span>
            </h2>

            {/* ITEMS */}
            <div className="max-h-64 overflow-y-auto space-y-3 mb-5">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <div>
                    <p className="font-medium text-slate-700">{item.name}</p>
                    <p className="text-xs text-slate-400">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold text-emerald-600">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            {/* TOTALS */}
            <div className="border-t pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{totalPrice.toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-emerald-600 font-semibold">Free</span>
              </div>

              <div className="flex justify-between font-bold text-lg pt-2">
                <span>Total</span>
                <span>₹{totalPrice.toLocaleString()}</span>
              </div>
            </div>

            {/* ORDER BUTTON */}
{isOutOfStock ? (
  <button
    disabled
    className="w-full mt-6 bg-gray-400 text-white py-3 rounded-xl cursor-not-allowed"
  >
    Some items are out of stock ❌
  </button>
) : (
  <button
    onClick={handleOrder}
    className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold transition active:scale-95"
  >
    Place Order
  </button>
)}

            {/* TRUST BADGES */}
            <div className="flex justify-center gap-4 mt-5 text-slate-400 text-xs">
              <div className="flex items-center gap-1">
                <ShieldCheck size={14} /> Secure
              </div>
              <div className="flex items-center gap-1">
                <Truck size={14} /> Fast Delivery
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
);
}

export default CheckoutPage;