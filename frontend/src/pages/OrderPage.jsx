import { useEffect, useState } from "react";
import {
  Package, MapPin, Phone, User, CreditCard, Clock, Edit2,
  CheckCircle2, AlertCircle, Save, ChevronDown, ChevronUp,
  Truck, PackageCheck, Search,
} from "lucide-react";
import { Link } from "react-router-dom";
import { authFetch } from "../utils/auth";

const STATUS_CONFIG = {
  PENDING: { label: "Chờ xử lý", color: "bg-amber-50 text-amber-700 border-amber-200" },
  CONFIRMED: { label: "Đã xác nhận", color: "bg-blue-50 text-blue-700 border-blue-200" },
  SHIPPED: { label: "Đang giao hàng", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  DELIVERED: { label: "Đã giao hàng", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  CANCELLED: { label: "Đã hủy", color: "bg-rose-50 text-rose-700 border-rose-200" },
};
const PAYMENT_LABELS = {
  COD: "Thanh toán khi nhận hàng (COD)",
  ONLINE: "Thanh toán trực tuyến",
  cash: "Thanh toán khi nhận hàng (COD)",
  online: "Thanh toán trực tuyến",
};
const FILTERS = [
  { value: "ALL", label: "Tất cả" },
  { value: "PENDING", label: "Chờ xử lý" },
  { value: "CONFIRMED", label: "Đã xác nhận" },
  { value: "SHIPPED", label: "Đang giao" },
  { value: "DELIVERED", label: "Đã giao" },
  { value: "CANCELLED", label: "Đã hủy" },
];
const STEPS = [
  { label: "Đã đặt", icon: CheckCircle2 },
  { label: "Xác nhận", icon: PackageCheck },
  { label: "Vận chuyển", icon: Truck },
  { label: "Hoàn tất", icon: Package },
];
const STEP_LEVEL = { PENDING: 0, CONFIRMED: 1, SHIPPED: 2, DELIVERED: 3 };
const currency = (value) => `${Number(value || 0).toLocaleString("vi-VN")}đ`;

export default function OrderPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [expandedOrderIds, setExpandedOrderIds] = useState([]);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState("");
  const [formData, setFormData] = useState({ name: "", phone: "", address: "" });

  useEffect(() => {
    let active = true;
    const loadOrders = async () => {
      try {
        const response = await authFetch("http://localhost:8000/api/orders");
        if (!response.ok) throw new Error(`Không thể tải đơn hàng (HTTP ${response.status})`);
        const data = await response.json();
        if (active) setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        if (active) setError(err.message || "Không thể tải đơn hàng.");
      } finally {
        if (active) setLoading(false);
      }
    };
    loadOrders();
    return () => { active = false; };
  }, []);

  const toggleDetails = (id) => {
    setExpandedOrderIds((prev) =>
      prev.includes(id) ? prev.filter((current) => current !== id) : [...prev, id]
    );
  };

  const startEdit = (order) => {
    setEditingOrderId(order.id);
    setFormData({ name: order.name || "", phone: order.phone || "", address: order.address || "" });
    setEditError("");
    setExpandedOrderIds((prev) => prev.includes(order.id) ? prev : [...prev, order.id]);
  };

  const saveInfo = async (event, orderId) => {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setEditError("");
    try {
      const response = await authFetch(`http://localhost:8000/api/orders/update/${orderId}`, {
        method: "PUT",
        body: JSON.stringify(formData),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        const detail = payload.error || payload.detail || "Không thể lưu thông tin đơn hàng.";
        throw new Error(typeof detail === "string" ? detail : JSON.stringify(detail));
      }
      // Preserve nested items/status if the API returns only a partial object.
      setOrders((prev) => prev.map((order) =>
        order.id === orderId ? { ...order, ...formData, ...(payload?.id === orderId ? payload : {}) } : order
      ));
      setEditingOrderId(null);
    } catch (err) {
      setEditError(err.message || "Lưu thông tin thất bại.");
    } finally {
      setSaving(false);
    }
  };

  const visibleOrders = orders.filter((order) => activeFilter === "ALL" || order.status === activeFilter);

  return (
    <main className="min-h-screen bg-[#F5F8FF] px-4 pb-14 pt-32 text-slate-800 md:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-7 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#122D61] md:text-3xl">Đơn hàng của tôi</h1>
            <p className="mt-1 text-sm text-slate-500">Theo dõi hành trình đơn hàng tại LapZone</p>
          </div>
          <span className="rounded-2xl bg-[#E7F0FF] p-3 text-[#174995]"><PackageCheck size={27} /></span>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {FILTERS.map((filter) => (
            <button key={filter.value} type="button" onClick={() => setActiveFilter(filter.value)}
              className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${activeFilter === filter.value
                ? "border-[#173B87] bg-[#173B87] text-white shadow-md shadow-blue-900/10"
                : "border-blue-100 bg-white text-[#173B87] hover:border-blue-300 hover:bg-blue-50"}`}>
              {filter.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="rounded-2xl bg-white p-12 text-center text-[#173B87]">Đang tải đơn hàng...</div>
        ) : error ? (
          <div role="alert" className="rounded-2xl border border-red-200 bg-white p-8 text-center text-red-600">{error}</div>
        ) : visibleOrders.length === 0 ? (
          <div className="rounded-2xl border border-blue-100 bg-white p-12 text-center shadow-sm">
            <Search className="mx-auto mb-3 text-blue-300" size={34} />
            <h2 className="font-semibold text-[#122D61]">{orders.length ? "Không có đơn hàng ở trạng thái này" : "Bạn chưa có đơn hàng nào"}</h2>
            <p className="mt-2 text-sm text-slate-500">{orders.length ? "Hãy chọn trạng thái khác để xem đơn hàng." : "Đơn hàng sẽ xuất hiện tại đây sau khi bạn mua sắm."}</p>
            {!orders.length && <Link to="/" className="mt-5 inline-block rounded-xl bg-[#173B87] px-5 py-2.5 text-sm font-semibold text-white">Xem sản phẩm</Link>}
          </div>
        ) : (
          <div className="space-y-5">
            {visibleOrders.map((order) => {
              const expanded = expandedOrderIds.includes(order.id);
              const step = STEP_LEVEL[order.status] ?? 0;
              const canEdit = ["PENDING", "CONFIRMED"].includes(order.status);
              return (
                <article key={order.id} className="overflow-hidden rounded-2xl border border-[#DCE7FA] bg-white shadow-sm transition-shadow hover:shadow-md">
                  <div className="p-5 md:p-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="rounded-xl bg-[#EAF1FF] p-2.5 text-[#174995]"><Package size={21} /></span>
                        <div>
                          <h2 className="font-bold text-[#122D61]">Đơn hàng #DH-{order.id}</h2>
                          <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500"><Clock size={13} />{order.created_at ? new Date(order.created_at).toLocaleString("vi-VN") : ""}</p>
                        </div>
                      </div>
                      <span className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${STATUS_CONFIG[order.status]?.color || "bg-slate-50 text-slate-600 border-slate-200"}`}>
                        {STATUS_CONFIG[order.status]?.label || order.status}
                      </span>
                    </div>

                    {order.status === "CANCELLED" ? (
                      <div className="mt-5 flex items-start gap-2 rounded-xl border border-rose-100 bg-rose-50 p-3 text-sm text-rose-700">
                        <AlertCircle size={18} className="mt-0.5 shrink-0" />
                        <div><strong>Đơn hàng đã bị hủy.</strong>{order.cancel_reason && <p className="mt-1">Lý do: {order.cancel_reason}</p>}</div>
                      </div>
                    ) : (
                      <div className="mt-6 rounded-xl bg-[#F2F6FF] p-4">
                        <div className="grid grid-cols-4 gap-1">
                          {STEPS.map(({ label, icon: Icon }, index) => (
                            <div key={label} className="flex flex-col items-center gap-1.5 text-center">
                              <Icon size={21} className={index <= step ? "text-[#2259BC]" : "text-slate-300"} />
                              <span className={`text-[11px] font-medium sm:text-xs ${index <= step ? "text-[#173B87]" : "text-slate-400"}`}>{label}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#D5E2F9]">
                          <div className="h-full rounded-full bg-[#2459BF] transition-all duration-300" style={{ width: `${(step / 3) * 100}%` }} />
                        </div>
                      </div>
                    )}

                    <div className="mt-5 flex flex-col justify-between gap-3 border-b border-slate-100 pb-5 sm:flex-row sm:items-end">
                      <div className="min-w-0 space-y-1 text-sm text-slate-600">
                        <p><span className="font-medium text-slate-500">Người nhận:</span> {order.name}</p>
                        <p className="break-words"><span className="font-medium text-slate-500">Địa chỉ:</span> {order.address}</p>
                      </div>
                      <div className="shrink-0 sm:text-right">
                        <p className="text-xs text-slate-500">Tổng thanh toán</p>
                        <p className="mt-1 text-xl font-extrabold text-[#174995]">{currency(order.total_amount)}</p>
                      </div>
                    </div>

                    {expanded && (
                      <div className="mt-5 space-y-4">
                        <section className="overflow-hidden rounded-xl border border-blue-100">
                          <h3 className="bg-[#F5F8FF] px-4 py-3 text-sm font-bold text-[#122D61]">Sản phẩm đã mua</h3>
                          {order.items?.length ? (
                            <div className="overflow-x-auto">
                              <table className="w-full min-w-[580px] text-sm">
                                <thead className="border-y border-blue-100 bg-slate-50 text-slate-600"><tr><th className="px-4 py-3 text-left">Sản phẩm</th><th className="px-4 py-3 text-center">SL</th><th className="px-4 py-3 text-right">Đơn giá</th><th className="px-4 py-3 text-right">Thành tiền</th></tr></thead>
                                <tbody className="divide-y divide-slate-100">{order.items.map((item) => (
                                  <tr key={item.id}><td className="px-4 py-3 font-medium text-slate-700">{item.product_name || `Sản phẩm #${item.product}`}</td><td className="px-4 py-3 text-center">{item.quantity}</td><td className="whitespace-nowrap px-4 py-3 text-right">{currency(item.price)}</td><td className="whitespace-nowrap px-4 py-3 text-right font-semibold text-[#173B87]">{currency(Number(item.price) * Number(item.quantity))}</td></tr>
                                ))}</tbody>
                              </table>
                            </div>
                          ) : <p className="p-4 text-sm text-slate-500">Không có thông tin sản phẩm.</p>}
                        </section>

                        <div className="grid gap-4 md:grid-cols-3">
                          <section className="rounded-xl border border-blue-100 p-4 md:col-span-2">
                            <div className="mb-4 flex items-center justify-between gap-3">
                              <h3 className="flex items-center gap-2 font-bold text-[#122D61]"><MapPin size={18} /> Thông tin người nhận</h3>
                              {canEdit && editingOrderId !== order.id && <button type="button" onClick={() => startEdit(order)} className="flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-[#174995] hover:bg-blue-100"><Edit2 size={14} /> Chỉnh sửa</button>}
                            </div>
                            {editingOrderId === order.id ? (
                              <form onSubmit={(event) => saveInfo(event, order.id)} className="space-y-3">
                                {[{ key: "name", label: "Họ và tên" }, { key: "phone", label: "Số điện thoại" }, { key: "address", label: "Địa chỉ giao hàng" }].map(({ key, label }) => (
                                  <label key={key} className="block text-xs font-semibold text-slate-600">{label}
                                    {key === "address" ? <textarea required rows={3} value={formData[key]} onChange={(e) => setFormData((prev) => ({ ...prev, [key]: e.target.value }))} className="mt-1 w-full rounded-lg border border-blue-200 p-3 text-sm outline-none focus:border-blue-500" /> : <input required type={key === "phone" ? "tel" : "text"} value={formData[key]} onChange={(e) => setFormData((prev) => ({ ...prev, [key]: e.target.value }))} className="mt-1 w-full rounded-lg border border-blue-200 p-3 text-sm outline-none focus:border-blue-500" />}
                                  </label>
                                ))}
                                {editError && <p role="alert" className="text-sm text-red-600">{editError}</p>}
                                <div className="flex justify-end gap-2"><button type="button" disabled={saving} onClick={() => { setEditingOrderId(null); setEditError(""); }} className="rounded-lg border px-4 py-2 text-sm">Hủy</button><button type="submit" disabled={saving} className="flex items-center gap-2 rounded-lg bg-[#173B87] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"><Save size={15} />{saving ? "Đang lưu..." : "Lưu thay đổi"}</button></div>
                              </form>
                            ) : (
                              <div className="space-y-3 text-sm text-slate-700"><p className="flex gap-2"><User size={16} className="shrink-0 text-blue-500" />{order.name}</p><p className="flex gap-2"><Phone size={16} className="shrink-0 text-blue-500" />{order.phone}</p><p className="flex gap-2"><MapPin size={16} className="shrink-0 text-blue-500" />{order.address}</p></div>
                            )}
                          </section>
                          <section className="rounded-xl border border-blue-100 p-4">
                            <h3 className="mb-4 flex items-center gap-2 font-bold text-[#122D61]"><CreditCard size={18} /> Thanh toán</h3>
                            <p className="text-xs text-slate-500">Phương thức</p><p className="mt-1 text-sm font-semibold">{PAYMENT_LABELS[order.payment_method] || order.payment_method}</p>
                            <div className="mt-4 border-t border-blue-100 pt-3"><p className="text-xs text-slate-500">Tổng thanh toán</p><p className="mt-1 text-lg font-bold text-[#174995]">{currency(order.total_amount)}</p></div>
                          </section>
                        </div>
                      </div>
                    )}

                    <div className="mt-4 flex justify-end">
                      <button type="button" onClick={() => toggleDetails(order.id)} aria-expanded={expanded}
                        className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-5 py-2.5 text-sm font-semibold text-[#173B87] transition hover:border-blue-400 hover:bg-blue-50">
                        {expanded ? "Thu gọn" : "Xem chi tiết"}{expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}