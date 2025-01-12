import Stripe from 'stripe';

const stripeSecretKey = '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';

export const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2023-10-16',
    typescript: false
});