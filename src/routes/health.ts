import { Router } from "express";

const router = Router();

router.get("/health", (_req, res) => res.json({ ok: true, shipped: "v3" }));

export default router;
