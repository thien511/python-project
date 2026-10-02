import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { clearTokens, getAccessToken } from "../utils/auth.js";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp, LogOut, Package, Truck } from "lucide-react";

function Navbar() {
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const isLoggedIn = !!getAccessToken();

  const handleLogout = () => {
    clearTokens();
    navigate("/login");
  };

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav
      className="bg-white shadow-md px-6 py-6 flex justify-between items-center fixed w-full top-0 z-50 gap-6"
      ref={dropdownRef}
    >
      <Link to="/" className="text-2xl font-bold text-gray-800">
        🛍️ huy cart
      </Link>

      <div className="flex items-center">
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
          <div className="flex items-center gap-4 m-x-2 relative inline-block">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-white border border-gray-200 rounded-lg shadow-sm text-gray-800 font-medium hover:bg-gray-50 focus:outline-none transition-all duration-150"
            >
              <span>Me</span>
              {isOpen ? (
                <ChevronUp className="w-4 h-4 text-gray-600" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-600" />
              )}
            </button>
            {isOpen && (
              <div className="absolute left-0 mt-2 w-60 bg-white rounded-xl shadow-xl border border-gray-100 z-50 py-2 animate-in fade-in slide-in-from-top-2 duration-150">
                <ul className="flex flex-col">
                  <button
                    onClick={() => {}}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors duration-150"
                  >
                    <Truck className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">My Orders</span>
                  </button>
                  <button
                    onClick={() => {}}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors duration-150"
                  >
                    <Package className="w-4 h-4 text-gray-500 group-hover:text-blue-600" />
                    <span className="font-medium">Add Product</span>
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors duration-150"
                  >
                    <LogOut className="w-4 h-4 text-gray-500 group-hover:text-blue-600" />
                    <span className="font-medium">Logout</span>
                  </button>
                </ul>
              </div>
            )}
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
