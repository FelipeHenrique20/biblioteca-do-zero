import { Request, Response } from "express";
import { listarCategorias, criarCategoria, removerCategoria } from "./categoriaService";
import { tratarErro } from "../utils/errorHandler";

export function listar(req: Request, res: Response) {
    const categorias = listarCategorias();
    res.json(categorias);
}

export function criar(req: Request, res: Response) {
    try {
        const { nome } = req.body;
        const categoria = criarCategoria(nome);
        res.status(201).json(categoria); 
    } catch (error) {
        tratarErro(error, res);
    }
}

export function remover(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        removerCategoria(id);
        res.status(204).send();
    } catch (error) {
        tratarErro(error, res);
    }
}