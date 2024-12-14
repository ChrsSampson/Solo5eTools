import { Hono } from "hono";
import { prettyJSON } from "hono/pretty-json";
import api from "./api.ts";
import { serveStatic } from "hono/deno";
import getEnv from "./env.ts";

const app = new Hono();
app.use(prettyJSON());

const env = getEnv();

// logger - only in dev mode;
if (env.mode == "dev") {
    console.log("Megan is spying...");

    app.use("*", async (c, next) => {
        try {
            console.log(
                `Request:${c.req.method}:`,
                c.req.path + "?" + JSON.stringify({ ...c.req.query() })
            );

            const params = c.req.param();

            if (Object.keys(params).length > 1) {
                console.log("URL Params", params);
            }

            if (c.req.header("content-type") == "application/json") {
                console.log(`Incoming Body:`, await c.req.json());
            }

            return next();
        } catch (err) {
            console.log("Megan does not understand...", err);

            return next();
        }
    });
}

// ----------------Serve Static Files------------------------
// setup static files
const staticPath = Deno.cwd();
// static path works on linux - windows wants "./" - fucking stupid
app.get("/static/*", serveStatic({ root: "./" }));

// server the html page
app.get("/", serveStatic({ path: "./static/html/index.html" }));

// serve the favicon - redirec /favicon.ico -> /static/img/favicon.ico
app.get("/favicon.ico", serveStatic({ path: "./static/img/favicon.ico" }));

// ---------------Register external router handlers----------------------

app.route("/", api);

// catch all 404
app.use("*", (c) => {
    c.status(404);
    c.header("Content-Type", "text/plain");
    return c.text("404 Not Found");
});

try {
    Deno.serve({ port: env.port, hostname: "0.0.0.0" }, app.fetch);
} catch (err) {
    console.log("Startup Error:", err);
}

export { app };
