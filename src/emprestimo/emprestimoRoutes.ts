import { Router } from "express";
import { listar, listarAtivos, listarPendentes, meus, buscarPorId, criar, solicitar, devolver, aprovar, rejeitar } from "./emprestimoController";
import { autenticar, apenasAdmin, apenasFuncionario, apenasLeitor } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", autenticar, apenasFuncionario, listar);
router.get("/ativos", autenticar, apenasFuncionario, listarAtivos);
router.get("/pendentes", autenticar, apenasFuncionario, listarPendentes);
router.get("/meus", autenticar, apenasLeitor, meus);
router.get("/:id", autenticar, apenasFuncionario, buscarPorId);

router.post("/", autenticar, apenasAdmin, criar);
router.post("/solicitar", autenticar, apenasLeitor, solicitar);

router.patch("/:id/devolver", autenticar, apenasAdmin, devolver);
router.patch("/:id/aprovar", autenticar, apenasAdmin, aprovar);
router.patch("/:id/rejeitar", autenticar, apenasAdmin, rejeitar);

export default router;
