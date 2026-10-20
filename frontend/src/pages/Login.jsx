
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  UserRound,
  LockKeyhole,
  TicketPercent,
  Truck,
  RefreshCw,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";

import { saveTokens } from "../utils/auth";
import { useUser } from "../context/UserContext.jsx";

function Login() {
  const navigate = useNavigate();
  const { refreshUser } = useUser();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8000/api/token/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          "Tên đăng nhập hoặc mật khẩu không chính xác."
        );
      }

      saveTokens(data);

      // Đồng bộ tài khoản đăng nhập với UserContext
      await refreshUser();

      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Đăng nhập thất bại.");
    } finally {
      setLoading(false);
    }
  };

  const promotions = [
    {
      icon: TicketPercent,
      title: "Giảm 20% tất cả sản phẩm",
      description: "Ưu đãi đặc biệt nhân dịp khai trương",
    },
    {
      icon: Truck,
      title: "Miễn phí vận chuyển toàn quốc",
      description: "Mua sắm thuận tiện ở mọi tỉnh thành",
    },
    {
      icon: RefreshCw,
      title: "Thu cũ lên đời mới",
      description: "Áp dụng khi mua trực tiếp tại cửa hàng",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FC] pt-24 pb-10 px-4 flex items-center justify-center">
      <div className="w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-xl shadow-blue-950/10 border border-blue-100">
        <div className="grid grid-cols-1 lg:grid-cols-2">

          {/* CỘT TRÁI - KHUYẾN MÃI KHAI TRƯƠNG */}
          <section className="relative overflow-hidden bg-gradient-to-br from-[#EAF2FF] via-[#F5F9FF] to-[#DCEAFF] px-7 py-10 md:px-12 md:py-14">

            {/* Họa tiết trang trí */}
            <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-blue-300/20 blur-3xl" />
            <div className="absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-indigo-400/20 blur-3xl" />

            <div className="relative z-10">
              {/* Logo */}
              <div className="mb-10 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#173B87] text-white shadow-lg shadow-blue-900/20">
                  <ShoppingBag size={24} />
                </div>

                <div>
                  <h2 className="text-2xl font-extrabold text-[#142D60]">
                    LapZone
                  </h2>
                  <p className="text-xs tracking-widest text-blue-700">
                    LAPTOP STORE
                  </p>
                </div>
              </div>

              {/* Tiêu đề */}
              <div className="mb-8">
                <span className="inline-block rounded-full border border-blue-200 bg-white/80 px-4 py-1.5 text-xs font-semibold tracking-wider text-blue-700">
                  GRAND OPENING
                </span>

                <h1 className="mt-5 text-3xl font-extrabold leading-tight text-[#142D60] md:text-4xl">
                  Chào mừng
                  <br />
                  khai trương LapZone!
                </h1>

                <p className="mt-4 text-sm leading-7 text-slate-600">
                  Khám phá những đặc quyền mua sắm hấp dẫn
                  dành riêng cho khách hàng trong dịp khai trương.
                </p>
              </div>

              {/* Danh sách ưu đãi */}
              <div className="space-y-4">
                {promotions.map((promotion, index) => {
                  const Icon = promotion.icon;

                  return (
                    <div
                      key={index}
                      className="flex items-start gap-4 rounded-2xl border border-blue-100 bg-white/85 p-4 shadow-sm"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#2458B6]">
                        <Icon size={23} />
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-[#142D60]">
                          {promotion.title}
                        </h3>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          {promotion.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="mt-8 text-xs text-slate-500">
                LapZone – Công nghệ đồng hành cùng bạn.
              </p>
            </div>
          </section>

          {/* CỘT PHẢI - FORM ĐĂNG NHẬP */}
          <section className="flex items-center justify-center px-7 py-12 md:px-14 md:py-16">
            <div className="w-full max-w-md">

              <div className="mb-10 text-center">
                <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-[#173B87]">
                  <UserRound size={30} />
                </div>

                <h2 className="text-3xl font-bold text-[#142D60]">
                  Đăng nhập LapZone
                </h2>

                <p className="mt-3 text-sm text-slate-500">
                  Chào mừng bạn quay trở lại!
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">

                {/* Tài khoản */}
                <div>
                  <label
                    htmlFor="username"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Tên đăng nhập
                  </label>

                  <div className="relative">
                    <UserRound
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="username"
                      type="text"
                      required
                      autoComplete="username"
                      placeholder="Nhập tên đăng nhập"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>
                </div>

                {/* Mật khẩu */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Mật khẩu
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      autoComplete="current-password"
                      placeholder="Nhập mật khẩu"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-12 pr-12 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={
                        showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-blue-700"
                    >
                      {showPassword ? (
                        <EyeOff size={19} />
                      ) : (
                        <Eye size={19} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Thông báo lỗi */}
                {error && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
                  >
                    {error}
                  </div>
                )}

                {/* Đăng nhập */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#173B87] px-5 py-3.5 font-semibold text-white shadow-lg shadow-blue-900/15 transition hover:bg-[#102B65] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Đang đăng nhập..." : "Đăng nhập"}

                  {!loading && (
                    <ArrowRight
                      size={18}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  )}
                </button>
              </form>

              <div className="mt-9 border-t border-slate-100 pt-7 text-center">
                <p className="text-sm text-slate-500">
                  Bạn chưa có tài khoản?{" "}
                  <Link
                    to="/signup"
                    className="font-semibold text-[#2458B6] hover:underline"
                  >
                    Đăng ký ngay
                  </Link>
                </p>
              </div>

              <p className="mt-10 text-center text-xs text-slate-400">
                © LapZone – Laptop & Technology
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

export default Login;
