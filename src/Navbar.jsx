import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, User, ShoppingBag } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuAberto, setMenuAberto] = useState(null);
  const [numArtigos, setNumArtigos] = useState(0);
  const [pesquisaAberta, setPesquisaAberta] = useState(false);
  const [termoPesquisa, setTermoPesquisa] = useState("");
  const menuRef = useRef(null);
  const utilizador = JSON.parse(localStorage.getItem('utilizador'));
  const navigate = useNavigate(); 

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuAberto(null);
        setPesquisaAberta(false); 
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const atualizar = () => {
      try {
        const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
        setNumArtigos(carrinho.reduce((acc, p) => acc + p.quantidade, 0));
      } catch {
        setNumArtigos(0);
      }
    };
    atualizar();
    window.addEventListener('carrinho-atualizado', atualizar);
    return () => window.removeEventListener('carrinho-atualizado', atualizar);
  }, []);

  const handlePesquisa = (e) => {
    e.preventDefault();
    if (termoPesquisa.trim() !== "") {
      navigate(`/catalogo?q=${encodeURIComponent(termoPesquisa.trim())}`);
      
      setPesquisaAberta(false);
      setTermoPesquisa("");
    }
  };

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
            <Link to="/promocoes" className="text-xs tracking-widest uppercase text-[#4A5C4A] hover:text-[#3D6B4A] transition-colors border-b border-transparent hover:border-[#3D6B4A] pb-0.5">
              Promoções
            </Link>
            <Link to="/marcas" className="text-xs tracking-widest uppercase text-[#4A5C4A] hover:text-[#3D6B4A] transition-colors border-b border-transparent hover:border-[#3D6B4A] pb-0.5">
              Marcas
            </Link>

            <form onSubmit={handlePesquisa} className="flex items-center relative">
              <div className={`overflow-hidden transition-all duration-300 ease-in-out flex items-center ${pesquisaAberta ? 'w-40 opacity-100' : 'w-0 opacity-0'}`}>
                <input
                  type="text"
                  placeholder="Pesquisar..."
                  value={termoPesquisa}
                  onChange={(e) => setTermoPesquisa(e.target.value)}
                  className="w-full text-xs tracking-wider border-b border-[#3D6B4A] bg-transparent focus:outline-none text-[#4A5C4A] placeholder:text-[#4A5C4A]/50 pb-0.5 mr-2"
                />
              </div>
              <button 
                type={pesquisaAberta ? "submit" : "button"}
                onClick={() => {
                  if (!pesquisaAberta) {
                    setPesquisaAberta(true);
                    setMenuAberto(null); 
                  } else if (!termoPesquisa.trim()) {
                    setPesquisaAberta(false); 
                  }
                }}
                className="text-[#4A5C4A] hover:text-[#3D6B4A] transition-colors flex items-center justify-center"
              >
                {/* ÍCONE DE PESQUISA */}
                <Search size={18} strokeWidth={1.5} />
              </button>
            </form>

            <div className="flex items-center gap-4 ml-2 pl-4 border-l border-[#E2EBE0]">
              {utilizador ? (
                <>
                  {utilizador.perfil === 'admin' ? (
                    <Link to="/admin/categorias" className="text-xs tracking-widest uppercase text-[#4A5C4A] hover:text-[#3D6B4A] transition-colors border-b border-transparent hover:border-[#3D6B4A] pb-0.5">
                      Admin
                    </Link>
                  ) : (
                    <>
                      {/* ÍCONE DE PERFIL */}
                      <Link to="/perfil" className="text-[#4A5C4A] hover:text-[#3D6B4A] transition-colors">
                        <User size={20} strokeWidth={1.5} />
                      </Link>
                      
                      {/* ÍCONE DE CARRINHO */}
                      <Link to="/carrinho" className="relative text-[#4A5C4A] hover:text-[#3D6B4A] transition-colors">
                        <ShoppingBag size={20} strokeWidth={1.5} />
                        {numArtigos > 0 && (
                          <span className="absolute -top-1.5 -right-2 bg-[#3D6B4A] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-medium">
                            {numArtigos}
                          </span>
                        )}
                      </Link>
                    </>
                  )}
                </>
              ) : (
                <>
                  <Link to="/login" className="text-xs tracking-widest uppercase text-[#4A5C4A] hover:text-[#3D6B4A] transition-colors border-b border-transparent hover:border-[#3D6B4A] pb-0.5">
                    Login
                  </Link>
                  <Link to="/register" className="text-xs tracking-widest uppercase text-[#4A5C4A] hover:text-[#3D6B4A] transition-colors border-b border-transparent hover:border-[#3D6B4A] pb-0.5">
                    Registo
                  </Link>
                </>
              )}
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
                  <Link to="/catalogo?departamento=roupa" onClick={() => setMenuAberto(null)} className="text-sm text-[#4A5C4A] hover:text-[#3D6B4A] transition-colors py-1">
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
                    <Link 
                      key={i} 
                      to={`/catalogo?departamento=roupa&categoria=${encodeURIComponent(link)}`} 
                      onClick={() => setMenuAberto(null)} 
                      className="text-sm text-[#4A5C4A] hover:text-[#3D6B4A] transition-colors py-1"
                    >
                      {link}
                    </Link>
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
                  <Link to="/catalogo?departamento=calcado" onClick={() => setMenuAberto(null)} className="text-sm text-[#4A5C4A] hover:text-[#3D6B4A] transition-colors py-1">
                    Explora tudo
                  </Link>
                  {[
                    "Sapatilhas",
                    "Sandálias", "Botas",
                    "Botins", "Saltos altos",
                    "Sapatos rasos", "Chinelos",
                  ].map((link, i) => (
                    <Link 
                      key={i} 
                      to={link === "Explora tudo" ? "/catalogo?departamento=calcado" : `/catalogo?departamento=calcado&categoria=${encodeURIComponent(link)}`} 
                      onClick={() => setMenuAberto(null)} 
                      className="text-sm text-[#4A5C4A] hover:text-[#3D6B4A] transition-colors py-1"
                    >
                      {link}
                    </Link>
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
                  <Link to="/catalogo?departamento=acessorios" onClick={() => setMenuAberto(null)} className="text-sm text-[#4A5C4A] hover:text-[#3D6B4A] transition-colors py-1">
                    Explora tudo
                  </Link>
                  {[
                    "Malas de mão",
                    "Carteiras", "Mochilas",
                    "Cintos", "Chapéus",
                    "Lenços", "Óculos de sol",
                    "Joalharia", "Bijuteria",
                  ].map((link, i) => (
                    <Link 
                      key={i} 
                      to={link === "Explora tudo" ? "/catalogo?departamento=acessorios" : `/catalogo?departamento=acessorios&categoria=${encodeURIComponent(link)}`} 
                      onClick={() => setMenuAberto(null)} 
                      className="text-sm text-[#4A5C4A] hover:text-[#3D6B4A] transition-colors py-1"
                    >
                      {link}
                    </Link>
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