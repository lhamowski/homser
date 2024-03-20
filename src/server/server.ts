import express from "express";
import next from "next";
import { createServer } from "http";
import { Server } from "socket.io";
import { RemoteServersManager } from "./remoteServersManager";

// ugly workaround for bug in Next.JS
// https://github.com/vercel/next.js/issues/54782
declare global {
  var remoteServersManager: RemoteServersManager;
}

const portEnv = parseInt(process.env.SERVER_PORT || "");
const port = Number.isInteger(portEnv) ? portEnv : 3000;
const dev = process.env.NODE_ENV !== "production";
const host = dev ? "localhost" : "0.0.0.0";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const httpServer = createServer(server);
  const io = new Server(httpServer);

  global.remoteServersManager = new RemoteServersManager(io);

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  httpServer.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
  });

  console.log(`(memory usage: ${process.memoryUsage().rss}) `);
});
