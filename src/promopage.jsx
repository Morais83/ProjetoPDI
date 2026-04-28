import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const serif = { fontFamily: "'Cormorant Garamond', Georgia, serif" };
const sans = { fontFamily: "'Jost', sans-serif" };

const todosPromos = [
  { id: 1, nome: "Vestido Midi Zara", marca: "Zara", preco: "49,90", precoAnt: "69,90", categoria: "Vestidos", emoji: "👗", bg: "bg-[#F0F5EE]", desconto: 29 },
  { id: 2, nome: "Saia Plissada Mango", marca: "Mango", preco: "44,90", precoAnt: "59,90", categoria: "Saias", emoji: "👗", bg: "bg-[#F5F0EE]", desconto: 25 },
  { id: 3, nome: "Jeans Skinny H&M", marca: "H&M", preco: "19,90", precoAnt: "29,90", categoria: "Calças e Calções", emoji: "👖", bg: "bg-[#EEF5EC]", desconto: 33 },
  { id: 4, nome: "Mules Bege Nude", marca: "Moda Chique", preco: "49,90", precoAnt: "69,90", categoria: "Calçado", emoji: "👠", bg: "bg-[#F5F0EE]", desconto: 29 },
  { id: 5, nome: "Mala Tote Creme", marca: "Moda Chique", preco: "39,90", precoAnt: "54,90", categoria: "Malas", emoji: "👜", bg: "bg-[#F0F5EE]", desconto: 27 },
  { id: 6, nome: "Casaco Oversize", marca: "Mango", preco: "79,90", precoAnt: "119,90", categoria: "Casacos", emoji: "🧥", bg: "bg-[#F5F0EE]", desconto: 33 },
  { id: 7, nome: "Blusa Satin Zara", marca: "Zara", preco: "19,90", precoAnt: "29,90", categoria: "Blusas", emoji: "👚", bg: "bg-[#F0F5EE]", desconto: 33 },
  { id: 8, nome: "Sweatshirt Logo H&M", marca: "H&M", preco: "17,90", precoAnt: "24,90", categoria: "Sweatshirts e Hoodies", emoji: "👕", bg: "bg-[#EEF5EC]", desconto: 28 },
  { id: 9, nome: "Sandálias Douradas", marca: "Moda Chique", preco: "34,90", precoAnt: "49,90", categoria: "Calçado", emoji: "👡", bg: "bg-[#F0F5EE]", desconto: 30 },
  { id: 10, nome: "Vestido Floral H&M", marca: "H&M", preco: "24,90", precoAnt: "39,90", categoria: "Vestidos", emoji: "👗", bg: "bg-[#EEF5EC]", desconto: 38 },
  { id: 11, nome: "Blazer Estruturado Zara", marca: "Zara", preco: "59,90", precoAnt: "79,90", categoria: "Blazers e coletes", emoji: "🧥", bg: "bg-[#F5F0EE]", desconto: 25 },
  { id: 12, nome: "Camisa Linho Massimo", marca: "Massimo Dutti", preco: "49,90", precoAnt: "69,90", categoria: "Blusas", emoji: "👚", bg: "bg-[#F0F5EE]", desconto: 29 },
];

const categorias = ["Todas", "Vestidos", "Saias", "Calças e Calções", "Calçado", "Malas", "Casacos", "Blusas", "Sweatshirts e Hoodies", "Blazers e coletes"];
const marcas = ["Todas", "Zara", "Mango", "H&M", "Massimo Dutti", "Moda Chique"];
const ordenacoes = [
  { id: "desconto", label: "Maior desconto" },
  { id: "preco_asc", label: "Preço: menor para maior" },
  { id: "preco_desc", label: "Preço: maior para menor" },
];

export default function PromoPage() {
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todas");
  const [marcaAtiva, setMarcaAtiva] = useState("Todas");
  const [ordenacao, setOrdenacao] = useState("desconto");
  const [precoMin, setPrecoMin] = useState(0);
  const [precoMax, setPrecoMax] = useState(500);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Jost:wght@300;400;500&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  const toggleWishlist = (id) =>
    setWishlist((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);

  const produtosFiltrados = todosPromos
    .filter((p) => {
      if (categoriaAtiva !== "Todas" && p.categoria !== categoriaAtiva) return false;
      if (marcaAtiva !== "Todas" && p.marca !== marcaAtiva) return false;
      const preco = parseFloat(p.preco.replace(",", "."));
      if (preco < precoMin || preco > precoMax) return false;
      return true;
    })
    .sort((a, b) => {
      if (ordenacao === "desconto") return b.desconto - a.desconto;
      if (ordenacao === "preco_asc") return parseFloat(a.preco.replace(",", ".")) - parseFloat(b.preco.replace(",", "."));
      if (ordenacao === "preco_desc") return parseFloat(b.preco.replace(",", ".")) - parseFloat(a.preco.replace(",", "."));
      return 0;
    });

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
          <span className="text-[#3D6B4A]">Promoções</span>
        </div>
      </div>

      {/* Banner */}
      <div className="bg-[#2C3A2C] py-12 px-8 mb-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {"🏷️".repeat(20).split("").map((_, i) => (
            <span key={i} className="absolute text-4xl" style={{ left: `${(i * 7) % 100}%`, top: `${(i * 13) % 100}%` }}>%</span>
          ))}
        </div>
        <div className="relative z-10">
          <p className="text-xs tracking-[0.2em] uppercase text-[#6B9E63] mb-2">Ofertas especiais</p>
          <h1 style={serif} className="text-5xl font-semibold text-white mb-3">Promoções</h1>
          <p className="text-sm text-[#A8C4A8] max-w-md mx-auto">Descobre as melhores ofertas e poupa até 40% nas tuas peças favoritas.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 pb-16 flex gap-8 items-start">

        {/* Sidebar Filtros */}
        <div className="w-48 flex-shrink-0">

          {/* Ordenação */}
          <div className="mb-6">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#2C3A2C] mb-3">Ordenar por</p>
            <div className="flex flex-col gap-1.5">
              {ordenacoes.map((op) => (
                <button
                  key={op.id}
                  onClick={() => setOrdenacao(op.id)}
                  className={`text-left text-xs py-1.5 px-3 rounded-lg transition-all ${
                    ordenacao === op.id
                      ? "bg-[#3D6B4A] text-white"
                      : "text-[#4A5C4A] hover:bg-[#F0F5EE] hover:text-[#3D6B4A]"
                  }`}
                >
                  {op.label}
                </button>
              ))}
            </div>
          </div>

          {/* Categorias */}
          <div className="mb-6">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#2C3A2C] mb-3">Categoria</p>
            <div className="flex flex-col gap-1">
              {categorias.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoriaAtiva(cat)}
                  className={`text-left text-xs py-1.5 px-3 rounded-lg transition-all flex items-center justify-between ${
                    categoriaAtiva === cat
                      ? "bg-[#3D6B4A] text-white"
                      : "text-[#4A5C4A] hover:bg-[#F0F5EE] hover:text-[#3D6B4A]"
                  }`}
                >
                  <span>{cat}</span>
                  {cat !== "Todas" && (
                    <span className={`text-[10px] ${categoriaAtiva === cat ? "text-white opacity-70" : "text-[#8FAF8A]"}`}>
                      {todosPromos.filter(p => p.categoria === cat).length}
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
              {marcas.map((m) => (
                <button
                  key={m}
                  onClick={() => setMarcaAtiva(m)}
                  className={`text-left text-xs py-1.5 px-3 rounded-lg transition-all ${
                    marcaAtiva === m
                      ? "bg-[#3D6B4A] text-white"
                      : "text-[#4A5C4A] hover:bg-[#F0F5EE] hover:text-[#3D6B4A]"
                  }`}
                >
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
                  <input
                    type="number"
                    min="0"
                    value={precoMin}
                    onChange={(e) => setPrecoMin(Number(e.target.value))}
                    onBlur={(e) => { if (Number(e.target.value) >= precoMax) setPrecoMin(precoMax - 1); }}
                    className="w-full text-xs text-[#2C3A2C] outline-none bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="text-xs text-[#8FAF8A]">€</span>
                </div>
              </div>
              <span className="text-xs text-[#C8DFC4]">—</span>
              <div className="flex-1 border border-[#C8DFC4] rounded-lg px-2 py-1.5 bg-white">
                <p className="text-[10px] text-[#8FAF8A] mb-0.5">Máx</p>
                <div className="flex items-center">
                  <input
                    type="number"
                    max="500"
                    value={precoMax}
                    onChange={(e) => setPrecoMax(Number(e.target.value))}
                    onBlur={(e) => { if (Number(e.target.value) <= precoMin) setPrecoMax(precoMin + 1); }}
                    className="w-full text-xs text-[#2C3A2C] outline-none bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="text-xs text-[#8FAF8A]">€</span>
                </div>
              </div>
            </div>
          </div>

          {/* Limpar filtros */}
          {(categoriaAtiva !== "Todas" || marcaAtiva !== "Todas" || precoMin > 0 || precoMax < 500) && (
            <button
              onClick={() => { setCategoriaAtiva("Todas"); setMarcaAtiva("Todas"); setPrecoMin(0); setPrecoMax(500); }}
              className="w-full text-xs text-[#C0392B] border border-[#FDECEA] bg-[#FDECEA] py-2 rounded-lg hover:bg-[#C0392B] hover:text-white transition-all"
            >
              Limpar filtros
            </button>
          )}
        </div>

        {/* Conteúdo */}
        <div className="flex-1">

          {/* Info resultados */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs text-[#8FAF8A]">
              Promoções / <span className="text-[#3D6B4A]">{produtosFiltrados.length} resultados</span>
            </p>
          </div>

          {/* Grid Produtos */}
          {produtosFiltrados.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {produtosFiltrados.map((prod) => (
                <Link
                  to={`/produto/${prod.id}`}
                  key={prod.id}
                  className="block"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  <div className="bg-white rounded-2xl overflow-hidden border border-[#E8F0E6] hover:shadow-lg hover:shadow-green-100 transition-all group cursor-pointer">
                    <div className={`${prod.bg} h-52 flex items-center justify-center text-6xl relative`}>

                      {/* Badge desconto */}
                      <span className="absolute top-2.5 left-2.5 text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-full font-medium bg-[#FDECEA] text-[#C0392B]">
                        -{prod.desconto}%
                      </span>

                      <span className="group-hover:scale-110 transition-transform">{prod.emoji}</span>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-xs text-[#8FAF8A]">{prod.categoria}</div>
                        <div className="text-[10px] text-[#6B9E63]">{prod.marca}</div>
                      </div>
                      <div className="text-sm font-medium text-[#2C3A2C] mb-1.5">{prod.nome}</div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-semibold text-[#C0392B]">{prod.preco}€</span>
                        <span className="text-xs text-gray-400 line-through">{prod.precoAnt}€</span>
                        <span className="text-[10px] bg-[#FDECEA] text-[#C0392B] px-1.5 py-0.5 rounded-full ml-auto">-{prod.desconto}%</span>
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