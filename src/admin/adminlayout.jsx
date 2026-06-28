import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Tag, Award, Package, ShoppingCart, Users,
  Headphones, Globe, LogOut, Menu, X,
  ChevronRight, LayoutDashboard,
} from "lucide-react";
import { io as socketIO } from "socket.io-client";

const sans  = { fontFamily: "'Jost', sans-serif" };
const serif = { fontFamily: "'Cormorant Garamond', Georgia, serif" };

const links = [
  { label: "Dashboard",     path: "/admin",               icon: LayoutDashboard },
  { label: "Categorias",    path: "/admin/categorias",    icon: Tag         },
  { label: "Marcas",        path: "/admin/marcas",        icon: Award       },
  { label: "Produtos",      path: "/admin/produtos",      icon: Package     },
  { label: "Encomendas",    path: "/admin/encomendas",    icon: ShoppingCart},
  { label: "Utilizadores",  path: "/admin/utilizadores",  icon: Users       },
  { label: "Suporte",       path: "/admin/suporte",       icon: Headphones  },
];

export default function AdminLayout({ children }) {
  const location               = useLocation();
  const [drawerAberto, setDrawerAberto] = useState(false);
  const [naoLidasSuporte, setNaoLidasSuporte] = useState(0);

  // Fecha drawer ao mudar de página
  useEffect(() => { setDrawerAberto(false); }, [location.pathname]);

  // Carregar contagem inicial de mensagens não lidas + socket
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // Busca inicial
    fetch(`${import.meta.env.VITE_API_URL}/api/suporte/admin/todas`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(dados => {
        if (Array.isArray(dados)) {
          setNaoLidasSuporte(dados.filter(t => !t.lida_admin).length);
        }
      })
      .catch(() => {});

    // Socket.io — atualiza badge em tempo real
    const socket = socketIO(import.meta.env.VITE_API_URL || 'http://localhost:5000');
    socket.emit('entrar_admin');

    socket.on('nova_mensagem_suporte', () => setNaoLidasSuporte(n => n + 1));
    socket.on('cliente_respondeu', () => setNaoLidasSuporte(n => n + 1));

    return () => socket.disconnect();
  }, []);

  // Bloqueia scroll quando drawer mobile está aberto
  useEffect(() => {
    document.body.style.overflow = drawerAberto ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerAberto]);

  const utilizador = JSON.parse(localStorage.getItem("utilizador") || "{}");

  const sair = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("utilizador");
    window.location.href = "/login";
  };

  const SidebarConteudo = ({ mobile = false }) => (
    <div className="flex flex-col h-full">
      {/* Logo / Header */}
      <div className={`${mobile ? "px-5 py-5" : "px-6 py-7"} border-b border-[#2C5038]`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
            <LayoutDashboard size={16} className="text-white" />
          </div>
          <div>
            <p style={serif} className="text-white text-base font-semibold leading-tight">Moda Chique</p>
            <p className="text-[#A8C4A8] text-[10px] tracking-widest uppercase">Gestão Interna</p>
          </div>
        </div>
        {utilizador?.nome && (
          <div className="mt-4 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
              {utilizador.nome.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-medium truncate">{utilizador.nome}</p>
              <p className="text-[#8FAF8A] text-[10px] truncate">{utilizador.email}</p>
            </div>
          </div>
        )}
      </div>

      {/* Navegação */}
      <nav className="flex-1 px-3 py-5 flex flex-col gap-0.5 overflow-y-auto">
        <p className="text-[10px] text-[#6B9E63] uppercase tracking-widest font-semibold px-3 mb-2">Menu</p>
        {links.map(({ label, path, icon: Icon }) => {
          const ativo = path === "/admin"
            ? location.pathname === "/admin"
            : location.pathname === path;
          const isSuporte = path === "/admin/suporte";
          // Limpa badge quando entra na página de suporte
          if (ativo && isSuporte && naoLidasSuporte > 0) {
            setTimeout(() => setNaoLidasSuporte(0), 500);
          }
          return (
            <Link key={path} to={path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all group ${
                ativo
                  ? "bg-white text-[#3D6B4A] font-medium shadow-sm"
                  : "text-[#C8DFC4] hover:bg-[#2C5038] hover:text-white"
              }`}>
              <Icon size={16} className={ativo ? "text-[#3D6B4A]" : "text-[#6B9E63] group-hover:text-white transition-colors"} />
              <span className="flex-1">{label}</span>
              {isSuporte && naoLidasSuporte > 0 && !ativo && (
                <span className="bg-[#C0392B] text-white text-[9px] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center">
                  {naoLidasSuporte}
                </span>
              )}
              {ativo && <ChevronRight size={13} className="text-[#3D6B4A] opacity-60" />}
            </Link>
          );
        })}
      </nav>

      {/* Rodapé */}
      <div className="px-3 py-4 border-t border-[#2C5038] flex flex-col gap-0.5">
        <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#C8DFC4] hover:bg-[#2C5038] hover:text-white transition-all">
          <Globe size={16} className="text-[#6B9E63]" />
          Ver Site
        </Link>
        <button onClick={sair}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#C8DFC4] hover:bg-[#C0392B]/20 hover:text-[#FF8A80] transition-all text-left w-full">
          <LogOut size={16} className="text-[#6B9E63]" />
          Sair
        </button>
      </div>
    </div>
  );

  return (
    <div style={sans} className="min-h-screen flex bg-[#F0F4EF]">

      {/* ── Sidebar desktop ── */}
      <aside className="hidden md:flex w-56 bg-[#3D6B4A] flex-col fixed top-0 left-0 h-full z-50 shadow-xl shadow-black/10">
        <SidebarConteudo />
      </aside>

      {/* ── Topbar mobile ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#3D6B4A] h-14 flex items-center justify-between px-4 shadow-lg">
        <button onClick={() => setDrawerAberto(true)} className="p-1.5 text-white/80 hover:text-white transition-colors">
          <Menu size={22} />
        </button>
        <div className="text-center">
          <p style={serif} className="text-white text-base font-semibold leading-none">Moda Chique</p>
          <p className="text-[#A8C4A8] text-[9px] tracking-widest uppercase">Admin</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold text-white">
          {utilizador?.nome?.charAt(0)?.toUpperCase() || "A"}
        </div>
      </div>

      {/* ── Drawer mobile — overlay ── */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 md:hidden ${drawerAberto ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setDrawerAberto(false)}
      />

      {/* ── Drawer mobile — painel ── */}
      <div className={`fixed top-0 left-0 h-full w-64 z-50 bg-[#3D6B4A] shadow-2xl flex flex-col transition-transform duration-300 ease-in-out md:hidden ${drawerAberto ? "translate-x-0" : "-translate-x-full"}`}>
        <button onClick={() => setDrawerAberto(false)}
          className="absolute top-4 right-4 p-1.5 text-white/60 hover:text-white transition-colors">
          <X size={20} />
        </button>
        <SidebarConteudo mobile />
      </div>

      {/* ── Conteúdo ── */}
      <div className="md:ml-56 flex-1 flex flex-col min-h-screen">
        {/* Espaço para topbar no mobile */}
        <div className="md:hidden h-14 flex-shrink-0" />

        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
