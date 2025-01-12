import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { stripe } from '../config/stripe.js';

const prisma = new PrismaClient();
const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '../..');
const router = express.Router();

// Middleware para processar JSON
router.use(express.json());

// Rota principal do smartutilities
router.get('/', (req, res) => {
    res.sendFile(path.join(projectRoot, 'frontend', 'index.html'));
});

// Rota para login
router.get('/login', (req, res) => {
    res.sendFile(path.join(projectRoot, 'frontend', 'login.html'));
});

// Rota para processar login
router.post('/login', async(req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });

        // Verifica senha
        const validPassword = await bcrypt.compare(password, user.password);

        // Gera token com expiração de 1 minuto
        const token = jwt.sign({ userId: user.id },
            process.env.JWT_SECRET, { expiresIn: '1m' } // Mudando para 1 minuto
        );

        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao fazer login' });
    }
});

// Rota para cadastro
router.post('/cadastro', async(req, res) => {
    try {
        const { name, email, password } = req.body;

        console.log('Tentando criar usuário:', { name, email }); // Log para debug

        // Verificar se usuário já existe
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            console.log('Email já cadastrado:', email);
            return res.status(400).json({ error: 'Email já cadastrado' });
        }

        // Criptografar senha
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Criar usuário
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        });

        console.log('Usuário criado com sucesso:', user.id);

        // Gera token com expiração de 1 minuto
        const token = jwt.sign({ userId: user.id },
            process.env.JWT_SECRET, { expiresIn: '1m' } // Mudando para 1 minuto
        );

        res.json({ token });
    } catch (error) {
        console.error('Erro ao criar usuário:', error); // Log do erro completo
        res.status(500).json({
            error: 'Erro ao criar usuário',
            details: error.message
        });
    }
});

// Rota para a página de conteúdo (agora pública)
router.get('/conteudo', (req, res) => {
    res.sendFile(path.join(projectRoot, 'frontend', 'conteudo.html'));
});

// Rota para página de sucesso
router.get('/success', (req, res) => {
    res.sendFile(path.join(projectRoot, 'frontend', 'success.html'));
});

export default router;