
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

  if (loading) {
    return <div className="pt-32 text-center">Đang tải đơn hàng...</div>;
  }

  const updateOrderStatus = async (orderId, newStatus) => {
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
        throw new Error(data.error || "Cập nhật thất bại");
      }

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? data.order : order
        )
      );
    } catch (error) {
      alert(error.message);
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
                <h2 className="text-xl font-bold mb-3">
                  Đơn hàng #DH-{order.id}
                </h2>

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
                    disabled={["DELIVERED", "CANCELLED"].includes(order.status)}
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

                <h3 className="font-semibold mt-4 mb-2">
                  Sản phẩm đã mua:
                </h3>

                {order.items?.map((item) => (
                  <div key={item.id} className="text-sm py-1">
                    {item.product_name} × {item.quantity}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ManagerOrders;
