import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, User, ShoppingBag, Menu, X, ChevronDown, ChevronRight } from "lucide-react";

const serif = { fontFamily: "'Cormorant Garamond', Georgia, serif" };
const sans  = { fontFamily: "'Jost', sans-serif" };

const MENUS = {
  roupa: {
    label: "Roupa",
    base: "/catalogo?departamento=roupa",
    items: ["Blusas","Vestidos","Sobretudos","Calças e Calções","Saias","T-shirt e Tops","Roupa de banho","Casacos","Sweatshirts e Hoodies","Malhas","Blazers e coletes","Roupa Interior","Macacões"],
  },
  calcado: {
    label: "Calçado",
    base: "/catalogo?departamento=calcado",
    items: ["Sapatilhas","Sandálias","Botas","Botins","Saltos altos","Sapatos rasos","Chinelos"],
  },
  acessorios: {
    label: "Acessórios",
    base: "/catalogo?departamento=acessorios",
    items: ["Malas de mão","Carteiras","Mochilas","Cintos","Chapéus","Lenços","Óculos de sol","Joalharia","Bijuteria"],
  },
};

export default function Navbar() {
  const [scrolled,       setScrolled]       = useState(false);
  const [menuAberto,     setMenuAberto]      = useState(null);
  const [mobileAberto,   setMobileAberto]    = useState(false);
  const [mobileSecao,    setMobileSecao]     = useState(null);
  const [numArtigos,     setNumArtigos]      = useState(0);
  const [pesquisaAberta, setPesquisaAberta]  = useState(false);
  const [termoPesquisa,  setTermoPesquisa]   = useState("");
  const menuRef   = useRef(null);
  const navigate  = useNavigate();
  const utilizador = JSON.parse(localStorage.getItem('utilizador'));

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
      } catch { setNumArtigos(0); }
    };
    atualizar();
    window.addEventListener('carrinho-atualizado', atualizar);
    return () => window.removeEventListener('carrinho-atualizado', atualizar);
  }, []);

  // Bloqueia scroll quando menu mobile está aberto
  useEffect(() => {
    document.body.style.overflow = mobileAberto ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileAberto]);

  const handlePesquisa = (e) => {
    e.preventDefault();
    if (termoPesquisa.trim()) {
      navigate(`/catalogo?q=${encodeURIComponent(termoPesquisa.trim())}`);
      setPesquisaAberta(false);
      setTermoPesquisa("");
      setMobileAberto(false);
    }
  };

  const fecharTudo = () => {
    setMenuAberto(null);
    setMobileAberto(false);
    setMobileSecao(null);
  };

  return (
    <div ref={menuRef} style={sans}>
      {/* ── Barra principal ── */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 bg-white border-b border-[#E2EBE0] ${scrolled ? "shadow-sm" : ""}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">

          {/* Esquerda — desktop */}
          <div className="hidden md:flex items-center gap-7">
            {Object.entries(MENUS).map(([key, m]) => (
              <button key={key}
                onClick={() => setMenuAberto(menuAberto === key ? null : key)}
                className={`text-xs tracking-widest uppercase transition-colors border-b pb-0.5 flex items-center gap-1 ${
                  menuAberto === key
                    ? "text-[#3D6B4A] border-[#3D6B4A]"
                    : "text-[#4A5C4A] hover:text-[#3D6B4A] border-transparent hover:border-[#3D6B4A]"
                }`}>
                {m.label}
                <ChevronDown size={12} className={`transition-transform duration-200 ${menuAberto === key ? "rotate-180" : ""}`} />
              </button>
            ))}
          </div>

          {/* Hamburger — mobile */}
          <button
            onClick={() => setMobileAberto(!mobileAberto)}
            className="md:hidden p-2 text-[#4A5C4A] hover:text-[#3D6B4A] transition-colors"
            aria-label="Menu"
          >
            {mobileAberto ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Centro — Logo */}
          <div className="text-center absolute left-1/2 -translate-x-1/2">
            <Link to="/" onClick={fecharTudo}>
              <div style={serif} className="text-xl font-semibold text-[#2C3A2C] tracking-tight leading-tight">Moda Chique</div>
              <div className="text-[10px] tracking-[0.15em] uppercase text-[#6B9E63] font-light">Lili Store</div>
            </Link>
          </div>

          {/* Direita */}
          <div className="flex items-center gap-3 md:gap-7">
            {/* Links desktop */}
            <div className="hidden md:flex items-center gap-5">
              <Link to="/promocoes" className="text-xs tracking-widest uppercase text-[#4A5C4A] hover:text-[#3D6B4A] transition-colors border-b border-transparent hover:border-[#3D6B4A] pb-0.5">
                Promoções
              </Link>
              <Link to="/marcas" className="text-xs tracking-widest uppercase text-[#4A5C4A] hover:text-[#3D6B4A] transition-colors border-b border-transparent hover:border-[#3D6B4A] pb-0.5">
                Marcas
              </Link>
            </div>

            {/* Pesquisa */}
            <form onSubmit={handlePesquisa} className="hidden md:flex items-center relative">
              <div className={`overflow-hidden transition-all duration-300 ease-in-out flex items-center ${pesquisaAberta ? 'w-40 opacity-100' : 'w-0 opacity-0'}`}>
                <input
                  type="text"
                  placeholder="Pesquisar..."
                  value={termoPesquisa}
                  onChange={e => setTermoPesquisa(e.target.value)}
                  className="w-full text-xs tracking-wider border-b border-[#3D6B4A] bg-transparent focus:outline-none text-[#4A5C4A] placeholder:text-[#4A5C4A]/50 pb-0.5 mr-2"
                />
              </div>
              <button
                type={pesquisaAberta ? "submit" : "button"}
                onClick={() => {
                  if (!pesquisaAberta) { setPesquisaAberta(true); setMenuAberto(null); }
                  else if (!termoPesquisa.trim()) setPesquisaAberta(false);
                }}
                className="text-[#4A5C4A] hover:text-[#3D6B4A] transition-colors"
              >
                <Search size={18} strokeWidth={1.5} />
              </button>
            </form>

            {/* Ícones utilizador */}
            <div className="flex items-center gap-3 md:gap-4 md:ml-2 md:pl-4 md:border-l md:border-[#E2EBE0]">
              {utilizador ? (
                utilizador.perfil === 'admin' ? (
                  <Link to="/admin/categorias" onClick={fecharTudo} className="text-xs tracking-widest uppercase text-[#4A5C4A] hover:text-[#3D6B4A] transition-colors">
                    Admin
                  </Link>
                ) : (
                  <>
                    <Link to="/perfil" onClick={fecharTudo} className="text-[#4A5C4A] hover:text-[#3D6B4A] transition-colors">
                      <User size={20} strokeWidth={1.5} />
                    </Link>
                    <Link to="/carrinho" onClick={fecharTudo} className="relative text-[#4A5C4A] hover:text-[#3D6B4A] transition-colors">
                      <ShoppingBag size={20} strokeWidth={1.5} />
                      {numArtigos > 0 && (
                        <span className="absolute -top-1.5 -right-2 bg-[#3D6B4A] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-medium">
                          {numArtigos}
                        </span>
                      )}
                    </Link>
                  </>
                )
              ) : (
                <>
                  <Link to="/login" onClick={fecharTudo} className="hidden md:block text-xs tracking-widest uppercase text-[#4A5C4A] hover:text-[#3D6B4A] transition-colors border-b border-transparent hover:border-[#3D6B4A] pb-0.5">
                    Login
                  </Link>
                  <Link to="/register" onClick={fecharTudo} className="hidden md:block text-xs tracking-widest uppercase text-[#4A5C4A] hover:text-[#3D6B4A] transition-colors border-b border-transparent hover:border-[#3D6B4A] pb-0.5">
                    Registo
                  </Link>
                  <Link to="/login" onClick={fecharTudo} className="md:hidden text-[#4A5C4A] hover:text-[#3D6B4A] transition-colors">
                    <User size={20} strokeWidth={1.5} />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ── Mega menus desktop ── */}
      {Object.entries(MENUS).map(([key, m]) =>
        menuAberto === key && (
          <div key={key} style={sans} className="absolute left-0 right-0 z-40 bg-white border-b border-[#E2EBE0] shadow-lg">
            <div className="max-w-7xl mx-auto px-8 py-8">
              <div className="grid grid-cols-4 gap-8">
                <div className="col-span-2">
                  <p className="text-xs font-semibold tracking-widest uppercase text-[#2C3A2C] mb-4">Compra por categorias</p>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                    <Link to={m.base} onClick={fecharTudo} className="text-sm text-[#4A5C4A] hover:text-[#3D6B4A] transition-colors py-1">Explora tudo</Link>
                    {m.items.map(item => (
                      <Link key={item}
                        to={`${m.base}&categoria=${encodeURIComponent(item)}`}
                        onClick={fecharTudo}
                        className="text-sm text-[#4A5C4A] hover:text-[#3D6B4A] transition-colors py-1">
                        {item}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      )}

      {/* ── Menu mobile — overlay escuro ── */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 md:hidden ${mobileAberto ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setMobileAberto(false)}
      />

      {/* ── Menu mobile — drawer ── */}
      <div style={sans} className={`fixed top-0 left-0 h-full w-[80vw] max-w-xs z-50 bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out md:hidden ${mobileAberto ? "translate-x-0" : "-translate-x-full"}`}>

        {/* Header drawer */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8F0E6]">
          <div>
            <div style={serif} className="text-lg font-semibold text-[#2C3A2C]">Moda Chique</div>
            <div className="text-[10px] tracking-widest uppercase text-[#6B9E63]">Lili Store</div>
          </div>
          <button onClick={() => setMobileAberto(false)} className="p-1 text-[#8FAF8A] hover:text-[#3D6B4A] transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Pesquisa mobile */}
        <form onSubmit={handlePesquisa} className="px-5 py-3 border-b border-[#F0F5EE]">
          <div className="flex items-center gap-2 border border-[#C8DFC4] rounded-xl px-3 py-2 bg-[#F7F9F5] focus-within:border-[#3D6B4A] transition-colors">
            <Search size={15} className="text-[#8FAF8A] flex-shrink-0" />
            <input
              type="text"
              placeholder="Pesquisar produtos..."
              value={termoPesquisa}
              onChange={e => setTermoPesquisa(e.target.value)}
              className="flex-1 text-sm outline-none bg-transparent text-[#2C3A2C] placeholder:text-[#C8DFC4]"
            />
          </div>
        </form>

        {/* Navegação */}
        <div className="flex-1 overflow-y-auto py-2">

          {/* Secções principais com sub-menus */}
          {Object.entries(MENUS).map(([key, m]) => (
            <div key={key} className="border-b border-[#F0F5EE]">
              <button
                onClick={() => setMobileSecao(mobileSecao === key ? null : key)}
                className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-medium text-[#2C3A2C] hover:bg-[#F7F9F5] transition-colors"
              >
                <span className="tracking-wide">{m.label}</span>
                <ChevronRight size={16} className={`text-[#8FAF8A] transition-transform duration-200 ${mobileSecao === key ? "rotate-90" : ""}`} />
              </button>

              {/* Sub-itens com animação */}
              <div className={`overflow-hidden transition-all duration-300 ${mobileSecao === key ? "max-h-96" : "max-h-0"}`}>
                <div className="pb-2">
                  <Link
                    to={m.base}
                    onClick={fecharTudo}
                    className="block px-8 py-2 text-sm text-[#3D6B4A] font-medium hover:bg-[#F0F5EE] transition-colors"
                  >
                    Explora tudo
                  </Link>
                  {m.items.map(item => (
                    <Link
                      key={item}
                      to={`${m.base}&categoria=${encodeURIComponent(item)}`}
                      onClick={fecharTudo}
                      className="block px-8 py-2 text-sm text-[#4A5C4A] hover:bg-[#F7F9F5] hover:text-[#3D6B4A] transition-colors"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* Links rápidos */}
          {[
            { to: "/promocoes", label: "Promoções" },
            { to: "/marcas",    label: "Marcas"    },
          ].map(l => (
            <Link key={l.to} to={l.to} onClick={fecharTudo}
              className="flex items-center px-5 py-3.5 text-sm text-[#4A5C4A] hover:bg-[#F7F9F5] hover:text-[#3D6B4A] transition-colors border-b border-[#F0F5EE]">
              {l.label}
            </Link>
          ))}
        </div>

        {/* Rodapé drawer */}
        <div className="border-t border-[#E8F0E6] p-5 space-y-2">
          {utilizador ? (
            utilizador.perfil === 'admin' ? null : (
            <>
              <Link to="/perfil" onClick={fecharTudo}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#2C3A2C] hover:bg-[#F0F5EE] transition-colors">
                <User size={16} className="text-[#3D6B4A]" /> Meu Perfil
              </Link>
              <Link to="/carrinho" onClick={fecharTudo}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#2C3A2C] hover:bg-[#F0F5EE] transition-colors">
                <ShoppingBag size={16} className="text-[#3D6B4A]" />
                Carrinho
                {numArtigos > 0 && <span className="ml-auto bg-[#3D6B4A] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">{numArtigos}</span>}
              </Link>
              <button
                onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('utilizador'); window.location.href = '/'; }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#C0392B] hover:bg-[#FDECEA] transition-colors"
              >
                Sair
              </button>
            </>
            )
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Link to="/login" onClick={fecharTudo}
                className="text-center py-2.5 rounded-xl border border-[#3D6B4A] text-sm text-[#3D6B4A] hover:bg-[#F0F5EE] transition-colors">
                Login
              </Link>
              <Link to="/register" onClick={fecharTudo}
                className="text-center py-2.5 rounded-xl bg-[#3D6B4A] text-sm text-white hover:bg-[#2C5038] transition-colors">
                Registo
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
