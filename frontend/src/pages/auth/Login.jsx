import { useState } from "react";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const { data } = await API.post("/auth/login", form);

      login(data);

      if (data.role === "admin") navigate("/admin");
      else if (data.role === "seller") navigate("/seller");
      else navigate("/user");

    } catch (err) {
      setError(err.response?.data?.msg || "Login failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gradient-to-r from-blue-100 to-indigo-200">
      
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-2xl w-96"
      >
        {/* Title */}
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-600">
          Welcome Back 👋
        </h2>

        {/* Error */}
        {error && (
          <p className="bg-red-100 text-red-600 p-2 mb-3 rounded text-sm">
            {error}
          </p>
        )}

        {/* Email */}
        <input
          type="email"
          placeholder="Enter your email"
          className="border p-3 mb-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          required
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Enter your password"
          className="border p-3 mb-4 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
          required
        />

        {/* Button */}
        <button
          disabled={loading}
          className="bg-blue-600 text-white py-2 w-full rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Footer */}
        <p className="text-sm text-center mt-4 text-gray-500">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;