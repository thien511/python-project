import { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/ProductCard.jsx";
import { Link, useSearchParams } from "react-router-dom";

function Manager() {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isdel, setIsdel] = useState(false);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const token = localStorage.getItem("access_token");
  
  useEffect(() => {
    fetch(`http://localhost:8000/api/profile`, {
      method: "get",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }
        return response.json();
      })
      .then((data) => {
        setUser(data);
        console.log("Fetched product data:", data);
      })
      .catch((error) => {
        console.log("error", error);
        setUser(null);
      });
  }, []);

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
  }, [products]);

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
      <div className="flex justify-end px-6 pt-5 pb-2">
        <Link to="/addProduct">
          <button
            // onClick={onAddProduct} // Gọi hàm mở Modal/Trang tạo sản phẩm
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-xl transition shadow-sm active:scale-95"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Thêm sản phẩm
          </button>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {displayProducts.length > 0 ? (
          displayProducts.map((p) => (
            <ProductCard key={p.id} product={p} user={user} />
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full py-8">
            No products found
          </p>
        )}
      </div>
    </div>
  );
}

export default Manager;
