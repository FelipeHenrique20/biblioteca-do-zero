import { Response } from "express";
import { AppError } from "../errors/errors";

export function tratarErro(error: unknown, res: Response) {
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
    }

    console.error(error);
    return res.status(500).json({ error: "Erro interno do servidor. "});
}
