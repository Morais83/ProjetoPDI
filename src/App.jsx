import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import HomePage from "./homepage";
import LoginPage from "./loginpage"; 
import RegisterPage from "./registerpage";
import ProductPage from "./productpage";
import CatalogPage from "./catalogpage";
import AdminCategorias from "./admin/admincategorias";
import AdminProdutos from "./admin/adminprodutos";
import AdminEncomendas from "./admin/adminencomendas";
import AdminUtilizadores from "./admin/adminutilizadores";
import AdminMarcas from "./admin/adminmarcas";
import ProfilePage from "./profilepage";
import HelpPage from "./helppage";
import AboutPage from "./aboutpage";
import CheckoutPage from "./checkoutpage";
import ConfirmacaoPage from "./confirmacaopage";
import CartPage from "./cartpage";
import BrandsPage from "./brandspage";
import PromoPage from "./promopage";
import ResetPasswordPage from './resetpasswordpage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/produto/:id" element={<ProductPage />} />
        <Route path="/catalogo" element={<CatalogPage />} />
        <Route path="/admin/categorias" element={<AdminCategorias />} />
        <Route path="/admin/produtos" element={<AdminProdutos />} />
        <Route path="/admin/encomendas" element={<AdminEncomendas />} />
        <Route path="/admin/utilizadores" element={<AdminUtilizadores />} />
        <Route path="/admin/marcas" element={<AdminMarcas />} />
        <Route path="/perfil" element={<ProfilePage />} />
        <Route path="/ajuda" element={<HelpPage />} />
        <Route path="/sobre-nos" element={<AboutPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/confirmacao/:id" element={<ConfirmacaoPage />} />
        <Route path="/carrinho" element={<CartPage />} />
        <Route path="/marcas" element={<BrandsPage />} />
        <Route path="/promocoes" element={<PromoPage />} />
        <Route path="/recuperar-senha/:token" element={<ResetPasswordPage />} />
        
      </Routes>
    </Router>
  );
}