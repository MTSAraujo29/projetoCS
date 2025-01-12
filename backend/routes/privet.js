import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';
import { verificarAutenticacao } from '../middlewares/auth.js';

const prisma = new PrismaClient();
const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '../..');

const router = express.Router();

// Usar o middleware de autenticação em todas as rotas privadas
router.use(verificarAutenticacao);

// Rota para a página de conteúdo
router.get('/conteudo', (req, res) => {
    res.sendFile(path.join(projectRoot, 'frontend', 'conteudo.html'));
});

// API para buscar vídeos
router.get('/videos', async(req, res) => {
    try {
        const videos = await prisma.video.findMany();
        res.json(videos);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar vídeos' });
    }
});

export default router;