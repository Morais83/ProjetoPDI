import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";

const serif = { fontFamily: "'Cormorant Garamond', Georgia, serif" };
const sans = { fontFamily: "'Jost', sans-serif" };

const topicos = [
  {
    id: "comprar",
    label: "Como Comprar",
    items: [
      {
        title: "Como faço uma encomenda?",
        content: "Navega pela loja, escolhe os produtos que desejas e adiciona-os ao carrinho. Depois, clica no carrinho no canto superior direito e segue os passos para finalizar a tua compra. Podes pagar com PayPal, MBWay, Visa ou Mastercard."
      },
      {
        title: "Posso alterar ou cancelar uma encomenda?",
        content: "Podes alterar ou cancelar a tua encomenda até 24 horas após a realização da mesma. Para o fazer, entra em contacto connosco através do Serviço ao Cliente ou envia um email para suporte@modachique.pt."
      },
      {
        title: "Como sei que a minha encomenda foi confirmada?",
        content: "Após a confirmação do pagamento, receberás um email de confirmação com os detalhes da tua encomenda. Podes também acompanhar o estado da encomenda na tua área pessoal em 'Meus Pedidos'."
      },
      {
        title: "É seguro comprar na Moda Chique?",
        content: "Sim! O nosso site utiliza encriptação SSL para proteger os teus dados. Todos os pagamentos são processados por plataformas certificadas e seguras. Nunca guardamos os dados do teu cartão."
      },
    ]
  },
  {
    id: "envios",
    label: "Envios",
    items: [
      {
        title: "Qual é o prazo de entrega?",
        content: "As encomendas são entregues entre 2 a 5 dias úteis em Portugal Continental. Para as ilhas (Açores e Madeira), o prazo pode ser de 5 a 10 dias úteis. Encomendas internacionais podem demorar entre 7 a 15 dias úteis."
      },
      {
        title: "Quanto custa o envio?",
        content: "O envio é gratuito em todas as encomendas acima de 50€. Para encomendas abaixo desse valor, o custo de envio é de 3,99€ para Portugal Continental e 6,99€ para as ilhas."
      },
      {
        title: "Como posso rastrear a minha encomenda?",
        content: "Após o envio da encomenda, receberás um email com o número de rastreio e um link para acompanhar a entrega em tempo real. Podes também acompanhar o estado em 'Meus Pedidos' na tua área pessoal."
      },
      {
        title: "Fazem entregas internacionais?",
        content: "Sim, entregamos em toda a Europa. Os prazos e custos variam consoante o país de destino. Durante o checkout, o custo de envio é calculado automaticamente com base na tua morada."
      },
    ]
  },
  {
    id: "devolucoes",
    label: "Devoluções",
    items: [
      {
        title: "Qual é a política de devoluções?",
        content: "Aceituamos devoluções até 30 dias após a receção da encomenda. Os artigos devem estar em perfeito estado, sem sinais de uso, com todas as etiquetas originais e na embalagem original."
      },
      {
        title: "Como faço uma devolução?",
        content: "Acede à tua área pessoal, vai a 'Meus Pedidos' e seleciona o artigo que desejas devolver. Preenche o formulário de devolução e aguarda a aprovação. Após aprovação, receberás as instruções de envio."
      },
      {
        title: "Quanto tempo demora o reembolso?",
        content: "Após recebermos e verificarmos o artigo devolvido, o reembolso é processado em 3 a 5 dias úteis. O valor será devolvido através do mesmo método de pagamento utilizado na compra."
      },
      {
        title: "Posso trocar um artigo por outro tamanho?",
        content: "Sim! Para trocas de tamanho, inicia o processo de devolução normal e realiza uma nova encomenda com o tamanho correto. Assim garantimos que o novo artigo está disponível para ti o mais rápido possível."
      },
    ]
  },
  {
    id: "faq",
    label: "FAQ",
    items: [
      {
        title: "Como sei qual o meu tamanho?",
        content: "Consulta o nosso Guia de Tamanhos disponível em cada página de produto. Recomendamos que tomes as tuas medidas (busto, cintura e anca) e as compares com a nossa tabela de tamanhos. Em caso de dúvida entre dois tamanhos, recomendamos escolher o maior."
      },
      {
        title: "Os produtos são originais?",
        content: "Sim, todos os produtos vendidos na Moda Chique são 100% originais e adquiridos diretamente junto das marcas ou distribuidores oficiais. Não vendemos produtos contrafeitos ou de imitação."
      },
      {
        title: "Posso guardar artigos para comprar mais tarde?",
        content: "Sim! Podes adicionar artigos à tua Lista de Favoritos clicando no ícone de coração em cada produto. Para acederes à lista, precisas de ter conta na Moda Chique e estar com sessão iniciada."
      },
      {
        title: "Como posso saber quando um artigo volta ao stock?",
        content: "Na página do produto esgotado, podes ativar as notificações de reposição de stock. Assim que o artigo estiver disponível novamente, receberás um email de notificação automaticamente."
      },
    ]
  },
  {
    id: "contacto",
    label: "Contacto",
    items: [
      {
        title: "Como posso entrar em contacto com o suporte?",
        content: "Podes contactar-nos através do email suporte@modachique.pt, por telefone através do número +351 210 000 000 (dias úteis das 9h às 19h), ou através do formulário de contacto disponível na tua área pessoal em 'Serviço ao Cliente'."
      },
      {
        title: "Qual é o horário de atendimento?",
        content: "A nossa equipa de suporte está disponível de segunda a sábado, das 9h às 19h. Aos domingos e feriados, o atendimento não está disponível. Respondemos a todos os emails em até 24 horas úteis."
      },
      {
        title: "Estão nas redes sociais?",
        content: "Sim! Podes encontrar-nos no Instagram (@modachiquelilistore), Facebook (Moda Chique Lili Store) e Pinterest. Seguindo-nos ficas a par das últimas novidades, promoções exclusivas e inspirações de looks."
      },
      {
        title: "Têm loja física?",
        content: "De momento operamos apenas online. No entanto, estamos a trabalhar para abrir uma loja física em breve. Subscreve a nossa newsletter para seres a primeira a saber!"
      },
    ]
  },
];

export default function HelpPage() {
  const [topicoAtivo, setTopicoAtivo] = useState("comprar");
  const [accordionAberto, setAccordionAberto] = useState(null);
  
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const topicoDaURL = params.get("topico");

    if (topicoDaURL) {
      setTopicoAtivo(topicoDaURL);
      setAccordionAberto(null); 
      window.scrollTo({ top: 0, behavior: 'smooth' }); 
    }
  }, [location]); 

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Jost:wght@300;400;500&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  const topicoAtual = topicos.find((t) => t.id === topicoAtivo) || topicos[0];

  return (
    <div style={sans} className="min-h-screen bg-[#F7F9F5] text-[#2C2C2C]">

      <Navbar />
      {/* 2. Banner de Título */}
      <div className="bg-[#E8F0E6] py-12 px-8 text-center">
        <p className="text-xs tracking-[0.15em] uppercase text-[#6B9E63] mb-2">Estamos aqui para ajudar</p>
        <h1 style={serif} className="text-5xl font-semibold text-[#1A2E1A]">Centro de Ajuda</h1>
      </div>

      {/* 3. CORPO DA PÁGINA */}
      <div className="max-w-7xl mx-auto px-8 py-12 flex flex-col md:flex-row gap-10 items-start">
        {/* Sidebar (O Quadrado Verde) */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-[#3D6B4A] rounded-2xl overflow-hidden shadow-lg sticky top-8">
            <div className="px-5 py-4 border-b border-[#4F8A61]">
              <p className="text-xs tracking-widest uppercase text-white font-bold">Menu de Ajuda</p>
            </div>
            <nav className="py-2">
              {topicos.map((t) => (
                <button
                  key={t.id}
                  onClick={() => { setTopicoAtivo(t.id); setAccordionAberto(null); }}
                  className={`w-full text-left px-5 py-3 text-sm transition-all duration-200 ${
                    topicoAtivo === t.id
                      ? "text-white font-semibold bg-[#2C4A2C] pl-7"
                      : "text-[#A8C4A8] hover:text-white hover:bg-[#457A54]"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Conteúdo Principal (Direita) */}
        <div className="flex-1">
          <h2 style={serif} className="text-3xl font-semibold text-[#1A2E1A] mb-6 border-b border-[#E8F0E6] pb-4">
            {topicoAtual.label}
          </h2>

          <div className="space-y-1">
            {topicoAtual.items.map((item, i) => (
              <div key={i} className="border-b border-[#E8F0E6]">
                <button
                  onClick={() => setAccordionAberto(accordionAberto === i ? null : i)}
                  className="w-full flex items-center justify-between py-5 text-left"
                >
                  <span className="text-sm font-medium text-[#2C3A2C] tracking-wide">{item.title}</span>
                  <span className={`text-[#6B9E63] transition-transform duration-200 ${accordionAberto === i ? "rotate-180" : ""}`}>
                    ▼
                  </span>
                </button>
                {accordionAberto === i && (
                  <div className="pb-5 animate-in fade-in duration-300">
                    <p className="text-sm text-[#5C6E5C] leading-relaxed">{item.content}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}