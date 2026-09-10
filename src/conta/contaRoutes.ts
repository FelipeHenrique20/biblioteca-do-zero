import { Router } from "express";
import { registrar } from "./contaController";

const router = Router();

router.post("/registro", registrar);

export default router;