import { useEffect, useState } from "react";
import API from "../../api/axios";

const SellerDashboard = () => {
  const [bikes, setBikes] = useState([]);
  const [stats, setStats] = useState({});
  const [form, setForm] = useState({
    name: "",
    brand: "",
    pricePerDay: "",
    location: "",
    image: "",
  });

  const [editingId, setEditingId] = useState(null);

  const fetchData = async () => {
    try {
      const bikesRes = await API.get("/bikes/my");
      const statsRes = await API.get("/seller/dashboard");

      setBikes(bikesRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await API.put(`/bikes/${editingId}`, form);
      } else {
        await API.post("/bikes", form);
      }

      setForm({
        name: "",
        brand: "",
        pricePerDay: "",
        location: "",
        image: "",
      });

      setEditingId(null);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (bike) => {
    setForm(bike);
    setEditingId(bike._id);
  };

  const handleDelete = async (id) => {
    await API.delete(`/bikes/${id}`);
    fetchData();
  };

  const toggleAvailability = async (id) => {
    await API.put(`/seller/bike/${id}/toggle`);
    fetchData();
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        🏪 Seller Dashboard
      </h1>

      {/* 📊 Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-500 text-white p-6 rounded-xl shadow-lg">
          <p>Total Bikes</p>
          <h2 className="text-3xl font-bold">{stats.totalBikes || 0}</h2>
        </div>

        <div className="bg-green-500 text-white p-6 rounded-xl shadow-lg">
          <p>Total Bookings</p>
          <h2 className="text-3xl font-bold">
            {stats.totalBookings || 0}
          </h2>
        </div>

        <div className="bg-purple-500 text-white p-6 rounded-xl shadow-lg">
          <p>Total Revenue</p>
          <h2 className="text-3xl font-bold">
            ₹{stats.totalRevenue || 0}
          </h2>
        </div>
      </div>

      {/* ➕ Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-xl p-6 mb-8"
      >
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? "✏️ Edit Bike" : "➕ Add Bike"}
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            placeholder="Bike Name"
            className="input"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            placeholder="Brand"
            className="input"
            value={form.brand}
            onChange={(e) =>
              setForm({ ...form, brand: e.target.value })
            }
          />

          <input
            placeholder="Price Per Day"
            type="number"
            className="input"
            value={form.pricePerDay}
            onChange={(e) =>
              setForm({ ...form, pricePerDay: e.target.value })
            }
          />

          <input
            placeholder="Location"
            className="input"
            value={form.location}
            onChange={(e) =>
              setForm({ ...form, location: e.target.value })
            }
          />

          <input
            placeholder="Image URL"
            className="input md:col-span-2"
            value={form.image}
            onChange={(e) =>
              setForm({ ...form, image: e.target.value })
            }
          />
        </div>

        <button className="mt-5 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition">
          {editingId ? "Update Bike" : "Add Bike"}
        </button>
      </form>

      {/* 📋 Bike List */}
      <div className="bg-white shadow-xl rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">My Bikes</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="p-3">Name</th>
                <th>Brand</th>
                <th>Price</th>
                <th>Location</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {bikes.map((bike) => (
                <tr
                  key={bike._id}
                  className="border-t hover:bg-gray-100 transition"
                >
                  <td className="p-3 font-medium">{bike.name}</td>
                  <td>{bike.brand}</td>
                  <td>₹{bike.pricePerDay}</td>
                  <td>{bike.location}</td>

                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        bike.available
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-500"
                      }`}
                    >
                      {bike.available ? "Available" : "Unavailable"}
                    </span>
                  </td>

                  <td className="space-x-2">
                    <button
                      onClick={() => handleEdit(bike)}
                      className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(bike._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>

                    <button
                      onClick={() => toggleAvailability(bike._id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Toggle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;