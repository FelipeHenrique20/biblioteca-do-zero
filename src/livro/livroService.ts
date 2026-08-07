import { db } from "../database/connection";
import { AppError } from "../errors/errors";
import{ buscarAutorPorId } from "../autor/autorService"

// Função para LISTAR todos os livros
export function listarLivros() {
    const stmt = db.prepare("SELECT * FROM livros ORDER BY titulo");
    return stmt.all();
}

// Função para BUSCAR um livro pelo ID
export function buscarLivroPorId(id: number) {
    const stmt = db.prepare("SELECT * FROM livros WHERE id = ?");
    const livro = stmt.get(id);

    if (!livro) {
        throw new AppError("Livro não encontrado", 404);
    }

    return livro;
}

// Adequadação para o contexto de criar um livro com autor inválido
function validarAutorExistente(autorId: number) {
    try {
        buscarAutorPorId(autorId);
    } catch {
        throw new AppError("O autor informado não existe", 400);
    }
}

function validarDadosLivro(titulo: string, isbn: string, quantidade: number, autorId: number) {
    if (!titulo || typeof titulo !== "string" || titulo.trim().length === 0) {
        throw new AppError("O campo 'titulo' é obrigatório", 400);
    }
    if (!isbn || typeof isbn !== "string" || isbn.trim().length === 0) {
        throw new AppError("O campo 'isbn' é obrigatório", 400);
    }
    if (quantidade === undefined || typeof quantidade !== "number" || quantidade < 0) {
        throw new AppError("O campo 'quantidade' é obrigatório e deve ser um número não negativo", 400);
    }
    if (!autorId || typeof autorId !== "number" || autorId <= 0) {
        throw new AppError("O campo 'autorId' é obrigatório e deve ser um número positivo", 400);
    }
}

// Função para CRIAR um novo livro
export function criarLivro(titulo: string, isbn: string, quantidade: number, autorId: number) {
    validarDadosLivro(titulo, isbn, quantidade, autorId);
    validarAutorExistente(autorId);

    const stmt = db.prepare("INSERT INTO livros (titulo, isbn, quantidade, quantidadeDisponivel, autorId) VALUES (?, ?, ?, ?, ?)");
    const info = stmt.run(titulo, isbn, quantidade, quantidade, autorId);
    return buscarLivroPorId(Number(info.lastInsertRowid));
}

// Função para ATUALIZAR um livro existente
export function atualizarLivro(id: number, titulo: string, isbn: string, quantidade: number, autorId: number) {
    buscarLivroPorId(id);
    validarDadosLivro(titulo, isbn, quantidade, autorId);
    validarAutorExistente(autorId);

    const stmt = db.prepare("UPDATE livros SET titulo = ?, isbn = ?, quantidade = ?, autorId = ? WHERE id = ?");
    stmt.run(titulo, isbn, quantidade, autorId, id);
    return buscarLivroPorId(id);
}

// Função para REMOVER um livro
export function removerLivro(id: number) {
    buscarLivroPorId(id);
    
    const stmt = db.prepare("SELECT COUNT(*) as total FROM emprestimos WHERE livroId = ?");
    const resultado = stmt.get(id) as { total: number };

    if (resultado.total > 0) {
        throw new AppError("Não é possivel remover um livro que possui empréstimos (mesmo já devolvido)", 409);
    }

    const deleteStmt = db.prepare("DELETE FROM livros WHERE id = ?");
    deleteStmt.run(id);
}