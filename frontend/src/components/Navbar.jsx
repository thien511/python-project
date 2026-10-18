import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { clearTokens, getAccessToken } from "../utils/auth.js";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp, LogOut, Package, Truck } from "lucide-react";

function Navbar() {
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const token = localStorage.getItem("access_token");
  const isLoggedIn = !!getAccessToken();
  const location = useLocation();
  console.log("user", user);
  const handleLogout = () => {
    clearTokens();
    navigate("/login");
  };

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const justLoggedIn = sessionStorage.getItem("justLoggedIn");
    if (justLoggedIn || !user) {
      fetch(`http://localhost:8000/api/profile`, {
        method: "get",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch profile");
          }
          return response.json();
        })
        .then((data) => {
          setUser(data);
          console.log("Fetched product data:", data);
          sessionStorage.removeItem('justLoggedIn');
        })
        .catch((error) => {
          console.log("error", error);
          setUser(null);
        })
    }
  }, [location.pathname]);

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

      <div className={`flex items-center gap-6 ${user?.role === "manager" ? "mr-30" : ""}`}>
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
                  {user?.role === "user" && (
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
                  )}
                  {user?.role === "manager" && (
                    <>
                      {/* Quản lý đơn hàng */}
                      <Link
                        to="/manage/orders"
                        onClick={() => setIsOpen(false)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors duration-150"
                      >
                        <Truck className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">Quản lý đơn hàng</span>
                      </Link>

                      {/* Quản lý sản phẩm */}
                      <Link
                        to="/manage"
                        onClick={() => setIsOpen(false)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors duration-150"
                      >
                        <Package className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">Quản lý sản phẩm</span>
                      </Link>
                    </>
                  )}

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
        {user?.role === "user" && (
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
        )}
      </div>
    </nav>
  );
}

export default Navbar;
