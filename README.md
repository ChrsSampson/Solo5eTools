Solo 5E tools

Tools, Tables, and generators for solo adventuring. All data is static and preloaded onto the server. Currently I have no plans to make that dynamic. Data updates and expandions will require a re-deploy, but as minimal as this app will be at most a couple minutes.

Architecture: Monolith
This app requires very little server side overhead, most requests are likely to just be for serving static files.

99% of requests at the time of writing this are going to be GET.

Start in Dev

```bash
Deno run -A --watch ./main.ts
```
