import net from "node:net";

const STARTUP_TIMEOUT_MS = Number.parseInt(process.env.DB_STARTUP_TIMEOUT_MS ?? "120000", 10);
const RETRY_INTERVAL_MS = Number.parseInt(process.env.DB_RETRY_INTERVAL_MS ?? "2000", 10);

if (!process.env.DATABASE_URL) {
  console.error("[startup] fatal: DATABASE_URL is not set");
  process.exit(1);
}

let target;

try {
  target = new URL(process.env.DATABASE_URL);
} catch (error) {
  console.error("[startup] fatal: DATABASE_URL is invalid", error);
  process.exit(1);
}

const host = target.hostname;
const port = Number.parseInt(target.port || "5432", 10);
const deadline = Date.now() + STARTUP_TIMEOUT_MS;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const canConnect = () =>
  new Promise((resolve) => {
    const socket = new net.Socket();

    socket.setTimeout(1500);

    socket.once("connect", () => {
      socket.destroy();
      resolve(true);
    });

    const onFailure = () => {
      socket.destroy();
      resolve(false);
    };

    socket.once("timeout", onFailure);
    socket.once("error", onFailure);
    socket.connect(port, host);
  });

while (Date.now() < deadline) {
  if (await canConnect()) {
    process.exit(0);
  }

  console.log(`[startup] database not reachable yet at ${host}:${port}; retrying in ${RETRY_INTERVAL_MS}ms`);
  await wait(RETRY_INTERVAL_MS);
}

console.error(`[startup] fatal: database did not become reachable at ${host}:${port} within ${STARTUP_TIMEOUT_MS}ms`);
process.exit(1);
