import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { verificarAutenticacao } from '../middlewares/auth.js';

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '../..');

const router = express.Router();

// Usar o middleware de autenticação
router.use(verificarAutenticacao);

// Aqui você pode adicionar rotas privadas no futuro

export default router;