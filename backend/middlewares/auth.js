import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const verificarAutenticacao = async(req, res, next) => {
    try {
        // Tenta pegar o token do header Authorization ou do cookie
        const token = (req.headers.authorization && req.headers.authorization.split(' ')[1]) ||
            (req.cookies && req.cookies.token) ||
            (req.query && req.query.token);

        if (!token) {
            return res.redirect('/smartutilities/login');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId }
        });

        if (!user) {
            return res.redirect('/smartutilities/login');
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Erro de autenticação:', error);
        res.redirect('/smartutilities/login');
    }
};