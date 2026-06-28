import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { registar } from './api';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nome: "",
    telefone: "",
    aceitaTermos: false
  });
  const [erro, setErro] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const serif = { fontFamily: "'Cormorant Garamond', Georgia, serif" };
  const sans = { fontFamily: "'Jost', sans-serif" };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");

    // Nome
    if (!formData.nome.trim() || formData.nome.trim().length < 2) {
      setErro("O nome deve ter pelo menos 2 caracteres."); return;
    }

    // Email
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(formData.email)) {
      setErro("Introduz um email válido (ex: nome@email.com)."); return;
    }

    // Telefone
    if (formData.telefone) {
      const telLimpo = formData.telefone.replace(/\s+/g, "");
      if (!/^\d+$/.test(telLimpo) || telLimpo.length !== 9 ) {
        setErro("O telefone deve ter 9 dígitos numéricos."); return;
      }
    }

    // Password
    if (formData.password.length < 8) {
      setErro("A palavra-passe deve ter pelo menos 8 caracteres."); return;
    }
    if (!/[A-Z]/.test(formData.password)) {
      setErro("A palavra-passe deve ter pelo menos uma letra maiúscula."); return;
    }
    if (!/[0-9]/.test(formData.password)) {
      setErro("A palavra-passe deve ter pelo menos um número."); return;
    }

    // Termos
    if (!formData.aceitaTermos) {
      setErro("Tens de aceitar a Política de Privacidade."); return;
    }

    const resultado = await registar({
      nome: formData.nome,
      email: formData.email,
      password: formData.password,
      telefone: formData.telefone,
      prefixo_tel: formData.prefixo,
      aceita_termos: formData.aceitaTermos,
    });

    if (resultado.erro) {
      setErro(resultado.erro);
    } else {
      window.location.href = '/login';
    }
  };

  return (
    <div style={sans} className="h-screen flex bg-white overflow-hidden">
      
      {/* Lado Esquerdo: Formulário */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 bg-[#F7F9F5] h-full">
        
        {/* Back Link */}
        <div className="absolute top-6 left-8 md:left-16">
          <Link to="/login" className="text-xs tracking-widest uppercase text-[#6B9E63] hover:text-[#3D6B4A] flex items-center gap-2 transition-colors">
            ← Voltar ao Login
          </Link>
        </div>

        <div className="max-w-sm w-full mx-auto">
          <div className="mb-5 text-center md:text-left">
            <h1 style={serif} className="text-4xl font-semibold text-[#1A2E1A] mb-2">Registar</h1>
            <p className="text-sm text-[#5C6E5C]">Cria a tua conta para uma experiência personalizada.</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* NOME */}
            <div>
              <label className="block text-[11px] tracking-widest uppercase text-[#6B9E63] mb-2 font-medium">Nome</label>
              <input 
                type="text" 
                name="nome"
                onChange={handleChange}
                placeholder="O teu nome completo"
                className="w-full border-b border-[#C8DFC4] bg-transparent py-3 text-sm outline-none focus:border-[#3D6B4A] transition-all placeholder:text-gray-300"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-[11px] tracking-widest uppercase text-[#6B9E63] mb-2 font-medium">Email</label>
              <input 
                type="email" 
                name="email"
                onChange={handleChange}
                placeholder="exemplo@email.com"
                className="w-full border-b border-[#C8DFC4] bg-transparent py-3 text-sm outline-none focus:border-[#3D6B4A] transition-all placeholder:text-gray-300"
              />
            </div>

            {/* TELEFONE*/}
            <div className="flex gap-4">
              <input
                type="tel"
                name="telefone"
                value={formData.telefone}
                onChange={e => {
                  const val = e.target.value.replace(/[^\d\s]/g, '');
                  if (val.replace(/\s/g, '').length <= 9) {
                    setFormData(prev => ({ ...prev, telefone: val }));
                  }
                }}
                placeholder="912 345 678"
                className="w-full border-b border-[#C8DFC4] bg-transparent py-3 text-sm outline-none focus:border-[#3D6B4A] transition-all placeholder:text-gray-300"
              />
            </div>

            {/* PALAVRA-PASSE */}
            <div>
              <label className="block text-[11px] tracking-widest uppercase text-[#6B9E63] mb-2 font-medium">Palavra-passe</label>
              <input 
                type="password" 
                name="password"
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full border-b border-[#C8DFC4] bg-transparent py-3 text-sm outline-none focus:border-[#3D6B4A] transition-all placeholder:text-gray-300"
              />
            </div>

            {/* REQUISITOS */}
            {formData.password && (
              <div className="space-y-1">
                {[
                  { ok: formData.password.length >= 8, texto: "Mínimo 8 caracteres" },
                  { ok: /[A-Z]/.test(formData.password), texto: "Uma letra maiúscula" },
                  { ok: /[0-9]/.test(formData.password), texto: "Um número" },
                ].map((req, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className={`text-xs ${req.ok ? "text-[#3D6B4A]" : "text-[#C8DFC4]"}`}>
                      {req.ok ? "✓" : "○"}
                    </span>
                    <span className={`text-xs ${req.ok ? "text-[#3D6B4A]" : "text-[#8FAF8A]"}`}>
                      {req.texto}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* TERMOS */}
            <div className="flex items-center gap-3">
              <label className="flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  name="aceitaTermos" 
                  onChange={handleChange} 
                  className="w-3 h-3 accent-[#3D6B4A] cursor-pointer" 
                />
              </label>
              <span className="text-xs text-[#5C6E5C] select-none">
                Li e aceito a{" "}
                <a 
                  href="/politicaprivacidade.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="underline hover:text-[#3D6B4A] transition-colors font-medium"
                >
                  Política de Privacidade
                </a>
              </span>
            </div>

            {/* ERRO */}
            {erro && (
              <p className="text-xs text-red-500">{erro}</p>
            )}

            <button
              onClick={handleSubmit}
              className="w-full bg-[#3D6B4A] text-white py-4 rounded-full text-xs tracking-widest uppercase hover:bg-[#2C5038] transition-all shadow-lg shadow-green-900/10"
            >
              Criar Conta
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-[#5C6E5C]">
              Já tens uma conta? <Link to="/login" className="text-[#3D6B4A] font-semibold hover:underline">Inicia sessão</Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-6 left-8 md:left-16">
          <div style={serif} className="text-lg font-semibold text-[#2C3A2C] leading-none">Moda Chique</div>
          <div className="text-[9px] tracking-[0.2em] uppercase text-[#6B9E63]">Lili Store</div>
        </div>
      </div>

      {/* Lado Direito: Imagem */}
      <div className="hidden md:block w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#3D6B4A]/10 z-10" />
        <img loading="lazy" 
          src="/fundologin.png" 
          alt="Register Background" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex items-center justify-center p-12">
          <div className="text-center">
            <p style={serif} className="text-white text-3xl italic leading-relaxed max-w-xs drop-shadow-md">
              "A moda passa, o estilo permanece."
            </p>
            <div className="w-12 h-0.5 bg-white mx-auto mt-6 opacity-50" />
          </div>
        </div>
      </div>
    </div>
  );
}