import { useEffect, useState } from "react";
import ProductList from "./pages/ProductList";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import CartPage from "./pages/CartPage.jsx";
import PrivateRouter from "./components/PrivateRouter.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import AddProductPage from "./pages/AddProductPage.jsx";
import QRPage from "./pages/QRPage.jsx";
import OrderPage from "./pages/OrderPage.jsx";

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route element={<PrivateRouter />}>
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/addProduct" element={<AddProductPage />} />
            <Route path="/myOrder" element={<OrderPage />} />
            <Route path="/qr" element={<QRPage />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
