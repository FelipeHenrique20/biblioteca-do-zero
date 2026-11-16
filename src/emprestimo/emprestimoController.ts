import { RequestAutenticado } from "../middlewares/authMiddleware";
import { Request, Response } from "express";
import { listarEmprestimos,  listarEmprestimosAtivos, buscarEmprestimoPorId, criarEmprestimo, devolverEmprestimo, listarPedidosPendentes, listarEmprestimosDoLeitor, solicitarEmprestimo, aprovarPedido, rejeitarPedido } from "./emprestimoService";
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

export function listarPendentes(req: Request, res: Response) {
    try {
        return res.json(listarPedidosPendentes());
    } catch (error) {
        tratarErro(error, res);
    }
}

export function meus(req: RequestAutenticado, res: Response) {
    try {
        return res.json(listarEmprestimosDoLeitor(req.conta!.id));
    } catch (error) {
        tratarErro(error, res);
    }
}

export function solicitar(req: RequestAutenticado, res: Response) {
    try {
        const { livroId } = req.body;
        const pedido = solicitarEmprestimo(livroId, req.conta!.id);
        return res.status(201).json(pedido);
    } catch (error) {
        tratarErro(error, res);
    }
}

export function aprovar(req: Request, res: Response) {
    try {
        return res.json(aprovarPedido(Number(req.params.id)));
    } catch (error) {
        tratarErro(error, res);
    }
}

export function rejeitar(req: Request, res: Response) {
    try {
        return res.json(rejeitarPedido(Number(req.params.id)));
    } catch (error) {
        tratarErro(error, res);
    }
}