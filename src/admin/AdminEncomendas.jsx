import { useState, useEffect } from "react";
import AdminLayout from "./adminlayout";

const statusStyles = {
  pendente: "bg-[#FEF9E7] text-[#A67C00]",
  confirmado: "bg-[#E6F1FB] text-[#185FA5]",
  enviado: "bg-[#E8F0E6] text-[#3D6B4A]",
  entregue: "bg-[#E8F0E6] text-[#2C5038]",
  cancelado: "bg-[#FDECEA] text-[#C0392B]",
};

const statusLabels = {
  pendente: "Pendente",
  confirmado: "Confirmado",
  enviado: "Enviado",
  entregue: "Entregue",
  cancelado: "Cancelado",
};

const todosStatus = ["Todos", "pendente", "confirmado", "enviado", "entregue", "cancelado"];

const serif = { fontFamily: "'Cormorant Garamond', Georgia, serif" };
const sans = { fontFamily: "'Jost', sans-serif" };

export default function AdminEncomendas() {
  const [encomendas, setEncomendas] = useState([]);
  const [statusAtivo, setStatusAtivo] = useState("Todos");
  const [encomendaAberta, setEncomendaAberta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pesquisa, setPesquisa] = useState("");
  

  useEffect(() => {
    carregarEncomendas();
  }, []);

  const carregarEncomendas = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/encomendas');
      const dados = await res.json();
      setEncomendas(dados);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const abrirDetalhes = async (enc) => {
    try {
      const res = await fetch(`http://localhost:5000/api/encomendas/${enc.id_encomenda}`);
      const dados = await res.json();
      setEncomendaAberta(dados);
    } catch (err) {
      console.error(err);
    }
  };

  const atualizarEstado = async (id, novoEstado) => {
    try {
      await fetch(`http://localhost:5000/api/encomendas/${id}/estado`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: novoEstado }),
      });
      setEncomendaAberta(prev => ({ ...prev, estado: novoEstado }));
      setEncomendas(prev => prev.map(e => e.id_encomenda === id ? { ...e, estado: novoEstado } : e));
    } catch (err) {
      console.error(err);
    }
  };

  const encomendsFiltradas = (statusAtivo === "Todos" ? encomendas : encomendas.filter(e => e.estado === statusAtivo))
  .filter(e =>
    e.nome?.toLowerCase().includes(pesquisa.toLowerCase()) ||
    String(e.id_encomenda).padStart(4, '0').includes(pesquisa)
  );

  const formatData = (data) => new Date(data).toLocaleDateString('pt-PT');

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 style={serif} className="text-3xl font-semibold text-[#1A2E1A]">Encomendas</h1>
        <div className="flex gap-3">
          {[
            { label: "Total", valor: encomendas.length, cor: "text-[#2C3A2C]" },
            { label: "Pendentes", valor: encomendas.filter(e => e.estado === "pendente").length, cor: "text-[#A67C00]" },
            { label: "Enviadas", valor: encomendas.filter(e => e.estado === "enviado").length, cor: "text-[#3D6B4A]" },
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
            {s === "Todos" ? "Todos" : statusLabels[s]}
          </button>
        ))}
      </div>

      <div style={sans} className="flex items-center border border-[#C8DFC4] rounded-lg px-4 py-2.5 bg-white gap-2 mb-6 max-w-sm">
        <span className="text-sm text-[#8FAF8A]">🔍</span>
        <input
          type="text"
          placeholder="Pesquisar por nº ou nome do cliente..."
          value={pesquisa}
          onChange={e => setPesquisa(e.target.value)}
          className="text-sm outline-none bg-transparent text-[#4A5C4A] placeholder:text-[#C8DFC4] w-full"
        />
      </div>

      {/* Tabela */}
      {loading ? (
        <p className="text-sm text-[#8FAF8A]">A carregar encomendas...</p>
      ) : (
        <div style={sans} className="bg-white rounded-xl border border-[#E8F0E6] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E8F0E6] bg-[#F7F9F5]">
                <th className="text-left px-5 py-3 text-[11px] tracking-widest uppercase text-[#6B9E63] font-medium">Encomenda</th>
                <th className="text-left px-5 py-3 text-[11px] tracking-widest uppercase text-[#6B9E63] font-medium">Cliente</th>
                <th className="text-left px-5 py-3 text-[11px] tracking-widest uppercase text-[#6B9E63] font-medium">Data</th>
                <th className="text-left px-5 py-3 text-[11px] tracking-widest uppercase text-[#6B9E63] font-medium">Total</th>
                <th className="text-left px-5 py-3 text-[11px] tracking-widest uppercase text-[#6B9E63] font-medium">Pagamento</th>
                <th className="text-left px-5 py-3 text-[11px] tracking-widest uppercase text-[#6B9E63] font-medium">Status</th>
                <th className="text-left px-5 py-3 text-[11px] tracking-widest uppercase text-[#6B9E63] font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {encomendsFiltradas.map((enc, i) => (
                <tr key={enc.id_encomenda} className={`border-b border-[#E8F0E6] hover:bg-[#F7F9F5] transition-colors ${i % 2 === 0 ? "bg-white" : "bg-[#FAFCF9]"}`}>
                  <td className="px-5 py-4 font-medium text-[#2C3A2C]">#{String(enc.id_encomenda).padStart(4, '0')}</td>
                  <td className="px-5 py-4">
                    <p className="text-sm text-[#2C3A2C]">{enc.nome}</p>
                    <p className="text-xs text-[#8FAF8A]">{enc.email}</p>
                  </td>
                  <td className="px-5 py-4 text-[#5C6E5C]">{formatData(enc.data_pedido)}</td>
                  <td className="px-5 py-4 font-medium text-[#3D6B4A]">{parseFloat(enc.total_pago).toFixed(2)}€</td>
                  <td className="px-5 py-4 text-xs text-[#5C6E5C] uppercase">{enc.metodo_pagamento}</td>
                  <td className="px-5 py-4">
                    <span className={`text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-full font-medium ${statusStyles[enc.estado]}`}>
                      {statusLabels[enc.estado]}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button onClick={() => abrirDetalhes(enc)} className="text-xs text-[#3D6B4A] hover:underline">
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
      )}

      {/* Modal Detalhes */}
      {encomendaAberta && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4" onClick={() => setEncomendaAberta(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 style={serif} className="text-2xl font-semibold text-[#1A2E1A]">
                Encomenda #{String(encomendaAberta.id_encomenda).padStart(4, '0')}
              </h2>
              <button onClick={() => setEncomendaAberta(null)} className="w-8 h-8 flex items-center justify-center rounded-full border border-[#E8F0E6] text-[#6B9E63] hover:bg-[#F0F5EE] text-sm">✕</button>
            </div>

            <div style={sans} className="space-y-4">

              {/* Info Cliente */}
              <div className="bg-[#F7F9F5] rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs text-[#8FAF8A]">Cliente</span>
                  <span className="text-sm text-[#2C3A2C]">{encomendaAberta.nome}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-[#8FAF8A]">Email</span>
                  <span className="text-sm text-[#2C3A2C]">{encomendaAberta.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-[#8FAF8A]">Data</span>
                  <span className="text-sm text-[#2C3A2C]">{formatData(encomendaAberta.data_pedido)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-[#8FAF8A]">Pagamento</span>
                  <span className="text-sm text-[#2C3A2C] uppercase">{encomendaAberta.metodo_pagamento}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-[#8FAF8A]">Portes</span>
                  <span className="text-sm text-[#2C3A2C]">{parseFloat(encomendaAberta.portes_envio) === 0 ? 'Grátis' : `${parseFloat(encomendaAberta.portes_envio).toFixed(2)}€`}</span>
                </div>
                <div className="flex justify-between border-t border-[#E8F0E6] pt-2">
                  <span className="text-xs text-[#8FAF8A]">Total</span>
                  <span className="text-sm font-semibold text-[#3D6B4A]">{parseFloat(encomendaAberta.total_pago).toFixed(2)}€</span>
                </div>
              </div>

              {/* Morada */}
              {encomendaAberta.rua && (
                <div className="bg-[#F7F9F5] rounded-lg p-4">
                  <p className="text-[11px] tracking-widest uppercase text-[#6B9E63] mb-2">Morada de Entrega</p>
                  <p className="text-sm text-[#2C3A2C]">{encomendaAberta.rua}</p>
                  <p className="text-sm text-[#2C3A2C]">{encomendaAberta.codigo_postal} {encomendaAberta.cidade}</p>
                  <p className="text-sm text-[#2C3A2C]">{encomendaAberta.pais}</p>
                </div>
              )}

              {/* Produtos */}
              <div>
                <p className="text-[11px] tracking-widest uppercase text-[#6B9E63] mb-2 font-medium">Produtos</p>
                <div className="space-y-2">
                  {encomendaAberta.linhas?.map((l, i) => (
                    <div key={i} className="flex items-center justify-between bg-[#F7F9F5] rounded-lg p-3">
                      <div>
                        <p className="text-sm text-[#2C3A2C]">{l.nome_produto}</p>
                        <p className="text-xs text-[#8FAF8A]">Tam: {l.tamanho} · Cor: {l.cor} · Qtd: {l.quantidade}</p>
                      </div>
                      <p className="text-sm font-medium text-[#3D6B4A]">{parseFloat(l.preco_unitario).toFixed(2)}€</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Atualizar Estado */}
              <div>
                <p className="text-[11px] tracking-widest uppercase text-[#6B9E63] mb-2 font-medium">Atualizar Estado</p>
                <div className="flex flex-wrap gap-2">
                  {["pendente", "confirmado", "enviado", "entregue", "cancelado"].map((s) => (
                    <button
                      key={s}
                      onClick={() => atualizarEstado(encomendaAberta.id_encomenda, s)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                        encomendaAberta.estado === s
                          ? "bg-[#3D6B4A] text-white border-[#3D6B4A]"
                          : "bg-white text-[#4A5C4A] border-[#C8DFC4] hover:border-[#3D6B4A]"
                      }`}
                    >
                      {statusLabels[s]}
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