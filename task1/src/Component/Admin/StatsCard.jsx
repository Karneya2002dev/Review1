import { motion } from "framer-motion";

export default function StatCard({ title, value }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className="bg-white p-5 rounded-xl shadow"
    >
      <h3 className="text-gray-500">{title}</h3>
      <h1 className="text-2xl font-bold">{value}</h1>
    </motion.div>
  );
}