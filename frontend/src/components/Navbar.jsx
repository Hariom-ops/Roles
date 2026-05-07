import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center sticky top-0 z-50">
      
      {/* Logo */}
      <h1
        className="text-2xl font-bold text-blue-600 cursor-pointer"
        onClick={() => navigate("/")}
      >
        🚴 E-Bike
      </h1>

      {/* Links */}
      <div className="flex items-center gap-4">
        {!user ? (
          <>
            <Link className="text-gray-600 hover:text-blue-600" to="/login">
              Login
            </Link>
            <Link
              className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
              to="/register"
            >
              Register
            </Link>
          </>
        ) : (
          <>
            {user.role === "user" && (
              <Link className="hover:text-blue-600" to="/user">
                Dashboard
              </Link>
            )}

            {user.role === "seller" && (
              <Link className="hover:text-blue-600" to="/seller">
                Seller
              </Link>
            )}

            {user.role === "admin" && (
              <Link className="hover:text-blue-600" to="/admin">
                Admin
              </Link>
            )}

            <span className="text-sm text-gray-500">
              {user.email}
            </span>

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;