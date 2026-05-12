import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from "react-router-dom";
import { reporSenha } from './api';

export default function ResetPasswordPage() {
  const { token } = useParams(); // Apanha o código (token) que vem no URL
  const navigate = useNavigate();
  
  const [novaPassword, setNovaPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);

  const serif = { fontFamily: "'Cormorant Garamond', Georgia, serif" };
  const sans = { fontFamily: "'Jost', sans-serif" };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");

    if (novaPassword.length < 6) {
      setErro("A palavra-passe deve ter pelo menos 6 caracteres.");
      return;
    }

    if (novaPassword !== confirmarPassword) {
      setErro("As palavras-passe não coincidem.");
      return;
    }

    const resultado = await reporSenha(token, novaPassword);

    if (resultado.erro) {
      setErro(resultado.erro);
    } else {
      setSucesso(true);
      setTimeout(() => {
        navigate('/login'); // Redireciona para o login passado 3 segundos
      }, 3000);
    }
  };

  return (
    <div style={sans} className="min-h-screen flex bg-white">
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-24 lg:px-32 bg-[#F7F9F5]">
        
        <div className="max-w-sm w-full mx-auto">
          <div className="mb-10">
            <h1 style={serif} className="text-4xl font-semibold text-[#1A2E1A] mb-2">Nova Palavra-passe</h1>
            <p className="text-sm text-[#5C6E5C]">Cria uma nova palavra-passe para a tua conta.</p>
          </div>

          {sucesso ? (
            <div className="bg-[#E8F0E6] text-[#3D6B4A] p-6 rounded-2xl text-center border border-[#C8DFC4]">
              <p className="font-medium mb-2">✓ Palavra-passe alterada!</p>
              <p className="text-sm">A redirecionar para o login...</p>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-[11px] tracking-widest uppercase text-[#6B9E63] mb-2 font-medium">Nova Palavra-passe</label>
                <input 
                  type="password" 
                  value={novaPassword}
                  onChange={(e) => setNovaPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border-b border-[#C8DFC4] bg-transparent py-3 text-sm outline-none focus:border-[#3D6B4A] transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] tracking-widest uppercase text-[#6B9E63] mb-2 font-medium">Confirmar Palavra-passe</label>
                <input 
                  type="password" 
                  value={confirmarPassword}
                  onChange={(e) => setConfirmarPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border-b border-[#C8DFC4] bg-transparent py-3 text-sm outline-none focus:border-[#3D6B4A] transition-all"
                />
              </div>

              {erro && <p className="text-xs text-red-500">{erro}</p>}

              <button type="submit" className="w-full bg-[#3D6B4A] text-white py-4 rounded-full text-xs tracking-widest uppercase hover:bg-[#2C5038] transition-all shadow-lg shadow-green-900/10 mt-4">
                Guardar Nova Senha
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Imagem lateral (igual ao login) */}
      <div className="hidden md:block w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#3D6B4A]/10 z-10" />
        <img loading="lazy" src="/fundologin.png" alt="Background" className="absolute inset-0 w-full h-full object-cover" />
      </div>
    </div>
  );
}