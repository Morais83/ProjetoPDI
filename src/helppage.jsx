import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  ShoppingBag, Truck, RotateCcw, HelpCircle, Phone,
  ChevronDown, ChevronRight, Mail, Clock,
  Headphones,
} from "lucide-react";
import Footer from "./footer";
import Navbar from "./navbar";

const serif = { fontFamily: "'Cormorant Garamond', Georgia, serif" };
const sans  = { fontFamily: "'Jost', sans-serif" };

const topicos = [
  {
    id: "comprar",
    label: "Como Comprar",
    icon: ShoppingBag,
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
    icon: Truck,
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
    icon: RotateCcw,
    items: [
      {
        title: "Qual é a política de devoluções?",
        content: "Aceitamos devoluções até 30 dias após a receção da encomenda. Os artigos devem estar em perfeito estado, sem sinais de uso, com todas as etiquetas originais e na embalagem original."
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
    icon: HelpCircle,
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
    icon: Phone,
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
  const [topicoAtivo, setTopicoAtivo]       = useState("comprar");
  const [accordionAberto, setAccordionAberto] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const params        = new URLSearchParams(location.search);
    const topicoDaURL   = params.get("topico");
    if (topicoDaURL) {
      setTopicoAtivo(topicoDaURL);
      setAccordionAberto(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location]);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Jost:wght@300;400;500&display=swap";
    link.rel  = "stylesheet";
    document.head.appendChild(link);
  }, []);

  const topicoAtual = topicos.find((t) => t.id === topicoAtivo) || topicos[0];
  const IconAtiva   = topicoAtual.icon;

  return (
    <div style={sans} className="min-h-screen bg-[#F7F9F5] text-[#2C2C2C]">
      <Navbar />

      {/* ── Hero ── */}
      <div className="relative bg-gradient-to-b from-[#E0EBD9] to-[#F7F9F5] py-14 md:py-20 px-6 text-center overflow-hidden">
        {/* Decoração de fundo */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-10 -left-10 w-64 h-64 rounded-full bg-[#3D6B4A]/5" />
          <div className="absolute -bottom-16 -right-10 w-80 h-80 rounded-full bg-[#3D6B4A]/5" />
        </div>

        <div className="relative">
          <div className="w-14 h-14 rounded-2xl bg-[#3D6B4A] flex items-center justify-center mx-auto mb-5 shadow-lg shadow-green-900/20">
            <Headphones size={26} className="text-white" />
          </div>
          <p className="text-xs tracking-[0.2em] uppercase text-[#6B9E63] mb-3 font-medium">Estamos aqui para ajudar</p>
          <h1 style={serif} className="text-5xl md:text-6xl font-semibold text-[#1A2E1A] mb-4">Centro de Ajuda</h1>
          <p className="text-sm text-[#6B9E63] max-w-md mx-auto leading-relaxed">
            Encontra respostas para as perguntas mais frequentes ou contacta a nossa equipa de suporte.
          </p>

          {/* Contactos rápidos */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            {[
              { icon: Mail,  texto: "suporte@modachique.pt" },
              { icon: Phone, texto: "+351 210 000 000"      },
              { icon: Clock, texto: "Seg – Sex: 9h – 19h"  },
            ].map(({ icon: Icon, texto }) => (
              <div key={texto} className="flex items-center gap-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full border border-[#C8DFC4] text-xs text-[#4A5C4A]">
                <Icon size={13} className="text-[#6B9E63]" />
                {texto}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Corpo ── */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-10 flex flex-col md:flex-row gap-8 items-start">

        {/* ── Sidebar ── */}
        <aside className="w-full md:w-60 flex-shrink-0 md:sticky md:top-24">
          <div className="bg-white rounded-2xl border border-[#E8F0E6] shadow-sm overflow-hidden">
            <div className="px-4 py-3.5 border-b border-[#E8F0E6]">
              <p className="text-[10px] font-semibold tracking-widest uppercase text-[#8FAF8A]">Menu de Ajuda</p>
            </div>
            <nav>
              {topicos.map(({ id, label, icon: Icon }) => {
                const ativo = topicoAtivo === id;
                return (
                  <button
                    key={id}
                    onClick={() => { setTopicoAtivo(id); setAccordionAberto(null); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-all border-b border-[#F0F5EE] last:border-0 group ${
                      ativo
                        ? "bg-[#F0F5EE] text-[#3D6B4A] font-medium"
                        : "text-[#4A5C4A] hover:bg-[#F7F9F5] hover:text-[#3D6B4A]"
                    }`}
                  >
                    <Icon
                      size={15}
                      className={ativo ? "text-[#3D6B4A]" : "text-[#A8C4A8] group-hover:text-[#6B9E63] transition-colors"}
                    />
                    <span className="flex-1 text-left">{label}</span>
                    {ativo && <ChevronRight size={13} className="text-[#3D6B4A] opacity-60" />}
                  </button>
                );
              })}
            </nav>
          </div>

        </aside>

        {/* ── Conteúdo principal ── */}
        <div className="flex-1 min-w-0">

          {/* Cabeçalho da secção */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-[#3D6B4A] flex items-center justify-center flex-shrink-0 shadow-sm shadow-green-900/15">
              <IconAtiva size={18} className="text-white" />
            </div>
            <div>
              <h2 style={serif} className="text-3xl font-semibold text-[#1A2E1A] leading-tight">{topicoAtual.label}</h2>
              <p className="text-xs text-[#8FAF8A] mt-0.5">{topicoAtual.items.length} perguntas frequentes</p>
            </div>
          </div>

          {/* Acordeão */}
          <div className="bg-white rounded-2xl border border-[#E8F0E6] shadow-sm overflow-hidden">
            {topicoAtual.items.map((item, i) => {
              const aberto = accordionAberto === i;
              return (
                <div key={i} className={`border-b border-[#F0F5EE] last:border-0 transition-colors ${aberto ? "bg-[#FAFCFA]" : "hover:bg-[#FAFCFA]"}`}>
                  <button
                    onClick={() => setAccordionAberto(aberto ? null : i)}
                    className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left group"
                  >
                    <span className={`text-sm leading-snug transition-colors ${aberto ? "font-semibold text-[#3D6B4A]" : "font-medium text-[#2C3A2C] group-hover:text-[#3D6B4A]"}`}>
                      {item.title}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`flex-shrink-0 transition-all duration-300 ${aberto ? "rotate-180 text-[#3D6B4A]" : "text-[#A8C4A8] group-hover:text-[#6B9E63]"}`}
                    />
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${aberto ? "max-h-96" : "max-h-0"}`}>
                    <div className="px-6 pb-5">
                      <div className="border-l-2 border-[#C8DFC4] pl-4">
                        <p className="text-sm text-[#5C6E5C] leading-relaxed">{item.content}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
