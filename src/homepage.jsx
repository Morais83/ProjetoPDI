import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "./footer";
import Navbar from "./navbar";
import { SkeletonCard, SkeletonCardTall } from "./skeleton";
import { Truck, RotateCcw, ShieldCheck, MessageSquare } from "lucide-react";

export default function HomePage() {
  const [wishlist, setWishlist] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  
  const [produtosRecentes, setProdutosRecentes] = useState([]);
  const [categoriasPopulares, setCategoriasPopulares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [slideAtivo, setSlideAtivo] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideAtivo(prev => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);

    const carregarDados = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/produtos`);
        const data = await res.json();
        setProdutosRecentes(data.slice(0, 5));
        const [resProdutos, resCategorias] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/produtos`),
          fetch(`${import.meta.env.VITE_API_URL}/api/categorias`)
        ]);
        
        const dataProdutos = await resProdutos.json();
        const dataCategorias = await resCategorias.json();
        
        const produtosOrdenados = dataProdutos.sort((a, b) => b.id_produto - a.id_produto);
        
        setProdutosRecentes(produtosOrdenados.slice(0, 5));

        const categoriasAlvo = [
          { nome: "Vestidos",          bg: "bg-[#ECF3EA]" },
          { nome: "Saltos altos",           bg: "bg-[#EEF5EC]" }, 
          { nome: "Blazers e coletes", bg: "bg-[#E4EEE2]" },
          { nome: "Malas de mão",  bg: "bg-[#E8F0E6]" },
        ];

        const categoriasComImagens = categoriasAlvo.map(catAlvo => {
          const catBD = dataCategorias.find(c => c.nome_categoria === catAlvo.nome);
          return {
            ...catAlvo,
            id: catBD ? catBD.id_categoria : Math.random(),
            imagem: catBD && catBD.imagem ? catBD.imagem : null 
          };
        });

        setCategoriasPopulares(categoriasComImagens);

      } catch (err) {
        console.error("Erro ao buscar os dados:", err);
      } finally {
        setLoading(false);
      }
    };
    
    carregarDados();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const serif = { fontFamily: "'Cormorant Garamond', Georgia, serif" };
  const sans = { fontFamily: "'Jost', sans-serif" };

  return (
    <div style={sans} className="min-h-screen bg-[#F7F9F5] text-[#2C2C2C]">

      {/* Navbar */}
      <Navbar />

      {/* Hero com slideshow */}
      <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        {["/hero/slide1.jpg","/hero/slide2.jpg","/hero/slide3.jpg"].map((img, i) => (
          <div key={i} className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: slideAtivo === i ? 1 : 0 }}>
            <img loading="lazy" src={img} alt="" className="w-full h-full object-cover object-center" />
            <div className="absolute inset-0 bg-black/35" />
          </div>
        ))}

        {/* Texto */}
        <div className="relative z-10 h-full flex flex-col justify-end px-6 md:px-16 pb-10 md:pb-16">
          <h1 style={serif} className="text-white text-4xl md:text-7xl font-semibold mb-5 leading-tight max-w-2xl">
            Elegância<br />que inspira.
          </h1>
          <div className="flex flex-wrap gap-3">
            <Link to="/catalogo" onClick={() => window.scrollTo(0, 0)}
              className="bg-white text-[#1A2E1A] px-6 md:px-8 py-3 md:py-3.5 text-xs tracking-widest uppercase hover:bg-[#F0F5EE] transition-all hover:-translate-y-0.5 active:translate-y-0">
              Ver Catálogo
            </Link>
            <Link to="/promocoes" onClick={() => window.scrollTo(0, 0)}
              className="border border-white text-white px-6 md:px-8 py-3 md:py-3.5 text-xs tracking-widest uppercase hover:bg-white hover:text-[#1A2E1A] transition-all hover:-translate-y-0.5 active:translate-y-0">
              Promoções
            </Link>
          </div>
        </div>

        {/* Indicadores */}
        <div className="absolute bottom-4 md:bottom-6 right-6 md:right-16 z-10 flex gap-2">
          {[0,1,2].map(i => (
            <button key={i} onClick={() => setSlideAtivo(i)}
              className={`transition-all duration-300 rounded-full ${slideAtivo === i ? "w-8 h-2 bg-white" : "w-2 h-2 bg-white/50 hover:bg-white/75"}`}
            />
          ))}
        </div>
      </section>

      {/* Categorias Populares */}
      <section className="py-16 px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[11px] tracking-[0.15em] uppercase text-[#6B9E63] mb-2">Navega por</p>
              <h2 style={serif} className="text-4xl font-semibold text-[#1A2E1A]">Categorias Populares</h2>
            </div>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden border border-[#E8F0E6]">
                  <div className="animate-pulse bg-gradient-to-r from-[#E8F0E6] via-[#F0F5EE] to-[#E8F0E6] h-48 md:h-64" style={{ backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
                  <div className="p-5 bg-white border-t border-[#E8F0E6]">
                    <div className="animate-pulse bg-[#E8F0E6] h-4 w-2/3 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {categoriasPopulares.map((cat) => (
                <Link key={cat.id}
                  to={`/catalogo?categoria=${encodeURIComponent(cat.nome)}`}
                  onClick={() => window.scrollTo(0, 0)}
                  className="rounded-2xl overflow-hidden border border-[#E8F0E6] hover:-translate-y-1.5 hover:shadow-md hover:shadow-green-100/60 transition-all duration-300 cursor-pointer group block"
                >
                  <div className={`${cat.bg} h-48 md:h-64 flex items-center justify-center overflow-hidden`}>
                    {cat.imagem ? (
                      <img loading="lazy" src={cat.imagem} alt={cat.nome}
                        className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <span style={serif} className="text-6xl font-semibold text-[#3D6B4A] group-hover:scale-110 transition-transform duration-300">
                        {cat.nome.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="p-4 md:p-5 bg-white border-t border-[#E8F0E6]">
                    <div className="text-sm md:text-base font-semibold text-[#2C3A2C] group-hover:text-[#3D6B4A] transition-colors">{cat.nome}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Benefícios */}
      <section className="bg-[#364F36] py-14 border-y border-[#2C3A2C]">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-0">
            {[
              { icon: Truck, title: "Envio Grátis", desc: "Em compras acima de 50€" },
              { icon: RotateCcw, title: "Devoluções Fáceis", desc: "30 dias sem custos" },
              { icon: ShieldCheck, title: "Pagamento Seguro", desc: "MBWay e cartão" },
              { icon: MessageSquare, title: "Apoio ao Cliente", desc: "Seg a Sex das 10h às 19h" },
            ].map((b, i) => {
              const Icone = b.icon;
              return (
                <div key={i} className="flex flex-col items-center text-center px-6 md:border-r border-[#2C3A2C] last:border-0">
                  <div className="w-14 h-14 rounded-full bg-[#243B24] flex items-center justify-center mb-5 text-[#C8DFC4] shadow-inner">
                    <Icone strokeWidth={1.5} size={26} />
                  </div>
                  <h3 className="text-[13px] font-semibold text-white tracking-widest uppercase mb-2">
                    {b.title}
                  </h3>
                  <p className="text-sm text-[#8FAF8A] max-w-[200px]">
                    {b.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mini Sobre Nós */}
      <section className="py-24 px-8 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          
          <div className="max-w-lg">
            <p className="text-[11px] tracking-[0.15em] uppercase text-[#6B9E63] mb-3">A nossa história</p>
            <h2 style={serif} className="text-4xl md:text-5xl font-semibold text-[#1A2E1A] mb-6 uppercase tracking-wide leading-tight">
              Bem-vinda à<br/>Moda Chique
            </h2>
            <p className="text-sm text-[#5C6E5C] leading-relaxed mb-8">
              Acreditamos que a moda vai muito além da roupa — é uma forma de expressão, 
              confiança e identidade. Nascemos com o objetivo de criar uma experiência de 
              compra online moderna, elegante e próxima de cada cliente. Valorizamos a atenção 
              ao detalhe e a qualidade em cada peça, para que te sintas única em todas as estações.
            </p>
            <Link to="/sobre-nos" onClick={() => window.scrollTo(0, 0)}
              className="inline-block bg-[#1A2E1A] text-white px-8 py-4 text-xs tracking-widest uppercase hover:bg-[#2C3A2C] transition-colors"
            >
              Sabe mais sobre nós
            </Link>
          </div>

          <div className="relative h-[500px] hidden md:block">
            <div className="absolute top-0 right-0 w-[60%] h-[80%] z-0 bg-[#F0F5EE]">
              <img loading="lazy" 
                src="/hero/slide4.jpg" 
                alt="Moda Chique Detalhe" 
                className="w-full h-full object-cover object-center shadow-sm"
              />
            </div>
            <div className="absolute bottom-0 left-0 w-[60%] h-[80%] z-10 bg-[#E8F0E6] shadow-xl border-4 border-white">
              <img loading="lazy" 
                src="/hero/slide5.jpg" 
                alt="Moda Chique Coleção" 
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>

        </div>
      </section>

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
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => <SkeletonCardTall key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {produtosRecentes.map((prod) => (
                <Link to={`/produto/${prod.id_produto}`} key={prod.id_produto} className="block group" onClick={() => window.scrollTo(0, 0)}>
                  <div className="bg-white rounded-2xl overflow-hidden border border-[#E8F0E6] hover:shadow-lg hover:shadow-green-100/60 hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full flex flex-col">
                    <div className="bg-[#F0F5EE] h-48 md:h-64 flex items-center justify-center relative overflow-hidden shrink-0">
                      {prod.imagem_principal ? (
                        <img loading="lazy" src={prod.imagem_principal} alt={prod.nome_produto}
                          className="h-full w-full object-cover group-hover:scale-107 transition-transform duration-500" />
                      ) : (
                        <span className="text-5xl text-[#C8DFC4]">📷</span>
                      )}
                    </div>
                    <div className="p-3 md:p-3.5 flex flex-col flex-grow">
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

      <Footer />
    </div>
  );
}