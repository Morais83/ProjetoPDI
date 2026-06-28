import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingCart, Users, Package, Tag,
  TrendingUp, Clock, CheckCircle, XCircle,
  ChevronRight,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import AdminLayout from "./adminlayout";

const serif = { fontFamily: "'Cormorant Garamond', Georgia, serif" };
const sans  = { fontFamily: "'Jost', sans-serif" };
const BASE  = `${import.meta.env.VITE_API_URL}/api`;

const statusStyles = {
  pendente:   { bg: "bg-[#FEF9E7]", text: "text-[#A67C00]",  label: "Pendente",   cor: "#A67C00" },
  confirmado: { bg: "bg-[#E6F1FB]", text: "text-[#185FA5]",  label: "Confirmado", cor: "#185FA5" },
  enviado:    { bg: "bg-[#E8F0E6]", text: "text-[#3D6B4A]",  label: "Enviado",    cor: "#3D6B4A" },
  entregue:   { bg: "bg-[#E8F0E6]", text: "text-[#2C5038]",  label: "Entregue",   cor: "#2C5038" },
  cancelado:  { bg: "bg-[#FDECEA]", text: "text-[#C0392B]",  label: "Cancelado",  cor: "#C0392B" },
};

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-[#E8F0E6] p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-[#E8F0E6]" />
        <div className="w-16 h-3 rounded bg-[#E8F0E6]" />
      </div>
      <div className="w-20 h-7 rounded bg-[#E8F0E6] mb-1" />
      <div className="w-28 h-3 rounded bg-[#E8F0E6]" />
    </div>
  );
}

// ── Tooltip personalizado para o gráfico de barras ────────────────────────────
function TooltipBarras({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#E8F0E6] rounded-xl shadow-lg px-4 py-3 text-xs" style={sans}>
      <p className="font-semibold text-[#1A2E1A] mb-2">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }} className="mb-0.5">
          {p.name === "encomendas" ? "Encomendas" : "Receita"}: {p.name === "receita" ? `${p.value.toFixed(2)}€` : p.value}
        </p>
      ))}
    </div>
  );
}

// ── Tooltip personalizado para o donut ───────────────────────────────────────
function TooltipDonut({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#E8F0E6] rounded-xl shadow-lg px-4 py-3 text-xs" style={sans}>
      <p className="font-semibold text-[#1A2E1A]">{payload[0].name}</p>
      <p style={{ color: payload[0].payload.cor }}>{payload[0].value} encomenda{payload[0].value !== 1 ? "s" : ""}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const [encomendas,    setEncomendas]    = useState([]);
  const [utilizadores,  setUtilizadores]  = useState([]);
  const [produtos,      setProdutos]      = useState([]);
  const [loading,       setLoading]       = useState(true);

  const utilizador = JSON.parse(localStorage.getItem("utilizador") || "{}");
  const hora       = new Date().getHours();
  const saudacao   = hora < 12 ? "Bom dia" : hora < 19 ? "Boa tarde" : "Boa noite";

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    Promise.all([
      fetch(`${BASE}/encomendas`, { headers }).then(r => r.json()).catch(() => []),
      fetch(`${BASE}/utilizadores`, { headers }).then(r => r.json()).catch(() => []),
      fetch(`${BASE}/produtos`).then(r => r.json()).catch(() => []),
    ]).then(([enc, util, prod]) => {
      setEncomendas(Array.isArray(enc)  ? enc  : []);
      setUtilizadores(Array.isArray(util) ? util : []);
      setProdutos(Array.isArray(prod) ? prod : []);
      setLoading(false);
    });
  }, []);

  const receita   = encomendas.filter(e => e.estado !== "cancelado").reduce((s, e) => s + parseFloat(e.total_pago || 0), 0);
  const pendentes = encomendas.filter(e => e.estado === "pendente").length;
  const recentes  = [...encomendas].sort((a, b) => new Date(b.data_pedido) - new Date(a.data_pedido)).slice(0, 6);

  // ── Dados para o gráfico de barras (últimos 6 meses) ─────────────────────────
  const dadosBarras = (() => {
    const meses = [];
    const hoje = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const label = d.toLocaleDateString("pt-PT", { month: "short" });
      const enc = encomendas.filter(e => {
        const m = new Date(e.data_pedido);
        return m.getFullYear() === d.getFullYear() && m.getMonth() === d.getMonth();
      });
      meses.push({
        mes: label.charAt(0).toUpperCase() + label.slice(1).replace(".", ""),
        encomendas: enc.length,
        receita: parseFloat(enc.filter(e => e.estado !== "cancelado").reduce((s, e) => s + parseFloat(e.total_pago || 0), 0).toFixed(2)),
      });
    }
    return meses;
  })();

  // ── Dados para o gráfico donut (por estado) ───────────────────────────────────
  const dadosDonut = Object.entries(statusStyles)
    .map(([key, s]) => ({
      name: s.label,
      value: encomendas.filter(e => e.estado === key).length,
      cor: s.cor,
    }))
    .filter(d => d.value > 0);

  const stats = [
    { label: "Encomendas",   valor: encomendas.length,    sub: `${pendentes} pendente${pendentes !== 1 ? "s" : ""}`, icon: ShoppingCart, cor: "#3D6B4A", bg: "#F0F5EE", path: "/admin/encomendas" },
    { label: "Receita Total", valor: `${receita.toFixed(2)}€`, sub: "encomendas confirmadas", icon: TrendingUp, cor: "#185FA5", bg: "#E6F1FB", path: "/admin/encomendas" },
    { label: "Utilizadores", valor: utilizadores.length,  sub: `${utilizadores.filter(u => u.perfil === "admin").length} admin`, icon: Users, cor: "#7B4FA6", bg: "#F3EEF9", path: "/admin/utilizadores" },
    { label: "Produtos",     valor: produtos.length,      sub: "no catálogo", icon: Package, cor: "#A67C00", bg: "#FEF9E7", path: "/admin/produtos" },
  ];

  const formatData = (d) => new Date(d).toLocaleDateString("pt-PT", { day: "2-digit", month: "short" });

  return (
    <AdminLayout>
      <div style={sans}>

        {/* Saudação */}
        <div className="mb-8">
          <p className="text-xs tracking-[0.2em] uppercase text-[#6B9E63] mb-1">{saudacao}</p>
          <h1 style={serif} className="text-4xl font-semibold text-[#1A2E1A]">
            {utilizador?.nome?.split(" ")[0] || "Admin"}
          </h1>
          <p className="text-sm text-[#8FAF8A] mt-1">
            {new Date().toLocaleDateString("pt-PT", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {loading
            ? Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
            : stats.map(({ label, valor, sub, icon: Icon, cor, bg, path }) => (
              <Link key={label} to={path}
                className="bg-white rounded-2xl border border-[#E8F0E6] p-5 hover:shadow-md hover:-translate-y-0.5 transition-all group">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: bg }}>
                    <Icon size={18} style={{ color: cor }} />
                  </div>
                  <ChevronRight size={14} className="text-[#C8DFC4] group-hover:text-[#3D6B4A] transition-colors" />
                </div>
                <p className="text-2xl font-semibold text-[#1A2E1A] mb-0.5">{valor}</p>
                <p className="text-xs text-[#8FAF8A]">{label}</p>
                <p className="text-[10px] text-[#A8C4A8] mt-1">{sub}</p>
              </Link>
            ))
          }
        </div>

        {/* ── Gráficos ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

          {/* Gráfico de barras — últimos 6 meses */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E8F0E6] p-6">
            <h2 style={serif} className="text-xl font-semibold text-[#1A2E1A] mb-1">Atividade dos Últimos 6 Meses</h2>
            <p className="text-xs text-[#8FAF8A] mb-5">Encomendas e receita por mês</p>
            {loading ? (
              <div className="h-48 animate-pulse bg-[#F0F5EE] rounded-xl" />
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={dadosBarras} barGap={4} barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8F0E6" vertical={false} />
                  <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "#8FAF8A" }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="enc" orientation="left"  tick={{ fontSize: 10, fill: "#8FAF8A" }} axisLine={false} tickLine={false} width={24} />
                  <YAxis yAxisId="rec" orientation="right" tick={{ fontSize: 10, fill: "#8FAF8A" }} axisLine={false} tickLine={false} width={40} tickFormatter={v => `${v}€`} />
                  <Tooltip content={<TooltipBarras />} cursor={{ fill: "#F7F9F5" }} />
                  <Bar yAxisId="enc" dataKey="encomendas" name="encomendas" fill="#3D6B4A" radius={[6, 6, 0, 0]} maxBarSize={28} />
                  <Bar yAxisId="rec" dataKey="receita"    name="receita"    fill="#C8DFC4" radius={[6, 6, 0, 0]} maxBarSize={28} />
                </BarChart>
              </ResponsiveContainer>
            )}
            {/* Legenda */}
            <div className="flex items-center gap-5 mt-3">
              <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[#3D6B4A] inline-block" /><span className="text-xs text-[#8FAF8A]">Encomendas</span></div>
              <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[#C8DFC4] inline-block" /><span className="text-xs text-[#8FAF8A]">Receita</span></div>
            </div>
          </div>

          {/* Gráfico donut — por estado */}
          <div className="bg-white rounded-2xl border border-[#E8F0E6] p-6">
            <h2 style={serif} className="text-xl font-semibold text-[#1A2E1A] mb-1">Estado das Encomendas</h2>
            <p className="text-xs text-[#8FAF8A] mb-4">Distribuição por estado</p>
            {loading ? (
              <div className="h-48 animate-pulse bg-[#F0F5EE] rounded-xl" />
            ) : dadosDonut.length === 0 ? (
              <div className="h-48 flex items-center justify-center">
                <p style={serif} className="text-[#C8DFC4] text-lg">Sem dados</p>
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie
                      data={dadosDonut}
                      cx="50%" cy="50%"
                      innerRadius={45} outerRadius={72}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {dadosDonut.map((entry, i) => (
                        <Cell key={i} fill={entry.cor} />
                      ))}
                    </Pie>
                    <Tooltip content={<TooltipDonut />} />
                  </PieChart>
                </ResponsiveContainer>
                {/* Legenda manual */}
                <div className="space-y-1.5 mt-2">
                  {dadosDonut.map(d => (
                    <div key={d.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.cor }} />
                        <span className="text-xs text-[#5C6E5C]">{d.name}</span>
                      </div>
                      <span className="text-xs font-semibold text-[#1A2E1A]">{d.value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Encomendas Recentes ── */}
        <div>
          <div className="bg-white rounded-2xl border border-[#E8F0E6] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E8F0E6] flex items-center justify-between">
              <h2 style={serif} className="text-xl font-semibold text-[#1A2E1A]">Encomendas Recentes</h2>
              <Link to="/admin/encomendas"
                className="text-xs text-[#6B9E63] hover:text-[#3D6B4A] flex items-center gap-1 transition-colors">
                Ver todas <ChevronRight size={12} />
              </Link>
            </div>

            {loading ? (
              <div className="p-6 space-y-3">
                {Array(5).fill(0).map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#E8F0E6]" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 bg-[#E8F0E6] rounded w-1/3" />
                      <div className="h-2.5 bg-[#E8F0E6] rounded w-1/2" />
                    </div>
                    <div className="w-16 h-6 bg-[#E8F0E6] rounded-full" />
                  </div>
                ))}
              </div>
            ) : recentes.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart size={32} className="text-[#C8DFC4] mx-auto mb-3" />
                <p style={serif} className="text-xl text-[#C8DFC4]">Sem encomendas ainda</p>
              </div>
            ) : (
              <div className="divide-y divide-[#F0F5EE]">
                {recentes.map(enc => {
                  const st = statusStyles[enc.estado] || {};
                  return (
                    <div key={enc.id_encomenda} className="flex items-center gap-4 px-6 py-3.5 hover:bg-[#FAFCFA] transition-colors">
                      <div className="w-9 h-9 rounded-xl bg-[#F0F5EE] flex items-center justify-center flex-shrink-0">
                        <ShoppingCart size={14} className="text-[#3D6B4A]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#2C3A2C] truncate">
                          #{String(enc.id_encomenda).padStart(4, "0")} · {enc.nome}
                        </p>
                        <p className="text-xs text-[#8FAF8A]">{formatData(enc.data_pedido)} · {parseFloat(enc.total_pago).toFixed(2)}€</p>
                      </div>
                      <span className={`text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${st.bg} ${st.text}`}>
                        {st.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </AdminLayout>
  );
}
