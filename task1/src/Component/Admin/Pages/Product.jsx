import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import Sidebar from "../Sidebar";
import Navbar from "../NAvbar";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [preview, setPreview] = useState(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    category_id: "",
    subcategory_id: "",
    image: null
  });

  // 🔁 Fetch Data
  const fetchData = async () => {
    const [prod, cat, sub] = await Promise.all([
      axios.get("http://localhost:5000/api/products"),
      axios.get("http://localhost:5000/api/categories"),
      axios.get("http://localhost:5000/api/subcategories")
    ]);

    setProducts(prod.data);
    setCategories(cat.data);
    setSubcategories(sub.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🎯 Filter subcategories based on category
  const filteredSubcategories = subcategories.filter(
    (sub) => sub.category_id == form.category_id
  );

  // 🖼️ Image preview
  const handleImageChange = (file) => {
    setForm({ ...form, image: file });
    if (file) setPreview(URL.createObjectURL(file));
  };

  // ✅ Submit
  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.category_id || !form.subcategory_id) {
      return toast.error("All fields required");
    }

    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      if (form[key]) formData.append(key, form[key]);
    });

    try {
      setLoading(true);

      if (editData) {
        await axios.put(
          `http://localhost:5000/api/products/${editData.id}`,
          formData
        );
        toast.success("Product Updated ✅");
      } else {
        await axios.post(
          "http://localhost:5000/api/products",
          formData
        );
        toast.success("Product Added ✅");
      }

      closeModal();
      fetchData();
    } catch (err) {
      toast.error("Error ❌");
    } finally {
      setLoading(false);
    }
  };

  // ❌ Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    await axios.delete(`http://localhost:5000/api/products/${id}`);
    toast.success("Deleted 🗑️");
    fetchData();
  };

  // ✏️ Edit
  const handleEdit = (item) => {
    setEditData(item);
    setForm({
      name: item.name,
      price: item.price,
      description: item.description,
      category_id: item.category_id,
      subcategory_id: item.subcategory_id,
      image: null
    });

    setPreview(`http://localhost:5000/uploads/${item.image}`);
    setShowModal(true);
  };

  // 🔄 Close Modal
  const closeModal = () => {
    setShowModal(false);
    setEditData(null);
    setPreview(null);
    setForm({
      name: "",
      price: "",
      description: "",
      category_id: "",
      subcategory_id: "",
      image: null
    });
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
            Products
          </h1>

          <button
            onClick={() => setShowModal(true)}
            className="bg-[#019147] hover:bg-green-700 text-white px-5 py-2 rounded-lg flex items-center gap-2 shadow"
          >
            <Plus size={18}/> Add Product
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <table className="w-full">

            <thead className="bg-gray-50 text-gray-600 text-sm">
              <tr>
                <th className="p-4 text-left">Code</th>
                <th className="p-4 text-left">Image</th>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Price</th>
                <th className="p-4 text-left">Category</th>
                <th className="p-4 text-left">Subcategory</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((item) => {
                const cat = categories.find(c => c.id === item.category_id);
                const sub = subcategories.find(s => s.id === item.subcategory_id);

                return (
                  <tr key={item.id} className="border-t hover:bg-gray-50 transition">

                    <td className="p-4 font-medium text-gray-700">
                      {item.product_code}
                    </td>

                    <td className="p-4">
                      <img
                        src={`http://localhost:5000/uploads/${item.image}`}
                        alt=""
                        className="w-12 h-12 rounded-lg object-cover border"
                      />
                    </td>

                    <td className="p-4 text-gray-800">
                      {item.name}
                    </td>

                    <td className="p-4 font-semibold text-[#019147]">
                      ₹{item.price}
                    </td>

                    <td className="p-4">
                      <span className="bg-green-100 text-[#019147] px-3 py-1 rounded-full text-xs font-medium">
                        {cat?.name || "-"}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                        {sub?.name || "-"}
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

        <div className="bg-white w-112.5 rounded-2xl shadow-lg p-6">

          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            {editData ? "Edit Product" : "Add Product"}
          </h2>

          {/* Name */}
          <input
            placeholder="Product Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-gray-300 focus:border-[#019147] focus:ring-1 focus:ring-[#019147] p-2 rounded-lg mb-3 outline-none"
          />

          {/* Price */}
          <input
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="w-full border border-gray-300 focus:border-[#019147] focus:ring-1 focus:ring-[#019147] p-2 rounded-lg mb-3 outline-none"
          />

          {/* Description */}
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border border-gray-300 focus:border-[#019147] focus:ring-1 focus:ring-[#019147] p-2 rounded-lg mb-3 outline-none"
          />

          {/* Category */}
          <select
            value={form.category_id}
            onChange={(e) =>
              setForm({ ...form, category_id: e.target.value, subcategory_id: "" })
            }
            className="w-full border border-gray-300 focus:border-[#019147] focus:ring-1 focus:ring-[#019147] p-2 rounded-lg mb-3 outline-none"
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          {/* Subcategory */}
          <select
            value={form.subcategory_id}
            onChange={(e) =>
              setForm({ ...form, subcategory_id: e.target.value })
            }
            className="w-full border border-gray-300 focus:border-[#019147] focus:ring-1 focus:ring-[#019147] p-2 rounded-lg mb-3 outline-none"
          >
            <option value="">Select Subcategory</option>
            {filteredSubcategories.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          {/* Image */}
          <input
            type="file"
            onChange={(e) => handleImageChange(e.target.files[0])}
            className="mb-3 text-sm"
          />

          {preview && (
            <img
              src={preview}
              alt=""
              className="w-24 h-24 rounded-lg object-cover border mb-3"
            />
          )}

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