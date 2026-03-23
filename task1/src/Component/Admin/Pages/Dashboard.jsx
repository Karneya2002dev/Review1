import { useEffect, useState } from "react";
import axios from "axios";
import { Pie, Bar } from "react-chartjs-2";
import Sidebar from "../Sidebar";
import Navbar from "../NAvbar";
import StatCard from "../StatsCard";
// import Sidebar from "../components/Sidebar";
// import Navbar from "../components/Navbar";
// import StatCard from "../components/StatCard";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function Dashboard() {
  const [counts, setCounts] = useState({
  totalCategories: 0,
  totalProducts: 0,
  totalSubcategories: 0,
  totalUsers: 0,
  totalOrders: 0
});
  const [categoryStats, setCategoryStats] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [orderStats, setOrderStats] = useState([]);
const [userMonthly, setUserMonthly] = useState([]);

  useEffect(() => {
  axios.get("http://localhost:5000/api/dashboard/counts")
    .then(res => setCounts(res.data));

  axios.get("http://localhost:5000/api/dashboard/category-stats")
    .then(res => setCategoryStats(res.data));

  axios.get("http://localhost:5000/api/dashboard/monthly-products")
    .then(res => setMonthly(res.data));

  // ✅ NEW APIs
  axios.get("http://localhost:5000/api/dashboard/users-count")
    .then(res => setCounts(prev => ({ ...prev, totalUsers: res.data.totalUsers })));

  axios.get("http://localhost:5000/api/dashboard/orders-count")
    .then(res => setCounts(prev => ({ ...prev, totalOrders: res.data.totalOrders })));

    axios.get("http://localhost:5000/api/dashboard/orders-by-status")
  .then(res => setOrderStats(res.data));
  axios.get("http://localhost:5000/api/dashboard/monthly-users")
  .then(res => setUserMonthly(res.data));

}, []);

  // Pie Chart (Different shades of green)
const pieData = {
  labels: categoryStats.map(c => c.category),
  datasets: [
    {
      data: categoryStats.map(c => c.total),
      backgroundColor: [
        "#019147",
        "#02a357",
        "#04b86a",
        "#26c281",
        "#58d68d",
        "#82e0aa"
      ],
      borderWidth: 1
    }
  ]
};

// Bar Chart (Single green theme)
const barData = {
  labels: monthly.map(m => `Month ${m.month}`),
  datasets: [
    {
      label: "Products",
      data: monthly.map(m => m.total),
      backgroundColor: "#019147",
      borderRadius: 6,
      barThickness: 40
    }
  ]
};
 


const options = {
  plugins: {
    legend: {
      labels: {
        color: "#333",
        font: { size: 14 }
      }
    }
  },
  scales: {
    x: {
      ticks: { color: "#555" },
      grid: { display: false }
    },
    y: {
      ticks: { color: "#555" },
      grid: { color: "#eee" }
    }
  }
};

const orderPieData = {
  labels: orderStats.map(o => o.status),
  datasets: [
    {
      data: orderStats.map(o => o.total),
      backgroundColor: [
        "#10b981", // delivered
        "#3b82f6", // processing
        "#f59e0b", // placed
        "#ef4444"  // cancelled
      ]
    }
  ]
};

const userBarData = {
  labels: userMonthly.map(u => `Month ${u.month}`),
  datasets: [
    {
      label: "Users",
      data: userMonthly.map(u => u.total),
      backgroundColor: "#3b82f6"
    }
  ]
};

 return (
  <div className="flex bg-gray-100 min-h-screen">
    <Sidebar />

    {/* IMPORTANT: margin-left for fixed sidebar */}
    <div className="flex-1 ml-64">
      <Navbar />

      <div className="p-6">

        {/* Page Title */}
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Dashboard Overview
        </h1>

        {/* Stats Cards */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
  <StatCard title="Categories" value={counts.totalCategories} />
  <StatCard title="Products" value={counts.totalProducts} />
  <StatCard title="Subcategories" value={counts.totalSubcategories} />
  <StatCard title="Users" value={counts.totalUsers} />
  <StatCard title="Orders" value={counts.totalOrders} />
</div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

          {/* Pie Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Category Distribution
            </h2>

            <div className="h-75 flex items-center justify-center">
              <Pie data={pieData} options={options} />
            </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Monthly Products
            </h2>

            <div className="h-75">
              <Bar data={barData} options={options} />
            </div>
          </div>

        </div>

<div className="bg-white p-6 rounded-2xl shadow-sm border mt-8">
  <h2 className="text-lg font-semibold text-gray-700 mb-4">
    Orders Status Distribution
  </h2>

  <div className="h-75 flex items-center justify-center">
    <Pie data={orderPieData} options={options} />
  </div>
</div>


      </div>
    </div>
  </div>
);
}