// Erro que carrega o status HTTP correto junto com a mensagem

export class AppError extends Error {
    public statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.name = "AppError";
    }
}