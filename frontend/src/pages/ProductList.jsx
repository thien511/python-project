import { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/ProductCard.jsx";
import { useSearchParams } from "react-router-dom";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  
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
  console.log("filter", filteredProducts)

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const displayProducts =
    filteredProducts.length > 0 ? filteredProducts : products;
  return (
    <div className="min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-center py-5 bg-white shadow-md">
        Product List
      </h1>
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
