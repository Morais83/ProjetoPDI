import { useState } from "react";
import AdminLayout from "./AdminLayout";

const encomendas = [
  { id: "#0001", cliente: "Ana Silva", email: "ana@email.com", data: "18/04/2026", total: "99,80", status: "Enviada", produtos: ["Blazer Alfaiataria", "T-shirt Algodão"] },
  { id: "#0002", cliente: "Maria Santos", email: "maria@email.com", data: "19/04/2026", total: "59,90", status: "Pendente", produtos: ["Vestido Linho Verde"] },
  { id: "#0003", cliente: "Joana Costa", email: "joana@email.com", data: "19/04/2026", total: "144,80", status: "Processando", produtos: ["Casaco Linho Bege", "Saia Midi Floral"] },
  { id: "#0004", cliente: "Sofia Ferreira", email: "sofia@email.com", data: "20/04/2026", total: "19,90", status: "Entregue", produtos: ["T-shirt Algodão"] },
  { id: "#0005", cliente: "Beatriz Oliveira", email: "beatriz@email.com", data: "20/04/2026", total: "104,80", status: "Pendente", produtos: ["Blusa Seda Rosa", "Calças Linho Branco"] },
  { id: "#0006", cliente: "Inês Rodrigues", email: "ines@email.com", data: "21/04/2026", total: "39,90", status: "Cancelada", produtos: ["Sweatshirt Oversized"] },
];

const statusStyles = {
  Pendente: "bg-[#FEF9E7] text-[#A67C00]",
  Processando: "bg-[#E6F1FB] text-[#185FA5]",
  Enviada: "bg-[#E8F0E6] text-[#3D6B4A]",
  Entregue: "bg-[#E8F0E6] text-[#2C5038]",
  Cancelada: "bg-[#FDECEA] text-[#C0392B]",
};

const todosStatus = ["Todos", "Pendente", "Processando", "Enviada", "Entregue", "Cancelada"];

const serif = { fontFamily: "'Cormorant Garamond', Georgia, serif" };
const sans = { fontFamily: "'Jost', sans-serif" };

export default function AdminEncomendas() {
  const [statusAtivo, setStatusAtivo] = useState("Todos");
  const [encomendaAberta, setEncomendaAberta] = useState(null);
  const [listaEncomendas, setListaEncomendas] = useState(encomendas);

  const encomendsFiltradas = statusAtivo === "Todos"
    ? listaEncomendas
    : listaEncomendas.filter((e) => e.status === statusAtivo);

  const atualizarStatus = (id, novoStatus) => {
    setListaEncomendas((prev) =>
      prev.map((e) => e.id === id ? { ...e, status: novoStatus } : e)
    );
    if (encomendaAberta?.id === id) {
      setEncomendaAberta((prev) => ({ ...prev, status: novoStatus }));
    }
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 style={serif} className="text-3xl font-semibold text-[#1A2E1A]">Encomendas</h1>
        <div className="flex gap-3">
          {[
            { label: "Total", valor: listaEncomendas.length, cor: "text-[#2C3A2C]" },
            { label: "Pendentes", valor: listaEncomendas.filter(e => e.status === "Pendente").length, cor: "text-[#A67C00]" },
            { label: "Enviadas", valor: listaEncomendas.filter(e => e.status === "Enviada").length, cor: "text-[#3D6B4A]" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white border border-[#E8F0E6] rounded-lg px-4 py-2 text-center">
              <p className={`text-lg font-semibold ${stat.cor}`}>{stat.valor}</p>
              <p className="text-[10px] text-[#8FAF8A] uppercase tracking-wide">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filtro Status */}
      <div className="flex gap-3 mb-6 border-b border-[#E8F0E6] pb-4 overflow-x-auto">
        {todosStatus.map((s) => (
          <button
            key={s}
            onClick={() => setStatusAtivo(s)}
            className={`text-sm whitespace-nowrap pb-1 border-b-2 transition-all ${
              statusAtivo === s
                ? "border-[#3D6B4A] text-[#3D6B4A] font-medium"
                : "border-transparent text-[#8FAF8A] hover:text-[#3D6B4A]"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Tabela */}
      <div style={sans} className="bg-white rounded-xl border border-[#E8F0E6] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E8F0E6] bg-[#F7F9F5]">
              <th className="text-left px-5 py-3 text-[11px] tracking-widest uppercase text-[#6B9E63] font-medium">Encomenda</th>
              <th className="text-left px-5 py-3 text-[11px] tracking-widest uppercase text-[#6B9E63] font-medium">Cliente</th>
              <th className="text-left px-5 py-3 text-[11px] tracking-widest uppercase text-[#6B9E63] font-medium">Data</th>
              <th className="text-left px-5 py-3 text-[11px] tracking-widest uppercase text-[#6B9E63] font-medium">Total</th>
              <th className="text-left px-5 py-3 text-[11px] tracking-widest uppercase text-[#6B9E63] font-medium">Status</th>
              <th className="text-left px-5 py-3 text-[11px] tracking-widest uppercase text-[#6B9E63] font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            {encomendsFiltradas.map((enc, i) => (
              <tr key={enc.id} className={`border-b border-[#E8F0E6] hover:bg-[#F7F9F5] transition-colors ${i % 2 === 0 ? "bg-white" : "bg-[#FAFCF9]"}`}>
                <td className="px-5 py-4 font-medium text-[#2C3A2C]">{enc.id}</td>
                <td className="px-5 py-4">
                  <p className="text-sm text-[#2C3A2C]">{enc.cliente}</p>
                  <p className="text-xs text-[#8FAF8A]">{enc.email}</p>
                </td>
                <td className="px-5 py-4 text-[#5C6E5C]">{enc.data}</td>
                <td className="px-5 py-4 font-medium text-[#3D6B4A]">{enc.total}€</td>
                <td className="px-5 py-4">
                  <span className={`text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-full font-medium ${statusStyles[enc.status]}`}>
                    {enc.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <button
                    onClick={() => setEncomendaAberta(enc)}
                    className="text-xs text-[#3D6B4A] hover:underline"
                  >
                    Ver detalhes
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {encomendsFiltradas.length === 0 && (
          <div className="text-center py-12">
            <p style={serif} className="text-2xl text-[#C8DFC4]">Nenhuma encomenda encontrada</p>
          </div>
        )}
      </div>

      {/* Modal Detalhes */}
      {encomendaAberta && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4" onClick={() => setEncomendaAberta(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 style={serif} className="text-2xl font-semibold text-[#1A2E1A]">Encomenda {encomendaAberta.id}</h2>
              <button onClick={() => setEncomendaAberta(null)} className="w-8 h-8 flex items-center justify-center rounded-full border border-[#E8F0E6] text-[#6B9E63] hover:bg-[#F0F5EE] transition-all text-sm">✕</button>
            </div>

            <div style={sans} className="space-y-4">
              <div className="bg-[#F7F9F5] rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs text-[#8FAF8A]">Cliente</span>
                  <span className="text-sm text-[#2C3A2C]">{encomendaAberta.cliente}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-[#8FAF8A]">Email</span>
                  <span className="text-sm text-[#2C3A2C]">{encomendaAberta.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-[#8FAF8A]">Data</span>
                  <span className="text-sm text-[#2C3A2C]">{encomendaAberta.data}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-[#8FAF8A]">Total</span>
                  <span className="text-sm font-semibold text-[#3D6B4A]">{encomendaAberta.total}€</span>
                </div>
              </div>

              <div>
                <p className="text-[11px] tracking-widests uppercase text-[#6B9E63] mb-2 font-medium">Produtos</p>
                <div className="space-y-1">
                  {encomendaAberta.produtos.map((p, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-[#4A5C4A]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3D6B4A]" />
                      {p}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[11px] tracking-widest uppercase text-[#6B9E63] mb-2 font-medium">Atualizar Status</p>
                <div className="flex flex-wrap gap-2">
                  {["Pendente", "Processando", "Enviada", "Entregue", "Cancelada"].map((s) => (
                    <button
                      key={s}
                      onClick={() => atualizarStatus(encomendaAberta.id, s)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                        encomendaAberta.status === s
                          ? "bg-[#3D6B4A] text-white border-[#3D6B4A]"
                          : "bg-white text-[#4A5C4A] border-[#C8DFC4] hover:border-[#3D6B4A]"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button onClick={() => setEncomendaAberta(null)} className="w-full mt-6 py-3 rounded-full border border-[#C8DFC4] text-sm text-[#5C6E5C] hover:bg-[#F0F5EE] transition-all">
              Fechar
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}