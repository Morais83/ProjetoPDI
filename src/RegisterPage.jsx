import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nome: "",
    telefone: "",
    prefixo: "+351",
    aceitaTermos: false
  });

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Jost:wght@300;400;500&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  const serif = { fontFamily: "'Cormorant Garamond', Georgia, serif" };
  const sans = { fontFamily: "'Jost', sans-serif" };
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
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

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
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

            {/* TELEFONE COM PREFIXO */}
            <div className="flex gap-4">
              <div className="w-32 relative">
                <label className="block text-[11px] tracking-widests uppercase text-[#6B9E63] mb-2 font-medium">Prefixo</label>
                <div 
                  onClick={() => setIsOpen(!isOpen)}
                  className="w-full border-b border-[#C8DFC4] py-3 text-sm text-[#5C6E5C] cursor-pointer flex justify-between items-center hover:border-[#3D6B4A] transition-all"
                >
                  <span>{formData.prefixo || "+351"}</span>
                  <span className={`text-[10px] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
                </div>
                {isOpen && (
                  <div className="absolute z-50 mt-1 w-full bg-white border border-[#E8F0E6] shadow-xl rounded-lg overflow-hidden">
                    {[
                      { code: "+351", label: "PT (+351)" },
                      { code: "+34",  label: "ES (+34)" },
                      { code: "+33",  label: "FR (+33)" },
                      { code: "+44",  label: "UK (+44)" },
                      { code: "+49",  label: "AL (+49)" },
                      { code: "+55",  label: "BR (+55)" },
                      { code: "+352", label: "LU (+352)" },
                      { code: "+39",  label: "IT (+39)" },
                    ].map((item) => (
                      <div 
                        key={item.code}
                        className="px-4 py-2.5 text-xs text-[#5C6E5C] hover:bg-[#F7F9F5] hover:text-[#3D6B4A] cursor-pointer transition-colors"
                        onClick={() => {
                          setFormData({ ...formData, prefixo: item.code });
                          setIsOpen(false);
                        }}
                      >
                        {item.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex-1">
                <label className="block text-[11px] tracking-widest uppercase text-[#6B9E63] mb-2 font-medium">Telefone</label>
                <input 
                  type="tel" 
                  name="telefone"
                  onChange={handleChange}
                  placeholder="912 345 678"
                  className="w-full border-b border-[#C8DFC4] bg-transparent py-3 text-sm outline-none focus:border-[#3D6B4A] transition-all placeholder:text-gray-300"
                />
              </div>
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

            {/* TERMOS */}
            <div className="flex items-center gap-3">
              <label className="flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  name="aceitaTermos" 
                  onChange={handleChange} 
                  className="w-3 h-3 accent-[#3D6B4A] cursor-pointer" 
                  required 
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

            <button className="w-full bg-[#3D6B4A] text-white py-4 rounded-full text-xs tracking-widest uppercase hover:bg-[#2C5038] transition-all shadow-lg shadow-green-900/10">
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
        <img 
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