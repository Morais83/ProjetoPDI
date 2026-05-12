import { useState, useEffect } from "react";
import AdminLayout from "./adminlayout";
import { Search, Camera } from "lucide-react";
const serif = { fontFamily: "'Cormorant Garamond', Georgia, serif" };

export default function AdminMarcas() {
  const [marcas, setMarcas] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [marcaEditando, setMarcaEditando] = useState(null);
  const [form, setForm] = useState({ nome_marca: "", descricao: "", imagem_url: "" });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    carregarMarcas();
  }, []);

  const carregarMarcas = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/marcas`);
      const dados = await res.json();
      setMarcas(dados);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const marcasFiltradas = marcas.filter(m =>
    m.nome_marca.toLowerCase().includes(pesquisa.toLowerCase()) ||
    m.descricao?.toLowerCase().includes(pesquisa.toLowerCase())
  );

  const abrirAdicionar = () => {
    setMarcaEditando(null);
    setForm({ nome_marca: "", descricao: "", imagem_url: "" });
    setModalAberto(true);
  };

  const abrirEditar = (m) => {
    setMarcaEditando(m.id_marca);
    setForm({ nome_marca: m.nome_marca, descricao: m.descricao || "", imagem_url: m.imagem_url || "" });
    setModalAberto(true);
  };

  const eliminar = async (id) => {
    if (!window.confirm("Tens a certeza que queres eliminar esta marca?")) return;
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/marcas/${id}`, { method: 'DELETE' });
      carregarMarcas();
    } catch (err) {
      console.error(err);
    }
  };

  const uploadImagem = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('imagem', file);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });
      const dados = await res.json();
      setForm(prev => ({ ...prev, imagem_url: dados.url }));
    } catch (err) {
      console.error(err);
    }
    setUploading(false);
  };

  const guardar = async () => {
    if (!form.nome_marca) return;
    try {
      if (marcaEditando) {
        await fetch(`${import.meta.env.VITE_API_URL}/api/marcas/${marcaEditando}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      } else {
        await fetch(`${import.meta.env.VITE_API_URL}/api/marcas`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      }
      setModalAberto(false);
      carregarMarcas();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 style={serif} className="text-3xl font-semibold text-[#1A2E1A]">Marcas</h1>
        <button
          onClick={abrirAdicionar}
          className="bg-white border border-[#C8DFC4] text-[#3D6B4A] text-xs tracking-widest uppercase px-4 py-2.5 rounded-lg hover:bg-[#3D6B4A] hover:text-white transition-all"
        >
          + Adicionar Marca
        </button>
      </div>

      {/* Pesquisa e Stats */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 items-center">
        <div className="flex items-center border border-[#C8DFC4] rounded-lg px-4 py-2.5 bg-white gap-2 w-full max-w-sm">
          <Search size={18} strokeWidth={1.5} />
          <input
            type="text"
            placeholder="Pesquisar por nome ou descrição..."
            value={pesquisa}
            onChange={e => setPesquisa(e.target.value)}
            className="text-sm outline-none bg-transparent text-[#4A5C4A] placeholder:text-[#C8DFC4] w-full"
          />
        </div>
        <div className="bg-white border border-[#E8F0E6] rounded-lg px-6 py-2 text-center">
          <p className="text-lg font-semibold text-[#2C3A2C] leading-none">{marcas.length}</p>
          <p className="text-[9px] text-[#8FAF8A] uppercase tracking-widest mt-1">Total Marcas</p>
        </div>
      </div>

      {/* Grid Marcas (Estilo Categorias) */}
      {loading ? (
        <p className="text-sm text-[#8FAF8A]">A carregar marcas...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-6 gap-5">
          {marcasFiltradas.map(m => (
            <div key={m.id_marca} className="bg-white rounded-xl border border-[#E8F0E6] overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              
              <div className="bg-[#F0F5EE] h-48 flex items-center justify-center relative p-6 shrink-0">
                {m.imagem_url ? (
                  <img loading="lazy" src={m.imagem_url} alt={m.nome_marca} className="w-full h-full object-contain" />
                ) : (
                  <span style={serif} className="text-5xl font-semibold text-[#3D6B4A]">
                    {m.nome_marca.charAt(0)}
                  </span>
                )}
              </div>
              
              <div className="p-4 flex flex-col flex-1">
                <p className="text-sm font-bold text-[#2C3A2C] mb-1 leading-tight">{m.nome_marca}</p>
                {m.descricao && <p className="text-xs text-[#8FAF8A] mb-3 line-clamp-2 leading-relaxed">{m.descricao}</p>}
                
                <div className="flex gap-4 mt-auto pt-3 border-t border-[#E8F0E6]">
                  <button onClick={() => abrirEditar(m)} className="text-xs text-[#3D6B4A] hover:text-[#2C5038] font-medium transition-colors">Editar</button>
                  <button onClick={() => eliminar(m.id_marca)} className="text-xs text-[#C0392B] hover:text-[#922B21] font-medium transition-colors">Eliminar</button>
                </div>
              </div>
            </div>
          ))}

          {marcasFiltradas.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p style={serif} className="text-2xl text-[#C8DFC4] mb-2">Nenhuma marca encontrada</p>
              <p className="text-sm text-[#8FAF8A]">Verifica o termo de pesquisa ou adiciona uma nova.</p>
            </div>
          )}
        </div>
      )}

      {/* Modal (Design Atualizado) */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4" onClick={() => setModalAberto(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8" onClick={e => e.stopPropagation()}>
            <h2 style={serif} className="text-2xl font-semibold text-[#1A2E1A] mb-6">
              {marcaEditando ? "Editar Marca" : "Adicionar Marca"}
            </h2>

            <div className="space-y-5">
              {/* Upload da Imagem */}
              <div>
                <label className="block text-[11px] tracking-widest uppercase text-[#6B9E63] mb-2 font-medium">Logo da Marca</label>
                <div className="border border-[#E8F0E6] rounded-lg p-2">
                  {form.imagem_url ? (
                    <div className="relative">
                      <img loading="lazy" src={form.imagem_url} alt="Preview" className="w-full h-32 object-contain rounded bg-[#F0F5EE]/30" />
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, imagem_url: "" })}
                        className="absolute top-2 right-2 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center text-[#C0392B] text-xs hover:bg-white hover:scale-110 transition-all shadow-sm"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-32 border border-dashed border-[#C8DFC4] rounded cursor-pointer hover:border-[#3D6B4A] transition-all bg-[#F0F5EE]/50 hover:bg-[#F0F5EE]">
                      <Camera size={18} strokeWidth={1.5} />
                      <span className="text-[10px] text-[#8FAF8A] uppercase tracking-wider">
                        {uploading ? "A carregar..." : "Upload do Logo"}
                      </span>
                      <input type="file" accept="image/*" className="hidden" onChange={uploadImagem} />
                    </label>
                  )}
                </div>
              </div>

              {/* Nome */}
              <div>
                <label className="block text-[11px] tracking-widest uppercase text-[#6B9E63] mb-1 font-medium">Nome</label>
                <input
                  type="text"
                  value={form.nome_marca}
                  onChange={e => setForm({ ...form, nome_marca: e.target.value })}
                  className="w-full border-b border-[#C8DFC4] py-2 text-sm outline-none focus:border-[#3D6B4A] bg-transparent"
                  placeholder="Ex: Levi's"
                />
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-[11px] tracking-widest uppercase text-[#6B9E63] mb-1 font-medium">Descrição Curta</label>
                <input
                  type="text"
                  value={form.descricao}
                  onChange={e => setForm({ ...form, descricao: e.target.value })}
                  className="w-full border-b border-[#C8DFC4] py-2 text-sm outline-none focus:border-[#3D6B4A] bg-transparent"
                  placeholder="Ex: O clássico do denim americano"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-10">
              <button
                onClick={() => setModalAberto(false)}
                className="flex-1 py-3 rounded-full border border-[#C8DFC4] text-sm text-[#5C6E5C] hover:bg-[#F0F5EE] transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={guardar}
                className="flex-1 py-3 rounded-full bg-[#3D6B4A] text-white text-sm hover:bg-[#2C5038] transition-all font-medium"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}