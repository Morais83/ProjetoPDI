import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Footer from "./footer";
import Navbar from "./navbar";

const serif = { fontFamily: "'Cormorant Garamond', Georgia, serif" };
const sans = { fontFamily: "'Jost', sans-serif" };

const cores = ["Preto", "Branco", "Cinzento", "Azul", "Verde", "Vermelho", "Roxo", "Laranja", "Amarelo", "Bege", "Rosa", "Castanho"];
const tamanhos = ["XS", "S", "M", "L", "XL", "XXL"];

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const termoPesquisa = searchParams.get("q");

  const departamento = searchParams.get("departamento");
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaAtiva, setCategoriaAtiva] = useState(searchParams.get("categoria") || "Explora tudo");
  const [tamanhosSelecionados, setTamanhosSelecionados] = useState([]);
  const [coresSelecionadas, setCoresSelecionadas] = useState([]);
  const [marcaPesquisa, setMarcaPesquisa] = useState("");
  const [precoMin, setPrecoMin] = useState(0);
  const [precoMax, setPrecoMax] = useState(500);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Jost:wght@300;400;500&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    carregarDados();
  }, [termoPesquisa]); 

  useEffect(() => {
    const cat = searchParams.get("categoria");
    if (cat) {
      setCategoriaAtiva(cat);
    } else {
      setCategoriaAtiva("Explora tudo");
    }
  }, [searchParams]);

  const carregarDados = async () => {
    setLoading(true);
    try {
      let urlProdutos = 'http://localhost:5000/api/produtos';
      if (termoPesquisa) {
        urlProdutos = `http://localhost:5000/api/produtos/pesquisa?q=${encodeURIComponent(termoPesquisa)}`;
      }

      const [resProd, resCat] = await Promise.all([
        fetch(urlProdutos),
        fetch('http://localhost:5000/api/categorias'),
      ]);
      const prods = await resProd.json();
      const cats = await resCat.json();
      setProdutos(prods);
      setCategorias(cats.filter(c => c.id_categoria_pai !== null));

      if (termoPesquisa) {
        setCategoriaAtiva("Explora tudo");
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const toggleTamanho = (t) =>
    setTamanhosSelecionados(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const toggleCor = (c) =>
    setCoresSelecionadas(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);

  const selecionarCategoria = (cat) => {
    setCategoriaAtiva(cat);
    if (cat === "Explora tudo") {
      setSearchParams({}); 
    } else {
      setSearchParams({ categoria: cat }); 
    }
  };

  const listasDepartamentos = {
    roupa: ["Blusas", "Vestidos", "Sobretudos", "Calças e Calções", "Saias", "T-shirt e Tops", "Roupa de banho", "Casacos", "Sweatshirts e Hoodies", "Malhas", "Blazers e coletes", "Roupa Interior", "Macacões"],
    calcado: ["Sapatilhas", "Sandálias", "Botas", "Botins", "Saltos altos", "Sapatos rasos", "Chinelos"],
    acessorios: ["Malas de mão", "Carteiras", "Mochilas", "Cintos", "Chapéus", "Lenços", "Óculos de sol", "Joalharia", "Bijuteria"]
  };

  const produtosFiltrados = produtos.filter(p => {
    if (categoriaAtiva !== "Explora tudo" && p.nome_categoria !== categoriaAtiva) return false;
    
    if (categoriaAtiva === "Explora tudo" && departamento) {
      const categoriasValidas = listasDepartamentos[departamento];
      if (categoriasValidas && !categoriasValidas.includes(p.nome_categoria)) {
        return false; 
      }
    }

    // 3. Restantes filtros (preço, marca, etc)
    if (precoMin && parseFloat(p.preco) < precoMin) return false;
    if (precoMax && parseFloat(p.preco) > precoMax) return false;
    if (marcaPesquisa && !p.nome_marca?.toLowerCase().includes(marcaPesquisa.toLowerCase())) return false;
    return true;
  });

  const categoriasParaMostrar = departamento
    ? categorias.filter(cat => listasDepartamentos[departamento]?.includes(cat.nome_categoria))
    : categorias;

  return (
    <div style={sans} className="min-h-screen bg-[#F7F9F5] text-[#2C2C2C]">
      <div className="bg-[#3D6B4A] text-white text-center py-2 text-xs tracking-widest">
        ✦ Envio gratuito em compras acima de 50€ &nbsp;|&nbsp; Nova coleção Primavera-Verão disponível ✦
      </div>

      <Navbar />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-8 py-4">
        <div className="flex items-center gap-2 text-xs text-[#8FAF8A]">
          <Link to="/" className="hover:text-[#3D6B4A] transition-colors">Início</Link>
          <span>/</span>
          <span className="text-[#3D6B4A]">
            {termoPesquisa ? `Resultados para: "${termoPesquisa}"` : categoriaAtiva}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 pb-16 flex gap-8">

        {/* Sidebar */}
        <div className="w-48 flex-shrink-0">

          {/* Tamanho */}
          <div className="mb-6">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#2C3A2C] mb-3">Tamanho</p>
            <div className="flex flex-wrap gap-2">
              {tamanhos.map(t => (
                <button key={t} onClick={() => toggleTamanho(t)}
                  className={`px-2 h-9 rounded-lg border text-xs font-medium transition-all ${
                    tamanhosSelecionados.includes(t)
                      ? "border-[#3D6B4A] bg-[#3D6B4A] text-white"
                      : "border-[#C8DFC4] bg-white text-[#4A5C4A] hover:border-[#3D6B4A]"
                  }`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Cor */}
          <div className="mb-6">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#2C3A2C] mb-3">Cor</p>
            <div className="flex flex-col gap-1.5">
              {cores.map(c => (
                <label key={c} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={coresSelecionadas.includes(c)} onChange={() => toggleCor(c)} className="w-3 h-3 accent-[#3D6B4A]" />
                  <span className="text-xs text-[#4A5C4A]">{c}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Marca */}
          <div className="mb-6">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#2C3A2C] mb-3">Marca</p>
            <div className="flex items-center border border-[#C8DFC4] rounded-lg px-3 py-2 bg-white gap-2">
              <span className="text-xs text-[#8FAF8A]">🔍</span>
              <input type="text" placeholder="Pesquisar por marca" value={marcaPesquisa}
                onChange={e => setMarcaPesquisa(e.target.value)}
                className="text-xs outline-none bg-transparent text-[#4A5C4A] placeholder:text-[#C8DFC4] w-full" />
            </div>
          </div>

          {/* Preço */}
          <div className="mb-6">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#2C3A2C] mb-3">Preço</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 border border-[#C8DFC4] rounded-lg px-2 py-1.5 bg-white">
                <p className="text-[10px] text-[#8FAF8A] mb-0.5">Mín</p>
                <div className="flex items-center">
                  <input type="number" min="0" max={precoMax} value={precoMin}
                    onChange={e => setPrecoMin(Number(e.target.value))}
                    className="w-full text-xs text-[#2C3A2C] outline-none bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                  <span className="text-xs text-[#8FAF8A]">€</span>
                </div>
              </div>
              <span className="text-xs text-[#C8DFC4]">—</span>
              <div className="flex-1 border border-[#C8DFC4] rounded-lg px-2 py-1.5 bg-white">
                <p className="text-[10px] text-[#8FAF8A] mb-0.5">Máx</p>
                <div className="flex items-center">
                  <input type="number" min={precoMin} max="500" value={precoMax}
                    onChange={e => setPrecoMax(Number(e.target.value))}
                    className="w-full text-xs text-[#2C3A2C] outline-none bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                  <span className="text-xs text-[#8FAF8A]">€</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="flex-1">
          {/* Categorias */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button onClick={() => {
                setCategoriaAtiva("Explora tudo");
                if (departamento) setSearchParams({ departamento }); 
                else setSearchParams({});
              }}
              className={`px-4 py-1.5 rounded-full text-xs tracking-wide transition-all border ${
                categoriaAtiva === "Explora tudo"
                  ? "bg-[#3D6B4A] text-white border-[#3D6B4A]"
                  : "bg-white text-[#4A5C4A] border-[#C8DFC4] hover:border-[#3D6B4A] hover:text-[#3D6B4A]"
              }`}>
              {departamento ? `Tudo em ${departamento}` : "Explora tudo"}
            </button>
            
            {categoriasParaMostrar.map(cat => (
              <button key={cat.id_categoria} onClick={() => {
                  setCategoriaAtiva(cat.nome_categoria);
                  if (departamento) setSearchParams({ departamento, categoria: cat.nome_categoria });
                  else setSearchParams({ categoria: cat.nome_categoria });
                }}
                className={`px-4 py-1.5 rounded-full text-xs tracking-wide transition-all border ${
                  categoriaAtiva === cat.nome_categoria
                    ? "bg-[#3D6B4A] text-white border-[#3D6B4A]"
                    : "bg-white text-[#4A5C4A] border-[#C8DFC4] hover:border-[#3D6B4A] hover:text-[#3D6B4A]"
                }`}>
                {cat.nome_categoria}
              </button>
            ))}
          </div>

          {/* Info */}
          <p className="text-xs text-[#8FAF8A] mb-4">
            {/* 5. ATUALIZAR O CABEÇALHO DA GRELHA */}
            {termoPesquisa ? `A pesquisar por "${termoPesquisa}"` : categoriaAtiva} / <span className="text-[#3D6B4A]">{produtosFiltrados.length} resultados</span>
          </p>

          {/* Grid */}
          {loading ? (
            <p className="text-sm text-[#8FAF8A]">A carregar produtos...</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {produtosFiltrados.map(prod => (
                <Link to={`/produto/${prod.id_produto}`} key={prod.id_produto} className="block" onClick={() => window.scrollTo(0, 0)}>
                  <div className="bg-white rounded-2xl overflow-hidden border border-[#E8F0E6] hover:shadow-lg hover:shadow-green-100 transition-all group cursor-pointer">
                    <div className="bg-[#F0F5EE] h-52 flex items-center justify-center overflow-hidden">
                      {prod.imagem_principal
                        ? <img src={prod.imagem_principal} alt={prod.nome_produto} className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
                        : <span className="text-6xl text-[#C8DFC4]">📷</span>
                      }
                    </div>
                    <div className="p-4">
                      <div className="text-xs text-[#8FAF8A] mb-1">{prod.nome_categoria}</div>
                      <div className="text-sm font-medium text-[#2C3A2C] mb-1.5">{prod.nome_produto}</div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-base font-semibold text-[#3D6B4A]">{parseFloat(prod.preco).toFixed(2).replace('.', ',')}€</span>
                        {prod.preco_anterior && <span className="text-xs text-gray-400 line-through">{parseFloat(prod.preco_anterior).toFixed(2).replace('.', ',')}€</span>}
                      </div>
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
              <p className="text-sm text-[#8FAF8A]">Tenta ajustar os filtros ou pesquisar com outras palavras.</p>
              {termoPesquisa && (
                <button 
                  onClick={() => setSearchParams({})} 
                  className="mt-4 text-xs tracking-widest uppercase text-[#4A5C4A] hover:text-[#3D6B4A] transition-colors border-b border-[#3D6B4A] pb-0.5"
                >
                  Limpar pesquisa
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