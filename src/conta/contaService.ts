import { db } from "../database/connection";
import { AppError } from "../errors/errors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SALT_ROUNDS = 10;

export interface Conta {
    id: number;
    nome: string;
    email: string;
    senhaHash: string;
    role: "admin" | "comum";
    createdAt: string;
}

function validarDadosRegistro(nome: string, email: string, senha: string) {
    if (!nome || typeof nome !== "string" || nome.trim().length === 0) {
        throw new AppError("O campo 'nome' é obrigatório", 400);
    }
    if (!email || typeof email !== "string" || email.trim().length === 0) {
        throw new AppError("O campo 'email' é obrigatório", 400);
    }
    if (!senha || typeof senha !== "string" || senha.length < 6) {
        throw new AppError("A senha deve ter no mínimo 6 caracteres", 400);
    }
}

export function registrarConta(nome: string, email: string, senha: string) {
    validarDadosRegistro(nome, email, senha);

    const stmtBusca = db.prepare("SELECT id FROM contas WHERE email = ?");
    const contaExistente = stmtBusca.get(email);
    if (contaExistente) {
        throw new AppError("Já existe uma conta cadastrada com esse e-mail", 409);
    }

    const senhaHash = bcrypt.hashSync(senha, SALT_ROUNDS);

    const stmt = db.prepare(
        "INSERT INTO contas (nome, email, senhaHash, role) VALUES (?, ?, ?, 'comum')"
    );
    const info = stmt.run(nome, email, senhaHash);

    return buscarContaPorId(Number(info.lastInsertRowid));
}

export function buscarContaPorId(id: number) {
    const stmt = db.prepare("SELECT id, nome, email, role, createdAt FROM contas WHERE id = ?");
    const conta = stmt.get(id);

    if (!conta) {
        throw new AppError("Conta não encontrada", 404);
    }

    return conta;
}

export function buscarContaPorEmail(email: string) {
    const stmt = db.prepare("SELECT * FROM contas WHERE email = ?");
    return stmt.get(email) as unknown as Conta | undefined;
}

const JWT_SECRET = process.env.JWT_SECRET as string;

export function login(email: string, senha: string) {
    if (!email || !senha) {
        throw new AppError("E-mail e senha são obrigatórios", 400);
    }

    const conta = buscarContaPorEmail(email);

    if (!conta) {
        throw new AppError("E-mail ou senha inválidos", 401);
    }

    const senhaCorreta = bcrypt.compareSync(senha, conta.senhaHash);

    if (!senhaCorreta) {
        throw new AppError("E-mail ou senha inválidos", 401);
    }

    const token = jwt.sign(
        { id: conta.id, nome: conta.nome, role: conta.role },
        JWT_SECRET,
        { expiresIn: "8h" }
    );

    return {
        token,
        conta: { id: conta.id, nome: conta.nome, email: conta.email, role: conta.role },
    };
}

export function listarContas() {
    const stmt = db.prepare("SELECT id, nome, email, role, createdAt FROM contas ORDER BY nome");
    return stmt.all();
}

export function promoverConta(id: number) {
    buscarContaPorId(id);

    const stmt = db.prepare("UPDATE contas SET role = 'admin' WHERE id = ?");
    stmt.run(id);

    return buscarContaPorId(id);
}

export function rebaixarConta(id: number) {
    buscarContaPorId(id);

    const stmt = db.prepare("UPDATE contas SET role = 'comum' WHERE id = ?");
    stmt.run(id);

    return buscarContaPorId(id);
}