import { useState, useEffect, useMemo, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Footer from "./footer";
import Navbar from "./navbar";
import { SkeletonCard } from "./skeleton";
import { Search, SlidersHorizontal, X } from "lucide-react";

const serif = { fontFamily: "'Cormorant Garamond', Georgia, serif" };
const sans  = { fontFamily: "'Jost', sans-serif" };

const ORDEM_TAMANHOS = ["XS","S","M","L","XL","XXL","35","36","37","38","39","40","41","42","43","44"];

// Mapa de hex aproximado para swatches das cores comuns
const HEX_CORES = {
  "Preto": "#1a1a1a", "Branco": "#f0f0f0", "Cinzento": "#9ca3af",
  "Azul": "#3b82f6",  "Verde": "#22c55e",  "Vermelho": "#ef4444",
  "Roxo": "#a855f7",  "Laranja": "#f97316", "Amarelo": "#facc15",
  "Bege": "#d4b896",  "Rosa": "#f472b6",   "Castanho": "#92400e",
  "Navy": "#1e3a5f",  "Creme": "#f5f0e8",  "Bordeaux": "#6b1a2a",
};

const capitalizar = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;

const listasDepartamentos = {
  roupa:      ["Blusas","Vestidos","Sobretudos","Calças e Calções","Saias","T-shirt e Tops","Roupa de banho","Casacos","Sweatshirts e Hoodies","Malhas","Blazers e coletes","Roupa Interior","Macacões"],
  calcado:    ["Sapatilhas","Sandálias","Botas","Botins","Saltos altos","Sapatos rasos","Chinelos"],
  acessorios: ["Malas de mão","Carteiras","Mochilas","Cintos","Chapéus","Lenços","Óculos de sol","Joalharia","Bijuteria"],
};

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const termoPesquisa = searchParams.get("q");
  const departamento  = searchParams.get("departamento");

  const [produtos, setProdutos]         = useState([]);
  const [categorias, setCategorias]     = useState([]);
  const [categoriaAtiva, setCategoriaAtiva] = useState(searchParams.get("categoria") || "Explora tudo");
  const [tamanhosSelecionados, setTamanhosSelecionados] = useState([]);
  const [coresSelecionadas, setCoresSelecionadas]       = useState([]);
  const [marcaPesquisa, setMarcaPesquisa]               = useState("");
  const [precoMin, setPrecoMin]         = useState(0);
  const [precoMax, setPrecoMax]         = useState(500);
  const [inputMin, setInputMin]         = useState("0");
  const [inputMax, setInputMax]         = useState("500");
  const [loading, setLoading]           = useState(true);
  const [ordenacao, setOrdenacao]       = useState("recentes");
  const [filtroDrawer, setFiltroDrawer] = useState(false);
  const debounceMin = useRef(null);
  const debounceMax = useRef(null);

  useEffect(() => {
  }, []);

  useEffect(() => { carregarDados(); }, [termoPesquisa]);

  useEffect(() => {
    const cat = searchParams.get("categoria");
    setCategoriaAtiva(cat || "Explora tudo");
  }, [searchParams]);

  const carregarDados = async () => {
    setLoading(true);
    try {
      const url = termoPesquisa
        ? `${import.meta.env.VITE_API_URL}/api/produtos/pesquisa?q=${encodeURIComponent(termoPesquisa)}`
        : `${import.meta.env.VITE_API_URL}/api/produtos`;
      const [resProd, resCat] = await Promise.all([
        fetch(url),
        fetch(`${import.meta.env.VITE_API_URL}/api/categorias`),
      ]);
      const prods = await resProd.json();
      const cats  = await resCat.json();
      setProdutos(Array.isArray(prods) ? prods : []);
      setCategorias(cats.filter(c => c.id_categoria_pai !== null));
      if (termoPesquisa) setCategoriaAtiva("Explora tudo");
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  // ── Helpers ──────────────────────────────────────────────────────────────────

  const parseLista = (str) => str ? str.split(',').map(s => s.trim()).filter(Boolean) : [];

  const toggleTamanho = (t) =>
    setTamanhosSelecionados(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const toggleCor = (c) =>
    setCoresSelecionadas(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);

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
    setTamanhosSelecionados([]);
    setCoresSelecionadas([]);
    setMarcaPesquisa("");
    setPrecoMin(0);
    setPrecoMax(500);
    setInputMin("0");
    setInputMax("500");
    setOrdenacao("recentes");
  };

  const filtrosAtivos =
    tamanhosSelecionados.length + coresSelecionadas.length +
    (marcaPesquisa ? 1 : 0) +
    (precoMin > 0 || precoMax < 500 ? 1 : 0);

  // ── Produtos filtrados por departamento/categoria (sem cor/tamanho) ───────────
  // Usado para calcular quais cores/tamanhos mostrar na sidebar
  const produtosBase = useMemo(() => produtos.filter(p => {
    if (categoriaAtiva !== "Explora tudo" && p.nome_categoria !== categoriaAtiva) return false;
    if (categoriaAtiva === "Explora tudo" && departamento) {
      const validas = listasDepartamentos[departamento];
      if (validas && !validas.includes(p.nome_categoria)) return false;
    }
    if (precoMin && parseFloat(p.preco) < precoMin) return false;
    if (precoMax && parseFloat(p.preco) > precoMax) return false;
    if (marcaPesquisa && !p.nome_marca?.toLowerCase().includes(marcaPesquisa.toLowerCase())) return false;
    return true;
  }), [produtos, categoriaAtiva, departamento, precoMin, precoMax, marcaPesquisa]);

  // ── Cores e tamanhos disponíveis (dinâmicos, baseados nos produtos visíveis) ──
  const coresDisponiveis = useMemo(() => {
    const mapaCores = new Map();
    
    produtosBase.forEach(p => {
      const nomes = parseLista(p.cores_disponiveis);
      const hexs = parseLista(p.hex_disponiveis); 
      
      nomes.forEach((nome, idx) => {
        if (!mapaCores.has(nome)) {
          mapaCores.set(nome, hexs[idx] || "#E8F0E6");
        }
      });
    });

    return Array.from(mapaCores.entries()).map(([nome, hex]) => ({ nome, hex }));
  }, [produtosBase]);

  const tamanhosDisponiveis = useMemo(() => {
    const set = new Set();
    produtosBase.forEach(p => parseLista(p.tamanhos_disponiveis).forEach(t => set.add(t)));
    return [...set].sort((a, b) => ORDEM_TAMANHOS.indexOf(a) - ORDEM_TAMANHOS.indexOf(b));
  }, [produtosBase]);

  // ── Filtro final (inclui cor + tamanho) ───────────────────────────────────────
  const produtosFiltrados = useMemo(() => {
    let lista = produtosBase.filter(p => {
      if (tamanhosSelecionados.length > 0) {
        const tam = parseLista(p.tamanhos_disponiveis);
        if (!tamanhosSelecionados.some(t => tam.includes(t))) return false;
      }
      if (coresSelecionadas.length > 0) {
        const cor = parseLista(p.cores_disponiveis);
        if (!coresSelecionadas.some(c => cor.includes(c))) return false;
      }
      return true;
    });

    switch (ordenacao) {
      case "preco-asc":  lista = [...lista].sort((a, b) => parseFloat(a.preco) - parseFloat(b.preco)); break;
      case "preco-desc": lista = [...lista].sort((a, b) => parseFloat(b.preco) - parseFloat(a.preco)); break;
      case "nome":       lista = [...lista].sort((a, b) => a.nome_produto.localeCompare(b.nome_produto)); break;
      default: break; // recentes — já vem ordenado por id DESC
    }
    return lista;
  }, [produtosBase, tamanhosSelecionados, coresSelecionadas, ordenacao]);

  const categoriasParaMostrar = departamento
    ? categorias.filter(cat => listasDepartamentos[departamento]?.includes(cat.nome_categoria))
    : categorias;

  const selecionarCategoria = (cat) => {
    setCategoriaAtiva(cat);
    if (cat === "Explora tudo") setSearchParams(departamento ? { departamento } : {});
    else setSearchParams(departamento ? { departamento, categoria: cat } : { categoria: cat });
  };

  const filtrosProps = {
    filtrosAtivos, limparFiltros,
    tamanhosDisponiveis, tamanhosSelecionados, toggleTamanho,
    coresDisponiveis, coresSelecionadas, toggleCor,
    marcaPesquisa, setMarcaPesquisa,
    inputMin, inputMax, handleInputMin, handleInputMax,
  };

  return (
    <div style={sans} className="min-h-screen bg-[#F7F9F5] text-[#2C2C2C]">
      <Navbar />

      {/* Drawer mobile de filtros */}
      <div className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 md:hidden ${filtroDrawer ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setFiltroDrawer(false)} />
      <div className={`fixed top-0 right-0 h-full w-[85vw] max-w-xs z-50 bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out md:hidden ${filtroDrawer ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8F0E6]">
          <p className="text-sm font-semibold text-[#1A2E1A]">Filtros</p>
          <button onClick={() => setFiltroDrawer(false)} className="p-1 text-[#8FAF8A] hover:text-[#3D6B4A]"><X size={20} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          <FiltrosConteudo {...filtrosProps} />
        </div>
        <div className="p-4 border-t border-[#E8F0E6]">
          <button onClick={() => setFiltroDrawer(false)}
            className="w-full py-3 bg-[#3D6B4A] text-white text-sm rounded-xl hover:bg-[#2C5038] transition-colors">
            Ver resultados ({produtosFiltrados.length})
          </button>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
        <div className="flex items-center gap-2 text-xs text-[#8FAF8A]">
          <Link to="/" className="hover:text-[#3D6B4A] transition-colors">Início</Link>
          <span>/</span>
          <span className="text-[#3D6B4A]">
            {termoPesquisa ? `Resultados para: "${termoPesquisa}"` : categoriaAtiva}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16 flex gap-8">

        {/* ── Sidebar desktop ── */}
        <div className="hidden md:block w-52 flex-shrink-0 space-y-6">
          <FiltrosConteudo {...filtrosProps} />
        </div>

        {/* ── Conteúdo ── */}
        <div className="flex-1 min-w-0">

          {/* Botão filtros mobile */}
          <div className="md:hidden flex items-center justify-between mb-4">
            <button onClick={() => setFiltroDrawer(true)}
              className="flex items-center gap-2 px-4 py-2 border border-[#C8DFC4] rounded-xl text-sm text-[#4A5C4A] hover:border-[#3D6B4A] hover:text-[#3D6B4A] transition-all bg-white">
              <SlidersHorizontal size={15} />
              Filtros
              {filtrosAtivos > 0 && <span className="bg-[#3D6B4A] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-semibold">{filtrosAtivos}</span>}
            </button>
            <select value={ordenacao} onChange={e => setOrdenacao(e.target.value)}
              className="text-xs border border-[#C8DFC4] rounded-xl px-3 py-2 bg-white text-[#4A5C4A] outline-none focus:border-[#3D6B4A] transition-colors cursor-pointer">
              <option value="recentes">Mais recentes</option>
              <option value="preco-asc">Preço ↑</option>
              <option value="preco-desc">Preço ↓</option>
              <option value="nome">Nome A→Z</option>
            </select>
          </div>

          {/* Categorias */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => selecionarCategoria("Explora tudo")}
              className={`px-4 py-1.5 rounded-full text-xs tracking-wide transition-all border ${
                categoriaAtiva === "Explora tudo"
                  ? "bg-[#3D6B4A] text-white border-[#3D6B4A]"
                  : "bg-white text-[#4A5C4A] border-[#C8DFC4] hover:border-[#3D6B4A] hover:text-[#3D6B4A]"
              }`}>
              {departamento ? `Tudo em ${departamento}` : "Explora tudo"}
            </button>
            {categoriasParaMostrar.map(cat => (
              <button key={cat.id_categoria}
                onClick={() => selecionarCategoria(cat.nome_categoria)}
                className={`px-4 py-1.5 rounded-full text-xs tracking-wide transition-all border ${
                  categoriaAtiva === cat.nome_categoria
                    ? "bg-[#3D6B4A] text-white border-[#3D6B4A]"
                    : "bg-white text-[#4A5C4A] border-[#C8DFC4] hover:border-[#3D6B4A] hover:text-[#3D6B4A]"
                }`}>
                {cat.nome_categoria}
              </button>
            ))}
          </div>

          {/* Barra de info + ordenação */}
          <div className="flex items-center justify-between mb-5">
            <p className="text-xs text-[#8FAF8A]">
              {termoPesquisa ? `"${termoPesquisa}"` : categoriaAtiva}
              {" / "}
              <span className="text-[#3D6B4A] font-medium">{produtosFiltrados.length} resultados</span>
            </p>
            <select
              value={ordenacao}
              onChange={e => setOrdenacao(e.target.value)}
              className="text-xs border border-[#C8DFC4] rounded-lg px-3 py-1.5 bg-white text-[#4A5C4A] outline-none focus:border-[#3D6B4A] transition-colors cursor-pointer"
            >
              <option value="recentes">Mais recentes</option>
              <option value="preco-asc">Preço: menor → maior</option>
              <option value="preco-desc">Preço: maior → menor</option>
              <option value="nome">Nome A → Z</option>
            </select>
          </div>

          {/* Tags dos filtros activos */}
          {(tamanhosSelecionados.length > 0 || coresSelecionadas.length > 0) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tamanhosSelecionados.map(t => (
                <span key={t}
                  className="flex items-center gap-1.5 px-3 py-1 bg-[#E8F0E6] text-[#3D6B4A] text-xs rounded-full">
                  {t}
                  <button onClick={() => toggleTamanho(t)} className="hover:text-[#C0392B] transition-colors">✕</button>
                </span>
              ))}
              {coresSelecionadas.map(c => (
                <span key={c}
                  className="flex items-center gap-1.5 px-3 py-1 bg-[#E8F0E6] text-[#3D6B4A] text-xs rounded-full">
                  {HEX_CORES[capitalizar(c)] && (
                    <span className="w-3 h-3 rounded-full border border-white/50" style={{ background: HEX_CORES[capitalizar(c)] }} />
                  )}
                  {capitalizar(c)}
                  <button onClick={() => toggleCor(c)} className="hover:text-[#C0392B] transition-colors">✕</button>
                </span>
              ))}
            </div>
          )}

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {produtosFiltrados.map(prod => (
                <Link to={`/produto/${prod.id_produto}`} key={prod.id_produto}
                  className="block group" onClick={() => window.scrollTo(0, 0)}>
                  <div className="bg-white rounded-2xl overflow-hidden border border-[#E8F0E6] hover:shadow-lg hover:shadow-green-100/60 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                    <div className="bg-[#F0F5EE] h-44 md:h-52 flex items-center justify-center overflow-hidden relative">
                      {prod.imagem_principal
                        ? <img loading="lazy" src={prod.imagem_principal} alt={prod.nome_produto}
                            className="h-full w-full object-cover group-hover:scale-107 transition-transform duration-500" />
                        : <span className="text-5xl text-[#C8DFC4]">📷</span>
                      }
                      {prod.preco_anterior && (
                        <span className="absolute top-2 left-2 bg-[#C0392B] text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
                          -{Math.round((1 - prod.preco / prod.preco_anterior) * 100)}%
                        </span>
                      )}
                    </div>
                    <div className="p-3 md:p-4">
                      <div className="text-[10px] text-[#8FAF8A] mb-1">{prod.nome_categoria}</div>
                      <div className="text-xs md:text-sm font-medium text-[#2C3A2C] mb-1.5 line-clamp-2">{prod.nome_produto}</div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm md:text-base font-semibold text-[#3D6B4A]">
                          {parseFloat(prod.preco).toFixed(2).replace('.', ',')}€
                        </span>
                        {prod.preco_anterior && (
                          <span className="text-xs text-gray-400 line-through">
                            {parseFloat(prod.preco_anterior).toFixed(2).replace('.', ',')}€
                          </span>
                        )}
                      </div>
                      {prod.cores_disponiveis && (
                        <div className="flex items-center gap-1 mt-2">
                          {parseLista(prod.cores_disponiveis).slice(0, 4).map(c => (
                            <span key={c}
                              className="w-3.5 h-3.5 md:w-4 md:h-4 rounded-full border border-white shadow-sm ring-1 ring-[#D1D5DB]"
                              style={{ background: HEX_CORES[capitalizar(c)] || '#E8F0E6' }}
                              title={capitalizar(c)}
                            />
                          ))}
                          {parseLista(prod.cores_disponiveis).length > 4 && (
                            <span className="text-[10px] text-[#8FAF8A] ml-0.5">+{parseLista(prod.cores_disponiveis).length - 4}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!loading && produtosFiltrados.length === 0 && (
            <div className="text-center py-20">
              <p style={serif} className="text-3xl text-[#C8DFC4] mb-2">
                {termoPesquisa ? `Nenhum resultado para "${termoPesquisa}"` : "Nenhum produto encontrado"}
              </p>
              <p className="text-sm text-[#8FAF8A] mb-4">
                Tenta ajustar os filtros ou pesquisar com outras palavras.
              </p>
              {filtrosAtivos > 0 && (
                <button onClick={limparFiltros}
                  className="text-xs tracking-widest uppercase text-[#3D6B4A] border-b border-[#3D6B4A] pb-0.5 hover:text-[#2C5038] transition-colors">
                  Limpar filtros
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

// ─── Componente de filtros extraído para evitar re-mount ao digitar ───────────

function FiltrosConteudo({
  filtrosAtivos, limparFiltros,
  tamanhosDisponiveis, tamanhosSelecionados, toggleTamanho,
  coresDisponiveis, coresSelecionadas, toggleCor,
  marcaPesquisa, setMarcaPesquisa,
  inputMin, inputMax, handleInputMin, handleInputMax,
}) {
  return (
    <div className="space-y-6">
      {filtrosAtivos > 0 && (
        <button onClick={limparFiltros}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-[#3D6B4A] text-white text-xs tracking-wide hover:bg-[#2C5038] transition-all">
          <span>Limpar filtros</span>
          <span className="bg-white text-[#3D6B4A] rounded-full w-5 h-5 flex items-center justify-center font-semibold text-[10px]">{filtrosAtivos}</span>
        </button>
      )}

      {tamanhosDisponiveis.length > 0 && (
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-[#2C3A2C] mb-3">Tamanho</p>
          <div className="flex flex-wrap gap-2">
            {tamanhosDisponiveis.map(t => (
              <button key={t} onClick={() => toggleTamanho(t)}
                className={`px-2 h-9 rounded-lg border text-xs font-medium transition-all ${
                  tamanhosSelecionados.includes(t)
                    ? "border-[#3D6B4A] bg-[#3D6B4A] text-white"
                    : "border-[#C8DFC4] bg-white text-[#4A5C4A] hover:border-[#3D6B4A]"
                }`}>{t}</button>
            ))}
          </div>
        </div>
      )}

      {coresDisponiveis.length > 0 && (
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-[#2C3A2C] mb-3">Cor</p>
          <div className="flex flex-col gap-1.5">
            {coresDisponiveis.map(({ nome, hex }) => {
              const ativo = coresSelecionadas.includes(nome);
              return (
                <button key={nome} onClick={() => toggleCor(nome)}
                  className={`flex items-center gap-3 w-full px-2 py-1.5 rounded-lg transition-all text-left ${ativo ? "bg-[#E8F0E6]" : "hover:bg-[#F7F9F5]"}`}>
                  <span className="relative flex-shrink-0">
                    <span 
                      className={`block w-6 h-6 rounded-full border-2 transition-all ${ativo ? "border-[#3D6B4A] scale-110" : "border-[#D1D5DB]"}`}
                      style={{ background: hex }} 
                    />
                    {ativo && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white text-[9px] font-bold">✓</span>
                      </span>
                    )}
                  </span>
                  <span className={`text-xs transition-colors ${ativo ? "text-[#3D6B4A] font-semibold" : "text-[#4A5C4A]"}`}>
                    {capitalizar(nome)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div>
        <p className="text-xs font-semibold tracking-widest uppercase text-[#2C3A2C] mb-3">Marca</p>
        <div className="flex items-center border border-[#C8DFC4] rounded-lg px-3 py-2 bg-white gap-2 focus-within:border-[#3D6B4A] transition-colors">
          <Search size={14} strokeWidth={1.5} className="text-[#8FAF8A]" />
          <input type="text" placeholder="Pesquisar por marca" value={marcaPesquisa}
            onChange={e => setMarcaPesquisa(e.target.value)}
            className="text-xs outline-none bg-transparent text-[#4A5C4A] placeholder:text-[#C8DFC4] w-full" />
          {marcaPesquisa && <button onClick={() => setMarcaPesquisa("")} className="text-[#C8DFC4] hover:text-[#3D6B4A] text-xs">✕</button>}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold tracking-widest uppercase text-[#2C3A2C] mb-3">Preço</p>
        <div className="flex items-center gap-2">
          <div className="flex-1 border border-[#C8DFC4] rounded-lg px-2 py-1.5 bg-white focus-within:border-[#3D6B4A] transition-colors">
            <p className="text-[10px] text-[#8FAF8A] mb-0.5">Mín</p>
            <div className="flex items-center">
              <input type="number" min="0" value={inputMin}
                onChange={e => handleInputMin(e.target.value)}
                className="w-full text-xs text-[#2C3A2C] outline-none bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              <span className="text-xs text-[#8FAF8A]">€</span>
            </div>
          </div>
          <span className="text-xs text-[#C8DFC4]">—</span>
          <div className="flex-1 border border-[#C8DFC4] rounded-lg px-2 py-1.5 bg-white focus-within:border-[#3D6B4A] transition-colors">
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
    </div>
  );
}
