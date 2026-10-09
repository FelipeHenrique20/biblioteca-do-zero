import { db } from "../database/connection";
import { AppError } from "../errors/errors";

export function listarCategorias() {
    const stmt = db.prepare("SELECT * FROM categorias ORDER BY nome");
    return stmt.all();
}

export function buscarCategoriaPorId(id: number) {
    const stmt = db.prepare("SELECT * FROM categorias WHERE id = ?");
    const categoria = stmt.get(id);

    if (!categoria) {
        throw new AppError("Categoria não encontrada", 404);
    }
    return categoria;
}

export function criarCategoria(nome: string) {
    if (!nome || typeof nome !== "string" || nome.trim().length === 0) {
        throw new AppError("O campo 'nome' é obrigatório", 400);
    }

    const stmtBusca = db.prepare("SELECT id FROM categorias WHERE nome = ?");
    const existente = stmtBusca.get(nome);
    if (existente) {
        throw new AppError("Já existe uma categoria com esse nome", 409);
    }

    const stmt = db.prepare("INSERT INTO categorias (nome) VALUES (?)");
    const info = stmt.run(nome);
    return buscarCategoriaPorId(Number(info.lastInsertRowid));
}

export function removerCategoria(id: number) {
    buscarCategoriaPorId(id);

    const stmt = db.prepare("SELECT COUNT(*) as total FROM livros WHERE categoriaId = ?");
    const resultado = stmt.get(id) as { total: number };

    if (resultado.total > 0) {
        throw new AppError("Não é possível remover uma categoria que possui livros vinculados", 409);
    }

    const deleteStmt = db.prepare("DELETE FROM categorias WHERE id = ?");
    deleteStmt.run(id);
}