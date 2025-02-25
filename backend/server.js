import express from 'express';
import path from 'path';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import publicRoutes from './routes/public.js';
import privateRoutes from './routes/privet.js';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente
dotenv.config();

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

const app = express();

// Healthcheck para o Render
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// Middleware para processar JSON
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Configurar sessão
app.use(session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Configurar pasta estática para arquivos frontend
app.use('/smartutilities', express.static(path.join(projectRoot, 'frontend')));
app.use(express.static(path.join(projectRoot, 'frontend')));

// Usar as rotas públicas com prefixo /smartutilities
app.use('/smartutilities', publicRoutes);

// Usar as rotas privadas com prefixo /smartutilities
app.use('/smartutilities', privateRoutes);

// Rota principal redirecionando para /smartutilities
app.get('/', (req, res) => {
    res.redirect('/smartutilities');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});