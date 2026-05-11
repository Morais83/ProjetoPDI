const express = require('express');
const router  = express.Router();
const stripe  = require('stripe')(process.env.STRIPE_SECRET_KEY);
const auth    = require('../middleware/auth');

// POST /api/pagamentos/criar-intencao
router.post('/criar-intencao', auth, async (req, res) => {
  try {
    const { total } = req.body; // valor em cêntimos

    if (!total || total < 50) {
      return res.status(400).json({ erro: 'Valor inválido.' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: 'eur',
      payment_method_types: ['card'],
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error('Erro ao criar PaymentIntent:', err);
    res.status(500).json({ erro: 'Erro ao iniciar pagamento. Tenta novamente.' });
  }
});

module.exports = router;
