import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../utils/auth";
import { useCart } from "../context/CartContext";

function CheckoutPage() {
  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    payment_method: "COD",
  });

  const nav = useNavigate();
  const { clearCart, total } = useCart();
  const BASEURL = 'http://localhost:8000';

  // Custom Confirm Modal State
  const [showConfirm, setShowConfirm] = useState(false);

  // QR & Payment State
  const [showQR, setShowQR] = useState(false);
  const [qrUrl, setQrUrl] = useState("");
  const [paymentStatus, setPaymentStatus] = useState(""); // "", "waiting", "success", "timeout"
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  
  const timerRef = useRef(null); // for timeout
  const countdownRef = useRef(null); // for visual countdown
  const sepayIntervalRef = useRef(null); // for sepay api

  useEffect(() => {
    return () => {
      clearAllIntervals();
    };
  }, []);

  const clearAllIntervals = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
    if (sepayIntervalRef.current) clearInterval(sepayIntervalRef.current);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const processOrder = async () => {
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
  };

  const checkSePayPayment = async (expectedText) => {
    try {
      const res = await authFetch(`${BASEURL}/api/orders/check-payment/?ref=${expectedText}`);
      const data = await res.json();
      
      if (data && data.success) {
        clearAllIntervals();
        setPaymentStatus("success");
        setTimeout(() => {
          setShowQR(false);
          processOrder();
        }, 2000);
      }
    } catch (err) {
      console.error("Sepay check error", err);
    }
  };

  const handleOnlinePayment = async () => {
    const orderRef = Math.random().toString(36).substring(2, 8).toUpperCase();
    const addInfo = `Chuyen tien mua hang tai MohitCart ${orderRef}`;
    const vndAmount = Math.round(total * 1000);
    
    try {
      const response = await fetch("https://api.vietqr.io/v2/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountNo: "0384758477",
          accountName: "NGO THANH LUC",
          acqId: 970422,
          amount: vndAmount,
          addInfo: addInfo,
          template: "compact2"
        })
      });
      const data = await response.json();
      
      if (data.code === "00") {
        setQrUrl(data.data.qrDataURL);
        setShowQR(true);
        setPaymentStatus("waiting");
        setTimeLeft(300);

        countdownRef.current = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              clearAllIntervals();
              setPaymentStatus("timeout");
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        sepayIntervalRef.current = setInterval(() => {
          checkSePayPayment(orderRef);
        }, 5000);

      } else {
        alert("Lỗi tạo mã QR: " + data.desc);
      }
    } catch (err) {
      console.error("QR Generation Error:", err);
      alert("Lỗi khi tạo mã QR");
    }
  };

  const handleInitialSubmit = (e) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const confirmSubmit = () => {
    setShowConfirm(false);
    if (form.payment_method === "ONLINE") {
      handleOnlinePayment();
    } else {
      processOrder();
    }
  };

  const closeQRModal = () => {
    setShowQR(false);
    clearAllIntervals();
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="pt-20 p-6 relative min-h-screen">
      <div className="max-w-lg mx-auto bg-white p-6 shadow rounded relative z-10">
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>

        <form onSubmit={handleInitialSubmit} className="space-y-3">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your Name"
            required
            className="w-full p-2 border rounded"
          />

          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Address"
            required
            className="w-full p-2 border rounded"
          />

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            required
            className="w-full p-2 border rounded"
          />

          <select
            name="payment_method"
            value={form.payment_method}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="COD">Cash on Delivery</option>
            <option value="ONLINE">Online Payment</option>
          </select>

          <button className="w-full bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700 transition">
            Place Order
          </button>
        </form>
      </div>

      {/* Custom Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-gray-800/50 backdrop-blur-sm flex items-center justify-center z-40 transition-opacity">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full border border-gray-100">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Xác nhận thông tin</h2>
            <div className="space-y-2 mb-6 text-gray-700">
              <p><span className="font-semibold w-32 inline-block">Họ tên:</span> {form.name}</p>
              <p><span className="font-semibold w-32 inline-block">Địa chỉ:</span> {form.address}</p>
              <p><span className="font-semibold w-32 inline-block">Số điện thoại:</span> {form.phone}</p>
              <p><span className="font-semibold w-32 inline-block">Thanh toán:</span> {form.payment_method === "ONLINE" ? "Chuyển khoản (VietQR)" : "Tiền mặt (COD)"}</p>
              <div className="border-t pt-2 mt-2">
                <p className="text-lg text-red-600 font-bold">Tổng tiền: ${total.toFixed(2)}</p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={confirmSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal Overlay */}
      {showQR && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity">
          <div className="bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full text-center relative border border-gray-100">
            {paymentStatus !== "success" && (
              <button 
                onClick={closeQRModal}
                className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 font-bold text-2xl transition"
              >
                &times;
              </button>
            )}
            <h2 className="text-xl font-bold mb-4 text-gray-800">Thanh toán Online</h2>
            
            {paymentStatus === "success" ? (
              <div className="py-6">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <div className="text-green-600 font-bold text-lg">Thanh toán thành công!</div>
                <p className="text-sm text-gray-500 mt-2">Hệ thống đang xử lý đơn hàng...</p>
              </div>
            ) : paymentStatus === "timeout" ? (
              <div className="py-6">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </div>
                <div className="text-red-600 font-bold mb-2">Mã QR đã hết hạn (5 phút)</div>
                <p className="text-sm text-gray-500 mb-4">Giao dịch chưa được hoàn tất.</p>
                <button 
                  onClick={closeQRModal}
                  className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
                >
                  Đóng
                </button>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-600 mb-3">Sử dụng App ngân hàng để quét mã</p>
                <div className="bg-gray-50 p-2 rounded-lg inline-block mb-4 border border-gray-100 shadow-sm">
                  <img src={qrUrl} alt="VietQR" className="mx-auto rounded" />
                </div>
                
                <div className="bg-blue-50 text-blue-800 p-3 rounded-lg mb-4 text-sm font-medium flex flex-col items-center">
                  <span>Mã QR sẽ hết hạn sau:</span>
                  <span className="font-bold text-red-500 text-xl mt-1">{formatTime(timeLeft)}</span>
                </div>

                <div className="flex items-center justify-center space-x-2 text-blue-600">
                  <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm font-medium">Đang chờ thanh toán...</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CheckoutPage;