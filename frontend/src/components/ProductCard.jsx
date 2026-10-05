import { Link } from "react-router-dom";
import { formatPrice } from "../utils/helper";

function ProductCard({ product }) {
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
  const price = formatPrice(product.price);

  return (
    <Link to={`/product/${product.id}`}>
      <div className="bg-white border-2 border-indigo-500 rounded-xl shadow-md p-4 flex flex-col justify-between hover:shadow-lg transition">
        <div className="w-full h-52 bg-white flex items-center justify-center p-3 rounded-lg mb-4 overflow-hidden">
          <img
            src={
              product.image?.startsWith("http")
                ? product.image
                : `${BASEURL || "http://localhost:8000"}${product.image}`
            }
            alt={product.name}
            className="max-h-full max-w-full object-contain"
            onError={(e) => {
              e.target.src = "https://placehold.co/600x400?text=No+Image";
            }}
          />
        </div>

        <h2 className="text-lg font-semibold text-gray-800 truncate" title={product.name}>
          {product.name}
        </h2>
        <p className="text-gray-600 font-medium">{price}đ</p>
      </div>
    </Link>
  );
}

export default ProductCard;