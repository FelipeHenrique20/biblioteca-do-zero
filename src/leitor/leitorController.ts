import { Request, Response } from "express";
import { registrarLeitor, loginLeitor} from "./leitorService";
import { tratarErro } from "../utils/errorHandler";

export function registrar(req: Request, res: Response) {
    try {
        const { nome, email, senha } = req.body;
        const leitor = registrarLeitor(nome, email, senha);
        res.status(201).json(leitor);
    } catch (error) {
        tratarErro(error, res);
    }
}

export function fazerLogin(req: Request, res: Response) {
    try {
        const { email, senha } = req.body;
        res.json(loginLeitor(email, senha));
    } catch (error) {
        tratarErro(error, res);
    }
}