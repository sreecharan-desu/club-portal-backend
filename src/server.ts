import { env } from "./config.ts";
import { app } from "./app.ts";

app.listen(env.port, "0.0.0.0", () => console.log(`up on ${env.port}`));
