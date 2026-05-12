import { useState, useEffect } from "react";
import AdminLayout from "./adminlayout";

const roleStyles = {
  admin: "bg-[#E8F0E6] text-[#3D6B4A]",
  cliente: "bg-[#E6F1FB] text-[#185FA5]",
};

const serif = { fontFamily: "'Cormorant Garamond', Georgia, serif" };
const sans = { fontFamily: "'Jost', sans-serif" };

export default function AdminUtilizadores() {
  const [utilizadores, setUtilizadores] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({ nome: "", email: "", perfil: "cliente" });
  const [loading, setLoading] = useState(true);

  const adminAtual = JSON.parse(localStorage.getItem('utilizador'));

  useEffect(() => {
    carregarUtilizadores();
  }, []);

  const carregarUtilizadores = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/utilizadores`);
      const dados = await res.json();
      setUtilizadores(dados);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const utilizadoresFiltrados = utilizadores.filter(u =>
    u.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
    u.email.toLowerCase().includes(pesquisa.toLowerCase())
  );

  const abrirEditar = (u) => {
    setEditando(u.id_utilizador);
    setForm({ nome: u.nome, email: u.email, perfil: u.perfil });
    setModalAberto(true);
  };

  const guardar = async () => {
    if (!form.nome || !form.email) return;
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/utilizadores/${editando}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setModalAberto(false);
      carregarUtilizadores();
    } catch (err) {
      console.error(err);
    }
  };

  const eliminar = async (id) => {
    if (!window.confirm("Tens a certeza que queres eliminar este utilizador?")) return;
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/utilizadores/${id}`, { method: 'DELETE' });
      carregarUtilizadores();
    } catch (err) {
      console.error(err);
    }
  };

  const isAdmin = (u) => u.perfil === 'admin';
  const isSelf = (u) => u.id_utilizador === adminAtual?.id;

  const formatData = (data) => new Date(data).toLocaleDateString('pt-PT');

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 style={serif} className="text-3xl font-semibold text-[#1A2E1A]">Utilizadores</h1>
      </div>

      {/* Stats */}
      <div className="flex gap-3 mb-6">
        {[
          { label: "Total", valor: utilizadores.length, cor: "text-[#2C3A2C]" },
          { label: "Clientes", valor: utilizadores.filter(u => u.perfil === "cliente").length, cor: "text-[#185FA5]" },
          { label: "Admins", valor: utilizadores.filter(u => u.perfil === "admin").length, cor: "text-[#A67C00]" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-[#E8F0E6] rounded-lg px-4 py-2 text-center">
            <p className={`text-lg font-semibold ${stat.cor}`}>{stat.valor}</p>
            <p className="text-[10px] text-[#8FAF8A] uppercase tracking-wide">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Pesquisa */}
      <div style={sans} className="flex items-center border border-[#C8DFC4] rounded-lg px-4 py-2.5 bg-white gap-2 mb-6 max-w-sm">
        <span className="text-sm text-[#8FAF8A]">🔍</span>
        <input
          type="text"
          placeholder="Pesquisar por nome ou email..."
          value={pesquisa}
          onChange={e => setPesquisa(e.target.value)}
          className="text-sm outline-none bg-transparent text-[#4A5C4A] placeholder:text-[#C8DFC4] w-full"
        />
      </div>

      {/* Tabela */}
      {loading ? (
        <p className="text-sm text-[#8FAF8A]">A carregar utilizadores...</p>
      ) : (
        <div style={sans} className="bg-white rounded-xl border border-[#E8F0E6] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E8F0E6] bg-[#F7F9F5]">
                <th className="text-left px-5 py-3 text-[11px] tracking-widest uppercase text-[#6B9E63] font-medium">Utilizador</th>
                <th className="text-left px-5 py-3 text-[11px] tracking-widest uppercase text-[#6B9E63] font-medium">Perfil</th>
                <th className="text-left px-5 py-3 text-[11px] tracking-widest uppercase text-[#6B9E63] font-medium">Registo</th>
                <th className="text-left px-5 py-3 text-[11px] tracking-widest uppercase text-[#6B9E63] font-medium">Encomendas</th>
                <th className="text-left px-5 py-3 text-[11px] tracking-widest uppercase text-[#6B9E63] font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {utilizadoresFiltrados.map((u, i) => (
                <tr key={u.id_utilizador} className={`border-b border-[#E8F0E6] hover:bg-[#F7F9F5] transition-colors ${i % 2 === 0 ? "bg-white" : "bg-[#FAFCF9]"}`}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#E8F0E6] flex items-center justify-center text-sm font-medium text-[#3D6B4A]">
                        {u.nome.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#2C3A2C]">
                          {u.nome}
                          {isSelf(u) && <span className="ml-2 text-[10px] text-[#8FAF8A]">(tu)</span>}
                        </p>
                        <p className="text-xs text-[#8FAF8A]">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-full font-medium ${roleStyles[u.perfil]}`}>
                      {u.perfil}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[#5C6E5C]">{formatData(u.data_criada)}</td>
                  <td className="px-5 py-4 text-center text-[#5C6E5C]">{u.total_encomendas}</td>
                  <td className="px-5 py-4">
                    {isSelf(u) ? (
                      <span className="text-xs text-[#C8DFC4]">—</span>
                    ) : (
                      <div className="flex gap-3">
                        <button onClick={() => abrirEditar(u)} className="text-xs text-[#3D6B4A] hover:underline">Editar</button>
                        {!isAdmin(u) && (
                          <button onClick={() => eliminar(u.id_utilizador)} className="text-xs text-[#C0392B] hover:underline">Eliminar</button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {utilizadoresFiltrados.length === 0 && (
            <div className="text-center py-12">
              <p style={serif} className="text-2xl text-[#C8DFC4]">Nenhum utilizador encontrado</p>
            </div>
          )}
        </div>
      )}

      {/* Modal Editar */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4" onClick={() => setModalAberto(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8" onClick={e => e.stopPropagation()}>
            <h2 style={serif} className="text-2xl font-semibold text-[#1A2E1A] mb-6">Editar Utilizador</h2>
            <div style={sans} className="space-y-4">
              <div>
                <label className="block text-[11px] tracking-widest uppercase text-[#6B9E63] mb-1">Nome</label>
                <input type="text" value={form.nome}
                  onChange={e => setForm({ ...form, nome: e.target.value })}
                  className="w-full border-b border-[#C8DFC4] py-2 text-sm outline-none focus:border-[#3D6B4A] bg-transparent"
                  placeholder="Nome completo" />
              </div>
              <div>
                <label className="block text-[11px] tracking-widest uppercase text-[#6B9E63] mb-1">Email</label>
                <input type="email" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full border-b border-[#C8DFC4] py-2 text-sm outline-none focus:border-[#3D6B4A] bg-transparent"
                  placeholder="email@exemplo.com" />
              </div>
              <div>
                <label className="block text-[11px] tracking-widest uppercase text-[#6B9E63] mb-2">Perfil</label>
                <div className="flex gap-3">
                  {["cliente", "admin"].map(p => (
                    <button key={p} onClick={() => setForm({ ...form, perfil: p })}
                      className={`flex-1 py-2 rounded-full border text-xs transition-all capitalize ${
                        form.perfil === p
                          ? "bg-[#3D6B4A] text-white border-[#3D6B4A]"
                          : "bg-white text-[#4A5C4A] border-[#C8DFC4] hover:border-[#3D6B4A]"
                      }`}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setModalAberto(false)}
                className="flex-1 py-3 rounded-full border border-[#C8DFC4] text-sm text-[#5C6E5C] hover:bg-[#F0F5EE] transition-all">
                Cancelar
              </button>
              <button onClick={guardar}
                className="flex-1 py-3 rounded-full bg-[#3D6B4A] text-white text-sm hover:bg-[#2C5038] transition-all">
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}