import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { clearTokens, getAccessToken } from "../utils/auth.js";

function Navbar() {
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const isLoggedIn = !!getAccessToken();

  const handleLogout = () => {
    clearTokens();
    navigate("/login");
  };
  return (
    <nav className="bg-white shadow-md px-6 py-6 flex justify-between items-center fixed w-full top-0 z-50">
      <Link to="/" className="text-2xl font-bold text-gray-800">
        🛍️ MohitCart
      </Link>

      <div className="flex items-center gap-6 ">
        {/* Login/SignUp or Logout */}
        {!isLoggedIn ? (
          <>
            <Link
              to="/login"
              className="text-gray-800 hover:text-gray-600 font-medium"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="text-gray-800 hover:text-gray-600 font-medium"
            >
              Sign Up
            </Link>
          </>
        ) : (
          <div className="flex items-center gap-4 m-x-2">
            <button
              onClick={handleLogout}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm transition hover:bg-gray-100 hover:text-gray-900"
            >
                Me
            </button>

            <button
              onClick={handleLogout}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm transition hover:bg-gray-100 hover:text-gray-900"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      <Link
        to="/cart"
        className="relative text-gray-800 hover:text-gray-600 font-medium"
      >
        🛒 Cart
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold rounded-full px-2">
            {cartCount}
          </span>
        )}
      </Link>
    </nav>
  );
}

export default Navbar;
