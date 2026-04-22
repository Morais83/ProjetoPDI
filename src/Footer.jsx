import { Link } from "react-router-dom";

export default function Footer() {
  const serif = { fontFamily: "'Cormorant Garamond', Georgia, serif" };
  const sans = { fontFamily: "'Jost', sans-serif" };

  const lojaLinks = [
    { label: "Roupa", path: "/catalogo" },
    { label: "Calçado", path: "/catalogo" },
    { label: "Acessórios", path: "/catalogo" },
    { label: "Promoções", path: "/catalogo" },
    { label: "Marcas", path: "/catalogo" },
  ];

  const ajudaLinks = [
    { label: "Como Comprar", path: "/ajuda" },
    { label: "Envios", path: "/ajuda" },
    { label: "Devoluções", path: "/ajuda" },
    { label: "FAQ", path: "/ajuda" },
    { label: "Contacto", path: "/ajuda" },
  ];

  const empresaLinks = [
    { label: "Sobre Nós", path: "/sobre-nos", externo: false },
    { label: "Política de Privacidade", path: "/politicaprivacidade.pdf", externo: true },
  ];

  return (
    <footer style={sans} className="bg-[#1A2E1A] text-[#C8DFC4] py-12 px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Marca */}
        <div>
          <div style={serif} className="text-2xl font-semibold text-white mb-1">Moda Chique</div>
          <div className="text-xs tracking-[0.15em] uppercase text-[#6B9E63] mb-4">Lili Store</div>
          <p className="text-sm leading-relaxed text-[#A8C4A8]">Moda feminina para quem valoriza o detalhe e a elegância do dia a dia.</p>
        </div>

        {/* Loja */}
        <div>
          <h4 className="text-sm tracking-[0.12em] uppercase text-white mb-4 font-medium">Loja</h4>
          <ul className="space-y-2.5">
            {lojaLinks.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.path}
                  onClick={() => window.scrollTo(0, 0)}
                  className="text-sm text-[#A8C4A8] hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Ajuda */}
        <div>
          <h4 className="text-sm tracking-[0.12em] uppercase text-white mb-4 font-medium">Ajuda</h4>
          <ul className="space-y-2.5">
            {ajudaLinks.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.path}
                  onClick={() => window.scrollTo(0, 0)}
                  className="text-sm text-[#A8C4A8] hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Empresa */}
        <div>
          <h4 className="text-sm tracking-[0.12em] uppercase text-white mb-4 font-medium">Empresa</h4>
          <ul className="space-y-2.5">
            <li>
              <Link to="/sobre-nos" onClick={() => window.scrollTo(0, 0)} className="text-sm text-[#A8C4A8] hover:text-white transition-colors">
                Sobre Nós
              </Link>
            </li>
            <li>
              <a href="/politicaprivacidade.pdf" target="_blank" rel="noopener noreferrer" className="text-sm text-[#A8C4A8] hover:text-white transition-colors">
                Política de Privacidade
              </a>
            </li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-[#2C4A2C] flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm text-[#A8C4A8]">© 2026 Moda Chique Lili Store. Todos os direitos reservados.</p>
        <div className="flex gap-2">
          {["PayPal", "MBWay", "Visa", "Mastercard", "Cobrança"].map((p) => (
            <span key={p} className="bg-[#1A2E1A] border border-[#3D6B4A] px-3 py-1 rounded-md text-sm text-[#A8C4A8]">{p}</span>
          ))}
        </div>
      </div>
    </footer>
  );
}