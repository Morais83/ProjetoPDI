import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "./footer";
import Navbar from "./navbar";
import { Search } from "lucide-react";

const serif = { fontFamily: "'Cormorant Garamond', Georgia, serif" };
const sans = { fontFamily: "'Jost', sans-serif" };

export default function BrandsPage() {
  const [marcaAtiva, setMarcaAtiva] = useState(null);
  const [pesquisa, setPesquisa] = useState("");
  const [marcas, setMarcas] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const carregarDados = async () => {
      try {
        const [resMarcas, resProdutos] = await Promise.all([
          fetch('http://localhost:5000/api/marcas'),
          fetch('http://localhost:5000/api/produtos'),
        ]);
        const dadosMarcas = await resMarcas.json();
        const dadosProdutos = await resProdutos.json();
        setMarcas(dadosMarcas);
        setProdutos(dadosProdutos);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    carregarDados();
  }, []);

  const marcasFiltradas = marcas.filter(m =>
    m.nome_marca.toLowerCase().includes(pesquisa.toLowerCase())
  );

  const marcaSelecionada = marcas.find(m => m.id_marca === marcaAtiva);
  const produtosDaMarca = marcaSelecionada
    ? produtos.filter(p => p.nome_marca === marcaSelecionada.nome_marca)
    : [];

  const contarProdutos = (nomeMarca) =>
    produtos.filter(p => p.nome_marca === nomeMarca).length;

  return (
    <div style={sans} className="min-h-screen bg-[#F7F9F5] text-[#2C2C2C]">

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
              <span className="text-[#3D6B4A]">{marcaSelecionada?.nome_marca}</span>
            </>
          ) : (
            <span className="text-[#3D6B4A]">Marcas</span>
          )}
        </div>
      </div>

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
              <Search size={18} strokeWidth={1.5} />
              <input
                type="text"
                placeholder="Pesquisar marca..."
                value={pesquisa}
                onChange={e => setPesquisa(e.target.value)}
                className="text-sm outline-none bg-transparent text-[#4A5C4A] placeholder:text-[#C8DFC4] w-full"
              />
            </div>

            {loading ? (
              <p className="text-sm text-[#8FAF8A]">A carregar marcas...</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {marcasFiltradas.map(marca => (
                  <button
                    key={marca.id_marca}
                    onClick={() => { setMarcaAtiva(marca.id_marca); window.scrollTo(0, 0); }}
                    className="bg-white rounded-2xl border border-[#E8F0E6] overflow-hidden hover:shadow-lg hover:shadow-green-100 hover:-translate-y-1 transition-all group text-left flex flex-col"
                  >
                    <div className="bg-[#F0F5EE] h-40 w-full flex items-center justify-center p-4 overflow-hidden">
                      {marca.imagem_url
                        ? <img loading="lazy" src={marca.imagem_url} alt={marca.nome_marca} className="h-full w-full object-contain group-hover:scale-105 transition-transform" />
                        : <span style={serif} className="text-4xl font-semibold text-[#3D6B4A]">{marca.nome_marca.charAt(0)}</span>
                      }
                    </div>
                    <div className="p-4 w-full">
                      <div className="flex items-center justify-between mb-1">
                        <h3 style={serif} className="text-xl font-semibold text-[#1A2E1A]">{marca.nome_marca}</h3>
                        <span className="text-xs text-[#8FAF8A]">{contarProdutos(marca.nome_marca)} produtos</span>
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
        <>
          {/* Banner da Marca */}
          <div className="bg-[#E8F0E6] py-12 px-8 mb-8">
            <div className="max-w-7xl mx-auto flex items-center gap-8">
              <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-[#E8F0E6] overflow-hidden p-2">
                {marcaSelecionada?.imagem_url
                  ? <img loading="lazy" src={marcaSelecionada.imagem_url} alt={marcaSelecionada.nome_marca} className="w-full h-full object-contain" />
                  : <span style={serif} className="text-3xl font-semibold text-[#3D6B4A]">{marcaSelecionada?.nome_marca.charAt(0)}</span>
                }
              </div>
              <div>
                <p className="text-xs tracking-[0.15em] uppercase text-[#6B9E63] mb-1">Marca</p>
                <h1 style={serif} className="text-4xl font-semibold text-[#1A2E1A] mb-1">{marcaSelecionada?.nome_marca}</h1>
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
                  {marcaSelecionada?.nome_marca} / <span className="text-[#3D6B4A]">{produtosDaMarca.length} produtos</span>
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {produtosDaMarca.map(prod => (
                    <Link to={`/produto/${prod.id_produto}`} key={prod.id_produto} className="block" onClick={() => window.scrollTo(0, 0)}>
                      <div className="bg-white rounded-2xl overflow-hidden border border-[#E8F0E6] hover:shadow-lg hover:shadow-green-100 transition-all group cursor-pointer">
                        <div className="bg-[#F0F5EE] h-64 flex items-center justify-center overflow-hidden">
                          {prod.imagem_principal
                            ? <img loading="lazy" src={prod.imagem_principal} alt={prod.nome_produto} className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
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