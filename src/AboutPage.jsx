import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const serif = { fontFamily: "'Cormorant Garamond', Georgia, serif" };
const sans = { fontFamily: "'Jost', sans-serif" };

const valores = [
  { icon: "🌿", titulo: "Sustentabilidade", descricao: "Comprometidos com práticas responsáveis e materiais sustentáveis em toda a nossa cadeia de produção." },
  { icon: "✨", titulo: "Qualidade", descricao: "Cada peça é cuidadosamente selecionada para garantir os mais altos padrões de qualidade e durabilidade." },
  { icon: "💚", titulo: "Inclusividade", descricao: "Moda para todos os corpos e estilos. Acreditamos que a elegância não tem tamanho nem forma." },
  { icon: "🤝", titulo: "Confiança", descricao: "Construímos relações duradouras com as nossas clientes baseadas na transparência e no respeito mútuo." },
];

const numeros = [
  { valor: "500+", label: "Produtos" },
  { valor: "2.000+", label: "Clientes felizes" },
  { valor: "4.9★", label: "Avaliação média" },
  { valor: "5+", label: "Anos de experiência" },
];

const equipa = [
  { nome: "Lili Ferreira", cargo: "Fundadora & Diretora Criativa", inicial: "L" },
  { nome: "Ana Costa", cargo: "Gestora de Produto", inicial: "A" },
  { nome: "Sofia Mendes", cargo: "Responsável de Cliente", inicial: "S" },
];

export default function AboutPage() {
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Jost:wght@300;400;500&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  return (
    <div style={sans} className="min-h-screen bg-[#F7F9F5] text-[#2C2C2C]">
      <div className="bg-[#3D6B4A] text-white text-center py-2 text-xs tracking-widest">
        ✦ Envio gratuito em compras acima de 50€ &nbsp;|&nbsp; Nova coleção Primavera-Verão disponível ✦
      </div>

      <Navbar />

      {/* Hero */}
      <section className="bg-[#E8F0E6] py-24 px-8 text-center relative overflow-hidden">
        <div className="absolute right-0 top-0 w-1/3 h-full bg-[#C8DFC4] opacity-30" style={{ clipPath: "polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)" }} />
        <div className="relative z-10 max-w-2xl mx-auto">
          <p className="text-xs tracking-[0.2em] uppercase text-[#6B9E63] mb-3">A nossa história</p>
          <h1 style={serif} className="text-6xl font-semibold text-[#1A2E1A] mb-6 leading-tight">
            Sobre a<br /><em className="not-italic text-[#3D6B4A]">Moda Chique</em>
          </h1>
          <p className="text-base text-[#5C6E5C] leading-relaxed">
            Nascemos da paixão por moda feminina elegante e acessível. A Moda Chique — Lili Store é um projeto de coração, criado para mulheres que valorizam o detalhe, a qualidade e o estilo do dia a dia.
          </p>
        </div>
      </section>

      {/* História */}
      <section className="py-20 px-8 bg-white">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs tracking-[0.15em] uppercase text-[#6B9E63] mb-3">Como começou</p>
            <h2 style={serif} className="text-4xl font-semibold text-[#1A2E1A] mb-6">Uma ideia que nasceu do amor pela moda</h2>
            <div className="space-y-4 text-sm text-[#5C6E5C] leading-relaxed">
              <p>
                A Moda Chique foi fundada em 2019 pela Lili Ferreira, uma apaixonada por moda que sonhava em criar um espaço onde as mulheres pudessem encontrar peças únicas e elegantes sem terem de gastar uma fortuna.
              </p>
              <p>
                O que começou como um pequeno projeto de curadoria de peças nas redes sociais rapidamente cresceu para uma loja online completa, com centenas de produtos cuidadosamente selecionados para diferentes estilos e ocasiões.
              </p>
              <p>
                Hoje, somos uma equipa dedicada que trabalha todos os dias para trazer as melhores tendências da moda feminina diretamente até ti, com envio rápido, devoluções fáceis e um serviço de cliente que coloca a tua satisfação em primeiro lugar.
              </p>
            </div>
          </div>
          <div className="bg-[#E8F0E6] rounded-3xl h-80 flex items-center justify-center">
            <span className="text-9xl">👗</span>
          </div>
        </div>
      </section>

      {/* Números */}
      <section className="bg-[#2C3A2C] py-16 px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {numeros.map((n, i) => (
            <div key={i}>
              <p style={serif} className="text-4xl font-semibold text-white mb-2">{n.valor}</p>
              <p className="text-xs tracking-widest uppercase text-[#6B9E63]">{n.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Valores */}
      <section className="py-20 px-8 bg-[#F7F9F5]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.15em] uppercase text-[#6B9E63] mb-3">O que nos guia</p>
            <h2 style={serif} className="text-4xl font-semibold text-[#1A2E1A]">Os nossos valores</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {valores.map((v, i) => (
              <div key={i} className="bg-white rounded-2xl border border-[#E8F0E6] p-6 text-center hover:-translate-y-1 transition-transform">
                <span className="text-4xl mb-4 block">{v.icon}</span>
                <h3 style={serif} className="text-xl font-semibold text-[#1A2E1A] mb-3">{v.titulo}</h3>
                <p className="text-xs text-[#5C6E5C] leading-relaxed">{v.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipa */}
      <section className="py-20 px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.15em] uppercase text-[#6B9E63] mb-3">As pessoas por detrás da marca</p>
            <h2 style={serif} className="text-4xl font-semibold text-[#1A2E1A]">A nossa equipa</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {equipa.map((membro, i) => (
              <div key={i} className="text-center">
                <div className="w-24 h-24 rounded-full bg-[#E8F0E6] flex items-center justify-center mx-auto mb-4">
                  <span style={serif} className="text-4xl font-semibold text-[#3D6B4A]">{membro.inicial}</span>
                </div>
                <h3 style={serif} className="text-2xl font-semibold text-[#1A2E1A] mb-1">{membro.nome}</h3>
                <p className="text-xs tracking-widest uppercase text-[#6B9E63]">{membro.cargo}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#E8F0E6] py-16 px-8 text-center">
        <div className="max-w-xl mx-auto">
          <p className="text-xs tracking-[0.15em] uppercase text-[#6B9E63] mb-3">Faz parte da nossa família</p>
          <h2 style={serif} className="text-4xl font-semibold text-[#1A2E1A] mb-4">Pronta para explorar?</h2>
          <p className="text-sm text-[#5C6E5C] mb-8 leading-relaxed">Descobre as nossas coleções e encontra as peças perfeitas para o teu estilo.</p>
          <div className="flex gap-3 justify-center">
            <Link to="/catalogo" onClick={() => window.scrollTo(0, 0)} className="bg-[#3D6B4A] text-white px-8 py-3.5 rounded-full text-xs tracking-widest uppercase hover:bg-[#2C5038] transition-colors">
              Ver Coleção
            </Link>
            <Link to="/ajuda" onClick={() => window.scrollTo(0, 0)} className="border border-[#3D6B4A] text-[#3D6B4A] px-8 py-3.5 rounded-full text-xs tracking-widest uppercase hover:bg-[#3D6B4A] hover:text-white transition-all">
              Contacta-nos
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}