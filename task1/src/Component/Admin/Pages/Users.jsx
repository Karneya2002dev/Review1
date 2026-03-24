import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Sidebar from "../Sidebar";

const API_URL = "http://localhost:5000/api/users-with-orders";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const initialFormState = {
    id: null,
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  };

  const [form, setForm] = useState(initialFormState);

  useEffect(() => {
    fetchUsers();
  }, []);

const fetchUsers = async () => {
  try {
    const res = await axios.get(API_URL);
    setUsers(res.data);
  } catch (err) {
    console.error("Fetch error:", err);
  }
};

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openModal = (user = null) => {
    if (user) {
      setForm(user);
      setIsEdit(true);
    } else {
      setForm(initialFormState);
      setIsEdit(false);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setForm(initialFormState);
  };

  // ✅ Show success message helper
  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    if (isEdit) {
      await axios.put(`${API_URL}/${form.id}`, form);
      showSuccess("User updated successfully ✅");
    } else {
      await axios.post(API_URL, form); // ✅ INSERT
      showSuccess("User added successfully ✅");
    }

    fetchUsers();
    closeModal();
  } catch (err) {
    console.error("Submit error:", err);
  }
};

  const handleDelete = async (id) => {
    if (window.confirm("Delete this user?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        setUsers(users.filter((u) => u.id !== id));
        showSuccess("User deleted successfully ✅");
      } catch (err) {
        console.error(err);
      }
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) =>
      [u.name, u.email]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [users, search]);

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />

      <div className="flex-1 p-8 ml-64">
        
        {/* ✅ Success Message */}
        {successMsg && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 border border-green-300 rounded">
            {successMsg}
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Users</h1>
            <p className="text-gray-500 text-sm">
              Manage users and their details
            </p>
          </div>

          <button
            onClick={() => openModal()}
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg shadow hover:bg-indigo-700"
          >
            + Add User
          </button>
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search users..."
            className="w-full max-w-sm border px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="w-full">
           <thead>
  <tr>
    <th className="p-4">Name</th>
    <th className="p-4">Email</th>
    <th className="p-4">City</th>
    <th className="p-4">Orders</th>
    <th className="p-4 text-right">Actions</th>
  </tr>
</thead>

            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id} className="border-t hover:bg-gray-50">
                  <td className="p-4 font-medium">{u.name}</td>
                  <td className="p-4 text-gray-600">{u.email}</td>
                  <td className="p-4 text-gray-600">{u.city || "-"}</td>
                  <td className="p-4 text-gray-600">
  {u.order_count || 0}
</td>
                  <td className="p-4 text-right space-x-3">
                    <button
                      onClick={() => openModal(u)}
                      className="text-indigo-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg p-6">
              
              <h2 className="text-xl font-bold mb-4">
                {isEdit ? "Edit User" : "Add User"}
              </h2>

              <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="border p-2 rounded" />
                <input name="email" placeholder="Email" value={form.email} onChange={handleChange} className="border p-2 rounded" />
                <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} className="border p-2 rounded" />
                <input name="city" placeholder="City" value={form.city} onChange={handleChange} className="border p-2 rounded" />
                <input name="address" placeholder="Address" value={form.address} onChange={handleChange} className="border p-2 rounded col-span-2" />
                <input name="pincode" placeholder="Pincode" value={form.pincode} onChange={handleChange} className="border p-2 rounded" />

                <div className="col-span-2 flex justify-end gap-3 mt-4">
                  <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-300 rounded">
                    Cancel
                  </button>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded">
                    {isEdit ? "Update" : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}