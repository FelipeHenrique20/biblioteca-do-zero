import { Router } from "express";
import { registrar, fazerLogin, listar, promover, rebaixar } from "./contaController";
import { apenasAdmin, autenticar } from "../middlewares/authMiddleware";

const router = Router();

router.post("/registro", registrar);
router.post("/login", fazerLogin);

router.get("/", autenticar, apenasAdmin, listar);
router.patch("/:id/promover", autenticar, apenasAdmin, promover);
router.patch("/:id/rebaixar", autenticar, apenasAdmin, rebaixar);

export default router;