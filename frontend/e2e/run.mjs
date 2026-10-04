import { chromium } from "@playwright/test";
import { createServer } from "vite";
import mongoose from "../../backend/node_modules/mongoose/index.js";
import bcrypt from "../../backend/node_modules/bcryptjs/index.js";
import { MongoMemoryReplSet } from "../../backend/node_modules/mongodb-memory-server/index.js";
import { createApp } from "../../backend/src/app.js";
import { User, Scheduler } from "../../backend/src/models.js";
import { runWorkflow } from "./workflow.js";
import fs from "node:fs/promises";
process.env.JWT_SECRET = "browser-test-secret-32-characters-minimum";
process.env.CLIENT_ORIGIN = "http://127.0.0.1:5173";
process.env.UPLOAD_DIR = "/tmp/movemate-browser-test-uploads";
process.env.VITE_API_URL = "http://127.0.0.1:5050/api";
let db, api, vite, browser;
try {
  console.log("Starting isolated MongoDB…");
  db = await MongoMemoryReplSet.create({
    replSet: {
      count: 1,
      args: [
        "--nounixsocket",
        "--setParameter",
        "diagnosticDataCollectionEnabled=false",
      ],
    },
  });
  await mongoose.connect(db.getUri());
  await Scheduler.create({ _id: "global" });
  await User.create({
    name: "Test Admin",
    email: "admin@example.com",
    passwordHash: await bcrypt.hash("BrowserTestPassword123!", 4),
    role: "admin",
    approval: "approved",
  });
  api = await new Promise((resolve) => {
    const s = createApp().listen(5050, "127.0.0.1", () => resolve(s));
  });
  vite = await createServer({
    server: { host: "127.0.0.1", port: 5173, strictPort: true },
  });
  await vite.listen();
  browser = await chromium.launch({ headless: true, ...(process.env.PLAYWRIGHT_EXECUTABLE_PATH ? {executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH} : {}), args: ["--no-sandbox"] });
  // BaseURL on each browser.newPage is supplied by overriding creation for this standalone test.
  const newPage = browser.newPage.bind(browser);
  browser.newPage = (options = {}) =>
    newPage({ baseURL: "http://127.0.0.1:5173", ...options });
  await fs.mkdir("test-results", { recursive: true });
  console.log("Testing connected browser workflow…");
  await runWorkflow(browser);
  console.log("PASS: customer/coordinator/admin browser workflow");
} catch (error) {
  console.error(error);
  if (browser) {
    let i = 0;
    for (const c of browser.contexts())
      for (const p of c.pages()) {
        console.log("Failed page:", p.url());
        await p
          .screenshot({
            path: `test-results/failure-${i++}.png`,
            fullPage: true,
          })
          .catch(() => {});
      }
  }
  process.exitCode = 1;
} finally {
  await browser?.close();
  await vite?.close();
  if (api) await new Promise((r) => api.close(r));
  await mongoose.disconnect();
  await db?.stop();
}
