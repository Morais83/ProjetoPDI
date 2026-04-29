import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const serif = { fontFamily: "'Cormorant Garamond', Georgia, serif" };
const sans = { fontFamily: "'Jost', sans-serif" };

const produtosIniciais = [
  { id: 1, nome: "Blazer Alfaiataria", marca: "Moda Chique", preco: 39.99, cor: "Preto", tamanho: "38", quantidade: 1, emoji: "🧥", bg: "bg-[#F0F5EE]" },
  { id: 2, nome: "Vestido Linho Verde", marca: "Moda Chique", preco: 59.90, cor: "Verde", tamanho: "36", quantidade: 1, emoji: "👗", bg: "bg-[#F5F0EE]" },
  { id: 3, nome: "Blusa Seda Rosa", marca: "Moda Chique", preco: 49.90, cor: "Rosa", tamanho: "S", quantidade: 1, emoji: "👚", bg: "bg-[#F0F5EE]" },
];

export default function CartPage() {
  const [produtos, setProdutos] = useState(produtosIniciais);
  const [codigoDesconto, setCodigoDesconto] = useState("");
  const [descontoAplicado, setDescontoAplicado] = useState(false);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Jost:wght@300;400;500&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  const alterarQuantidade = (id, delta) => {
    setProdutos((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, quantidade: Math.max(1, p.quantidade + delta) } : p
      )
    );
  };

  const remover = (id) => {
    setProdutos((prev) => prev.filter((p) => p.id !== id));
  };

  const subtotal = produtos.reduce((acc, p) => acc + p.preco * p.quantidade, 0);
  const envioGratis = subtotal >= 50;
  const desconto = descontoAplicado ? subtotal * 0.1 : 0;
  const total = subtotal - desconto;

  const aplicarDesconto = () => {
    if (codigoDesconto.toUpperCase() === "LILI10") {
      setDescontoAplicado(true);
    }
  };

  return (
    <div style={sans} className="min-h-screen bg-[#F7F9F5] text-[#2C2C2C]">
      <div className="bg-[#3D6B4A] text-white text-center py-2 text-xs tracking-widest">
        ✦ Envio gratuito em compras acima de 50€ &nbsp;|&nbsp; Nova coleção Primavera-Verão disponível ✦
      </div>

      <Navbar />

      <div className="max-w-7xl mx-auto px-8 py-10">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#8FAF8A] mb-8">
          <Link to="/" className="hover:text-[#3D6B4A] transition-colors">Início</Link>
          <span>/</span>
          <span className="text-[#3D6B4A]">Carrinho</span>
        </div>

        <h1 style={serif} className="text-4xl font-semibold text-[#1A2E1A] mb-8">Carrinho de Compras</h1>

        {produtos.length === 0 ? (
          /* Carrinho vazio */
          <div className="text-center py-24">
            <span className="text-8xl mb-6 block">🛍️</span>
            <p style={serif} className="text-3xl text-[#C8DFC4] mb-3">O teu carrinho está vazio</p>
            <p className="text-sm text-[#8FAF8A] mb-8">Explora a nossa coleção e encontra algo que adores.</p>
            <Link to="/catalogo" onClick={() => window.scrollTo(0, 0)} className="bg-[#3D6B4A] text-white px-8 py-3.5 rounded-full text-xs tracking-widest uppercase hover:bg-[#2C5038] transition-colors">
              Explorar Produtos
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8 items-start">

            {/* Lista de Produtos */}
            <div className="md:col-span-2 space-y-4">
              {produtos.map((prod) => (
                <div key={prod.id} className="bg-white rounded-2xl border border-[#E8F0E6] p-5 flex gap-5 items-start">

                  {/* Imagem */}
                  <Link to={`/produto/${prod.id}`} onClick={() => window.scrollTo(0, 0)}>
                    <div className={`${prod.bg} w-24 h-28 rounded-xl flex items-center justify-center text-4xl flex-shrink-0 hover:opacity-80 transition-opacity`}>
                      {prod.emoji}
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <Link to={`/produto/${prod.id}`} onClick={() => window.scrollTo(0, 0)}>
                          <h3 style={serif} className="text-xl font-semibold text-[#1A2E1A] hover:text-[#3D6B4A] transition-colors">{prod.nome}</h3>
                        </Link>
                        <p className="text-xs text-[#8FAF8A]">{prod.marca}</p>
                      </div>
                      <p style={serif} className="text-xl font-semibold text-[#3D6B4A]">{(prod.preco * prod.quantidade).toFixed(2).replace(".", ",")}€</p>
                    </div>

                    <div className="flex gap-4 text-xs text-[#5C6E5C] mb-4">
                      <span>Cor: <span className="text-[#2C3A2C] font-medium">{prod.cor}</span></span>
                      <span>Tamanho: <span className="text-[#2C3A2C] font-medium">{prod.tamanho}</span></span>
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Quantidade */}
                      <div className="flex items-center border border-[#C8DFC4] rounded-full overflow-hidden bg-white">
                        <button
                          onClick={() => alterarQuantidade(prod.id, -1)}
                          className="w-8 h-8 flex items-center justify-center text-[#3D6B4A] hover:bg-[#F0F5EE] transition-colors text-base"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-sm font-medium text-[#2C2C2C]">{prod.quantidade}</span>
                        <button
                          onClick={() => alterarQuantidade(prod.id, 1)}
                          className="w-8 h-8 flex items-center justify-center text-[#3D6B4A] hover:bg-[#F0F5EE] transition-colors text-base"
                        >
                          +
                        </button>
                      </div>

                      {/* Remover */}
                      <button
                        onClick={() => remover(prod.id)}
                        className="text-xs text-[#C0392B] hover:underline flex items-center gap-1"
                      >
                        🗑️ Remover
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Continuar a comprar */}
              <Link to="/catalogo" onClick={() => window.scrollTo(0, 0)} className="inline-flex items-center gap-2 text-sm text-[#3D6B4A] hover:underline">
                ← Continuar a comprar
              </Link>
            </div>

            {/* Resumo do Pedido */}
            <div className="bg-white rounded-2xl border border-[#E8F0E6] p-6 sticky top-24">
              <h2 style={serif} className="text-2xl font-semibold text-[#1A2E1A] mb-6">Resumo do Pedido</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-[#5C6E5C]">Subtotal ({produtos.reduce((a, p) => a + p.quantidade, 0)} artigos)</span>
                  <span className="text-[#2C3A2C]">{subtotal.toFixed(2).replace(".", ",")}€</span>
                </div>
                {descontoAplicado && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#3D6B4A]">Desconto (10%)</span>
                    <span className="text-[#3D6B4A]">−{desconto.toFixed(2).replace(".", ",")}€</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-[#5C6E5C]">Portes de envio</span>
                  <span className={envioGratis ? "text-[#3D6B4A] font-medium" : "text-[#2C3A2C]"}>
                    {envioGratis ? "GRÁTIS" : "3,99€"}
                  </span>
                </div>
                {!envioGratis && (
                  <p className="text-xs text-[#8FAF8A]">
                    Faltam {(50 - subtotal).toFixed(2).replace(".", ",")}€ para envio grátis
                  </p>
                )}
              </div>

              <div className="border-t border-[#E8F0E6] pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-[#2C3A2C]">Preço Final</span>
                  <span style={serif} className="text-2xl font-semibold text-[#1A2E1A]">
                    {(total + (envioGratis ? 0 : 3.99)).toFixed(2).replace(".", ",")}€
                  </span>
                </div>
              </div>

              <Link to="/checkout" onClick={() => window.scrollTo(0, 0)} className="w-full block text-center bg-[#3D6B4A] text-white py-4 rounded-full text-xs tracking-widest uppercase hover:bg-[#2C5038] transition-all shadow-lg shadow-green-900/10 mb-4">
                Continuar para Pagamento
              </Link>

              {/* Métodos de Pagamento */}
              <div className="border-t border-[#E8F0E6] pt-4">
                <p className="text-[10px] text-[#8FAF8A] text-center mb-3 tracking-widest uppercase">Métodos de pagamento aceites</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {["MBWay", "PayPal", "Visa", "Mastercard", "Cobrança"].map((m) => (
                    <span key={m} className="bg-[#F7F9F5] border border-[#E8F0E6] px-3 py-1 rounded-md text-xs text-[#5C6E5C]">{m}</span>
                  ))}
                </div>
              </div>

              {/* Badges */}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-[#E8F0E6]">
                {[
                  { icon: "🔒", text: "Pagamento Seguro" },
                  { icon: "↩️", text: "30 dias devolução" },
                  { icon: "🚚", text: "Envio rápido" },
                ].map((b, i) => (
                  <div key={i} className="text-center">
                    <div className="text-lg mb-1">{b.icon}</div>
                    <div className="text-[9px] text-[#8FAF8A] leading-tight">{b.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}