import { Router } from "express";
import { listar, listarAtivos, criar, buscarPorId ,devolver } from "./emprestimoController";

const router = Router();

router.get("/", listar);
router.get("/ativos", listarAtivos);
router.get("/:id", buscarPorId);
router.post("/", criar);
router.patch("/:id/devolver", devolver);

export default router;
