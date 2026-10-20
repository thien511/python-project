
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  UserRound,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  UserPlus,
  ShoppingBag,
  TicketPercent,
  Truck,
  RefreshCw,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    if (form.password.length < 8) {
      setError("Mật khẩu phải có ít nhất 8 ký tự.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8000/api/register/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: form.username.trim(),
            email: form.email.trim(),
            password: form.password,
            password2: form.confirmPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        const message = Object.values(data)
          .flat()
          .join(" ");

        throw new Error(message || "Đăng ký thất bại.");
      }

      alert("Tạo tài khoản thành công! Hãy đăng nhập.");
      navigate("/login", { replace: true });
    } catch (err) {
      setError(err.message || "Không thể kết nối máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  const promotions = [
    {
      icon: TicketPercent,
      title: "Giảm 20% tất cả sản phẩm",
      description: "Ưu đãi hấp dẫn nhân dịp khai trương",
    },
    {
      icon: Truck,
      title: "Miễn phí vận chuyển toàn quốc",
      description: "Mua sắm thuận tiện trên toàn quốc",
    },
    {
      icon: RefreshCw,
      title: "Thu cũ lên đời mới",
      description: "Áp dụng khi mua trực tiếp tại cửa hàng",
    },
  ];

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white py-3 pl-12 pr-12 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10";

  return (
    <div className="min-h-screen bg-[#F5F7FC] px-4 pb-10 pt-24 flex items-center justify-center">
      <div className="w-full max-w-6xl overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-xl shadow-blue-950/10">
        <div className="grid grid-cols-1 lg:grid-cols-2">

          {/* CỘT TRÁI - GIỚI THIỆU ƯU ĐÃI */}
          <section className="relative overflow-hidden bg-gradient-to-br from-[#EAF2FF] via-[#F5F9FF] to-[#DCEAFF] px-7 py-10 md:px-12 md:py-14">
            <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-blue-300/20 blur-3xl" />
            <div className="absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-indigo-400/20 blur-3xl" />

            <div className="relative z-10">
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

              <span className="inline-block rounded-full border border-blue-200 bg-white/80 px-4 py-1.5 text-xs font-semibold tracking-wider text-blue-700">
                GRAND OPENING
              </span>

              <h1 className="mt-5 text-3xl font-extrabold leading-tight text-[#142D60] md:text-4xl">
                Gia nhập LapZone,
                <br />
                nhận ngay ưu đãi!
              </h1>

              <p className="mt-4 text-sm leading-7 text-slate-600">
                Tạo tài khoản để bắt đầu hành trình khám phá
                và mua sắm laptop cùng LapZone.
              </p>

              <div className="mt-8 space-y-4">
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

          {/* CỘT PHẢI - FORM ĐĂNG KÝ */}
          <section className="flex items-center justify-center px-7 py-10 md:px-14 md:py-12">
            <div className="w-full max-w-md">
              <div className="mb-7 text-center">
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#173B87]">
                  <UserPlus size={28} />
                </div>

                <h2 className="text-3xl font-bold text-[#142D60]">
                  Tạo tài khoản
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Đăng ký để trở thành thành viên LapZone.
                </p>
              </div>

              <form onSubmit={handleSignup} className="space-y-4">

                {/* TÊN ĐĂNG NHẬP */}
                <div>
                  <label
                    htmlFor="signup-username"
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
                      id="signup-username"
                      type="text"
                      required
                      autoComplete="username"
                      placeholder="Nhập tên đăng nhập"
                      value={form.username}
                      onChange={(e) =>
                        updateField("username", e.target.value)
                      }
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* EMAIL */}
                <div>
                  <label
                    htmlFor="signup-email"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Email
                  </label>

                  <div className="relative">
                    <Mail
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="signup-email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="Nhập địa chỉ email"
                      value={form.email}
                      onChange={(e) =>
                        updateField("email", e.target.value)
                      }
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* MẬT KHẨU */}
                <div>
                  <label
                    htmlFor="signup-password"
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
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      required
                      autoComplete="new-password"
                      placeholder="Nhập mật khẩu (ít nhất 8 ký tự)"
                      value={form.password}
                      onChange={(e) =>
                        updateField("password", e.target.value)
                      }
                      className={inputClass}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-700"
                    >
                      {showPassword ? (
                        <EyeOff size={19} />
                      ) : (
                        <Eye size={19} />
                      )}
                    </button>
                  </div>
                </div>

                {/* XÁC NHẬN MẬT KHẨU */}
                <div>
                  <label
                    htmlFor="signup-confirm"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Xác nhận mật khẩu
                  </label>

                  <div className="relative">
                    <CheckCircle2
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="signup-confirm"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      autoComplete="new-password"
                      placeholder="Nhập lại mật khẩu"
                      value={form.confirmPassword}
                      onChange={(e) =>
                        updateField("confirmPassword", e.target.value)
                      }
                      className={inputClass}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      aria-label={
                        showConfirmPassword
                          ? "Ẩn mật khẩu xác nhận"
                          : "Hiện mật khẩu xác nhận"
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-700"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={19} />
                      ) : (
                        <Eye size={19} />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
                  >
                    {error}
                  </div>
                )}

                {/* NÚT ĐĂNG KÝ */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#173B87] px-5 py-3.5 font-semibold text-white shadow-lg shadow-blue-900/15 transition hover:bg-[#102B65] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}

                  {!loading && (
                    <ArrowRight
                      size={18}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  )}
                </button>
              </form>

              <div className="mt-7 border-t border-slate-100 pt-6 text-center">
                <p className="text-sm text-slate-500">
                  Đã có tài khoản?{" "}
                  <Link
                    to="/login"
                    className="font-semibold text-[#2458B6] hover:underline"
                  >
                    Đăng nhập ngay
                  </Link>
                </p>
              </div>

              <p className="mt-7 text-center text-xs text-slate-400">
                © LapZone – Laptop & Technology
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Signup;
