import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { login, pedirRecuperacao } from './api'; 

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");
  const [mensagemSucesso, setMensagemSucesso] = useState(""); 
  const [mostrarRecuperacao, setMostrarRecuperacao] = useState(false); 

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Jost:wght@300;400;500&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  const serif = { fontFamily: "'Cormorant Garamond', Georgia, serif" };
  const sans = { fontFamily: "'Jost', sans-serif" };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setMensagemSucesso("");

    const resultado = await login({ email, password });

    if (resultado.erro) {
      setErro(resultado.erro);
    } else {
      localStorage.setItem('token', resultado.token);
      localStorage.setItem('utilizador', JSON.stringify(resultado.utilizador));

      if (resultado.utilizador.perfil === 'admin') {
        window.location.href = '/admin/dashboard';
      } else {
        window.location.href = '/';
      }
    }
  };

  // Função para lidar com a recuperação
  const handleRecuperacao = async (e) => {
    e.preventDefault();
    setErro("");
    setMensagemSucesso("");

    if (!email) {
      setErro("Por favor, introduz o teu email para recuperares a senha.");
      return;
    }

    const resultado = await pedirRecuperacao(email);

    if (resultado.erro) {
      setErro(resultado.erro);
    } else {
      setMensagemSucesso(resultado.mensagem);
    }
  };

  return (
    <div style={sans} className="min-h-screen flex bg-white">
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-24 lg:px-32 bg-[#F7F9F5]">
        
        <div className="absolute top-10 left-8 md:left-24">
          <Link to="/" className="text-xs tracking-widest uppercase text-[#6B9E63] hover:text-[#3D6B4A] flex items-center gap-2 transition-colors">
            ← Voltar ao Site
          </Link>
        </div>

        <div className="max-w-sm w-full mx-auto">
          <div className="mb-10">
            <h1 style={serif} className="text-4xl font-semibold text-[#1A2E1A] mb-2">
              {mostrarRecuperacao ? "Recuperar Senha" : "Bem-vinda de volta"}
            </h1>
            <p className="text-sm text-[#5C6E5C]">
              {mostrarRecuperacao 
                ? "Introduz o teu email para receberes um link de recuperação." 
                : "Introduz os teus dados para acederes à tua conta."}
            </p>
          </div>

          {/* Renderização Condicional do Formulário */}
          {!mostrarRecuperacao ? (
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-[11px] tracking-widest uppercase text-[#6B9E63] mb-2 font-medium">Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemplo@email.com"
                  className="w-full border-b border-[#C8DFC4] bg-transparent py-3 text-sm outline-none focus:border-[#3D6B4A] transition-all placeholder:text-gray-300"
                />
              </div>

              <div>
                <label className="block text-[11px] tracking-widest uppercase text-[#6B9E63] mb-2 font-medium">Palavra-passe</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border-b border-[#C8DFC4] bg-transparent py-3 text-sm outline-none focus:border-[#3D6B4A] transition-all placeholder:text-gray-300"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button type="button" onClick={() => { setMostrarRecuperacao(true); setErro(""); setMensagemSucesso(""); }} className="text-xs text-[#3D6B4A] hover:underline">Esqueceste-te da senha?</button>
              </div>

              {erro && <p className="text-xs text-red-500">{erro}</p>}

              <button type="submit" className="w-full bg-[#3D6B4A] text-white py-4 rounded-full text-xs tracking-widest uppercase hover:bg-[#2C5038] transition-all shadow-lg shadow-green-900/10 mt-4">
                Entrar
              </button>
            </form>
          ) : (
            <form className="space-y-5" onSubmit={handleRecuperacao}>
               <div>
                <label className="block text-[11px] tracking-widest uppercase text-[#6B9E63] mb-2 font-medium">Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemplo@email.com"
                  className="w-full border-b border-[#C8DFC4] bg-transparent py-3 text-sm outline-none focus:border-[#3D6B4A] transition-all placeholder:text-gray-300"
                />
              </div>
              
              {erro && <p className="text-xs text-red-500">{erro}</p>}
              {mensagemSucesso && <p className="text-xs text-[#3D6B4A] font-medium">{mensagemSucesso}</p>}

              <button type="submit" className="w-full bg-[#3D6B4A] text-white py-4 rounded-full text-xs tracking-widest uppercase hover:bg-[#2C5038] transition-all shadow-lg shadow-green-900/10 mt-4">
                Enviar Link
              </button>

              <div className="text-center mt-4">
                 <button type="button" onClick={() => { setMostrarRecuperacao(false); setErro(""); setMensagemSucesso(""); }} className="text-xs text-[#5C6E5C] hover:underline">Voltar ao Login</button>
              </div>
            </form>
          )}

          {!mostrarRecuperacao && (
            <div className="mt-8 text-center">
              <p className="text-xs text-[#5C6E5C]">
                Ainda não tens conta? <Link to="/register" className="text-[#3D6B4A] font-semibold hover:underline">Cria uma agora</Link>
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="hidden md:block w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#3D6B4A]/10 z-10" />
        <img 
          src="/fundologin.png" 
          alt="Login Background" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex items-center justify-center p-12">
          <div className="text-center">
            <p style={serif} className="text-white text-3xl italic leading-relaxed max-w-xs drop-shadow-md">
              "A elegância é a única beleza que nunca desaparece."
            </p>
            <div className="w-12 h-0.5 bg-white mx-auto mt-6 opacity-50" />
          </div>
        </div>
      </div>
    </div>
  );
}