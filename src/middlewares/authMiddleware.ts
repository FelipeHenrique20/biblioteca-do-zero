import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/errors";

const JWT_SECRET = process.env.JWT_SECRET as string;

export interface RequestAutenticado extends Request {
    conta?: {
        id: number;
        nome: string;
        role: "admin" | "comum";
    };
}

export function autenticar(req: RequestAutenticado, res: Response, next: NextFunction) {
    const cabecalhoAuth = req.headers.authorization;

    if (!cabecalhoAuth || !cabecalhoAuth.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Token não fornecido" });
    }
    
    const token = cabecalhoAuth.split(" ")[1];

    try {
        const payload = jwt.verify(token, JWT_SECRET) as {
            id: number;
            nome: string;
            role: "admin" | "comum";
        };

        req.conta = payload;
        next();
    } catch {
        return res.status(401).json({ error: "Token inválido ou expirado" });
    }
}

export function apenasAdmin(req: RequestAutenticado, res: Response, next: NextFunction) {
    if (req.conta?.role !== "admin") {
        return res.status(403).json({ error: "Acesso restrito a administradores" });
    }

    next();
}