import { useState, useEffect, useRef, useCallback } from "react";
import AdminLayout from "./adminlayout";
import { MessageCircle, Search, CheckCircle, Clock, XCircle, Send, ChevronLeft, User, Shield, RefreshCw, Filter } from "lucide-react";
import { io as socketIO } from "socket.io-client";

const serif = { fontFamily: "'Cormorant Garamond', Georgia, serif" };
const sans = { fontFamily: "'Jost', sans-serif" };

const estadoStyles = {
  aberta:     "bg-[#FEF9E7] text-[#A67C00]",
  respondida: "bg-[#E8F0E6] text-[#3D6B4A]",
  fechada:    "bg-[#F3F3F3] text-[#888]",
};

const estadoLabels = {
  aberta:     "Aberta",
  respondida: "Respondida",
  fechada:    "Fechada",
};

const BASE = `${import.meta.env.VITE_API_URL}/api`;

function formatDate(str) {
  if (!str) return "";
  const d = new Date(str);
  return d.toLocaleDateString("pt-PT", { day: "2-digit", month: "short", year: "numeric" }) +
    " " + d.toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" });
}

export default function AdminSuporte() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("Todos");
  const [pesquisa, setPesquisa] = useState("");
  const [ticketAberto, setTicketAberto] = useState(null);
  const [respostaTexto, setRespostaTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [novoEstado, setNovoEstado] = useState("");
  const [toast, setToast] = useState(null);
  const bottomRef = useRef(null);
  const socketRef = useRef(null);
  const token = localStorage.getItem("token");

  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  const showToast = (msg, tipo = "ok") => {
    setToast({ msg, tipo });
    setTimeout(() => setToast(null), 3000);
  };

  const carregar = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/suporte/admin/todas`, { headers });
      const dados = await res.json();
      setTickets(Array.isArray(dados) ? dados : []);
    } catch {
      showToast("Erro ao carregar tickets", "erro");
    }
    setLoading(false);
  };

  useEffect(() => {
    carregar();

    // Socket.io — receber eventos em tempo real
    const socket = socketIO(import.meta.env.VITE_API_URL || 'http://localhost:5000');
    socketRef.current = socket;
    socket.emit('entrar_admin');

    // Nova mensagem de suporte de um cliente
    socket.on('nova_mensagem_suporte', ({ id_mensagem, assunto, nome }) => {
      showToast(`Nova mensagem de ${nome}: ${assunto}`);
      setTickets(prev => [{
        id_mensagem, assunto, nome, email: '', estado: 'aberta',
        lida_admin: false, total_respostas: 0, criado_em: new Date(),
      }, ...prev]);
    });

    // Cliente respondeu a um ticket
    socket.on('cliente_respondeu', ({ id_mensagem }) => {
      setTickets(prev => prev.map(t =>
        t.id_mensagem === id_mensagem ? { ...t, lida_admin: false, estado: 'aberta' } : t
      ));
      // Se o ticket está aberto, recarrega a thread
      setTicketAberto(prev => {
        if (prev?.id_mensagem === id_mensagem) {
          fetch(`${BASE}/suporte/admin/${id_mensagem}`, { headers })
            .then(r => r.json()).then(dados => setTicketAberto(dados));
        }
        return prev;
      });
    });

    // Quando o admin responde via socket (thread em tempo real no painel admin)
    socket.on('nova_resposta', (novaResposta) => {
      setTicketAberto(prev => {
        if (!prev || prev.id_mensagem !== novaResposta.id_mensagem) return prev;
        const jaExiste = (prev.respostas || []).some(r => r.id_resposta === novaResposta.id_resposta);
        if (jaExiste) return prev;
        return { ...prev, respostas: [...(prev.respostas || []), novaResposta] };
      });
    });

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [ticketAberto?.respostas]);

  const abrirTicket = async (id) => {
    try {
      const res = await fetch(`${BASE}/suporte/admin/${id}`, { headers });
      const dados = await res.json();
      setTicketAberto(dados);
      setNovoEstado(dados.estado);
      setRespostaTexto("");
      setTickets(prev => prev.map(t => t.id_mensagem === id ? { ...t, lida_admin: true } : t));
      // Entrar na sala do ticket para receber respostas do cliente em tempo real
      if (socketRef.current) socketRef.current.emit('entrar_ticket', id);
    } catch {
      showToast("Erro ao abrir ticket", "erro");
    }
  };

  const enviarResposta = async () => {
    if (!respostaTexto.trim()) return;
    setEnviando(true);
    try {
      const res = await fetch(`${BASE}/suporte/admin/${ticketAberto.id_mensagem}/responder`, {
        method: "POST",
        headers,
        body: JSON.stringify({ mensagem: respostaTexto.trim() }),
      });
      if (!res.ok) throw new Error();
      const dados = await res.json();
      showToast("Resposta enviada!");
      setRespostaTexto("");
      // Adiciona imediatamente a mensagem enviada sem esperar pelo socket
      if (dados.resposta) {
        setTicketAberto(prev => {
          if (!prev) return prev;
          const jaExiste = (prev.respostas || []).some(r => r.id_resposta === dados.resposta.id_resposta);
          if (jaExiste) return prev;
          return { ...prev, estado: 'respondida', respostas: [...(prev.respostas || []), dados.resposta] };
        });
      } else {
        setTicketAberto(prev => prev ? { ...prev, estado: 'respondida' } : prev);
      }
      setTickets(prev => prev.map(t =>
        t.id_mensagem === ticketAberto.id_mensagem ? { ...t, estado: 'respondida' } : t
      ));
      setNovoEstado('respondida');
    } catch {
      showToast("Erro ao enviar resposta", "erro");
    }
    setEnviando(false);
  };

  const atualizarEstado = async (estado) => {
    try {
      await fetch(`${BASE}/suporte/admin/${ticketAberto.id_mensagem}/estado`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ estado }),
      });
      setNovoEstado(estado);
      setTicketAberto(prev => ({ ...prev, estado }));
      setTickets(prev => prev.map(t => t.id_mensagem === ticketAberto.id_mensagem ? { ...t, estado } : t));
      showToast("Estado atualizado!");
    } catch {
      showToast("Erro ao atualizar estado", "erro");
    }
  };

  const filtrados = tickets.filter(t => {
    const matchFiltro = filtro === "Todos" || t.estado === filtro;
    const matchPesquisa = !pesquisa ||
      t.assunto?.toLowerCase().includes(pesquisa.toLowerCase()) ||
      t.nome?.toLowerCase().includes(pesquisa.toLowerCase()) ||
      t.email?.toLowerCase().includes(pesquisa.toLowerCase());
    return matchFiltro && matchPesquisa;
  });

  const counts = {
    aberta:     tickets.filter(t => t.estado === "aberta").length,
    respondida: tickets.filter(t => t.estado === "respondida").length,
    fechada:    tickets.filter(t => t.estado === "fechada").length,
    naoLidas:   tickets.filter(t => !t.lida_admin).length,
  };

  // ── Thread View ──────────────────────────────────────────────────────────────
  if (ticketAberto) {
    const respostas = ticketAberto.respostas || [];

    return (
      <AdminLayout>
        <div style={sans} className="max-w-3xl mx-auto">
          {/* Toast */}
          {toast && (
            <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl text-sm shadow-lg text-white transition-all ${
              toast.tipo === "erro" ? "bg-[#C0392B]" : "bg-[#3D6B4A]"
            }`}>{toast.msg}</div>
          )}

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => {
            if (socketRef.current) socketRef.current.emit('sair_ticket', ticketAberto.id_mensagem);
            setTicketAberto(null);
            carregar();
          }}
              className="flex items-center gap-2 text-sm text-[#3D6B4A] hover:text-[#2C5038] transition-colors"
            >
              <ChevronLeft size={18} /> Voltar
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-[#E8F0E6] overflow-hidden">
            {/* Ticket header */}
            <div className="px-6 py-5 border-b border-[#E8F0E6] bg-[#F7F9F5]">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-xs text-[#8FAF8A] mb-1">Ticket #{ticketAberto.id_mensagem}</p>
                  <h2 style={serif} className="text-xl font-semibold text-[#1A2E1A]">{ticketAberto.assunto}</h2>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <div className="flex items-center gap-1.5 text-xs text-[#6B9E63]">
                      <User size={13} />
                      <span>{ticketAberto.nome} ({ticketAberto.email})</span>
                    </div>
                    <span className="text-[#C8DFC4]">·</span>
                    <span className="text-xs text-[#8FAF8A]">{formatDate(ticketAberto.criado_em)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${estadoStyles[ticketAberto.estado]}`}>
                    {estadoLabels[ticketAberto.estado]}
                  </span>
                  {/* Estado dropdown */}
                  <select
                    value={novoEstado}
                    onChange={e => atualizarEstado(e.target.value)}
                    className="text-xs border border-[#E8F0E6] rounded-lg px-3 py-1.5 bg-white text-[#3D6B4A] outline-none cursor-pointer hover:border-[#3D6B4A] transition-colors"
                  >
                    <option value="aberta">Marcar Aberta</option>
                    <option value="respondida">Marcar Respondida</option>
                    <option value="fechada">Marcar Fechada</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Thread */}
            <div className="px-6 py-4 max-h-[420px] overflow-y-auto flex flex-col gap-4">
              {/* Mensagem original */}
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[#E8F0E6] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <User size={15} className="text-[#3D6B4A]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-[#2C3A2C]">{ticketAberto.nome}</span>
                    <span className="text-[10px] text-[#8FAF8A]">{formatDate(ticketAberto.criado_em)}</span>
                  </div>
                  <div className="bg-[#F7F9F5] rounded-xl rounded-tl-none px-4 py-3 text-sm text-[#2C3A2C] leading-relaxed border border-[#E8F0E6]">
                    {ticketAberto.mensagem}
                  </div>
                </div>
              </div>

              {/* Respostas */}
              {respostas.map(r => (
                <div key={r.id_resposta} className={`flex gap-3 ${r.is_admin ? "flex-row-reverse" : ""}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    r.is_admin ? "bg-[#3D6B4A]" : "bg-[#E8F0E6]"
                  }`}>
                    {r.is_admin
                      ? <Shield size={14} className="text-white" />
                      : <User size={15} className="text-[#3D6B4A]" />
                    }
                  </div>
                  <div className={`flex-1 ${r.is_admin ? "items-end" : ""} flex flex-col`}>
                    <div className={`flex items-center gap-2 mb-1 ${r.is_admin ? "flex-row-reverse" : ""}`}>
                      <span className="text-xs font-medium text-[#2C3A2C]">{r.is_admin ? "Suporte Lili Store" : ticketAberto.nome}</span>
                      <span className="text-[10px] text-[#8FAF8A]">{formatDate(r.criado_em)}</span>
                    </div>
                    <div className={`rounded-xl px-4 py-3 text-sm leading-relaxed border max-w-[85%] ${
                      r.is_admin
                        ? "bg-[#3D6B4A] text-white border-[#3D6B4A] rounded-tr-none"
                        : "bg-[#F7F9F5] text-[#2C3A2C] border-[#E8F0E6] rounded-tl-none"
                    }`}>
                      {r.mensagem}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Caixa de resposta */}
            {ticketAberto.estado !== "fechada" ? (
              <div className="px-6 py-4 border-t border-[#E8F0E6] bg-[#FAFCFA]">
                <div className="flex items-center gap-2 mb-2">
                  <Shield size={13} className="text-[#3D6B4A]" />
                  <span className="text-xs text-[#6B9E63] font-medium">Responder como Suporte Lili Store</span>
                </div>
                <div className="flex gap-3">
                  <textarea
                    rows={3}
                    value={respostaTexto}
                    onChange={e => setRespostaTexto(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && e.ctrlKey) enviarResposta(); }}
                    placeholder="Escreve a tua resposta... (Ctrl+Enter para enviar)"
                    className="flex-1 border border-[#E8F0E6] rounded-xl px-4 py-3 text-sm outline-none resize-none focus:border-[#3D6B4A] bg-white text-[#2C3A2C] placeholder:text-[#C8DFC4]"
                  />
                  <button
                    onClick={enviarResposta}
                    disabled={enviando || !respostaTexto.trim()}
                    className="self-end px-5 py-3 bg-[#3D6B4A] text-white rounded-xl text-sm flex items-center gap-2 hover:bg-[#2C5038] transition-colors disabled:opacity-40"
                  >
                    <Send size={15} />
                    {enviando ? "A enviar..." : "Enviar"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="px-6 py-4 border-t border-[#E8F0E6] bg-[#F7F9F5]">
                <p className="text-sm text-[#8FAF8A] text-center">Este ticket está fechado. Altera o estado para responder.</p>
              </div>
            )}
          </div>
        </div>
      </AdminLayout>
    );
  }

  // ── Lista de Tickets ─────────────────────────────────────────────────────────
  return (
    <AdminLayout>
      <div style={sans}>
        {/* Toast */}
        {toast && (
          <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl text-sm shadow-lg text-white ${
            toast.tipo === "erro" ? "bg-[#C0392B]" : "bg-[#3D6B4A]"
          }`}>{toast.msg}</div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 style={serif} className="text-3xl font-semibold text-[#1A2E1A]">Suporte ao Cliente</h1>
            <p className="text-sm text-[#8FAF8A] mt-1">Gere e responde às mensagens dos clientes</p>
          </div>
          <button
            onClick={carregar}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#E8F0E6] text-sm text-[#3D6B4A] hover:bg-[#F0F5EE] transition-colors"
          >
            <RefreshCw size={14} /> Atualizar
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Abertas", value: counts.aberta, color: "text-[#A67C00]", bg: "bg-[#FEF9E7]", icon: Clock },
            { label: "Respondidas", value: counts.respondida, color: "text-[#3D6B4A]", bg: "bg-[#E8F0E6]", icon: CheckCircle },
            { label: "Fechadas", value: counts.fechada, color: "text-[#888]", bg: "bg-[#F3F3F3]", icon: XCircle },
            { label: "Não Lidas", value: counts.naoLidas, color: "text-[#C0392B]", bg: "bg-[#FDECEA]", icon: MessageCircle },
          ].map(({ label, value, color, bg, icon: Icon }) => (
            <div key={label} className="bg-white rounded-2xl border border-[#E8F0E6] p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon size={18} className={color} />
              </div>
              <div>
                <p className={`text-xl font-semibold ${color}`}>{value}</p>
                <p className="text-xs text-[#8FAF8A]">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filtros + Pesquisa */}
        <div className="bg-white rounded-2xl border border-[#E8F0E6] p-4 mb-6 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-[#6B9E63]">
            <Filter size={14} /> Filtrar:
          </div>
          {["Todos", "aberta", "respondida", "fechada"].map(f => (
            <button key={f} onClick={() => setFiltro(f)}
              className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                filtro === f
                  ? "bg-[#3D6B4A] text-white"
                  : "border border-[#E8F0E6] text-[#4A5C4A] hover:border-[#3D6B4A]"
              }`}>
              {f === "Todos" ? "Todos" : estadoLabels[f]}
            </button>
          ))}
          <div className="flex-1 min-w-[200px] flex items-center gap-2 border border-[#E8F0E6] rounded-xl px-3 py-2">
            <Search size={14} className="text-[#8FAF8A]" />
            <input
              value={pesquisa}
              onChange={e => setPesquisa(e.target.value)}
              placeholder="Pesquisar por assunto, nome ou email..."
              className="flex-1 text-xs outline-none bg-transparent text-[#2C3A2C] placeholder:text-[#C8DFC4]"
            />
          </div>
        </div>

        {/* Tabela */}
        <div className="bg-white rounded-2xl border border-[#E8F0E6] overflow-hidden">
          {loading ? (
            <div className="p-10 text-center text-sm text-[#8FAF8A]">A carregar...</div>
          ) : filtrados.length === 0 ? (
            <div className="p-10 text-center">
              <MessageCircle size={40} className="text-[#C8DFC4] mx-auto mb-3" />
              <p className="text-sm text-[#8FAF8A]">Nenhum ticket encontrado.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E8F0E6] bg-[#F7F9F5]">
                  <th className="text-left px-5 py-3 text-xs text-[#6B9E63] font-medium uppercase tracking-wider">#</th>
                  <th className="text-left px-5 py-3 text-xs text-[#6B9E63] font-medium uppercase tracking-wider">Cliente</th>
                  <th className="text-left px-5 py-3 text-xs text-[#6B9E63] font-medium uppercase tracking-wider">Assunto</th>
                  <th className="text-left px-5 py-3 text-xs text-[#6B9E63] font-medium uppercase tracking-wider">Estado</th>
                  <th className="text-left px-5 py-3 text-xs text-[#6B9E63] font-medium uppercase tracking-wider">Respostas</th>
                  <th className="text-left px-5 py-3 text-xs text-[#6B9E63] font-medium uppercase tracking-wider">Data</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((t, i) => (
                  <tr
                    key={t.id_mensagem}
                    className={`border-b border-[#E8F0E6] last:border-0 hover:bg-[#F7F9F5] cursor-pointer transition-colors ${
                      !t.lida_admin ? "bg-[#FAFFF9]" : ""
                    }`}
                    onClick={() => abrirTicket(t.id_mensagem)}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        {!t.lida_admin && <span className="w-2 h-2 rounded-full bg-[#3D6B4A] inline-block" />}
                        <span className="text-[#8FAF8A]">#{t.id_mensagem}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-[#2C3A2C]">{t.nome}</p>
                      <p className="text-xs text-[#8FAF8A]">{t.email}</p>
                    </td>
                    <td className="px-5 py-3.5 max-w-[220px]">
                      <p className={`truncate ${!t.lida_admin ? "font-semibold text-[#1A2E1A]" : "text-[#2C3A2C]"}`}>
                        {t.assunto}
                      </p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${estadoStyles[t.estado]}`}>
                        {estadoLabels[t.estado]}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-[#8FAF8A]">{t.total_respostas}</td>
                    <td className="px-5 py-3.5 text-xs text-[#8FAF8A] whitespace-nowrap">{formatDate(t.criado_em)}</td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={e => { e.stopPropagation(); abrirTicket(t.id_mensagem); }}
                        className="px-3 py-1.5 text-xs border border-[#E8F0E6] rounded-lg text-[#3D6B4A] hover:bg-[#F0F5EE] transition-colors whitespace-nowrap"
                      >
                        Ver / Responder
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
