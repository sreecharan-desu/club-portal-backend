import { Router } from "express";
import { requireAuth, type AuthedRequest } from "../middleware/auth.ts";

const router = Router();

router.get("/me", requireAuth, (req: AuthedRequest, res) => {
  res.json({ user: req.user });
});

export default router;
