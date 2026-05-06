import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "./footer";
import Navbar from "./navbar";

const categorias = [
  { id: 1, nome: "Vestidos",        emoji: "👗", bg: "bg-[#E8F0E6]" },
  { id: 2, nome: "Casacos",         emoji: "🧥", bg: "bg-[#EEF5EC]" },
  { id: 3, nome: "Blazers e coletes", emoji: "🥼", bg: "bg-[#E4EEE2]" },
  { id: 4, nome: "Saias",           emoji: "👗", bg: "bg-[#ECF3EA]" },
];

export default function HomePage() {
  const [wishlist, setWishlist] = useState([]);
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const [produtosRecentes, setProdutosRecentes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Jost:wght@300;400;500&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);

    const fetchProdutos = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/produtos');
        const data = await res.json();
        setProdutosRecentes(data.slice(0, 5));
      } catch (err) {
        console.error("Erro ao buscar as novidades:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProdutos();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleWishlist = (id) =>
    setWishlist((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);

  const serif = { fontFamily: "'Cormorant Garamond', Georgia, serif" };
  const sans = { fontFamily: "'Jost', sans-serif" };

  return (
    <div style={sans} className="min-h-screen bg-[#F7F9F5] text-[#2C2C2C]">

      {/* Announce bar */}
      <div className="bg-[#3D6B4A] text-white text-center py-2 text-xs tracking-widest">
        ✦ Envio gratuito em compras acima de 50€ &nbsp;|&nbsp; Nova coleção Primavera-Verão disponível ✦
      </div>

      {/* Navbar */}
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[480px] flex items-center overflow-hidden bg-[#E8F0E6]">
        <div className="absolute right-0 top-0 w-1/2 h-full bg-[#C8DFC4]" style={{ clipPath: "polygon(15% 0%, 100% 0%, 100% 100%, 0% 100%)" }} />
        <div className="absolute right-[10%] top-[15%] w-72 h-72 rounded-full bg-white opacity-20" />
        <div className="relative z-10 max-w-7xl mx-auto px-12 w-full grid md:grid-cols-2 gap-8 items-center py-16">
          <div className="space-y-6">
            <span className="inline-block bg-[#3D6B4A] text-white text-[10px] tracking-[0.15em] uppercase px-5 py-2 rounded-full">✦ Nova Coleção 2026</span>
            <h1 style={serif} className="text-5xl md:text-6xl font-semibold text-[#1A2E1A] leading-tight">
              Elegância<br /><em className="text-[#3D6B4A] not-italic">que inspira.</em>
            </h1>
            <p className="text-[#5C6E5C] leading-relaxed text-sm max-w-sm">
              Descobre as últimas tendências de moda feminina. Peças únicas escolhidas a pensar em ti.
            </p>
            <div className="flex gap-3 flex-wrap">
              <button className="bg-[#3D6B4A] text-white px-8 py-3.5 rounded-full text-xs tracking-widest uppercase hover:bg-[#2C5038] transition-colors">Ver Coleção</button>
              <button className="border border-[#3D6B4A] text-[#3D6B4A] px-8 py-3.5 rounded-full text-xs tracking-widest uppercase hover:bg-[#3D6B4A] hover:text-white transition-all">Novidades →</button>
            </div>
            <div className="flex gap-8 pt-4 border-t border-[#B8D4B4]">
              {[["500+", "Produtos"], ["Free", "Envio +50€"]].map(([val, label]) => (
                <div key={label}>
                  <div className="text-lg font-semibold text-[#1A2E1A]">{val}</div>
                  <div className="text-xs text-[#8FAF8A] tracking-wide">{label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="hidden md:flex justify-center relative">
            <div className="w-64 h-80 bg-white bg-opacity-50 rounded-[140px_140px_20px_20px] flex items-center justify-center border border-white border-opacity-70">
              <span className="text-8xl">👗</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categorias */}
      <section className="py-16 px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[11px] tracking-[0.15em] uppercase text-[#6B9E63] mb-2">Navega por</p>
              <h2 style={serif} className="text-4xl font-semibold text-[#1A2E1A]">Categorias Populares</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categorias.map((cat) => (
              <Link
                key={cat.id}
                to={`/catalogo?categoria=${encodeURIComponent(cat.nome)}`}
                onClick={() => window.scrollTo(0, 0)}
                className="rounded-2xl overflow-hidden border border-[#E8F0E6] hover:-translate-y-1 transition-transform cursor-pointer group block"
              >
                <div className={`${cat.bg} h-48 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform`}>{cat.emoji}</div>
                <div className="p-4 bg-white border-t border-[#E8F0E6]">
                  <div className="text-sm font-medium text-[#2C3A2C]">{cat.nome}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <div className="bg-[#2C3A2C] grid grid-cols-2 md:grid-cols-4">
        {[
          { icon: "🚚", title: "Envio Grátis", desc: "Em compras acima de 50€" },
          { icon: "↩️", title: "Devoluções Fáceis", desc: "30 dias sem custos" },
          { icon: "🔒", title: "Pagamento Seguro", desc: "PayPal, MBWay e cartão" },
          { icon: "💬", title: "Apoio ao Cliente", desc: "Seg a Sáb das 9h às 19h" },
        ].map((b, i) => (
          <div key={i} className="text-center px-8 py-10 border-r border-[#3D6B4A] last:border-r-0">
            <div className="text-3xl mb-3">{b.icon}</div>
            <div className="text-sm font-medium text-[#E8F3E8] mb-2">{b.title}</div>
            <div className="text-xs text-[#6B9E63] leading-relaxed">{b.desc}</div>
          </div>
        ))}
      </div>

      {/* Novidades */}
      <section className="py-16 px-8 bg-[#F7F9F5]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[11px] tracking-[0.15em] uppercase text-[#6B9E63] mb-2">Em destaque</p>
              <h2 style={serif} className="text-4xl font-semibold text-[#1A2E1A]">Novidades</h2>
            </div>
          </div>
          
          {loading ? (
            <p className="text-sm text-[#8FAF8A]">A carregar novidades...</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {produtosRecentes.map((prod) => (
                <Link to={`/produto/${prod.id_produto}`} key={prod.id_produto} className="block" onClick={() => window.scrollTo(0, 0)}>
                  <div className="bg-white rounded-2xl overflow-hidden border border-[#E8F0E6] hover:shadow-lg hover:shadow-green-100 transition-all group cursor-pointer h-full flex flex-col">
                    
                    {/* Imagem do Produto */}
                    <div className="bg-[#F0F5EE] h-64 flex items-center justify-center relative overflow-hidden shrink-0">
                      {prod.imagem_principal ? (
                        <img src={prod.imagem_principal} alt={prod.nome_produto} className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
                      ) : (
                        <span className="text-5xl text-[#C8DFC4]">📷</span>
                      )}
                    </div>

                    {/* Detalhes do Produto */}
                    <div className="p-3.5 flex flex-col flex-grow">
                      <div className="text-xs font-medium text-[#2C3A2C] mb-1.5 line-clamp-2 min-h-[32px]">
                        {prod.nome_produto}
                      </div>
                      <div className="flex items-center gap-1.5 mt-auto">
                        <span className="text-sm font-semibold text-[#3D6B4A]">{parseFloat(prod.preco).toFixed(2).replace('.', ',')}€</span>
                        {prod.preco_anterior && <span className="text-xs text-gray-400 line-through">{parseFloat(prod.preco_anterior).toFixed(2).replace('.', ',')}€</span>}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}