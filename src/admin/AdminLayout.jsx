import { Link, useLocation } from "react-router-dom";

export default function AdminLayout({ children }) {
  const location = useLocation();
  const sans = { fontFamily: "'Jost', sans-serif" };

  const links = [
    { label: "Categorias", path: "/admin/categorias" },
    { label: "Produtos", path: "/admin/produtos" },
    { label: "Encomendas", path: "/admin/encomendas" },
    { label: "Utilizadores", path: "/admin/utilizadores" },
  ];

  return (
    <div style={sans} className="min-h-screen flex bg-[#F7F9F5]">

      {/* Sidebar */}
      <div className="w-52 bg-[#3D6B4A] flex flex-col fixed top-0 left-0 h-full z-50">
        <div className="px-6 py-8 border-b border-[#2C5038]">
          <p className="text-white text-lg font-semibold">Gestão Interna</p>
        </div>

        <nav className="flex-1 px-4 py-6 flex flex-col gap-1">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-2.5 rounded-lg text-sm transition-all ${
                location.pathname === link.path
                  ? "bg-white text-[#3D6B4A] font-medium"
                  : "text-white hover:bg-[#2C5038]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="px-4 py-6 border-t border-[#2C5038] flex flex-col gap-1">
          <Link to="/" className="px-4 py-2.5 rounded-lg text-sm text-white hover:bg-[#2C5038] transition-all">
            Ver Site
          </Link>
          <button className="px-4 py-2.5 rounded-lg text-sm text-white hover:bg-[#2C5038] transition-all text-left">
            Sair
          </button>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="ml-52 flex-1 p-8">
        {children}
      </div>
    </div>
  );
}