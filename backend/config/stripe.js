import Stripe from 'stripe';
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente
dotenv.config();

// Verifica se a chave do Stripe existe
if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY não encontrada');
}

// Configura o Stripe com a chave secreta
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16', // Versão mais recente da API
    typescript: false,
    appInfo: {
        name: 'Smart Utilities',
        version: '1.0.0'
    }
});