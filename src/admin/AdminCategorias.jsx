import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";

const serif = { fontFamily: "'Cormorant Garamond', Georgia, serif" };

const categoriasPrincipais = [
  { id: 1, nome: "Roupa" },
  { id: 2, nome: "Calçado" },
  { id: 3, nome: "Acessórios" },
];

export default function AdminCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [abaAtiva, setAbaAtiva] = useState(1);
  const [modalAberto, setModalAberto] = useState(false);
  const [categoriaEditando, setCategoriaEditando] = useState(null);
  const [form, setForm] = useState({ nome_categoria: "", descricao: "", imagem: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarCategorias();
  }, []);

  const carregarCategorias = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categorias`);
      const dados = await res.json();
      setCategorias(dados);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const subcategorias = categorias.filter(c => c.id_categoria_pai === abaAtiva);

  const abrirAdicionar = () => {
    setCategoriaEditando(null);
    setForm({ nome_categoria: "", descricao: "", imagem: "" });
    setModalAberto(true);
  };

  const abrirEditar = (cat) => {
    setCategoriaEditando(cat.id_categoria);
    setForm({ 
      nome_categoria: cat.nome_categoria, 
      descricao: cat.descricao || "",
      imagem: cat.imagem || "" 
    });
    setModalAberto(true);
  };

  const eliminar = async (id) => {
    if (!window.confirm("Tens a certeza que queres eliminar esta categoria?")) return;
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/categorias/${id}`, { method: 'DELETE' });
      carregarCategorias();
    } catch (err) {
      console.error(err);
    }
  };

  // ── Função de Upload para o Cloudinary ──
  const handleUploadImagem = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('imagem', file);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/upload`, { 
        method: 'POST', 
        body: formData 
      });
      const dados = await res.json();
      if (dados.url) {
        setForm(prev => ({ ...prev, imagem: dados.url }));
      }
    } catch (err) {
      console.error("Erro ao fazer upload:", err);
    }
  };

  const removerImagem = () => {
    setForm(prev => ({ ...prev, imagem: "" }));
  };

  const guardar = async () => {
    if (!form.nome_categoria) return;
    try {
      if (categoriaEditando) {
        await fetch(`${import.meta.env.VITE_API_URL}/api/categorias/${categoriaEditando}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      } else {
        await fetch(`${import.meta.env.VITE_API_URL}/api/categorias`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, id_categoria_pai: abaAtiva }),
        });
      }
      setModalAberto(false);
      carregarCategorias();
    } catch (err) {
      console.error(err);
    }
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

      {/* Abas principais */}
      <div className="flex gap-3 mb-6 border-b border-[#E8F0E6] pb-4">
        {categoriasPrincipais.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setAbaAtiva(cat.id)}
            className={`text-sm px-5 py-2 rounded-full transition-all ${
              abaAtiva === cat.id
                ? "bg-[#3D6B4A] text-white"
                : "bg-white border border-[#C8DFC4] text-[#4A5C4A] hover:border-[#3D6B4A] hover:text-[#3D6B4A]"
            }`}
          >
            {cat.nome}
          </button>
        ))}
      </div>

      {/* Grid Subcategorias */}
      {loading ? (
        <p className="text-sm text-[#8FAF8A]">A carregar categorias...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-6 gap-5">
          {subcategorias.map((cat) => (
            <div key={cat.id_categoria} className="bg-white rounded-xl border border-[#E8F0E6] overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              
              <div className="bg-[#F0F5EE] h-60 flex items-center justify-center relative p-4 shrink-0">
                {cat.imagem ? (
                  <img src={cat.imagem} alt={cat.nome_categoria} className="w-full h-full object-contain" />
                ) : (
                  <span style={serif} className="text-5xl font-semibold text-[#3D6B4A]">
                    {cat.nome_categoria.charAt(0)}
                  </span>
                )}
              </div>
              
              <div className="p-4 flex flex-col flex-1">
                <p className="text-sm font-bold text-[#2C3A2C] mb-1 leading-tight">{cat.nome_categoria}</p>
                {cat.descricao && <p className="text-xs text-[#8FAF8A] mb-3 line-clamp-2 leading-relaxed">{cat.descricao}</p>}
                
                <div className="flex gap-4 mt-auto pt-3 border-t border-[#E8F0E6]">
                  <button onClick={() => abrirEditar(cat)} className="text-xs text-[#3D6B4A] hover:text-[#2C5038] font-medium transition-colors">Editar</button>
                  <button onClick={() => eliminar(cat.id_categoria)} className="text-xs text-[#C0392B] hover:text-[#922B21] font-medium transition-colors">Eliminar</button>
                </div>
              </div>
            </div>
          ))}

          {subcategorias.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p style={serif} className="text-2xl text-[#C8DFC4] mb-2">Nenhuma subcategoria encontrada</p>
              <p className="text-sm text-[#8FAF8A]">Clica em "+ Adicionar Categoria" para criar uma.</p>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4" onClick={() => setModalAberto(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8" onClick={(e) => e.stopPropagation()}>
            <h2 style={serif} className="text-2xl font-semibold text-[#1A2E1A] mb-1">
              {categoriaEditando ? "Editar Categoria" : "Adicionar Categoria"}
            </h2>
            <p className="text-xs text-[#8FAF8A] mb-6">
              {categoriaEditando ? "" : `A adicionar em: ${categoriasPrincipais.find(c => c.id === abaAtiva)?.nome}`}
            </p>
            
            <div className="space-y-4">
              
              {/* Upload da Imagem */}
              <div>
                <label className="block text-[11px] tracking-widest uppercase text-[#6B9E63] mb-2">Imagem (Opcional)</label>
                <div className="border border-[#E8F0E6] rounded-lg p-2">
                  {form.imagem ? (
                    <div className="relative">
                      <img src={form.imagem} alt="Preview" className="w-full h-32 object-cover rounded" />
                      <button
                        type="button"
                        onClick={removerImagem}
                        className="absolute top-2 right-2 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center text-[#C0392B] text-xs hover:bg-white hover:scale-110 transition-all shadow-sm"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-32 border border-dashed border-[#C8DFC4] rounded cursor-pointer hover:border-[#3D6B4A] transition-all bg-[#F0F5EE]/50 hover:bg-[#F0F5EE]">
                      <span className="text-2xl text-[#C8DFC4] mb-1">📷</span>
                      <span className="text-[10px] text-[#8FAF8A] uppercase tracking-wider">Clica para adicionar</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleUploadImagem}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Nome */}
              <div>
                <label className="block text-[11px] tracking-widest uppercase text-[#6B9E63] mb-1">Nome</label>
                <input
                  type="text"
                  value={form.nome_categoria}
                  onChange={(e) => setForm({ ...form, nome_categoria: e.target.value })}
                  className="w-full border-b border-[#C8DFC4] py-2 text-sm outline-none focus:border-[#3D6B4A] bg-transparent"
                  placeholder="Nome da categoria"
                />
              </div>
              
              {/* Descrição */}
              <div>
                <label className="block text-[11px] tracking-widest uppercase text-[#6B9E63] mb-1">Descrição</label>
                <input
                  type="text"
                  value={form.descricao}
                  onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                  className="w-full border-b border-[#C8DFC4] py-2 text-sm outline-none focus:border-[#3D6B4A] bg-transparent"
                  placeholder="Descrição (opcional)"
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