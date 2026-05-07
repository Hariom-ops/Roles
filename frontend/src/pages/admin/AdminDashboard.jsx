import { useEffect, useState } from "react";
import API from "../../api/axios";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [bikes, setBikes] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("users");
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, bikesRes, bookingsRes] = await Promise.all([
        API.get("/admin/users"),
        API.get("/admin/bikes"),
        API.get("/admin/bookings"),
      ]);

      setUsers(usersRes.data);
      setBikes(bikesRes.data);
      setBookings(bookingsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleUser = async (id) => {
    await API.put(`/admin/user/${id}/toggle`);
    fetchData();
  };

  const deleteBike = async (id) => {
    await API.delete(`/admin/bike/${id}`);
    fetchData();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          👑 Admin Dashboard
        </h1>

        <button
          onClick={fetchData}
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 flex-wrap">
        {["users", "bikes", "bookings"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-full font-medium capitalize transition-all duration-200 ${
              activeTab === tab
                ? "bg-black text-white shadow-lg scale-105"
                : "bg-white text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center text-lg font-semibold text-gray-600">
          Loading...
        </div>
      )}

      {/* USERS */}
      {activeTab === "users" && !loading && (
        <div className="bg-white rounded-2xl shadow-xl p-6 overflow-x-auto">
          <h2 className="text-xl font-semibold mb-4">All Users</h2>

          {users.length === 0 ? (
            <p className="text-gray-500">No users found</p>
          ) : (
            <table className="w-full">
              <thead className="bg-black text-white">
                <tr>
                  <th className="p-3">Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((u) => (
                  <tr
                    key={u._id}
                    className="text-center border-t hover:bg-gray-100 transition"
                  >
                    <td className="p-3 font-medium">{u.name}</td>
                    <td>{u.email}</td>

                    <td>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        {u.role}
                      </span>
                    </td>

                    <td>
                      {u.isVerified ? (
                        <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">
                          Active
                        </span>
                      ) : (
                        <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm">
                          Blocked
                        </span>
                      )}
                    </td>

                    <td>
                      <button
                        onClick={() => toggleUser(u._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition"
                      >
                        Toggle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* BIKES */}
      {activeTab === "bikes" && !loading && (
        <div className="bg-white rounded-2xl shadow-xl p-6 overflow-x-auto">
          <h2 className="text-xl font-semibold mb-4">All Bikes</h2>

          {bikes.length === 0 ? (
            <p className="text-gray-500">No bikes found</p>
          ) : (
            <table className="w-full">
              <thead className="bg-black text-white">
                <tr>
                  <th className="p-3">Name</th>
                  <th>Brand</th>
                  <th>Price</th>
                  <th>Seller</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {bikes.map((b) => (
                  <tr
                    key={b._id}
                    className="text-center border-t hover:bg-gray-100 transition"
                  >
                    <td className="p-3 font-medium">{b.name}</td>
                    <td>{b.brand}</td>

                    <td className="text-blue-600 font-semibold">
                      ₹{b.pricePerDay}
                    </td>

                    <td>{b.seller?.email}</td>

                    <td>
                      <button
                        onClick={() => deleteBike(b._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* BOOKINGS */}
      {activeTab === "bookings" && !loading && (
        <div className="bg-white rounded-2xl shadow-xl p-6 overflow-x-auto">
          <h2 className="text-xl font-semibold mb-4">All Bookings</h2>

          {bookings.length === 0 ? (
            <p className="text-gray-500">No bookings found</p>
          ) : (
            <table className="w-full">
              <thead className="bg-black text-white">
                <tr>
                  <th className="p-3">User</th>
                  <th>Bike</th>
                  <th>Dates</th>
                  <th>Price</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {bookings.map((b) => (
                  <tr
                    key={b._id}
                    className="text-center border-t hover:bg-gray-100 transition"
                  >
                    <td className="p-3">{b.user?.email}</td>
                    <td>{b.bike?.name}</td>

                    <td>
                      {new Date(b.startDate).toLocaleDateString()} -{" "}
                      {new Date(b.endDate).toLocaleDateString()}
                    </td>

                    <td className="text-blue-600 font-semibold">
                      ₹{b.totalPrice}
                    </td>

                    <td>
                      <span className="bg-gray-200 px-3 py-1 rounded-full text-sm">
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;