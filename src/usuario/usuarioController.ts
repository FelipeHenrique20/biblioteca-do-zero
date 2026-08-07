import { Request, Response } from "express"
import { listarUsuarios, criarUsuario, buscarUsuarioPeloId, atualizarUsuario, removerUsuario } from "../usuario/usuarioService"
import { tratarErro } from "../utils/errorHandler";

export function listar(req: Request, res: Response) {
    const usuarios = listarUsuarios();
    return res.json(usuarios);
}

export function buscarPorId(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        const usuario = buscarUsuarioPeloId(id);
        return res.json(usuario);
    } catch (error) {
        tratarErro(error, res);
    }
}

export function criar(req: Request, res: Response) {
    try {
        const { nome, email } = req.body;
        const usuario = criarUsuario(nome, email);
        return res.status(201).json(usuario);
    } catch (error) {
        tratarErro(error, res);
    }
}

export function atualizar(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        const { nome, email } = req.body;
        const usuarioAtualizado = atualizarUsuario(id, nome, email);
        return res.json(usuarioAtualizado);
    } catch (error) {
        tratarErro(error, res);
    }
}

export function remover(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        removerUsuario(id);
        return res.status(204).send();
    } catch(error) {
        tratarErro(error, res);
    }
}