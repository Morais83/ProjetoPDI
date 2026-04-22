import { useState } from "react";
import AdminLayout from "./AdminLayout";

const utilizadoresIniciais = [
  { id: 1, nome: "Ana Silva", email: "ana@email.com", role: "Cliente", dataRegisto: "10/01/2026", encomendas: 3, estado: "Ativo" },
  { id: 2, nome: "Maria Santos", email: "maria@email.com", role: "Cliente", dataRegisto: "15/02/2026", encomendas: 1, estado: "Ativo" },
  { id: 3, nome: "Joana Costa", email: "joana@email.com", role: "Cliente", dataRegisto: "20/02/2026", encomendas: 2, estado: "Ativo" },
  { id: 4, nome: "Sofia Ferreira", email: "sofia@email.com", role: "Cliente", dataRegisto: "05/03/2026", encomendas: 1, estado: "Inativo" },
  { id: 5, nome: "Admin Lili", email: "admin@modachique.pt", role: "Admin", dataRegisto: "01/01/2026", encomendas: 0, estado: "Ativo" },
];

const roleStyles = {
  Admin: "bg-[#E8F0E6] text-[#3D6B4A]",
  Cliente: "bg-[#E6F1FB] text-[#185FA5]",
};

const estadoStyles = {
  Ativo: "bg-[#E8F0E6] text-[#3D6B4A]",
  Inativo: "bg-[#FDECEA] text-[#C0392B]",
};

const serif = { fontFamily: "'Cormorant Garamond', Georgia, serif" };
const sans = { fontFamily: "'Jost', sans-serif" };

export default function AdminUtilizadores() {
  const [utilizadores, setUtilizadores] = useState(utilizadoresIniciais);
  const [pesquisa, setPesquisa] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [utilizadorAberto, setUtilizadorAberto] = useState(null);
  const [form, setForm] = useState({ nome: "", email: "", role: "Cliente", estado: "Ativo" });
  const [editando, setEditando] = useState(null);

  const utilizadoresFiltrados = utilizadores.filter((u) =>
    u.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
    u.email.toLowerCase().includes(pesquisa.toLowerCase())
  );

  const abrirAdicionar = () => {
    setEditando(null);
    setForm({ nome: "", email: "", role: "Cliente", estado: "Ativo" });
    setModalAberto(true);
  };

  const abrirEditar = (u) => {
    setEditando(u.id);
    setForm({ nome: u.nome, email: u.email, role: u.role, estado: u.estado });
    setModalAberto(true);
  };

  const guardar = () => {
    if (!form.nome || !form.email) return;
    if (editando) {
      setUtilizadores((prev) => prev.map((u) => u.id === editando ? { ...u, ...form } : u));
    } else {
      setUtilizadores((prev) => [...prev, { id: Date.now(), ...form, dataRegisto: new Date().toLocaleDateString("pt-PT"), encomendas: 0 }]);
    }
    setModalAberto(false);
  };

  const eliminar = (id) => {
    if (window.confirm("Tens a certeza que queres eliminar este utilizador?")) {
      setUtilizadores((prev) => prev.filter((u) => u.id !== id));
    }
  };

  const toggleEstado = (id) => {
    setUtilizadores((prev) =>
      prev.map((u) => u.id === id ? { ...u, estado: u.estado === "Ativo" ? "Inativo" : "Ativo" } : u)
    );
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 style={serif} className="text-3xl font-semibold text-[#1A2E1A]">Utilizadores</h1>
        <button
          onClick={abrirAdicionar}
          className="bg-white border border-[#C8DFC4] text-[#3D6B4A] text-xs tracking-widest uppercase px-4 py-2.5 rounded-lg hover:bg-[#3D6B4A] hover:text-white transition-all"
        >
          + Adicionar Utilizador
        </button>
      </div>

      {/* Stats */}
      <div className="flex gap-3 mb-6">
        {[
          { label: "Total", valor: utilizadores.length, cor: "text-[#2C3A2C]" },
          { label: "Ativos", valor: utilizadores.filter(u => u.estado === "Ativo").length, cor: "text-[#3D6B4A]" },
          { label: "Admins", valor: utilizadores.filter(u => u.role === "Admin").length, cor: "text-[#A67C00]" },
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
          onChange={(e) => setPesquisa(e.target.value)}
          className="text-sm outline-none bg-transparent text-[#4A5C4A] placeholder:text-[#C8DFC4] w-full"
        />
      </div>

      {/* Tabela */}
      <div style={sans} className="bg-white rounded-xl border border-[#E8F0E6] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E8F0E6] bg-[#F7F9F5]">
              <th className="text-left px-5 py-3 text-[11px] tracking-widest uppercase text-[#6B9E63] font-medium">Utilizador</th>
              <th className="text-left px-5 py-3 text-[11px] tracking-widest uppercase text-[#6B9E63] font-medium">Role</th>
              <th className="text-left px-5 py-3 text-[11px] tracking-widest uppercase text-[#6B9E63] font-medium">Registo</th>
              <th className="text-left px-5 py-3 text-[11px] tracking-widest uppercase text-[#6B9E63] font-medium">Encomendas</th>
              <th className="text-left px-5 py-3 text-[11px] tracking-widest uppercase text-[#6B9E63] font-medium">Estado</th>
              <th className="text-left px-5 py-3 text-[11px] tracking-widest uppercase text-[#6B9E63] font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            {utilizadoresFiltrados.map((u, i) => (
              <tr key={u.id} className={`border-b border-[#E8F0E6] hover:bg-[#F7F9F5] transition-colors ${i % 2 === 0 ? "bg-white" : "bg-[#FAFCF9]"}`}>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#E8F0E6] flex items-center justify-center text-sm font-medium text-[#3D6B4A]">
                      {u.nome.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#2C3A2C]">{u.nome}</p>
                      <p className="text-xs text-[#8FAF8A]">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className={`text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-full font-medium ${roleStyles[u.role]}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-5 py-4 text-[#5C6E5C]">{u.dataRegisto}</td>
                <td className="px-5 py-4 text-center text-[#5C6E5C]">{u.encomendas}</td>
                <td className="px-5 py-4">
                  <span className={`text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-full font-medium ${estadoStyles[u.estado]}`}>
                    {u.estado}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex gap-3">
                    <button onClick={() => abrirEditar(u)} className="text-xs text-[#3D6B4A] hover:underline">Editar</button>
                    <button onClick={() => toggleEstado(u.id)} className="text-xs text-[#A67C00] hover:underline">
                      {u.estado === "Ativo" ? "Desativar" : "Ativar"}
                    </button>
                    <button onClick={() => eliminar(u.id)} className="text-xs text-[#C0392B] hover:underline">Eliminar</button>
                  </div>
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

      {/* Modal */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4" onClick={() => setModalAberto(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8" onClick={(e) => e.stopPropagation()}>
            <h2 style={serif} className="text-2xl font-semibold text-[#1A2E1A] mb-6">
              {editando ? "Editar Utilizador" : "Adicionar Utilizador"}
            </h2>
            <div style={sans} className="space-y-4">
              <div>
                <label className="block text-[11px] tracking-widest uppercase text-[#6B9E63] mb-1">Nome</label>
                <input type="text" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  className="w-full border-b border-[#C8DFC4] py-2 text-sm outline-none focus:border-[#3D6B4A] bg-transparent" placeholder="Nome completo" />
              </div>
              <div>
                <label className="block text-[11px] tracking-widest uppercase text-[#6B9E63] mb-1">Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border-b border-[#C8DFC4] py-2 text-sm outline-none focus:border-[#3D6B4A] bg-transparent" placeholder="email@exemplo.com" />
              </div>
              <div>
                <label className="block text-[11px] tracking-widest uppercase text-[#6B9E63] mb-2">Role</label>
                <div className="flex gap-3">
                  {["Cliente", "Admin"].map((r) => (
                    <button key={r} onClick={() => setForm({ ...form, role: r })}
                      className={`flex-1 py-2 rounded-full border text-xs transition-all ${form.role === r ? "bg-[#3D6B4A] text-white border-[#3D6B4A]" : "bg-white text-[#4A5C4A] border-[#C8DFC4] hover:border-[#3D6B4A]"}`}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[11px] tracking-widest uppercase text-[#6B9E63] mb-2">Estado</label>
                <div className="flex gap-3">
                  {["Ativo", "Inativo"].map((e) => (
                    <button key={e} onClick={() => setForm({ ...form, estado: e })}
                      className={`flex-1 py-2 rounded-full border text-xs transition-all ${form.estado === e ? "bg-[#3D6B4A] text-white border-[#3D6B4A]" : "bg-white text-[#4A5C4A] border-[#C8DFC4] hover:border-[#3D6B4A]"}`}>
                      {e}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setModalAberto(false)} className="flex-1 py-3 rounded-full border border-[#C8DFC4] text-sm text-[#5C6E5C] hover:bg-[#F0F5EE] transition-all">Cancelar</button>
              <button onClick={guardar} className="flex-1 py-3 rounded-full bg-[#3D6B4A] text-white text-sm hover:bg-[#2C5038] transition-all">Guardar</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}