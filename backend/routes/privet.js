import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { verificarAutenticacao } from '../middlewares/auth.js';
import { stripe } from '../config/stripe.js';

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '../..');

const router = express.Router();

// Usar o middleware de autenticação
router.use(verificarAutenticacao);

// Rota para criar sessão de checkout
router.post('/create-checkout-session', async(req, res) => {
    try {
        console.log('Criando sessão de checkout...');

        const session = await stripe.checkout.sessions.create({
            line_items: [{
                price_data: {
                    currency: 'brl',
                    product: 'prod_RZd7pDNjMkwOYy',
                    unit_amount: 2990,
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${req.headers.origin}/smartutilities/success`,
            cancel_url: `${req.headers.origin}/smartutilities`,
            allow_promotion_codes: true,
            locale: 'pt-BR',
            client_reference_id: req.user.id, // Adiciona o ID do usuário à sessão
        });

        console.log('Sessão criada:', session.id);
        res.json({ url: session.url });
    } catch (error) {
        console.error('Erro completo:', error);
        res.status(500).json({
            error: 'Erro ao criar sessão de pagamento',
            details: error.message,
            type: error.type
        });
    }
});

// Aqui você pode adicionar rotas privadas no futuro

export default router;