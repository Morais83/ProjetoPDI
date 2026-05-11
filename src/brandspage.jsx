import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";

const serif = { fontFamily: "'Cormorant Garamond', Georgia, serif" };
const sans = { fontFamily: "'Jost', sans-serif" };

// A tua lista de marcas estáticas (mantém as cores e emojis)
const marcas = [
  { id: "zara", nome: "Zara", emoji: "👗", descricao: "Moda contemporânea para o dia a dia", bg: "bg-[#F0F5EE]" },
  { id: "mango", nome: "Mango", emoji: "🧥", descricao: "Elegância mediterrânea e sofisticação", bg: "bg-[#F5F0EE]" },
  { id: "hm", nome: "H&M", emoji: "👚", descricao: "Moda acessível e sustentável", bg: "bg-[#EEF5EC]" },
  { id: "massimo", nome: "Massimo Dutti", emoji: "🧣", descricao: "Elegância clássica e atemporal", bg: "bg-[#F0F5EE]" },
  { id: "stradivarius", nome: "Stradivarius", emoji: "👜", descricao: "Tendências jovens e urbanas", bg: "bg-[#F5F0EE]" },
  { id: "bershka", nome: "Bershka", emoji: "👕", descricao: "Estilo urbano e descontraído", bg: "bg-[#EEF5EC]" },
  { id: "pullandbear", nome: "Pull&Bear", emoji: "🧤", descricao: "Moda casual e confortável", bg: "bg-[#F0F5EE]" },
  { id: "levis", nome: "Levi's", emoji: "👖", descricao: "O clássico do denim americano", bg: "bg-[#F5F0EE]" },
  { id: "nike", nome: "Nike", emoji: "👟", descricao: "Desempenho e estilo desportivo", bg: "bg-[#EEF5EC]" },
  { id: "guess", nome: "Guess", emoji: "💍", descricao: "Glamour e sensualidade americana", bg: "bg-[#F0F5EE]" },
  { id: "tommy", nome: "Tommy Hilfiger", emoji: "⚓", descricao: "Preppy americano com toque europeu", bg: "bg-[#F5F0EE]" },
  { id: "modachique", nome: "Moda Chique", emoji: "🌿", descricao: "A nossa marca exclusiva", bg: "bg-[#E8F0E6]" },
];

export default function BrandsPage() {
  const [marcaAtiva, setMarcaAtiva] = useState(null);
  const [pesquisa, setPesquisa] = useState("");
  
  // NOVOS ESTADOS: Para guardar os produtos reais da base de dados
  const [produtosDb, setProdutosDb] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Jost:wght@300;400;500&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    
    // IR BUSCAR OS PRODUTOS À BASE DE DADOS
    const fetchProdutos = async () => {
      try {
        const res = await fetch('import.meta.env.VITE_API_URL/api/produtos');
        const data = await res.json();
        setProdutosDb(data);
      } catch (err) {
        console.error("Erro ao buscar produtos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProdutos();
  }, []);

  const marcasFiltradas = marcas.filter((m) =>
    m.nome.toLowerCase().includes(pesquisa.toLowerCase())
  );

  const marcaSelecionada = marcas.find((m) => m.id === marcaAtiva);
  
  // FILTRAR OS PRODUTOS REAIS PELA MARCA SELECIONADA
  const produtosDaMarca = marcaSelecionada 
    ? produtosDb.filter((p) => p.nome_marca === marcaSelecionada.nome)
    : [];

  // Função para contar quantos produtos cada marca tem na base de dados
  const contarProdutos = (nomeMarca) => {
    return produtosDb.filter((p) => p.nome_marca === nomeMarca).length;
  };

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
          {marcaAtiva ? (
            <>
              <button onClick={() => setMarcaAtiva(null)} className="hover:text-[#3D6B4A] transition-colors">Marcas</button>
              <span>/</span>
              <span className="text-[#3D6B4A]">{marcaSelecionada?.nome}</span>
            </>
          ) : (
            <span className="text-[#3D6B4A]">Marcas</span>
          )}
        </div>
      </div>

      {/* Vista de Marcas (Lista Geral) */}
      {!marcaAtiva ? (
        <>
          {/* Banner */}
          <div className="bg-[#E8F0E6] py-12 px-8 text-center mb-8">
            <p className="text-xs tracking-[0.15em] uppercase text-[#6B9E63] mb-2">Descobre</p>
            <h1 style={serif} className="text-5xl font-semibold text-[#1A2E1A] mb-4">As nossas Marcas</h1>
            <p className="text-sm text-[#5C6E5C] max-w-md mx-auto">Explora as melhores marcas de moda feminina, todas reunidas num só lugar.</p>
          </div>

          <div className="max-w-7xl mx-auto px-8 pb-16">
            {/* Pesquisa */}
            <div className="flex items-center border border-[#C8DFC4] rounded-xl px-4 py-3 bg-white gap-2 mb-8 max-w-sm">
              <span className="text-sm text-[#8FAF8A]">🔍</span>
              <input
                type="text"
                placeholder="Pesquisar marca..."
                value={pesquisa}
                onChange={(e) => setPesquisa(e.target.value)}
                className="text-sm outline-none bg-transparent text-[#4A5C4A] placeholder:text-[#C8DFC4] w-full"
              />
            </div>

            {/* Grid de Marcas */}
            {loading ? (
              <p className="text-sm text-[#8FAF8A]">A carregar marcas...</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {marcasFiltradas.map((marca) => (
                  <button
                    key={marca.id}
                    onClick={() => { setMarcaAtiva(marca.id); window.scrollTo(0, 0); }}
                    className="bg-white rounded-2xl border border-[#E8F0E6] overflow-hidden hover:shadow-lg hover:shadow-green-100 hover:-translate-y-1 transition-all group text-left flex flex-col"
                  >
                    <div className={`${marca.bg} h-40 w-full flex items-center justify-center text-6xl group-hover:scale-105 transition-transform`}>
                      {marca.emoji}
                    </div>
                    <div className="p-4 w-full">
                      <div className="flex items-center justify-between mb-1">
                        <h3 style={serif} className="text-xl font-semibold text-[#1A2E1A]">{marca.nome}</h3>
                        <span className="text-xs text-[#8FAF8A]">{contarProdutos(marca.nome)} produtos</span>
                      </div>
                      <p className="text-xs text-[#5C6E5C]">{marca.descricao}</p>
                      <p className="text-xs text-[#3D6B4A] mt-3 font-medium group-hover:underline">Ver produtos →</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {!loading && marcasFiltradas.length === 0 && (
              <div className="text-center py-20">
                <p style={serif} className="text-3xl text-[#C8DFC4] mb-2">Nenhuma marca encontrada</p>
                <p className="text-sm text-[#8FAF8A]">Tenta pesquisar por outro nome</p>
              </div>
            )}
          </div>
        </>
      ) : (
        /* Vista de Produtos da Marca (Específica) */
        <>
          {/* Banner da Marca */}
          <div className={`${marcaSelecionada?.bg} py-12 px-8 mb-8`}>
            <div className="max-w-7xl mx-auto flex items-center gap-8">
              <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center text-5xl shadow-sm border border-[#E8F0E6]">
                {marcaSelecionada?.emoji}
              </div>
              <div>
                <p className="text-xs tracking-[0.15em] uppercase text-[#6B9E63] mb-1">Marca</p>
                <h1 style={serif} className="text-4xl font-semibold text-[#1A2E1A] mb-1">{marcaSelecionada?.nome}</h1>
                <p className="text-sm text-[#5C6E5C]">{marcaSelecionada?.descricao} · {produtosDaMarca.length} produtos</p>
              </div>
              <button
                onClick={() => setMarcaAtiva(null)}
                className="ml-auto text-xs tracking-widest uppercase px-5 py-2.5 rounded-full border border-[#C8DFC4] text-[#3D6B4A] bg-white hover:bg-[#3D6B4A] hover:text-white transition-all"
              >
                ← Todas as Marcas
              </button>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-8 pb-16">
            {produtosDaMarca.length > 0 ? (
              <>
                <p className="text-xs text-[#8FAF8A] mb-6">
                  {marcaSelecionada?.nome} / <span className="text-[#3D6B4A]">{produtosDaMarca.length} produtos</span>
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* MAPEAR OS PRODUTOS REAIS */}
                  {produtosDaMarca.map((prod) => (
                    <Link
                      to={`/produto/${prod.id_produto}`}
                      key={prod.id_produto}
                      className="block"
                      onClick={() => window.scrollTo(0, 0)}
                    >
                      <div className="bg-white rounded-2xl overflow-hidden border border-[#E8F0E6] hover:shadow-lg hover:shadow-green-100 transition-all group cursor-pointer">
                        <div className="bg-[#F0F5EE] h-64 flex items-center justify-center overflow-hidden">
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
              </>
            ) : (
              <div className="text-center py-20">
                <p style={serif} className="text-3xl text-[#C8DFC4] mb-2">Brevemente disponível</p>
                <p className="text-sm text-[#8FAF8A] mb-6">Os produtos desta marca serão adicionados em breve.</p>
                <button onClick={() => setMarcaAtiva(null)} className="bg-[#3D6B4A] text-white px-8 py-3 rounded-full text-xs tracking-widest uppercase hover:bg-[#2C5038] transition-all">
                  Ver outras marcas
                </button>
              </div>
            )}
          </div>
        </>
      )}

      <Footer />
    </div>
  );
}