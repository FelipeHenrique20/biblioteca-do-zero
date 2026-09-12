import { Router } from "express";
import { registrar, fazerLogin } from "./contaController";

const router = Router();

router.post("/registro", registrar);
router.post("/login", fazerLogin);

export default router;