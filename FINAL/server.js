import { Application, Router, send } from "https://deno.land/x/oak/mod.ts";

const app = new Application();
const router = new Router();

const modules = ['HM1.', 'HM2.', 'HM3.', 'HM4.'];

const portMap = {
  'HM1.': 8001,
  'HM2.': 8002,
  'HM3.': 8003,
  'HM4.': 8004
};

let AccessAllow = {
  'HM1.':false,
  'HM2.':false,
  'HM3.':false,
  'HM4.':false
};

router.get("/", async (ctx) => {
  await send(ctx, "MainPage.html", {
    root: Deno.cwd(),
  });
});

modules.forEach((module) => {
  router.get(`/${module}`, async (ctx) => {
    try 
    {
      const modulePath = `${Deno.cwd()}/${module}/app.js`;
      const renderPath = `${Deno.cwd()}/${module}/render.js`;

      if(AccessAllow[module] == false)
      {
        console.log(`Importing app from: file://${modulePath}`);
        const moduleApp = await import(`file://${modulePath}`);
        const output = moduleApp.run();
        AccessAllow[module] = true;
      }

      ctx.response.redirect(`http://127.0.0.1:${portMap[module]}`);
      console.log("Redir");
    } 
    catch (error) 
    {
      console.error(`Error loading module ${module}:`, error);
      ctx.response.status = 500;
      ctx.response.body = `<h1>Error</h1><p>Unable to load module ${module}.</p>`;
    }
  });
});

app.use(router.routes());
app.use(router.allowedMethods());

const PORT = 8080;
console.log(`Server running on http://localhost:${PORT}`);
await app.listen({ port: PORT });
