import React, { useState } from "react";
import {
  CreditCard,
  Banknote,
  CheckCircle2,
  QrCode,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Info,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const [selectedMethod, setSelectedMethod] = useState("online"); // 'online' or 'cash'
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { total } = useCart();
  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    payment_method: "COD",
  });
  const [errors, setErrors] = useState({});

  const nav = useNavigate();
  const { clearCart } = useCart();
  const BASEURL = "http://localhost:8000";

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleConfirm = async () => {
    setIsProcessing(true);

    e.preventDefault();

    try {
      const res = await authFetch(`${BASEURL}/api/orders/create/`, {
        method: "POST",
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        clearCart();
        alert("Order placed successfully!");
        nav("/");
      } else {
        alert(data.error || "Order failed");
      }
    } catch (error) {
      console.error("Checkout error:", error);
    }

    setTimeout(() => {
      setIsProcessing(false);
      setIsSubmitted(true);
    }, 800);
  };

  const handleReset = () => {
    setIsSubmitted(false);
  };

  return (
    <div className="min-h-screen text-slate-100 flex items-center justify-center p-4 sm:p-6 font-sans mt-10">
      {/* Background Decorative Blur Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <main className="w-full max-w-xl relative z-10">
        {!isSubmitted ? (
          <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/60 rounded-3xl p-6 sm:p-8 shadow-2xl transition-all duration-300">
            {/* Header */}
            <div className="mb-8 text-center">
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Chọn phương thức thanh toán
              </h1>
            </div>

            {/* Main Options: Online vs Cash */}
            <div className="space-y-4 mb-6">
              {/* Option 1: Online Payment */}
              <div
                onClick={() => setSelectedMethod("online")}
                className={`relative group cursor-pointer p-5 rounded-2xl border-2 transition-all duration-300 flex items-start gap-4 ${
                  selectedMethod === "online"
                    ? "bg-indigo-950/40 border-indigo-500 shadow-lg shadow-indigo-500/10"
                    : "bg-slate-800/40 border-slate-700/60 hover:border-slate-600 hover:bg-slate-800/80"
                }`}
              >
                <div
                  className={`p-3 rounded-xl transition-colors duration-300 ${
                    selectedMethod === "online"
                      ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/30"
                      : "bg-slate-700/50 text-slate-400 group-hover:text-slate-200"
                  }`}
                >
                  <CreditCard className="w-6 h-6" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-white text-base">
                      Thanh toán Online
                    </h3>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedMethod === "online"
                          ? "border-indigo-500 bg-indigo-500"
                          : "border-slate-600"
                      }`}
                    >
                      {selectedMethod === "online" && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                  </div>

                  {/* Sub-options for Online Payment */}
                  {selectedMethod === "online" && (
                    <div className="mt-4 pt-4 border-t border-indigo-500/20 grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-medium transition-all ${"bg-indigo-500/20 border-indigo-500 text-indigo-300"}`}
                      >
                        <QrCode className="w-4 h-4 mb-1" />
                        Quét mã QR
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Option 2: Cash Payment */}
              <div
                onClick={() => setSelectedMethod("cash")}
                className={`relative group cursor-pointer p-5 rounded-2xl border-2 transition-all duration-300 flex items-start gap-4 ${
                  selectedMethod === "cash"
                    ? "bg-emerald-950/40 border-emerald-500 shadow-lg shadow-emerald-500/10"
                    : "bg-slate-800/40 border-slate-700/60 hover:border-slate-600 hover:bg-slate-800/80"
                }`}
              >
                <div
                  className={`p-3 rounded-xl transition-colors duration-300 ${
                    selectedMethod === "cash"
                      ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30"
                      : "bg-slate-700/50 text-slate-400 group-hover:text-slate-200"
                  }`}
                >
                  <Banknote className="w-6 h-6" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-white text-base">
                      Tiền mặt (Cash / COD)
                    </h3>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedMethod === "cash"
                          ? "border-emerald-500 bg-emerald-500"
                          : "border-slate-600"
                      }`}
                    >
                      {selectedMethod === "cash" && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Thanh toán trực tiếp bằng tiền mặt khi nhận hàng
                  </p>

                  {selectedMethod === "cash" && (
                    <div
                      className="mt-4 pt-4 border-t border-emerald-500/20 space-y-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Họ và tên <span className="text-rose-400">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Nguyễn Văn A"
                          // value={cashDetails.fullName}
                          // onChange={(e) =>
                          //   handleInputChange("fullName", e.target.value)
                          // }
                          className={`w-full px-3 py-2 rounded-xl bg-slate-900/80 border ${
                            errors.fullName
                              ? "border-rose-500/80"
                              : "border-slate-700/80 focus:border-emerald-500"
                          } text-sm text-white placeholder-slate-500 outline-none transition-all`}
                        />
                        {errors.fullName && (
                          <p className="text-xs text-rose-400 mt-1">
                            {errors.fullName}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Số điện thoại <span className="text-rose-400">*</span>
                        </label>
                        <input
                          type="tel"
                          placeholder="0912345678"
                          // value={cashDetails.phone}
                          // onChange={(e) =>
                          //   handleInputChange("phone", e.target.value)
                          // }
                          className={`w-full px-3 py-2 rounded-xl bg-slate-900/80 border ${
                            errors.phone
                              ? "border-rose-500/80"
                              : "border-slate-700/80 focus:border-emerald-500"
                          } text-sm text-white placeholder-slate-500 outline-none transition-all`}
                        />
                        {errors.phone && (
                          <p className="text-xs text-rose-400 mt-1">
                            {errors.phone}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Địa chỉ giao hàng{" "}
                          <span className="text-rose-400">*</span>
                        </label>
                        <textarea
                          rows="2"
                          placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."
                          // value={cashDetails.address}
                          // onChange={(e) =>
                          //   handleInputChange("address", e.target.value)
                          // }
                          className={`w-full px-3 py-2 rounded-xl bg-slate-900/80 border ${
                            errors.address
                              ? "border-rose-500/80"
                              : "border-slate-700/80 focus:border-emerald-500"
                          } text-sm text-white placeholder-slate-500 outline-none transition-all resize-none`}
                        />
                        {errors.address && (
                          <p className="text-xs text-rose-400 mt-1">
                            {errors.address}
                          </p>
                        )}
                      </div>

                      <div className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2.5 flex items-center gap-2 mt-2">
                        <Info className="w-4 h-4 shrink-0" />
                        Vui lòng chuẩn bị sẵn tiền mặt khi shipper giao tới.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Summary Box */}
            <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-700/40 mb-6">
              <div className="flex justify-between items-center text-sm text-slate-400 mb-1">
                <span>Tổng tiền thanh toán:</span>
                <span className="text-xs text-emerald-400 font-medium">
                  Đã bao gồm VAT
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-slate-500">
                  Mã đơn: #DH-202688
                </span>
                <span className="text-2xl font-bold text-white tracking-tight">
                  {total.toFixed(2)} đ
                </span>
              </div>
            </div>

            {/* Confirm Button */}
            <button
              onClick={handleConfirm}
              disabled={isProcessing}
              className={`w-full py-4 px-6 rounded-2xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${
                selectedMethod === "online"
                  ? "bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 shadow-indigo-500/25"
                  : "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-emerald-500/25"
              } disabled:opacity-50 cursor-pointer`}
            >
              {isProcessing ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Xác nhận thanh toán</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        ) : (
          /* Success Screen */
          <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/60 rounded-3xl p-8 shadow-2xl text-center animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">
              Đã chọn phương thức!
            </h2>
            <p className="text-slate-400 text-sm mb-6">
              Bạn đã chọn hình thức thanh toán:{" "}
              <strong className="text-white font-semibold">
                {selectedMethod === "online"
                  ? `Thanh toán Online (qr)`
                  : "Tiền mặt khi nhận hàng (COD)"}
              </strong>
            </p>

            <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-700/40 text-left mb-6 space-y-2 text-sm">
              <div className="flex justify-between text-slate-400">
                <span>Trạng thái:</span>
                <span className="text-amber-400 font-medium">
                  Chờ xử lý đơn hàng
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Số tiền:</span>
                <span className="text-white font-bold">
                  {total.toFixed(2)} đ
                </span>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="w-full py-3.5 px-6 rounded-xl bg-slate-700 hover:bg-slate-600 font-medium text-white transition-all cursor-pointer"
            >
              Chọn lại phương thức khác
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
