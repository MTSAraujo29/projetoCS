import express from 'express';
import path from 'path';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import publicRoutes from './routes/public.js';
import privateRoutes from './routes/privet.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

const app = express();

// Middleware para processar JSON - deve vir ANTES das rotas
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Configurar sessão
app.use(session({
    secret: 'sua_chave_secreta',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Em produção, mude para true se usar HTTPS
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

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});