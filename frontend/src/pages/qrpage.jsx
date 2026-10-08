import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authFetch } from "../utils/auth";
import { useCart } from "../context/CartContext";

export default function QRPage() {
  const location = useLocation();
  const nav = useNavigate();
  const { clearCart } = useCart();
  const BASEURL = 'http://localhost:8000';

  // Get data passed from CheckoutPage
  const formData = location.state?.form;
  const total = location.state?.total;

  const [qrUrl, setQrUrl] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("waiting"); // "waiting", "success", "timeout"
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  
  const timerRef = useRef(null);
  const countdownRef = useRef(null);
  const sepayIntervalRef = useRef(null);

  useEffect(() => {
    if (!formData || !total) {
      alert("Không có thông tin đơn hàng!");
      nav("/checkout");
      return;
    }
    handleGenerateQR();

    return () => {
      clearAllIntervals();
    };
  }, []);

  const clearAllIntervals = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
    if (sepayIntervalRef.current) clearInterval(sepayIntervalRef.current);
  };

  const processOrder = async () => {
    try {
      const res = await authFetch(`${BASEURL}/api/orders/create/`, {
        method: "POST",
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        clearCart();
        alert("Thanh toán và tạo đơn hàng thành công!");
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
          processOrder();
        }, 2000);
      }
    } catch (err) {
      console.error("Sepay check error", err);
    }
  };

  const handleGenerateQR = async () => {
    const orderRef = Math.random().toString(36).substring(2, 8).toUpperCase();
    const vndAmount = Math.round(total * 1000); // adjust multiplier as per your logic
    
    try {
      // GỌI API BACKEND (PYTHON) ĐỂ TẠO QR THAY VÌ GỌI TRỰC TIẾP VIETQR
      const response = await authFetch(`${BASEURL}/api/orders/generate-qr/`, {
        method: "POST",
        body: JSON.stringify({
          amount: vndAmount,
          order_ref: orderRef
        })
      });
      const data = await response.json();
      
      if (data.success) {
        setQrUrl(data.qrDataURL);
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
        alert("Lỗi tạo mã QR từ server: " + data.message);
      }
    } catch (err) {
      console.error("QR Generation Error:", err);
      alert("Lỗi khi kết nối đến server để tạo mã QR");
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="min-h-screen text-slate-100 flex items-center justify-center p-4 sm:p-6 font-sans mt-10">
      <div className="bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full text-center relative border border-gray-100">
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
              onClick={() => nav("/checkout")}
              className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
            >
              Quay lại Checkout
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-600 mb-3">Sử dụng App ngân hàng để quét mã</p>
            <div className="bg-gray-50 p-2 rounded-lg inline-block mb-4 border border-gray-100 shadow-sm min-h-[200px] flex items-center justify-center">
              {qrUrl ? (
                <img src={qrUrl} alt="VietQR" className="mx-auto rounded" />
              ) : (
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              )}
            </div>
            
            <div className="bg-blue-50 text-blue-800 p-3 rounded-lg mb-4 text-sm font-medium flex flex-col items-center">
              <span>Mã QR sẽ hết hạn sau:</span>
              <span className="font-bold text-red-500 text-xl mt-1">{formatTime(timeLeft)}</span>
            </div>

            <div className="flex items-center justify-center space-x-2 text-blue-600">
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-medium">Đang chờ thanh toán...</span>
            </div>
            
            <button 
              onClick={() => nav("/checkout")}
              className="mt-4 text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Hủy thanh toán
            </button>
          </>
        )}
      </div>
    </div>
  );
}