import { db } from "../database/connection";
import { AppError } from "../errors/errors";
import { buscarLivroPorId } from "../livro/livroService";
import { buscarUsuarioPeloId } from "../usuario/usuarioService";

// Listar TODOS os emprestimos
export function listarEmprestimos() {
    const stmt = db.prepare("SELECT * FROM emprestimos ORDER BY dataEmprestimo DESC");
    return stmt.all();
}

// Listar os emprestimos ainda não devolvidos
export function listarEmprestimosAtivos() {
    const stmt = db.prepare("SELECT * FROM emprestimos WHERE dataDevolucao IS NULL");
    return stmt.all();
}

function validarId(id: number) {
    if (isNaN(id) || id <= 0) {
        throw new AppError("ID inválido", 400);
    }
}

// Busca um emprestimo especifico pelo id
export function buscarEmprestimoPorId(id: number) {
    validarId(id);

    const stmt = db.prepare("SELECT * FROM emprestimos WHERE id = ?");
    const emprestimo = stmt.get(id);

    if (!emprestimo) {
        throw new AppError("Empréstimo não encontrado", 404);
    }

    return emprestimo;
}

interface Emprestimo {
    id: number;
    livroId: number;
    usuarioId: number;
    dataEmprestimo: string;
    dataDevolucao: string | null;
}

// Cria um novo emprestimo
export function criarEmprestimo(livroId: number, usuarioId: number) {
    validarId(livroId);
    validarId(usuarioId);

    const livro = buscarLivroPorId(livroId) as { quantidadeDisponivel: number};
    buscarUsuarioPeloId(usuarioId);

    if (livro.quantidadeDisponivel <= 0) {
        throw new AppError("Nâo há exemplares disponíveis deste livro", 400);
    }

    const stmt = db.prepare("INSERT INTO emprestimos (livroId, usuarioId) VALUES (?, ?)");
    const info = stmt.run(livroId, usuarioId);

    db.prepare("UPDATE livros SET quantidadeDisponivel = quantidadeDisponivel - 1 WHERE id = ?").run(livroId);

    return buscarEmprestimoPorId(Number(info.lastInsertRowid));
}

// Marcar um emprestimo como devolvido
export function devolverEmprestimo(id: number) {
    const emprestimo = buscarEmprestimoPorId(id) as unknown as Emprestimo;

    if (emprestimo.dataDevolucao) {
        throw new AppError("Este empréstimo já foi devolvido", 400);
    }

    db.prepare("UPDATE emprestimos SET dataDevolucao = datetime('now') WHERE id = ?").run(id);
    db.prepare("UPDATE livros SET quantidadeDisponivel = quantidadeDisponivel + 1 WHERE id = ?").run(emprestimo.livroId);

    return buscarEmprestimoPorId(id);
}