import { Router } from "express";
import { listar, criar, remover } from "./categoriaController";
import { autenticar, apenasAdmin } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", listar);
router.post("/", autenticar, apenasAdmin, criar);
router.delete("/:id", autenticar, apenasAdmin, remover);

export default router;