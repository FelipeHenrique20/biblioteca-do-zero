import { Router } from "express";
import { listar, listarAtivos, criar, buscarPorId ,devolver } from "./emprestimoController";
import { autenticar, apenasAdmin } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", listar);
router.get("/ativos", listarAtivos);
router.get("/:id", buscarPorId);
router.post("/", autenticar, apenasAdmin, criar);
router.patch("/:id/devolver", autenticar, apenasAdmin, devolver);

export default router;
