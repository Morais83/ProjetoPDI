export default function Footer() {
  const serif = { fontFamily: "'Cormorant Garamond', Georgia, serif" };
  const sans = { fontFamily: "'Jost', sans-serif" };

  return (
    <footer style={sans} className="bg-[#1A2E1A] text-[#C8DFC4] py-12 px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <div style={serif} className="text-2xl font-semibold text-white mb-1">Moda Chique</div>
          <div className="text-xs tracking-[0.15em] uppercase text-[#6B9E63] mb-4">Lili Store</div>
          <p className="text-sm leading-relaxed text-[#A8C4A8]">Moda feminina para quem valoriza o detalhe e a elegância do dia a dia.</p>
        </div>
        {[
          { title: "Loja", links: ["Roupa", "Calçado", "Acessórios", "Promoções", "Marcas"] },
          { title: "Ajuda", links: ["Como Comprar", "Envios", "Devoluções", "FAQ", "Contacto"] },
          { title: "Empresa", links: ["Sobre Nós", "Políica de Privacidatde"] },
        ].map((col) => (
          <div key={col.title}>
            <h4 className="text-sm tracking-[0.12em] uppercase text-white mb-4 font-medium">{col.title}</h4>
            <ul className="space-y-2.5">
              {col.links.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-[#A8C4A8] hover:text-white transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
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