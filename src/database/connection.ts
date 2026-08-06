import  { DatabaseSync } from "node:sqlite";

// Cria ou abre o arquivo do banco de dados 
export const db = new DatabaseSync("dev.db");

export function initDatabase() {
    // Ativa a checagem de "chaves esrtangeiras" (relacionamento entre as tabelas)
    // Fazendo isso manualmente, pois o SQLite nao ativa por padrao
    db.exec("PRAGMA foreign_keys = ON");

    // AUTORES
    db.exec(`
        CREATE TABLE IF NOT EXISTS autores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        createdAt TEXT NOT NULL DEFAULT (datetime('now'))
        );
    `);
    
    // LIVROS
    db.exec(`
        CREATE TABLE IF NOT EXISTS livros (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo TEXT NOT NULL,
            isbn TEXT NOT NULL UNIQUE,
            quantidade INTEGER NOT NULL DEFAULT 1,
            quantidadeDisponivel INTEGER NOT NULL DEFAULT 1,
            autorId INTEGER NOT NULL,
            createdAt TEXT NOT NULL DEFAULT (datetime('now')),
            FOREIGN KEY (autorId) REFERENCES autores(id)
        );
    `)
    
    // USUARIOS
    db.exec(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            createdAt TEXT NOT NULL DEFAULT (datetime('now'))
        );
    `)
    
    // EMPRESTIMOS
    db.exec(`
        CREATE TABLE IF NOT EXISTS emprestimos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            livroId INTEGER NOT NULL,
            usuarioId INTEGER NOT NULL,
            dataEmprestimo TEXT NOT NULL DEFAULT (datetime('now')),
            dataDevolucao TEXT,
            FOREIGN KEY (livroId) REFERENCES livros(id),
            FOREIGN KEY (usuarioId) REFERENCES usuarios(id)
        );
    `)
    
    console.log("Banco de dados inicializado com sucesso.");
}