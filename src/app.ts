import express from "express";
import cors from "cors";
import { initDatabase } from "./database/connection";
import routes from "./routes";

const app = express();

app.use(cors());
app.use(express.json());

// Inicializa o banco de dados
initDatabase();

app.get("/", (req, res) => {
    res.json({ mensagem: "API da Biblioteca funcionando!" });
})

app.use(routes);

export default app;