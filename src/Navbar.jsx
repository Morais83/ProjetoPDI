import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuAberto, setMenuAberto] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuAberto(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const serif = { fontFamily: "'Cormorant Garamond', Georgia, serif" };
  const sans = { fontFamily: "'Jost', sans-serif" };

  return (
    <div ref={menuRef}>
      <nav style={sans} className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "shadow-sm" : ""} bg-white border-b border-[#E2EBE0]`}>
        <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">

          {/* Esquerda */}
          <div className="hidden md:flex items-center gap-7">
            <button
              onClick={() => setMenuAberto(menuAberto === "roupa" ? null : "roupa")}
              className={menuAberto === "roupa"
                ? "text-xs tracking-widest uppercase transition-colors border-b pb-0.5 text-[#3D6B4A] border-[#3D6B4A]"
                : "text-xs tracking-widest uppercase transition-colors border-b pb-0.5 text-[#4A5C4A] hover:text-[#3D6B4A] border-transparent hover:border-[#3D6B4A]"
              }
            >
              Roupa
            </button>

            <button
              onClick={() => setMenuAberto(menuAberto === "calcado" ? null : "calcado")}
              className={menuAberto === "calcado"
                ? "text-xs tracking-widest uppercase transition-colors border-b pb-0.5 text-[#3D6B4A] border-[#3D6B4A]"
                : "text-xs tracking-widest uppercase transition-colors border-b pb-0.5 text-[#4A5C4A] hover:text-[#3D6B4A] border-transparent hover:border-[#3D6B4A]"
              }
            >
              Calçado
            </button>

            <button
              onClick={() => setMenuAberto(menuAberto === "acessorios" ? null : "acessorios")}
              className={menuAberto === "acessorios"
                ? "text-xs tracking-widest uppercase transition-colors border-b pb-0.5 text-[#3D6B4A] border-[#3D6B4A]"
                : "text-xs tracking-widest uppercase transition-colors border-b pb-0.5 text-[#4A5C4A] hover:text-[#3D6B4A] border-transparent hover:border-[#3D6B4A]"
              }
            >
              Acessórios
            </button>
          </div>

          {/* Centro */}
          <div className="text-center">
            <Link to="/" onClick={() => setMenuAberto(false)}>
              <div style={serif} className="text-xl font-semibold text-[#2C3A2C] tracking-tight leading-tight">Moda Chique</div>
              <div className="text-[10px] tracking-[0.15em] uppercase text-[#6B9E63] font-light">Lili Store</div>
            </Link>
          </div>

          {/* Direita */}
          <div className="hidden md:flex items-center gap-7">
            {["Promoções", "Marcas"].map((item) => (
              <a key={item} href="#" className="text-xs tracking-widest uppercase text-[#4A5C4A] hover:text-[#3D6B4A] transition-colors border-b border-transparent hover:border-[#3D6B4A] pb-0.5">
                {item}
              </a>
            ))}
            <Link to="/admin/categorias" className="text-xs tracking-widest uppercase text-[#4A5C4A] hover:text-[#3D6B4A] transition-colors">
              Admin
            </Link>
            <Link to="/perfil" className="text-xs tracking-widest uppercase text-[#4A5C4A] hover:text-[#3D6B4A] transition-colors">
              Perfil
            </Link>
            <div className="flex items-center gap-3 ml-2 pl-4 border-l border-[#E2EBE0]">
              <button className="text-[#4A5C4A] hover:text-[#3D6B4A] transition-colors text-base">🔍</button>
              <Link to="/login" className="text-[#4A5C4A] hover:text-[#3D6B4A] transition-colors text-base">👤</Link>
              <Link to="/carrinho" className="relative text-[#4A5C4A] hover:text-[#3D6B4A] transition-colors text-base">
                🛍️
                <span className="absolute -top-1.5 -right-1.5 bg-[#3D6B4A] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">3</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mega Menu Roupa */}
      {menuAberto === "roupa" && (
        <div style={sans} className="absolute left-0 right-0 z-40 bg-white border-b border-[#E2EBE0] shadow-lg">
          <div className="max-w-7xl mx-auto px-8 py-8">
            <div className="grid grid-cols-4 gap-8">

              <div className="col-span-2">
                <p className="text-xs font-semibold tracking-widest uppercase text-[#2C3A2C] mb-4">Compra por Categorias</p>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                  <Link
                    to="/catalogo"
                    onClick={() => setMenuAberto(null)}
                    className="text-sm text-[#4A5C4A] hover:text-[#3D6B4A] transition-colors py-1"
                  >
                    Explora tudo
                  </Link>
                  {[
                    "Blusas", "Vestidos", "Sobretudos",
                    "Calças e Calções", "Saias",
                    "T-shirt e Tops", "Roupa de banho",
                    "Casacos", "Sweatshirts e Hoodies",
                    "Malhas", "Blazers e coletes",
                    "Roupa Interior", "Macacões",
                  ].map((link, i) => (
                    <a key={i} href="#" onClick={() => setMenuAberto(null)} className="text-sm text-[#4A5C4A] hover:text-[#3D6B4A] transition-colors py-1">
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mega Menu Calçado */}
      {menuAberto === "calcado" && (
        <div style={sans} className="absolute left-0 right-0 z-40 bg-white border-b border-[#E2EBE0] shadow-lg">
          <div className="max-w-7xl mx-auto px-8 py-8">
            <div className="grid grid-cols-4 gap-8">

              <div className="col-span-2">
                <p className="text-xs font-semibold tracking-widest uppercase text-[#2C3A2C] mb-4">Compra por Tipo</p>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                  {[
                    "Explora tudo", "Sapatilhas",
                    "Sandálias", "Botas",
                    "Botins", "Mules",
                    "Mocassins", "Saltos altos",
                    "Sapatos rasos", "Chinelos",
                  ].map((link, i) => (
                    <a key={i} href="#" onClick={() => setMenuAberto(null)} className="text-sm text-[#4A5C4A] hover:text-[#3D6B4A] transition-colors py-1">
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mega Menu Acessórios */}
      {menuAberto === "acessorios" && (
        <div style={sans} className="absolute left-0 right-0 z-40 bg-white border-b border-[#E2EBE0] shadow-lg">
          <div className="max-w-7xl mx-auto px-8 py-8">
            <div className="grid grid-cols-4 gap-8">

              <div className="col-span-2">
                <p className="text-xs font-semibold tracking-widest uppercase text-[#2C3A2C] mb-4">Compra por Tipo</p>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                  {[
                    "Explora tudo", "Malas de mão",
                    "Carteiras", "Mochilas",
                    "Cintos", "Chapéus",
                    "Lenços",
                  ].map((link, i) => (
                    <a key={i} href="#" onClick={() => setMenuAberto(null)} className="text-sm text-[#4A5C4A] hover:text-[#3D6B4A] transition-colors py-1">
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}