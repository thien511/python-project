import { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/ProductCard.jsx";
import { Search } from "lucide-react";

const BRANDS = [
  "Tất cả",
  "ASUS",
  "Lenovo",
  "HP",
  "DELL",
  "MSI",
  "realme",
];

const getBrandFromName = (name = "") => {
  const upperName = name.toUpperCase();

  if (upperName.startsWith("ASUS")) return "ASUS";
  if (upperName.startsWith("LENOVO")) return "Lenovo";
  if (upperName.startsWith("HP")) return "HP";
  if (upperName.startsWith("DELL")) return "DELL";
  if (upperName.startsWith("MSI")) return "MSI";
  if (upperName.startsWith("REALME")) return "realme";

  return "Khác";
};

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("Tất cả");

  useEffect(() => {
    fetch(`http://localhost:8000/api/products`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchQuery =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.processor_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.series?.toLowerCase().includes(searchQuery.toLowerCase());

      const brand = getBrandFromName(p.name);
      const matchBrand =
        selectedBrand === "Tất cả" ? true : brand === selectedBrand;

      return matchQuery && matchBrand;
    });
  }, [products, searchQuery, selectedBrand]);

  if (loading) {
    return <div className="pt-28 text-center">Đang tải sản phẩm...</div>;
  }

  if (error) {
    return <div className="pt-28 text-center text-red-600">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-[#f8fbff] ">
      {/* Thanh bộ lọc + tìm kiếm */}
      <div className="px-6 pt-6">
        <div className="rounded-2xl border border-blue-100 bg-white shadow-[0_8px_30px_rgba(23,59,135,0.08)] px-5 py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Bộ lọc hãng */}
            <div className="flex flex-wrap items-center gap-2">
              {BRANDS.map((brand) => (
                <button
                  key={brand}
                  type="button"
                  onClick={() => setSelectedBrand(brand)}
                  className={`rounded-full px-8 py-2 mx-1 text-sm font-medium transition-all duration-200 ${
                    selectedBrand === brand
                      ? "bg-gradient-to-r from-[#173B87] to-[#2d6cdf] text-white shadow-md"
                      : "border border-blue-200 bg-white text-[#173B87] hover:bg-blue-50 hover:border-blue-300"
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>

            {/* Ô tìm kiếm */}
            <form
              className="flex items-center justify-end gap-3"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="relative">
                <Search
                  className="absolute left-3 top-2.5 text-blue-400"
                  size={14}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm theo tên, CPU..."
                  className="text-xs rounded-full border border-blue-200 bg-white pl-8 pr-4 py-2.5 w-52 sm:w-72 outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-slate-700 shadow-sm"
                />
              </div>
              <button
                className="text-xs rounded-full bg-gradient-to-r from-[#173B87] to-[#2d6cdf] px-4 py-2.5 text-white font-medium shadow-md hover:opacity-95 transition"
                type="submit"
              >
                Tìm
              </button>
            </form>

          </div>
        </div>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((p) => <ProductCard key={p.id} product={p} />)
        ) : (
          <p className="text-center text-gray-500 col-span-full py-8">
            Không tìm thấy sản phẩm phù hợp
          </p>
        )}
      </div>
    </div>
  );
}

export default ProductList;