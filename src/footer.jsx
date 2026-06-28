import { Link } from "react-router-dom";

export default function Footer() {
  const serif = { fontFamily: "'Cormorant Garamond', Georgia, serif" };
  const sans  = { fontFamily: "'Jost', sans-serif" };

  const lojaLinks = [
    { label: "Roupa",      path: "/catalogo?departamento=roupa"       },
    { label: "Calçado",    path: "/catalogo?departamento=calcado"     },
    { label: "Acessórios", path: "/catalogo?departamento=acessorios"  },
    { label: "Promoções",  path: "/promocoes"                         },
    { label: "Marcas",     path: "/marcas"                            },
  ];

  const ajudaLinks = [
    { label: "Como Comprar", path: "/ajuda?topico=comprar"    },
    { label: "Envios",       path: "/ajuda?topico=envios"     },
    { label: "Devoluções",   path: "/ajuda?topico=devolucoes" },
    { label: "FAQ",          path: "/ajuda?topico=faq"        },
    { label: "Contacto",     path: "/ajuda?topico=contacto"   },
  ];

  const pagamentos = [
    {
      label: "MBWay",
      badge: (
        <div className="h-7 px-2.5 rounded-md bg-white flex items-center justify-center">
          <span style={{ fontFamily: "sans-serif", fontWeight: 800, fontSize: 11, letterSpacing: "-0.5px" }}>
            <span style={{ color: "#E2001A" }}>MB</span>
            <span style={{ color: "#E2001A", marginLeft: 1 }}>WAY</span>
          </span>
        </div>
      ),
    },
    {
      label: "Visa",
      badge: (
        <div className="h-7 px-3 rounded-md bg-[#1A1F71] flex items-center justify-center">
          <span style={{ fontFamily: "serif", fontWeight: 900, fontStyle: "italic", fontSize: 13, color: "white", letterSpacing: "-0.5px" }}>
            VISA
          </span>
        </div>
      ),
    },
    {
      label: "Mastercard",
      badge: (
        <div className="h-7 px-2 rounded-md bg-white flex items-center gap-1.5">
          <svg width="28" height="18" viewBox="0 0 38 24">
            <circle cx="13" cy="12" r="11" fill="#EB001B"/>
            <circle cx="25" cy="12" r="11" fill="#F79E1B"/>
            <path d="M19 4.8a11 11 0 0 1 0 14.4A11 11 0 0 1 19 4.8z" fill="#FF5F00"/>
          </svg>
        </div>
      ),
    },
    {
      label: "Multibanco",
      badge: (
        <div className="h-7 px-2.5 rounded-md bg-[#007AC2] flex items-center justify-center">
          <span style={{ fontFamily: "sans-serif", fontWeight: 900, fontSize: 11, color: "white", letterSpacing: "0.5px" }}>
            MB
          </span>
        </div>
      ),
    },
  ];

  const redesSociais = [
    {
      label: "Instagram",
      href: "https://www.instagram.com/modachique.lilistore/",
      svg: (
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
          <circle cx="12" cy="12" r="4"/>
          <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
        </svg>
      ),
    },
    {
      label: "Facebook",
      href: "https://www.facebook.com/atuamodachique/",
      svg: (
        <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
        </svg>
      ),
    },
  ];

  return (
    <footer style={sans} className="bg-[#203020] text-[#C8DFC4]">

      {/* ── Corpo principal ── */}
      <div className="max-w-7xl mx-auto px-8 pt-14 pb-10 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Marca */}
        <div>
          <div style={serif} className="text-2xl font-semibold text-white mb-1">Moda Chique</div>
          <div className="text-xs tracking-[0.15em] uppercase text-[#6B9E63] mb-4">Lili Store</div>
          <div className="w-8 h-px bg-[#3D6B4A] mb-4" />
          <p className="text-sm leading-relaxed text-[#A8C4A8] mb-6">
            Moda feminina para quem valoriza o detalhe e a elegância do dia a dia.
          </p>

          {/* Redes sociais */}
          <div className="flex gap-2">
            {redesSociais.map(({ svg, href, label }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                className="w-8 h-8 rounded-lg bg-[#2C4A2C] hover:bg-[#3D6B4A] flex items-center justify-center transition-colors text-[#A8C4A8] hover:text-white">
                {svg}
              </a>
            ))}
          </div>
        </div>

        {/* Loja */}
        <div>
          <h4 className="text-xs tracking-[0.15em] uppercase text-white mb-5 font-semibold">Loja</h4>
          <ul className="space-y-3">
            {lojaLinks.map(({ label, path }) => (
              <li key={label}>
                <Link to={path} onClick={() => window.scrollTo(0, 0)}
                  className="text-sm text-[#A8C4A8] hover:text-white transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Ajuda */}
        <div>
          <h4 className="text-xs tracking-[0.15em] uppercase text-white mb-5 font-semibold">Ajuda</h4>
          <ul className="space-y-3">
            {ajudaLinks.map(({ label, path }) => (
              <li key={label}>
                <Link to={path} onClick={() => window.scrollTo(0, 0)}
                  className="text-sm text-[#A8C4A8] hover:text-white transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Empresa */}
        <div>
          <h4 className="text-xs tracking-[0.15em] uppercase text-white mb-5 font-semibold">Empresa</h4>
          <ul className="space-y-3">
            <li>
              <Link to="/sobre-nos" onClick={() => window.scrollTo(0, 0)}
                className="text-sm text-[#A8C4A8] hover:text-white transition-colors">
                Sobre Nós
              </Link>
            </li>
            <li>
              <a href="/Termos_Condicoes_ModaChique.pdf" target="_blank" rel="noopener noreferrer"
                className="text-sm text-[#A8C4A8] hover:text-white transition-colors">
                Termos e Condições Gerais
              </a>
            </li>
            <li>
              <a href="/Politica_Privacidade_ModaChique.pdf" target="_blank" rel="noopener noreferrer"
                className="text-sm text-[#A8C4A8] hover:text-white transition-colors">
                Política de Privacidade
              </a>
            </li>
          </ul>
        </div>

      </div>

      {/* ── Rodapé inferior ── */}
      <div className="border-t border-[#2C4A2C]">
        <div className="max-w-7xl mx-auto px-8 py-5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[#6B9E63]">© 2026 Moda Chique Lili Store. Todos os direitos reservados.</p>

          {/* Métodos de pagamento */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className="text-[10px] text-[#4A6A4A] uppercase tracking-widest mr-1">Pagamentos</span>
            {pagamentos.map(({ label, badge }) => (
              <div key={label} title={label}>
                {badge}
              </div>
            ))}
          </div>
        </div>
      </div>

    </footer>
  );
}
