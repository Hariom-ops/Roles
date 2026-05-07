import { useEffect, useState } from "react";
import API from "../../api/axios";

const UserDashboard = () => {
  const [bikes, setBikes] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    bikeId: "",
    startDate: "",
    endDate: "",
  });

  const [activeTab, setActiveTab] = useState("bikes");

  const fetchData = async () => {
    try {
      const bikesRes = await API.get("/bikes");
      const bookingsRes = await API.get("/bookings/my");

      setBikes(bikesRes.data);
      setBookings(bookingsRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 📅 Booking
  const handleBooking = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (!window.Razorpay) {
        alert("Razorpay not loaded ❌");
        return;
      }

      const selectedBike = bikes.find(
        (b) => b._id === form.bikeId
      );

      if (!selectedBike) return alert("Select a bike ❌");

      const days = Math.ceil(
        (new Date(form.endDate) - new Date(form.startDate)) /
          (1000 * 60 * 60 * 24)
      );

      if (days <= 0) return alert("Invalid dates ❌");

      const amount = days * selectedBike.pricePerDay;

      const { data: booking } = await API.post("/bookings", form);

      const { data: order } = await API.post("/bookings/create-order", {
        amount,
      });

      const options = {
        key: "rzp_test_Scdp3lBPQDaUpP",
        amount: order.amount,
        currency: "INR",
        order_id: order.id,
        name: "E-Bike Rental",

        handler: async function (response) {
          await API.post("/bookings/verify-payment", {
            ...response,
            bookingId: booking._id,
          });

          alert("✅ Payment successful!");
          setForm({ bikeId: "", startDate: "", endDate: "" });
          fetchData();
        },
      };

      new window.Razorpay(options).open();

    } catch (err) {
      console.error(err);
      alert("Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (id) => {
    await API.delete(`/bookings/${id}`);
    fetchData();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      
      <h1 className="text-3xl font-bold mb-6 text-gray-700">
        👤 User Dashboard
      </h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("bikes")}
          className={`px-5 py-2 rounded-lg font-medium ${
            activeTab === "bikes"
              ? "bg-blue-600 text-white"
              : "bg-white shadow"
          }`}
        >
          Browse Bikes
        </button>

        <button
          onClick={() => setActiveTab("bookings")}
          className={`px-5 py-2 rounded-lg font-medium ${
            activeTab === "bookings"
              ? "bg-green-600 text-white"
              : "bg-white shadow"
          }`}
        >
          My Bookings
        </button>
      </div>

      {/* BIKES */}
      {activeTab === "bikes" && (
        <>
          {/* Booking Card */}
          <div className="bg-white p-6 rounded-xl shadow mb-6 max-w-xl">
            <h3 className="text-lg font-semibold mb-4">
              📅 Book a Bike
            </h3>

            <form onSubmit={handleBooking} className="space-y-3">
              <select
                className="border p-3 w-full rounded focus:ring-2 focus:ring-blue-400"
                value={form.bikeId}
                onChange={(e) =>
                  setForm({ ...form, bikeId: e.target.value })
                }
                required
              >
                <option value="">Select Bike</option>
                {bikes
                  .filter((b) => b.available)
                  .map((bike) => (
                    <option key={bike._id} value={bike._id}>
                      {bike.name} - ₹{bike.pricePerDay}/day
                    </option>
                  ))}
              </select>

              <input
                type="date"
                className="border p-3 w-full rounded"
                value={form.startDate}
                onChange={(e) =>
                  setForm({ ...form, startDate: e.target.value })
                }
                required
              />

              <input
                type="date"
                className="border p-3 w-full rounded"
                value={form.endDate}
                onChange={(e) =>
                  setForm({ ...form, endDate: e.target.value })
                }
                required
              />

              <button
                disabled={loading}
                className="bg-blue-600 text-white py-2 w-full rounded hover:bg-blue-700"
              >
                {loading ? "Processing..." : "Book Now"}
              </button>
            </form>
          </div>

          {/* Bike Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {bikes.map((bike) => (
              <div
                key={bike._id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition p-4"
              >
                <img
                  src={bike.image}
                  alt={bike.name}
                  className="h-40 w-full object-cover rounded mb-3"
                />

                <h3 className="font-bold text-lg">{bike.name}</h3>
                <p className="text-gray-500">{bike.brand}</p>

                <div className="flex justify-between mt-2">
                  <span className="text-blue-600 font-semibold">
                    ₹{bike.pricePerDay}/day
                  </span>
                  <span>
                    {bike.available ? "✅" : "❌"}
                  </span>
                </div>

                <p className="text-sm text-gray-400 mt-1">
                  📍 {bike.location}
                </p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* BOOKINGS */}
      {activeTab === "bookings" && (
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-xl mb-4 font-semibold">
            📄 My Bookings
          </h2>

          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Bike</th>
                <th>Dates</th>
                <th>Price</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((b) => (
                <tr key={b._id} className="text-center border-t">
                  <td className="p-2">{b.bike?.name}</td>
                  <td>
                    {new Date(b.startDate).toLocaleDateString()} -{" "}
                    {new Date(b.endDate).toLocaleDateString()}
                  </td>
                  <td>₹{b.totalPrice}</td>
                  <td>{b.status}</td>
                  <td>
                    {b.status !== "cancelled" && (
                      <button
                        onClick={() => cancelBooking(b._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;