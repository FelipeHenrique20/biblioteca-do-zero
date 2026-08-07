import { Request, Response } from "express";
import { listarLivros, criarLivro, buscarLivroPorId, atualizarLivro, removerLivro } from "./livroService";
import { tratarErro } from "../utils/errorHandler";

export function listar(req: Request, res: Response) {
    const livros = listarLivros();
    return res.json(livros);
}

export function buscarPorId(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        const livro = buscarLivroPorId(id);
        return res.json(livro);
    } catch (error) {
        tratarErro(error, res);
    }
}

export function criar(req: Request, res: Response) {
    try {
        const { titulo, isbn, quantidade, autorId } = req.body;
        const livro = criarLivro(titulo, isbn, quantidade, autorId);
        return res.status(201).json(livro);
    } catch (error) {
        tratarErro(error, res);
    }
}

export function atualizar(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        const { titulo, isbn, quantidade, autorId } = req.body;
        const livroAtualizado = atualizarLivro(id, titulo, isbn, quantidade, autorId);
        return res.json(livroAtualizado);
    } catch (error) {
        tratarErro(error, res);
    }
}

export function remover(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        removerLivro(id);
        return res.status(204).send();
    } catch (error) {
        tratarErro(error, res);
    }
}