import { env } from "./config/env.js";
import { buildServer } from "./config/server.js";

const start = async () => {
  const app = await buildServer();

  try {
    await app.listen({
      host: env.HOST,
      port: env.PORT,
    });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

start();

