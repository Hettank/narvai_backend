import { Router } from "express";
import authRoutes from "./auth.routes.js"
import rojmedRoutes from "./rojmed.routes.js"

const router = Router()

router.use("/auth", authRoutes)
router.use("/rojmed", rojmedRoutes)

export default router