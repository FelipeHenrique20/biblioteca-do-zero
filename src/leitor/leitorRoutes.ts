import { Router } from "express";
import { registrar, fazerLogin } from "./leitorController";

const router = Router();

router.post("/registro", registrar);
router.post("/login", fazerLogin);

export default router;