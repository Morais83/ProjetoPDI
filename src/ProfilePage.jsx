import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "./footer";
import Navbar from "./navbar";

const serif = { fontFamily: "'Cormorant Garamond', Georgia, serif" };
const sans = { fontFamily: "'Jost', sans-serif" };

const secoes = [
  { id: "perfil", label: "Meu Perfil" },
  { id: "moradas", label: "Lista de Moradas" },
  { id: "medidas", label: "Minhas Medidas" },
  { id: "pedidos", label: "Meus Pedidos" },
  { id: "favoritos", label: "Lista de Favoritos" },
  { id: "servico", label: "Serviço ao Cliente" },
];

const statusStyles = {
  pendente: "bg-[#FEF9E7] text-[#A67C00]",
  confirmado: "bg-[#E6F1FB] text-[#185FA5]",
  enviado: "bg-[#E8F0E6] text-[#3D6B4A]",
  entregue: "bg-[#E8F0E6] text-[#2C5038]",
  cancelado: "bg-[#FDECEA] text-[#C0392B]",
};

const statusLabels = {
  pendente: "Pendente", confirmado: "Confirmado",
  enviado: "Enviado", entregue: "Entregue", cancelado: "Cancelado",
};

const BASE = 'http://localhost:5000/api';

function FavoritosSecao({ serif }) {
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('http://localhost:5000/api/favoritos', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(dados => { setFavoritos(dados); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const remover = async (id_produto) => {
    await fetch(`http://localhost:5000/api/favoritos/${id_produto}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    setFavoritos(prev => prev.filter(f => f.id_produto !== id_produto));
  };

  if (loading) return <div className="bg-white rounded-2xl border border-[#E8F0E6] p-6"><p className="text-sm text-[#8FAF8A]">A carregar...</p></div>;

  return (
    <div className="bg-white rounded-2xl border border-[#E8F0E6] p-6">
      <h2 style={serif} className="text-2xl font-semibold text-[#1A2E1A] mb-6">Lista de Favoritos</h2>
      {favoritos.length === 0 ? (
        <p className="text-sm text-[#8FAF8A]">Ainda não tens favoritos guardados.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {favoritos.map(prod => (
            <div key={prod.id_favorito} className="relative">
              <Link to={`/produto/${prod.id_produto}`} onClick={() => window.scrollTo(0, 0)} className="block">
                <div className="bg-white rounded-xl overflow-hidden border border-[#E8F0E6] hover:shadow-lg hover:shadow-green-100 transition-all group">
                  <div className="bg-[#F0F5EE] h-36 flex items-center justify-center overflow-hidden">
                    {prod.imagem_url
                      ? <img src={prod.imagem_url} alt={prod.nome_produto} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      : <span className="text-4xl text-[#C8DFC4]">📷</span>
                    }
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-medium text-[#2C3A2C] mb-1">{prod.nome_produto}</p>
                    <p className="text-sm font-semibold text-[#3D6B4A]">{parseFloat(prod.preco).toFixed(2).replace('.', ',')}€</p>
                  </div>
                </div>
              </Link>
              <button
                onClick={() => remover(prod.id_produto)}
                className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center border border-[#E8F0E6] hover:border-[#C0392B] transition-all text-sm"
              >
                ❤️
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MedidasSecao({ serif, token }) {
  const [medidas, setMedidas] = useState({ busto: "", cintura: "", anca: "", altura: "" });
  const [guardado, setGuardado] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/utilizadores/me/medidas', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(dados => {
        if (dados) {
          setMedidas({
            busto: dados.busto || "",
            cintura: dados.cintura || "",
            anca: dados.anca || "",
            altura: dados.altura || "",
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const guardar = async () => {
    try {
      await fetch('http://localhost:5000/api/utilizadores/me/medidas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(medidas),
      });
      setGuardado(true);
      setTimeout(() => setGuardado(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="bg-white rounded-2xl border border-[#E8F0E6] p-6">
      <p className="text-sm text-[#8FAF8A]">A carregar...</p>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl border border-[#E8F0E6] p-6">
      <h2 style={serif} className="text-2xl font-semibold text-[#1A2E1A] mb-2">Minhas Medidas</h2>
      <p className="text-sm text-[#8FAF8A] mb-6">Guarda as tuas medidas para uma experiência de compra mais fácil. Todas as medidas em centímetros (cm).</p>
      <div className="grid grid-cols-2 gap-5">
        {[
          { label: "Busto (cm)", key: "busto", placeholder: "ex: 86" },
          { label: "Cintura (cm)", key: "cintura", placeholder: "ex: 68" },
          { label: "Anca (cm)", key: "anca", placeholder: "ex: 94" },
          { label: "Altura (cm)", key: "altura", placeholder: "ex: 165" },
        ].map(field => (
          <div key={field.key}>
            <label className="block text-[11px] tracking-widest uppercase text-[#6B9E63] mb-1 font-medium">{field.label}</label>
            <input
              type="number"
              value={medidas[field.key]}
              onChange={e => setMedidas({ ...medidas, [field.key]: e.target.value })}
              placeholder={field.placeholder}
              className="w-full border-b border-[#C8DFC4] py-2 text-sm outline-none focus:border-[#3D6B4A] bg-transparent placeholder:text-gray-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        ))}
      </div>
      <button onClick={guardar}
        className={`mt-6 px-8 py-3 rounded-full text-xs tracking-widest uppercase transition-all ${guardado ? "bg-[#2C5038] text-white" : "bg-[#3D6B4A] text-white hover:bg-[#2C5038]"}`}>
        {guardado ? "✓ Guardado!" : "Guardar Medidas"}
      </button>
    </div>
  );
}

export default function ProfilePage() {
  const [secaoAtiva, setSecaoAtiva] = useState("perfil");
  const [perfil, setPerfil] = useState({ nome: "", email: "", telefone: "", prefixo_tel: "+351" });
  const [senha, setSenha] = useState({ atual: "", nova: "", confirmar: "" });
  const [moradas, setMoradas] = useState([]);
  const [encomendas, setEncomendas] = useState([]);
  const [medidas, setMedidas] = useState({ busto: "", cintura: "", anca: "", altura: "", tamEU: "", tamInt: "" });
  const [guardado, setGuardado] = useState(false);
  const [erroSenha, setErroSenha] = useState("");
  const [loading, setLoading] = useState(true);
  const [encomendaAberta, setEncomendaAberta] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Jost:wght@300;400;500&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    carregarPerfil();
  }, []);

  useEffect(() => {
    if (secaoAtiva === "moradas") carregarMoradas();
    if (secaoAtiva === "pedidos") carregarEncomendas();
  }, [secaoAtiva]);

  const carregarPerfil = async () => {
    try {
      const res = await fetch(`${BASE}/utilizadores/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const dados = await res.json();
      setPerfil({
        nome: dados.nome || "",
        email: dados.email || "",
        telefone: dados.telefone || "",
        prefixo_tel: dados.prefixo_tel || "+351",
      });
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const carregarMoradas = async () => {
    try {
      const res = await fetch(`${BASE}/utilizadores/me/moradas`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const dados = await res.json();
      setMoradas(dados);
    } catch (err) {
      console.error(err);
    }
  };

  const carregarEncomendas = async () => {
    try {
      const res = await fetch(`${BASE}/utilizadores/me/encomendas`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const dados = await res.json();
      setEncomendas(dados);
    } catch (err) {
      console.error(err);
    }
  };

  const guardarPerfil = async () => {
    try {
      await fetch(`${BASE}/utilizadores/me`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(perfil),
      });
      setGuardado(true);
      setTimeout(() => setGuardado(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const alterarSenha = async () => {
    setErroSenha("");
    if (senha.nova !== senha.confirmar) {
      setErroSenha("As passwords não coincidem");
      return;
    }
    try {
      const res = await fetch(`${BASE}/utilizadores/me/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ atual: senha.atual, nova: senha.nova }),
      });
      const dados = await res.json();
      if (dados.erro) {
        setErroSenha(dados.erro);
      } else {
        setSenha({ atual: "", nova: "", confirmar: "" });
        setGuardado(true);
        setTimeout(() => setGuardado(false), 2000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const adicionarMorada = async () => {
    const nova = { rua: "", cidade: "", codigo_postal: "", pais: "Portugal", predefinida: false };
    try {
      const res = await fetch(`${BASE}/utilizadores/me/moradas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(nova),
      });
      const dados = await res.json();
      setMoradas([...moradas, { ...nova, id_morada: dados.id }]);
    } catch (err) {
      console.error(err);
    }
  };

  const guardarMorada = async (m) => {
    try {
      await fetch(`${BASE}/utilizadores/me/moradas/${m.id_morada}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(m),
      });
      setGuardado(true);
      setTimeout(() => setGuardado(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const removerMorada = async (id) => {
    try {
      await fetch(`${BASE}/utilizadores/me/moradas/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setMoradas(moradas.filter(m => m.id_morada !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const formatData = (data) => new Date(data).toLocaleDateString('pt-PT');

  if (loading) return (
    <div style={sans} className="min-h-screen bg-[#F7F9F5] flex items-center justify-center">
      <p className="text-sm text-[#8FAF8A]">A carregar...</p>
    </div>
  );

  return (
    <div style={sans} className="min-h-screen bg-[#F7F9F5] text-[#2C2C2C]">
      <div className="bg-[#3D6B4A] text-white text-center py-2 text-xs tracking-widest">
        ✦ Envio gratuito em compras acima de 50€ &nbsp;|&nbsp; Nova coleção Primavera-Verão disponível ✦
      </div>
      <Navbar />

      <div className="max-w-7xl mx-auto px-8 py-10 flex gap-8 items-start">

        {/* Sidebar */}
        <div className="w-52 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-[#E8F0E6] overflow-hidden">
            <div className="px-5 py-5 border-b border-[#E8F0E6]">
              <div className="w-12 h-12 rounded-full bg-[#E8F0E6] flex items-center justify-center text-xl font-semibold text-[#3D6B4A] mb-2">
                {perfil.nome.charAt(0)}
              </div>
              <p style={serif} className="text-lg font-semibold text-[#1A2E1A]">{perfil.nome}</p>
              <p className="text-xs text-[#8FAF8A]">{perfil.email}</p>
            </div>
            <nav className="py-2">
              {secoes.map(s => (
                <button key={s.id} onClick={() => setSecaoAtiva(s.id)}
                  className={`w-full text-left px-5 py-2.5 text-sm transition-colors ${
                    secaoAtiva === s.id ? "text-[#3D6B4A] font-medium bg-[#F0F5EE]" : "text-[#4A5C4A] hover:text-[#3D6B4A] hover:bg-[#F7F9F5]"
                  }`}>
                  {s.label}
                </button>
              ))}
            </nav>
            <div className="px-3 py-3 border-t border-[#E8F0E6]">
              <button onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('utilizador'); window.location.href = '/'; }}
                className="w-full block text-left px-5 py-2.5 text-sm text-[#C0392B] hover:bg-[#FDECEA] rounded-lg transition-colors">
                Sair
              </button>
            </div>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 space-y-6">

          {/* Perfil */}
          {secaoAtiva === "perfil" && (
            <>
              <div className="bg-white rounded-2xl border border-[#E8F0E6] p-6">
                <h1 style={serif} className="text-3xl font-semibold text-[#1A2E1A] mb-6">Olá, {perfil.nome.split(" ")[0]} 👋</h1>
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { icon: "👤", label: "Dados Pessoais", sub: "Edita o teu perfil", sec: "perfil" },
                    { icon: "🔒", label: "Palavra-passe", sub: "Altera a senha", sec: "perfil" },
                    { icon: "📍", label: "Moradas", sub: "Gere as tuas moradas", sec: "moradas" },
                    { icon: "📏", label: "Medidas", sub: "Tamanhos guardados", sec: "medidas" },
                  ].map((item, i) => (
                    <button key={i} onClick={() => setSecaoAtiva(item.sec)}
                      className="flex flex-col items-center text-center p-4 rounded-xl border border-[#E8F0E6] hover:border-[#3D6B4A] hover:bg-[#F7F9F5] transition-all">
                      <span className="text-2xl mb-2">{item.icon}</span>
                      <p className="text-xs font-medium text-[#2C3A2C]">{item.label}</p>
                      <p className="text-[10px] text-[#8FAF8A] mt-0.5">{item.sub}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dados Pessoais */}
              <div className="bg-white rounded-2xl border border-[#E8F0E6] p-6">
                <h2 style={serif} className="text-2xl font-semibold text-[#1A2E1A] mb-6">Dados Pessoais</h2>
                <div className="grid grid-cols-2 gap-5">
                  {[
                    { label: "Nome completo", key: "nome", type: "text" },
                    { label: "Email", key: "email", type: "email" },
                    { label: "Telefone", key: "telefone", type: "tel" },
                  ].map(field => (
                    <div key={field.key}>
                      <label className="block text-[11px] tracking-widest uppercase text-[#6B9E63] mb-1 font-medium">{field.label}</label>
                      <input type={field.type} value={perfil[field.key]}
                        onChange={e => setPerfil({ ...perfil, [field.key]: e.target.value })}
                        className="w-full border-b border-[#C8DFC4] py-2 text-sm outline-none focus:border-[#3D6B4A] bg-transparent transition-all" />
                    </div>
                  ))}
                </div>
                <button onClick={guardarPerfil}
                  className={`mt-6 px-8 py-3 rounded-full text-xs tracking-widest uppercase transition-all ${guardado ? "bg-[#2C5038] text-white" : "bg-[#3D6B4A] text-white hover:bg-[#2C5038]"}`}>
                  {guardado ? "✓ Guardado!" : "Guardar Alterações"}
                </button>
              </div>

              {/* Palavra-passe */}
              <div className="bg-white rounded-2xl border border-[#E8F0E6] p-6">
                <h2 style={serif} className="text-2xl font-semibold text-[#1A2E1A] mb-6">Palavra-passe e Segurança</h2>
                <div className="space-y-4 max-w-sm">
                  {[
                    { label: "Palavra-passe atual", key: "atual" },
                    { label: "Nova palavra-passe", key: "nova" },
                    { label: "Confirmar nova palavra-passe", key: "confirmar" },
                  ].map(field => (
                    <div key={field.key}>
                      <label className="block text-[11px] tracking-widest uppercase text-[#6B9E63] mb-1 font-medium">{field.label}</label>
                      <input type="password" value={senha[field.key]}
                        onChange={e => setSenha({ ...senha, [field.key]: e.target.value })}
                        placeholder="••••••••"
                        className="w-full border-b border-[#C8DFC4] py-2 text-sm outline-none focus:border-[#3D6B4A] bg-transparent transition-all placeholder:text-gray-300" />
                    </div>
                  ))}
                  {erroSenha && <p className="text-xs text-red-500">{erroSenha}</p>}
                </div>
                <button onClick={alterarSenha}
                  className="mt-6 px-8 py-3 rounded-full text-xs tracking-widest uppercase bg-[#3D6B4A] text-white hover:bg-[#2C5038] transition-all">
                  Atualizar Senha
                </button>
              </div>
            </>
          )}

          {/* Moradas */}
          {secaoAtiva === "moradas" && (
            <div className="bg-white rounded-2xl border border-[#E8F0E6] p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 style={serif} className="text-2xl font-semibold text-[#1A2E1A]">Lista de Moradas</h2>
                <button onClick={adicionarMorada}
                  className="text-xs tracking-widest uppercase px-4 py-2 rounded-full border border-[#C8DFC4] text-[#3D6B4A] hover:bg-[#3D6B4A] hover:text-white transition-all">
                  + Adicionar
                </button>
              </div>
              <div className="space-y-4">
                {moradas.map(m => (
                  <div key={m.id_morada} className="border border-[#E8F0E6] rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">📍</span>
                        {m.predefinida ? <span className="text-[10px] bg-[#E8F0E6] text-[#3D6B4A] px-2 py-0.5 rounded-full">Principal</span> : null}
                      </div>
                      <button onClick={() => removerMorada(m.id_morada)} className="text-xs text-[#C0392B] hover:underline">Remover</button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: "Rua", key: "rua" },
                        { label: "Cidade", key: "cidade" },
                        { label: "Código Postal", key: "codigo_postal" },
                        { label: "País", key: "pais" },
                      ].map(field => (
                        <div key={field.key}>
                          <label className="block text-[11px] tracking-widest uppercase text-[#6B9E63] mb-1">{field.label}</label>
                          <input type="text" value={m[field.key] || ""}
                            onChange={e => setMoradas(moradas.map(x => x.id_morada === m.id_morada ? { ...x, [field.key]: e.target.value } : x))}
                            className="w-full border-b border-[#C8DFC4] py-2 text-sm outline-none focus:border-[#3D6B4A] bg-transparent" />
                        </div>
                      ))}
                    </div>
                    <button onClick={() => guardarMorada(m)}
                      className="mt-4 px-6 py-2 rounded-full text-xs tracking-widest uppercase bg-[#3D6B4A] text-white hover:bg-[#2C5038] transition-all">
                      Guardar
                    </button>
                  </div>
                ))}
                {moradas.length === 0 && <p className="text-sm text-[#8FAF8A]">Ainda não tens moradas guardadas.</p>}
              </div>
            </div>
          )}

          {/* Medidas */}
          {secaoAtiva === "medidas" && (
            <MedidasSecao serif={serif} token={token} />
          )}

          {/* Pedidos */}
          {secaoAtiva === "pedidos" && (
            <div className="bg-white rounded-2xl border border-[#E8F0E6] p-6">
              <h2 style={serif} className="text-2xl font-semibold text-[#1A2E1A] mb-6">Meus Pedidos</h2>
              {encomendas.length === 0 ? (
                <p className="text-sm text-[#8FAF8A]">Ainda não tens encomendas.</p>
              ) : (
                <div className="space-y-3">
                  {encomendas.map(enc => (
                    <div
                      key={enc.id_encomenda}
                      onClick={() => setEncomendaAberta(enc)}
                      className="flex items-center justify-between border border-[#E8F0E6] rounded-xl p-4 hover:bg-[#F7F9F5] transition-colors cursor-pointer hover:border-[#3D6B4A]"
                    >
                      <div>
                        <p className="text-sm font-medium text-[#2C3A2C]">Encomenda #{String(enc.id_encomenda).padStart(4, '0')}</p>
                        <p className="text-xs text-[#8FAF8A]">{formatData(enc.data_pedido)} · {enc.linhas?.reduce((acc, l) => acc + l.quantidade, 0)} artigo(s)</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-semibold text-[#3D6B4A]">{parseFloat(enc.total_pago).toFixed(2)}€</p>
                          <span className={`text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-full font-medium ${statusStyles[enc.estado]}`}>
                            {statusLabels[enc.estado]}
                          </span>
                        </div>
                        <span className="text-[#C8DFC4] text-sm">→</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Favoritos */}
          {secaoAtiva === "favoritos" && (
            <FavoritosSecao serif={serif} />
          )}

          {/* Serviço ao Cliente */}
          {secaoAtiva === "servico" && (
            <div className="bg-white rounded-2xl border border-[#E8F0E6] p-6">
              <h2 style={serif} className="text-2xl font-semibold text-[#1A2E1A] mb-6">Serviço ao Cliente</h2>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { icon: "✉️", label: "Minhas Mensagens", sub: "Histórico de conversas" },
                  { icon: "📞", label: "Contacte-nos", sub: "Segunda a Sábado, 9h-19h" },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center text-center p-6 rounded-xl border border-[#E8F0E6] hover:border-[#3D6B4A] hover:bg-[#F7F9F5] transition-all cursor-pointer">
                    <span className="text-3xl mb-3">{item.icon}</span>
                    <p className="text-sm font-medium text-[#2C3A2C]">{item.label}</p>
                    <p className="text-xs text-[#8FAF8A] mt-1">{item.sub}</p>
                  </div>
                ))}
              </div>
              <div className="border border-[#E8F0E6] rounded-xl p-5">
                <h3 style={serif} className="text-xl font-semibold text-[#1A2E1A] mb-4">Enviar Mensagem</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] tracking-widest uppercase text-[#6B9E63] mb-1">Assunto</label>
                    <input type="text" placeholder="Como podemos ajudar?" className="w-full border-b border-[#C8DFC4] py-2 text-sm outline-none focus:border-[#3D6B4A] bg-transparent" />
                  </div>
                  <div>
                    <label className="block text-[11px] tracking-widest uppercase text-[#6B9E63] mb-1">Mensagem</label>
                    <textarea rows={4} placeholder="Descreve a tua questão..." className="w-full border border-[#C8DFC4] rounded-lg p-3 text-sm outline-none focus:border-[#3D6B4A] bg-transparent resize-none" />
                  </div>
                  <button className="px-8 py-3 rounded-full text-xs tracking-widest uppercase bg-[#3D6B4A] text-white hover:bg-[#2C5038] transition-all">
                    Enviar Mensagem
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Modal Detalhes Encomenda */}
      {encomendaAberta && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4" onClick={() => setEncomendaAberta(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-8" onClick={e => e.stopPropagation()}>
            
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 style={serif} className="text-2xl font-semibold text-[#1A2E1A]">
                  Encomenda #{String(encomendaAberta.id_encomenda).padStart(4, '0')}
                </h2>
                <p className="text-xs text-[#8FAF8A] mt-1">{formatData(encomendaAberta.data_pedido)}</p>
              </div>
              <button onClick={() => setEncomendaAberta(null)} className="w-9 h-9 flex items-center justify-center rounded-full border border-[#E8F0E6] text-[#6B9E63] hover:bg-[#F0F5EE] transition-all">✕</button>
            </div>

            {/* Estado */}
            <div className="mb-6">
              <span className={`text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-full font-medium ${statusStyles[encomendaAberta.estado]}`}>
                {statusLabels[encomendaAberta.estado]}
              </span>
            </div>

            {/* Produtos */}
            <div className="mb-6">
              <p className="text-[11px] tracking-widest uppercase text-[#6B9E63] mb-3 font-medium">Produtos</p>
              <div className="space-y-3">
                {encomendaAberta.linhas?.map((l, i) => (
                  <Link
                    key={i}
                    to={`/produto/${l.id_produto || ''}`}
                    onClick={() => { setEncomendaAberta(null); window.scrollTo(0, 0); }}
                    className="flex items-center gap-4 border border-[#E8F0E6] rounded-xl p-3 hover:border-[#3D6B4A] hover:bg-[#F7F9F5] transition-all group"
                  >
                    <div className="w-12 h-12 bg-[#F0F5EE] rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {l.imagem_url
                        ? <img src={l.imagem_url} alt="" className="w-full h-full object-cover" />
                        : <span className="text-xl text-[#C8DFC4]">📦</span>
                      }
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#2C3A2C] group-hover:text-[#3D6B4A] transition-colors">{l.nome_produto}</p>
                      <p className="text-xs text-[#8FAF8A]">Tam: {l.tamanho} · Cor: {l.cor} · Qtd: {l.quantidade}</p>
                    </div>
                    <p className="text-sm font-semibold text-[#3D6B4A]">{parseFloat(l.preco_unitario).toFixed(2)}€</p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Resumo */}
            <div className="bg-[#F7F9F5] rounded-xl p-4 space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-[#8FAF8A]">Método de pagamento</span>
                <span className="text-[#2C3A2C] uppercase">{encomendaAberta.metodo_pagamento}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#8FAF8A]">Portes de envio</span>
                <span className="text-[#2C3A2C]">{parseFloat(encomendaAberta.portes_envio) === 0 ? 'Grátis' : `${parseFloat(encomendaAberta.portes_envio).toFixed(2)}€`}</span>
              </div>
              <div className="flex justify-between text-sm border-t border-[#E8F0E6] pt-2 mt-2">
                <span className="font-medium text-[#2C3A2C]">Total</span>
                <span className="font-semibold text-[#3D6B4A]">{parseFloat(encomendaAberta.total_pago).toFixed(2)}€</span>
              </div>
            </div>

            <button onClick={() => setEncomendaAberta(null)}
              className="w-full py-3 rounded-full border border-[#C8DFC4] text-sm text-[#5C6E5C] hover:bg-[#F0F5EE] transition-all">
              Fechar
            </button>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}