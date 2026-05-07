import { useState } from "react";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const { data } = await API.post("/auth/register", form);

      login(data);

      if (form.role === "admin") navigate("/admin");
      else if (form.role === "seller") navigate("/seller");
      else navigate("/user");

    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gradient-to-r from-green-100 to-emerald-200">
      
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-2xl w-96"
      >
        {/* Title */}
        <h2 className="text-3xl font-bold text-center mb-6 text-green-600">
          Create Account 🚀
        </h2>

        {/* Error */}
        {error && (
          <p className="bg-red-100 text-red-600 p-2 mb-3 rounded text-sm">
            {error}
          </p>
        )}

        {/* Name */}
        <input
          type="text"
          placeholder="Full Name"
          className="border p-3 mb-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          required
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Email Address"
          className="border p-3 mb-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          required
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          className="border p-3 mb-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
          required
        />

        {/* Role */}
        <select
          className="border p-3 mb-4 w-full rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          value={form.role}
          onChange={(e) =>
            setForm({ ...form, role: e.target.value })
          }
        >
          <option value="user">👤 User</option>
          <option value="seller">🏪 Seller</option>
        </select>

        {/* Button */}
        <button
          disabled={loading}
          className="bg-green-600 text-white py-2 w-full rounded-lg hover:bg-green-700 transition"
        >
          {loading ? "Creating Account..." : "Register"}
        </button>

        {/* Footer */}
        <p className="text-sm text-center mt-4 text-gray-500">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-green-600 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default Register;