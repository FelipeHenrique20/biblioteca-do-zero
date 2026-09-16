import { Router } from "express";
import { listar, buscarPorId, criar, atualizar, remover } from "./autorController";
import { autenticar, apenasAdmin } from "../middlewares/authMiddleware";

// Mini app do Express
const router = Router();

// Rotas
router.get("/", listar);
router.get("/:id", buscarPorId);
router.post("/", autenticar, apenasAdmin, criar);
router.put("/:id", autenticar, apenasAdmin, atualizar);
router.delete("/:id", autenticar, apenasAdmin, remover);

// Exporta a rota para ser usada no app principal
export default router;