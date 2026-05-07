import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const serif = { fontFamily: "'Cormorant Garamond', Georgia, serif" };
const sans = { fontFamily: "'Jost', sans-serif" };

const valores = [
  {
    icon: "✨",
    titulo: "Qualidade",
    descricao: "Cada peça é cuidadosamente selecionada para garantir tendências atuais e os mais altos padrões de qualidade.",
  },
  {
    icon: "🤝",
    titulo: "Confiança",
    descricao: "Construímos relações duradouras com cada cliente, baseadas na transparência, atenção ao detalhe e respeito mútuo.",
  },
  {
    icon: "💚",
    titulo: "Proximidade",
    descricao: "Valorizamos o contacto próximo com cada cliente, oferecendo um atendimento personalizado em cada interação.",
  },
  {
    icon: "🌟",
    titulo: "Identidade",
    descricao: "Acreditamos que a moda é uma forma de expressão e confiança — ajudamos cada cliente a encontrar o seu estilo.",
  },
];

const numeros = [
  { valor: "2023", label: "Ano de fundação" },
  { valor: "100%", label: "Dedicação" },
  { valor: "∞", label: "Paixão pela moda" },
  { valor: "Em breve", label: "Loja física" },
];

export default function AboutPage() {
  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Jost:wght@300;400;500&display=swap";
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
        <div
          className="absolute right-0 top-0 w-1/3 h-full bg-[#C8DFC4] opacity-30"
          style={{ clipPath: "polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
        />
        <div className="relative z-10 max-w-2xl mx-auto">
          <p className="text-xs tracking-[0.2em] uppercase text-[#6B9E63] mb-3">
            A nossa história
          </p>
          <h1
            style={serif}
            className="text-6xl font-semibold text-[#1A2E1A] mb-6 leading-tight"
          >
            Sobre a<br />
            <em className="not-italic text-[#3D6B4A]">Moda Chique</em>
          </h1>
          <p className="text-base text-[#5C6E5C] leading-relaxed">
            Uma paixão pela moda e pela proximidade com as pessoas. Nascemos em
            2023 com o objetivo de criar uma experiência de compra moderna,
            elegante e próxima de cada cliente.
          </p>
        </div>
      </section>

      {/* História */}
      <section className="py-20 px-8 bg-white">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs tracking-[0.15em] uppercase text-[#6B9E63] mb-3">
              Como começou
            </p>
            <h2
              style={serif}
              className="text-4xl font-semibold text-[#1A2E1A] mb-6"
            >
              Uma ideia nascida da paixão pela moda e pelas pessoas
            </h2>
            <div className="space-y-4 text-sm text-[#5C6E5C] leading-relaxed">
              <p>
                A Moda Chique nasceu em 2023 com um objetivo simples: criar uma
                experiência de compra online moderna, elegante e próxima de cada
                cliente. Sendo uma empresa recente, crescemos com dedicação,
                criatividade e, acima de tudo, com a paixão pelo contacto com o
                público e pela área das relações públicas.
              </p>
              <p>
                Desde o início, acreditámos que a moda vai muito além da roupa —
                é uma forma de expressão, confiança e identidade. Foi essa visão
                que nos levou a construir uma loja online pensada para oferecer
                peças cuidadosamente selecionadas, tendências atuais e uma
                experiência prática e acolhedora.
              </p>
              <p>
                O que começou como um projeto movido pelo gosto pela comunicação
                e pela ligação com as pessoas, continua hoje a evoluir
                diariamente. Trabalhamos para criar uma relação de confiança com
                cada cliente, valorizando a atenção ao detalhe, o atendimento
                personalizado e a proximidade em cada interação.
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
              <p
                style={serif}
                className="text-4xl font-semibold text-white mb-2"
              >
                {n.valor}
              </p>
              <p className="text-xs tracking-widest uppercase text-[#6B9E63]">
                {n.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Valores */}
      <section className="py-20 px-8 bg-[#F7F9F5]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.15em] uppercase text-[#6B9E63] mb-3">
              O que nos guia
            </p>
            <h2
              style={serif}
              className="text-4xl font-semibold text-[#1A2E1A]"
            >
              Os nossos valores
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {valores.map((v, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-[#E8F0E6] p-6 text-center hover:-translate-y-1 transition-transform"
              >
                <span className="text-4xl mb-4 block">{v.icon}</span>
                <h3
                  style={serif}
                  className="text-xl font-semibold text-[#1A2E1A] mb-3"
                >
                  {v.titulo}
                </h3>
                <p className="text-xs text-[#5C6E5C] leading-relaxed">
                  {v.descricao}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Futuro — Loja Física */}
      <section className="py-20 px-8 bg-white">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="bg-[#E8F0E6] rounded-3xl h-72 flex flex-col items-center justify-center gap-3">
            <span className="text-7xl">🏪</span>
            <p
              style={serif}
              className="text-xl font-semibold text-[#3D6B4A] tracking-wide"
            >
              Em breve
            </p>
          </div>
          <div>
            <p className="text-xs tracking-[0.15em] uppercase text-[#6B9E63] mb-3">
              O que aí vem
            </p>
            <h2
              style={serif}
              className="text-4xl font-semibold text-[#1A2E1A] mb-6"
            >
              Uma loja física para te receber
            </h2>
            <div className="space-y-4 text-sm text-[#5C6E5C] leading-relaxed">
              <p>
                O futuro da Moda Chique passa também pela abertura de uma loja
                física, permitindo aproximar ainda mais a marca dos seus clientes
                e transformar a experiência online em algo ainda mais especial e
                presencial.
              </p>
              <p>
                Mais do que uma loja, queremos construir uma comunidade onde
                estilo, elegância e confiança caminham lado a lado.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Fundadora */}
      <section className="py-20 px-8 bg-[#F7F9F5]">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs tracking-[0.15em] uppercase text-[#6B9E63] mb-3">
            A pessoa por detrás da marca
          </p>
          <h2
            style={serif}
            className="text-4xl font-semibold text-[#1A2E1A] mb-12"
          >
            A fundadora
          </h2>
          <div className="flex flex-col items-center">
            <div className="w-28 h-28 rounded-full bg-[#E8F0E6] flex items-center justify-center mb-5 shadow-sm">
              <span
                style={serif}
                className="text-5xl font-semibold text-[#3D6B4A]"
              >
                L
              </span>
            </div>
            <h3
              style={serif}
              className="text-3xl font-semibold text-[#1A2E1A] mb-1"
            >
              Lili Ferreira
            </h3>
            <p className="text-xs tracking-widest uppercase text-[#6B9E63] mb-5">
              Fundadora &amp; Diretora Criativa
            </p>
            <p className="text-sm text-[#5C6E5C] leading-relaxed max-w-xl">
              Apaixonada por moda e por relações públicas, a Lili fundou a Moda
              Chique em 2023 com o sonho de criar uma marca que une elegância,
              proximidade e autenticidade — uma peça de cada vez.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#E8F0E6] py-16 px-8 text-center">
        <div className="max-w-xl mx-auto">
          <p className="text-xs tracking-[0.15em] uppercase text-[#6B9E63] mb-3">
            Faz parte da nossa comunidade
          </p>
          <h2
            style={serif}
            className="text-4xl font-semibold text-[#1A2E1A] mb-4"
          >
            Pronta para explorar?
          </h2>
          <p className="text-sm text-[#5C6E5C] mb-8 leading-relaxed">
            Descobre as nossas coleções e encontra as peças perfeitas para o teu
            estilo.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              to="/catalogo"
              onClick={() => window.scrollTo(0, 0)}
              className="bg-[#3D6B4A] text-white px-8 py-3.5 rounded-full text-xs tracking-widest uppercase hover:bg-[#2C5038] transition-colors"
            >
              Ver Coleção
            </Link>
            <Link
              to="/ajuda"
              onClick={() => window.scrollTo(0, 0)}
              className="border border-[#3D6B4A] text-[#3D6B4A] px-8 py-3.5 rounded-full text-xs tracking-widest uppercase hover:bg-[#3D6B4A] hover:text-white transition-all"
            >
              Contacta-nos
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
