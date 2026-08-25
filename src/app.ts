import express from "express";
import cors from "cors";
import health from "./routes/health.ts";
import auth from "./routes/auth.ts";
import me from "./routes/me.ts";
import chat from "./routes/chat.ts";
import ask from "./routes/ask.ts";

export const app = express();

app.use(cors());
app.use(express.json());

app.use(health);
app.use("/auth", auth);
app.use(me);
app.use(chat);
app.use(ask);
