import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MessageSquare, Phone, Mail, Clock, Send, Search,
  ChevronRight, ArrowLeft, User, MapPin, Ruler,
  ShoppingBag, Heart, Headphones, LogOut, CheckCircle,
  AlertCircle, Plus, Inbox, Tag, X
} from "lucide-react";
import Footer from "./Footer";
import Navbar from "./Navbar";

const serif = { fontFamily: "'Cormorant Garamond', Georgia, serif" };
const sans  = { fontFamily: "'Jost', sans-serif" };
const BASE  = `${import.meta.env.VITE_API_URL}/api`;

const CATEGORIAS = ['Encomenda', 'Devolução / Troca', 'Pagamento', 'Produto', 'Entrega', 'Conta', 'Outro'];

const ESTADO_BADGE = {
  aberta:     { label: 'Em aberto',   bg: '#FEF9E7', cor: '#A67C00' },
  respondida: { label: 'Respondida',  bg: '#E6F1FB', cor: '#185FA5' },
  fechada:    { label: 'Fechada',     bg: '#F0F0F0', cor: '#888'    },
};

const NAV = [
  { label: "Meu Perfil",         href: "/perfil",               icon: User        },
  { label: "Lista de Moradas",   href: "/perfil?tab=moradas",   icon: MapPin      },
  { label: "Minhas Medidas",     href: "/perfil?tab=medidas",   icon: Ruler       },
  { label: "Meus Pedidos",       href: "/perfil?tab=pedidos",   icon: ShoppingBag },
  { label: "Lista de Favoritos", href: "/perfil?tab=favoritos", icon: Heart       },
  { label: "Serviço ao Cliente", href: "/suporte",              icon: Headphones  },
];

function formatarData(d) {
  const data = new Date(d);
  const diff = Math.floor((Date.now() - data) / 1000);
  if (diff < 60)    return 'agora mesmo';
  if (diff < 3600)  return `${Math.floor(diff / 60)} min atrás`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h atrás`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} dias atrás`;
  return data.toLocaleDateString('pt-PT');
}

// ── Toast ──────────────────────────────────────────────────────────────────────
function Toast({ toast, onClose }) {
  if (!toast) return null;
  return (
    <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-medium animate-in slide-in-from-top-2 ${
      toast.tipo === 'sucesso' ? 'bg-[#3D6B4A] text-white' : 'bg-[#C0392B] text-white'
    }`}>
      {toast.tipo === 'sucesso' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
      <span>{toast.msg}</span>
      <button onClick={onClose} className="ml-1 opacity-70 hover:opacity-100"><X size={14} /></button>
    </div>
  );
}

// ── Thread (conversa) ──────────────────────────────────────────────────────────
function ThreadView({ ticket, respostas, perfil, onVoltar, onResposta, token }) {
  const [texto, setTexto]       = useState("");
  const [enviando, setEnviando] = useState(false);
  const bottomRef               = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [respostas]);

  const badge = ESTADO_BADGE[ticket.estado] || {};

  const enviar = async () => {
    if (!texto.trim() || enviando) return;
    setEnviando(true);
    try {
      const res = await fetch(`${BASE}/suporte/${ticket.id_mensagem}/responder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ mensagem: texto.trim() }),
      });
      if (res.ok) { setTexto(""); onResposta(); }
    } finally { setEnviando(false); }
  };

  return (
    <div>
      <button onClick={onVoltar}
        className="flex items-center gap-2 text-sm text-[#6B9E63] hover:text-[#3D6B4A] mb-6 transition-colors group">
        <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
        Voltar às mensagens
      </button>

      <div className="bg-white rounded-2xl border border-[#E8F0E6] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E8F0E6] flex items-start justify-between gap-4 bg-gradient-to-r from-[#F7F9F5] to-white">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-semibold tracking-widest uppercase text-[#8FAF8A]">Ticket #{ticket.id_mensagem}</span>
              <span className="text-[#C8DFC4]">·</span>
              <span className="text-[10px] text-[#A8C4A8]">{formatarData(ticket.criado_em)}</span>
            </div>
            <h2 style={serif} className="text-2xl font-semibold text-[#1A2E1A]">{ticket.assunto}</h2>
          </div>
          <span className="text-xs font-medium px-3 py-1.5 rounded-full flex-shrink-0 border"
            style={{ background: badge.bg, color: badge.cor, borderColor: badge.cor + '40' }}>
            {badge.label}
          </span>
        </div>

        {/* Mensagens */}
        <div className="p-6 space-y-5 min-h-[320px] max-h-[480px] overflow-y-auto bg-[#FAFCFA]">
          {/* Mensagem original */}
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-[#3D6B4A] flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
              {perfil?.nome?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1">
              <p className="text-[11px] font-semibold text-[#4A5C4A] mb-1.5">{perfil?.nome}</p>
              <div className="bg-white border border-[#E8F0E6] rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%] shadow-sm">
                <p className="text-sm text-[#2C3A2C] leading-relaxed whitespace-pre-wrap">{ticket.mensagem}</p>
              </div>
              <p className="text-[10px] text-[#A8C4A8] mt-1.5 ml-1">{formatarData(ticket.criado_em)}</p>
            </div>
          </div>

          {/* Respostas */}
          {respostas.map(r => (
            <div key={r.id_resposta} className={`flex gap-3 ${r.is_admin ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5 ${
                r.is_admin ? 'bg-[#1A2E1A]' : 'bg-[#3D6B4A]'
              }`}>
                {r.is_admin ? 'S' : perfil?.nome?.charAt(0)?.toUpperCase()}
              </div>
              <div className={`flex-1 ${r.is_admin ? 'flex flex-col items-end' : ''}`}>
                <p className="text-[11px] font-semibold text-[#4A5C4A] mb-1.5">
                  {r.is_admin ? 'Suporte Lili Store' : perfil?.nome}
                </p>
                <div className={`rounded-2xl px-4 py-3 max-w-[85%] shadow-sm ${
                  r.is_admin
                    ? 'bg-[#2C3A2C] text-white rounded-tr-sm'
                    : 'bg-white border border-[#E8F0E6] rounded-tl-sm'
                }`}>
                  <p className={`text-sm leading-relaxed whitespace-pre-wrap ${r.is_admin ? 'text-white' : 'text-[#2C3A2C]'}`}>
                    {r.mensagem}
                  </p>
                </div>
                <p className="text-[10px] text-[#A8C4A8] mt-1.5 mx-1">{formatarData(r.criado_em)}</p>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        {ticket.estado !== 'fechada' ? (
          <div className="px-6 py-4 border-t border-[#E8F0E6] bg-white flex gap-3 items-end">
            <textarea value={texto} onChange={e => setTexto(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); enviar(); } }}
              placeholder="Escreve a tua resposta… (Enter para enviar, Shift+Enter para nova linha)"
              rows={2}
              className="flex-1 resize-none border border-[#C8DFC4] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#3D6B4A] placeholder:text-[#C8DFC4] transition-colors"
            />
            <button onClick={enviar} disabled={!texto.trim() || enviando}
              className="bg-[#3D6B4A] hover:bg-[#2C5038] disabled:opacity-40 text-white p-2.5 rounded-xl transition-all flex-shrink-0">
              {enviando
                ? <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                : <Send size={16} />
              }
            </button>
          </div>
        ) : (
          <div className="px-6 py-3 border-t border-[#E8F0E6] bg-[#F7F9F5] text-center">
            <p className="text-xs text-[#8FAF8A]">Este ticket está fechado. Se precisares de mais ajuda, abre uma nova mensagem.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Página principal ───────────────────────────────────────────────────────────
export default function SuportePage() {
  const navigate                    = useNavigate();
  const [perfil, setPerfil]         = useState(null);
  const [mensagens, setMensagens]   = useState([]);
  const [ticketAtivo, setTicketAtivo] = useState(null);
  const [respostas, setRespostas]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [toast, setToast]           = useState(null);

  // form
  const [categoria, setCategoria]   = useState("");
  const [assunto, setAssunto]       = useState("");
  const [mensagem, setMensagem]     = useState("");
  const [enviando, setEnviando]     = useState(false);

  // filtros
  const [pesquisa, setPesquisa]     = useState("");
  const [filtro, setFiltro]         = useState("todos");

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Jost:wght@300;400;500&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    carregarPerfil();
    carregarMensagens();
  }, []);

  const carregarPerfil = async () => {
    try {
      const res = await fetch(`${BASE}/auth/perfil`, { headers: { Authorization: `Bearer ${token}` } });
      setPerfil(await res.json());
    } catch {}
  };

  const carregarMensagens = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/suporte/minhas`, { headers: { Authorization: `Bearer ${token}` } });
      const dados = await res.json();
      setMensagens(Array.isArray(dados) ? dados : []);
    } catch {}
    setLoading(false);
  };

  const abrirTicket = async (id) => {
    try {
      const res = await fetch(`${BASE}/suporte/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      const dados = await res.json();
      setTicketAtivo(dados);
      setRespostas(dados.respostas || []);
      setMensagens(prev => prev.map(m => m.id_mensagem === id ? { ...m, lida_cliente: true } : m));
    } catch {}
  };

  const enviarMensagem = async (e) => {
    e.preventDefault();
    if (!categoria) { mostrarToast("Seleciona uma categoria.", "erro"); return; }
    if (!mensagem.trim()) { mostrarToast("A mensagem não pode estar vazia.", "erro"); return; }

    setEnviando(true);
    try {
      const assuntoFinal = `${categoria}${assunto.trim() ? ': ' + assunto.trim() : ''}`;
      const res = await fetch(`${BASE}/suporte/nova`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ assunto: assuntoFinal, mensagem: mensagem.trim() }),
      });
      if (res.ok) {
        mostrarToast("Mensagem enviada! Responderemos em 24h úteis.", "sucesso");
        setCategoria(""); setAssunto(""); setMensagem("");
        carregarMensagens();
      } else {
        mostrarToast("Erro ao enviar. Tenta novamente.", "erro");
      }
    } catch { mostrarToast("Erro de ligação.", "erro"); }
    setEnviando(false);
  };

  const mostrarToast = (msg, tipo) => {
    setToast({ msg, tipo });
    setTimeout(() => setToast(null), 4500);
  };

  const sair = () => { localStorage.removeItem('token'); navigate('/'); };

  const mensagensFiltradas = mensagens.filter(m => {
    const okEstado = filtro === "todos" || m.estado === filtro;
    const q = pesquisa.toLowerCase();
    const okPesquisa = !q || m.assunto.toLowerCase().includes(q) || m.mensagem.toLowerCase().includes(q);
    return okEstado && okPesquisa;
  });

  const naoLidas = mensagens.filter(m => !m.lida_cliente && m.estado === 'respondida').length;

  return (
    <div style={sans} className="min-h-screen bg-[#F7F9F5] text-[#2C2C2C]">
      <Toast toast={toast} onClose={() => setToast(null)} />

     
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10 flex flex-col md:flex-row gap-6 md:gap-8 items-start">

        {/* ── Sidebar ── */}
        <aside className="w-full md:w-60 md:flex-shrink-0 md:sticky md:top-24 space-y-4">
          <div className="bg-white rounded-2xl border border-[#E8F0E6] p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#3D6B4A] to-[#2C5038] flex items-center justify-center text-xl font-bold text-white mx-auto mb-3 shadow-sm">
              {perfil?.nome?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <p className="text-sm font-semibold text-[#1A2E1A] truncate">{perfil?.nome || '...'}</p>
            <p className="text-xs text-[#8FAF8A] truncate mt-0.5">{perfil?.email || ''}</p>
          </div>

          <nav className="bg-white rounded-2xl border border-[#E8F0E6] overflow-hidden">
            {NAV.map(({ label, href, icon: Icon }) => {
              const ativo = href === '/suporte';
              return (
                <Link key={href} to={href}
                  className={`flex items-center gap-3 px-4 py-3 text-sm transition-all border-b border-[#F0F5EE] last:border-0 ${
                    ativo ? 'bg-[#F0F5EE] text-[#3D6B4A] font-medium' : 'text-[#4A5C4A] hover:bg-[#F7F9F5] hover:text-[#3D6B4A]'
                  }`}>
                  <Icon size={15} className={ativo ? 'text-[#3D6B4A]' : 'text-[#A8C4A8]'} />
                  <span className="flex-1">{label}</span>
                  {label === 'Serviço ao Cliente' && naoLidas > 0 && (
                    <span className="bg-[#C0392B] text-white text-[9px] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center">
                      {naoLidas}
                    </span>
                  )}
                </Link>
              );
            })}
            <button onClick={sair}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#C0392B] hover:bg-[#FDECEA] transition-all">
              <LogOut size={15} /> Sair
            </button>
          </nav>
        </aside>

        {/* ── Conteúdo ── */}
        <main className="flex-1 min-w-0">
          {ticketAtivo ? (
            <ThreadView
              ticket={ticketAtivo}
              respostas={respostas}
              perfil={perfil}
              token={token}
              onVoltar={() => { setTicketAtivo(null); carregarMensagens(); }}
              onResposta={() => abrirTicket(ticketAtivo.id_mensagem)}
            />
          ) : (
            <div className="space-y-6">

              {/* Header */}
              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-[#6B9E63] mb-1">Ajuda & Suporte</p>
                <h1 style={serif} className="text-4xl font-semibold text-[#1A2E1A]">Serviço ao Cliente</h1>
                <p className="text-sm text-[#8FAF8A] mt-1">Estamos aqui para ajudar. Responderemos em 24h úteis.</p>
              </div>

              {/* Cards topo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Mensagens */}
                <div className="bg-white rounded-2xl border border-[#E8F0E6] p-6">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#F0F5EE] flex items-center justify-center">
                        <Inbox size={18} className="text-[#3D6B4A]" />
                      </div>
                      <p className="text-sm font-semibold text-[#1A2E1A]">As Minhas Mensagens</p>
                    </div>
                    {naoLidas > 0 && (
                      <span className="bg-[#C0392B] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                        {naoLidas} nova{naoLidas > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-5">
                    {[
                      { label: 'Em aberto',   val: mensagens.filter(m => m.estado === 'aberta').length,     cor: '#A67C00', bg: '#FEF9E7' },
                      { label: 'Respondidas', val: mensagens.filter(m => m.estado === 'respondida').length, cor: '#185FA5', bg: '#E6F1FB' },
                      { label: 'Fechadas',    val: mensagens.filter(m => m.estado === 'fechada').length,    cor: '#888',    bg: '#F0F0F0' },
                    ].map(({ label, val, cor, bg }) => (
                      <div key={label} className="rounded-xl p-3 text-center" style={{ background: bg }}>
                        <p style={{ ...serif, color: cor }} className="text-2xl font-semibold">{val}</p>
                        <p className="text-[10px] mt-0.5" style={{ color: cor }}>{label}</p>
                      </div>
                    ))}
                  </div>
                  {mensagens.length > 0 ? (
                    <button onClick={() => document.getElementById('historico')?.scrollIntoView({ behavior: 'smooth' })}
                      className="w-full text-xs text-[#3D6B4A] border border-[#C8DFC4] py-2.5 rounded-xl hover:bg-[#F0F5EE] transition-colors flex items-center justify-center gap-1.5 font-medium">
                      Ver histórico completo <ChevronRight size={13} />
                    </button>
                  ) : (
                    <p className="text-xs text-[#A8C4A8] text-center py-2">Ainda não enviaste nenhuma mensagem.</p>
                  )}
                </div>

                {/* Contacte-nos */}
                <div className="bg-white rounded-2xl border border-[#E8F0E6] p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-[#F0F5EE] flex items-center justify-center">
                      <Headphones size={18} className="text-[#3D6B4A]" />
                    </div>
                    <p className="text-sm font-semibold text-[#1A2E1A]">Contacte-nos</p>
                  </div>
                  <div className="space-y-3">
                    {[
                      { icon: Mail,  label: 'Email',   val: 'lilistoremodachique@gmail.com' },
                      { icon: Phone, label: 'Telefone', val: '+351 210 000 000'              },
                      { icon: Clock, label: 'Horário',  val: 'Seg – Sáb: 10h – 19h'         },
                    ].map(({ icon: Icon, label, val }) => (
                      <div key={label} className="flex items-center gap-3 p-3 bg-[#F7F9F5] rounded-xl">
                        <div className="w-8 h-8 rounded-lg bg-[#E8F0E6] flex items-center justify-center flex-shrink-0">
                          <Icon size={14} className="text-[#3D6B4A]" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] text-[#8FAF8A] uppercase tracking-wider font-medium">{label}</p>
                          <p className="text-xs font-medium text-[#2C3A2C] truncate">{val}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Form nova mensagem */}
              <div className="bg-white rounded-2xl border border-[#E8F0E6] p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#F0F5EE] flex items-center justify-center">
                    <Plus size={18} className="text-[#3D6B4A]" />
                  </div>
                  <div>
                    <h2 style={serif} className="text-xl font-semibold text-[#1A2E1A]">Nova Mensagem</h2>
                    <p className="text-xs text-[#8FAF8A]">Preenche o formulário e entraremos em contacto</p>
                  </div>
                </div>

                <form onSubmit={enviarMensagem} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] tracking-widest uppercase text-[#6B9E63] mb-1.5 font-medium">
                        <Tag size={10} className="inline mr-1" />Categoria *
                      </label>
                      <select value={categoria} onChange={e => setCategoria(e.target.value)}
                        className="w-full border border-[#C8DFC4] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#3D6B4A] bg-white text-[#2C3A2C] transition-colors">
                        <option value="">Seleciona uma categoria</option>
                        {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] tracking-widest uppercase text-[#6B9E63] mb-1.5 font-medium">Assunto</label>
                      <input type="text" value={assunto} onChange={e => setAssunto(e.target.value)}
                        placeholder="Ex: Encomenda #123 não chegou"
                        className="w-full border border-[#C8DFC4] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#3D6B4A] placeholder:text-[#C8DFC4] transition-colors" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] tracking-widest uppercase text-[#6B9E63] mb-1.5 font-medium">Mensagem *</label>
                    <textarea value={mensagem} onChange={e => setMensagem(e.target.value)}
                      placeholder="Descreve o teu problema com o máximo detalhe possível. Quanto mais informação deres, mais rapidamente conseguimos ajudar."
                      rows={4}
                      className="w-full border border-[#C8DFC4] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#3D6B4A] resize-none placeholder:text-[#C8DFC4] transition-colors" />
                    <p className="text-[10px] text-[#A8C4A8] mt-1 text-right">{mensagem.length} caracteres</p>
                  </div>
                  <div className="flex justify-end">
                    <button type="submit" disabled={enviando}
                      className="flex items-center gap-2 bg-[#3D6B4A] hover:bg-[#2C5038] disabled:opacity-60 text-white px-7 py-2.5 rounded-full text-xs tracking-widest uppercase font-medium transition-all shadow-sm shadow-green-900/10">
                      {enviando ? (
                        <><svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>A enviar...</>
                      ) : (
                        <><Send size={13} /> Enviar Mensagem</>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Histórico */}
              <div id="historico" className="bg-white rounded-2xl border border-[#E8F0E6] p-6">
                <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#F0F5EE] flex items-center justify-center">
                      <MessageSquare size={18} className="text-[#3D6B4A]" />
                    </div>
                    <h2 style={serif} className="text-xl font-semibold text-[#1A2E1A]">Histórico de Mensagens</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8C4A8]" />
                      <input type="text" value={pesquisa} onChange={e => setPesquisa(e.target.value)}
                        placeholder="Pesquisar..."
                        className="pl-8 pr-3 py-2 border border-[#E8F0E6] rounded-xl text-xs outline-none focus:border-[#3D6B4A] w-36 transition-colors" />
                    </div>
                    <select value={filtro} onChange={e => setFiltro(e.target.value)}
                      className="border border-[#E8F0E6] rounded-xl px-3 py-2 text-xs outline-none focus:border-[#3D6B4A] bg-white text-[#4A5C4A]">
                      <option value="todos">Todos</option>
                      <option value="aberta">Em aberto</option>
                      <option value="respondida">Respondidas</option>
                      <option value="fechada">Fechadas</option>
                    </select>
                  </div>
                </div>

                {loading ? (
                  <div className="text-center py-12">
                    <svg className="animate-spin h-6 w-6 text-[#C8DFC4] mx-auto" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                  </div>
                ) : mensagensFiltradas.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare size={36} className="text-[#C8DFC4] mx-auto mb-3" />
                    <p style={serif} className="text-2xl text-[#C8DFC4] mb-1">Nenhuma mensagem encontrada</p>
                    <p className="text-xs text-[#A8C4A8]">
                      {pesquisa || filtro !== 'todos' ? 'Tenta ajustar os filtros' : 'Envia a tua primeira mensagem acima'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {mensagensFiltradas.map(m => {
                      const badge = ESTADO_BADGE[m.estado] || {};
                      const nova  = !m.lida_cliente && m.estado === 'respondida';
                      return (
                        <button key={m.id_mensagem} onClick={() => abrirTicket(m.id_mensagem)}
                          className={`w-full text-left rounded-xl p-4 border transition-all group hover:shadow-sm ${
                            nova ? 'border-[#3D6B4A] bg-[#F7FCF8]' : 'border-[#E8F0E6] hover:border-[#A8C4A8]'
                          }`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${nova ? 'bg-[#3D6B4A]' : 'bg-transparent'}`} />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2 mb-0.5">
                                <p className={`text-sm truncate ${nova ? 'font-semibold text-[#1A2E1A]' : 'font-medium text-[#2C3A2C]'}`}>
                                  {m.assunto}
                                </p>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <span className="text-[10px] font-medium px-2.5 py-1 rounded-full border"
                                    style={{ background: badge.bg, color: badge.cor, borderColor: (badge.cor || '#ccc') + '30' }}>
                                    {badge.label}
                                  </span>
                                  <ChevronRight size={14} className="text-[#C8DFC4] group-hover:text-[#3D6B4A] transition-colors" />
                                </div>
                              </div>
                              <p className="text-xs text-[#8FAF8A] truncate">{m.mensagem}</p>
                              <p className="text-[10px] text-[#A8C4A8] mt-1">
                                #{m.id_mensagem} · {formatarData(m.criado_em)} · {m.total_respostas || 0} resposta{m.total_respostas !== 1 ? 's' : ''}
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}
