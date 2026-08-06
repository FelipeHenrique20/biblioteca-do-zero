import { Request, Response } from "express";
import { listarEmprestimos,  listarEmprestimosAtivos, buscarEmprestimoPorId, criarEmprestimo, devolverEmprestimo} from "./emprestimoService";
import { tratarErro } from "../utils/errorHandler";

export function listar(req: Request, res: Response) {
    try {
        const emprestimos = listarEmprestimos();
        return res.json(emprestimos);
    } catch (error) {
        tratarErro(error, res);
    }
}

export function listarAtivos(req: Request, res: Response) {
    try {
        const emprestimo = listarEmprestimosAtivos();

        return res.json(emprestimo);
    } catch (error) {
        tratarErro(error, res);
    }
}

export function buscarPorId(req: Request, res: Response) {
    try {
        const emprestimo = buscarEmprestimoPorId(Number(req.params.id));

        return res.json(emprestimo);
    } catch (error) {
        tratarErro(error, res);
    }
}

export function criar(req: Request, res: Response) {
    try {
        const { livroId, usuarioId } = req.body;
        const emprestimo = criarEmprestimo(livroId, usuarioId);

        return res.status(201).json(emprestimo);
    } catch (error) {
        tratarErro(error, res);
    }
}

export function devolver(req: Request, res: Response) {
    try {
        const emprestimo = devolverEmprestimo(Number(req.params.id));

        return res.json(emprestimo);
    } catch (error) {
        tratarErro(error, res);
    }
}