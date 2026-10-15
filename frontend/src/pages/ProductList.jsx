import { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/ProductCard.jsx";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

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
      return matchQuery;
    });
  }, [products, searchQuery]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const displayProducts =
    filteredProducts.length > 0 ? filteredProducts : products;
  return (
    <div className="min-h-screen bg-gray-100 mt-20">
      <form className="flex items-center justify-end gap-3 py-5 mr-20">
        <div className="relative">
          <Search
            className="absolute left-3 top-2.5 text-slate-400"
            size={14}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên, CPU..."
            className="text-xs rounded-xl border border-slate-200 pl-8 pr-3 py-2 w-48 sm:w-64 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <button
          className="text-xs rounded-xl border border-slate-200 px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer hover:bg-slate-50 transition"
          type="submit"
        >
          Tìm
        </button>
      </form>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {displayProducts.length > 0 ? (
          displayProducts.map((p) => <ProductCard key={p.id} product={p} />)
        ) : (
          <p className="text-center text-gray-500 col-span-full py-8">
            No products found
          </p>
        )}
      </div>
    </div>
  );
}

export default ProductList;
