import { Router } from "express";
import { requireAuth } from "../middleware/auth.ts";

const router = Router();

router.post("/ask", requireAuth, async (req, res) => {
  const question = String(req.body.question ?? "").trim();
  if (!question) return res.status(400).json({ error: "question required" });
  res.json({ answer: "RAG not wired yet.", sources: [] });
});

export default router;
