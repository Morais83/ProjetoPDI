import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { getProdutos, criarProduto, editarProduto, eliminarProduto } from "../api";
import { Search } from "lucide-react";

const serif = { fontFamily: "'Cormorant Garamond', Georgia, serif" };

function getListaTamanhos(idCategoria, categorias) {
  const cat = categorias.find(c => c.id_categoria == idCategoria);
  const pai = categorias.find(c => c.id_categoria == cat?.id_categoria_pai)?.nome_categoria || "";
  return pai === "Calçado"
    ? ["35", "36", "37", "38", "39", "40", "41", "42", "43", "44"]
    : ["XS", "S", "M", "L", "XL", "XXL"];
}

function corVazia(listaTamanhos) {
  return {
    nome: "",
    hex: "",
    imagens: ["", "", "", "", "", ""],
    tamanhos: Object.fromEntries(listaTamanhos.map(t => [t, { ativo: false, stock: 0 }])),
    aberta: true,
  };
}

const FORM_INICIAL = {
  nome_produto: "", id_categoria: "", id_marca: "", preco: "",
  preco_anterior: "", descricao: "", materiais: "", guia_cuidados: "",
  stock: "", cores: [],
};

// ─── Componente principal ─────────────────────────────────────────────────────

export default function AdminProdutos() {
  const [produtos, setProdutos]           = useState([]);
  const [categorias, setCategorias]       = useState([]);
  const [marcas, setMarcas]               = useState([]);
  const [pesquisa, setPesquisa]           = useState("");
  const [modalAberto, setModalAberto]     = useState(false);
  const [produtoEditando, setProdutoEditando] = useState(null);
  const [loading, setLoading]             = useState(true);
  const [form, setForm]                   = useState(FORM_INICIAL);
  const [erroGuardar, setErroGuardar]     = useState("");

  useEffect(() => { carregarDados(); }, []);

  const carregarDados = async () => {
    setLoading(true);
    try {
      const [prods, cats, mars] = await Promise.all([
        getProdutos(),
        fetch(`${import.meta.env.VITE_API_URL}/api/categorias`).then(r => r.json()),
        fetch(`${import.meta.env.VITE_API_URL}/api/marcas`).then(r => r.json()),
      ]);
      setProdutos(prods);
      setCategorias(cats);
      setMarcas(mars);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const produtosFiltrados = produtos.filter(p =>
    p.nome_produto.toLowerCase().includes(pesquisa.toLowerCase()) ||
    p.nome_categoria?.toLowerCase().includes(pesquisa.toLowerCase()) ||
    p.nome_marca?.toLowerCase().includes(pesquisa.toLowerCase())
  );

  // ── Abrir / fechar modal ────────────────────────────────────────────────────

  const abrirAdicionar = () => {
    setProdutoEditando(null);
    setForm(FORM_INICIAL);
    setErroGuardar("");
    setModalAberto(true);
  };

  const abrirEditar = async (prod) => {
    setErroGuardar("");
    setProdutoEditando(prod.id_produto);
    const res  = await fetch(`${import.meta.env.VITE_API_URL}/api/produtos/${prod.id_produto}`);
    const dados = await res.json();

    const listaTamanhos = getListaTamanhos(dados.id_categoria, categorias);

    // Agrupa variantes por cor
    const coresMap = {};
    (dados.variantes || []).forEach(v => {
      if (!coresMap[v.cor]) {
        coresMap[v.cor] = {
          nome: v.cor,
          hex: v.hex_cor || "",
          imagens: ["", "", "", "", "", ""],
          tamanhos: Object.fromEntries(listaTamanhos.map(t => [t, { ativo: false, stock: 0 }])),
          aberta: false,
        };
      }
      coresMap[v.cor].tamanhos[v.tamanho] = { ativo: true, stock: v.stock_variante };
    });

    // Associa imagens às cores — inclusive cores que só têm imagens (sem variantes)
    (dados.imagens || []).forEach(img => {
      const corNome = img.cor;
      if (!corNome) return; // ignora imagens sem cor (legado)
      // Cria entrada na map se ainda não existe (cor com imagens mas sem variantes)
      if (!coresMap[corNome]) {
        coresMap[corNome] = {
          nome: corNome,
          hex: "",
          imagens: ["", "", "", "", "", ""],
          tamanhos: Object.fromEntries(listaTamanhos.map(t => [t, { ativo: false, stock: 0 }])),
          aberta: false,
        };
      }
      const idx = (img.ordem || 1) - 1;
      if (idx >= 0 && idx < 6) coresMap[corNome].imagens[idx] = img.url;
    });

    // Garante que todos os tamanhos existem na estrutura
    Object.values(coresMap).forEach(cor => {
      listaTamanhos.forEach(t => {
        if (!cor.tamanhos[t]) cor.tamanhos[t] = { ativo: false, stock: 0 };
      });
    });

    setForm({
      nome_produto: dados.nome_produto,
      id_categoria: dados.id_categoria,
      id_marca: dados.id_marca || "",
      preco: dados.preco,
      preco_anterior: dados.preco_anterior || "",
      descricao: dados.descricao || "",
      materiais: dados.materiais || "",
      guia_cuidados: dados.guia_cuidados || "",
      stock: dados.stock,
      cores: Object.values(coresMap),
    });
    setModalAberto(true);
  };

  const eliminar = async (id) => {
    if (!window.confirm("Tens a certeza que queres eliminar este produto?")) return;
    await eliminarProduto(id);
    carregarDados();
  };

  // ── Gestão de cores ─────────────────────────────────────────────────────────

  const adicionarCor = () => {
    const listaTamanhos = getListaTamanhos(form.id_categoria, categorias);
    setForm(prev => ({
      ...prev,
      cores: [...prev.cores, corVazia(listaTamanhos)],
    }));
  };

  const removerCor = (idx) => {
    setForm(prev => ({ ...prev, cores: prev.cores.filter((_, i) => i !== idx) }));
  };

  const toggleCorAberta = (idx) => {
    setForm(prev => ({
      ...prev,
      cores: prev.cores.map((c, i) => i === idx ? { ...c, aberta: !c.aberta } : c),
    }));
  };

  const updateCor = (idx, campo, valor) => {
    setForm(prev => ({
      ...prev,
      cores: prev.cores.map((c, i) => i === idx ? { ...c, [campo]: valor } : c),
    }));
  };

  const updateImagemCor = async (corIdx, imgIdx, file) => {
    const formData = new FormData();
    formData.append('imagem', file);
    try {
      const res   = await fetch(`${import.meta.env.VITE_API_URL}/api/upload`, { method: 'POST', body: formData });
      const dados = await res.json();
      setForm(prev => ({
        ...prev,
        cores: prev.cores.map((c, i) => {
          if (i !== corIdx) return c;
          const novas = [...c.imagens];
          novas[imgIdx] = dados.url;
          return { ...c, imagens: novas };
        }),
      }));
    } catch (err) { console.error(err); }
  };

  const removerImagemCor = (corIdx, imgIdx) => {
    setForm(prev => ({
      ...prev,
      cores: prev.cores.map((c, i) => {
        if (i !== corIdx) return c;
        const novas = [...c.imagens];
        novas[imgIdx] = "";
        return { ...c, imagens: novas };
      }),
    }));
  };

  const updateTamanho = (corIdx, tamanho, campo, valor) => {
    setForm(prev => ({
      ...prev,
      cores: prev.cores.map((c, i) => {
        if (i !== corIdx) return c;
        return {
          ...c,
          tamanhos: { ...c.tamanhos, [tamanho]: { ...c.tamanhos[tamanho], [campo]: valor } },
        };
      }),
    }));
  };

  // ── Guardar ─────────────────────────────────────────────────────────────────

  const guardar = async () => {
    setErroGuardar("");
    if (!form.nome_produto || !form.id_categoria || !form.preco) {
      setErroGuardar("Preenche o nome, categoria e preço.");
      return;
    }

    // Flatten: imagens com cor associada
    const imagens = [];
    form.cores.forEach(cor => {
      cor.imagens.forEach((url, i) => {
        if (url && url.trim()) {
          imagens.push({ url, ordem: i + 1, cor: cor.nome });
        }
      });
    });

    // Flatten: variantes (apenas tamanhos activos com nome de cor preenchido)
    const variantes = [];
    form.cores.forEach(cor => {
      if (!cor.nome.trim()) return;
      Object.entries(cor.tamanhos).forEach(([tamanho, { ativo, stock }]) => {
        if (ativo) {
          variantes.push({
            tamanho,
            cor: cor.nome,
            hex_cor: cor.hex || null,
            stock_variante: parseInt(stock) || 0,
          });
        }
      });
    });

    const dados = {
      nome_produto:   form.nome_produto,
      id_categoria:   form.id_categoria,
      id_marca:       form.id_marca || null,
      preco:          parseFloat(form.preco),
      preco_anterior: form.preco_anterior ? parseFloat(form.preco_anterior) : null,
      descricao:      form.descricao,
      materiais:      form.materiais,
      guia_cuidados:  form.guia_cuidados,
      stock:          parseInt(form.stock) || 0,
      imagens,
      variantes,
    };

    try {
      let resultado;
      if (produtoEditando) {
        resultado = await editarProduto(produtoEditando, dados);
      } else {
        resultado = await criarProduto(dados);
      }
      if (resultado?.erro) {
        setErroGuardar("Erro do servidor: " + resultado.erro);
        return;
      }
      setModalAberto(false);
      carregarDados();
    } catch (err) {
      console.error(err);
      setErroGuardar("Erro de ligação ao servidor. Verifica se o backend está ativo.");
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  const listaTamanhos = getListaTamanhos(form.id_categoria, categorias);

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

      {/* Pesquisa */}
      <div className="flex items-center border border-[#C8DFC4] rounded-lg px-4 py-2.5 bg-white gap-2 mb-6 max-w-sm">
        <Search size={18} strokeWidth={1.5} />
        <input
          type="text"
          placeholder="Pesquisar por nome do produto"
          value={pesquisa}
          onChange={e => setPesquisa(e.target.value)}
          className="text-sm outline-none bg-transparent text-[#4A5C4A] placeholder:text-[#C8DFC4] w-full"
        />
      </div>

      {/* Grid */}
      {loading ? (
        <p className="text-sm text-[#8FAF8A]">A carregar produtos...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-6 gap-5">
          {produtosFiltrados.map((prod) => (
            <div key={prod.id_produto} className="bg-white rounded-xl border border-[#E8F0E6] overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              
              <div className="bg-[#F0F5EE] h-60 flex items-center justify-center relative p-4 shrink-0">
                {prod.imagem_principal
                  ? <img src={prod.imagem_principal} alt={prod.nome_produto} className="w-full h-full object-cover" />
                  : <span style={serif} className="text-5xl font-semibold text-[#3D6B4A]">{prod.nome_produto.charAt(0)}</span>
                }
              </div>

              <div className="p-4 flex flex-col flex-1">
                <p className="text-sm font-bold text-[#2C3A2C] mb-1 leading-tight">{prod.nome_produto}</p>
                <p className="text-xs text-[#8FAF8A] mb-1">{prod.nome_categoria}</p>
                <p className="text-xs text-[#5C6E5C] mb-3">{prod.preco}€</p>
                
                <div className="flex gap-4 mt-auto pt-3 border-t border-[#E8F0E6]">
                  <button onClick={() => abrirEditar(prod)} className="text-xs text-[#3D6B4A] hover:text-[#2C5038] font-medium transition-colors">Editar</button>
                  <button onClick={() => eliminar(prod.id_produto)} className="text-xs text-[#C0392B] hover:text-[#922B21] font-medium transition-colors">Eliminar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Modal ── */}
      {modalAberto && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4"
          onClick={() => setModalAberto(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8"
            onClick={e => e.stopPropagation()}
          >
            <h2 style={serif} className="text-2xl font-semibold text-[#1A2E1A] mb-6">
              {produtoEditando ? "Editar Produto" : "Adicionar Produto"}
            </h2>

            <div className="space-y-4">

              {/* Nome */}
              <Field label="Nome do Produto">
                <LineInput value={form.nome_produto} onChange={v => setForm({ ...form, nome_produto: v })} placeholder="Nome do produto" />
              </Field>

              {/* Categoria + Marca */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="Categoria">
                  <select
                    value={form.id_categoria}
                    onChange={e => setForm({ ...form, id_categoria: e.target.value })}
                    className="w-full border-b border-[#C8DFC4] py-2 text-sm outline-none focus:border-[#3D6B4A] bg-transparent"
                  >
                    <option value="">Selecionar...</option>
                    {categorias.filter(c => c.id_categoria_pai !== null).map(c => (
                      <option key={c.id_categoria} value={c.id_categoria}>{c.nome_categoria}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Marca">
                  <select
                    value={form.id_marca}
                    onChange={e => setForm({ ...form, id_marca: e.target.value })}
                    className="w-full border-b border-[#C8DFC4] py-2 text-sm outline-none focus:border-[#3D6B4A] bg-transparent"
                  >
                    <option value="">Selecionar...</option>
                    {marcas.map(m => (
                      <option key={m.id_marca} value={m.id_marca}>{m.nome_marca}</option>
                    ))}
                  </select>
                </Field>
              </div>

              {/* Preços + Stock */}
              <div className="grid grid-cols-3 gap-4">
                <Field label="Preço (€)">
                  <LineInput type="number" value={form.preco} onChange={v => setForm({ ...form, preco: v })} placeholder="0.00" />
                </Field>
                <Field label="Preço Anterior (€)">
                  <LineInput type="number" value={form.preco_anterior} onChange={v => setForm({ ...form, preco_anterior: v })} placeholder="0.00" />
                </Field>
                <Field label="Stock Total">
                  <LineInput type="number" value={form.stock} onChange={v => setForm({ ...form, stock: v })} placeholder="0" />
                </Field>
              </div>

              {/* Descrição */}
              <Field label="Descrição">
                <textarea
                  value={form.descricao}
                  onChange={e => setForm({ ...form, descricao: e.target.value })}
                  rows={3}
                  className="w-full border border-[#C8DFC4] rounded-lg p-3 text-sm outline-none focus:border-[#3D6B4A] bg-transparent resize-none"
                  placeholder="Descrição do produto"
                />
              </Field>

              {/* Materiais + Cuidados */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="Materiais">
                  <LineInput value={form.materiais} onChange={v => setForm({ ...form, materiais: v })} placeholder="ex: 100% Algodão" />
                </Field>
                <Field label="Guia de Cuidados">
                  <LineInput value={form.guia_cuidados} onChange={v => setForm({ ...form, guia_cuidados: v })} placeholder="ex: Lavar a 30°C" />
                </Field>
              </div>

              {/* ── Cores & Variantes ── */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-[11px] tracking-widest uppercase text-[#6B9E63]">
                    Cores, Imagens e Stock
                  </label>
                  <button
                    type="button"
                    onClick={adicionarCor}
                    className="text-xs text-[#3D6B4A] border border-[#C8DFC4] rounded-lg px-3 py-1.5 hover:bg-[#F0F5EE] transition-all"
                  >
                    + Adicionar Cor
                  </button>
                </div>

                {form.cores.length === 0 && (
                  <p className="text-xs text-[#8FAF8A] text-center py-6 border border-dashed border-[#C8DFC4] rounded-xl">
                    Clica em "+ Adicionar Cor" para começar
                  </p>
                )}

                <div className="space-y-3">
                  {form.cores.map((cor, corIdx) => (
                    <div key={corIdx} className="border border-[#E8F0E6] rounded-xl overflow-hidden">

                      {/* Cabeçalho da cor */}
                      <div
                        className="flex items-center gap-3 p-3 bg-[#F7F9F5] cursor-pointer select-none"
                        onClick={() => toggleCorAberta(corIdx)}
                      >
                        {/* Swatch */}
                        <div
                          className="w-6 h-6 rounded-full border border-[#C8DFC4] flex-shrink-0"
                          style={{ background: cor.hex || '#E8F0E6' }}
                        />
                        <span className="text-sm font-medium text-[#2C3A2C] flex-1">
                          {cor.nome || <span className="text-[#8FAF8A] font-normal">Nova cor</span>}
                        </span>
                        <span className="text-xs text-[#8FAF8A]">
                          {Object.values(cor.tamanhos).filter(t => t.ativo).length} tamanhos · {cor.imagens.filter(Boolean).length} imagens
                        </span>
                        <button
                          type="button"
                          onClick={e => { e.stopPropagation(); removerCor(corIdx); }}
                          className="text-xs text-[#C0392B] hover:underline ml-2"
                        >
                          Remover
                        </button>
                        <span className={`text-[#6B9E63] text-xs transition-transform duration-200 ${cor.aberta ? 'rotate-180' : ''}`}>▼</span>
                      </div>

                      {/* Corpo */}
                      {cor.aberta && (
                        <div className="p-4 space-y-4">

                          {/* Nome + Hex */}
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] text-[#8FAF8A] mb-1 uppercase tracking-wider">Nome da Cor</label>
                              <input
                                type="text"
                                value={cor.nome}
                                onChange={e => updateCor(corIdx, 'nome', e.target.value)}
                                placeholder="ex: Cinzento"
                                className="w-full border-b border-[#C8DFC4] py-1.5 text-sm outline-none focus:border-[#3D6B4A] bg-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-[#8FAF8A] mb-1 uppercase tracking-wider">Código Hex (opcional)</label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={cor.hex}
                                  onChange={e => updateCor(corIdx, 'hex', e.target.value)}
                                  placeholder="#808080"
                                  className="flex-1 border-b border-[#C8DFC4] py-1.5 text-sm outline-none focus:border-[#3D6B4A] bg-transparent"
                                />
                                <input
                                  type="color"
                                  value={cor.hex || '#ffffff'}
                                  onChange={e => updateCor(corIdx, 'hex', e.target.value)}
                                  className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"
                                  title="Escolher cor"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Imagens da cor */}
                          <div>
                            <label className="block text-[10px] text-[#8FAF8A] mb-2 uppercase tracking-wider">
                              Imagens desta Cor (até 6)
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                              {cor.imagens.map((url, imgIdx) => (
                                <div key={imgIdx} className="border border-[#E8F0E6] rounded-lg p-2">
                                  {url ? (
                                    <div className="relative">
                                      <img
                                        src={url} alt=""
                                        className="w-full h-16 object-cover rounded"
                                        onError={e => e.target.style.display = 'none'}
                                      />
                                      <button
                                        type="button"
                                        onClick={() => removerImagemCor(corIdx, imgIdx)}
                                        className="absolute top-1 right-1 w-5 h-5 bg-white/80 rounded-full flex items-center justify-center text-[#C0392B] text-xs hover:bg-white transition-all"
                                      >
                                        ✕
                                      </button>
                                    </div>
                                  ) : (
                                    <label className="flex flex-col items-center justify-center h-16 border border-dashed border-[#C8DFC4] rounded cursor-pointer hover:border-[#3D6B4A] transition-all">
                                      <span className="text-lg text-[#C8DFC4]">+</span>
                                      <span className="text-[9px] text-[#8FAF8A]">Foto {imgIdx + 1}</span>
                                      <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={e => {
                                          const file = e.target.files[0];
                                          if (file) updateImagemCor(corIdx, imgIdx, file);
                                        }}
                                      />
                                    </label>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Tamanhos e stock */}
                          <div>
                            <label className="block text-[10px] text-[#8FAF8A] mb-2 uppercase tracking-wider">
                              Stock por Tamanho
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                              {listaTamanhos.map(tamanho => {
                                const t = cor.tamanhos[tamanho] || { ativo: false, stock: 0 };
                                return (
                                  <div
                                    key={tamanho}
                                    className={`border rounded-lg p-2 transition-all ${t.ativo ? 'border-[#3D6B4A] bg-[#F0F5EE]' : 'border-[#E8F0E6]'}`}
                                  >
                                    <label className="flex items-center gap-2 cursor-pointer mb-1">
                                      <input
                                        type="checkbox"
                                        checked={!!t.ativo}
                                        onChange={e => updateTamanho(corIdx, tamanho, 'ativo', e.target.checked)}
                                        className="accent-[#3D6B4A]"
                                      />
                                      <span className="text-xs font-medium text-[#2C3A2C]">{tamanho}</span>
                                    </label>
                                    {t.ativo && (
                                      <input
                                        type="number"
                                        min="0"
                                        value={t.stock}
                                        onChange={e => updateTamanho(corIdx, tamanho, 'stock', e.target.value)}
                                        placeholder="Stock"
                                        className="w-full border-b border-[#C8DFC4] py-0.5 text-xs outline-none focus:border-[#3D6B4A] bg-transparent"
                                      />
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Erro */}
            {erroGuardar && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <p className="text-xs text-red-600">⚠️ {erroGuardar}</p>
              </div>
            )}

            {/* Botões */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setModalAberto(false)}
                className="flex-1 py-3 rounded-full border border-[#C8DFC4] text-sm text-[#5C6E5C] hover:bg-[#F0F5EE] transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={guardar}
                className="flex-1 py-3 rounded-full bg-[#3D6B4A] text-white text-sm hover:bg-[#2C5038] transition-all"
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

// ─── Sub-componentes ──────────────────────────────────────────────────────────

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-[11px] tracking-widest uppercase text-[#6B9E63] mb-1">{label}</label>
      {children}
    </div>
  );
}

function LineInput({ value, onChange, placeholder, type = "text" }) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full border-b border-[#C8DFC4] py-2 text-sm outline-none focus:border-[#3D6B4A] bg-transparent"
    />
  );
}
