import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const todosProdutos = [
  { id: 1, nome: "Blazer Alfaiataria", preco: "39,90", categoria: "Blazers e coletes", emoji: "🧥", bg: "bg-[#F0F5EE]"},
  { id: 2, nome: "Vestido Linho Verde", preco: "59,90", categoria: "Vestidos", emoji: "👗", bg: "bg-[#F0F5EE]"},
  { id: 3, nome: "Casaco Linho Bege", preco: "94,90", categoria: "Casacos", emoji: "🧥", bg: "bg-[#EEF5EC]"},
  { id: 4, nome: "Saia Midi Floral", preco: "44,90", categoria: "Saias", emoji: "👗", bg: "bg-[#F5F0EE]"},
  { id: 5, nome: "T-shirt Algodão", preco: "19,90", categoria: "T-shirt e Tops", emoji: "👕", bg: "bg-[#F0F5EE]"},
  { id: 6, nome: "Calças Linho Branco", preco: "54,90", categoria: "Calças e Calções", emoji: "👖", bg: "bg-[#F5F0EE]"},
  { id: 7, nome: "Blusa Seda Rosa", preco: "49,90", categoria: "Blusas", emoji: "👚", bg: "bg-[#F5F0EE]"},
  { id: 8, nome: "Sweatshirt Oversized", preco: "39,90", categoria: "Sweatshirts e Hoodies", emoji: "👕", bg: "bg-[#EEF5EC]"},
];

const categorias = ["Explora tudo", "Vestidos", "Calças e Calções", "T-shirt e Tops", "Casacos", "Malhas", "Roupa Interior", "Blusas", "Sobretudos", "Saias", "Roupa de banho", "Sweatshirts e Hoodies", "Blazers e coletes", "Macacões"];

const tamanhos = {
  eu: ["32", "34", "36", "38", "40", "42", "44"],
  internacionais: ["XS", "S", "M", "L", "XL", "XXL"],
};

const cores = ["Preto", "Branco", "Cinzento", "Azul", "Verde", "Vermelho", "Roxo", "Laranja", "Amarelo", "Bege", "Rosa", "Castanho"];

const tagStyles = {
  Novo: "bg-[#E8F0E6] text-[#3D6B4A]",
  Bestseller: "bg-[#FEF9E7] text-[#A67C00]",
  Sale: "bg-[#FDECEA] text-[#C0392B]",
};

export default function CatalogPage() {
  const [categoriaAtiva, setCategoriaAtiva] = useState("Explora tudo");
  const [tamanhosSelecionados, setTamanhosSelecionados] = useState([]);
  const [coresSelecionadas, setCoresSelecionadas] = useState([]);
  const [precoMax, setPrecoMax] = useState(500);
  const [precoMin, setPrecoMin] = useState(0);
  const [apenasPromocao, setApenasPromocao] = useState(false);
  const [marcaPesquisa, setMarcaPesquisa] = useState("");
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Jost:wght@300;400;500&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  const serif = { fontFamily: "'Cormorant Garamond', Georgia, serif" };
  const sans = { fontFamily: "'Jost', sans-serif" };

  const toggleTamanho = (t) =>
    setTamanhosSelecionados((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);

  const toggleCor = (c) =>
    setCoresSelecionadas((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]);

  const toggleWishlist = (id) =>
    setWishlist((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);

  const produtosFiltrados = todosProdutos.filter((p) => {
    if (categoriaAtiva !== "Explora tudo" && p.categoria !== categoriaAtiva) return false;
    if (apenasPromocao && !p.precoAnt) return false;
    const preco = parseFloat(p.preco.replace(",", "."));
    if (preco < precoMin || preco > precoMax) return false;
    return true;
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
          <span className="text-[#3D6B4A]">Explora tudo</span>
        </div>
      </div>


      <div className="max-w-7xl mx-auto px-8 pb-16 flex gap-8">

        {/* Sidebar Filtros */}
        <div className="w-48 flex-shrink-0">

          {/* Promoção */}
          <div className="mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={apenasPromocao}
                onChange={(e) => setApenasPromocao(e.target.checked)}
                className="w-3 h-3 accent-[#3D6B4A]"
              />
              <span className="text-sm font-medium text-[#2C3A2C]">Promoção</span>
            </label>
          </div>

          {/* Tamanho */}
          <div className="mb-6">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#2C3A2C] mb-3">Tamanho EU</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {tamanhos.eu.map((t) => (
                <button
                  key={t}
                  onClick={() => toggleTamanho(t)}
                  className={`w-9 h-9 rounded-lg border text-xs font-medium transition-all ${
                    tamanhosSelecionados.includes(t)
                      ? "border-[#3D6B4A] bg-[#3D6B4A] text-white"
                      : "border-[#C8DFC4] bg-white text-[#4A5C4A] hover:border-[#3D6B4A]"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <p className="text-xs font-semibold tracking-widest uppercase text-[#2C3A2C] mb-3">Tamanho Internacional</p>
            <div className="flex flex-wrap gap-2">
              {tamanhos.internacionais.map((t) => (
                <button
                  key={t}
                  onClick={() => toggleTamanho(t)}
                  className={`px-2 h-9 rounded-lg border text-xs font-medium transition-all ${
                    tamanhosSelecionados.includes(t)
                      ? "border-[#3D6B4A] bg-[#3D6B4A] text-white"
                      : "border-[#C8DFC4] bg-white text-[#4A5C4A] hover:border-[#3D6B4A]"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Cor */}
          <div className="mb-6">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#2C3A2C] mb-3">Cor</p>
            <div className="flex flex-col gap-1.5">
              {cores.map((c) => (
                <label key={c} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={coresSelecionadas.includes(c)}
                    onChange={() => toggleCor(c)}
                    className="w-3 h-3 accent-[#3D6B4A]"
                  />
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
                <input
                    type="text"
                    placeholder="Pesquisar por marca"
                    value={marcaPesquisa}
                    onChange={(e) => setMarcaPesquisa(e.target.value)}
                    className="text-xs outline-none bg-transparent text-[#4A5C4A] placeholder:text-[#C8DFC4] w-full"
                />
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
                            max={precoMax}
                            value={precoMin}
                            onChange={(e) => setPrecoMin(Number(e.target.value))}
                            onBlur={(e) => {
                                const val = Number(e.target.value);
                                if (val < 0) setPrecoMin(0);
                                if (val >= precoMax) setPrecoMin(precoMax - 1);
                            }}
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
                            min={precoMin}
                            max="500"
                            value={precoMax}
                            onChange={(e) => setPrecoMax(Number(e.target.value))}
                            onBlur={(e) => {
                                const val = Number(e.target.value);
                                if (val > 500) setPrecoMax(500);
                                if (val <= precoMin) setPrecoMax(precoMin + 1);
                            }}
                            className="w-full text-xs text-[#2C3A2C] outline-none bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
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
            {categorias.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoriaAtiva(cat)}
                className={`px-4 py-1.5 rounded-full text-xs tracking-wide transition-all border ${
                  categoriaAtiva === cat
                    ? "bg-[#3D6B4A] text-white border-[#3D6B4A]"
                    : "bg-white text-[#4A5C4A] border-[#C8DFC4] hover:border-[#3D6B4A] hover:text-[#3D6B4A]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Info resultados */}
          <p className="text-xs text-[#8FAF8A] mb-4">
            Roupa / {categoriaAtiva} / <span className="text-[#3D6B4A]">{produtosFiltrados.length} resultados</span>
          </p>

          {/* Grid Produtos */}
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
                    {prod.tag && (
                      <span className={`absolute top-2.5 left-2.5 text-[9px] tracking-widest uppercase px-2.5 py-1 rounded-full font-medium ${tagStyles[prod.tag]}`}>
                        {prod.tag}
                      </span>
                    )}
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

          {produtosFiltrados.length === 0 && (
            <div className="text-center py-20">
              <p style={serif} className="text-3xl text-[#C8DFC4] mb-2">Nenhum produto encontrado</p>
              <p className="text-sm text-[#8FAF8A]">Tenta ajustar os filtros</p>
            </div>
          )}

        </div>
      </div>

      <Footer />
    </div>
  );
}