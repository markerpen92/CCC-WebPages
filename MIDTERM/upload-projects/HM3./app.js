import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import * as render from './render.js';
import { DB } from "https://deno.land/x/sqlite/mod.ts";

const db = new DB("blog.db");

db.query(`
  CREATE TABLE IF NOT EXISTS markdb (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    body TEXT,
    user TEXT
  )
`);

const users = ['Mark', 'Markerpen'];
for (const user of users) {
  console.log(user);
  db.query("INSERT OR IGNORE INTO markdb (title, body, user) VALUES (?, ?, ?)", [user, `${user}'s body content`, user]);
}

const router = new Router();

router.get ('/'              , list     )
      .get ('/:user/'        , list_titles)
      .get ('/:user/post/new', add      )
      .get ('/:user/post/:id', show     )
      .post('/:user/post'    , create   );

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

function query(sql, params = []) {
  let list = [];
  console.log(db.query("SELECT count(id) FROM markdb"));
  
  for (const row of db.query(sql, params))
  {
    const keys = sql.match(/SELECT\s+(.*?)\s+FROM/i)?.[1]?.split(',').map(k => k.trim()) || [];
    let obj = {};
    keys.forEach((key, index) => {
      obj[key] = row[index];
    });
    list.push(obj);
  }

  return list;
}

async function list(ctx) 
{
    let posts = query("SELECT user FROM markdb");
    const seen = new Set();
    const uniqueList = posts.filter(item => {
      if (seen.has(item.user)) {
        return false;
      }
      seen.add(item.user);
      return true;
    });
    ctx.response.body = await render.list(uniqueList);
}

async function list_titles(ctx) 
{
  const user = ctx.params.user;
  let posts = query("SELECT id, title, body, user FROM markdb WHERE user = ?", [user]);
  // console.log('list:posts=', posts);
  ctx.response.body = await render.list_titles(user , posts);
}

async function add(ctx) {
  const user = ctx.params.user;
  ctx.response.body = await render.newPost(user);
}

async function show(ctx) {
  const user = ctx.params.user;
  const pid = ctx.params.id;
  // console.log(user , pid)
  let posts = query("SELECT id, title, body FROM markdb WHERE id = ? AND user = ?", [pid, user]);
  let post = posts[0];
  // console.log('show:post=', post);
  if (!post) ctx.throw(404, 'invalid post id');
  ctx.response.body = await render.show(user , post);
}

async function create(ctx) {
  const user = ctx.params.user;
  const body = ctx.request.body;
  if (body.type() === "form") {
    const pairs = await body.form();
    const post = {};
    for (const [key, value] of pairs) {
      post[key] = value;
    }
    // console.log('create:markdb=', post);
    db.query("INSERT INTO markdb (title, body, user) VALUES (?, ?, ?)", [post.title, post.body, user]);
    ctx.response.redirect(`/${user}/`);
  }
}

let port = parseInt(Deno.args[0]) || 8000;
console.log(`Server run at http://127.0.0.1:${port}`);
await app.listen({ port });