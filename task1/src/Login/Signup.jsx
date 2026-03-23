import React, { useState, useCallback } from "react";
import axios from "axios";
import { Mail, Lock, User, Loader2, Sparkles, ArrowRight, Phone, Check, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

// Updated Palette for a Professional Light Theme
const COLORS = {
  primary: "#008744",
  primaryLight: "#e6f3ec",
  bg: "#ffffff",
  textMain: "#0f172a",
  textMuted: "#64748b",
  border: "#f1f5f9",
};

const Signup = () => {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", password: "" });
  const [passStrength, setPassStrength] = useState(0);

  const calculateStrength = useCallback((value) => {
    let strength = 0;
    if (value.length >= 8) strength++;
    if (/[0-9]/.test(value) && /[A-Z]/.test(value)) strength++;
    if (/[^A-Za-z0-9]/.test(value)) strength++;
    return strength;
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "password") setPassStrength(calculateStrength(value));
  };

  const validateStep1 = () => {
    if (form.name.length < 2) return toast.error("Please enter a valid name");
    if (form.phone.length < 10) return toast.error("Enter a valid phone number");
    setStep(2);
  };

  const handleSignup = async (e) => {
    e?.preventDefault();
    if (!form.email.includes("@")) return toast.error("Invalid email address");
    if (passStrength < 2) return toast.error("Password is too weak");

    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/signup", form);
      toast.success("Welcome aboard!");
      setTimeout(() => (window.location.href = "/login"), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-white overflow-hidden px-4 selection:bg-[#008744]/10">
      
      {/* 🌿 Subtle Organic Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-[#008744]/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] bg-[#008744]/10 blur-[100px] rounded-full" />
        {/* Fine Dot Grid */}
        <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: `radial-gradient(#008744 0.5px, transparent 0.5px)`, backgroundSize: '24px 24px' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,135,68,0.08)]">
          
          {/* ⚡ Step Indicator */}
          <div className="flex items-center gap-4 mb-12">
            {[1, 2].map((i) => (
              <React.Fragment key={i}>
                <div className={`flex items-center justify-center w-10 h-10 rounded-2xl font-bold transition-all duration-500 ${
                  step >= i ? "bg-[#008744] text-white shadow-lg shadow-[#008744]/30" : "bg-slate-50 text-slate-300"
                }`}>
                  {step > i ? <Check size={18} strokeWidth={3} /> : i}
                </div>
                {i === 1 && <div className="flex-1 h-0.75 bg-slate-50 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: step > 1 ? "100%" : "0%" }}
                    className="h-full bg-[#008744]" 
                  />
                </div>}
              </React.Fragment>
            ))}
          </div>

          <header className="mb-10 text-center">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              {step === 1 ? "Join the Lab" : "Secure Access"}
            </h1>
            <p className="text-slate-500 font-medium text-sm mt-2">
              {step === 1 ? "Create your professional profile." : "Finalize your security credentials."}
            </p>
          </header>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <InputGroup label="Full Name" icon={User} name="name" value={form.name} onChange={handleChange} placeholder="Alex Rivera" />
                <InputGroup label="Phone Number" icon={Phone} name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" />
                
                <button
                  onClick={validateStep1}
                  className="w-full mt-4 bg-[#008744] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:brightness-110 shadow-xl shadow-[#008744]/20 transition-all active:scale-[0.98]"
                >
                  Continue <ArrowRight size={18} />
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="step2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
                onSubmit={handleSignup}
              >
                <InputGroup label="Email Address" icon={Mail} name="email" type="email" value={form.email} onChange={handleChange} placeholder="alex@company.com" />
                
                <div className="relative">
                  <InputGroup 
                    label="Password" 
                    icon={Lock} 
                    name="password" 
                    type={showPassword ? "text" : "password"} 
                    value={form.password} 
                    onChange={handleChange} 
                    placeholder="••••••••" 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 bottom-4 text-slate-300 hover:text-[#008744] transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Strength Meter */}
                <div className="flex gap-2 px-1">
                  {[1, 2, 3].map((lvl) => (
                    <div key={lvl} className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${passStrength >= lvl ? "bg-[#008744]" : "bg-slate-100"}`} />
                  ))}
                </div>

                <div className="flex gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-5 py-4 rounded-2xl bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-slate-900 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#008744] disabled:opacity-50 transition-all active:scale-[0.98] shadow-lg shadow-slate-200"
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <>Create Account </>}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        <p className="mt-8 text-center text-sm text-slate-400">
          Already a member?{" "}
          <a href="/login" className="text-[#008744] font-bold hover:underline underline-offset-4 transition-all">
            Log in to Dashboard
          </a>
        </p>
      </motion.div>
    </div>
  );
};

// Refined Input Group for Light Theme
const InputGroup = ({ label, icon: Icon, ...props }) => (
  <div className="flex flex-col gap-2">
    <label htmlFor={props.name} className="text-[10px] uppercase tracking-[0.15em] font-black text-slate-400 ml-1">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-slate-300 group-focus-within:text-[#008744] transition-colors" />
      </div>
      <input
        id={props.name}
        {...props}
        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-[#008744]/5 focus:border-[#008744]/20 focus:bg-white transition-all font-medium"
      />
    </div>
  </div>
);

export default Signup;