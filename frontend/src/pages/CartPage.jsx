import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { formatPrice } from "../utils/helper";

function CartPage() {
  const { cartItems, total, removeFromCart, updateQuantity } = useCart();
  const BASEURL = "http://localhost:8000";

  return (
    <div className="pt-20 min-h-screen bg-gray-100 p-8 mt-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        🛒 Giỏ hàng của bạn
      </h1>
      {cartItems.length === 0 ? (
        <p className="text-center text-gray-600">Giỏ hàng rỗng.</p>
      ) : (
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between mb-4"
            >
              <div className="flex items-center gap-4">
                {item.product_image && (
                  <img
                    src={`${BASEURL}${item.product_image}`}
                    alt={item.product_name}
                    className="w-20 h-20 object-cover rounded"
                  />
                )}
              </div>
              <div>
                <h2 className="text-lg font-semibold">{item.product_name}</h2>
                <p className="text-gray-600">
                  {formatPrice(item.product_price)}đ
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  className="bg-gray-300 px-3 py-1 rounded"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  className="bg-gray-300 px-3 py-1 rounded"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  +
                </button>
                <button
                  className="text-red-500"
                  onClick={() => removeFromCart(item.id)}
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}

          <div className="border-t pt-4 mt-4 flex justify-between items-center">
            <h2 className="text-xl font-bold">Tổng cộng:</h2>
            <p className="text-xl font-semibold">{formatPrice(total)}đ</p>
            <Link
              to="/checkout"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Thanh toán
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;
