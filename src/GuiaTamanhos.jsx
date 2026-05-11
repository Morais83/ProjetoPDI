import { useState, useEffect } from "react";

export default function GuiaTamanhos({ onClose }) {
  const serif = { fontFamily: "'Cormorant Garamond', Georgia, serif" };
  const sans = { fontFamily: "'Jost', sans-serif" };
  const [medidasUtilizador, setMedidasUtilizador] = useState(null);
  const [tamanhoSugerido, setTamanhoSugerido] = useState(null);

  const medidas = [
    { tamanho: "XS",  eu: "34-36", peito: [80, 85],  cintura: [60, 65], anca: [86, 91],   peitoStr: "80-85",   cinturaStr: "60-65", ancaStr: "86-91"   },
    { tamanho: "S",   eu: "36-38", peito: [83, 89],  cintura: [63, 69], anca: [89, 95],   peitoStr: "83-89",   cinturaStr: "63-69", ancaStr: "89-95"   },
    { tamanho: "M",   eu: "38-40", peito: [86, 93],  cintura: [66, 73], anca: [92, 99],   peitoStr: "86-93",   cinturaStr: "66-73", ancaStr: "92-99"   },
    { tamanho: "L",   eu: "40-42", peito: [90, 97],  cintura: [70, 77], anca: [96, 103],  peitoStr: "90-97",   cinturaStr: "70-77", ancaStr: "96-103"  },
    { tamanho: "XL",  eu: "42-44", peito: [94, 101], cintura: [74, 81], anca: [100, 107], peitoStr: "94-101",  cinturaStr: "74-81", ancaStr: "100-107" },
    { tamanho: "XXL", eu: "44-46", peito: [98, 105], cintura: [78, 85], anca: [104, 111], peitoStr: "98-105",  cinturaStr: "78-85", ancaStr: "104-111" },
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch('import.meta.env.VITE_API_URL/api/utilizadores/me/medidas', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(dados => {
        if (!dados) return;
        setMedidasUtilizador(dados);

        // Calcular tamanho sugerido
        const busto = parseFloat(dados.busto);
        const cintura = parseFloat(dados.cintura);
        const anca = parseFloat(dados.anca);

        if (!busto && !cintura && !anca) return;

        let melhorTamanho = null;
        for (const m of medidas) {
          const bustoOk = !busto || (busto >= m.peito[0] && busto <= m.peito[1]);
          const cinturaOk = !cintura || (cintura >= m.cintura[0] && cintura <= m.cintura[1]);
          const ancaOk = !anca || (anca >= m.anca[0] && anca <= m.anca[1]);
          if (bustoOk && cinturaOk && ancaOk) {
            melhorTamanho = m.tamanho;
            break;
          }
        }

        // Se não encontrou correspondência exata, encontra o mais próximo pelo busto
        if (!melhorTamanho && busto) {
          let menorDif = Infinity;
          for (const m of medidas) {
            const meio = (m.peito[0] + m.peito[1]) / 2;
            const dif = Math.abs(busto - meio);
            if (dif < menorDif) {
              menorDif = dif;
              melhorTamanho = m.tamanho;
            }
          }
        }

        setTamanhoSugerido(melhorTamanho);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-[#E8F0E6] flex-shrink-0">
          <div>
            <p className="text-[11px] tracking-[0.15em] uppercase text-[#6B9E63] mb-1">Moda Chique - Lili Store</p>
            <h2 style={serif} className="text-3xl font-semibold text-[#1A2E1A]">Guia de Tamanhos</h2>
          </div>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full border border-[#E8F0E6] text-[#6B9E63] hover:bg-[#F0F5EE] hover:text-[#3D6B4A] transition-all text-lg">✕</button>
        </div>

        {/* Tamanho sugerido */}
        {tamanhoSugerido && (
          <div style={sans} className="px-8 py-4 bg-[#E8F0E6] border-b border-[#C8DFC4] flex-shrink-0">
            <p className="text-xs text-[#3D6B4A]">
              Com base nas tuas medidas, o teu tamanho sugerido é{" "}
              <span className="font-semibold text-sm">{tamanhoSugerido}</span>
            </p>
          </div>
        )}

        {/* Medidas do utilizador */}
        {medidasUtilizador && (medidasUtilizador.busto || medidasUtilizador.cintura || medidasUtilizador.anca) && (
          <div style={sans} className="px-8 py-3 bg-[#F7F9F5] border-b border-[#E8F0E6] flex-shrink-0">
            <p className="text-[11px] tracking-widest uppercase text-[#6B9E63] mb-2">As tuas medidas</p>
            <div className="flex gap-6">
              {medidasUtilizador.busto && (
                <div className="text-center">
                  <p className="text-sm font-semibold text-[#2C3A2C]">{medidasUtilizador.busto} cm</p>
                  <p className="text-[10px] text-[#8FAF8A]">Busto</p>
                </div>
              )}
              {medidasUtilizador.cintura && (
                <div className="text-center">
                  <p className="text-sm font-semibold text-[#2C3A2C]">{medidasUtilizador.cintura} cm</p>
                  <p className="text-[10px] text-[#8FAF8A]">Cintura</p>
                </div>
              )}
              {medidasUtilizador.anca && (
                <div className="text-center">
                  <p className="text-sm font-semibold text-[#2C3A2C]">{medidasUtilizador.anca} cm</p>
                  <p className="text-[10px] text-[#8FAF8A]">Anca</p>
                </div>
              )}
              {medidasUtilizador.altura && (
                <div className="text-center">
                  <p className="text-sm font-semibold text-[#2C3A2C]">{medidasUtilizador.altura} cm</p>
                  <p className="text-[10px] text-[#8FAF8A]">Altura</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Dica */}
        <div style={sans} className="px-8 py-4 bg-[#F7F9F5] border-b border-[#E8F0E6] flex-shrink-0">
          <p className="text-xs text-[#5C6E5C] leading-relaxed">
            <span className="font-medium text-[#3D6B4A]">Como medir:</span> Mede o peito na parte mais larga, a cintura na parte mais estreita e a anca na parte mais larga. Todas as medidas estão em centímetros (cm).
          </p>
        </div>

        {/* Tabela */}
        <div style={sans} className="px-8 py-6 overflow-y-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-[#E8F0E6]">
                <th className="text-left py-3 text-[11px] tracking-widest uppercase text-[#6B9E63] font-medium">Tamanho</th>
                <th className="text-center py-3 text-[11px] tracking-widests uppercase text-[#6B9E63] font-medium">EU</th>
                <th className="text-center py-3 text-[11px] tracking-widest uppercase text-[#6B9E63] font-medium">Peito (cm)</th>
                <th className="text-center py-3 text-[11px] tracking-widest uppercase text-[#6B9E63] font-medium">Cintura (cm)</th>
                <th className="text-center py-3 text-[11px] tracking-widest uppercase text-[#6B9E63] font-medium">Anca (cm)</th>
              </tr>
            </thead>
            <tbody>
              {medidas.map((row, i) => (
                <tr
                  key={row.tamanho}
                  className={`border-b border-[#E8F0E6] transition-colors hover:bg-[#F7F9F5] ${
                    tamanhoSugerido === row.tamanho
                      ? "bg-[#E8F0E6]"
                      : i % 2 === 0 ? "bg-white" : "bg-[#FAFCF9]"
                  }`}
                >
                  <td className="py-3.5">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center justify-center w-12 h-9 rounded-lg font-semibold text-sm ${
                        tamanhoSugerido === row.tamanho
                          ? "bg-[#3D6B4A] text-white"
                          : "bg-[#E8F0E6] text-[#3D6B4A]"
                      }`}>
                        {row.tamanho}
                      </span>
                      {tamanhoSugerido === row.tamanho && (
                        <span className="text-[10px] text-[#3D6B4A] font-medium">← o teu</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 text-center text-[#4A5C4A]">{row.eu}</td>
                  <td className="py-3.5 text-center text-[#4A5C4A]">{row.peitoStr}</td>
                  <td className="py-3.5 text-center text-[#4A5C4A]">{row.cinturaStr}</td>
                  <td className="py-3.5 text-center text-[#4A5C4A]">{row.ancaStr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div style={sans} className="px-8 py-4 bg-[#F7F9F5] border-t border-[#E8F0E6] flex-shrink-0">
          {!medidasUtilizador || (!medidasUtilizador.busto && !medidasUtilizador.cintura && !medidasUtilizador.anca) ? (
            <p className="text-xs text-[#8FAF8A] text-center">
              💡 Guarda as tuas medidas no{" "}
              <a href="/perfil" className="text-[#3D6B4A] underline">perfil</a>
              {" "}para ver o teu tamanho sugerido.
            </p>
          ) : (
            <p className="text-xs text-[#8FAF8A] text-center">
              Em caso de dúvida entre dois tamanhos, recomendamos escolher o maior.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}