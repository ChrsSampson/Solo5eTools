import { Hono } from "hono";
import { prettyJSON } from "hono/pretty-json";
import api from "./api.ts";
import { serveStatic } from "hono/deno";

const app = new Hono();
app.use(prettyJSON());

// logger
app.use("*", (c, next) => {
  console.log(`Request:${c.req.method}:`, c.req.path);

  return next();
});

// setup static files
const staticPath = Deno.cwd();
app.get("/static/*", serveStatic({ root: staticPath }));

// server the html page
app.get("/", serveStatic({ path: "./static/html/index.html" }));

// serve the favicon - redirec /favicon.ico -> /static/img/favicon.ico
app.get("/favicon.ico", serveStatic({ path: "./static/img/favicon.ico" }));

app.route("/", api);

// catch all 404
app.use("*", (c) => {
  c.status(404);
  c.header("Content-Type", "text/plain");
  return c.text("404 Not Found");
});

Deno.serve(app.fetch);

export { app };
