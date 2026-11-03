import { Router } from "express";
import { listar, buscarPorId, criar, atualizar, remover } from "./usuarioController";
import { autenticar, apenasAdmin, apenasFuncionario } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", autenticar, apenasFuncionario, listar);
router.get("/:id", autenticar, apenasFuncionario, buscarPorId);
router.post("/", autenticar, apenasAdmin, criar);
router.put("/:id", autenticar, apenasAdmin, atualizar);
router.delete("/:id", autenticar, apenasAdmin, remover);

export default router;