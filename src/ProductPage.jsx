import { useState, useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";
import GuiaTamanhos from "./GuiaTamanhos";
import { verificarFavorito, adicionarFavorito, removerFavorito } from './api';
import { adicionarAoCarrinho } from './cart';
import { Heart, Truck, RotateCcw, ShieldCheck } from "lucide-react";

const serif = { fontFamily: "'Cormorant Garamond', Georgia, serif" };
const sans  = { fontFamily: "'Jost', sans-serif" };

const ORDEM_TAMANHOS = ["XS","S","M","L","XL","XXL","35","36","37","38","39","40","41","42","43","44"];

export default function ProductPage() {
  const { id } = useParams();
  const [produto, setProduto]                     = useState(null);
  const [produtosRelacionados, setProdutosRelacionados] = useState([]);
  const [imagemAtiva, setImagemAtiva]             = useState(0);
  const [imageFade, setImageFade]                 = useState(true);
  const [varianteSelecionada, setVarianteSelecionada] = useState(null);
  const [tamanhoSelecionado, setTamanhoSelecionado]   = useState(null);
  const [corSelecionada, setCorSelecionada]           = useState(null);
  const [quantidade, setQuantidade]               = useState(1);
  const [wishlist, setWishlist]                   = useState(false);
  const [accordionAberto, setAccordionAberto]     = useState(null);
  const [adicionado, setAdicionado]               = useState(false);
  const [guiaAberto, setGuiaAberto]               = useState(false);
  const [loading, setLoading]                     = useState(true);
  const [lightboxAberto, setLightboxAberto]       = useState(false);

  const utilizador = JSON.parse(localStorage.getItem('utilizador'));

  if (!id) return null;

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Jost:wght@300;400;500&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  useEffect(() => { carregarProduto(); }, [id]);

  useEffect(() => {
    if (!produto || !utilizador) return;
    verificarFavorito(produto.id_produto).then(d => setWishlist(d.favorito));
  }, [produto]);

  const carregarProduto = async () => {
    setLoading(true);
    setTamanhoSelecionado(null);
    setCorSelecionada(null);
    setVarianteSelecionada(null);
    setImagemAtiva(0);
    try {
      const res    = await fetch(`${import.meta.env.VITE_API_URL}/api/produtos/${id}`);
      const dados  = await res.json();
      setProduto(dados);

      const resRel = await fetch(`${import.meta.env.VITE_API_URL}/api/produtos`);
      const todos  = await resRel.json();
      setProdutosRelacionados(
        todos.filter(p => p.id_categoria === dados.id_categoria && p.id_produto !== dados.id_produto).slice(0, 4)
      );
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  // ── Derivados ────────────────────────────────────────────────────────────────

  // Todas as cores únicas do produto
  const cores = useMemo(() =>
    produto ? [...new Set(produto.variantes?.map(v => v.cor).filter(Boolean))] : []
  , [produto]);

  // Todos os tamanhos únicos (para mostrar sempre todos)
  const tamanhos = useMemo(() =>
    produto
      ? [...new Set(produto.variantes?.map(v => v.tamanho))]
          .sort((a, b) => ORDEM_TAMANHOS.indexOf(a) - ORDEM_TAMANHOS.indexOf(b))
      : []
  , [produto]);

  // Imagens filtradas pela cor selecionada
  const imagensDaCor = useMemo(() => {
    if (!produto?.imagens) return [];
    if (!corSelecionada) return produto.imagens;
    const especificas = produto.imagens.filter(img => img.cor === corSelecionada);
    return especificas.length > 0 ? especificas : produto.imagens.filter(img => !img.cor);
  }, [produto, corSelecionada]);

  // Stock disponível por tamanho para a cor selecionada
  const stockPorTamanho = useMemo(() => {
    if (!produto || !corSelecionada) return {};
    return (produto.variantes || [])
      .filter(v => v.cor === corSelecionada)
      .reduce((acc, v) => ({ ...acc, [v.tamanho]: v.stock_variante }), {});
  }, [produto, corSelecionada]);

  // Um tamanho está desativado se a cor estiver selecionada e não tiver stock
  const tamanhoDesativado = (t) =>
    !!corSelecionada && (stockPorTamanho[t] === undefined || Number(stockPorTamanho[t]) === 0);

  // ── Efeitos de interação ────────────────────────────────────────────────────

  // Quando muda cor → atualiza imagens com fade, revalida tamanho selecionado
  useEffect(() => {
    triggerFade();
    setImagemAtiva(0);
    // Se o tamanho selecionado não tem stock nesta cor, remove a seleção
    if (tamanhoSelecionado && corSelecionada) {
      const stock = (produto?.variantes || []).find(
        v => v.cor === corSelecionada && v.tamanho === tamanhoSelecionado
      )?.stock_variante;
      if (!stock || Number(stock) === 0) setTamanhoSelecionado(null);
    }
  }, [corSelecionada]);

  // Quando muda imagem activa → fade suave
  useEffect(() => { triggerFade(); }, [imagemAtiva]);

  // Atualiza variante selecionada quando cor+tamanho mudam
  useEffect(() => {
    if (!produto || !tamanhoSelecionado || !corSelecionada) {
      setVarianteSelecionada(null);
      return;
    }
    const v = produto.variantes?.find(
      v => v.tamanho === tamanhoSelecionado && v.cor === corSelecionada
    );
    setVarianteSelecionada(v || null);
  }, [tamanhoSelecionado, corSelecionada, produto]);

  const triggerFade = () => {
    setImageFade(false);
    setTimeout(() => setImageFade(true), 50);
  };

  // ── Ações ────────────────────────────────────────────────────────────────────

  // Stock da variante selecionada (0 se sem stock ou não selecionada)
  const stockAtual = varianteSelecionada ? Number(varianteSelecionada.stock_variante) : 0;
  const semStock   = varianteSelecionada && stockAtual === 0;
  const stockBaixo = varianteSelecionada && stockAtual > 0 && stockAtual <= 3;

  const handleAdicionar = () => {
    if (!varianteSelecionada || semStock) return;
    // Garante que quantidade não excede stock disponível
    const qtdFinal = Math.min(quantidade, stockAtual);
    adicionarAoCarrinho({
      id_variante:  varianteSelecionada.id_variante,
      id_produto:   produto.id_produto,
      nome_produto: produto.nome_produto,
      nome_marca:   produto.nome_marca,
      preco:        parseFloat(produto.preco),
      cor:          varianteSelecionada.cor,
      tamanho:      varianteSelecionada.tamanho,
      quantidade:   qtdFinal,
      stock:        stockAtual,
      imagem_url:   imagensDaCor[0]?.url || produto.imagens?.[0]?.url || null,
    });
    setAdicionado(true);
    setTimeout(() => setAdicionado(false), 2000);
    window.dispatchEvent(new Event('carrinho-atualizado'));
  };

  const handleWishlist = async () => {
    if (!utilizador) { window.location.href = '/login'; return; }
    if (wishlist) { await removerFavorito(produto.id_produto); setWishlist(false); }
    else          { await adicionarFavorito(produto.id_produto); setWishlist(true); }
  };

  const getDepartamentoInfo = (categoria) => {
    if (!categoria) return null;
    const calcado    = ["Sapatilhas","Sandálias","Botas","Botins","Saltos altos","Sapatos rasos","Chinelos"];
    const acessorios = ["Malas de mão","Carteiras","Mochilas","Cintos","Chapéus","Lenços","Óculos de sol","Joalharia","Bijuteria"];
    if (calcado.includes(categoria))    return { id: "calcado",    label: "Calçado" };
    if (acessorios.includes(categoria)) return { id: "acessorios", label: "Acessórios" };
    return { id: "roupa", label: "Roupa" };
  };

  // ── Estados de carregamento ──────────────────────────────────────────────────

  if (loading) return (
    <div style={sans} className="min-h-screen bg-[#F7F9F5] flex items-center justify-center">
      <p className="text-sm text-[#8FAF8A]">A carregar produto...</p>
    </div>
  );
  if (!produto) return (
    <div style={sans} className="min-h-screen bg-[#F7F9F5] flex items-center justify-center">
      <p className="text-sm text-[#8FAF8A]">Produto não encontrado.</p>
    </div>
  );

  const departamento   = getDepartamentoInfo(produto.nome_categoria);
  const accordionItems = [
    { title: "Descrição",               content: produto.descricao    || "—" },
    { title: "Materiais",               content: produto.materiais    || "—" },
    { title: "Guia de Cuidados",        content: produto.guia_cuidados || "—" },
    { title: "Informações do Fabricante", content: "Moda Chique — Lili Store. Comprometidos com a produção responsável e sustentável." },
  ];

  // Cor selecionada com hex para o swatch
  const corInfo = produto.variantes?.find(v => v.cor === corSelecionada);

  return (
    <div style={sans} className="min-h-screen bg-[#F7F9F5] text-[#2C2C2C]">
      <Navbar />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-8 py-4">
        <div className="flex items-center gap-2 text-xs text-[#8FAF8A]">
          <Link to="/" className="hover:text-[#3D6B4A] transition-colors">Início</Link>
          <span>/</span>
          {departamento && (
            <>
              <Link to={`/catalogo?departamento=${departamento.id}`} className="hover:text-[#3D6B4A] transition-colors">{departamento.label}</Link>
              <span>/</span>
            </>
          )}
          <span className="text-[#3D6B4A]">{produto.nome_produto}</span>
        </div>
      </div>

      {/* Produto Principal */}
      <div className="max-w-7xl mx-auto px-8 pb-16">
        <div className="grid md:grid-cols-2 gap-12 items-start">

          {/* ── Galeria ── */}
          <div className="flex gap-4">
            {/* Miniaturas */}
            <div className="flex flex-col gap-3">
              {imagensDaCor.length > 0 ? imagensDaCor.map((img, i) => (
                <div
                  key={`${corSelecionada}-${i}`}
                  onClick={() => setImagemAtiva(i)}
                  className={`w-16 h-20 rounded-xl cursor-pointer border-2 transition-all overflow-hidden bg-white ${
                    imagemAtiva === i ? "border-[#3D6B4A]" : "border-[#E8F0E6] hover:border-[#C8DFC4]"
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </div>
              )) : (
                <div className="w-16 h-20 rounded-xl border-2 border-[#3D6B4A] bg-white flex items-center justify-center text-2xl text-[#C8DFC4]">📷</div>
              )}
            </div>

            {/* Imagem principal */}
            <div className="flex-1">
              <div
                onClick={() => imagensDaCor.length > 0 && setLightboxAberto(true)}
                className="w-full aspect-[3/4] bg-white rounded-2xl border border-[#E8F0E6] overflow-hidden flex items-center justify-center cursor-zoom-in relative group"
              >
                {imagensDaCor.length > 0 ? (
                  <>
                    <img
                      key={`${corSelecionada}-${imagemAtiva}`}
                      src={imagensDaCor[imagemAtiva]?.url}
                      alt={produto.nome_produto}
                      className="w-full h-full object-cover"
                      style={{
                        opacity: imageFade ? 1 : 0,
                        transition: 'opacity 0.3s ease',
                      }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 rounded-full px-3 py-1.5 text-xs text-[#3D6B4A] font-medium">🔍 Ver em detalhe</span>
                    </div>
                  </>
                ) : (
                  <span className="text-6xl text-[#C8DFC4]">📷</span>
                )}
              </div>
            </div>
          </div>

          {/* ── Informações ── */}
          <div className="pt-2">
            <div className="mb-6">
              <p className="text-xs tracking-[0.15em] uppercase text-[#6B9E63] mb-1">{produto.nome_marca || 'Moda Chique'}</p>
              <h1 style={serif} className="text-4xl font-semibold text-[#1A2E1A] mb-3">{produto.nome_produto}</h1>
              <div className="flex items-center gap-3">
                <span style={serif} className="text-3xl font-semibold text-[#3D6B4A]">
                  {parseFloat(produto.preco).toFixed(2).replace('.', ',')}€
                </span>
                {produto.preco_anterior && (
                  <span className="text-lg text-gray-400 line-through">
                    {parseFloat(produto.preco_anterior).toFixed(2).replace('.', ',')}€
                  </span>
                )}
              </div>
            </div>

            {/* Seleção de Cor */}
            {cores.length > 0 && (
              <div className="mb-6">
                <p className="text-xs tracking-widest uppercase text-[#6B9E63] mb-3 font-medium">
                  Cor:{" "}
                  <span className="text-[#2C2C2C] normal-case tracking-normal font-normal">
                    {corSelecionada || "Seleciona uma cor"}
                  </span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {cores.map((cor, i) => {
                    const hex = produto.variantes?.find(v => v.cor === cor)?.hex_cor;
                    return (
                      <button
                        key={i}
                        onClick={() => setCorSelecionada(cor)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs transition-all ${
                          corSelecionada === cor
                            ? "border-[#3D6B4A] bg-[#3D6B4A] text-white"
                            : "border-[#C8DFC4] bg-white text-[#4A5C4A] hover:border-[#3D6B4A]"
                        }`}
                      >
                        {hex && (
                          <span
                            className="w-3 h-3 rounded-full border border-white/50 flex-shrink-0"
                            style={{ background: hex }}
                          />
                        )}
                        {cor}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Seleção de Tamanho */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs tracking-widest uppercase text-[#6B9E63] font-medium">Tamanho</p>
                {produto.id_categoria_pai === 1 && (
                  <button
                    onClick={() => setGuiaAberto(true)}
                    className="text-xs text-[#6B9E63] border-b border-[#6B9E63] pb-0.5 hover:text-[#3D6B4A] transition-colors"
                  >
                    Guia de Tamanhos
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {tamanhos.map((t) => {
                  const desativado = tamanhoDesativado(t);
                  const stockT = corSelecionada ? (stockPorTamanho[t] ?? null) : null;
                  const semStockT = stockT !== null && Number(stockT) === 0;
                  return (
                    <div key={t} className="relative">
                      <button
                        onClick={() => !desativado && setTamanhoSelecionado(t)}
                        disabled={desativado}
                        title={semStockT ? "Sem stock" : stockT !== null ? `${stockT} em stock` : ""}
                        className={`w-12 h-10 rounded-lg border text-sm font-medium transition-all relative
                          ${semStockT
                            ? "border-[#E8F0E6] bg-white text-[#D0D0D0] cursor-not-allowed"
                            : desativado
                              ? "border-[#E8F0E6] bg-white text-[#C8DFC4] opacity-40 cursor-not-allowed"
                              : tamanhoSelecionado === t
                                ? "border-[#3D6B4A] bg-[#3D6B4A] text-white"
                                : "border-[#C8DFC4] bg-white text-[#4A5C4A] hover:border-[#3D6B4A] hover:text-[#3D6B4A]"
                          }`}
                      >
                        {t}
                        {/* Risca diagonal para sem stock */}
                        {semStockT && (
                          <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <svg className="w-full h-full absolute" viewBox="0 0 48 40" preserveAspectRatio="none">
                              <line x1="4" y1="4" x2="44" y2="36" stroke="#D0D0D0" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                          </span>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Mensagem de estado do stock */}
              {!tamanhoSelecionado && !corSelecionada && (
                <p className="text-xs text-[#8FAF8A] mt-2">Seleciona uma cor e um tamanho para continuar</p>
              )}
              {!tamanhoSelecionado && corSelecionada && (
                <p className="text-xs text-[#8FAF8A] mt-2">Seleciona um tamanho para continuar</p>
              )}
              {semStock && (
                <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-[#FDECEA] border border-[#F5C6C0] rounded-xl">
                  <span className="text-[#C0392B] text-xs">●</span>
                  <p className="text-xs font-medium text-[#C0392B]">Sem stock disponível para esta variante</p>
                </div>
              )}
              {stockBaixo && (
                <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-[#FEF9E7] border border-[#F0D078] rounded-xl">
                  <span className="text-[#A67C00] text-xs">●</span>
                  <p className="text-xs font-medium text-[#A67C00]">Apenas {stockAtual} {stockAtual === 1 ? 'unidade' : 'unidades'} em stock!</p>
                </div>
              )}
              {varianteSelecionada && !semStock && !stockBaixo && (
                <p className="text-xs text-[#6B9E63] mt-2">✓ {stockAtual} unidades disponíveis</p>
              )}
            </div>

            {/* Quantidade + Botões */}
            <div className="flex gap-3 mb-6">
              <div className="flex items-center border border-[#C8DFC4] rounded-full overflow-hidden bg-white">
                <button
                  onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
                  disabled={semStock}
                  className="w-10 h-12 flex items-center justify-center text-[#3D6B4A] hover:bg-[#F0F5EE] transition-colors text-lg font-light disabled:opacity-30"
                >−</button>
                <span className="w-8 text-center text-sm font-medium text-[#2C2C2C]">{quantidade}</span>
                <button
                  onClick={() => setQuantidade(Math.min(stockAtual || 99, quantidade + 1))}
                  disabled={semStock || (varianteSelecionada && quantidade >= stockAtual)}
                  className="w-10 h-12 flex items-center justify-center text-[#3D6B4A] hover:bg-[#F0F5EE] transition-colors text-lg font-light disabled:opacity-30"
                >+</button>
              </div>

              <button
                onClick={handleAdicionar}
                disabled={!varianteSelecionada || semStock}
                className={`flex-1 py-3 rounded-full text-sm tracking-widest uppercase font-medium transition-all ${
                  adicionado
                    ? "bg-[#2C5038] text-white"
                    : semStock
                      ? "bg-[#F3F3F3] text-[#B0B0B0] cursor-not-allowed"
                      : varianteSelecionada
                        ? "bg-[#3D6B4A] text-white hover:bg-[#2C5038]"
                        : "bg-[#C8DFC4] text-[#8FAF8A] cursor-not-allowed"
                }`}
              >
                {adicionado ? "✓ Adicionado!" : semStock ? "Sem Stock Disponível" : "Adicionar ao Carrinho"}
              </button>

              <button
                onClick={handleWishlist}
                className="w-12 h-12 flex items-center justify-center border border-[#C8DFC4] rounded-full bg-white hover:border-[#3D6B4A] transition-all group"
              >
                <Heart 
                  size={20} 
                  strokeWidth={1.5} 
                  className={`${wishlist ? "fill-red-500 text-red-500" : "text-[#4A5C4A] group-hover:text-[#3D6B4A]"}`} 
                />
              </button>
              </div>

            {/* Badges */}
            <div className="grid grid-cols-3 gap-3 mb-8 py-6 border-t border-b border-[#E8F0E6]">
              {[
                { icon: Truck, text: "Envio Grátis", sub: "Acima de 50€" },
                { icon: RotateCcw, text: "30 dias", sub: "Devolução fácil" },
                { icon: ShieldCheck, text: "Pagamento", sub: "100% Seguro" },
              ].map((b, i) => {
                const IconComponent = b.icon;
                return (
                  <div key={i} className="text-center flex flex-col items-center">
                    <div className="text-[#3D6B4A] mb-2">
                      <IconComponent size={22} strokeWidth={1.2} />
                    </div>
                    <div className="text-xs font-semibold text-[#2C3A2C] uppercase tracking-tight">{b.text}</div>
                    <div className="text-[10px] text-[#8FAF8A] mt-0.5">{b.sub}</div>
                  </div>
                );
              })}
            </div>

            {/* Accordion */}
            <div className="border-t border-[#E8F0E6]">
              {accordionItems.map((item, i) => (
                <div key={i} className="border-b border-[#E8F0E6]">
                  <button
                    onClick={() => setAccordionAberto(accordionAberto === i ? null : i)}
                    className="w-full flex items-center justify-between py-4 text-left"
                  >
                    <span className="text-sm font-medium text-[#2C3A2C] tracking-wide">{item.title}</span>
                    <span className={`text-[#6B9E63] transition-transform duration-200 text-xs ${accordionAberto === i ? "rotate-180" : ""}`}>▼</span>
                  </button>
                  {accordionAberto === i && (
                    <div className="pb-4">
                      <p className="text-sm text-[#5C6E5C] leading-relaxed">{item.content}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Produtos Relacionados */}
      {produtosRelacionados.length > 0 && (
        <section className="py-16 px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <p className="text-[11px] tracking-[0.15em] uppercase text-[#6B9E63] mb-2">Também podes gostar</p>
              <h2 style={serif} className="text-4xl font-semibold text-[#1A2E1A]">Produtos Relacionados</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {produtosRelacionados.map((prod) => (
                <Link to={`/produto/${prod.id_produto}`} key={prod.id_produto} onClick={() => window.scrollTo(0,0)} className="block">
                  <div className="bg-white rounded-2xl overflow-hidden border border-[#E8F0E6] hover:shadow-lg hover:shadow-green-100 transition-all group cursor-pointer">
                    <div className="bg-[#F0F5EE] h-52 flex items-center justify-center overflow-hidden">
                      {prod.imagem_principal
                        ? <img src={prod.imagem_principal} alt={prod.nome_produto} className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
                        : <span className="text-4xl text-[#C8DFC4]">📷</span>}
                    </div>
                    <div className="p-4">
                      <div className="text-sm font-medium text-[#2C3A2C] mb-1">{prod.nome_produto}</div>
                      <div className="text-base font-semibold text-[#3D6B4A]">{parseFloat(prod.preco).toFixed(2).replace('.', ',')}€</div>
                      <button className="w-full mt-3 bg-[#F0F5EE] text-[#3D6B4A] text-[10px] tracking-widest uppercase py-2 rounded-lg hover:bg-[#3D6B4A] hover:text-white transition-colors">
                        Ver Produto
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lightbox */}
      {lightboxAberto && imagensDaCor.length > 0 && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={() => setLightboxAberto(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full mx-8" onClick={e => e.stopPropagation()}>
            <img
              key={`lb-${corSelecionada}-${imagemAtiva}`}
              src={imagensDaCor[imagemAtiva]?.url}
              alt={produto.nome_produto}
              className="w-full h-full object-contain max-h-[80vh] rounded-xl"
              style={{ opacity: imageFade ? 1 : 0, transition: 'opacity 0.3s ease' }}
            />
            <button
              onClick={() => setLightboxAberto(false)}
              className="absolute top-3 right-3 w-9 h-9 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white transition-all text-lg"
            >✕</button>
            {imagemAtiva > 0 && (
              <button
                onClick={() => setImagemAtiva(imagemAtiva - 1)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white transition-all text-lg"
              >‹</button>
            )}
            {imagemAtiva < imagensDaCor.length - 1 && (
              <button
                onClick={() => setImagemAtiva(imagemAtiva + 1)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white transition-all text-lg"
              >›</button>
            )}
            <div className="flex gap-2 justify-center mt-4">
              {imagensDaCor.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setImagemAtiva(i)}
                  className={`w-12 h-14 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                    imagemAtiva === i ? "border-white" : "border-white/30 hover:border-white/60"
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <p className="text-center text-white/60 text-xs mt-3">
              {imagemAtiva + 1} / {imagensDaCor.length}
            </p>
          </div>
        </div>
      )}

      <Footer />
      {guiaAberto && <GuiaTamanhos onClose={() => setGuiaAberto(false)} />}
    </div>
  );
}
