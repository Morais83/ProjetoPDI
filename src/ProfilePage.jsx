import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

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

const pedidos = [
  { id: "#0001", produto: "Blazer Alfaiataria", preco: "39,90", data: "18/04/2026", status: "Enviada", emoji: "🧥" },
  { id: "#0002", produto: "Vestido Linho Verde", preco: "59,90", data: "10/04/2026", status: "Entregue", emoji: "👗" },
  { id: "#0003", produto: "Sweatshirt Oversized", preco: "39,90", data: "01/04/2026", status: "Entregue", emoji: "👕" },
];

const favoritos = [
  { id: 1, nome: "Blazer Alfaiataria", preco: "39,90", emoji: "🧥", bg: "bg-[#F0F5EE]" },
  { id: 2, nome: "Vestido Linho", preco: "59,90", emoji: "👗", bg: "bg-[#F5F0EE]" },
  { id: 3, nome: "Casaco Bege", preco: "94,90", emoji: "🧥", bg: "bg-[#EEF5EC]" },
  { id: 4, nome: "Saia Floral", preco: "44,90", emoji: "👗", bg: "bg-[#F5F0EE]" },
];

const statusStyles = {
  Enviada: "bg-[#E8F0E6] text-[#3D6B4A]",
  Entregue: "bg-[#E8F0E6] text-[#2C5038]",
  Pendente: "bg-[#FEF9E7] text-[#A67C00]",
  Cancelada: "bg-[#FDECEA] text-[#C0392B]",
};

export default function ProfilePage() {
  const [secaoAtiva, setSecaoAtiva] = useState("perfil");
  const [favoritoIdx, setFavoritoIdx] = useState(0);
  const [perfil, setPerfil] = useState({
    nome: "Ana Silva",
    email: "ana@email.com",
    telefone: "+351 912 345 678",
    dataNascimento: "15/03/1995",
  });
  const [senha, setSenha] = useState({ atual: "", nova: "", confirmar: "" });
  const [moradas, setMoradas] = useState([
    { id: 1, label: "Casa", morada: "Rua das Flores, 12", cidade: "Lisboa", cp: "1000-001", principal: true },
  ]);
  const [medidas, setMedidas] = useState({ busto: "", cintura: "", anca: "", altura: "", tamEU: "", tamInt: "" });
  const [guardado, setGuardado] = useState(false);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Jost:wght@300;400;500&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  const guardar = () => {
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2000);
  };

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
              {secoes.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSecaoAtiva(s.id)}
                  className={`w-full text-left px-5 py-2.5 text-sm transition-colors ${
                    secaoAtiva === s.id
                      ? "text-[#3D6B4A] font-medium bg-[#F0F5EE]"
                      : "text-[#4A5C4A] hover:text-[#3D6B4A] hover:bg-[#F7F9F5]"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </nav>
            <div className="px-3 py-3 border-t border-[#E8F0E6]">
              <Link to="/" className="w-full block text-left px-5 py-2.5 text-sm text-[#C0392B] hover:bg-[#FDECEA] rounded-lg transition-colors">
                Sair
              </Link>
            </div>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 space-y-6">

          {/* Perfil */}
          {secaoAtiva === "perfil" && (
            <>
              {/* Atalhos */}
              <div className="bg-white rounded-2xl border border-[#E8F0E6] p-6">
                <p className="text-xs tracking-[0.15em] uppercase text-[#6B9E63] mb-1">Bem-vinda</p>
                <h1 style={serif} className="text-3xl font-semibold text-[#1A2E1A] mb-6">Olá, {perfil.nome.split(" ")[0]} 👋</h1>
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { icon: "👤", label: "Dados Pessoais", sub: "Edita o teu perfil" },
                    { icon: "🔒", label: "Palavra-passe e Segurança", sub: "Altera a senha" },
                    { icon: "📍", label: "Lista de Moradas", sub: "Gere as tuas moradas" },
                    { icon: "📏", label: "Minhas Medidas", sub: "Tamanhos guardados" },
                  ].map((item, i) => (
                    <button
                      key={i}
                      onClick={() => setSecaoAtiva(["perfil", "perfil", "moradas", "medidas"][i])}
                      className="flex flex-col items-center text-center p-4 rounded-xl border border-[#E8F0E6] hover:border-[#3D6B4A] hover:bg-[#F7F9F5] transition-all"
                    >
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
                    { label: "Data de Nascimento", key: "dataNascimento", type: "text" },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block text-[11px] tracking-widest uppercase text-[#6B9E63] mb-1 font-medium">{field.label}</label>
                      <input
                        type={field.type}
                        value={perfil[field.key]}
                        onChange={(e) => setPerfil({ ...perfil, [field.key]: e.target.value })}
                        className="w-full border-b border-[#C8DFC4] py-2 text-sm outline-none focus:border-[#3D6B4A] bg-transparent transition-all"
                      />
                    </div>
                  ))}
                </div>
                <button onClick={guardar} className={`mt-6 px-8 py-3 rounded-full text-xs tracking-widest uppercase transition-all ${guardado ? "bg-[#2C5038] text-white" : "bg-[#3D6B4A] text-white hover:bg-[#2C5038]"}`}>
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
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block text-[11px] tracking-widest uppercase text-[#6B9E63] mb-1 font-medium">{field.label}</label>
                      <input
                        type="password"
                        value={senha[field.key]}
                        onChange={(e) => setSenha({ ...senha, [field.key]: e.target.value })}
                        placeholder="••••••••"
                        className="w-full border-b border-[#C8DFC4] py-2 text-sm outline-none focus:border-[#3D6B4A] bg-transparent transition-all placeholder:text-gray-300"
                      />
                    </div>
                  ))}
                </div>
                <button className="mt-6 px-8 py-3 rounded-full text-xs tracking-widest uppercase bg-[#3D6B4A] text-white hover:bg-[#2C5038] transition-all">
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
                <button
                  onClick={() => setMoradas([...moradas, { id: Date.now(), label: "Nova morada", morada: "", cidade: "", cp: "", principal: false }])}
                  className="text-xs tracking-widest uppercase px-4 py-2 rounded-full border border-[#C8DFC4] text-[#3D6B4A] hover:bg-[#3D6B4A] hover:text-white transition-all"
                >
                  + Adicionar
                </button>
              </div>
              <div className="space-y-4">
                {moradas.map((m) => (
                  <div key={m.id} className="border border-[#E8F0E6] rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">📍</span>
                        <span className="text-sm font-medium text-[#2C3A2C]">{m.label}</span>
                        {m.principal && <span className="text-[10px] bg-[#E8F0E6] text-[#3D6B4A] px-2 py-0.5 rounded-full">Principal</span>}
                      </div>
                      <button onClick={() => setMoradas(moradas.filter((x) => x.id !== m.id))} className="text-xs text-[#C0392B] hover:underline">Remover</button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: "Morada", key: "morada" },
                        { label: "Cidade", key: "cidade" },
                        { label: "Código Postal", key: "cp" },
                        { label: "Etiqueta", key: "label" },
                      ].map((field) => (
                        <div key={field.key}>
                          <label className="block text-[11px] tracking-widest uppercase text-[#6B9E63] mb-1">{field.label}</label>
                          <input
                            type="text"
                            value={m[field.key]}
                            onChange={(e) => setMoradas(moradas.map((x) => x.id === m.id ? { ...x, [field.key]: e.target.value } : x))}
                            className="w-full border-b border-[#C8DFC4] py-2 text-sm outline-none focus:border-[#3D6B4A] bg-transparent"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={guardar} className={`mt-6 px-8 py-3 rounded-full text-xs tracking-widest uppercase transition-all ${guardado ? "bg-[#2C5038] text-white" : "bg-[#3D6B4A] text-white hover:bg-[#2C5038]"}`}>
                {guardado ? "✓ Guardado!" : "Guardar Moradas"}
              </button>
            </div>
          )}

          {/* Medidas */}
          {secaoAtiva === "medidas" && (
            <div className="bg-white rounded-2xl border border-[#E8F0E6] p-6">
              <h2 style={serif} className="text-2xl font-semibold text-[#1A2E1A] mb-2">Minhas Medidas</h2>
              <p className="text-sm text-[#8FAF8A] mb-6">Guarda as tuas medidas para uma experiência de compra mais fácil.</p>
              <div className="grid grid-cols-2 gap-5">
                {[
                  { label: "Busto (cm)", key: "busto" },
                  { label: "Cintura (cm)", key: "cintura" },
                  { label: "Anca (cm)", key: "anca" },
                  { label: "Altura (cm)", key: "altura" },
                  { label: "Tamanho EU", key: "tamEU" },
                  { label: "Tamanho Internacional", key: "tamInt" },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="block text-[11px] tracking-widest uppercase text-[#6B9E63] mb-1 font-medium">{field.label}</label>
                    <input
                      type="text"
                      value={medidas[field.key]}
                      onChange={(e) => setMedidas({ ...medidas, [field.key]: e.target.value })}
                      placeholder="—"
                      className="w-full border-b border-[#C8DFC4] py-2 text-sm outline-none focus:border-[#3D6B4A] bg-transparent placeholder:text-gray-300"
                    />
                  </div>
                ))}
              </div>
              <button onClick={guardar} className={`mt-6 px-8 py-3 rounded-full text-xs tracking-widest uppercase transition-all ${guardado ? "bg-[#2C5038] text-white" : "bg-[#3D6B4A] text-white hover:bg-[#2C5038]"}`}>
                {guardado ? "✓ Guardado!" : "Guardar Medidas"}
              </button>
            </div>
          )}

          {/* Pedidos */}
          {secaoAtiva === "pedidos" && (
            <div className="bg-white rounded-2xl border border-[#E8F0E6] p-6">
              <h2 style={serif} className="text-2xl font-semibold text-[#1A2E1A] mb-6">Meus Pedidos</h2>
              <div className="space-y-3">
                {pedidos.map((p) => (
                  <div key={p.id} className="flex items-center gap-4 border border-[#E8F0E6] rounded-xl p-4 hover:bg-[#F7F9F5] transition-colors">
                    <div className="w-14 h-14 bg-[#F0F5EE] rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                      {p.emoji}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#2C3A2C]">{p.produto}</p>
                      <p className="text-xs text-[#8FAF8A]">Encomenda {p.id} · {p.data}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-[#3D6B4A] mb-1">{p.preco}€</p>
                      <span className={`text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-full font-medium ${statusStyles[p.status]}`}>
                        {p.status}
                      </span>
                    </div>
                    <button className="text-xs text-[#3D6B4A] hover:underline ml-2 whitespace-nowrap">Ver detalhes</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Favoritos */}
          {secaoAtiva === "favoritos" && (
            <div className="bg-white rounded-2xl border border-[#E8F0E6] p-6">
              <h2 style={serif} className="text-2xl font-semibold text-[#1A2E1A] mb-6">Lista de Favoritos</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {favoritos.map((prod) => (
                  <Link to={`/produto/${prod.id}`} key={prod.id} onClick={() => window.scrollTo(0, 0)} className="block">
                    <div className="bg-white rounded-xl overflow-hidden border border-[#E8F0E6] hover:shadow-lg hover:shadow-green-100 transition-all group">
                      <div className={`${prod.bg} h-36 flex items-center justify-center text-5xl relative`}>
                        <span className="group-hover:scale-110 transition-transform">{prod.emoji}</span>
                      </div>
                      <div className="p-3">
                        <p className="text-xs font-medium text-[#2C3A2C] mb-1">{prod.nome}</p>
                        <p className="text-sm font-semibold text-[#3D6B4A]">{prod.preco}€</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
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
      <Footer />
    </div>
  );
}