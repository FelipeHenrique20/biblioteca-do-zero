import { Router } from "express";
import { listar, buscarPorId, criar, atualizar, remover } from "./autorController";

// Mini app do Express
const router = Router();

// Rotas
router.get("/", listar);
router.get("/:id", buscarPorId);
router.post("/", criar);
router.put("/:id", atualizar);
router.delete("/:id", remover);

// Exporta a rota para ser usada no app principal
export default router;