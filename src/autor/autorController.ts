import { Request, Response } from "express";
import { listarAutores, criarAutor, buscarAutorPorId, atualizarAutor, removerAutor } from "../autor/autorService";
import { tratarErro } from "../utils/errorHandler";

export function listar(_req: Request, res: Response) {
    const autores = listarAutores();
    return res.json(autores);
}

export function buscarPorId(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        const autor = buscarAutorPorId(id);
        return res.json(autor)
    } catch (error) {
        tratarErro(error, res);
    }
}

export function criar(req: Request, res: Response) {
    try {
        const { nome } = req.body;
        const autor = criarAutor(nome);
        return res.status(201).json(autor);
    } catch (error) {
        tratarErro(error, res);
    }
}

export function atualizar(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        const { nome } = req.body;
        const autorAtualizado = atualizarAutor(id, nome);
        return res.json(autorAtualizado)
    } catch (error) {
        tratarErro(error, res);
    }
}

export function remover(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        removerAutor(id);
        return res.status(204).send();
    } catch (error) {
        tratarErro(error, res);
    }
}