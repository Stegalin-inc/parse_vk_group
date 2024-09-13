import { Database } from "bun:sqlite";

const db = new Database("../vk_fob.db", { strict: true });

// const q = db.query(await Bun.file('./post.sql').text())

export const lastPostQuery = db.query("select d from posts order by d desc limit 1");

// REPLACE INTO posts (${Object.keys(posts[0])}) VALUES ${posts.map(x => '(' + Object.values(x) + ')').join(', ')}
export const insertPost = db.prepare(`
    INSERT INTO posts (id, uid,c,l,ul,d,e,t) VALUES ($id, $uid, $c, $l, $ul, $d, $e, $t)
`);

export default {
  action: {
    insertPost,
  },
  query: {
    postsByUser: db.query("select * from posts where uid=$uid"),
    posts: db.query("select * from posts order by d desc limit $limit"),
    postsShort: db.query("select id, uid, c, l, ul, d, e, length(t) as t from posts limit $limit"),
    names: db.query("select * from users"),
    topUsers: db.query(
      "SELECT uid, count(*) as count FROM posts WHERE d BETWEEN $from AND $to GROUP BY uid ORDER BY c DESC"
    ),
  },
};
