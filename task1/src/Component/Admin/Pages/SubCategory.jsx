import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import Sidebar from "../Sidebar";
import Navbar from "../NAvbar";

export default function Subcategories() {
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    category_id: ""
  });

  // Fetch Data
  const fetchData = async () => {
    const subRes = await axios.get("http://localhost:5000/api/subcategories");
    const catRes = await axios.get("http://localhost:5000/api/categories");

    setSubcategories(subRes.data);
    setCategories(catRes.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Submit
  const handleSubmit = async () => {
    if (!form.name || !form.category_id) {
      return toast.error("All fields required");
    }

    try {
      setLoading(true);

      if (editData) {
        await axios.put(
          `http://localhost:5000/api/subcategories/${editData.id}`,
          form
        );
        toast.success("Subcategory Updated ✅");
      } else {
        await axios.post(
          "http://localhost:5000/api/subcategories",
          form
        );
        toast.success("Subcategory Added ✅");
      }

      closeModal();
      fetchData();

    } catch (err) {
      toast.error("Error ❌");
    } finally {
      setLoading(false);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this subcategory?")) return;

    await axios.delete(`http://localhost:5000/api/subcategories/${id}`);
    toast.success("Deleted 🗑️");
    fetchData();
  };

  // Edit
  const handleEdit = (item) => {
    setEditData(item);
    setForm({
      name: item.name,
      category_id: item.category_id
    });
    setShowModal(true);
  };

  // Close
  const closeModal = () => {
    setShowModal(false);
    setEditData(null);
    setForm({ name: "", category_id: "" });
  };

 return (
  <div className="flex bg-gray-100 min-h-screen">

    <Sidebar />

    {/* FIX: margin for fixed sidebar */}
    <div className="flex-1 ml-64">

      <Navbar />

      <div className="p-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Subcategories
          </h1>

          <button
            onClick={() => setShowModal(true)}
            className="bg-[#019147] hover:bg-green-700 text-white px-5 py-2 rounded-lg flex items-center gap-2 shadow"
          >
            <Plus size={18}/> Add Subcategory
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <table className="w-full">

            <thead className="bg-gray-50 text-gray-600 text-sm">
              <tr>
                <th className="p-4 text-left">Code</th>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Category</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {subcategories.map((item) => {
                const category = categories.find(
                  (c) => c.id === item.category_id
                );

                return (
                  <tr
                    key={item.id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="p-4 font-medium text-gray-700">
                      {item.subcategory_code}
                    </td>

                    <td className="p-4 text-gray-800">
                      {item.name}
                    </td>

                    <td className="p-4">
                      <span className="bg-green-100 text-[#019147] px-3 py-1 rounded-full text-xs font-medium">
                        {category?.name || "-"}
                      </span>
                    </td>

                    <td className="p-4 flex gap-3">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200"
                      >
                        <Pencil className="text-blue-600" size={16}/>
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 rounded-lg bg-red-100 hover:bg-red-200"
                      >
                        <Trash2 className="text-red-600" size={16}/>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>

          </table>
        </div>

      </div>
    </div>

    {/* Modal */}
    {showModal && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">

        <div className="bg-white w-100 rounded-2xl shadow-lg p-6">

          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            {editData ? "Edit Subcategory" : "Add Subcategory"}
          </h2>

          {/* Name */}
          <input
            type="text"
            placeholder="Subcategory Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-gray-300 focus:border-[#019147] focus:ring-1 focus:ring-[#019147] p-2 rounded-lg mb-3 outline-none"
          />

          {/* Category Dropdown */}
          <select
            value={form.category_id}
            onChange={(e) =>
              setForm({ ...form, category_id: e.target.value })
            }
            className="w-full border border-gray-300 focus:border-[#019147] focus:ring-1 focus:ring-[#019147] p-2 rounded-lg mb-3 outline-none"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={closeModal}
              className="px-4 py-2 border rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 bg-[#019147] hover:bg-green-700 text-white rounded-lg"
            >
              {loading
                ? "Processing..."
                : editData
                ? "Update"
                : "Add"}
            </button>
          </div>

        </div>
      </div>
    )}

  </div>
);

}