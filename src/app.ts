import express from "express";
import cors from "cors";
import { initDatabase } from "./database/connection";
import routes from "./routes";

const app = express();

app.use(cors({
    origin: "http://localhost:5173"
}));
app.use(express.json());

initDatabase();

app.get("/", (req, res) => {
    res.json({ mensagem: "API da Biblioteca funcionando!" });
})

app.use(routes);

export default app;