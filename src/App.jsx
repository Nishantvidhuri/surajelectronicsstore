import 'swiper/css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'swiper/css/navigation';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import Home from "./pages/Home";
import Products from "./pages/Products";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Complaints from "./pages/Complaints";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import Cart from "./pages/Cart";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminAddProduct from "./pages/AdminAddProduct";
import AdminEditProduct from "./pages/AdminEditProduct";
import AdminEditUser from "./pages/AdminEditUser";
import AdminProducts from "./pages/AdminProducts";
import AdminOrders from "./pages/AdminOrders";
import Terms from './pages/Terms';
import { useEffect } from 'react';
import ProductDetail from './pages/ProductDetail';
import AdminComplaints from './pages/AdminComplaints';

function App() {
  

  return (
    <AuthProvider>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/complaints" element={<Complaints />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/admin/complaints" element={<AdminComplaints />} />
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/users/edit/:id" element={<AdminEditUser />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/products/add" element={<AdminAddProduct />} />
          <Route path="/admin/products/edit/:id" element={<AdminEditProduct />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/terms" element={<Terms />} />
          {/* Add more admin routes here */}
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
