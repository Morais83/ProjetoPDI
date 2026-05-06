import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "./navbar";
import Footer from "./footer";

const serif = { fontFamily: "'Cormorant Garamond', Georgia, serif" };
const sans = { fontFamily: "'Jost', sans-serif" };

export default function ConfirmacaoPage() {
  const { id } = useParams();
  const [encomenda, setEncomenda] = useState(null);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Jost:wght@300;400;500&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    const token = localStorage.getItem('token');
    fetch(`http://localhost:5000/api/encomendas/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(dados => setEncomenda(dados))
      .catch(console.error);
  }, [id]);

  return (
    <div style={sans} className="min-h-screen bg-[#F7F9F5] text-[#2C2C2C]">
      <div className="bg-[#3D6B4A] text-white text-center py-2 text-xs tracking-widest">
        ✦ Envio gratuito em compras acima de 50€ &nbsp;|&nbsp; Nova coleção Primavera-Verão disponível ✦
      </div>
      <Navbar />

      <div className="max-w-2xl mx-auto px-8 py-16 text-center">
        <div className="text-6xl mb-6">🎉</div>
        <h1 style={serif} className="text-4xl font-semibold text-[#1A2E1A] mb-3">Encomenda Confirmada!</h1>
        <p className="text-sm text-[#5C6E5C] mb-2">Obrigada pela tua compra.</p>
        <p className="text-sm text-[#8FAF8A] mb-8">
          Encomenda <span className="text-[#3D6B4A] font-medium">#{String(id).padStart(4, '0')}</span> recebida com sucesso!
        </p>

        {encomenda && (
          <div className="bg-white rounded-2xl border border-[#E8F0E6] p-6 text-left mb-8">
            <h2 style={serif} className="text-xl font-semibold text-[#1A2E1A] mb-4">Detalhes da Encomenda</h2>
            <div className="space-y-2 mb-4">
              {encomenda.linhas?.map((l, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-[#5C6E5C]">{l.nome_produto} — {l.tamanho} / {l.cor} × {l.quantidade}</span>
                  <span className="text-[#3D6B4A] font-medium">{parseFloat(l.preco_unitario).toFixed(2)}€</span>
                </div>
              ))}
            </div>
            <div className="border-t border-[#E8F0E6] pt-3 flex justify-between">
              <span className="text-sm font-medium text-[#2C3A2C]">Total pago</span>
              <span style={serif} className="text-xl font-semibold text-[#1A2E1A]">{parseFloat(encomenda.total_pago).toFixed(2)}€</span>
            </div>
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <Link to="/perfil"
            className="bg-[#3D6B4A] text-white px-8 py-3.5 rounded-full text-xs tracking-widest uppercase hover:bg-[#2C5038] transition-colors"
            onClick={() => window.scrollTo(0, 0)}>
            Ver Meus Pedidos
          </Link>
          <Link to="/catalogo"
            className="border border-[#3D6B4A] text-[#3D6B4A] px-8 py-3.5 rounded-full text-xs tracking-widest uppercase hover:bg-[#3D6B4A] hover:text-white transition-all"
            onClick={() => window.scrollTo(0, 0)}>
            Continuar a Comprar
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}