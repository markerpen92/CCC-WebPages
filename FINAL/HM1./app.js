import { Application } from "https://deno.land/x/oak/mod.ts";

export function run(port = 8001) {
  const app = new Application();

  app.use((ctx) => {
    console.log('url=', ctx.request.url);
    const pathname = ctx.request.url.pathname;
    if (pathname === '/') {
      ctx.response.body = `
        <html>
          <body>
            <h1>Self Introduction</h1>
            <ol>
              <li><a href="/name">NAME</a></li>
              <li><a href="/age">AGE</a></li>
              <li><a href="/gender">GENDER</a></li>
            </ol>
          </body>
        </html>`;
    } else if (pathname === '/name') {
      ctx.response.body = 'markerpen';
    } else if (pathname === '/age') {
      ctx.response.body = '20';
    } else if (pathname === '/gender') {
      ctx.response.body = 'Apache Helicopter';
    } else {
      ctx.response.body = 'Not Found!';
      ctx.response.status = 404;
    }
  });

  console.log(`Server started at: http://127.0.0.1:${port}`);
  return app.listen({ port });
}
