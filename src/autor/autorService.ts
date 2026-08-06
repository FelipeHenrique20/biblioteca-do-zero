import { db } from "../database/connection";
import { AppError } from "../errors/errors";

// Função para LISTAR todos os autores 
export function listarAutores() {
    const stmt = db.prepare("SELECT * FROM autores ORDER BY nome");
    return stmt.all();
}

// Função para BUSCAR um autor pelo ID
export function buscarAutorPorId(id: number) {
    const stmt = db.prepare("SELECT * FROM autores WHERE id = ?");
    const autor = stmt.get(id);

    if (!autor) {
        throw new AppError("Autor não encontrado", 404);
    }

    return autor;
}

// Função para CRIAR um novo autor
export function criarAutor(nome: string) {
    if (!nome || typeof nome !== "string" || nome.trim().length === 0) {
        throw new AppError("O campo 'nome' é obrigatório", 400);
    }

    const stmt = db.prepare("INSERT INTO autores (nome) VALUES (?)");
    const info = stmt.run(nome);
    return buscarAutorPorId(Number(info.lastInsertRowid));
}

// Função para ATUALIZAR um autor existente
export function atualizarAutor(id: number, nome: string) {
    if (!nome || typeof nome !== "string" || nome.trim().length === 0) {
        throw new AppError("O campo 'nome' é obrigatório", 400);
    }

    buscarAutorPorId(id);

    const stmt = db.prepare("UPDATE autores SET nome = ? WHERE id = ?");
    stmt.run();
    return buscarAutorPorId(id);
}

// Função para REMOVER um autor
export function removerAutor(id: number) {
    buscarAutorPorId(id);

    const stmt = db.prepare("DELETE FROM autores WHERE id = ?");
    stmt.run(id);
}