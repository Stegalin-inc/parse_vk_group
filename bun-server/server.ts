import api from "./api";
import db from "./db";

type Controller = (path: string[], params: Record<string, string>) => object;

const controllers: Record<string, Controller> = {
  postsbyuser: ([uid]: string[], params: Record<string, string>) =>
    db.query.postsByUser.all({ uid }),
  settoken: ([token]) => {
    Bun.env.VK_TOKEN = token;
    return { ok: "ok" };
  },
  loadpage: async ([stage, pass, count]) => {
    // @ts-ignore
    const posts = await api.posts(stage, pass, count);
    if (posts.err) return posts;
    posts.res.forEach((post) => db.action.insertPost.run(post));

    return { ok: "ok" };
  },
  last10: () => db.query.posts.all({ limit: 10 }),
  allpostsshort: ([limit = Number.MAX_SAFE_INTEGER - 1]) => db.query.postsShort.all({ limit }),
  topusers: ([from = 0, to = Number.MAX_SAFE_INTEGER - 1]) => db.query.topUsers.all({ from, to }),
  users: () => Object.fromEntries(db.query.names.all().map((x: any) => [x.id, x])),
} as const;

Bun.serve({
  tls: {
    ca: Bun.file('./ca.pem'),
    cert: Bun.file('./cert.pem'),
    key: Bun.file('./key.pem'),
    serverName: 'stegleb.ru',
  },
  async fetch(request, server) {
    const url = new URL(request.url);
    const [_, dest, controller, ...paths] = url.pathname.split("/");
    const params: any = {};
    for (let [k, v] of url.searchParams.entries()) params[k] = v;
    let res: BodyInit = "not found";
    let status = 404;
    if (dest === "api") {
      if (controller in controllers) {
        res = JSON.stringify(await controllers[controller](paths, params));
        status = 200;
      }
    } else if (dest === "vk") {
      res = Bun.file("../bun-front/docs/" + (controller || "index.html"));
      status = 200;
    }
    return new Response(res, {
      status,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  },
});
