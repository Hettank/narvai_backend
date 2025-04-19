import { Router } from "express";
import { create, getAll, update } from "../controllers/rojmed.controller.js";

const router = Router()

router.get("/", getAll)
router.post("/", create)
router.patch("/update", update)

export default router