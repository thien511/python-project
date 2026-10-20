import { Link, useNavigate } from "react-router-dom";
import { formatPrice } from "../utils/helper";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import AddProductPage from "../pages/AddProductPage";

function ProductCard({ product, user = null }) {
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
  const price = formatPrice(product.price);
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleOpenModal = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    fetch(`http://localhost:8000/api/manager/products/${product.id}/delete/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete products");
        }
        return response.json();
      })
      .catch((error) => {
        console.log("error", error);
      });
    setShowDeleteModal(false);
    setIsdel(true);
  };

  const handleEdit = (e) => {
    e.preventDefault(); // Ngăn không cho Link chuyển trang khi bấm Sửa
    navigate("/addProduct", { state: product });
  };
  return (
    <>
      <Link to={`/product/${product.id}`} className="block group relative">
        <div className="bg-white border-2 border-indigo-500 rounded-xl shadow-md p-4 flex flex-col justify-between hover:shadow-lg transition">
          {/* Nút Chỉnh sửa & Xóa xuất hiện khi hover */}
          {user?.role === "manager" && (
            <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
              <button
                onClick={handleEdit}
                title="Chỉnh sửa sản phẩm"
                className="p-2 bg-white text-indigo-600 rounded-full shadow hover:bg-indigo-50 hover:text-indigo-800 transition"
              >
                <Pencil size={18} />
              </button>

              <button
                onClick={handleOpenModal}
                title="Xóa sản phẩm"
                className="p-2 bg-white text-red-600 rounded-full shadow border hover:bg-red-50 transition"
              >
                <Trash2 size={18} />
              </button>
            </div>
          )}

          <div className="w-full h-52 bg-white flex items-center justify-center p-3 rounded-lg mb-4 overflow-hidden">
            <img
              src={
                product.image?.startsWith("http")
                  ? product.image
                  : `${BASEURL || "http://localhost:8000"}${product.image}`
              }
              alt={product.name}
              className="max-h-full max-w-full object-contain transition-transform duration-500 ease-in-out group-hover:scale-110"
              onError={(e) => {
                e.target.src = "https://placehold.co/600x400?text=No+Image";
              }}
            />
          </div>

          <h2
            className="text-lg font-semibold text-gray-800 truncate"
            title={product.name}
          >
            {product.name}
          </h2>
          <p className="text-gray-600 font-medium">{price}đ</p>
        </div>
      </Link>
      {/* MODAL XÁC NHẬN XÓA (Giao diện Sáng) */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className="bg-white text-gray-900 w-full max-w-md rounded-3xl p-6 shadow-xl border border-gray-100 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold text-gray-900 tracking-tight">
              Bạn muốn xoá sản phẩm này?
            </h3>

            <p className="text-sm text-gray-600 leading-relaxed">
              Thao tác này sẽ xoá toàn bộ thông tin và hình ảnh của sản phẩm{" "}
              <strong className="text-gray-900">"{product.name}"</strong> khỏi
              hệ thống.
            </p>

            {/* Cụm nút bấm */}
            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-5 py-2.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium transition"
              >
                Huỷ
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition shadow-sm"
              >
                Xoá
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProductCard;
