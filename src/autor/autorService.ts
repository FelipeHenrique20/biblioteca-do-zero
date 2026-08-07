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

// Validação de NOME
function validarNome(nome: string): string {
    if (!nome || typeof nome !== "string") {
        throw new AppError("O campo 'nome' é obrigatório", 400);
    }

    const nomeFormatado = nome.trim().replace(/\s+/g," ");

    if (nomeFormatado.length === 0) {
        throw new AppError("O campo 'nome' é obrigatório", 400);
    }

    return nomeFormatado;
}

// Função para CRIAR um novo autor
export function criarAutor(nome: string) {
    const nomeValidado = validarNome(nome);
    const stmt = db.prepare("INSERT INTO autores (nome) VALUES (?)");
    const info = stmt.run(nomeValidado);
    return buscarAutorPorId(Number(info.lastInsertRowid));
}

// Função para ATUALIZAR um autor existente
export function atualizarAutor(id: number, nome: string) {
    buscarAutorPorId(id);
    
    const nomeValidado = validarNome(nome);
    const stmt = db.prepare("UPDATE autores SET nome = ? WHERE id = ?");
    stmt.run(nomeValidado, id);
    return buscarAutorPorId(id);
}

// Função para REMOVER um autor
export function removerAutor(id: number) {
    buscarAutorPorId(id);
    const stmt = db.prepare("SELECT COUNT(*) as total FROM livros WHERE autorId = ?");
    const resultado = stmt.get(id) as { total: number };

    if (resultado.total > 0) {
        throw new AppError("Não é possivel remover um autor que possui livros cadastrados", 409);
    }
    const deleteStmt = db.prepare("DELETE FROM autores WHERE id = ?");
    deleteStmt.run(id);
}