import { Router } from "express";
import { requireAuth } from "../middleware/auth.ts";

const router = Router();

router.post("/chat", requireAuth, async (req, res) => {
  const question = String(req.body.question ?? "").trim();
  if (!question) return res.status(400).json({ error: "question required" });

  // later: forward to the RAG service
  res.json({ answer: "RAG not wired yet.", sources: [] });
});

export default router;
