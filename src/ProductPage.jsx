import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";
import GuiaTamanhos from "./GuiaTamanhos";

const imagens = [
  { id: 1, emoji: "🧥" },
  { id: 2, emoji: "🧥" },
  { id: 3, emoji: "🧥" },
  { id: 4, emoji: "🧥" },
  { id: 5, emoji: "🧥" },
  { id: 6, emoji: "🧥" },
];

const tamanhos = ["34", "36", "38", "40", "42", "44", "46"];

const produtosRelacionados = [
  { id: 1, nome: "Blazer Creme", preco: "79,90", emoji: "🧥", bg: "bg-[#F5F0EE]"},
  { id: 2, nome: "Casaco Linho", preco: "94,90", emoji: "🧥", bg: "bg-[#EEF5EC]"}, 
  { id: 3, nome: "Blazer Xadrez", preco: "69,90", emoji: "🧥", bg: "bg-[#F0F5EE]"},
  { id: 4, nome: "Colete Alfaiataria", preco: "54,90", emoji: "🧥", bg: "bg-[#F5F0EE]"},
];

const tagStyles = {
  Novo: "bg-[#E8F0E6] text-[#3D6B4A]",
  Bestseller: "bg-[#FEF9E7] text-[#A67C00]",
  Sale: "bg-[#FDECEA] text-[#C0392B]",
};

const accordionItems = [
  {
    title: "Descrição",
    content: "Blazer de alfaiataria em tecido premium. Corte estruturado e elegante, ideal para look casual chic ou mais formal. Forro interior suave e confortável.",
  },
  {
    title: "Materiais",
    content: "65% Poliéster, 30% Viscose, 5% Elastano. Tecido de alta qualidade com ligeira elasticidade para maior conforto.",
  },
  {
    title: "Guia de Cuidados",
    content: "Lavagem à mão ou máquina a 30°C. Não usar secador. Engomar a temperatura média pelo avesso. Não usar lixívia.",
  },
  {
    title: "Informações do Fabricante",
    content: "Produzido em Portugal. Moda Chique — Lili Store. Comprometidos com a produção responsável e sustentável.",
  },
];

export default function ProductPage() {
  const [imagemAtiva, setImagemAtiva] = useState(0);
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState(null);
  const [quantidade, setQuantidade] = useState(1);
  const [wishlist, setWishlist] = useState(false);
  const [accordionAberto, setAccordionAberto] = useState(null);
  const [adicionado, setAdicionado] = useState(false);
  const [guiaAberto, setGuiaAberto] = useState(false); // ✅ Movido para dentro do componente

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Jost:wght@300;400;500&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  const serif = { fontFamily: "'Cormorant Garamond', Georgia, serif" };
  const sans = { fontFamily: "'Jost', sans-serif" };

  const handleAdicionar = () => {
    if (!tamanhoSelecionado) return;
    setAdicionado(true);
    setTimeout(() => setAdicionado(false), 2000);
  };

  return (
    <div style={sans} className="min-h-screen bg-[#F7F9F5] text-[#2C2C2C]">

      {/* Announce bar */}
      <div className="bg-[#3D6B4A] text-white text-center py-2 text-xs tracking-widest">
        ✦ Envio gratuito em compras acima de 50€ &nbsp;|&nbsp; Nova coleção Primavera-Verão disponível ✦
      </div>

      <Navbar />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-8 py-4">
        <div className="flex items-center gap-2 text-xs text-[#8FAF8A]">
          <Link to="/" className="hover:text-[#3D6B4A] transition-colors">Início</Link>
          <span>/</span>
          <a href="#" className="hover:text-[#3D6B4A] transition-colors">Roupa</a>
          <span>/</span>
          <a href="#" className="hover:text-[#3D6B4A] transition-colors">Blazers e Coletes</a>
          <span>/</span>
          <span className="text-[#3D6B4A]">Blazer Alfaiataria</span>
        </div>
      </div>

      {/* Produto Principal */}
      <div className="max-w-7xl mx-auto px-8 pb-16">
        <div className="grid md:grid-cols-2 gap-12 items-start">

          {/* Galeria de Imagens */}
          <div className="flex gap-4">
            <div className="flex flex-col gap-3">
              {imagens.map((img, i) => (
                <div
                  key={img.id}
                  onClick={() => setImagemAtiva(i)}
                  className={`w-16 h-20 rounded-xl flex items-center justify-center cursor-pointer border-2 transition-all text-2xl bg-white ${
                    imagemAtiva === i ? "border-[#3D6B4A]" : "border-[#E8F0E6] hover:border-[#C8DFC4]"
                  }`}
                >
                  {img.emoji}
                </div>
              ))}
            </div>

            <div className="flex-1 relative">
              <div className="w-full aspect-[3/4] bg-white rounded-2xl flex items-center justify-center border border-[#E8F0E6] overflow-hidden">
                <span className="text-[10rem]">🧥</span>
              </div>
            </div>
          </div>

          {/* Informações do Produto */}
          <div className="pt-2">
            <div className="mb-6">
              <p className="text-xs tracking-[0.15em] uppercase text-[#6B9E63] mb-1">Blazer by Moda Chique</p>
              <h1 style={serif} className="text-4xl font-semibold text-[#1A2E1A] mb-3">Blazer Alfaiataria</h1>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-semibold text-[#3D6B4A]" style={serif}>39,99€</span>
              </div>
            </div>

            {/* Cor */}
            <div className="mb-6">
              <p className="text-xs tracking-widest uppercase text-[#6B9E63] mb-3 font-medium">
                Cor: <span className="text-[#2C2C2C] normal-case tracking-normal font-normal">Preto</span>
              </p>
              <div className="flex gap-2">
                {["bg-[#1A1A1A]", "bg-[#8B7355]", "bg-[#F5F0EE]", "bg-[#3D6B4A]"].map((cor, i) => (
                  <button
                    key={i}
                    className={`w-8 h-8 rounded-full border-2 ${cor} ${i === 0 ? "border-[#3D6B4A] scale-110" : "border-[#E8F0E6] hover:border-[#C8DFC4]"} transition-all`}
                  />
                ))}
              </div>
            </div>

            {/* Tamanho */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs tracking-widest uppercase text-[#6B9E63] font-medium">Tamanho</p>
                <button
                  onClick={() => setGuiaAberto(true)}
                  className="text-xs text-[#6B9E63] border-b border-[#6B9E63] pb-0.5 hover:text-[#3D6B4A] transition-colors"
                >
                  Guia de Tamanhos
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tamanhos.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTamanhoSelecionado(t)}
                    className={`w-12 h-10 rounded-lg border text-sm font-medium transition-all ${
                      tamanhoSelecionado === t
                        ? "border-[#3D6B4A] bg-[#3D6B4A] text-white"
                        : "border-[#C8DFC4] bg-white text-[#4A5C4A] hover:border-[#3D6B4A] hover:text-[#3D6B4A]"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              {!tamanhoSelecionado && (
                <p className="text-xs text-[#8FAF8A] mt-2">Seleciona um tamanho para continuar</p>
              )}
            </div>

            {/* Quantidade + Botões */}
            <div className="flex gap-3 mb-6">
              <div className="flex items-center border border-[#C8DFC4] rounded-full overflow-hidden bg-white">
                <button
                  onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
                  className="w-10 h-12 flex items-center justify-center text-[#3D6B4A] hover:bg-[#F0F5EE] transition-colors text-lg font-light"
                >
                  −
                </button>
                <span className="w-8 text-center text-sm font-medium text-[#2C2C2C]">{quantidade}</span>
                <button
                  onClick={() => setQuantidade(quantidade + 1)}
                  className="w-10 h-12 flex items-center justify-center text-[#3D6B4A] hover:bg-[#F0F5EE] transition-colors text-lg font-light"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAdicionar}
                className={`flex-1 py-3 rounded-full text-sm tracking-widest uppercase font-medium transition-all ${
                  adicionado
                    ? "bg-[#2C5038] text-white"
                    : tamanhoSelecionado
                    ? "bg-[#3D6B4A] text-white hover:bg-[#2C5038]"
                    : "bg-[#C8DFC4] text-[#8FAF8A] cursor-not-allowed"
                }`}
              >
                {adicionado ? "✓ Adicionado!" : "Adicionar ao Carrinho"}
              </button>

              <button
                onClick={() => setWishlist(!wishlist)}
                className="w-12 h-12 flex items-center justify-center border border-[#C8DFC4] rounded-full bg-white hover:border-[#3D6B4A] transition-colors text-lg"
              >
                {wishlist ? "❤️" : "🤍"}
              </button>
            </div>

            {/* Badges de Confiança */}
            <div className="grid grid-cols-3 gap-3 mb-8 py-4 border-t border-b border-[#E8F0E6]">
              {[
                { icon: "🚚", text: "Envio Grátis", sub: "Acima de 50€" },
                { icon: "↩️", text: "30 dias", sub: "Devolução fácil" },
                { icon: "🔒", text: "Pagamento", sub: "100% Seguro" },
              ].map((b, i) => (
                <div key={i} className="text-center">
                  <div className="text-xl mb-1">{b.icon}</div>
                  <div className="text-xs font-medium text-[#2C3A2C]">{b.text}</div>
                  <div className="text-[10px] text-[#8FAF8A]">{b.sub}</div>
                </div>
              ))}
            </div>

            {/* Accordion */}
            <div className="space-y-0 border-t border-[#E8F0E6]">
              {accordionItems.map((item, i) => (
                <div key={i} className="border-b border-[#E8F0E6]">
                  <button
                    onClick={() => setAccordionAberto(accordionAberto === i ? null : i)}
                    className="w-full flex items-center justify-between py-4 text-left"
                  >
                    <span className="text-sm font-medium text-[#2C3A2C] tracking-wide">{item.title}</span>
                    <span className={`text-[#6B9E63] transition-transform duration-200 text-xs ${accordionAberto === i ? "rotate-180" : ""}`}>▼</span>
                  </button>
                  {accordionAberto === i && (
                    <div className="pb-4">
                      <p className="text-sm text-[#5C6E5C] leading-relaxed">{item.content}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Produtos Relacionados */}
      <section className="py-16 px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[11px] tracking-[0.15em] uppercase text-[#6B9E63] mb-2">Também podes gostar</p>
              <h2 style={serif} className="text-4xl font-semibold text-[#1A2E1A]">Produtos Relacionados</h2>
            </div>
            <a href="#" className="text-xs text-[#6B9E63] border-b border-[#6B9E63] pb-0.5">Ver mais →</a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {produtosRelacionados.map((prod) => (
              <div key={prod.id} className="bg-white rounded-2xl overflow-hidden border border-[#E8F0E6] hover:shadow-lg hover:shadow-green-100 transition-all group cursor-pointer">
                <div className={`${prod.bg} h-52 flex items-center justify-center text-6xl relative`}>
                  <span className={`absolute top-2.5 left-2.5 text-[9px] tracking-widest uppercase px-2.5 py-1 rounded-full font-medium ${tagStyles[prod.tag]}`}>{prod.tag}</span>
                  <span className="group-hover:scale-110 transition-transform">{prod.emoji}</span>
                </div>
                <div className="p-4">
                  <div className="text-sm font-medium text-[#2C3A2C] mb-1">{prod.nome}</div>
                  <div className="text-base font-semibold text-[#3D6B4A]">{prod.preco}€</div>
                  <button className="w-full mt-3 bg-[#F0F5EE] text-[#3D6B4A] text-[10px] tracking-widest uppercase py-2 rounded-lg hover:bg-[#3D6B4A] hover:text-white transition-colors">
                    Ver Produto
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      {guiaAberto && <GuiaTamanhos onClose={() => setGuiaAberto(false)} />}
    </div>
  );
}