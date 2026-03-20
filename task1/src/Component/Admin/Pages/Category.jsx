import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import Sidebar from "../Sidebar";
import Navbar from "../NAvbar";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    image: null
  });

  const [preview, setPreview] = useState(null);

  // Fetch Categories
  const fetchCategories = async () => {
    const res = await axios.get("http://localhost:5000/api/categories");
    setCategories(res.data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle Image Preview
  const handleImageChange = (file) => {
    setForm({ ...form, image: file });

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // Submit
  const handleSubmit = async () => {
    if (!form.name) return toast.error("Name required");

    const formData = new FormData();
    formData.append("name", form.name);
    if (form.image) formData.append("image", form.image);

    try {
      setLoading(true);

      if (editData) {
        await axios.put(
          `http://localhost:5000/api/categories/${editData.id}`,
          formData
        );
        toast.success("Category Updated ✅");
      } else {
        await axios.post("http://localhost:5000/api/categories", formData);
        toast.success("Category Added ✅");
      }

      closeModal();
      fetchCategories();

    } catch (err) {
      toast.error("Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    await axios.delete(`http://localhost:5000/api/categories/${id}`);
    toast.success("Deleted 🗑️");
    fetchCategories();
  };

  // Edit Open
  const handleEdit = (cat) => {
    setEditData(cat);
    setForm({ name: cat.name, image: null });

    // show existing image
    setPreview(`http://localhost:5000/uploads/${cat.image}`);

    setShowModal(true);
  };

  // Close Modal
  const closeModal = () => {
    setShowModal(false);
    setEditData(null);
    setForm({ name: "", image: null });
    setPreview(null);
  };

 return (
  <div className="flex bg-gray-100 min-h-screen">
    <Sidebar />

    {/* FIX: Add margin-left for fixed sidebar */}
    <div className="flex-1 ml-64">
      <Navbar />

      <div className="p-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Categories
          </h1>

          <button
            onClick={() => setShowModal(true)}
            className="bg-[#019147] hover:bg-green-700 text-white px-5 py-2 rounded-lg flex items-center gap-2 shadow"
          >
            <Plus size={18}/> Add Category
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
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {categories.map((cat) => (
                <tr
                  key={cat.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-4 font-medium text-gray-700">
                    {cat.category_code}
                  </td>

                  <td className="p-4">
                    <img
                      src={`http://localhost:5000/uploads/${cat.image}`}
                      alt=""
                      className="w-12 h-12 rounded-lg object-cover border"
                    />
                  </td>

                  <td className="p-4 text-gray-800">
                    {cat.name}
                  </td>

                  <td className="p-4 flex gap-3">
                    <button
                      onClick={() => handleEdit(cat)}
                      className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200"
                    >
                      <Pencil className="text-blue-600" size={16}/>
                    </button>

                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="p-2 rounded-lg bg-red-100 hover:bg-red-200"
                    >
                      <Trash2 className="text-red-600" size={16}/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">

          <div className="bg-white w-100 rounded-2xl shadow-lg p-6">

            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {editData ? "Edit Category" : "Add Category"}
            </h2>

            {/* Name */}
            <input
              type="text"
              placeholder="Category Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-300 focus:border-[#019147] focus:ring-1 focus:ring-[#019147] p-2 rounded-lg mb-3 outline-none"
            />

            {/* Image */}
            <input
              type="file"
              onChange={(e) => handleImageChange(e.target.files[0])}
              className="mb-3 text-sm"
            />

            {/* Preview */}
            {preview && (
              <img
                src={preview}
                alt="preview"
                className="w-24 h-24 object-cover rounded-lg mb-3 border"
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
  </div>
);
  

}