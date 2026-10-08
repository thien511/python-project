import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/helper";
import {
  ArrowLeft,
  Check,
  Heart,
  ShieldCheck,
  ShoppingCart,
  Star,
} from "lucide-react";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const nav = useNavigate();
  const [isWishlist, setIsWishlist] = useState(false);
  const [isCompare, setIsCompare] = useState(false);
  const [added, setAdded] = useState(false);

  // const product = {
  //     id: "rog-strix-g533zw",
  //     title:
  //       "ASUS ROG Strix SCAR 15 Core i9 12th Gen - (32 GB/1 TB SSD/Windows 11 Home/8 GB Graphics/NVIDIA GeForce RTX 3070 Ti) G533ZW-LN136WS Gaming Laptop (15.6 inch, Off Black, 2.30 kg, With MS Office)",
  //     image:
  //       "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80",
  //     rating: 4.8,
  //     reviewCount: "1,240",
  //     price: 68500000,
  //     originalPrice: 75000000,
  //     exchangeDiscount: 5000000,
  //     specs: [
  //       "Intel Core i9 12th Gen Processor",
  //       "32 GB DDR5 RAM | 1 TB NVMe SSD",
  //       "Windows 11 Home Operating System",
  //       "8 GB Graphics / NVIDIA GeForce RTX 3070 Ti",
  //       "39.62 cm (15.6 inch) QHD 240Hz Display",
  //       "Color: Off Black, Weight: 2.30 kg",
  //       "Includes MS Office Home & Student",
  //     ],
  //   };

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:8000/api/products/${id}/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch product details");
        }
        return response.json();
      })
      .then((data) => {
        setProduct(data);
        console.log("Fetched product data:", data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }
  if (!product) {
    return <div>No product found</div>;
  }

  const specs = [
    `${product.processor_brand} ${product.processor_name} ${product.processor_variant}`,
    `${product.ram} ${product.ram_type} RAM | ${product.ssd_capacity} SSD`,
    `${product.operating_system} Operating System`,
    `${product.dedicated_graphic_memory} Graphics / ${product.graphic_processor}`,
    `${product.screen_size} (${product.screen_type || product.screen_resolution})`,
    `Color: ${product.color}, Weight: ${product.weight}`,
    `Ports: ${product.usb_port}, ${product.hdmi_port}`,
    `Warranty: ${product.warranty_summary}`,
  ].filter(Boolean);

  const handleAddToCart = async () => {
    if (!localStorage.getItem("access_token")) {
      window.location.href = "/login";
      return;
    }
    await addToCart(product.id);
    setAdded(true);
  };

  /*-------------------------------------------------------------------------------------------*/

  // // Định dạng tiền tệ VND
  // const formatPrice = (amount) => {
  //   return new Intl.NumberFormat("vi-VN", {
  //     style: "currency",
  //     currency: "VND",
  //   })
  //     .format(amount)
  //     .replace("₫", "đ");
  // };

  // const handleAddToCart = () => {
  //   setAdded(true);
  //   if (onAddToCart) onAddToCart(product);
  //   setTimeout(() => setAdded(false), 2000);
  // };

  // Tính % giảm giá
  const originalPrice = Math.round(
    Number(product.price) + (Number(product.price) * 25) / 100,
  );

  const onBackToHome = () => {
    nav("/");
  };

  return (
    // <div className="min-h-screen bg-gray-100 flex justify-center items-center py-10">
    //   <div className="bg-white shadow-lg rounded-2xl p-8 max-w-3xl w-full">
    //     <div className="flex flex-col md:flex-row gap-8">
    //       <img
    //         src={`${product.image}`}
    //         alt={product.name}
    //         className="w-full md:w-1/2 h-auto object-cover rounded-lg"
    //       />
    //       <div className="flex-1">
    //         <h1 className="text-3xl font-bold text-gray-800 mb-2">
    //           {product.name}
    //         </h1>
    //         <p className="text-gray-600 mb-4">{product.description}</p>
    //         <p className="text-2xl font-semibold text-green-600 mb-6">
    //           {price} đ
    //         </p>
    //         <button
    //           onClick={handleAddToCart}
    //           className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
    //         >
    //           Add to Cart 🛒
    //         </button>
    //         {/* Home Button */}
    //         <div className="mt-4">
    //           <a href="/" className="text-blue-600 hover:underline">
    //             &larr; Back to Home
    //           </a>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200 mt-30 p-4 md:p-6 max-w-5xl mx-auto my-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* CỘT 1: HÌNH ẢNH & CHECKBOX SO SÁNH */}
        <div className="md:col-span-4 flex flex-col items-center justify-between h-full">
          <div className="relative w-full aspect-[4/3] flex items-center justify-center p-2 rounded-lg bg-slate-50 group">
            <img
              src={product.image}
              alt={product.name}
              className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          <div className="mt-4 flex items-center gap-2 self-start md:self-center">
            <input
              type="checkbox"
              id={`compare-${product.id}`}
              checked={isCompare}
              onChange={(e) => setIsCompare(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
            />
            <label
              htmlFor={`compare-${product.id}`}
              className="text-sm font-medium text-slate-600 cursor-pointer select-none hover:text-slate-900"
            >
              Add to Compare
            </label>
          </div>
        </div>

        {/* CỘT 2: THÔNG TIN CHI TIẾT SẢN PHẨM */}
        <div className="md:col-span-5 flex flex-col justify-between">
          <div>
            {/* Tiêu đề & Nút Yêu thích */}
            <div className="flex items-start justify-between gap-2">
              <h2 className="text-base md:text-lg font-semibold text-blue-600 hover:text-blue-700 cursor-pointer leading-snug line-clamp-2">
                {product.name}
              </h2>
              <button
                onClick={() => setIsWishlist(!isWishlist)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-red-500 transition-colors flex-shrink-0"
                title="Thêm vào yêu thích"
              >
                <Heart
                  className={`w-5 h-5 ${
                    isWishlist ? "fill-red-500 text-red-500" : ""
                  }`}
                />
              </button>
            </div>

            {/* Đánh giá (Rating) */}
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1 bg-green-700 text-white text-xs font-bold px-2 py-0.5 rounded">
                {product.user_rating} <Star className="w-3 h-3 fill-current" />
              </span>
              {/* <span className="text-xs font-medium text-slate-500">
                {product.reviewCount} Ratings & Reviews
              </span> */}
            </div>

            {/* Thông số kỹ thuật dạng danh sách */}
            <ul className="mt-4 space-y-1.5">
              {specs.map((spec, index) => (
                <li
                  key={index}
                  className="text-xs md:text-sm text-slate-600 flex items-start gap-2"
                >
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 flex-shrink-0"></span>
                  <span>{spec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CỘT 3: GIÁ BÁN & NÚT HÀNH ĐỘNG */}
        <div className="md:col-span-3 flex flex-col justify-between md:border-l md:border-slate-100 md:pl-6 h-full">
          <div>
            {/* Giá & Huy hiệu */}
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-green-600">
                {formatPrice(product.price)}đ
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-800 bg-blue-50 px-2 py-1 rounded-md border border-blue-200">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> Assured
              </span>
            </div>

            {/* Giá gốc & Giảm giá */}
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-slate-400 line-through">
                {formatPrice(originalPrice)}đ
              </span>
              <span className="text-xs font-bold text-green-600">20% off</span>
            </div>

            <div className="text-xs font-semibold text-green-700 mt-1">
              Ưu đãi cực tốt
            </div>

            {/* Trợ giá đổi cũ lấy mới */}
            <p className="text-xs text-slate-600 mt-2">
              Giảm thêm tới{" "}
              <span className="font-bold text-slate-800">30%</span> khi Thu cũ
              Đổi mới
            </p>
          </div>

          {/* Nút hành động */}
          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={handleAddToCart}
              className={`w-full py-2.5 px-4 rounded-md font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-sm ${
                added
                  ? "bg-green-600 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4" /> Đã thêm vào giỏ
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" /> Thêm vào giỏ hàng
                </>
              )}
            </button>

            {onBackToHome && (
              <button
                onClick={onBackToHome}
                className="inline-flex items-center justify-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline py-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Về trang chủ
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
