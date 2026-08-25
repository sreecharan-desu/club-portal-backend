import { Router } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { env } from "../config.ts";
import prisma from "../db.ts";
import { sendMail } from "../mail.ts";

const router = Router();

router.post("/login", async (req, res) => {
  try {
    const email = String(req.body.email ?? "").trim().toLowerCase();
    const password = String(req.body.password ?? "");

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "invalid credentials" });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ error: "invalid credentials" });
    if (!user.isVerified) return res.status(403).json({ error: "email not verified" });

    const token = jwt.sign({ sub: user.id, email: user.email }, env.jwtSecret, { expiresIn: "7d" });

    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "login failed" });
  }
});

router.post("/register", async (req, res) => {
  try {
    const email = String(req.body.email ?? "").trim().toLowerCase();
    const password = String(req.body.password ?? "");
    const name = String(req.body.name ?? "").trim();

    if (!email || password.length < 8) {
      return res.status(400).json({ error: "email and password (min 8) required" });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: "email already registered" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, passwordHash, name: name || null },
    });

    const token = crypto.randomBytes(32).toString("hex");
    await prisma.emailToken.create({
      data: {
        token,
        purpose: "verify",
        expiresAt: new Date(Date.now() + 864e5),
        userId: user.id,
      },
    });

    await sendMail({
      to: email,
      subject: "Verify your account",
      text: `${env.appUrl}/auth/verify?token=${token}`,
    });

    res.status(201).json({
      user: { id: user.id, email: user.email, name: user.name, isVerified: user.isVerified },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "register failed" });
  }
});

router.get("/verify", async (req, res) => {
  try {
    const token = String(req.query.token ?? "");
    const row = await prisma.emailToken.findUnique({ where: { token } });

    if (!row || row.purpose !== "verify" || row.usedAt) {
      return res.status(400).json({ error: "invalid token" });
    }
    if (row.expiresAt < new Date()) {
      return res.status(400).json({ error: "token expired" });
    }

    await prisma.user.update({
      where: { id: row.userId },
      data: { isVerified: true },
    });
    await prisma.emailToken.update({
      where: { token },
      data: { usedAt: new Date() },
    });

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "verify failed" });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const email = String(req.body.email ?? "").trim().toLowerCase();
    const generic = { message: "if the account exists, a reset link was sent" };
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.json(generic);

    const token = crypto.randomBytes(32).toString("hex");
    await prisma.emailToken.create({
      data: {
        token,
        purpose: "reset",
        expiresAt: new Date(Date.now() + 18e5),
        userId: user.id,
      },
    });
    await sendMail({
      to: email,
      subject: "Reset password",
      text: `${env.appUrl}/reset-password?token=${token}`,
    });
    res.json(generic);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "forgot password failed" });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const token = String(req.body.token ?? "");
    const password = String(req.body.password ?? "");
    if (!token || password.length < 8) {
      return res.status(400).json({ error: "token and password required" });
    }

    const row = await prisma.emailToken.findUnique({ where: { token } });
    if (!row || row.purpose !== "reset" || row.usedAt) {
      return res.status(400).json({ error: "invalid token" });
    }
    if (row.expiresAt < new Date()) {
      return res.status(400).json({ error: "token expired" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.update({ where: { id: row.userId }, data: { passwordHash } });
    await prisma.emailToken.update({ where: { token }, data: { usedAt: new Date() } });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "reset failed" });
  }
});

export default router;
