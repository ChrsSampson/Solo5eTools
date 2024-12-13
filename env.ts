type EnvConfig = {
    port: string;
    mode: "dev" | "prod";
    host: string;
};

const fallback: EnvConfig = {
    port: "8000",
    mode: "dev",
    host: "0.0.0.0",
};

function getEnv(): EnvConfig {
    try {
        const p = Deno.env.get("PORT") || "8000";
        const mode = Deno.env.get("MODE") || "dev";

        const c: EnvConfig = {
            port: p,
            mode: mode,
            host: String(Deno.env.get("HOST")),
        };

        return c;
    } catch (err: any) {
        console.log("Error Getting env config, returning fallback config. \n", String(err));
        return fallback;
    }
}

export default getEnv;
