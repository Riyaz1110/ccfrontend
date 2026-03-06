import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';

import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';

function Layout({ children, noFooter }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      {!noFooter && <Footer />}
      <Toast />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/products" element={<Layout><Products /></Layout>} />
            <Route path="/hair-accessories" element={<Layout><Products /></Layout>} />
            <Route path="/hampers" element={<Layout><Products /></Layout>} />
            <Route path="/bouquets" element={<Layout><Products /></Layout>} />
            <Route path="/product/:id" element={<Layout><ProductDetail /></Layout>} />
            <Route path="/cart" element={<Layout><Cart /></Layout>} />
            <Route path="/checkout" element={<Layout noFooter><Checkout /></Layout>} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
            <Route path="/admin" element={<Layout noFooter><AdminDashboard /></Layout>} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
