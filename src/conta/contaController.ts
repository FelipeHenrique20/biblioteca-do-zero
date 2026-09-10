import { Request, Response } from "express";
import { registrarConta } from "./contaService";
import { tratarErro } from "../utils/errorHandler";

export function registrar(req: Request, res: Response) {
    try {
        const { nome, email, senha } = req.body;
        const conta = registrarConta(nome, email, senha);
        res.status(201).json(conta);
    } catch (error) {
        tratarErro(error, res);
    }
}