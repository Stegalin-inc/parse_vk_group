import { Database } from "bun:sqlite";

const db = new Database("./vk_fob.db", { strict: true });

// const q = db.query(await Bun.file('./post.sql').text())

export const lastPostQuery = db.query("select d from posts order by d desc limit 1");

// REPLACE INTO posts (${Object.keys(posts[0])}) VALUES ${posts.map(x => '(' + Object.values(x) + ')').join(', ')}
export const insertPost = db.prepare(`
    INSERT INTO posts (id, uid,c,l,ul,d,e,t) VALUES ($id, $uid, $c, $l, $ul, $d, $e, $t)
`);
