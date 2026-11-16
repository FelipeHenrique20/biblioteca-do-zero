import { db } from "../database/connection";
import { AppError } from "../errors/errors";
import { buscarLivroPorId } from "../livro/livroService";
import { buscarUsuarioPeloId } from "../usuario/usuarioService";

// Listar TODOS os emprestimos
export function listarEmprestimos() {
    const stmt = db.prepare("SELECT * FROM emprestimos WHERE status = 'aprovado' ORDER BY dataEmprestimo DESC");
    return stmt.all();
}

// Listar os emprestimos ainda não devolvidos
export function listarEmprestimosAtivos() {
    const stmt = db.prepare("SELECT * FROM emprestimos WHERE status = 'aprovado' AND dataDevolucao IS NULL");
    return stmt.all();
}

function validarId(id: number) {
    if (Number.isNaN(id) || id <= 0) {
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
    status: "pendente" | "aprovado" | "rejeitado";
}

const LIMITE_PEDIDOS_PENDENTES = 3;

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

    if (emprestimo.status !== "aprovado") {
        throw new AppError("Apenas empréstimos aprovados podem ser devolvidos", 409);
    }

    if (emprestimo.dataDevolucao) {
        throw new AppError("Este empréstimo já foi devolvido", 400);
    }

    db.prepare("UPDATE emprestimos SET dataDevolucao = datetime('now') WHERE id = ?").run(id);
    db.prepare("UPDATE livros SET quantidadeDisponivel = quantidadeDisponivel + 1 WHERE id = ?").run(emprestimo.livroId);

    return buscarEmprestimoPorId(id);
}

export function listarPedidosPendentes() {
    const stmt = db.prepare("SELECT * FROM emprestimos WHERE status = 'pendente' ORDER BY dataEmprestimo ASC");
    
    return stmt.all();
}

export function listarEmprestimosDoLeitor(usuarioId: number) {
    const stmt = db.prepare("SELECT * FROM emprestimos WHERE usuarioId = ? ORDER BY dataEmprestimo DESC");
    
    return stmt.all(usuarioId);
}

export function solicitarEmprestimo(livroId: number, usuarioId: number) {
    validarId(livroId);
    validarId(usuarioId);

    const livro = buscarLivroPorId(livroId) as { quantidadeDisponivel: number };
    buscarUsuarioPeloId(usuarioId);

    if (livro.quantidadeDisponivel <= 0) {
        throw new AppError("Não há exemplares disponíveis deste livro", 400);
    }

    const duplicado = db
        .prepare(
            `SELECT id FROM emprestimos
             WHERE livroId = ? AND usuarioId = ?
             AND (status = 'pendente' OR (status = 'aprovado' AND dataDevolucao IS NULL))`
        )
        .get(livroId, usuarioId);
    if (duplicado) {
        throw new AppError("Você já tem um pedido pendente ou um empréstimo ativo deste livro", 409);
    }

    const pendentes = db
        .prepare("SELECT COUNT(*) as total FROM emprestimos WHERE usuarioId = ? AND status = 'pendente'")
        .get(usuarioId) as { total: number };
    if (pendentes.total >= LIMITE_PEDIDOS_PENDENTES) {
        throw new AppError(`Você já tem ${LIMITE_PEDIDOS_PENDENTES} pedidos pendentes. Aguarde a análise antes de pedir outro`, 409);
    }

    const info = db
        .prepare("INSERT INTO emprestimos (livroId, usuarioId, status) VALUES (?, ?, 'pendente')")
        .run(livroId, usuarioId);

    return buscarEmprestimoPorId(Number(info.lastInsertRowid));
}

export function aprovarPedido(id: number) {
    const pedido = buscarEmprestimoPorId(id) as unknown as Emprestimo;

    if (pedido.status !== "pendente") {
        throw new AppError("Este pedido não está pendente", 409);
    }

    const livro = buscarLivroPorId(pedido.livroId) as { quantidadeDisponivel: number };
    if (livro.quantidadeDisponivel <= 0) {
        throw new AppError("Não há exemplares disponíveis para aprovar este pedido", 409);
    }

    db.prepare(
        "UPDATE emprestimos SET status = 'aprovado', dataEmprestimo = datetime('now') WHERE id = ?"
    ).run(id);
    db.prepare(
        "UPDATE livros SET quantidadeDisponivel = quantidadeDisponivel - 1 WHERE id = ?"
    ).run(pedido.livroId);

    return buscarEmprestimoPorId(id);
}

export function rejeitarPedido(id: number) {
    const pedido = buscarEmprestimoPorId(id) as unknown as Emprestimo;

    if (pedido.status !== "pendente") {
        throw new AppError("Este pedido não está pendente", 409);
    }

    db.prepare("UPDATE emprestimos SET status = 'rejeitado' WHERE id = ?").run(id);

    return buscarEmprestimoPorId(id);
}