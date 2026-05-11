import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import HomePage from "./HomePage";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import ProductPage from "./ProductPage";
import CatalogPage from "./CatalogPage";
import AdminCategorias from "./admin/AdminCategorias";
import AdminProdutos from "./admin/AdminProdutos";
import AdminEncomendas from "./admin/AdminEncomendas";
import AdminUtilizadores from "./admin/AdminUtilizadores";
import AdminMarcas from "./admin/adminmarcas";
import ProfilePage from "./ProfilePage";
import HelpPage from "./HelpPage";
import AboutPage from "./AboutPage";
import CheckoutPage from "./CheckOutPage";
import ConfirmacaoPage from "./confirmacaopage";
import CartPage from "./CartPage";
import BrandsPage from "./brandspage";
import PromoPage from "./promopage";
import ResetPasswordPage from './resetpasswordpage';
import SuportePage from './SuportePage';
import AdminSuporte from './admin/AdminSuporte';

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
        <Route path="/suporte" element={<SuportePage />} />
        <Route path="/admin/suporte" element={<AdminSuporte />} />
      </Routes>
    </Router>
  );
}