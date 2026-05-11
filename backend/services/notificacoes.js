const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ─── SVGs do Lucide (inline para email) ───────────────────────────────────────

function svgIcon(path, cor = '#fff', size = 28) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${cor}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;
}

const ICONS = {
  pendente:      svgIcon('<path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/><path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"/><path d="M12 3v6"/>'),
  confirmado:    svgIcon('<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>'),
  em_preparacao: svgIcon('<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>'),
  enviado:       svgIcon('<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>'),
  entregue:      svgIcon('<path d="M5.8 11.3 2 22l10.7-3.79"/><path d="M4 3h.01"/><path d="M22 8h.01"/><path d="M15 2h.01"/><path d="M22 20h.01"/><path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10"/><path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11c-.11.7-.69 1.22-1.4 1.22H17"/><path d="m11 2 .33.82c.34.86-.2 1.82-1.11 1.98C9.52 4.9 9 5.52 9 6.2V7"/><path d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z"/>'),
  cancelado:     svgIcon('<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>'),
};

// ─── Config por estado ─────────────────────────────────────────────────────────

const estadoInfo = {
  pendente: {
    titulo:    'Encomenda Recebida',
    subtitulo: 'Estamos a processar o teu pedido',
    cor:       '#A67C00',
    corFundo:  '#FEF9E7',
    msg:       'Recebemos a tua encomenda com sucesso! A nossa equipa está a verificar os detalhes e irá confirmá-la em breve.',
    detalhe:   'Receberás uma nova notificação assim que a encomenda for confirmada.',
    prazo:     null,
  },
  confirmado: {
    titulo:    'Encomenda Confirmada',
    subtitulo: 'O pagamento foi processado com sucesso',
    cor:       '#3D6B4A',
    corFundo:  '#F0F5EE',
    msg:       'Ótimas notícias! A tua encomenda foi confirmada e o pagamento processado com sucesso. A nossa equipa vai começar a preparar os teus artigos.',
    detalhe:   'Receberás uma notificação quando a encomenda entrar em preparação.',
    prazo:     null,
  },
  em_preparacao: {
    titulo:    'Em Preparação',
    subtitulo: 'A tua encomenda está a ser preparada',
    cor:       '#185FA5',
    corFundo:  '#E6F1FB',
    msg:       'A nossa equipa está neste momento a preparar os teus artigos com todo o cuidado para garantir que chegam em perfeitas condições.',
    detalhe:   'Receberás um email com o número de rastreio assim que for enviada.',
    prazo:     'Tempo estimado de preparação: 1–2 dias úteis.',
  },
  enviado: {
    titulo:    'Encomenda Enviada',
    subtitulo: 'Está a caminho de ti!',
    cor:       '#3D6B4A',
    corFundo:  '#F0F5EE',
    msg:       'A tua encomenda foi entregue ao transportador e já está a caminho. Podes acompanhar o estado da entrega através do teu perfil.',
    detalhe:   'Em caso de ausência, o transportador tentará nova entrega no dia seguinte.',
    prazo:     'Tempo estimado de entrega: 2–3 dias úteis.',
  },
  entregue: {
    titulo:    'Encomenda Entregue',
    subtitulo: 'Esperamos que gostes das tuas peças!',
    cor:       '#2C5038',
    corFundo:  '#E8F5E9',
    msg:       'A tua encomenda foi entregue com sucesso! Esperamos que estejas satisfeita com as tuas novas peças. A tua opinião é muito importante para nós.',
    detalhe:   'Se tiveres algum problema com a encomenda, tens 30 dias para nos contactar.',
    prazo:     null,
  },
  cancelado: {
    titulo:    'Encomenda Cancelada',
    subtitulo: 'O teu pedido foi cancelado',
    cor:       '#C0392B',
    corFundo:  '#FDECEA',
    msg:       'A tua encomenda foi cancelada. Se o pagamento já foi processado, o reembolso será efetuado no prazo de 5–10 dias úteis para o método de pagamento original.',
    detalhe:   'Se não solicitaste este cancelamento ou tens alguma dúvida, por favor contacta-nos de imediato.',
    prazo:     null,
  },
};

// ─── Timeline de estados ───────────────────────────────────────────────────────

const ordemEstados = ['confirmado', 'em_preparacao', 'enviado', 'entregue'];

function gerarTimeline(estadoAtual) {
  if (estadoAtual === 'pendente' || estadoAtual === 'cancelado') return '';

  const indexAtual = ordemEstados.indexOf(estadoAtual);
  const labels = ['Confirmada', 'Em Preparação', 'Enviada', 'Entregue'];

  const steps = ordemEstados.map((e, i) => {
    const feito    = i <= indexAtual;
    const atual    = i === indexAtual;
    const cor      = feito ? '#3D6B4A' : '#C8DFC4';
    const textoCor = feito ? '#2C3A2C' : '#A8C4A8';
    const peso     = atual ? '700' : '400';
    return `
      <td align="center" style="width:25%;vertical-align:top;padding:0 4px;">
        <div style="width:32px;height:32px;border-radius:50%;background:${cor};margin:0 auto 6px;display:flex;align-items:center;justify-content:center;">
          <span style="color:#fff;font-size:${atual ? '14' : '12'}px;font-weight:700;">${i + 1}</span>
        </div>
        <p style="margin:0;font-size:11px;color:${textoCor};font-weight:${peso};text-align:center;">${labels[i]}</p>
      </td>
    `;
  });

  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
      <tr>${steps.join('')}</tr>
    </table>
  `;
}

// ─── Template principal ────────────────────────────────────────────────────────

function gerarHTML({ nome, id_encomenda, estado, total, itens = [] }) {
  const info     = estadoInfo[estado] || estadoInfo['confirmado'];
  const timeline = gerarTimeline(estado);
  const frontUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const dataHoje = new Date().toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' });

  const linhasHTML = itens.length > 0 ? `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 16px;border-collapse:collapse;">
      <tr style="background:#F7F9F5;">
        <td style="padding:8px 12px;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#8FAF8A;font-weight:600;">Artigo</td>
        <td style="padding:8px 12px;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#8FAF8A;font-weight:600;text-align:center;">Qtd</td>
        <td style="padding:8px 12px;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#8FAF8A;font-weight:600;text-align:right;">Total</td>
      </tr>
      ${itens.map((i, idx) => `
        <tr style="background:${idx % 2 === 0 ? '#fff' : '#FAFCFA'};">
          <td style="padding:12px;border-bottom:1px solid #E8F0E6;">
            <p style="margin:0;font-size:13px;font-weight:600;color:#2C3A2C;">${i.nome_produto}</p>
            ${(i.tamanho || i.cor) ? `<p style="margin:2px 0 0;font-size:11px;color:#8FAF8A;">${[i.tamanho, i.cor].filter(Boolean).join(' · ')}</p>` : ''}
          </td>
          <td style="padding:12px;border-bottom:1px solid #E8F0E6;text-align:center;font-size:13px;color:#5C6E5C;">×${i.quantidade}</td>
          <td style="padding:12px;border-bottom:1px solid #E8F0E6;text-align:right;font-size:13px;font-weight:600;color:#2C3A2C;">
            ${(parseFloat(i.preco_unitario) * i.quantidade).toFixed(2).replace('.', ',')}€
          </td>
        </tr>
      `).join('')}
      ${total ? `
        <tr>
          <td colspan="2" style="padding:12px;font-size:13px;font-weight:700;color:#1A2E1A;text-align:right;">Total pago:</td>
          <td style="padding:12px;font-size:16px;font-weight:700;color:#3D6B4A;text-align:right;">${parseFloat(total).toFixed(2).replace('.', ',')}€</td>
        </tr>
      ` : ''}
    </table>
  ` : '';

  return `<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${info.titulo}</title>
</head>
<body style="margin:0;padding:0;background:#F0F4F0;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F0F4F0;">
  <tr><td align="center" style="padding:32px 16px;">

    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

      <!-- Topo da marca -->
      <tr>
        <td style="background:#1A2E1A;padding:20px 40px;border-radius:16px 16px 0 0;text-align:center;">
          <p style="margin:0;font-size:10px;letter-spacing:5px;text-transform:uppercase;color:#6B9E63;">Moda Chique</p>
          <h1 style="margin:4px 0 0;font-size:22px;font-weight:600;color:#fff;font-family:Georgia,serif;letter-spacing:1px;">Lili Store</h1>
        </td>
      </tr>

      <!-- Banner de estado -->
      <tr>
        <td style="background:${info.cor};padding:32px 40px;text-align:center;">
          <div style="display:inline-block;background:rgba(255,255,255,0.15);border-radius:50%;padding:16px;margin-bottom:12px;">
            ${ICONS[estado] || ICONS['confirmado']}
          </div>
          <h2 style="margin:0 0 4px;font-size:24px;font-weight:700;color:#fff;font-family:Georgia,serif;">${info.titulo}</h2>
          <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.85);letter-spacing:0.5px;">${info.subtitulo}</p>
        </td>
      </tr>

      <!-- Corpo principal -->
      <tr>
        <td style="background:#fff;padding:36px 40px;">

          <!-- Saudação -->
          <p style="margin:0 0 8px;font-size:16px;color:#1A2E1A;font-weight:600;">Olá, ${nome}! 👋</p>
          <p style="margin:0 0 20px;font-size:14px;color:#5C6E5C;line-height:1.7;">${info.msg}</p>

          <!-- Número da encomenda -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
            <tr>
              <td style="background:${info.corFundo};border-left:4px solid ${info.cor};border-radius:0 8px 8px 0;padding:14px 20px;">
                <p style="margin:0;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${info.cor};font-weight:600;">Nº da Encomenda</p>
                <p style="margin:4px 0 0;font-size:22px;font-weight:700;color:#1A2E1A;font-family:Georgia,serif;">#${id_encomenda}</p>
                <p style="margin:4px 0 0;font-size:11px;color:#8FAF8A;">${dataHoje}</p>
              </td>
            </tr>
          </table>

          <!-- Timeline -->
          ${timeline}

          <!-- Artigos (só na confirmação) -->
          ${linhasHTML}

          <!-- Mensagem de detalhe -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;">
            <tr>
              <td style="background:#F7F9F5;border-radius:10px;padding:16px 20px;">
                <p style="margin:0;font-size:13px;color:#4A5C4A;line-height:1.6;">
                  ℹ️ &nbsp;${info.detalhe}
                </p>
                ${info.prazo ? `<p style="margin:8px 0 0;font-size:12px;color:#6B9E63;font-weight:600;">🕐 ${info.prazo}</p>` : ''}
              </td>
            </tr>
          </table>

          <!-- Botão CTA -->
          <div style="text-align:center;margin:28px 0 8px;">
            <a href="${frontUrl}/perfil?tab=pedidos"
               style="display:inline-block;background:${info.cor};color:#fff;text-decoration:none;padding:14px 36px;border-radius:50px;font-size:12px;letter-spacing:2px;text-transform:uppercase;font-weight:600;">
              Ver Encomenda
            </a>
          </div>

        </td>
      </tr>

      <!-- Separador de suporte -->
      <tr>
        <td style="background:#F7F9F5;padding:20px 40px;border-top:1px solid #E8F0E6;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="width:33%;text-align:center;padding:8px;">
                ${svgIcon('<path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>', '#6B9E63', 20)}
                <p style="margin:6px 0 0;font-size:10px;color:#6B9E63;font-weight:600;letter-spacing:1px;text-transform:uppercase;">Suporte</p>
                <p style="margin:2px 0 0;font-size:11px;color:#8FAF8A;">lilistoremodachique<br>@gmail.com</p>
              </td>
              <td style="width:33%;text-align:center;padding:8px;border-left:1px solid #E8F0E6;border-right:1px solid #E8F0E6;">
                ${svgIcon('<path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0"/><path d="M12 8v4l3 3"/>', '#6B9E63', 20)}
                <p style="margin:6px 0 0;font-size:10px;color:#6B9E63;font-weight:600;letter-spacing:1px;text-transform:uppercase;">Horário</p>
                <p style="margin:2px 0 0;font-size:11px;color:#8FAF8A;">Seg – Sáb<br>10h – 19h</p>
              </td>
              <td style="width:33%;text-align:center;padding:8px;">
                ${svgIcon('<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>', '#6B9E63', 20)}
                <p style="margin:6px 0 0;font-size:10px;color:#6B9E63;font-weight:600;letter-spacing:1px;text-transform:uppercase;">Loja</p>
                <p style="margin:2px 0 0;font-size:11px;color:#8FAF8A;">Rua das Flores, 123<br>4000-001 Porto</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Rodapé -->
      <tr>
        <td style="background:#1A2E1A;padding:20px 40px;border-radius:0 0 16px 16px;text-align:center;">
          <p style="margin:0 0 8px;font-size:12px;color:#6B9E63;">
            <a href="${frontUrl}" style="color:#6B9E63;text-decoration:none;">Loja</a>
            &nbsp;·&nbsp;
            <a href="${frontUrl}/perfil?tab=pedidos" style="color:#6B9E63;text-decoration:none;">Pedidos</a>
            &nbsp;·&nbsp;
            <a href="${frontUrl}/ajuda" style="color:#6B9E63;text-decoration:none;">Ajuda</a>
          </p>
          <p style="margin:0;font-size:11px;color:#4A5C4A;">© 2025 Moda Chique · Lili Store. Todos os direitos reservados.</p>
          <p style="margin:6px 0 0;font-size:10px;color:#3D5C3D;">Este email foi enviado automaticamente. Por favor não respondas a esta mensagem.</p>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
}

// ─── Funções públicas ──────────────────────────────────────────────────────────

async function enviarConfirmacaoEncomenda({ email, nome, id_encomenda, total, itens }) {
  try {
    await transporter.sendMail({
      from: `"Moda Chique · Lili Store" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `✅ Encomenda #${id_encomenda} confirmada — Moda Chique`,
      html: gerarHTML({ nome, id_encomenda, estado: 'confirmado', total, itens }),
    });
    console.log(`📧 Confirmação enviada → ${email}`);
  } catch (err) {
    console.error('Erro ao enviar email de confirmação:', err.message);
  }
}

async function enviarAtualizacaoEstado({ email, nome, id_encomenda, estado, total }) {
  if (!estadoInfo[estado]) return;
  try {
    const info = estadoInfo[estado];
    await transporter.sendMail({
      from: `"Moda Chique · Lili Store" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Encomenda #${id_encomenda} — ${info.titulo}`,
      html: gerarHTML({ nome, id_encomenda, estado, total }),
    });
    console.log(`📧 Estado (${estado}) enviado → ${email}`);
  } catch (err) {
    console.error(`Erro ao enviar email de estado (${estado}):`, err.message);
  }
}

async function enviarRespostaSuporte({ email, nome, id_mensagem, assunto, resposta }) {
  const frontUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  try {
    await transporter.sendMail({
      from: `"Moda Chique · Lili Store" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `💬 Tens uma nova resposta — Ticket #${id_mensagem}`,
      html: `<!DOCTYPE html>
<html lang="pt">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#F0F4F0;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F0F4F0;">
  <tr><td align="center" style="padding:32px 16px;">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
      <tr><td style="background:#1A2E1A;padding:20px 40px;border-radius:16px 16px 0 0;text-align:center;">
        <p style="margin:0;font-size:10px;letter-spacing:5px;text-transform:uppercase;color:#6B9E63;">Moda Chique</p>
        <h1 style="margin:4px 0 0;font-size:22px;color:#fff;font-family:Georgia,serif;">Lili Store</h1>
      </td></tr>
      <tr><td style="background:#185FA5;padding:28px 40px;text-align:center;">
        ${svgIcon('<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>', '#fff', 32)}
        <h2 style="margin:10px 0 4px;font-size:22px;color:#fff;font-family:Georgia,serif;">Nova Resposta do Suporte</h2>
        <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.85);">Ticket #${id_mensagem}</p>
      </td></tr>
      <tr><td style="background:#fff;padding:36px 40px;">
        <p style="margin:0 0 16px;font-size:15px;color:#1A2E1A;font-weight:600;">Olá, ${nome}! 👋</p>
        <p style="margin:0 0 20px;font-size:14px;color:#5C6E5C;line-height:1.7;">A nossa equipa respondeu ao teu pedido de suporte.</p>
        <div style="background:#F7F9F5;border-left:4px solid #185FA5;border-radius:0 10px 10px 0;padding:16px 20px;margin-bottom:20px;">
          <p style="margin:0 0 6px;font-size:11px;color:#185FA5;letter-spacing:2px;text-transform:uppercase;font-weight:600;">Assunto: ${assunto}</p>
        </div>
        <div style="background:#F0F5EE;border-radius:12px;padding:20px;margin-bottom:24px;">
          <p style="margin:0 0 8px;font-size:11px;color:#3D6B4A;font-weight:600;letter-spacing:1px;text-transform:uppercase;">Resposta do Suporte:</p>
          <p style="margin:0;font-size:14px;color:#2C3A2C;line-height:1.7;">${resposta}</p>
        </div>
        <div style="text-align:center;">
          <a href="${frontUrl}/suporte" style="display:inline-block;background:#185FA5;color:#fff;text-decoration:none;padding:14px 36px;border-radius:50px;font-size:12px;letter-spacing:2px;text-transform:uppercase;font-weight:600;">Ver Conversa</a>
        </div>
      </td></tr>
      <tr><td style="background:#1A2E1A;padding:20px 40px;border-radius:0 0 16px 16px;text-align:center;">
        <p style="margin:0;font-size:11px;color:#4A5C4A;">© 2025 Moda Chique · Lili Store. Todos os direitos reservados.</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`,
    });
    console.log(`📧 Resposta suporte enviada → ${email}`);
  } catch (err) {
    console.error('Erro ao enviar email de suporte:', err.message);
  }
}

module.exports = { enviarConfirmacaoEncomenda, enviarAtualizacaoEstado, enviarRespostaSuporte };
