import { useState, useEffect } from "react";
import AdminLayout from "./adminlayout";

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
      const res = await fetch('import.meta.env.VITE_API_URL/api/marcas');
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
      await fetch(`import.meta.env.VITE_API_URL/api/marcas/${id}`, { method: 'DELETE' });
      carregarMarcas();
    } catch (err) {
      console.error(err);
    }
  };

  const guardar = async () => {
    if (!form.nome_marca) return;
    try {
      if (marcaEditando) {
        await fetch(`import.meta.env.VITE_API_URL/api/marcas/${marcaEditando}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      } else {
        await fetch('import.meta.env.VITE_API_URL/api/marcas', {
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

  const uploadImagem = async (file) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('imagem', file);
      const res = await fetch('import.meta.env.VITE_API_URL/api/upload', {
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

      {/* Stats */}
      <div className="flex gap-3 mb-6">
        <div className="bg-white border border-[#E8F0E6] rounded-lg px-4 py-2 text-center">
          <p className="text-lg font-semibold text-[#2C3A2C]">{marcas.length}</p>
          <p className="text-[10px] text-[#8FAF8A] uppercase tracking-wide">Total</p>
        </div>
      </div>

      {/* Pesquisa */}
      <div className="flex items-center border border-[#C8DFC4] rounded-lg px-4 py-2.5 bg-white gap-2 mb-6 max-w-sm">
        <span className="text-sm text-[#8FAF8A]">🔍</span>
        <input
          type="text"
          placeholder="Pesquisar por nome ou descrição..."
          value={pesquisa}
          onChange={e => setPesquisa(e.target.value)}
          className="text-sm outline-none bg-transparent text-[#4A5C4A] placeholder:text-[#C8DFC4] w-full"
        />
      </div>

      {/* Grid Marcas */}
      {loading ? (
        <p className="text-sm text-[#8FAF8A]">A carregar marcas...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {marcasFiltradas.map(m => (
            <div key={m.id_marca} className="bg-white rounded-xl border border-[#E8F0E6] overflow-hidden">
              <div className="bg-[#F0F5EE] h-32 flex items-center justify-center overflow-hidden">
                {m.imagem_url
                  ? <img src={m.imagem_url} alt={m.nome_marca} className="h-full w-full object-contain p-4" />
                  : <span style={serif} className="text-3xl font-semibold text-[#C8DFC4]">{m.nome_marca.charAt(0)}</span>
                }
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-[#2C3A2C] mb-1">{m.nome_marca}</p>
                {m.descricao && <p className="text-xs text-[#8FAF8A] mb-2 truncate">{m.descricao}</p>}
                <div className="flex gap-3 mt-2">
                  <button onClick={() => abrirEditar(m)} className="text-xs text-[#3D6B4A] hover:underline">Editar</button>
                  <button onClick={() => eliminar(m.id_marca)} className="text-xs text-[#C0392B] hover:underline">Eliminar</button>
                </div>
              </div>
            </div>
          ))}

          {marcasFiltradas.length === 0 && (
            <div className="col-span-4 text-center py-12">
              <p style={serif} className="text-2xl text-[#C8DFC4]">Nenhuma marca encontrada</p>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4" onClick={() => setModalAberto(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8" onClick={e => e.stopPropagation()}>
            <h2 style={serif} className="text-2xl font-semibold text-[#1A2E1A] mb-6">
              {marcaEditando ? "Editar Marca" : "Adicionar Marca"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] tracking-widest uppercase text-[#6B9E63] mb-1">Nome da Marca</label>
                <input type="text" value={form.nome_marca}
                  onChange={e => setForm({ ...form, nome_marca: e.target.value })}
                  className="w-full border-b border-[#C8DFC4] py-2 text-sm outline-none focus:border-[#3D6B4A] bg-transparent"
                  placeholder="Nome da marca" />
              </div>

              <div>
                <label className="block text-[11px] tracking-widest uppercase text-[#6B9E63] mb-1">Descrição</label>
                <input type="text" value={form.descricao}
                  onChange={e => setForm({ ...form, descricao: e.target.value })}
                  className="w-full border-b border-[#C8DFC4] py-2 text-sm outline-none focus:border-[#3D6B4A] bg-transparent"
                  placeholder="Descrição da marca" />
              </div>

              <div>
                <label className="block text-[11px] tracking-widest uppercase text-[#6B9E63] mb-3">Logo / Imagem</label>
                <div className="border border-[#E8F0E6] rounded-lg p-3">
                  {form.imagem_url && (
                    <div className="flex items-center gap-3 mb-3">
                      <img src={form.imagem_url} alt="" className="w-16 h-16 object-contain rounded-lg border border-[#E8F0E6]" />
                      <button onClick={() => setForm({ ...form, imagem_url: "" })} className="text-xs text-[#C0392B] hover:underline">Remover</button>
                    </div>
                  )}
                  <label className="cursor-pointer">
                    <div className="border border-dashed border-[#C8DFC4] rounded-lg py-3 px-4 text-center hover:border-[#3D6B4A] transition-all">
                      {uploading
                        ? <p className="text-xs text-[#8FAF8A]">A carregar...</p>
                        : <p className="text-xs text-[#8FAF8A]">{form.imagem_url ? "✓ Imagem carregada — clica para substituir" : "Clica para fazer upload da imagem"}</p>
                      }
                    </div>
                    <input type="file" accept="image/*" className="hidden"
                      onChange={e => { if (e.target.files[0]) uploadImagem(e.target.files[0]); }} />
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button onClick={() => setModalAberto(false)}
                className="flex-1 py-3 rounded-full border border-[#C8DFC4] text-sm text-[#5C6E5C] hover:bg-[#F0F5EE] transition-all">
                Cancelar
              </button>
              <button onClick={guardar}
                className="flex-1 py-3 rounded-full bg-[#3D6B4A] text-white text-sm hover:bg-[#2C5038] transition-all">
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}