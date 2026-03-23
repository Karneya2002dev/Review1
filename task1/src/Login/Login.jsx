import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Mail, Lock, LogIn, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e?.preventDefault();
    if (!form.email || !form.password) {
      return toast.error("Please fill in all fields");
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user_id", res.data.user_id);
      localStorage.setItem("name", res.data.name);

      toast.success("Welcome back! ✅");
      
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);

    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-white overflow-hidden px-4 selection:bg-[#008744]/10">
      
      {/* 🌿 Minimalist Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-[#008744]/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[30%] bg-[#008744]/10 blur-[100px] rounded-full" />
        {/* Subtle Fine Dot Grid */}
        <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: `radial-gradient(#008744 0.5px, transparent 0.5px)`, backgroundSize: '24px 24px' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,135,68,0.08)]">
          
          {/* Header Icon */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-50 rounded-3xl border border-slate-100 shadow-sm">
              <LogIn className="h-10 w-10 text-[#008744]" />
            </div>
          </div>

          <header className="text-center mb-10">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">System Login</h2>
            <p className="text-slate-500 mt-2 font-medium text-sm">Welcome back to the portal.</p>
          </header>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Input */}
            <InputGroup 
              label="Email Address" 
              icon={Mail} 
              type="email" 
              name="email" 
              placeholder="name@example.com" 
              onChange={handleChange} 
            />

            {/* Password Input */}
            <div className="relative">
              <div className="flex justify-between items-center mb-2 px-1">
                <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Password</label>
                <button type="button" className="text-[10px] font-black uppercase tracking-wider text-[#008744] hover:brightness-75 transition-all">Forgot?</button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-[#008744] transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  onChange={handleChange}
                  className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-[#008744]/20 focus:ring-4 focus:ring-[#008744]/5 outline-none transition-all text-slate-900 font-medium"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-[#008744] transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-[#008744] text-white font-bold py-4 rounded-2xl shadow-xl shadow-[#008744]/20 hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-70 active:scale-[0.98]"
            >
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-sm font-bold text-slate-400">
          New to the platform?{" "}
          <a href="/signup" className="text-[#008744] hover:underline underline-offset-4 decoration-2 font-black transition-all">
            Join Now
          </a>
        </p>
      </motion.div>
    </div>
  );
};

// Reusable Input Component to keep code dry
const InputGroup = ({ label, icon: Icon, ...props }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1">
      {label}
    </label>
    <div className="relative group">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-[#008744] transition-colors" />
      <input
        {...props}
        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-[#008744]/20 focus:ring-4 focus:ring-[#008744]/5 outline-none transition-all text-slate-900 font-medium"
      />
    </div>
  </div>
);

export default Login;