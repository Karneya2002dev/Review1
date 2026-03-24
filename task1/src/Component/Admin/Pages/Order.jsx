import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, MapPin, Phone } from "lucide-react";
import Sidebar from "../Sidebar";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${id}`, { status });
      fetchOrders();
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  // ✅ Safe status color handler
  const getStatusColor = (status = "placed") => {
    switch (status.toLowerCase()) {
      case "placed":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "processing":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "shipped":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "delivered":
        return "bg-green-100 text-green-700 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="flex">
      
      {/* ✅ SIDEBAR */}
      <Sidebar />

      {/* ✅ MAIN CONTENT */}
      <div className="flex-1 ml-64 min-h-screen bg-gray-50 p-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          
          {/* HEADER */}
          <header className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Orders Management
              </h1>
              <p className="text-gray-500 mt-1">
                Track and manage customer shipments
              </p>
            </div>

            <button
              onClick={fetchOrders}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Refresh Data
            </button>
          </header>

          {/* TABLE */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative z-10">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64">
                <Loader2 className="animate-spin text-blue-600 mb-2" size={32} />
                <p className="text-gray-500">Loading orders...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  
                  {/* HEAD */}
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500">ID</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500">Customer</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500">Address</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500">Items</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500">Amount</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500">Status</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 text-right">Actions</th>
                    </tr>
                  </thead>

                  {/* BODY */}
                  <tbody className="divide-y divide-gray-200">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-gray-50 transition">

                        {/* ID */}
                        <td className="px-6 py-4 font-medium text-gray-900">
                          #{o.id}
                        </td>

                        {/* CUSTOMER */}
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-800">
                              {o.name}
                            </span>
                            <span className="text-xs text-gray-500 flex items-center mt-1">
                              <Phone size={12} className="mr-1" />
                              {o.phone}
                            </span>
                          </div>
                        </td>

                        {/* ADDRESS */}
                        <td className="px-6 py-4">
                          <div className="flex items-start max-w-xs">
                            <MapPin size={14} className="mr-2 mt-0.5 text-gray-400" />
                            <span className="text-xs text-gray-600">
                              {o.address}, {o.city} - {o.pincode}
                            </span>
                          </div>
                        </td>

                        {/* ITEMS */}
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            {o.items?.map((item, i) => (
                              <div key={i} className="flex justify-between text-xs">
                                <span className="truncate max-w-30">
                                  {item.product_name}
                                </span>
                                <span className="text-gray-400">
                                  x{item.quantity}
                                </span>
                              </div>
                            ))}
                          </div>
                        </td>

                        {/* AMOUNT */}
                        <td className="px-6 py-4 font-bold">
                          ₹{Number(o.total).toLocaleString("en-IN")}
                        </td>

                        {/* STATUS */}
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(o.status)}`}
                          >
                            {(o.status || "placed").charAt(0).toUpperCase() +
                              (o.status || "placed").slice(1)}
                          </span>
                        </td>

                        {/* ACTION */}
                        <td className="px-6 py-4 text-right">
                          <select
                            value={o.status || "placed"}
                            onChange={(e) =>
                              updateStatus(o.id, e.target.value)
                            }
                            className="text-sm border border-gray-300 rounded-md p-1 bg-white shadow-sm cursor-pointer"
                          >
                            <option value="placed">Placed</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>

                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}