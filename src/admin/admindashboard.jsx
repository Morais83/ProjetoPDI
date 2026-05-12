import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingCart, Users, Package, Tag,
  TrendingUp, Clock, CheckCircle, XCircle,
  ChevronRight, Award,
} from "lucide-react";
import AdminLayout from "./adminlayout";

const serif = { fontFamily: "'Cormorant Garamond', Georgia, serif" };
const sans  = { fontFamily: "'Jost', sans-serif" };
const BASE  = `${import.meta.env.VITE_API_URL}/api`;

const statusStyles = {
  pendente:   { bg: "bg-[#FEF9E7]", text: "text-[#A67C00]",  label: "Pendente"   },
  confirmado: { bg: "bg-[#E6F1FB]", text: "text-[#185FA5]",  label: "Confirmado" },
  enviado:    { bg: "bg-[#E8F0E6]", text: "text-[#3D6B4A]",  label: "Enviado"    },
  entregue:   { bg: "bg-[#E8F0E6]", text: "text-[#2C5038]",  label: "Entregue"   },
  cancelado:  { bg: "bg-[#FDECEA]", text: "text-[#C0392B]",  label: "Cancelado"  },
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

export default function AdminDashboard() {
  const [encomendas,    setEncomendas]    = useState([]);
  const [utilizadores,  setUtilizadores]  = useState([]);
  const [produtos,      setProdutos]      = useState([]);
  const [loading,       setLoading]       = useState(true);

  const utilizador = JSON.parse(localStorage.getItem("utilizador") || "{}");
  const hora       = new Date().getHours();
  const saudacao   = hora < 12 ? "Bom dia" : hora < 19 ? "Boa tarde" : "Boa noite";

  useEffect(() => {
    Promise.all([
      fetch(`${BASE}/encomendas`).then(r => r.json()).catch(() => []),
      fetch(`${BASE}/utilizadores`).then(r => r.json()).catch(() => []),
      fetch(`${BASE}/produtos`).then(r => r.json()).catch(() => []),
    ]).then(([enc, util, prod]) => {
      setEncomendas(Array.isArray(enc)  ? enc  : []);
      setUtilizadores(Array.isArray(util) ? util : []);
      setProdutos(Array.isArray(prod) ? prod : []);
      setLoading(false);
    });
  }, []);

  const receita      = encomendas.filter(e => e.estado !== "cancelado").reduce((s, e) => s + parseFloat(e.total_pago || 0), 0);
  const pendentes    = encomendas.filter(e => e.estado === "pendente").length;
  const recentes     = [...encomendas].sort((a, b) => new Date(b.data_pedido) - new Date(a.data_pedido)).slice(0, 6);

  const stats = [
    {
      label:   "Encomendas",
      valor:   encomendas.length,
      sub:     `${pendentes} pendente${pendentes !== 1 ? "s" : ""}`,
      icon:    ShoppingCart,
      cor:     "#3D6B4A",
      bg:      "#F0F5EE",
      path:    "/admin/encomendas",
    },
    {
      label:   "Receita Total",
      valor:   `${receita.toFixed(2)}€`,
      sub:     "encomendas confirmadas",
      icon:    TrendingUp,
      cor:     "#185FA5",
      bg:      "#E6F1FB",
      path:    "/admin/encomendas",
    },
    {
      label:   "Utilizadores",
      valor:   utilizadores.length,
      sub:     `${utilizadores.filter(u => u.perfil === "admin").length} admin`,
      icon:    Users,
      cor:     "#7B4FA6",
      bg:      "#F3EEF9",
      path:    "/admin/utilizadores",
    },
    {
      label:   "Produtos",
      valor:   produtos.length,
      sub:     "no catálogo",
      icon:    Package,
      cor:     "#A67C00",
      bg:      "#FEF9E7",
      path:    "/admin/produtos",
    },
  ];

  const atalhos = [
    { label: "Categorias",   path: "/admin/categorias",   icon: Tag         },
    { label: "Marcas",       path: "/admin/marcas",       icon: Award       },
    { label: "Produtos",     path: "/admin/produtos",     icon: Package     },
    { label: "Encomendas",   path: "/admin/encomendas",   icon: ShoppingCart},
    { label: "Utilizadores", path: "/admin/utilizadores", icon: Users       },
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Encomendas Recentes */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E8F0E6] overflow-hidden">
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

          {/* Atalhos Rápidos */}
          <div className="bg-white rounded-2xl border border-[#E8F0E6] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E8F0E6]">
              <h2 style={serif} className="text-xl font-semibold text-[#1A2E1A]">Acesso Rápido</h2>
            </div>
            <nav className="p-3 space-y-1">
              {atalhos.map(({ label, path, icon: Icon }) => (
                <Link key={path} to={path}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-[#4A5C4A] hover:bg-[#F0F5EE] hover:text-[#3D6B4A] transition-all group">
                  <div className="w-8 h-8 rounded-lg bg-[#F7F9F5] group-hover:bg-[#E8F0E6] flex items-center justify-center flex-shrink-0 transition-colors">
                    <Icon size={15} className="text-[#6B9E63]" />
                  </div>
                  <span className="flex-1">{label}</span>
                  <ChevronRight size={13} className="text-[#C8DFC4] group-hover:text-[#3D6B4A] transition-colors" />
                </Link>
              ))}
            </nav>

            {/* Resumo por estado */}
            {!loading && (
              <div className="mx-4 mb-4 p-4 bg-[#F7F9F5] rounded-xl space-y-2.5">
                <p className="text-[10px] uppercase tracking-widest text-[#8FAF8A] font-semibold mb-3">Estado das Encomendas</p>
                {[
                  { key: "pendente",   icon: Clock,         cor: "#A67C00" },
                  { key: "confirmado", icon: CheckCircle,   cor: "#185FA5" },
                  { key: "enviado",    icon: TrendingUp,    cor: "#3D6B4A" },
                  { key: "cancelado",  icon: XCircle,       cor: "#C0392B" },
                ].map(({ key, icon: Icon, cor }) => {
                  const count = encomendas.filter(e => e.estado === key).length;
                  return (
                    <div key={key} className="flex items-center gap-2">
                      <Icon size={12} style={{ color: cor }} />
                      <span className="text-xs text-[#5C6E5C] flex-1 capitalize">{statusStyles[key]?.label}</span>
                      <span className="text-xs font-semibold text-[#2C3A2C]">{count}</span>
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
