import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import HomePage from "./HomePage";
import LoginPage from "./LoginPage"; 
import RegisterPage from "./RegisterPage";
import ProductPage from "./ProductPage";
import CatalogPage from "./CatalogPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/produto/:id" element={<ProductPage />} />
        <Route path="/catalogo" element={<CatalogPage />} />
      </Routes>
    </Router>
  );
}