import express from "express";
import { initDatabase } from "./database/connection";;

import routes from "./routes";

// Criar a aplicação Express
const app = express();

// // Middleware para permitir que o Express entenda JSON no corpo das requisições
app.use(express.json());

// Inicializa o banco de dados
initDatabase();

app.get("/", (req, res) => {
    res.json({ mensagem: "API da Biblioteca funcionando!" });
})

app.use(routes);

export default app;