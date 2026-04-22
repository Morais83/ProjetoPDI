import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const serif = { fontFamily: "'Cormorant Garamond', Georgia, serif" };
const sans = { fontFamily: "'Jost', sans-serif" };

const produtosCarrinho = [
  { id: 1, nome: "Blazer Alfaiataria", marca: "Moda ChiqueJOAO", preco: 39.99, cor: "Preto", tamanho: "38", quantidade: 1, emoji: "🧥", bg: "bg-[#F0F5EE]" },
  { id: 2, nome: "Vestido Linho Verde", marca: "Moda Chique", preco: 59.90, cor: "Verde", tamanho: "36", quantidade: 1, emoji: "👗", bg: "bg-[#F5F0EE]" },
  { id: 3, nome: "Blusa Seda Rosa", marca: "Moda Chique", preco: 49.90, cor: "Rosa", tamanho: "S", quantidade: 1, emoji: "👚", bg: "bg-[#F0F5EE]" },
];

const passos = ["Entrega", "Pagamento", "Confirmação"];

export default function CheckoutPage() {
  const [passoAtivo, setPassoAtivo] = useState(0);
  const [tipoEntrega, setTipoEntrega] = useState("casa");
  const [morada, setMorada] = useState({ nome: "", morada: "", cidade: "", cp: "", telefone: "" });
  const [mesmasMoradas, setMesmasMoradas] = useState(true);
  const [moradaFaturacao, setMoradaFaturacao] = useState({ nome: "", morada: "", cidade: "", cp: "" });
  const [metodoPagamento, setMetodoPagamento] = useState("mbway");
  const [dadosPagamento, setDadosPagamento] = useState({ telefone: "", numero: "", validade: "", cvv: "" });
  const [encomendaFinalizada, setEncomendaFinalizada] = useState(false);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Jost:wght@300;400;500&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  const subtotal = produtosCarrinho.reduce((acc, p) => acc + p.preco * p.quantidade, 0);
  const envioGratis = subtotal >= 50;
  const total = subtotal + (envioGratis ? 0 : 3.99);

  const finalizarEncomenda = () => {
    setEncomendaFinalizada(true);
    setPassoAtivo(2);
  };

  return (
    <div style={sans} className="min-h-screen bg-[#F7F9F5] text-[#2C2C2C]">
      <div className="bg-[#3D6B4A] text-white text-center py-2 text-xs tracking-widest">
        ✦ Envio gratuito em compras acima de 50€ &nbsp;|&nbsp; Nova coleção Primavera-Verão disponível ✦
      </div>

      <Navbar />

      <div className="max-w-6xl mx-auto px-8 py-10">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#8FAF8A] mb-8">
          <Link to="/" className="hover:text-[#3D6B4A]">Início</Link>
          <span>/</span>
          <Link to="/carrinho" className="hover:text-[#3D6B4A]">Carrinho</Link>
          <span>/</span>
          <span className="text-[#3D6B4A]">Checkout</span>
        </div>

        {/* Passos */}
        <div className="flex items-center justify-center gap-0 mb-10">
          {passos.map((passo, i) => (
            <div key={i} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                  i <= passoAtivo ? "bg-[#3D6B4A] text-white" : "bg-[#E8F0E6] text-[#8FAF8A]"
                }`}>
                  {i < passoAtivo ? "✓" : i + 1}
                </div>
                <span className={`text-xs mt-1 tracking-wide ${i === passoAtivo ? "text-[#3D6B4A] font-medium" : "text-[#8FAF8A]"}`}>
                  {passo}
                </span>
              </div>
              {i < passos.length - 1 && (
                <div className={`w-24 h-0.5 mx-2 mb-4 ${i < passoAtivo ? "bg-[#3D6B4A]" : "bg-[#E8F0E6]"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Confirmação final */}
        {passoAtivo === 2 ? (
          <div className="text-center py-16 max-w-md mx-auto">
            <div className="w-20 h-20 rounded-full bg-[#E8F0E6] flex items-center justify-center mx-auto mb-6 text-4xl">
              ✓
            </div>
            <p className="text-xs tracking-[0.15em] uppercase text-[#6B9E63] mb-2">Encomenda confirmada</p>
            <h2 style={serif} className="text-4xl font-semibold text-[#1A2E1A] mb-4">Obrigada pela tua compra!</h2>
            <p className="text-sm text-[#5C6E5C] mb-2">A tua encomenda <strong>#0042</strong> foi confirmada com sucesso.</p>
            <p className="text-sm text-[#5C6E5C] mb-8">Receberás um email de confirmação em breve com os detalhes da entrega.</p>
            <div className="bg-white rounded-2xl border border-[#E8F0E6] p-5 mb-8 text-left">
              <p className="text-xs tracking-widest uppercase text-[#6B9E63] mb-3">Resumo</p>
              {produtosCarrinho.map((p) => (
                <div key={p.id} className="flex justify-between text-sm py-2 border-b border-[#E8F0E6] last:border-0">
                  <span className="text-[#4A5C4A]">{p.emoji} {p.nome}</span>
                  <span className="text-[#3D6B4A] font-medium">{p.preco.toFixed(2).replace(".", ",")}€</span>
                </div>
              ))}
              <div className="flex justify-between text-sm pt-3 font-medium">
                <span className="text-[#2C3A2C]">Total pago</span>
                <span style={serif} className="text-xl text-[#1A2E1A]">{total.toFixed(2).replace(".", ",")}€</span>
              </div>
            </div>
            <div className="flex gap-3 justify-center">
              <Link to="/perfil" onClick={() => window.scrollTo(0, 0)} className="px-6 py-3 rounded-full border border-[#C8DFC4] text-sm text-[#3D6B4A] hover:bg-[#F0F5EE] transition-all">
                Ver os meus pedidos
              </Link>
              <Link to="/" onClick={() => window.scrollTo(0, 0)} className="px-6 py-3 rounded-full bg-[#3D6B4A] text-white text-sm hover:bg-[#2C5038] transition-all">
                Continuar a comprar
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8 items-start">

            {/* Coluna Esquerda */}
            <div className="md:col-span-2">

              {/* PASSO 0 — Entrega */}
              {passoAtivo === 0 && (
                <div className="bg-white rounded-2xl border border-[#E8F0E6] p-6">
                  <h2 style={serif} className="text-2xl font-semibold text-[#1A2E1A] mb-6">Entrega</h2>

                  <div className="space-y-3 mb-6">
                    {[
                      { id: "casa", label: "Entrega em casa", icon: "🏠" },
                      { id: "loja", label: "Entrega em loja (CTT)", icon: "🏪" },
                    ].map((op) => (
                      <button
                        key={op.id}
                        onClick={() => setTipoEntrega(op.id)}
                        className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl border-2 transition-all ${
                          tipoEntrega === op.id ? "border-[#3D6B4A] bg-[#F7F9F5]" : "border-[#E8F0E6] bg-white hover:border-[#C8DFC4]"
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          tipoEntrega === op.id ? "border-[#3D6B4A]" : "border-[#C8DFC4]"
                        }`}>
                          {tipoEntrega === op.id && <div className="w-2.5 h-2.5 rounded-full bg-[#3D6B4A]" />}
                        </div>
                        <span className="text-sm text-[#2C3A2C]">{op.label}</span>
                        <span className="ml-auto text-lg">{op.icon}</span>
                      </button>
                    ))}
                  </div>

                  {tipoEntrega === "loja" && (
                    <div className="mb-6 rounded-xl overflow-hidden border border-[#E8F0E6]">
                      <iframe
                        title="Mapa CTT"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3001.0!2d-8.7441!3d40.6019!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDM2JzA2LjgiTiA4wrA0NCczNS44Ilc!5e0!3m2!1spt!2spt!4v1620000000000"
                        width="100%"
                        height="220"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                      />
                      <div className="p-3 bg-[#F7F9F5] flex items-center justify-between">
                        <p className="text-xs text-[#5C6E5C]">Envio até 3 dias úteis na nossa loja.</p>
                        <span className="text-sm font-bold text-[#C0392B]">ctt</span>
                      </div>
                    </div>
                  )}

                  {tipoEntrega === "casa" && (
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {[
                        { label: "Nome completo", key: "nome", col: "col-span-2" },
                        { label: "Morada", key: "morada", col: "col-span-2" },
                        { label: "Cidade", key: "cidade", col: "" },
                        { label: "Código Postal", key: "cp", col: "" },
                        { label: "Telefone", key: "telefone", col: "col-span-2" },
                      ].map((field) => (
                        <div key={field.key} className={field.col}>
                          <label className="block text-[11px] tracking-widest uppercase text-[#6B9E63] mb-1 font-medium">{field.label}</label>
                          <input
                            type="text"
                            value={morada[field.key]}
                            onChange={(e) => setMorada({ ...morada, [field.key]: e.target.value })}
                            className="w-full border-b border-[#C8DFC4] py-2 text-sm outline-none focus:border-[#3D6B4A] bg-transparent transition-all"
                            placeholder="—"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-4 border-t border-[#E8F0E6]">
                    <Link to="/carrinho" className="text-sm text-[#5C6E5C] hover:text-[#3D6B4A] transition-colors">
                      ← Voltar ao carrinho
                    </Link>
                    <button
                      onClick={() => setPassoAtivo(1)}
                      className="px-8 py-3 rounded-full bg-[#3D6B4A] text-white text-xs tracking-widest uppercase hover:bg-[#2C5038] transition-all"
                    >
                      Continuar para Pagamento
                    </button>
                  </div>
                </div>
              )}

              {/* PASSO 1 — Pagamento */}
              {passoAtivo === 1 && (
                <div className="space-y-4">

                  {/* Morada de Entrega */}
                  <div className="bg-white rounded-2xl border border-[#E8F0E6] p-5">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs tracking-widest uppercase text-[#6B9E63] font-medium">Morada de entrega</p>
                      <button onClick={() => setPassoAtivo(0)} className="text-xs text-[#3D6B4A] border border-[#C8DFC4] px-3 py-1 rounded-full hover:bg-[#F0F5EE] transition-all">
                        Alterar
                      </button>
                    </div>
                    <p className="text-sm text-[#4A5C4A]">
                      {morada.nome || "Ana Silva"}, {morada.morada || "Rua das Flores, 12"}, {morada.cp || "1000-001"} {morada.cidade || "Lisboa"}
                    </p>
                  </div>

                  {/* Morada de Faturação */}
                  <div className="bg-white rounded-2xl border border-[#E8F0E6] p-5">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs tracking-widest uppercase text-[#6B9E63] font-medium">Morada de faturação</p>
                      <button
                        onClick={() => setMesmasMoradas(!mesmasMoradas)}
                        className="text-xs text-[#3D6B4A] border border-[#C8DFC4] px-3 py-1 rounded-full hover:bg-[#F0F5EE] transition-all"
                      >
                        {mesmasMoradas ? "Alterar" : "Usar morada de entrega"}
                      </button>
                    </div>
                    {mesmasMoradas ? (
                      <p className="text-sm text-[#4A5C4A]">
                        {morada.nome || "Ana Silva"}, {morada.morada || "Rua das Flores, 12"}, {morada.cp || "1000-001"} {morada.cidade || "Lisboa"}
                      </p>
                    ) : (
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { label: "Nome completo", key: "nome", col: "col-span-2" },
                          { label: "Morada", key: "morada", col: "col-span-2" },
                          { label: "Cidade", key: "cidade", col: "" },
                          { label: "Código Postal", key: "cp", col: "" },
                        ].map((field) => (
                          <div key={field.key} className={field.col}>
                            <label className="block text-[11px] tracking-widest uppercase text-[#6B9E63] mb-1 font-medium">{field.label}</label>
                            <input
                              type="text"
                              value={moradaFaturacao[field.key]}
                              onChange={(e) => setMoradaFaturacao({ ...moradaFaturacao, [field.key]: e.target.value })}
                              className="w-full border-b border-[#C8DFC4] py-2 text-sm outline-none focus:border-[#3D6B4A] bg-transparent"
                              placeholder="—"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Formas de Pagamento */}
                  <div className="bg-white rounded-2xl border border-[#E8F0E6] p-6">
                    <h2 style={serif} className="text-2xl font-semibold text-[#1A2E1A] mb-6">Formas de Pagamento</h2>
                    <div className="space-y-3 mb-6">
                      {[
                        { id: "mbway", label: "MBWay", icon: "📱" },
                        { id: "paypal", label: "PayPal", icon: "🅿️" },
                        { id: "cobranca", label: "Cobrança", icon: "📦" },
                        { id: "cartao", label: "Pagamento com Cartão", icon: "💳" },
                      ].map((op) => (
                        <div key={op.id}>
                          <button
                            onClick={() => setMetodoPagamento(op.id)}
                            className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl border-2 transition-all ${
                              metodoPagamento === op.id ? "border-[#3D6B4A] bg-[#F7F9F5]" : "border-[#E8F0E6] bg-white hover:border-[#C8DFC4]"
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                              metodoPagamento === op.id ? "border-[#3D6B4A]" : "border-[#C8DFC4]"
                            }`}>
                              {metodoPagamento === op.id && <div className="w-2.5 h-2.5 rounded-full bg-[#3D6B4A]" />}
                            </div>
                            <span className="text-sm text-[#2C3A2C]">{op.label}</span>
                            <span className="ml-auto text-lg">{op.icon}</span>
                          </button>

                          {metodoPagamento === "mbway" && op.id === "mbway" && (
                            <div className="mt-3 mx-1 p-4 bg-[#F7F9F5] rounded-xl border border-[#E8F0E6]">
                              <div className="flex gap-4">
                                <div className="w-28">
                                  <label className="block text-[11px] tracking-widest uppercase text-[#6B9E63] mb-1 font-medium">Prefixo</label>
                                  <select className="w-full border border-[#C8DFC4] rounded-lg px-2 py-2 text-sm outline-none focus:border-[#3D6B4A] bg-white text-[#4A5C4A]">
                                    {["+351", "+34", "+33", "+44", "+49", "+55"].map((p) => (
                                      <option key={p}>{p}</option>
                                    ))}
                                  </select>
                                </div>
                                <div className="flex-1">
                                  <label className="block text-[11px] tracking-widest uppercase text-[#6B9E63] mb-1 font-medium">Número de telemóvel</label>
                                  <input
                                    type="tel"
                                    value={dadosPagamento.telefone}
                                    onChange={(e) => setDadosPagamento({ ...dadosPagamento, telefone: e.target.value })}
                                    placeholder="912 345 678"
                                    className="w-full border border-[#C8DFC4] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#3D6B4A] bg-white"
                                  />
                                </div>
                              </div>
                              <p className="text-xs text-[#8FAF8A] mt-2">Receberás uma notificação na app MBWay para confirmar o pagamento.</p>
                            </div>
                          )}

                          {metodoPagamento === "cartao" && op.id === "cartao" && (
                            <div className="mt-3 mx-1 p-4 bg-[#F7F9F5] rounded-xl border border-[#E8F0E6] space-y-4">
                              <div>
                                <label className="block text-[11px] tracking-widest uppercase text-[#6B9E63] mb-1 font-medium">Número do Cartão</label>
                                <input type="text" placeholder="0000 0000 0000 0000" value={dadosPagamento.numero}
                                  onChange={(e) => setDadosPagamento({ ...dadosPagamento, numero: e.target.value })}
                                  className="w-full border border-[#C8DFC4] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#3D6B4A] bg-white" />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-[11px] tracking-widest uppercase text-[#6B9E63] mb-1 font-medium">Validade</label>
                                  <input type="text" placeholder="MM/AA" value={dadosPagamento.validade}
                                    onChange={(e) => setDadosPagamento({ ...dadosPagamento, validade: e.target.value })}
                                    className="w-full border border-[#C8DFC4] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#3D6B4A] bg-white" />
                                </div>
                                <div>
                                  <label className="block text-[11px] tracking-widest uppercase text-[#6B9E63] mb-1 font-medium">CVV</label>
                                  <input type="text" placeholder="000" value={dadosPagamento.cvv}
                                    onChange={(e) => setDadosPagamento({ ...dadosPagamento, cvv: e.target.value })}
                                    className="w-full border border-[#C8DFC4] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#3D6B4A] bg-white" />
                                </div>
                              </div>
                            </div>
                          )}

                          {metodoPagamento === "cobranca" && op.id === "cobranca" && (
                            <div className="mt-3 mx-1 p-4 bg-[#F7F9F5] rounded-xl border border-[#E8F0E6]">
                              <p className="text-sm text-[#5C6E5C] leading-relaxed">O pagamento será efetuado no momento da entrega. Acresce uma taxa de <strong>1,50€</strong>.</p>
                            </div>
                          )}

                          {metodoPagamento === "paypal" && op.id === "paypal" && (
                            <div className="mt-3 mx-1 p-4 bg-[#F7F9F5] rounded-xl border border-[#E8F0E6]">
                              <p className="text-sm text-[#5C6E5C] leading-relaxed">Serás redirecionada para o PayPal para completares o pagamento em segurança.</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-[#E8F0E6]">
                      <button onClick={() => setPassoAtivo(0)} className="text-sm text-[#5C6E5C] hover:text-[#3D6B4A] transition-colors">
                        ← Voltar à entrega
                      </button>
                      <button onClick={finalizarEncomenda} className="px-8 py-3 rounded-full bg-[#3D6B4A] text-white text-xs tracking-widest uppercase hover:bg-[#2C5038] transition-all">
                        Finalizar Encomenda
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Resumo do Pedido */}
            <div className="bg-white rounded-2xl border border-[#E8F0E6] p-6 sticky top-24">
              <h2 style={serif} className="text-2xl font-semibold text-[#1A2E1A] mb-5">Resumo do Pedido</h2>
              <div className="space-y-3 mb-5">
                {produtosCarrinho.map((p) => (
                  <div key={p.id} className="flex gap-3 items-center">
                    <div className={`${p.bg} w-12 h-14 rounded-lg flex items-center justify-center text-2xl flex-shrink-0`}>
                      {p.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-[#2C3A2C] truncate">{p.nome}</p>
                      <p className="text-[10px] text-[#8FAF8A]">Cor: {p.cor} · Tam: {p.tamanho}</p>
                    </div>
                    <p className="text-sm font-medium text-[#3D6B4A] flex-shrink-0">{p.preco.toFixed(2).replace(".", ",")}€</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-[#E8F0E6] pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#5C6E5C]">Subtotal</span>
                  <span className="text-[#2C3A2C]">{subtotal.toFixed(2).replace(".", ",")}€</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#5C6E5C]">Portes de envio</span>
                  <span className={envioGratis ? "text-[#3D6B4A] font-medium" : "text-[#2C3A2C]"}>
                    {envioGratis ? "GRÁTIS" : "3,99€"}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#E8F0E6]">
                  <span className="text-sm font-medium text-[#2C3A2C]">Preço Final</span>
                  <span style={serif} className="text-2xl font-semibold text-[#1A2E1A]">
                    {total.toFixed(2).replace(".", ",")}€
                  </span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-[#E8F0E6]">
                <div className="flex items-center gap-2 text-xs text-[#8FAF8A]">
                  <span>🔒</span>
                  <span>Pagamento 100% seguro e encriptado</span>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}git 