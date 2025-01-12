import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const verificarAutenticacao = async(req, res, next) => {
    try {
        console.log('=== Início da verificação de autenticação ===');
        console.log('Headers completos:', req.headers);
        console.log('Header Authorization:', req.headers.authorization);

        const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
        console.log('Token extraído:', token);

        if (!token) {
            console.log('Token não fornecido');
            return res.status(401).json({ error: 'Token não fornecido' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token decodificado:', decoded);

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId }
        });
        console.log('Usuário encontrado:', user ? 'Sim' : 'Não');

        if (!user) {
            console.log('Usuário não encontrado');
            return res.status(401).json({ error: 'Usuário não encontrado' });
        }

        req.user = user;
        console.log('=== Autenticação bem-sucedida ===');
        next();
    } catch (error) {
        console.error('Erro de autenticação:', error);
        return res.status(401).json({ error: 'Token inválido' });
    }
};