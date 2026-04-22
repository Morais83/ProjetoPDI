import { useState } from "react";
import AdminLayout from "./AdminLayout";

const produtosIniciais = [
  { id: 1, nome: "Blazer Alfaiataria", categoria: "Blazers e coletes", stock: 12, preco: "39,90", emoji: "🧥" },
  { id: 2, nome: "Vestido Linho Verde", categoria: "Vestidos", stock: 8, preco: "59,90", emoji: "👗" },
  { id: 3, nome: "Casaco Linho Bege", categoria: "Casacos", stock: 5, preco: "94,90", emoji: "🧥" },
  { id: 4, nome: "Saia Midi Floral", categoria: "Saias", stock: 15, preco: "44,90", emoji: "👗" },
  { id: 5, nome: "T-shirt Algodão", categoria: "T-shirt e Tops", stock: 30, preco: "19,90", emoji: "👕" },
  { id: 6, nome: "Calças Linho Branco", categoria: "Calças e Calções", stock: 10, preco: "54,90", emoji: "👖" },
  { id: 7, nome: "Blusa Seda Rosa", categoria: "Blusas", stock: 7, preco: "49,90", emoji: "👚" },
  { id: 8, nome: "Sweatshirt Oversized", categoria: "Sweatshirts e Hoodies", stock: 20, preco: "39,90", emoji: "👕" },
];

const categoriasFiltro = ["Todas", "Blazers e coletes", "Vestidos", "Casacos", "Saias", "T-shirt e Tops", "Calças e Calções", "Blusas", "Sweatshirts e Hoodies"];

const serif = { fontFamily: "'Cormorant Garamond', Georgia, serif" };

export default function AdminProdutos() {
  const [produtos, setProdutos] = useState(produtosIniciais);
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todas");
  const [modalAberto, setModalAberto] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState(null);
  const [form, setForm] = useState({ nome: "", categoria: "", stock: "", preco: "", emoji: "👕" });

  const produtosFiltrados = categoriaAtiva === "Todas"
    ? produtos
    : produtos.filter((p) => p.categoria === categoriaAtiva);

  const abrirAdicionar = () => {
    setProdutoEditando(null);
    setForm({ nome: "", categoria: "", stock: "", preco: "", emoji: "👕" });
    setModalAberto(true);
  };

  const abrirEditar = (prod) => {
    setProdutoEditando(prod.id);
    setForm({ nome: prod.nome, categoria: prod.categoria, stock: prod.stock, preco: prod.preco, emoji: prod.emoji });
    setModalAberto(true);
  };

  const eliminar = (id) => {
    if (window.confirm("Tens a certeza que queres eliminar este produto?")) {
      setProdutos((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const guardar = () => {
    if (!form.nome || !form.categoria || !form.preco) return;
    if (produtoEditando) {
      setProdutos((prev) => prev.map((p) => p.id === produtoEditando ? { ...p, ...form } : p));
    } else {
      setProdutos((prev) => [...prev, { id: Date.now(), ...form }]);
    }
    setModalAberto(false);
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 style={serif} className="text-3xl font-semibold text-[#1A2E1A]">Produtos</h1>
        <button
          onClick={abrirAdicionar}
          className="bg-white border border-[#C8DFC4] text-[#3D6B4A] text-xs tracking-widest uppercase px-4 py-2.5 rounded-lg hover:bg-[#3D6B4A] hover:text-white transition-all"
        >
          + Adicionar Produto
        </button>
      </div>

      {/* Filtro Categorias */}
      <div className="flex gap-3 mb-6 border-b border-[#E8F0E6] pb-4 overflow-x-auto">
        {categoriasFiltro.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoriaAtiva(cat)}
            className={`text-sm whitespace-nowrap pb-1 border-b-2 transition-all ${
              categoriaAtiva === cat
                ? "border-[#3D6B4A] text-[#3D6B4A] font-medium"
                : "border-transparent text-[#8FAF8A] hover:text-[#3D6B4A]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid Produtos */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {produtosFiltrados.map((prod) => (
          <div key={prod.id} className="bg-white rounded-xl border border-[#E8F0E6] overflow-hidden">
            <div className="bg-[#F0F5EE] h-32 flex items-center justify-center text-5xl">
              {prod.emoji}
            </div>
            <div className="p-3">
              <p className="text-sm font-medium text-[#2C3A2C] mb-1 truncate">{prod.nome}</p>
              <p className="text-xs text-[#8FAF8A] mb-1">{prod.categoria}</p>
              <p className="text-xs text-[#5C6E5C] mb-3">Stock: {prod.stock} &nbsp;|&nbsp; {prod.preco}€</p>
              <div className="flex gap-3">
                <button onClick={() => abrirEditar(prod)} className="text-xs text-[#3D6B4A] hover:underline">Editar</button>
                <button onClick={() => eliminar(prod.id)} className="text-xs text-[#C0392B] hover:underline">Eliminar</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Adicionar/Editar */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4" onClick={() => setModalAberto(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8" onClick={(e) => e.stopPropagation()}>
            <h2 style={serif} className="text-2xl font-semibold text-[#1A2E1A] mb-6">
              {produtoEditando ? "Editar Produto" : "Adicionar Produto"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] tracking-widest uppercase text-[#6B9E63] mb-1">Nome</label>
                <input
                  type="text"
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  className="w-full border-b border-[#C8DFC4] py-2 text-sm outline-none focus:border-[#3D6B4A] bg-transparent"
                  placeholder="Nome do produto"
                />
              </div>
              <div>
                <label className="block text-[11px] tracking-widest uppercase text-[#6B9E63] mb-1">Categoria</label>
                <input
                  type="text"
                  value={form.categoria}
                  onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                  className="w-full border-b border-[#C8DFC4] py-2 text-sm outline-none focus:border-[#3D6B4A] bg-transparent"
                  placeholder="Categoria"
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-[11px] tracking-widests uppercase text-[#6B9E63] mb-1">Preço (€)</label>
                  <input
                    type="text"
                    value={form.preco}
                    onChange={(e) => setForm({ ...form, preco: e.target.value })}
                    className="w-full border-b border-[#C8DFC4] py-2 text-sm outline-none focus:border-[#3D6B4A] bg-transparent"
                    placeholder="ex: 39,90"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-[11px] tracking-widest uppercase text-[#6B9E63] mb-1">Stock</label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="w-full border-b border-[#C8DFC4] py-2 text-sm outline-none focus:border-[#3D6B4A] bg-transparent"
                    placeholder="0"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] tracking-widest uppercase text-[#6B9E63] mb-1">Emoji</label>
                <input
                  type="text"
                  value={form.emoji}
                  onChange={(e) => setForm({ ...form, emoji: e.target.value })}
                  className="w-full border-b border-[#C8DFC4] py-2 text-sm outline-none focus:border-[#3D6B4A] bg-transparent"
                  placeholder="👕"
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