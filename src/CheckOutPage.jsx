import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { getCarrinho, limparCarrinho } from './cart';
import { criarEncomenda } from './api';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const serif = { fontFamily: "'Cormorant Garamond', Georgia, serif" };
const sans  = { fontFamily: "'Jost', sans-serif" };

const cardElementOptions = {
  hidePostalCode: true,
  style: {
    base: {
      fontSize: '14px',
      color: '#2C3A2C',
      fontFamily: "'Jost', sans-serif",
      fontSmoothing: 'antialiased',
      '::placeholder': { color: '#A8C4A8' },
    },
    invalid: { color: '#C0392B', iconColor: '#C0392B' },
  },
};

function CheckoutInner() {
  const stripe   = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [carrinho, setCarrinho]                   = useState([]);
  const [moradas, setMoradas]                     = useState([]);
  const [moradaSelecionada, setMoradaSelecionada] = useState(null);
  const [metodoPagamento, setMetodoPagamento]     = useState("mbway");
  const [novaRua, setNovaRua]                     = useState("");
  const [novaCidade, setNovaCidade]               = useState("");
  const [novoCp, setNovoCp]                       = useState("");
  const [usarNovaMorada, setUsarNovaMorada]       = useState(false);
  const [loading, setLoading]                     = useState(false);
  const [erro, setErro]                           = useState("");
  const [tipoEntrega, setTipoEntrega]             = useState("morada");
  const [telefoneMbway, setTelefoneMbway]         = useState("");
  const [prefixoMbway, setPrefixoMbway]           = useState("+351");

  const metodosPagamentoDisponiveis = [
    { id: "mbway",         label: "MBWay" },
    { id: "cartao",        label: "Cartão de Crédito/Débito" },
    ...(tipoEntrega === "morada" ? [{ id: "cobranca",      label: "Cobrança" }] : []),
    ...(tipoEntrega === "loja"   ? [{ id: "pagamento_loja",label: "Pagamento na Loja" }] : []),
  ];

  const token = localStorage.getItem('token');

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Jost:wght@300;400;500&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    setCarrinho(getCarrinho());
    if (token) carregarMoradas();
    else navigate('/login');
  }, []);

  const carregarMoradas = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/utilizadores/me/moradas`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const dados = await res.json();
      setMoradas(Array.isArray(dados) ? dados : []);
      const predefinida = dados.find?.(m => m.predefinida);
      if (predefinida) setMoradaSelecionada(predefinida.id_morada);
    } catch (err) {
      console.error(err);
    }
  };

  const subtotal     = carrinho.reduce((acc, p) => acc + p.preco * p.quantidade, 0);
  const envioGratis  = subtotal >= 50;
  const portes       = tipoEntrega === "loja" ? 0 : (envioGratis ? 0 : 3.99);
  const taxaCobranca = metodoPagamento === "cobranca" ? 1.50 : 0;
  const total        = subtotal + portes + taxaCobranca;

  const finalizarEncomenda = async () => {
    setErro("");

    if (tipoEntrega === "morada") {
      if (!moradaSelecionada && !usarNovaMorada) { setErro("Seleciona uma morada de entrega."); return; }
      if (usarNovaMorada && (!novaRua || !novaCidade || !novoCp)) { setErro("Preenche todos os campos da morada."); return; }
    }
    if (carrinho.length === 0) { setErro("O carrinho está vazio."); return; }
    if (metodoPagamento === "cartao" && (!stripe || !elements)) { setErro("O sistema de pagamento ainda está a carregar."); return; }

    setLoading(true);

    try {
      // Criar morada nova se necessário
      let idMorada = moradaSelecionada;
      if (tipoEntrega === "morada" && usarNovaMorada) {
        const resMorada = await fetch(`${import.meta.env.VITE_API_URL}/api/utilizadores/me/moradas`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ rua: novaRua, cidade: novaCidade, codigo_postal: novoCp, pais: 'Portugal', predefinida: false }),
        });
        const dadosMorada = await resMorada.json();
        idMorada = dadosMorada.id;
      }

      // Pagamento com cartão via Stripe
      if (metodoPagamento === "cartao") {
        const resPI = await fetch(`${import.meta.env.VITE_API_URL}/api/pagamentos/criar-intencao`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ total: Math.round(total * 100) }),
        });
        const { clientSecret, erro: erroPI } = await resPI.json();

        if (erroPI) { setErro(erroPI); setLoading(false); return; }

        // Obter código postal da morada selecionada ou da nova morada
        const moradaAtual = moradas.find(m => m.id_morada === moradaSelecionada);
        const codigoPostal = usarNovaMorada ? novoCp : (moradaAtual?.codigo_postal || "");

        const resultado = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              address: { postal_code: codigoPostal },
            },
          },
        });

        if (resultado.error) {
          setErro(resultado.error.message);
          setLoading(false);
          return;
        }
      }

      // Criar encomenda na base de dados
      const resultadoEncomenda = await criarEncomenda({
        id_morada:         tipoEntrega === "loja" ? null : idMorada,
        metodo_pagamento:  metodoPagamento,
        portes_envio:      portes,
        taxa_cobranca:     taxaCobranca,
        itens: carrinho.map(p => ({ id_variante: p.id_variante, quantidade: p.quantidade, preco: p.preco })),
      });

      if (resultadoEncomenda.erro) { setErro(resultadoEncomenda.erro); setLoading(false); return; }

      limparCarrinho();
      window.dispatchEvent(new Event('carrinho-atualizado'));
      navigate(`/confirmacao/${resultadoEncomenda.id_encomenda}`);

    } catch (err) {
      console.error(err);
      setErro("Erro ao processar encomenda. Tenta novamente.");
      setLoading(false);
    }
  };

  return (
    <div style={sans} className="min-h-screen bg-[#F7F9F5] text-[#2C2C2C]">
      <div className="bg-[#3D6B4A] text-white text-center py-2 text-xs tracking-widest">
        ✦ Envio gratuito em compras acima de 50€ &nbsp;|&nbsp; Nova coleção Primavera-Verão disponível ✦
      </div>
      <Navbar />

      <div className="max-w-7xl mx-auto px-8 py-10">
        <div className="flex items-center gap-2 text-xs text-[#8FAF8A] mb-8">
          <Link to="/" className="hover:text-[#3D6B4A] transition-colors">Início</Link>
          <span>/</span>
          <Link to="/carrinho" className="hover:text-[#3D6B4A] transition-colors">Carrinho</Link>
          <span>/</span>
          <span className="text-[#3D6B4A]">Checkout</span>
        </div>

        <h1 style={serif} className="text-4xl font-semibold text-[#1A2E1A] mb-8">Finalizar Encomenda</h1>

        <div className="grid md:grid-cols-3 gap-8 items-start">

          {/* Lado esquerdo */}
          <div className="md:col-span-2 space-y-6">

            {/* Tipo de Entrega */}
            <div className="bg-white rounded-2xl border border-[#E8F0E6] p-6">
              <h2 style={serif} className="text-2xl font-semibold text-[#1A2E1A] mb-4">Tipo de Entrega</h2>
              <div className="grid grid-cols-2 gap-3 mb-6">
                <label className={`flex items-center gap-3 border rounded-xl p-4 cursor-pointer transition-all ${tipoEntrega === "morada" ? "border-[#3D6B4A] bg-[#F0F5EE]" : "border-[#E8F0E6] hover:border-[#C8DFC4]"}`}>
                  <input type="radio" name="entrega" checked={tipoEntrega === "morada"}
                    onChange={() => { setTipoEntrega("morada"); if (metodoPagamento === "pagamento_loja") setMetodoPagamento("mbway"); }}
                    className="accent-[#3D6B4A]" />
                  <div>
                    <p className="text-sm font-medium text-[#2C3A2C]">🚚 Entrega em morada</p>
                    <p className="text-xs text-[#8FAF8A]">Recebe em casa</p>
                  </div>
                </label>
                <label className={`flex items-center gap-3 border rounded-xl p-4 cursor-pointer transition-all ${tipoEntrega === "loja" ? "border-[#3D6B4A] bg-[#F0F5EE]" : "border-[#E8F0E6] hover:border-[#C8DFC4]"}`}>
                  <input type="radio" name="entrega" checked={tipoEntrega === "loja"}
                    onChange={() => { setTipoEntrega("loja"); if (metodoPagamento === "cobranca") setMetodoPagamento("pagamento_loja"); }}
                    className="accent-[#3D6B4A]" />
                  <div>
                    <p className="text-sm font-medium text-[#2C3A2C]">🏪 Levantamento na loja</p>
                    <p className="text-xs text-[#8FAF8A]">Grátis · Pronto em 24h</p>
                  </div>
                </label>
              </div>

              {tipoEntrega === "morada" && (
                <>
                  {moradas.length > 0 && (
                    <div className="space-y-3 mb-4">
                      {moradas.map(m => (
                        <label key={m.id_morada} className={`flex items-start gap-3 border rounded-xl p-4 cursor-pointer transition-all ${moradaSelecionada === m.id_morada && !usarNovaMorada ? "border-[#3D6B4A] bg-[#F0F5EE]" : "border-[#E8F0E6] hover:border-[#C8DFC4]"}`}>
                          <input type="radio" name="morada" checked={moradaSelecionada === m.id_morada && !usarNovaMorada}
                            onChange={() => { setMoradaSelecionada(m.id_morada); setUsarNovaMorada(false); }}
                            className="mt-1 accent-[#3D6B4A]" />
                          <div>
                            <p className="text-sm font-medium text-[#2C3A2C]">{m.rua}</p>
                            <p className="text-xs text-[#8FAF8A]">{m.codigo_postal} {m.cidade} · {m.pais}</p>
                            {m.predefinida ? <span className="text-[10px] bg-[#E8F0E6] text-[#3D6B4A] px-2 py-0.5 rounded-full">Principal</span> : null}
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                  <label className={`flex items-center gap-3 border rounded-xl p-4 cursor-pointer transition-all mb-4 ${usarNovaMorada ? "border-[#3D6B4A] bg-[#F0F5EE]" : "border-[#E8F0E6] hover:border-[#C8DFC4]"}`}>
                    <input type="radio" name="morada" checked={usarNovaMorada}
                      onChange={() => { setUsarNovaMorada(true); setMoradaSelecionada(null); }}
                      className="accent-[#3D6B4A]" />
                    <span className="text-sm text-[#2C3A2C]">+ Usar nova morada</span>
                  </label>
                  {usarNovaMorada && (
                    <div className="grid grid-cols-2 gap-4 ml-7">
                      <div className="col-span-2">
                        <label className="block text-[11px] tracking-widest uppercase text-[#6B9E63] mb-1">Rua</label>
                        <input type="text" value={novaRua} onChange={e => setNovaRua(e.target.value)} placeholder="Rua das Flores, 12"
                          className="w-full border-b border-[#C8DFC4] py-2 text-sm outline-none focus:border-[#3D6B4A] bg-transparent" />
                      </div>
                      <div>
                        <label className="block text-[11px] tracking-widest uppercase text-[#6B9E63] mb-1">Cidade</label>
                        <input type="text" value={novaCidade} onChange={e => setNovaCidade(e.target.value)} placeholder="Porto"
                          className="w-full border-b border-[#C8DFC4] py-2 text-sm outline-none focus:border-[#3D6B4A] bg-transparent" />
                      </div>
                      <div>
                        <label className="block text-[11px] tracking-widest uppercase text-[#6B9E63] mb-1">Código Postal</label>
                        <input type="text" value={novoCp} onChange={e => setNovoCp(e.target.value)} placeholder="4000-001"
                          className="w-full border-b border-[#C8DFC4] py-2 text-sm outline-none focus:border-[#3D6B4A] bg-transparent" />
                      </div>
                    </div>
                  )}
                </>
              )}

              {tipoEntrega === "loja" && (
                <div className="border border-[#E8F0E6] rounded-xl overflow-hidden">
                  <div className="p-4 bg-[#F7F9F5]">
                    <p className="text-sm font-medium text-[#2C3A2C] mb-1">🏪 Moda Chique — Lili Store</p>
                    <p className="text-xs text-[#8FAF8A] mb-1">Rua das Flores, 123 · 4000-001 Porto</p>
                    <p className="text-xs text-[#8FAF8A] mb-1">📞 +351 210 000 000</p>
                    <p className="text-xs text-[#6B9E63]">⏰ Seg–Sáb: 10h–19h</p>
                  </div>
                  <iframe
                    title="Localização da Loja"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2724.5986919066804!2d-8.487915324486078!3d41.00819781943056!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd247fd54c6ce4b9%3A0x9598d73ce6470d40!2sAv.%20Igreja%2020%2C%204525-482%20Vila%20Maior!5e1!3m2!1spt-PT!2spt!4v1778162046560!5m2!1spt-PT!2spt"
                    width="100%" height="220" style={{ border: 0 }} allowFullScreen="" loading="lazy"
                  />
                </div>
              )}
            </div>

            {/* Método de Pagamento */}
            <div className="bg-white rounded-2xl border border-[#E8F0E6] p-6">
              <h2 style={serif} className="text-2xl font-semibold text-[#1A2E1A] mb-4">Método de Pagamento</h2>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {metodosPagamentoDisponiveis.map(m => (
                  <label key={m.id} className={`flex items-center gap-3 border rounded-xl p-4 cursor-pointer transition-all ${metodoPagamento === m.id ? "border-[#3D6B4A] bg-[#F0F5EE]" : "border-[#E8F0E6] hover:border-[#C8DFC4]"}`}>
                    <input type="radio" name="pagamento" checked={metodoPagamento === m.id}
                      onChange={() => setMetodoPagamento(m.id)} className="accent-[#3D6B4A]" />
                    <span className="text-sm text-[#2C3A2C]">{m.label}</span>
                  </label>
                ))}
              </div>

              {metodoPagamento === "mbway" && (
                <div className="border border-[#E8F0E6] rounded-xl p-4 bg-[#F7F9F5]">
                  <p className="text-xs text-[#6B9E63] tracking-widest uppercase mb-3 font-medium">Número de Telemóvel</p>
                  <div className="flex gap-3">
                    <select value={prefixoMbway} onChange={e => setPrefixoMbway(e.target.value)}
                      className="border-b border-[#C8DFC4] py-2 text-sm outline-none focus:border-[#3D6B4A] bg-transparent">
                      {["+351","+34","+33","+44","+49","+55","+352","+39"].map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                    <input type="tel" value={telefoneMbway} onChange={e => setTelefoneMbway(e.target.value)}
                      placeholder="912 345 678"
                      className="flex-1 border-b border-[#C8DFC4] py-2 text-sm outline-none focus:border-[#3D6B4A] bg-transparent placeholder:text-gray-300" />
                  </div>
                  <p className="text-xs text-[#8FAF8A] mt-2">Receberás uma notificação no teu telemóvel para confirmar o pagamento.</p>
                </div>
              )}

              {metodoPagamento === "cartao" && (
                <div className="border border-[#E8F0E6] rounded-xl p-4 bg-[#F7F9F5] space-y-4">
                  <p className="text-xs text-[#6B9E63] tracking-widest uppercase font-medium">Dados do Cartão</p>
                  <div className="border-b border-[#C8DFC4] py-2">
                    <CardElement options={cardElementOptions} />
                  </div>
                  <p className="text-xs text-[#8FAF8A] flex items-center gap-1.5">
                    <span>🔒</span> Pagamento processado de forma segura pela Stripe. Os teus dados nunca passam pelos nossos servidores.
                  </p>
                </div>
              )}

              {metodoPagamento === "cobranca" && (
                <div className="border border-[#E8F0E6] rounded-xl p-4 bg-[#F7F9F5]">
                  <p className="text-sm text-[#5C6E5C]">O pagamento é efectuado no momento da entrega. Aceitamos dinheiro e multibanco.</p>
                  <p className="text-xs text-[#8FAF8A] mt-2">⚠️ Taxa adicional de 1,50€ para pagamento na entrega.</p>
                </div>
              )}

              {metodoPagamento === "pagamento_loja" && (
                <div className="border border-[#E8F0E6] rounded-xl p-4 bg-[#F7F9F5]">
                  <p className="text-sm text-[#5C6E5C]">O pagamento é efetuado presencialmente no balcão da nossa loja no momento do levantamento.</p>
                  <p className="text-xs text-[#8FAF8A] mt-2">✔️ Sem taxas adicionais. Aceitamos dinheiro, multibanco e MBWay na loja.</p>
                </div>
              )}
            </div>

          </div>

          {/* Lado direito — Resumo */}
          <div className="bg-white rounded-2xl border border-[#E8F0E6] p-6 sticky top-24">
            <h2 style={serif} className="text-2xl font-semibold text-[#1A2E1A] mb-6">Resumo</h2>

            <div className="space-y-3 mb-6 pb-6 border-b border-[#E8F0E6]">
              {carrinho.map(p => (
                <div key={p.id_variante} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#F0F5EE] flex-shrink-0">
                    {p.imagem_url
                      ? <img src={p.imagem_url} alt={p.nome_produto} className="w-full h-full object-cover" />
                      : <span className="w-full h-full flex items-center justify-center text-xl text-[#C8DFC4]">📷</span>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-[#2C3A2C] truncate">{p.nome_produto}</p>
                    <p className="text-[10px] text-[#8FAF8A]">{p.tamanho} · {p.cor} · Qtd: {p.quantidade}</p>
                  </div>
                  <p className="text-xs font-semibold text-[#3D6B4A] flex-shrink-0">{(p.preco * p.quantidade).toFixed(2).replace('.', ',')}€</p>
                </div>
              ))}
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-[#5C6E5C]">Subtotal</span>
                <span className="text-[#2C3A2C]">{subtotal.toFixed(2).replace('.', ',')}€</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#5C6E5C]">Portes</span>
                <span className={portes === 0 ? "text-[#3D6B4A] font-medium" : "text-[#2C3A2C]"}>
                  {portes === 0 ? "GRÁTIS" : `${portes.toFixed(2).replace('.', ',')}€`}
                </span>
              </div>
              {taxaCobranca > 0 && (
                <div className="flex justify-between text-sm text-[#A67C00]">
                  <span className="flex items-center gap-1">
                    Taxa de Cobrança
                    <span className="group relative cursor-help text-[10px] bg-[#FEF9E7] border border-[#F1C40F] rounded-full w-4 h-4 flex items-center justify-center">?
                      <span className="absolute bottom-full mb-2 right-0 md:left-1/2 md:-translate-x-1/2 w-48 bg-[#2C3A2C] text-white text-[10px] p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 text-center">
                        Taxa administrativa aplicada a pagamentos efetuados na altura da entrega.
                      </span>
                    </span>
                  </span>
                  <span>+ {taxaCobranca.toFixed(2).replace('.', ',')}€</span>
                </div>
              )}
            </div>

            <div className="border-t border-[#E8F0E6] pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-[#2C3A2C]">Total</span>
                <span style={serif} className="text-2xl font-semibold text-[#1A2E1A]">
                  {total.toFixed(2).replace('.', ',')}€
                </span>
              </div>
            </div>

            {erro && <p className="text-xs text-red-500 mb-4">{erro}</p>}

            <button onClick={finalizarEncomenda} disabled={loading || (metodoPagamento === "cartao" && !stripe)}
              className={`w-full py-4 rounded-full text-xs tracking-widest uppercase font-medium transition-all shadow-lg flex items-center justify-center gap-2 ${loading ? "bg-[#6B9E63] text-white cursor-not-allowed opacity-80" : "bg-[#3D6B4A] text-white hover:bg-[#2C5038] shadow-green-900/10"}`}>
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  A processar pagamento...
                </>
              ) : (
                "Confirmar Encomenda"
              )}
            </button>

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
      </div>
      <Footer />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutInner />
    </Elements>
  );
}
