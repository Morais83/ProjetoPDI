import { useState, useEffect } from "react";
import AdminLayout from "./adminlayout";
import { getProdutos, criarProduto, editarProduto, eliminarProduto } from "../api";

const serif = { fontFamily: "'Cormorant Garamond', Georgia, serif" };

const camposImagens = [1, 2, 3, 4, 5, 6];

export default function AdminProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    nome_produto: "", id_categoria: "", id_marca: "", preco: "",
    preco_anterior: "", descricao: "", materiais: "", guia_cuidados: "",
    stock: "", imagens: ["", "", "", "", "", ""],
    variantes: [{ tamanho: "", cor: "", stock_variante: 0 }]
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setLoading(true);
    try {
      const [prods, cats, mars] = await Promise.all([
        getProdutos(),
        fetch('http://localhost:5000/api/categorias').then(r => r.json()),
        fetch('http://localhost:5000/api/marcas').then(r => r.json()),
      ]);
      setProdutos(prods);
      setCategorias(cats);
      setMarcas(mars);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const categoriasFiltro = ["Todas", ...new Set(produtos.map(p => p.nome_categoria).filter(Boolean))];

  const produtosFiltrados = produtos.filter(p =>
    p.nome_produto.toLowerCase().includes(pesquisa.toLowerCase()) ||
    p.nome_categoria?.toLowerCase().includes(pesquisa.toLowerCase()) ||
    p.nome_marca?.toLowerCase().includes(pesquisa.toLowerCase())
  );

  const abrirAdicionar = () => {
    setProdutoEditando(null);
    setForm({
      nome_produto: "", id_categoria: "", id_marca: "", preco: "",
      preco_anterior: "", descricao: "", materiais: "", guia_cuidados: "",
      stock: "", imagens: ["", "", "", "", "", ""],
      variantes: [{ tamanho: "", cor: "", stock_variante: 0 }]
    });
    setModalAberto(true);
  };

  const abrirEditar = async (prod) => {
    setProdutoEditando(prod.id_produto);
    const res = await fetch(`http://localhost:5000/api/produtos/${prod.id_produto}`);
    const dados = await res.json();
    const imagens = ["", "", "", "", "", ""];
    dados.imagens?.forEach(img => { imagens[img.ordem - 1] = img.url; });
    setForm({
      nome_produto: dados.nome_produto,
      id_categoria: dados.id_categoria,
      id_marca: dados.id_marca,
      preco: dados.preco,
      preco_anterior: dados.preco_anterior || "",
      descricao: dados.descricao || "",
      materiais: dados.materiais || "",
      guia_cuidados: dados.guia_cuidados || "",
      stock: dados.stock,
      imagens,
      variantes: dados.variantes?.length > 0
        ? dados.variantes
        : [{ tamanho: "", cor: "", stock_variante: 0 }]
    });
    setModalAberto(true);
  };

  const eliminar = async (id) => {
    if (!window.confirm("Tens a certeza que queres eliminar este produto?")) return;
    await eliminarProduto(id);
    carregarDados();
  };

  const adicionarVariante = () => {
    setForm(prev => ({
      ...prev,
      variantes: [...prev.variantes, { tamanho: "", cor: "", stock_variante: 0 }]
    }));
  };

  const removerVariante = (idx) => {
    setForm(prev => ({
      ...prev,
      variantes: prev.variantes.filter((_, i) => i !== idx)
    }));
  };

  const guardar = async () => {
    if (!form.nome_produto || !form.id_categoria || !form.preco) return;

    const imagens = form.imagens
      .map((url, i) => ({ url, ordem: i + 1 }))
      .filter(img => img.url.trim() !== "");

    const variantes = form.variantes.filter(v => v.tamanho && v.cor);

    const dados = {
      nome_produto: form.nome_produto,
      id_categoria: form.id_categoria,
      id_marca: form.id_marca || null,
      preco: parseFloat(form.preco),
      preco_anterior: form.preco_anterior ? parseFloat(form.preco_anterior) : null,
      descricao: form.descricao,
      materiais: form.materiais,
      guia_cuidados: form.guia_cuidados,
      stock: parseInt(form.stock) || 0,
      imagens,
      variantes,
    };

    if (produtoEditando) {
      await editarProduto(produtoEditando, dados);
    } else {
      await criarProduto(dados);
    }

    setModalAberto(false);
    carregarDados();
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

      {/* Barra de Pesquisa */}
      <div className="flex items-center border border-[#C8DFC4] rounded-lg px-4 py-2.5 bg-white gap-2 mb-6 max-w-sm">
        <span className="text-sm text-[#8FAF8A]">🔍</span>
        <input
          type="text"
          placeholder="Pesquisar por nome do produto"
          value={pesquisa}
          onChange={e => setPesquisa(e.target.value)}
          className="text-sm outline-none bg-transparent text-[#4A5C4A] placeholder:text-[#C8DFC4] w-full"
        />
      </div>

      {/* Grid Produtos */}
      {loading ? (
        <p className="text-sm text-[#8FAF8A]">A carregar produtos...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {produtosFiltrados.map((prod) => (
            <div key={prod.id_produto} className="bg-white rounded-xl border border-[#E8F0E6] overflow-hidden">
              <div className="bg-[#F0F5EE] h-32 flex items-center justify-center overflow-hidden">
                {prod.imagem_principal
                  ? <img src={prod.imagem_principal} alt={prod.nome_produto} className="h-full w-full object-cover" />
                  : <span className="text-4xl text-[#C8DFC4]">📷</span>
                }
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-[#2C3A2C] mb-1 truncate">{prod.nome_produto}</p>
                <p className="text-xs text-[#8FAF8A] mb-1">{prod.nome_categoria}</p>
                <p className="text-xs text-[#5C6E5C] mb-3">Stock: {prod.stock} &nbsp;|&nbsp; {prod.preco}€</p>
                <div className="flex gap-3">
                  <button onClick={() => abrirEditar(prod)} className="text-xs text-[#3D6B4A] hover:underline">Editar</button>
                  <button onClick={() => eliminar(prod.id_produto)} className="text-xs text-[#C0392B] hover:underline">Eliminar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4" onClick={() => setModalAberto(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8" onClick={e => e.stopPropagation()}>
            <h2 style={serif} className="text-2xl font-semibold text-[#1A2E1A] mb-6">
              {produtoEditando ? "Editar Produto" : "Adicionar Produto"}
            </h2>

            <div className="space-y-4">

              {/* Nome */}
              <div>
                <label className="block text-[11px] tracking-widest uppercase text-[#6B9E63] mb-1">Nome do Produto</label>
                <input type="text" value={form.nome_produto}
                  onChange={e => setForm({ ...form, nome_produto: e.target.value })}
                  className="w-full border-b border-[#C8DFC4] py-2 text-sm outline-none focus:border-[#3D6B4A] bg-transparent"
                  placeholder="Nome do produto" />
              </div>

              {/* Categoria + Marca */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] tracking-widest uppercase text-[#6B9E63] mb-1">Categoria</label>
                  <select value={form.id_categoria}
                    onChange={e => setForm({ ...form, id_categoria: e.target.value })}
                    className="w-full border-b border-[#C8DFC4] py-2 text-sm outline-none focus:border-[#3D6B4A] bg-transparent">
                    <option value="">Selecionar...</option>
                    {categorias.filter(c => c.id_categoria_pai !== null).map(c => (
                      <option key={c.id_categoria} value={c.id_categoria}>{c.nome_categoria}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] tracking-widest uppercase text-[#6B9E63] mb-1">Marca</label>
                  <select value={form.id_marca}
                    onChange={e => setForm({ ...form, id_marca: e.target.value })}
                    className="w-full border-b border-[#C8DFC4] py-2 text-sm outline-none focus:border-[#3D6B4A] bg-transparent">
                    <option value="">Selecionar...</option>
                    {marcas.map(m => (
                      <option key={m.id_marca} value={m.id_marca}>{m.nome_marca}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Preço + Preço Anterior + Stock */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] tracking-widests uppercase text-[#6B9E63] mb-1">Preço (€)</label>
                  <input type="number" value={form.preco}
                    onChange={e => setForm({ ...form, preco: e.target.value })}
                    className="w-full border-b border-[#C8DFC4] py-2 text-sm outline-none focus:border-[#3D6B4A] bg-transparent"
                    placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-[11px] tracking-widests uppercase text-[#6B9E63] mb-1">Preço Anterior (€)</label>
                  <input type="number" value={form.preco_anterior}
                    onChange={e => setForm({ ...form, preco_anterior: e.target.value })}
                    className="w-full border-b border-[#C8DFC4] py-2 text-sm outline-none focus:border-[#3D6B4A] bg-transparent"
                    placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-[11px] tracking-widest uppercase text-[#6B9E63] mb-1">Stock</label>
                  <input type="number" value={form.stock}
                    onChange={e => setForm({ ...form, stock: e.target.value })}
                    className="w-full border-b border-[#C8DFC4] py-2 text-sm outline-none focus:border-[#3D6B4A] bg-transparent"
                    placeholder="0" />
                </div>
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-[11px] tracking-widest uppercase text-[#6B9E63] mb-1">Descrição</label>
                <textarea value={form.descricao}
                  onChange={e => setForm({ ...form, descricao: e.target.value })}
                  rows={3}
                  className="w-full border border-[#C8DFC4] rounded-lg p-3 text-sm outline-none focus:border-[#3D6B4A] bg-transparent resize-none"
                  placeholder="Descrição do produto" />
              </div>

              {/* Materiais + Guia de Cuidados */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] tracking-widest uppercase text-[#6B9E63] mb-1">Materiais</label>
                  <input type="text" value={form.materiais}
                    onChange={e => setForm({ ...form, materiais: e.target.value })}
                    className="w-full border-b border-[#C8DFC4] py-2 text-sm outline-none focus:border-[#3D6B4A] bg-transparent"
                    placeholder="ex: 100% Algodão" />
                </div>
                <div>
                  <label className="block text-[11px] tracking-widest uppercase text-[#6B9E63] mb-1">Guia de Cuidados</label>
                  <input type="text" value={form.guia_cuidados}
                    onChange={e => setForm({ ...form, guia_cuidados: e.target.value })}
                    className="w-full border-b border-[#C8DFC4] py-2 text-sm outline-none focus:border-[#3D6B4A] bg-transparent"
                    placeholder="ex: Lavar a 30°C" />
                </div>
              </div>

              {/* Imagens */}
              <div>
                <label className="block text-[11px] tracking-widest uppercase text-[#6B9E63] mb-3">Imagens (até 6)</label>
                <div className="grid grid-cols-2 gap-3">
                  {camposImagens.map((num, i) => (
                    <div key={i} className="border border-[#E8F0E6] rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-[#8FAF8A] w-4">{num}</span>
                        {form.imagens[i] && (
                          <img src={form.imagens[i]} alt="" className="w-10 h-10 object-cover rounded" onError={e => e.target.style.display = 'none'} />
                        )}
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <div className="flex-1 border border-dashed border-[#C8DFC4] rounded-lg py-2 px-3 text-center hover:border-[#3D6B4A] transition-all">
                          {form.imagens[i] ? (
                            <p className="text-xs text-[#3D6B4A] truncate">✓ Imagem carregada</p>
                          ) : (
                            <p className="text-xs text-[#8FAF8A]">Clica para fazer upload</p>
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            const formData = new FormData();
                            formData.append('imagem', file);
                            try {
                              const res = await fetch('http://localhost:5000/api/upload', {
                                method: 'POST',
                                body: formData,
                              });
                              const dados = await res.json();
                              const novas = [...form.imagens];
                              novas[i] = dados.url;
                              setForm({ ...form, imagens: novas });
                            } catch (err) {
                              console.error(err);
                            }
                          }}
                        />
                      </label>
                      {form.imagens[i] && (
                        <button
                          onClick={() => {
                            const novas = [...form.imagens];
                            novas[i] = "";
                            setForm({ ...form, imagens: novas });
                          }}
                          className="text-[10px] text-[#C0392B] hover:underline mt-1"
                        >
                          Remover
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Variantes */}
              <div>
                <label className="block text-[11px] tracking-widest uppercase text-[#6B9E63] mb-3">Variantes por Tamanho</label>
                <div className="space-y-3">
                  {(() => {
                    const catSelecionada = categorias.find(c => c.id_categoria == form.id_categoria);
                    const nomePai = categorias.find(c => c.id_categoria == catSelecionada?.id_categoria_pai)?.nome_categoria || "";
                    const isCalcado = nomePai === "Calçado";
                    const isAcessorio = nomePai === "Acessórios";

                    const listaTamanhos = isCalcado
                      ? ["35", "36", "37", "38", "39", "40", "41", "42", "43", "44"]
                      : isAcessorio
                      ? ["XS", "S", "M", "L", "XL", "XXL"]
                      : ["XS", "S", "M", "L", "XL", "XXL"];

                    return listaTamanhos.map((tamanho) => {
                      const varianteExiste = form.variantes.find(v => v.tamanho === tamanho);
                      return (
                        <div key={tamanho} className="border border-[#E8F0E6] rounded-lg p-3">
                          <div className="flex items-center gap-3 mb-2">
                            <input
                              type="checkbox"
                              checked={!!varianteExiste}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setForm({ ...form, variantes: [...form.variantes, { tamanho, cor: "", stock_variante: 0 }] });
                                } else {
                                  setForm({ ...form, variantes: form.variantes.filter(v => v.tamanho !== tamanho) });
                                }
                              }}
                              className="accent-[#3D6B4A]"
                            />
                            <span className="text-sm font-medium text-[#2C3A2C]">{tamanho}</span>
                          </div>
                          {varianteExiste && (
                            <div className="grid grid-cols-2 gap-2 ml-6">
                              <div>
                                <label className="block text-[10px] text-[#8FAF8A] mb-1">Cor</label>
                                <input
                                  type="text"
                                  value={varianteExiste.cor}
                                  onChange={e => {
                                    const novas = form.variantes.map(v => v.tamanho === tamanho ? { ...v, cor: e.target.value } : v);
                                    setForm({ ...form, variantes: novas });
                                  }}
                                  className="w-full border-b border-[#C8DFC4] py-1 text-xs outline-none focus:border-[#3D6B4A] bg-transparent"
                                  placeholder="ex: Branco"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] text-[#8FAF8A] mb-1">Stock</label>
                                <input
                                  type="number"
                                  value={varianteExiste.stock_variante}
                                  onChange={e => {
                                    const novas = form.variantes.map(v => v.tamanho === tamanho ? { ...v, stock_variante: e.target.value } : v);
                                    setForm({ ...form, variantes: novas });
                                  }}
                                  className="w-full border-b border-[#C8DFC4] py-1 text-xs outline-none focus:border-[#3D6B4A] bg-transparent"
                                  placeholder="0"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            </div>

            {/* Botões */}
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