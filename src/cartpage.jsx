import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "./footer";
import Navbar from "./navbar";
import { getCarrinho, removerDoCarrinho, atualizarQuantidade } from './cart';
import { 
  ShoppingBag, 
  Trash2, 
  ArrowLeft, 
  Camera, 
  AlertTriangle, 
  Lock, 
  RotateCcw, 
  Truck 
} from "lucide-react";

const serif = { fontFamily: "'Cormorant Garamond', Georgia, serif" };
const sans = { fontFamily: "'Jost', sans-serif" };

export default function CartPage() {
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Jost:wght@300;400;500&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    carregarCarrinho();
  }, []);

  const carregarCarrinho = () => {
    setProdutos(getCarrinho());
  };

  const alterarQuantidade = (id_variante, delta) => {
    const prod = produtos.find(p => p.id_variante === id_variante);
    if (!prod) return;
    const maxQtd = prod.stock > 0 ? prod.stock : 999;
    const novaQtd = Math.min(maxQtd, Math.max(1, prod.quantidade + delta));
    atualizarQuantidade(id_variante, novaQtd);
    carregarCarrinho();
    window.dispatchEvent(new Event('carrinho-atualizado'));
  };

  const remover = (id_variante) => {
    removerDoCarrinho(id_variante);
    carregarCarrinho();
    window.dispatchEvent(new Event('carrinho-atualizado'));
  };

  const subtotal = produtos.reduce((acc, p) => acc + p.preco * p.quantidade, 0);
  const envioGratis = subtotal >= 50;
  const total = subtotal + (envioGratis ? 0 : 3.99);

  return (
    <div style={sans} className="min-h-screen bg-[#F7F9F5] text-[#2C2C2C]">

      <Navbar />

      <div className="max-w-7xl mx-auto px-8 py-10">
        <div className="flex items-center gap-2 text-xs text-[#8FAF8A] mb-8">
          <Link to="/" className="hover:text-[#3D6B4A] transition-colors">Início</Link>
          <span>/</span>
          <span className="text-[#3D6B4A]">Carrinho</span>
        </div>

        <h1 style={serif} className="text-4xl font-semibold text-[#1A2E1A] mb-8">Carrinho de Compras</h1>

        {produtos.length === 0 ? (
          <div className="text-center py-24">
            <div className="flex justify-center mb-6">
              <ShoppingBag size={80} strokeWidth={1} className="text-[#C8DFC4]" />
            </div>
            <p style={serif} className="text-3xl text-[#C8DFC4] mb-3">O teu carrinho está vazio</p>
            <p className="text-sm text-[#8FAF8A] mb-8">Explora a nossa coleção e encontra algo que adores.</p>
            <Link to="/catalogo" onClick={() => window.scrollTo(0, 0)} className="bg-[#3D6B4A] text-white px-8 py-3.5 rounded-full text-xs tracking-widest uppercase hover:bg-[#2C5038] transition-colors">
              Explorar Produtos
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8 items-start">

            {/* Lista */}
            <div className="md:col-span-2 space-y-4">
              {produtos.map((prod) => (
                <div key={prod.id_variante} className="bg-white rounded-2xl border border-[#E8F0E6] p-5 flex gap-5 items-start">

                  <Link to={`/produto/${prod.id_produto}`} onClick={() => window.scrollTo(0, 0)}>
                    <div className="w-24 h-28 rounded-xl flex-shrink-0 overflow-hidden bg-[#F0F5EE]">
                      {prod.imagem_url
                        ? <img src={prod.imagem_url} alt={prod.nome_produto} className="w-full h-full object-cover hover:opacity-80 transition-opacity" />
                        : <div className="w-full h-full flex items-center justify-center text-[#C8DFC4]"><Camera size={32} /></div>
                      }
                    </div>
                  </Link>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <Link to={`/produto/${prod.id_produto}`} onClick={() => window.scrollTo(0, 0)}>
                          <h3 style={serif} className="text-xl font-semibold text-[#1A2E1A] hover:text-[#3D6B4A] transition-colors">{prod.nome_produto}</h3>
                        </Link>
                        <p className="text-xs text-[#8FAF8A]">{prod.nome_marca}</p>
                      </div>
                      <p style={serif} className="text-xl font-semibold text-[#3D6B4A]">{(prod.preco * prod.quantidade).toFixed(2).replace(".", ",")}€</p>
                    </div>

                    <div className="flex gap-4 text-xs text-[#5C6E5C] mb-3">
                      <span>Cor: <span className="text-[#2C3A2C] font-medium">{prod.cor}</span></span>
                      <span>Tamanho: <span className="text-[#2C3A2C] font-medium">{prod.tamanho}</span></span>
                    </div>

                    {/* Aviso de stock baixo */}
                    {prod.stock > 0 && prod.stock <= 3 && (
                      <p className="text-[10px] text-[#A67C00] bg-[#FEF9E7] px-2 py-1 rounded-lg mb-3 inline-flex items-center gap-1.5">
                        <AlertTriangle size={12} /> Apenas {prod.stock} em stock
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-[#C8DFC4] rounded-full overflow-hidden bg-white">
                        <button onClick={() => alterarQuantidade(prod.id_variante, -1)}
                          className="w-8 h-8 flex items-center justify-center text-[#3D6B4A] hover:bg-[#F0F5EE] transition-colors text-base">−</button>
                        <span className="w-8 text-center text-sm font-medium text-[#2C2C2C]">{prod.quantidade}</span>
                        <button
                          onClick={() => alterarQuantidade(prod.id_variante, 1)}
                          disabled={prod.stock > 0 && prod.quantidade >= prod.stock}
                          className="w-8 h-8 flex items-center justify-center text-[#3D6B4A] hover:bg-[#F0F5EE] transition-colors text-base disabled:opacity-30">+</button>
                      </div>
                      <button onClick={() => remover(prod.id_variante)}
                        className="text-xs text-[#C0392B] hover:underline flex items-center gap-1 font-medium">
                        <Trash2 size={14} /> Remover
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <Link to="/catalogo" onClick={() => window.scrollTo(0, 0)} className="inline-flex items-center gap-2 text-sm text-[#3D6B4A] hover:underline">
                <ArrowLeft size={16} /> Continuar a comprar
              </Link>
            </div>

            {/* Resumo */}
            <div className="bg-white rounded-2xl border border-[#E8F0E6] p-6 sticky top-24 shadow-sm">
              <h2 style={serif} className="text-2xl font-semibold text-[#1A2E1A] mb-6">Resumo do Pedido</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-[#5C6E5C]">Subtotal ({produtos.reduce((a, p) => a + p.quantidade, 0)} artigos)</span>
                  <span className="text-[#2C3A2C]">{subtotal.toFixed(2).replace(".", ",")}€</span>
                </div>
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
                    {total.toFixed(2).replace(".", ",")}€
                  </span>
                </div>
              </div>

              <Link to="/checkout" onClick={() => window.scrollTo(0, 0)}
                className="w-full block text-center bg-[#3D6B4A] text-white py-4 rounded-full text-xs tracking-widest uppercase hover:bg-[#2C5038] transition-all shadow-lg shadow-green-900/10 mb-4 font-semibold">
                Continuar para Pagamento
              </Link>

              <div className="border-t border-[#E8F0E6] pt-4">
                <p className="text-[10px] text-[#8FAF8A] text-center mb-3 tracking-widest uppercase">Métodos de pagamento aceites</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {["MBWay", "Visa", "Mastercard", "Cobrança"].map(m => (
                    <span key={m} className="bg-[#F7F9F5] border border-[#E8F0E6] px-3 py-1 rounded-md text-[10px] text-[#5C6E5C] font-medium uppercase">{m}</span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-6 pt-6 border-t border-[#E8F0E6]">
                {[
                  { icon: Lock, text: "Seguro" },
                  { icon: RotateCcw, text: "30 dias" },
                  { icon: Truck, text: "Rápido" },
                ].map((b, i) => {
                  const BadgeIcon = b.icon;
                  return (
                    <div key={i} className="text-center flex flex-col items-center">
                      <BadgeIcon size={18} className="text-[#3D6B4A] mb-1.5" />
                      <div className="text-[9px] text-[#8FAF8A] leading-tight uppercase font-medium tracking-tighter">{b.text}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}