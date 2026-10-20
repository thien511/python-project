
import { useEffect, useState } from "react";
import { authFetch } from "../utils/auth";

const STATUS_LABELS = {
  PENDING: "Chờ xử lý",
  CONFIRMED: "Đã xác nhận",
  SHIPPED: "Đang giao hàng",
  DELIVERED: "Đã giao hàng",
  CANCELLED: "Đã hủy",
};

function ManagerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [expandedOrders, setExpandedOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await authFetch(
          "http://localhost:8000/api/manager/orders/"
        );

        if (!response.ok) {
          throw new Error(
            `Không thể tải đơn hàng (HTTP ${response.status})`
          );
        }

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);
  const toggleOrderDetails = (orderId) => {
    setExpandedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };
  if (loading) {
    return <div className="pt-32 text-center">Đang tải đơn hàng...</div>;
  }


  const updateOrderStatus = async (orderId, newStatus) => {
    // Những trạng thái quan trọng cần xác nhận
    if (["CONFIRMED", "CANCELLED"].includes(newStatus)) {
      setConfirmAction({ orderId, newStatus });
      return;
    }

    await saveOrderStatus(orderId, newStatus);
  };

  // Gửi yêu cầu cập nhật trạng thái tới Django
  const saveOrderStatus = async (orderId, newStatus) => {
    if (updatingId !== null) return false;

    setUpdatingId(orderId);

    try {
      const response = await authFetch(
        `http://localhost:8000/api/manager/orders/${orderId}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Cập nhật trạng thái thất bại");
      }

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? data.order : order
        )
      );

      return true;
    } catch (error) {
      alert(error.message || "Có lỗi xảy ra");
      return false;
    } finally {
      setUpdatingId(null);
    }
  };


  if (error) {
    return <div className="pt-32 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-28 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          Quản lý đơn hàng
        </h1>

        <p className="mb-6">
          Tổng số đơn hàng: {orders.length}
        </p>

        {orders.length === 0 ? (
          <p>Chưa có đơn hàng nào.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white p-6 rounded-xl shadow border"
              >
                <button
                  type="button"
                  onClick={() => toggleOrderDetails(order.id)}
                  aria-expanded={expandedOrders.includes(order.id)}
                  className="flex w-full items-center justify-between mb-3 text-left group"
                >
                  <span className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors cursor-pointer">
                    Đơn hàng #DH-{order.id}
                  </span>

                  <span
                    className={`text-blue-700 text-xl transition-transform duration-300 ${expandedOrders.includes(order.id) ? "rotate-180" : ""
                      }`}
                  >
                    ▾
                  </span>
                </button>

                <p>Khách hàng: {order.name}</p>
                <p>Số điện thoại: {order.phone}</p>
                <p>Địa chỉ: {order.address}</p>

                <div className="flex items-center gap-3 mt-2">
                  <span className="font-medium">Trạng thái:</span>

                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateOrderStatus(order.id, e.target.value)
                    }
                    disabled={
                      updatingId !== null ||
                      ["DELIVERED", "CANCELLED"].includes(order.status)
                    }
                    className="border rounded-lg px-3 py-2 bg-white cursor-pointer"
                  >
                    <option value={order.status}>
                      {STATUS_LABELS[order.status]}
                    </option>

                    {order.status === "PENDING" && (
                      <>
                        <option value="CONFIRMED">Đã xác nhận</option>
                        <option value="CANCELLED">Đã hủy</option>
                      </>
                    )}

                    {order.status === "CONFIRMED" && (
                      <>
                        <option value="SHIPPED">Đang giao hàng</option>
                        <option value="CANCELLED">Đã hủy</option>
                      </>
                    )}

                    {order.status === "SHIPPED" && (
                      <option value="DELIVERED">Đã giao hàng</option>
                    )}
                  </select>
                </div>


                <p className="font-bold text-blue-600 mt-3">
                  Tổng tiền: {Number(order.total_amount).toLocaleString("vi-VN")}đ
                </p>


                {expandedOrders.includes(order.id) && (
                  <div className="mt-4 overflow-hidden rounded-xl border border-blue-100 bg-white">
                    {/* Tiêu đề bảng */}
                    <div className="flex items-center justify-between bg-[#F5F8FF] px-4 py-3">
                      <h3 className="font-semibold text-[#142D60]">
                        Sản phẩm đã mua
                      </h3>

                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                        {order.items?.length || 0} loại sản phẩm
                      </span>
                    </div>

                    {order.items?.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[620px] text-left text-sm">
                          <thead className="border-b border-blue-100 bg-slate-50 text-xs text-slate-600">
                            <tr>
                              <th className="px-4 py-3 font-semibold">
                                Sản phẩm
                              </th>
                              <th className="px-4 py-3 text-center font-semibold">
                                Số lượng
                              </th>
                              <th className="px-4 py-3 text-right font-semibold">
                                Đơn giá
                              </th>
                              <th className="px-4 py-3 text-right font-semibold">
                                Thành tiền
                              </th>
                            </tr>
                          </thead>

                          <tbody className="divide-y divide-slate-100">
                            {order.items.map((item) => (
                              <tr
                                key={item.id}
                                className="transition-colors hover:bg-blue-50/40"
                              >
                                <td className="max-w-[380px] px-4 py-4 align-top">
                                  <p className="line-clamp-2 font-medium leading-5 text-slate-800">
                                    {item.product_name}
                                  </p>
                                </td>

                                <td className="px-4 py-4 text-center align-top">
                                  <span className="inline-flex rounded-lg bg-blue-50 px-3 py-1 font-medium text-blue-800">
                                    {item.quantity}
                                  </span>
                                </td>

                                <td className="whitespace-nowrap px-4 py-4 text-right align-top text-slate-600">
                                  {Number(item.price).toLocaleString("vi-VN")}đ
                                </td>

                                <td className="whitespace-nowrap px-4 py-4 text-right align-top font-semibold text-[#173B87]">
                                  {(Number(item.price) * Number(item.quantity)).toLocaleString("vi-VN")}đ
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="px-4 py-5 text-sm text-slate-500">
                        Không có thông tin sản phẩm.
                      </p>
                    )}

                    {/* Tổng giá trị đơn hàng */}
                    <div className="flex items-center justify-end gap-5 border-t border-blue-100 bg-[#F8FAFF] px-4 py-4">
                      <span className="text-sm font-medium text-slate-600">
                        Tổng đơn hàng:
                      </span>

                      <span className="text-lg font-bold text-[#173B87]">
                        {Number(order.total_amount).toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                  </div>
                )}

              </div>
            ))}
          </div>
        )}


        {confirmAction !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#071632]/70 backdrop-blur-sm p-4">
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="confirm-title"
              className="w-full max-w-md overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-2xl"
            >
              {/* Dải màu xanh vũ trụ */}
              <div className="h-1.5 bg-gradient-to-r from-blue-950 via-blue-700 to-cyan-400" />

              <div className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                    <span className="text-2xl">!</span>
                  </div>

                  <div>
                    <h2
                      id="confirm-title"
                      className="text-xl font-bold text-[#142D60]"
                    >
                      {confirmAction.newStatus === "CANCELLED"
                        ? "Xác nhận hủy đơn hàng"
                        : "Xác nhận duyệt đơn hàng"}
                    </h2>

                    <p className="mt-1 text-xs font-medium tracking-wider text-slate-400">
                      LAPZONE • QUẢN LÝ ĐƠN HÀNG
                    </p>
                  </div>
                </div>

                <p className="mt-6 text-sm leading-6 text-slate-700">
                  Bạn có chắc chắn muốn{" "}
                  <strong>
                    {confirmAction.newStatus === "CANCELLED"
                      ? "hủy"
                      : "duyệt"}
                  </strong>{" "}
                  đơn hàng{" "}
                  <strong className="text-blue-900">
                    #DH-{confirmAction.orderId}
                  </strong>{" "}
                  không?
                </p>

                <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-4">
                  <p className="text-sm font-semibold text-blue-900">
                    Lưu ý quan trọng
                  </p>
                  <p className="mt-1 text-sm leading-6 text-blue-800">
                    {confirmAction.newStatus === "CANCELLED"
                      ? "Đơn hàng sẽ chuyển sang trạng thái Đã hủy và không thể hoàn tác."
                      : "Đơn hàng sẽ chuyển sang trạng thái Đã xác nhận để tiếp tục xử lý."}
                  </p>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    disabled={updatingId !== null}
                    onClick={() => setConfirmAction(null)}
                    className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                  >
                    Quay lại
                  </button>

                  <button
                    type="button"
                    disabled={updatingId !== null}
                    onClick={async () => {
                      const { orderId, newStatus } = confirmAction;

                      const success = await saveOrderStatus(
                        orderId,
                        newStatus
                      );

                      if (success) {
                        setConfirmAction(null);
                      }
                    }}
                    className="flex-1 rounded-xl bg-[#173B87] px-4 py-3 font-semibold text-white shadow-lg shadow-blue-900/20 transition hover:bg-[#102B65] disabled:opacity-50"
                  >
                    {updatingId !== null
                      ? "Đang xử lý..."
                      : confirmAction.newStatus === "CANCELLED"
                        ? "Xác nhận hủy"
                        : "Xác nhận duyệt"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManagerOrders;
