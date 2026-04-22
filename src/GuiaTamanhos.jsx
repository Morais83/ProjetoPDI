export default function GuiaTamanhos({ onClose }) {
  const serif = { fontFamily: "'Cormorant Garamond', Georgia, serif" };
  const sans = { fontFamily: "'Jost', sans-serif" };

  const medidas = [
    { tamanho: "34", peito: "80-82", cintura: "60-62", anca: "86-88" },
    { tamanho: "36", peito: "83-85", cintura: "63-65", anca: "89-91" },
    { tamanho: "38", peito: "86-89", cintura: "66-69", anca: "92-95" },
    { tamanho: "40", peito: "90-93", cintura: "70-73", anca: "96-99" },
    { tamanho: "42", peito: "94-97", cintura: "74-77", anca: "100-103" },
    { tamanho: "44", peito: "98-101", cintura: "78-81", anca: "104-107" },
    { tamanho: "46", peito: "102-105", cintura: "82-85", anca: "108-111" },
  ];

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4"
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-[#E8F0E6] flex-shrink-0">
            <div>
              <p className="text-[11px] tracking-[0.15em] uppercase text-[#6B9E63] mb-1">Moda Chique - Lili Store</p>
              <h2 style={serif} className="text-3xl font-semibold text-[#1A2E1A]">Guia de Tamanhos</h2>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-[#E8F0E6] text-[#6B9E63] hover:bg-[#F0F5EE] hover:text-[#3D6B4A] transition-all text-lg"
            >
              ✕
            </button>
          </div>

          {/* Dica */}
          <div style={sans} className="px-8 py-4 bg-[#F7F9F5] border-b border-[#E8F0E6] flex-shrink-0">
            <p className="text-xs text-[#5C6E5C] leading-relaxed">
              <span className="font-medium text-[#3D6B4A]">Como medir:</span> Mede o peito na parte mais larga, a cintura na parte mais estreita e a anca na parte mais larga. Todas as medidas estão em centímetros (cm).
            </p>
          </div>

          {/* Tabela — scroll apenas aqui */}
          <div style={sans} className="px-8 py-6 overflow-y-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-[#E8F0E6]">
                  <th className="text-left py-3 text-[11px] tracking-widest uppercase text-[#6B9E63] font-medium">Tamanho</th>
                  <th className="text-center py-3 text-[11px] tracking-widest uppercase text-[#6B9E63] font-medium">Peito (cm)</th>
                  <th className="text-center py-3 text-[11px] tracking-widest uppercase text-[#6B9E63] font-medium">Cintura (cm)</th>
                  <th className="text-center py-3 text-[11px] tracking-widest uppercase text-[#6B9E63] font-medium">Anca (cm)</th>
                </tr>
              </thead>
              <tbody>
                {medidas.map((row, i) => (
                  <tr
                    key={row.tamanho}
                    className={`border-b border-[#E8F0E6] transition-colors hover:bg-[#F7F9F5] ${i % 2 === 0 ? "bg-white" : "bg-[#FAFCF9]"}`}
                  >
                    <td className="py-3.5">
                      <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-[#E8F0E6] text-[#3D6B4A] font-semibold text-sm">
                        {row.tamanho}
                      </span>
                    </td>
                    <td className="py-3.5 text-center text-[#4A5C4A]">{row.peito}</td>
                    <td className="py-3.5 text-center text-[#4A5C4A]">{row.cintura}</td>
                    <td className="py-3.5 text-center text-[#4A5C4A]">{row.anca}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div style={sans} className="px-8 py-4 bg-[#F7F9F5] border-t border-[#E8F0E6] flex-shrink-0">
            <p className="text-xs text-[#8FAF8A] text-center">
              Em caso de dúvida entre dois tamanhos, recomendamos escolher o maior.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}