import React, { useEffect, useState } from "react";
import {
  Package,
  MapPin,
  Phone,
  User,
  CreditCard,
  Clock,
  Edit2,
  XCircle,
  CheckCircle2,
  AlertCircle,
  X,
  Save,
} from "lucide-react";
import { Link } from "react-router-dom";

// Configuration hỗ trợ hiển thị Badge trạng thái
const STATUS_CONFIG = {
  PENDING: {
    label: "Chờ xử lý",
    color: "bg-amber-50 text-amber-700 border-amber-200",
  },
  CONFIRMED: {
    label: "Đã xác nhận",
    color: "bg-blue-50 text-blue-700 border-blue-200",
  },
  SHIPPED: {
    label: "Đang giao hàng",
    color: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  DELIVERED: {
    label: "Đã giao hàng",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  CANCELLED: {
    label: "Đã hủy",
    color: "bg-rose-50 text-rose-700 border-rose-200",
  },
};

const PAYMENT_LABELS = {
  COD: "Thanh toán khi nhận hàng (COD)",
  ONLINE: "Thanh toán trực tuyến",
};

export default function OrderPage({
  initialOrder,
  onUpdateOrder,
  onCancelOrder,
}) {
  // Giả định dữ liệu ban đầu
  const [orders, setOrders] = useState([]);
  console.log("order", orders);
  // State quản lý chế độ Chỉnh sửa thông tin
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    phone: "",
    address: "",
  });
  console.log("formdata", formData);
  // State quản lý Modal Hủy đơn
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReasonInput, setCancelReasonInput] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:8000/api/orders`, {
      method: "get",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch order");
        }
        return response.json();
      })
      .then((data) => {
        setOrders(data);
        console.log("Fetched order data:", data);

        console.log("form", orders);
        setLoading(false);
      })
      .catch((error) => {
        console.log("error", error);
        setLoading(false);
      });
  }, []);

  const updateOrder = async (id, form) => {
    fetch(`http://localhost:8000/api/orders/update/${id}`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to update order");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Fetched product data:", data);
    })
    .catch((error) => {
      console.log("error", error);
    });
  }

  // Kiểm tra xem đơn hàng có được phép chỉnh sửa / hủy hay không
  // const canModify = order.status === 'PENDING' || order.status === 'CONFIRMED';

  // Xử lý lưu thay đổi thông tin
  const handleSaveInfo = async (e) => {
    e.preventDefault();
    const updatedOrders = orders.map((order) => {
      if (order.id === formData.id) {
        return { ...order, ...formData };
      }
      
      return order;
    });
    await updateOrder(formData.id, formData);
    setOrders(updatedOrders);
    setIsEditingInfo(false);
    // if (onUpdateOrder) onUpdateOrder(updated);
  };

  // Xử lý xác nhận Hủy đơn
  const handleConfirmCancel = (e) => {
    // e.preventDefault();
    // if (!cancelReasonInput.trim()) return;
    // const updated = {
    //   ...order,
    //   status: 'CANCELLED',
    //   cancel_reason: cancelReasonInput,
    // };
    // setOrder(updated);
    // setIsCancelModalOpen(false);
    // if (onCancelOrder) onCancelOrder(updated);
  };

  return (
    <>
      {orders.map((order) => (
        <div className=" bg-slate-50 p-4 md:p-8 font-sans text-slate-800 mt-20">
          {/* {orders.map((order) => { */}
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header đơn hàng */}
            {/* <Link to={`/product/${order.id}`}> */}

            <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                    <Package className="w-6 h-6" />
                  </span>
                  <div>
                    <h1 className="text-xl font-bold text-slate-900">
                      Đơn hàng #DH-{order.id}
                    </h1>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(order.created_at).toLocaleString("vi-VN")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${STATUS_CONFIG[order.status]?.color}`}
                >
                  {STATUS_CONFIG[order.status]?.label || order.status}
                </span>
              </div>
            </div>

            {/* </Link> */}

            {/* Cảnh báo / Lý do hủy nếu đơn bị hủy */}
            {order.status === "CANCELLED" && (
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3 text-rose-800">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">
                    Đơn hàng này đã bị hủy
                  </p>
                  {order.cancel_reason && (
                    <p className="text-sm mt-1 text-rose-700">
                      Lý do: {order.cancel_reason}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Nội dung chính */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Cột trái: Thông tin nhận hàng (Cho phép Edit) */}
              <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-blue-100 p-6">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    Thông tin người nhận
                  </h2>
                  {/* {canModify && !isEditingInfo && ( */}
                  <button
                    onClick={() => setIsEditingInfo(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Chỉnh sửa
                  </button>
                </div>

                {isEditingInfo ? (
                  /* Form cập nhật thông tin */
                  <form onSubmit={handleSaveInfo} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Họ và tên
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            name: e.target.value,
                            id: order.id,
                          })
                        }
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Số điện thoại
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            phone: e.target.value,
                            id: order.id,
                          })
                        }
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Địa chỉ giao hàng
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            address: e.target.value,
                            id: order.id,
                          })
                        }
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            name: order.name,
                            phone: order.phone,
                            address: order.address,
                          });
                          setIsEditingInfo(false);
                        }}
                        className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition"
                      >
                        <Save className="w-3.5 h-3.5" />
                        Lưu thay đổi
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Hiển thị thông tin tĩnh */
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3 text-slate-700">
                      <User className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="font-medium text-slate-900">
                        {order.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-700">
                      <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{order.phone}</span>
                    </div>
                    <div className="flex items-start gap-3 text-slate-700">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <span>{order.address}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Cột phải: Thanh toán & Hành động */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6">
                  <h2 className="text-base font-bold text-slate-900 pb-3 mb-4 border-b border-slate-100 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    Thanh toán
                  </h2>

                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-xs text-slate-500">Phương thức</p>
                      <p className="font-semibold text-slate-800 mt-0.5">
                        {PAYMENT_LABELS[order.payment_method] ||
                          order.payment_method}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100">
                      <p className="text-xs text-slate-500">
                        Tổng tiền thanh toán
                      </p>
                      <p className="text-xl font-black text-blue-600 mt-1">
                        {Number(order.total_amount).toLocaleString("vi-VN")} đ
                      </p>
                    </div>
                  </div>
                </div>

                {/* Nút hủy đơn hàng */}
                {/* {canModify && ( */}
                <button
                  onClick={() => setIsCancelModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 rounded-2xl text-sm font-semibold transition shadow-sm"
                >
                  <XCircle className="w-4 h-4" />
                  Hủy đơn hàng này
                </button>
                {/* )} */}
              </div>
            </div>
          </div>

          {/* Modal Hủy Đơn Hàng */}
          {/* {isCancelModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-rose-500" />
                  Xác nhận hủy đơn hàng
                </h3>
                <button
                  onClick={() => setIsCancelModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleConfirmCancel} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Vui lòng nhập lý do hủy đơn <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Ví dụ: Đổi địa chỉ nhận hàng, Muốn mua sản phẩm khác..."
                    value={cancelReasonInput}
                    onChange={(e) => setCancelReasonInput(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCancelModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                  >
                    Quay lại
                  </button>
                  <button
                    type="submit"
                    disabled={!cancelReasonInput.trim()}
                    className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 rounded-xl shadow-sm transition"
                  >
                    Xác nhận hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        )} */}
        </div>
      ))}
    </>
  );
}
