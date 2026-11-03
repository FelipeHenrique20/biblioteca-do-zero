import { Router } from "express";
import { listar, listarAtivos, criar, buscarPorId ,devolver } from "./emprestimoController";
import { autenticar, apenasAdmin, apenasFuncionario } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", autenticar, apenasFuncionario, listar);
router.get("/ativos", autenticar, apenasFuncionario, listarAtivos);
router.get("/:id", autenticar, apenasFuncionario, buscarPorId);
router.post("/", autenticar, apenasAdmin, criar);
router.patch("/:id/devolver", autenticar, apenasAdmin, devolver);

export default router;
