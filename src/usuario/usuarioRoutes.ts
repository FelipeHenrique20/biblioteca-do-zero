import { Router } from "express";
import { listar, buscarPorId, criar, atualizar, remover } from "./usuarioController";
import { autenticar, apenasAdmin } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", listar);
router.get("/:id", buscarPorId);
router.post("/", autenticar, apenasAdmin, criar);
router.put("/:id", autenticar, apenasAdmin, atualizar);
router.delete("/:id", autenticar, apenasAdmin, remover);

export default router;