import { db } from "../database/connection";
import { AppError } from "../errors/errors"

// Função para Listar todos os usuarios
export function listarUsuarios() {
    const stmt = db.prepare("SELECT * FROM usuarios ORDER by nome");
    return stmt.all();
}

// Função para BUSCAR um usuario pelo id
export function buscarUsuarioPeloId(id: number) {
    const stmt = db.prepare("SELECT * FROM usuarios WHERE id = ?");
    const usuario = stmt.get(id);

    if (!usuario) {
        throw new AppError("Usuário não encontrado", 404);
    }

    return usuario;
}

function validarDadosUsuario(nome: string, email: string) {
    if (!nome || typeof nome !== "string" || nome.trim().length === 0) {
        throw new AppError("O campo 'nome' é obrigatório", 400);
    }
    if (!email || typeof email !== "string" || email.trim().length === 0) {
        throw new AppError("O campo 'email' é obrigatório", 400);
    }
}

// Função para CRIAR um novo usuario
export function criarUsuario(nome: string, email: string) {
    validarDadosUsuario(nome, email);
    
    const stmt = db.prepare("INSERT INTO usuarios (nome, email) VALUES (?, ?)");
    const info = stmt.run(nome, email);

    return buscarUsuarioPeloId(Number(info.lastInsertRowid));
}

// Função para ATUALIZAR um usuario existente
export function atualizarUsuario(id: number, nome: string, email: string) {
    buscarUsuarioPeloId(id);
    validarDadosUsuario(nome, email);

    const stmt = db.prepare("UPDATE usuarios SET nome = ?, email = ? WHERE id = ?");
    stmt.run(nome, email, id);

    return buscarUsuarioPeloId(id)
}

// Função para REMOVER um usario 
export function removerUsuario(id: number) {
    buscarUsuarioPeloId(id);
    const stmt = db.prepare("SELECT COUNT(*) as total FROM emprestimos WHERE usuarioId = ?");
    const resultado = stmt.get(id) as { total: number };

    if (resultado.total > 0) {
        throw new AppError("Não é possivel remover um usuário que possui empréstimos (mesmo já devolvidos)", 409);
    }

    const deleteStmt = db.prepare("DELETE FROM usuarios WHERE id = ?");
    deleteStmt.run(id);
}