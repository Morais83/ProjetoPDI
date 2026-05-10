import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "./footer";
import Navbar from "./navbar";
import { getCarrinho, limparCarrinho } from './cart';
import { criarEncomenda } from './api';

const serif = { fontFamily: "'Cormorant Garamond', Georgia, serif" };
const sans = { fontFamily: "'Jost', sans-serif" };

const metodosPagamentoNormal = [
  { id: "mbway",    label: "MBWay" },
  { id: "paypal",   label: "PayPal" },
  { id: "cartao",   label: "Cartão de Crédito/Débito" },
  { id: "cobranca", label: "Cobrança" },
];

const MAPS_URL = "https://www.google.com/maps?q=41.008160,-8.485482";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [carrinho, setCarrinho]               = useState([]);
  const [moradas, setMoradas]                 = useState([]);
  const [moradaSelecionada, setMoradaSelecionada] = useState(null);
  const [metodoPagamento, setMetodoPagamento] = useState("mbway");
  const [novaRua, setNovaRua]                 = useState("");
  const [novaCidade, setNovaCidade]           = useState("");
  const [novoCp, setNovoCp]                   = useState("");
  const [usarNovaMorada, setUsarNovaMorada]   = useState(false);
  const [levantamentoLoja, setLevantamentoLoja] = useState(false);
  const [loading, setLoading]                 = useState(false);
  const [erro, setErro]                       = useState("");

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

  // Quando o tipo de entrega muda, ajusta automaticamente o método de pagamento
  useEffect(() => {
    if (levantamentoLoja) {
      setMetodoPagamento("loja");
    } else {
      setMetodoPagamento("mbway");
    }
  }, [levantamentoLoja]);

  const carregarMoradas = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/utilizadores/me/moradas', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const dados = await res.json();
      setMoradas(dados);
      const predefinida = dados.find(m => m.predefinida);
      if (predefinida) setMoradaSelecionada(predefinida.id_morada);
    } catch (err) {
      console.error(err);
    }
  };

  const subtotal   = carrinho.reduce((acc, p) => acc + p.preco * p.quantidade, 0);
  const envioGratis = subtotal >= 50;
  // Levantamento na loja = sempre 0€ de portes
  const portes     = levantamentoLoja ? 0 : (envioGratis ? 0 : 3.99);
  const total      = subtotal + portes;

  const selecionarEnvioNormal = () => {
    setLevantamentoLoja(false);
  };

  const selecionarLevantamento = () => {
    setLevantamentoLoja(true);
    // Limpa seleção de morada para não confundir a validação
    setUsarNovaMorada(false);
  };

  const finalizarEncomenda = async () => {
    setErro("");

    // Validações de morada apenas se não for levantamento
    if (!levantamentoLoja) {
      if (!moradaSelecionada && !usarNovaMorada) { setErro("Seleciona uma morada de entrega."); return; }
      if (usarNovaMorada && (!novaRua || !novaCidade || !novoCp)) { setErro("Preenche todos os campos da morada."); return; }
    }
    if (carrinho.length === 0) { setErro("O carrinho está vazio."); return; }

    setLoading(true);
    try {
      let idMorada = levantamentoLoja ? null : moradaSelecionada;

      if (!levantamentoLoja && usarNovaMorada) {
        const resMorada = await fetch('http://localhost:5000/api/utilizadores/me/moradas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ rua: novaRua, cidade: novaCidade, codigo_postal: novoCp, pais: 'Portugal', predefinida: false }),
        });
        const dadosMorada = await resMorada.json();
        idMorada = dadosMorada.id;
      }

      const resultado = await criarEncomenda({
        id_morada: idMorada,
        metodo_pagamento: metodoPagamento,
        portes_envio: portes,
        tipo_entrega: levantamentoLoja ? 'levantamento' : 'envio',
        itens: carrinho.map(p => ({ id_variante: p.id_variante, quantidade: p.quantidade, preco: p.preco })),
      });

      if (resultado.erro) { setErro(resultado.erro); setLoading(false); return; }
      limparCarrinho();
      window.dispatchEvent(new Event('carrinho-atualizado'));
      navigate(`/confirmacao/${resultado.id_encomenda}`);
    } catch (err) {
      console.error(err);
      setErro("Erro ao processar encomenda. Tenta novamente.");
    }
    setLoading(false);
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

            {/* ── Tipo de Entrega ── */}
            <div className="bg-white rounded-2xl border border-[#E8F0E6] p-6">
              <h2 style={serif} className="text-2xl font-semibold text-[#1A2E1A] mb-4">Tipo de Entrega</h2>

              <div className="space-y-3">

                {/* Opção — Envio para morada */}
                <label
                  className={`flex items-start gap-3 border rounded-xl p-4 cursor-pointer transition-all ${
                    !levantamentoLoja
                      ? "border-[#3D6B4A] bg-[#F0F5EE]"
                      : "border-[#E8F0E6] hover:border-[#C8DFC4]"
                  }`}
                >
                  <input
                    type="radio"
                    name="tipoEntrega"
                    checked={!levantamentoLoja}
                    onChange={selecionarEnvioNormal}
                    className="mt-1 accent-[#3D6B4A]"
                  />
                  <div>
                    <p className="text-sm font-medium text-[#2C3A2C]">🚚 Envio para Morada</p>
                    <p className="text-xs text-[#8FAF8A] mt-0.5">
                      {envioGratis ? "Envio gratuito incluído" : "3,99€ · Gratuito em compras acima de 50€"}
                    </p>
                  </div>
                </label>

                {/* Opção — Levantamento na Loja */}
                <label
                  className={`flex items-start gap-3 border rounded-xl p-4 cursor-pointer transition-all ${
                    levantamentoLoja
                      ? "border-[#3D6B4A] bg-[#F0F5EE]"
                      : "border-[#E8F0E6] hover:border-[#C8DFC4]"
                  }`}
                >
                  <input
                    type="radio"
                    name="tipoEntrega"
                    checked={levantamentoLoja}
                    onChange={selecionarLevantamento}
                    className="mt-1 accent-[#3D6B4A]"
                  />
                  <div>
                    <p className="text-sm font-medium text-[#2C3A2C]">🏪 Levantamento na Loja</p>
                    <p className="text-xs text-[#8FAF8A] mt-0.5">Levante gratuitamente a sua encomenda na nossa loja.</p>
                  </div>
                </label>

                {/* Info da loja — aparece apenas quando levantamento está selecionado */}
                {levantamentoLoja && (
                  <div className="ml-7 mt-1 border border-[#C8DFC4] bg-[#F0F5EE] rounded-xl p-4 space-y-3">
                    <div className="flex items-start gap-2">
                      <span className="text-base mt-0.5">📍</span>
                      <div>
                        <p className="text-xs font-medium text-[#2C3A2C] mb-0.5">Localização da Loja</p>
                        <p className="text-xs text-[#5C6E5C] leading-relaxed">
                          Moda Chique · Lili Store<br />
                          Coordenadas: 41.008160, -8.485482
                        </p>
                      </div>
                    </div>
                    <a
                      href={MAPS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-[#3D6B4A] font-medium border border-[#3D6B4A] rounded-full px-4 py-1.5 hover:bg-[#3D6B4A] hover:text-white transition-all"
                    >
                      <span>🗺️</span>
                      Ver localização no Google Maps
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* ── Morada de Entrega — apenas para envio normal ── */}
            {!levantamentoLoja && (
              <div className="bg-white rounded-2xl border border-[#E8F0E6] p-6">
                <h2 style={serif} className="text-2xl font-semibold text-[#1A2E1A] mb-4">Morada de Entrega</h2>
                {moradas.length > 0 && (
                  <div className="space-y-3 mb-4">
                    {moradas.map(m => (
                      <label
                        key={m.id_morada}
                        className={`flex items-start gap-3 border rounded-xl p-4 cursor-pointer transition-all ${
                          moradaSelecionada === m.id_morada && !usarNovaMorada
                            ? "border-[#3D6B4A] bg-[#F0F5EE]"
                            : "border-[#E8F0E6] hover:border-[#C8DFC4]"
                        }`}
                      >
                        <input
                          type="radio"
                          name="morada"
                          checked={moradaSelecionada === m.id_morada && !usarNovaMorada}
                          onChange={() => { setMoradaSelecionada(m.id_morada); setUsarNovaMorada(false); }}
                          className="mt-1 accent-[#3D6B4A]"
                        />
                        <div>
                          <p className="text-sm font-medium text-[#2C3A2C]">{m.rua}</p>
                          <p className="text-xs text-[#8FAF8A]">{m.codigo_postal} {m.cidade} · {m.pais}</p>
                          {m.predefinida && (
                            <span className="text-[10px] bg-[#E8F0E6] text-[#3D6B4A] px-2 py-0.5 rounded-full">Principal</span>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                )}
                <label
                  className={`flex items-center gap-3 border rounded-xl p-4 cursor-pointer transition-all mb-4 ${
                    usarNovaMorada ? "border-[#3D6B4A] bg-[#F0F5EE]" : "border-[#E8F0E6] hover:border-[#C8DFC4]"
                  }`}
                >
                  <input
                    type="radio"
                    name="morada"
                    checked={usarNovaMorada}
                    onChange={() => { setUsarNovaMorada(true); setMoradaSelecionada(null); }}
                    className="accent-[#3D6B4A]"
                  />
                  <span className="text-sm text-[#2C3A2C]">+ Usar nova morada</span>
                </label>
                {usarNovaMorada && (
                  <div className="grid grid-cols-2 gap-4 ml-7">
                    <div className="col-span-2">
                      <label className="block text-[11px] tracking-widest uppercase text-[#6B9E63] mb-1">Rua</label>
                      <input
                        type="text"
                        value={novaRua}
                        onChange={e => setNovaRua(e.target.value)}
                        placeholder="Rua das Flores, 12"
                        className="w-full border-b border-[#C8DFC4] py-2 text-sm outline-none focus:border-[#3D6B4A] bg-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] tracking-widest uppercase text-[#6B9E63] mb-1">Cidade</label>
                      <input
                        type="text"
                        value={novaCidade}
                        onChange={e => setNovaCidade(e.target.value)}
                        placeholder="Porto"
                        className="w-full border-b border-[#C8DFC4] py-2 text-sm outline-none focus:border-[#3D6B4A] bg-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] tracking-widest uppercase text-[#6B9E63] mb-1">Código Postal</label>
                      <input
                        type="text"
                        value={novoCp}
                        onChange={e => setNovoCp(e.target.value)}
                        placeholder="4000-001"
                        className="w-full border-b border-[#C8DFC4] py-2 text-sm outline-none focus:border-[#3D6B4A] bg-transparent"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── Método de Pagamento ── */}
            <div className="bg-white rounded-2xl border border-[#E8F0E6] p-6">
              <h2 style={serif} className="text-2xl font-semibold text-[#1A2E1A] mb-4">Método de Pagamento</h2>

              {levantamentoLoja ? (
                /* Levantamento — apenas pagamento na loja */
                <label className="flex items-center gap-3 border border-[#3D6B4A] bg-[#F0F5EE] rounded-xl p-4">
                  <input
                    type="radio"
                    name="pagamento"
                    checked
                    readOnly
                    className="accent-[#3D6B4A]"
                  />
                  <div>
                    <p className="text-sm font-medium text-[#2C3A2C]">🏪 Pagamento na Loja</p>
                    <p className="text-xs text-[#8FAF8A] mt-0.5">Pague no momento do levantamento.</p>
                  </div>
                </label>
              ) : (
                /* Envio normal — todos os métodos */
                <div className="grid grid-cols-2 gap-3">
                  {metodosPagamentoNormal.map(m => (
                    <label
                      key={m.id}
                      className={`flex items-center gap-3 border rounded-xl p-4 cursor-pointer transition-all ${
                        metodoPagamento === m.id
                          ? "border-[#3D6B4A] bg-[#F0F5EE]"
                          : "border-[#E8F0E6] hover:border-[#C8DFC4]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="pagamento"
                        checked={metodoPagamento === m.id}
                        onChange={() => setMetodoPagamento(m.id)}
                        className="accent-[#3D6B4A]"
                      />
                      <span className="text-sm text-[#2C3A2C]">{m.label}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* ── Lado direito — Resumo ── */}
          <div className="bg-white rounded-2xl border border-[#E8F0E6] p-6 sticky top-24">
            <h2 style={serif} className="text-2xl font-semibold text-[#1A2E1A] mb-6">Resumo</h2>

            {/* Produtos */}
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
                  <p className="text-xs font-semibold text-[#3D6B4A] flex-shrink-0">
                    {(p.preco * p.quantidade).toFixed(2).replace('.', ',')}€
                  </p>
                </div>
              ))}
            </div>

            {/* Totais */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-[#5C6E5C]">Subtotal</span>
                <span className="text-[#2C3A2C]">{subtotal.toFixed(2).replace('.', ',')}€</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#5C6E5C]">Portes</span>
                {levantamentoLoja ? (
                  <span className="text-[#3D6B4A] font-medium">GRÁTIS</span>
                ) : (
                  <span className={envioGratis ? "text-[#3D6B4A] font-medium" : "text-[#2C3A2C]"}>
                    {envioGratis ? "GRÁTIS" : "3,99€"}
                  </span>
                )}
              </div>
              {levantamentoLoja && (
                <div className="flex justify-between text-xs text-[#6B9E63]">
                  <span>🏪 Levantamento na loja</span>
                  <span>Sem custos de envio</span>
                </div>
              )}
            </div>

            <div className="border-t border-[#E8F0E6] pt-4 mb-6">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-[#2C3A2C]">Total</span>
                <span style={serif} className="text-2xl font-semibold text-[#1A2E1A]">
                  {total.toFixed(2).replace('.', ',')}€
                </span>
              </div>
            </div>

            {erro && <p className="text-xs text-red-500 mb-4">{erro}</p>}

            <button
              onClick={finalizarEncomenda}
              disabled={loading}
              className={`w-full py-4 rounded-full text-xs tracking-widest uppercase transition-all shadow-lg shadow-green-900/10 ${
                loading
                  ? "bg-[#C8DFC4] text-white cursor-not-allowed"
                  : "bg-[#3D6B4A] text-white hover:bg-[#2C5038]"
              }`}
            >
              {loading ? "A processar..." : "Confirmar Encomenda"}
            </button>

            <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-[#E8F0E6]">
              {[
                { icon: "🔒", text: "Pagamento Seguro" },
                { icon: "↩️", text: "30 dias devolução" },
                { icon: levantamentoLoja ? "🏪" : "🚚", text: levantamentoLoja ? "Levantamento grátis" : "Envio rápido" },
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
