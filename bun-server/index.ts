import api from "./api";
import { insertPost, lastPostQuery } from "./db";

const me = await api.posts(0, 1, 1);
if (!me.err) {
  console.log(me.res);
} else {
  console.log(me.err);
}

/* const db = new Database('./vk_fob.db')

const q = db.query(await Bun.file('./post.sql').text())

const res = q.all()

console.log(res[0]);

Bun.serve({
    async fetch(request, server) {
        const url = new URL(request.url)
        console.log({...url.searchParams.})
        return new Response()
    },
}) */
