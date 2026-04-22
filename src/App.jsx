import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import HomePage from "./HomePage";
import LoginPage from "./LoginPage"; 
import RegisterPage from "./RegisterPage";
import ProductPage from "./ProductPage";
import CatalogPage from "./CatalogPage";
import AdminProdutos from "./admin/AdminProdutos";
import AdminCategorias from "./admin/AdminCategorias";
import AdminEncomendas from "./admin/AdminEncomendas";
import AdminUtilizadores from "./admin/AdminUtilizadores";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/produto/:id" element={<ProductPage />} />
        <Route path="/catalogo" element={<CatalogPage />} />
        <Route path="/admin/produtos" element={<AdminProdutos />} />
        <Route path="/admin/categorias" element={<AdminCategorias />} />
        <Route path="/admin/encomendas" element={<AdminEncomendas />} />
        <Route path="/admin/utilizadores" element={<AdminUtilizadores />} />
      </Routes>
    </Router>
  );
}