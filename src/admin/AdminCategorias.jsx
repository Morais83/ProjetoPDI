import { useState } from "react";
import AdminLayout from "./AdminLayout";

const categoriasIniciais = [
  { id: 1, nome: "Vestidos", emoji: "👗", totalProdutos: 2 },
  { id: 2, nome: "Blusas", emoji: "👚", totalProdutos: 1 },
  { id: 3, nome: "Calças e Calções", emoji: "👖", totalProdutos: 1 },
  { id: 4, nome: "T-shirt e Tops", emoji: "👕", totalProdutos: 1 },
  { id: 5, nome: "Casacos", emoji: "🧥", totalProdutos: 1 },
  { id: 6, nome: "Saias", emoji: "👗", totalProdutos: 1 },
  { id: 7, nome: "Sweatshirts e Hoodies", emoji: "👕", totalProdutos: 1 },
  { id: 8, nome: "Blazers e coletes", emoji: "🧥", totalProdutos: 1 },
];

const serif = { fontFamily: "'Cormorant Garamond', Georgia, serif" };

export default function AdminCategorias() {
  const [categorias, setCategorias] = useState(categoriasIniciais);
  const [modalAberto, setModalAberto] = useState(false);
  const [categoriaEditando, setCategoriaEditando] = useState(null);
  const [form, setForm] = useState({ nome: "", emoji: "👗" });

  const abrirAdicionar = () => {
    setCategoriaEditando(null);
    setForm({ nome: "", emoji: "👗" });
    setModalAberto(true);
  };

  const abrirEditar = (cat) => {
    setCategoriaEditando(cat.id);
    setForm({ nome: cat.nome, emoji: cat.emoji });
    setModalAberto(true);
  };

  const eliminar = (id) => {
    if (window.confirm("Tens a certeza que queres eliminar esta categoria?")) {
      setCategorias((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const guardar = () => {
    if (!form.nome) return;
    if (categoriaEditando) {
      setCategorias((prev) => prev.map((c) => c.id === categoriaEditando ? { ...c, ...form } : c));
    } else {
      setCategorias((prev) => [...prev, { id: Date.now(), ...form, totalProdutos: 0 }]);
    }
    setModalAberto(false);
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 style={serif} className="text-3xl font-semibold text-[#1A2E1A]">Categorias</h1>
        <button
          onClick={abrirAdicionar}
          className="bg-white border border-[#C8DFC4] text-[#3D6B4A] text-xs tracking-widest uppercase px-4 py-2.5 rounded-lg hover:bg-[#3D6B4A] hover:text-white transition-all"
        >
          + Adicionar Categoria
        </button>
      </div>

      {/* Grid Categorias */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categorias.map((cat) => (
          <div key={cat.id} className="bg-white rounded-xl border border-[#E8F0E6] overflow-hidden">
            <div className="bg-[#F0F5EE] h-28 flex items-center justify-center text-5xl">
              {cat.emoji}
            </div>
            <div className="p-3">
              <p className="text-sm font-medium text-[#2C3A2C] mb-1">{cat.nome}</p>
              <p className="text-xs text-[#8FAF8A] mb-3">{cat.totalProdutos} produtos</p>
              <div className="flex gap-3">
                <button onClick={() => abrirEditar(cat)} className="text-xs text-[#3D6B4A] hover:underline">Editar</button>
                <button onClick={() => eliminar(cat.id)} className="text-xs text-[#C0392B] hover:underline">Eliminar</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4" onClick={() => setModalAberto(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8" onClick={(e) => e.stopPropagation()}>
            <h2 style={serif} className="text-2xl font-semibold text-[#1A2E1A] mb-6">
              {categoriaEditando ? "Editar Categoria" : "Adicionar Categoria"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] tracking-widest uppercase text-[#6B9E63] mb-1">Nome</label>
                <input
                  type="text"
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  className="w-full border-b border-[#C8DFC4] py-2 text-sm outline-none focus:border-[#3D6B4A] bg-transparent"
                  placeholder="Nome da categoria"
                />
              </div>
              <div>
                <label className="block text-[11px] tracking-widest uppercase text-[#6B9E63] mb-1">Emoji</label>
                <input
                  type="text"
                  value={form.emoji}
                  onChange={(e) => setForm({ ...form, emoji: e.target.value })}
                  className="w-full border-b border-[#C8DFC4] py-2 text-sm outline-none focus:border-[#3D6B4A] bg-transparent"
                  placeholder="👗"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setModalAberto(false)} className="flex-1 py-3 rounded-full border border-[#C8DFC4] text-sm text-[#5C6E5C] hover:bg-[#F0F5EE] transition-all">
                Cancelar
              </button>
              <button onClick={guardar} className="flex-1 py-3 rounded-full bg-[#3D6B4A] text-white text-sm hover:bg-[#2C5038] transition-all">
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}