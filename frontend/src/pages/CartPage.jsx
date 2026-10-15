
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { formatPrice } from "../utils/helper";

function CartPage() {
  const { cartItems, total, removeFromCart, updateQuantity } = useCart();
  
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 pt-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* Tiêu đề */}
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium text-blue-600">
            SHOPPING CART
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Giỏ hàng của bạn
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Kiểm tra sản phẩm trước khi tiến hành thanh toán.
          </p>
        </div>

        {cartItems.length === 0 ? (
          /* Giỏ hàng trống */
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-4xl">
              🛒
            </div>

            <h2 className="text-xl font-bold text-slate-800">
              Giỏ hàng của bạn đang trống
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Hãy khám phá các sản phẩm và chọn món đồ mà bạn yêu thích.
            </p>

            <Link
              to="/"
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">

            {/* Danh sách sản phẩm */}
            <div className="space-y-4 lg:col-span-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <h2 className="mb-5 text-lg font-bold text-slate-800">
                  Sản phẩm trong giỏ hàng
                </h2>

                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col gap-4 border-b border-slate-100 pb-6 last:border-0 last:pb-0 sm:flex-row sm:items-center"
                    >
                      {/* Hình ảnh */}
                      <div className="flex h-28 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-50 sm:w-28">
                        {item.product_image ? (
                          <img
                            src={item.product_image}
                            alt={item.product_name}
                            className="h-full w-full object-contain p-2"
                          />
                        ) : (
                          <span className="text-3xl">📦</span>
                        )}
                      </div>

                      {/* Thông tin sản phẩm */}
                      <div className="min-w-0 flex-1">
                        <h3 className="line-clamp-2 text-base font-semibold leading-6 text-slate-800">
                          {item.product_name}
                        </h3>

                        <p className="mt-2 text-lg font-bold text-blue-600">
                          {formatPrice(item.product_price)}đ
                        </p>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-red-500 transition hover:text-red-700"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.8}
                            stroke="currentColor"
                            className="h-4 w-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 7h12m-10 0V5h8v2m-9 0 1 13h8l1-13M10 11v5m4-5v5"
                            />
                          </svg>
                          Xóa sản phẩm
                        </button>
                      </div>

                      {/* Điều chỉnh số lượng */}
                      <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          Số lượng
                        </p>

                        <div className="flex items-center rounded-xl border border-slate-200">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                            className="flex h-10 w-10 items-center justify-center rounded-l-xl text-lg text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            −
                          </button>

                          <span className="min-w-10 text-center text-sm font-semibold text-slate-800">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="flex h-10 w-10 items-center justify-center rounded-r-xl text-lg text-slate-600 transition hover:bg-slate-100"
                          >
                            +
                          </button>
                        </div>

                        <p className="text-sm font-bold text-slate-800">
                          {formatPrice(
                            item.product_price * item.quantity
                          )}đ
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-800"
              >
                <span>←</span> Tiếp tục mua sắm
              </Link>
            </div>

            {/* Tóm tắt đơn hàng */}
            <div className="lg:sticky lg:top-24">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900">
                  Tóm tắt đơn hàng
                </h2>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>Tạm tính</span>
                    <span className="font-medium text-slate-800">
                      {formatPrice(total)}đ
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>Phí vận chuyển</span>
                    <span className="font-medium text-emerald-600">
                      Xác nhận sau
                    </span>
                  </div>

                  <div className="border-t border-dashed border-slate-200 pt-4">
                    <div className="flex items-start justify-between gap-3">
                      <span className="font-semibold text-slate-800">
                        Tổng cộng
                      </span>
                      <span className="text-right text-xl font-bold text-blue-600">
                        {formatPrice(total)}đ
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-slate-400">
                      Phí vận chuyển có thể được tính ở bước thanh toán.
                    </p>
                  </div>
                </div>

                <Link
                  to="/checkout"
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98]"
                >
                  Tiến hành thanh toán
                  <span>→</span>
                </Link>

                <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.7}
                    stroke="currentColor"
                    className="h-4 w-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 10V7a4 4 0 0 0-8 0v3m-2 0h12l1 11H5L6 10Z"
                    />
                  </svg>
                  Thanh toán an toàn
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartPage;
