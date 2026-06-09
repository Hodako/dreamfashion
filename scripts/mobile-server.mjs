import { createServer } from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const port = Number(process.env.PORT ?? 28473);
const host = process.env.HOST ?? "127.0.0.1";

// Load env for MongoDB etc.
const envPath = join(root, ".env");
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

process.env.NODE_ENV ??= "production";

const { default: handler } = await import(
  pathToFileURL(join(root, "dist/server/server.js")).href,
);

function toBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(chunks.length ? Buffer.concat(chunks) : undefined));
    req.on("error", reject);
  });
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? "/", `http://${req.headers.host ?? `${host}:${port}`}`);
    const headers = new Headers();
    for (const [k, v] of Object.entries(req.headers)) {
      if (v == null) continue;
      if (Array.isArray(v)) v.forEach((item) => headers.append(k, item));
      else headers.set(k, v);
    }

    const init = { method: req.method ?? "GET", headers };
    if (req.method && !["GET", "HEAD"].includes(req.method)) {
      init.body = await toBody(req);
    }

    const response = await handler.fetch(new Request(url, init));
    res.statusCode = response.status;
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() === "transfer-encoding") return;
      res.setHeader(key, value);
    });
    const buf = Buffer.from(await response.arrayBuffer());
    res.end(buf);
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.setHeader("content-type", "text/plain; charset=utf-8");
    res.end("Internal Server Error");
  }
});

server.listen(port, host, () => {
  console.log(`DreamFashion server listening on http://${host}:${port}`);
});
