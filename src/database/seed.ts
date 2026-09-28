import bcrypt from "bcrypt";
import { db } from "./connection";

export function popularDadosIniciais() {
    const contas = db.prepare("SELECT COUNT(*) as total FROM contas").get() as { total: number };

    if (contas.total === 0) {
        const email = process.env.ADMIN_EMAIL;
        const senha = process.env.ADMIN_SENHA;

        if (email && senha) {
            const senhaHash = bcrypt.hashSync(senha, 10);
            db.prepare(
                "INSERT INTO contas (nome, email, senhaHash, role) VALUES (?, ?, ?, 'admin')"
            ).run(process.env.ADMIN_NOME || "Administrador", email, senhaHash);
            console.log("Conta admin inicial criada.");
        }
    }

    const autores = db.prepare("SELECT COUNT(*) as total FROM autores").get() as { total: number };

    if (autores.total === 0) {
        const inserirAutor = db.prepare("INSERT INTO autores (nome) VALUES (?)");
        const tolkien = Number(inserirAutor.run("J. R. R. Tolkien").lastInsertRowid);
        const machado = Number(inserirAutor.run("Machado de Assis").lastInsertRowid);

        const inserirLivro = db.prepare(
            "INSERT INTO livros (titulo, isbn, quantidade, quantidadeDisponivel, autorId) VALUES (?, ?, ?, ?, ?)"
        );
        inserirLivro.run("O Hobbit", "9788578277109", 5, 5, tolkien);
        inserirLivro.run("Dom Casmurro", "9788535910663", 3, 3, machado);

        db.prepare("INSERT INTO usuarios (nome, email) VALUES (?, ?)").run(
            "Maria Silva",
            "maria@exemplo.com"
        );

        console.log("Dados de demonstração criados.");
    }
}