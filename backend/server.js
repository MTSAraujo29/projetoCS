import express from 'express';
import path from 'path'; //serve para manipular caminhos de arquivos
import session from 'express-session'; //serve para criar e gerenciar sessões do usuário
import cookieParser from 'cookie-parser'; // Serva para criar e ler cookies do navegador
import publicRoutes from './routes/public.js'; //serve para criar rotas públicas
import privateRoutes from './routes/privet.js'; //serve para criar rotas privadas
import { fileURLToPath } from 'url'; //serve para converter URLs em caminhos de arquivos
import JWT from 'jsonwebtoken'; //serve para criar e verificar tokens JWT

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
    secret: process.env.JWT_SECRET,
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