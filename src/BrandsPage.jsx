import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const serif = { fontFamily: "'Cormorant Garamond', Georgia, serif" };
const sans = { fontFamily: "'Jost', sans-serif" };

const marcas = [
  { id: "zara", nome: "Zara", emoji: "👗", totalProdutos: 24, descricao: "Moda contemporânea para o dia a dia", bg: "bg-[#F0F5EE]" },
  { id: "mango", nome: "Mango", emoji: "🧥", totalProdutos: 18, descricao: "Elegância mediterrânea e sofisticação", bg: "bg-[#F5F0EE]" },
  { id: "hm", nome: "H&M", emoji: "👚", totalProdutos: 32, descricao: "Moda acessível e sustentável", bg: "bg-[#EEF5EC]" },
  { id: "massimo", nome: "Massimo Dutti", emoji: "🧣", totalProdutos: 15, descricao: "Elegância clássica e atemporal", bg: "bg-[#F0F5EE]" },
  { id: "stradivarius", nome: "Stradivarius", emoji: "👜", totalProdutos: 20, descricao: "Tendências jovens e urbanas", bg: "bg-[#F5F0EE]" },
  { id: "bershka", nome: "Bershka", emoji: "👕", totalProdutos: 28, descricao: "Estilo urbano e descontraído", bg: "bg-[#EEF5EC]" },
  { id: "pullandbear", nome: "Pull&Bear", emoji: "🧤", totalProdutos: 22, descricao: "Moda casual e confortável", bg: "bg-[#F0F5EE]" },
  { id: "levis", nome: "Levi's", emoji: "👖", totalProdutos: 14, descricao: "O clássico do denim americano", bg: "bg-[#F5F0EE]" },
  { id: "nike", nome: "Nike", emoji: "👟", totalProdutos: 19, descricao: "Desempenho e estilo desportivo", bg: "bg-[#EEF5EC]" },
  { id: "guess", nome: "Guess", emoji: "💍", totalProdutos: 11, descricao: "Glamour e sensualidade americana", bg: "bg-[#F0F5EE]" },
  { id: "tommy", nome: "Tommy Hilfiger", emoji: "⚓", totalProdutos: 16, descricao: "Preppy americano com toque europeu", bg: "bg-[#F5F0EE]" },
  { id: "modachique", nome: "Moda Chique", emoji: "🌿", totalProdutos: 45, descricao: "A nossa marca exclusiva", bg: "bg-[#E8F0E6]" },
];

const produtosPorMarca = {
  zara: [
    { id: 101, nome: "Vestido Midi Zara", preco: "49,90", categoria: "Vestidos", emoji: "👗", bg: "bg-[#F0F5EE]"},
    { id: 102, nome: "Blazer Estruturado", preco: "79,90", categoria: "Blazers", emoji: "🧥", bg: "bg-[#F5F0EE]"},
    { id: 103, nome: "Calças Wide Leg", preco: "39,90", categoria: "Calças", emoji: "👖", bg: "bg-[#F0F5EE]"},
    { id: 104, nome: "Blusa Satin", preco: "29,90", categoria: "Blusas", emoji: "👚", bg: "bg-[#F5F0EE]"},
  ],
  mango: [
    { id: 201, nome: "Casaco Oversize", preco: "89,90", categoria: "Casacos", emoji: "🧥", bg: "bg-[#F5F0EE]"},
    { id: 202, nome: "Saia Plissada", preco: "44,90", precoAnt: "59,90", categoria: "Saias", emoji: "👗", bg: "bg-[#F0F5EE]"},
    { id: 203, nome: "Top Cropped", preco: "24,90", categoria: "Tops", emoji: "👚", bg: "bg-[#F5F0EE]"},
  ],
  hm: [
    { id: 301, nome: "T-shirt Básica", preco: "9,90", categoria: "T-shirts", emoji: "👕", bg: "bg-[#EEF5EC]"},
    { id: 302, nome: "Vestido Floral", preco: "29,90", categoria: "Vestidos", emoji: "👗", bg: "bg-[#F0F5EE]"},
    { id: 303, nome: "Jeans Skinny", preco: "19,90", categoria: "Calças", emoji: "👖", bg: "bg-[#EEF5EC]"},
    { id: 304, nome: "Sweatshirt Logo", preco: "24,90", categoria: "Sweatshirts", emoji: "👕", bg: "bg-[#F0F5EE]"},
  ],
  massimo: [
    { id: 401, nome: "Trench Coat Clássico", preco: "199,90", categoria: "Casacos", emoji: "🧥", bg: "bg-[#F0F5EE]"},
    { id: 402, nome: "Camisa Linho", preco: "69,90", categoria: "Camisas", emoji: "👚", bg: "bg-[#F5F0EE]"},
  ],
  modachique: [
    { id: 1, nome: "Blazer Alfaiataria", preco: "39,90", categoria: "Blazers", emoji: "🧥", bg: "bg-[#F0F5EE]"},
    { id: 2, nome: "Vestido Linho Verde", preco: "59,90", categoria: "Vestidos", emoji: "👗", bg: "bg-[#F0F5EE]"},
    { id: 3, nome: "Casaco Linho Bege", preco: "94,90", categoria: "Casacos", emoji: "🧥", bg: "bg-[#EEF5EC]"},
    { id: 4, nome: "Saia Midi Floral", preco: "44,90", categoria: "Saias", emoji: "👗", bg: "bg-[#F5F0EE]"},
    { id: 5, nome: "T-shirt Algodão", preco: "19,90", categoria: "T-shirts", emoji: "👕", bg: "bg-[#F0F5EE]"},
    { id: 6, nome: "Blusa Seda Rosa", preco: "49,90", categoria: "Blusas", emoji: "👚", bg: "bg-[#F5F0EE]"},
  ],
};

const tagStyles = {
  Novo: "bg-[#E8F0E6] text-[#3D6B4A]",
  Bestseller: "bg-[#FEF9E7] text-[#A67C00]",
  Sale: "bg-[#FDECEA] text-[#C0392B]",
};

export default function BrandsPage() {
  const [marcaAtiva, setMarcaAtiva] = useState(null);
  const [pesquisa, setPesquisa] = useState("");
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Jost:wght@300;400;500&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  const toggleWishlist = (id) =>
    setWishlist((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);

  const marcasFiltradas = marcas.filter((m) =>
    m.nome.toLowerCase().includes(pesquisa.toLowerCase())
  );

  const marcaSelecionada = marcas.find((m) => m.id === marcaAtiva);
  const produtos = marcaAtiva ? (produtosPorMarca[marcaAtiva] || []) : [];

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

      {/* Vista de Marcas */}
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {marcasFiltradas.map((marca) => (
                <button
                  key={marca.id}
                  onClick={() => { setMarcaAtiva(marca.id); window.scrollTo(0, 0); }}
                  className="bg-white rounded-2xl border border-[#E8F0E6] overflow-hidden hover:shadow-lg hover:shadow-green-100 hover:-translate-y-1 transition-all group text-left"
                >
                  <div className={`${marca.bg} h-40 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform`}>
                    {marca.emoji}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-1">
                      <h3 style={serif} className="text-xl font-semibold text-[#1A2E1A]">{marca.nome}</h3>
                      <span className="text-xs text-[#8FAF8A]">{marca.totalProdutos} produtos</span>
                    </div>
                    <p className="text-xs text-[#5C6E5C]">{marca.descricao}</p>
                    <p className="text-xs text-[#3D6B4A] mt-3 font-medium group-hover:underline">Ver produtos →</p>
                  </div>
                </button>
              ))}
            </div>

            {marcasFiltradas.length === 0 && (
              <div className="text-center py-20">
                <p style={serif} className="text-3xl text-[#C8DFC4] mb-2">Nenhuma marca encontrada</p>
                <p className="text-sm text-[#8FAF8A]">Tenta pesquisar por outro nome</p>
              </div>
            )}
          </div>
        </>
      ) : (
        /* Vista de Produtos da Marca */
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
                <p className="text-sm text-[#5C6E5C]">{marcaSelecionada?.descricao} · {marcaSelecionada?.totalProdutos} produtos</p>
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
            {produtos.length > 0 ? (
              <>
                <p className="text-xs text-[#8FAF8A] mb-6">
                  {marcaSelecionada?.nome} / <span className="text-[#3D6B4A]">{produtos.length} produtos</span>
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {produtos.map((prod) => (
                    <Link
                      to={`/produto/${prod.id}`}
                      key={prod.id}
                      className="block"
                      onClick={() => window.scrollTo(0, 0)}
                    >
                      <div className="bg-white rounded-2xl overflow-hidden border border-[#E8F0E6] hover:shadow-lg hover:shadow-green-100 transition-all group cursor-pointer">
                        <div className={`${prod.bg} h-52 flex items-center justify-center text-6xl relative`}>
                          <span className={`absolute top-2.5 left-2.5 text-[9px] tracking-widest uppercase px-2.5 py-1 rounded-full font-medium ${tagStyles[prod.tag]}`}>
                            {prod.tag}
                          </span>
                          <span className="group-hover:scale-110 transition-transform">{prod.emoji}</span>
                        </div>
                        <div className="p-4">
                          <div className="text-xs text-[#8FAF8A] mb-1">{prod.categoria}</div>
                          <div className="text-sm font-medium text-[#2C3A2C] mb-1.5">{prod.nome}</div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-base font-semibold text-[#3D6B4A]">{prod.preco}€</span>
                            {prod.precoAnt && <span className="text-xs text-gray-400 line-through">{prod.precoAnt}€</span>}
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