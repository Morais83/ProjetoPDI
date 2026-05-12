import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Footer from "./footer";
import Navbar from "./navbar";
import { SlidersHorizontal, X } from "lucide-react";

const serif = { fontFamily: "'Cormorant Garamond', Georgia, serif" };
const sans = { fontFamily: "'Jost', sans-serif" };

const ordenacoes = [
  { id: "desconto", label: "Maior desconto" },
  { id: "preco_asc", label: "Preço: menor para maior" },
  { id: "preco_desc", label: "Preço: maior para menor" },
];

export default function PromoPage() {
  const [produtos, setProdutos] = useState([]);
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todas");
  const [marcaAtiva, setMarcaAtiva] = useState("Todas");
  const [ordenacao, setOrdenacao] = useState("desconto");
  const [precoMin, setPrecoMin] = useState(0);
  const [precoMax, setPrecoMax] = useState(500);
  // inputs locais — debounced para não causar saltos no layout
  const [inputMin, setInputMin] = useState("0");
  const [inputMax, setInputMax] = useState("500");
  const [loading, setLoading] = useState(true);
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);
  const debounceMin = useRef(null);
  const debounceMax = useRef(null);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Jost:wght@300;400;500&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    carregarPromocoes();
  }, []);

  const carregarPromocoes = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/produtos/promocoes`);
      const dados = await res.json();
      setProdutos(dados);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleInputMin = (val) => {
    setInputMin(val);
    clearTimeout(debounceMin.current);
    debounceMin.current = setTimeout(() => setPrecoMin(Number(val) || 0), 400);
  };

  const handleInputMax = (val) => {
    setInputMax(val);
    clearTimeout(debounceMax.current);
    debounceMax.current = setTimeout(() => setPrecoMax(Number(val) || 500), 400);
  };

  const limparFiltros = () => {
    setCategoriaAtiva("Todas");
    setMarcaAtiva("Todas");
    setPrecoMin(0);
    setPrecoMax(500);
    setInputMin("0");
    setInputMax("500");
  };

  const temFiltrosAtivos = categoriaAtiva !== "Todas" || marcaAtiva !== "Todas" || precoMin > 0 || precoMax < 500;

  const categorias = ["Todas", ...new Set(produtos.map(p => p.nome_categoria).filter(Boolean))];
  const marcas = ["Todas", ...new Set(produtos.map(p => p.nome_marca).filter(Boolean))];

  const produtosFiltrados = produtos
    .filter(p => {
      if (categoriaAtiva !== "Todas" && p.nome_categoria !== categoriaAtiva) return false;
      if (marcaAtiva !== "Todas" && p.nome_marca !== marcaAtiva) return false;
      if (parseFloat(p.preco) < precoMin || parseFloat(p.preco) > precoMax) return false;
      return true;
    })
    .sort((a, b) => {
      if (ordenacao === "desconto") return b.desconto - a.desconto;
      if (ordenacao === "preco_asc") return parseFloat(a.preco) - parseFloat(b.preco);
      if (ordenacao === "preco_desc") return parseFloat(b.preco) - parseFloat(a.preco);
      return 0;
    });

  return (
    <div style={sans} className="min-h-screen bg-[#F7F9F5] text-[#2C2C2C]">

      <Navbar />

      <div className="max-w-7xl mx-auto px-8 py-4">
        <div className="flex items-center gap-2 text-xs text-[#8FAF8A]">
          <Link to="/" className="hover:text-[#3D6B4A] transition-colors">Início</Link>
          <span>/</span>
          <span className="text-[#3D6B4A]">Promoções</span>
        </div>
      </div>

      {/* Banner */}
      <div className="bg-[#2C3A2C] py-12 px-8 mb-8 text-center relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-xs tracking-[0.2em] uppercase text-[#6B9E63] mb-2">Ofertas especiais</p>
          <h1 style={serif} className="text-5xl font-semibold text-white mb-3">Promoções</h1>
          <p className="text-sm text-[#A8C4A8] max-w-md mx-auto">Descobre as melhores ofertas e poupa nas tuas peças favoritas.</p>
        </div>
      </div>

      {/* Overlay mobile para filtros */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 md:hidden ${filtrosAbertos ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setFiltrosAbertos(false)}
      />

      {/* Drawer de filtros mobile */}
      <div className={`fixed top-0 left-0 h-full w-[80vw] max-w-xs z-50 bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out md:hidden ${filtrosAbertos ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8F0E6]">
          <p className="text-sm font-semibold tracking-widest uppercase text-[#2C3A2C]">Filtros</p>
          <button onClick={() => setFiltrosAbertos(false)} className="p-1 text-[#8FAF8A] hover:text-[#3D6B4A] transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <SidebarFiltros
            ordenacoes={ordenacoes} ordenacao={ordenacao} setOrdenacao={setOrdenacao}
            categorias={categorias} categoriaAtiva={categoriaAtiva} setCategoriaAtiva={setCategoriaAtiva}
            marcas={marcas} marcaAtiva={marcaAtiva} setMarcaAtiva={setMarcaAtiva}
            inputMin={inputMin} inputMax={inputMax}
            handleInputMin={handleInputMin} handleInputMax={handleInputMax}
            temFiltrosAtivos={temFiltrosAtivos} limparFiltros={limparFiltros}
            produtos={produtos}
          />
        </div>
        {temFiltrosAtivos && (
          <div className="px-5 pb-5">
            <button onClick={() => { limparFiltros(); setFiltrosAbertos(false); }}
              className="w-full text-xs text-[#C0392B] border border-[#FDECEA] bg-[#FDECEA] py-2.5 rounded-lg hover:bg-[#C0392B] hover:text-white transition-all">
              Limpar filtros
            </button>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16 flex gap-8 items-start">

        {/* Sidebar desktop */}
        <div className="hidden md:block w-48 flex-shrink-0">
          <SidebarFiltros
            ordenacoes={ordenacoes} ordenacao={ordenacao} setOrdenacao={setOrdenacao}
            categorias={categorias} categoriaAtiva={categoriaAtiva} setCategoriaAtiva={setCategoriaAtiva}
            marcas={marcas} marcaAtiva={marcaAtiva} setMarcaAtiva={setMarcaAtiva}
            inputMin={inputMin} inputMax={inputMax}
            handleInputMin={handleInputMin} handleInputMax={handleInputMax}
            temFiltrosAtivos={temFiltrosAtivos} limparFiltros={limparFiltros}
            produtos={produtos}
          />
        </div>

        {/* Conteúdo */}
        <div className="flex-1 min-w-0">
          <p className="text-xs text-[#8FAF8A] mb-6">
            Promoções / <span className="text-[#3D6B4A]">{produtosFiltrados.length} resultados</span>
          </p>

          {/* Botão filtros mobile */}
          <div className="flex items-center justify-between mb-4 md:hidden">
            <button
              onClick={() => setFiltrosAbertos(true)}
              className="flex items-center gap-2 border border-[#C8DFC4] rounded-lg px-4 py-2 text-xs text-[#3D6B4A] bg-white hover:bg-[#F0F5EE] transition-all"
            >
              <SlidersHorizontal size={14} />
              Filtros
              {temFiltrosAtivos && <span className="w-4 h-4 rounded-full bg-[#3D6B4A] text-white text-[9px] flex items-center justify-center">!</span>}
            </button>
            {temFiltrosAtivos && (
              <button onClick={limparFiltros} className="text-xs text-[#C0392B] hover:underline">
                Limpar filtros
              </button>
            )}
          </div>

          {loading ? (
            <p className="text-sm text-[#8FAF8A]">A carregar promoções...</p>
          ) : produtosFiltrados.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {produtosFiltrados.map(prod => (
                <Link to={`/produto/${prod.id_produto}`} key={prod.id_produto} className="block" onClick={() => window.scrollTo(0, 0)}>
                  <div className="bg-white rounded-2xl overflow-hidden border border-[#E8F0E6] hover:shadow-lg hover:shadow-green-100 transition-all group cursor-pointer">
                    <div className="bg-[#F0F5EE] h-52 flex items-center justify-center relative overflow-hidden">
                      <span className="absolute top-2.5 left-2.5 text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-full font-medium bg-[#FDECEA] text-[#C0392B]">
                        -{prod.desconto}%
                      </span>
                      {prod.imagem_principal
                        ? <img src={prod.imagem_principal} alt={prod.nome_produto} className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
                        : <span className="text-6xl text-[#C8DFC4]">📷</span>
                      }
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-xs text-[#8FAF8A]">{prod.nome_categoria}</div>
                        <div className="text-[10px] text-[#6B9E63]">{prod.nome_marca}</div>
                      </div>
                      <div className="text-sm font-medium text-[#2C3A2C] mb-1.5">{prod.nome_produto}</div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-semibold text-[#C0392B]">{parseFloat(prod.preco).toFixed(2).replace('.', ',')}€</span>
                        <span className="text-xs text-gray-400 line-through">{parseFloat(prod.preco_anterior).toFixed(2).replace('.', ',')}€</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p style={serif} className="text-3xl text-[#C8DFC4] mb-2">Nenhuma promoção encontrada</p>
              <p className="text-sm text-[#8FAF8A]">Tenta ajustar os filtros</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

// ─── Sidebar de filtros (partilhada entre desktop e drawer mobile) ────────────

function SidebarFiltros({
  ordenacoes, ordenacao, setOrdenacao,
  categorias, categoriaAtiva, setCategoriaAtiva,
  marcas, marcaAtiva, setMarcaAtiva,
  inputMin, inputMax, handleInputMin, handleInputMax,
  temFiltrosAtivos, limparFiltros, produtos,
}) {
  return (
    <div>
      {/* Ordenação */}
      <div className="mb-6">
        <p className="text-xs font-semibold tracking-widest uppercase text-[#2C3A2C] mb-3">Ordenar por</p>
        <div className="flex flex-col gap-1.5">
          {ordenacoes.map(op => (
            <button key={op.id} onClick={() => setOrdenacao(op.id)}
              className={`text-left text-xs py-1.5 px-3 rounded-lg transition-all ${
                ordenacao === op.id ? "bg-[#3D6B4A] text-white" : "text-[#4A5C4A] hover:bg-[#F0F5EE] hover:text-[#3D6B4A]"
              }`}>
              {op.label}
            </button>
          ))}
        </div>
      </div>

      {/* Categorias */}
      <div className="mb-6">
        <p className="text-xs font-semibold tracking-widest uppercase text-[#2C3A2C] mb-3">Categoria</p>
        <div className="flex flex-col gap-1">
          {categorias.map(cat => (
            <button key={cat} onClick={() => setCategoriaAtiva(cat)}
              className={`text-left text-xs py-1.5 px-3 rounded-lg transition-all flex items-center justify-between ${
                categoriaAtiva === cat ? "bg-[#3D6B4A] text-white" : "text-[#4A5C4A] hover:bg-[#F0F5EE] hover:text-[#3D6B4A]"
              }`}>
              <span>{cat}</span>
              {cat !== "Todas" && (
                <span className={`text-[10px] ${categoriaAtiva === cat ? "text-white opacity-70" : "text-[#8FAF8A]"}`}>
                  {produtos.filter(p => p.nome_categoria === cat).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Marca */}
      <div className="mb-6">
        <p className="text-xs font-semibold tracking-widest uppercase text-[#2C3A2C] mb-3">Marca</p>
        <div className="flex flex-col gap-1">
          {marcas.map(m => (
            <button key={m} onClick={() => setMarcaAtiva(m)}
              className={`text-left text-xs py-1.5 px-3 rounded-lg transition-all ${
                marcaAtiva === m ? "bg-[#3D6B4A] text-white" : "text-[#4A5C4A] hover:bg-[#F0F5EE] hover:text-[#3D6B4A]"
              }`}>
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Preço */}
      <div className="mb-6">
        <p className="text-xs font-semibold tracking-widest uppercase text-[#2C3A2C] mb-3">Preço</p>
        <div className="flex items-center gap-2">
          <div className="flex-1 border border-[#C8DFC4] rounded-lg px-2 py-1.5 bg-white">
            <p className="text-[10px] text-[#8FAF8A] mb-0.5">Mín</p>
            <div className="flex items-center">
              <input type="number" min="0" value={inputMin}
                onChange={e => handleInputMin(e.target.value)}
                className="w-full text-xs text-[#2C3A2C] outline-none bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              <span className="text-xs text-[#8FAF8A]">€</span>
            </div>
          </div>
          <span className="text-xs text-[#C8DFC4]">—</span>
          <div className="flex-1 border border-[#C8DFC4] rounded-lg px-2 py-1.5 bg-white">
            <p className="text-[10px] text-[#8FAF8A] mb-0.5">Máx</p>
            <div className="flex items-center">
              <input type="number" max="9999" value={inputMax}
                onChange={e => handleInputMax(e.target.value)}
                className="w-full text-xs text-[#2C3A2C] outline-none bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              <span className="text-xs text-[#8FAF8A]">€</span>
            </div>
          </div>
        </div>
      </div>

      {temFiltrosAtivos && (
        <button onClick={limparFiltros}
          className="hidden md:block w-full text-xs text-[#C0392B] border border-[#FDECEA] bg-[#FDECEA] py-2 rounded-lg hover:bg-[#C0392B] hover:text-white transition-all">
          Limpar filtros
        </button>
      )}
    </div>
  );
}