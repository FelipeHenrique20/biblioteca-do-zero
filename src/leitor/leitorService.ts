import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../database/connection";
import { AppError } from "../errors/errors";
import { buscarUsuarioPeloId } from "../usuario/usuarioService";

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET as string;

export function registrarLeitor(nome: string, email: string, senha: string) {
    if (!nome || typeof nome !== "string" || nome.trim().length === 0) {
        throw new AppError("O campo 'nome' é obrigatório", 400);
    }
    if (!email || typeof email !== "string" || email.trim().length === 0) {
        throw new AppError("O campo 'email' é obrigatório", 400);
    }
    if (!senha || typeof senha !== "string" || senha.length < 6) {
        throw new AppError("A senha deve ter no mínimo 6 caracteres", 400);
    }

    const existente = db
        .prepare("SELECT id FROM usuarios WHERE email = ? COLLATE NOCASE")
        .get(email.trim());
    if (existente) {
        throw new AppError("Já existe um cadastro com esse e-mail", 409);
    }

    const senhaHash = bcrypt.hashSync(senha, SALT_ROUNDS);

    const info = db
        .prepare("INSERT INTO usuarios (nome, email, senhaHash) VALUES (?, ?, ?)")
        .run(nome.trim(), email.trim(), senhaHash);

    return buscarUsuarioPeloId(Number(info.lastInsertRowid));
}

export function loginLeitor(email: string, senha: string) {
    if (!email || !senha) {
        throw new AppError("E-mail e senha são obrigatórios", 400);
    }

    const leitor = db
        .prepare("SELECT id, nome, email, senhaHash FROM usuarios WHERE email = ? COLLATE NOCASE")
        .get(email.trim()) as unknown as
        | { id: number; nome: string; email: string; senhaHash: string | null }
        | undefined;

    if (!leitor || !leitor.senhaHash || !bcrypt.compareSync(senha, leitor.senhaHash)) {
        throw new AppError("E-mail ou senha inválidos", 401);
    }

    const token = jwt.sign(
        { id: leitor.id, nome: leitor.nome, role: "leitor" },
        JWT_SECRET,
        { expiresIn: "8h" }
    );

    return {
        token,
        conta: { id: leitor.id, nome: leitor.nome, email: leitor.email, role: "leitor" },
    };
}