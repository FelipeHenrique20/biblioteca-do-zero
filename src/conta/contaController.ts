import { Request, Response } from "express";
import { registrarConta, login } from "./contaService";
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

export function fazerLogin(req: Request, res: Response) {
    try {
        const { email, senha } = req.body;
        const resultado = login(email, senha);
        res.json(resultado);
    } catch (error) {
        tratarErro(error, res);
    }
}