import { Hono } from "hono";
import { prettyJSON } from "hono/pretty-json";
import api from "./api.ts";
import { serveStatic } from "hono/deno";

const app = new Hono();
app.use(prettyJSON());

// setup static files
app.use(serveStatic({ path: "./static" }));

// server the html page
app.get("/", serveStatic({ path: "./static/html/index.html" }));

app.route("/", api);

Deno.serve(app.fetch);
