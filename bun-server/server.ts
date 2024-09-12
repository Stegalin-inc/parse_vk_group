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
    const posts = await api.posts(stage, pass, count);
    if (posts.err) return posts;
    posts.res.forEach((post) => db.action.insertPost.run(post));

    return { ok: "ok" };
  },
} as const;

Bun.serve({
  async fetch(request, server) {
    const url = new URL(request.url);
    const [_, dest, controller, ...paths] = url.pathname.split("/");
    const params: any = {};
    for (let [k, v] of url.searchParams.entries()) params[k] = v;
    let res = "not found",
      status = 404;
    if (dest === "api") {
      if (controller in controllers) {
        res = JSON.stringify(await controllers[controller](paths, params));
        status = 200;
      }
    } else if (dest === "vk") {
      res = Bun.file("../bun-front/docs/" + controller);
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
