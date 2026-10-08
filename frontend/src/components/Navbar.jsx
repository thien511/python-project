import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { clearTokens, getAccessToken } from "../utils/auth.js";
import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  LogOut,
  Package,
  Search,
  Truck,
} from "lucide-react";

function Navbar() {
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const isLoggedIn = !!getAccessToken();

  const handleLogout = () => {
    clearTokens();
    navigate("/login");
  };

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    // Chuyển sang trang chủ kèm query string ?search=...
    navigate(`/?search=${encodeURIComponent(searchQuery)}`);
  };

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white shadow-md px-6 py-6 flex justify-between items-center fixed w-full top-0 z-50 gap-6">
      <Link to="/" className="text-2xl font-bold text-gray-800">
        🛍️ LapZone
      </Link>

      <form className="flex items-center gap-3" onChange={handleSearch}>
        <div className="relative">
          <Search
            className="absolute left-3 top-2.5 text-slate-400"
            size={14}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên, CPU..."
            className="text-xs rounded-xl border border-slate-200 pl-8 pr-3 py-2 w-48 sm:w-64 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <button
          className="text-xs rounded-xl border border-slate-200 px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer hover:bg-slate-50 transition"
          type="submit"
        >
          Tìm
        </button>
      </form>

      <div className="flex items-center gap-6">
        {/* Login/SignUp or Logout */}
        {!isLoggedIn ? (
          <>
            <Link
              to="/login"
              className="text-gray-800 hover:text-gray-600 font-medium mr-4"
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
          <div
            className="flex items-center gap-4 m-x-2 relative inline-block"
            ref={containerRef}
          >
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-white border border-gray-200 rounded-lg shadow-sm text-gray-800 font-medium focus:outline-none transition-all duration-150"
            >
              <span>Tài khoản</span>
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
                    onClick={() => {
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors duration-150"
                  >
                    <Link to="/myOrder" className="flex items-center gap-3">
                      <Truck className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">Đơn hàng của tôi</span>
                    </Link>
                  </button>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors duration-150"
                  >
                    <Link to="/addProduct" className="flex items-center gap-3">
                      <Package className="w-4 h-4 text-gray-500 group-hover:text-blue-600" />
                      <span className="font-medium">Thêm sản phẩm</span>
                    </Link>
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors duration-150"
                  >
                    <LogOut className="w-4 h-4 text-gray-500 group-hover:text-blue-600" />
                    <span className="font-medium">Đăng xuất</span>
                  </button>
                </ul>
              </div>
            )}
          </div>
        )}
        <Link
          to="/cart"
          className="relative text-gray-800 hover:text-gray-600 font-medium border-gray-300 rounded-lg"
        >
          🛒 Giỏ hàng
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold rounded-full px-2">
              {cartCount}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
