CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY,
  uid INTEGER,
  c INTEGER,
  l INTEGER,
  ul INTEGER,
  d INTEGER,
  e INTEGER,
  t TEXT
);

CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY,
  uid INTEGER,
  pid INTEGER,
  l INTEGER,
  d INTEGER,
  t TEXT
);

CREATE TABLE IF NOT EXISTS likes (
  pid INTEGER,
  uid INTEGER
);

CREATE TABLE IF NOT EXISTS users (
	"id"	INTEGER,
	"first_name"	TEXT,
	"last_name"	TEXT,
	"sex"	int,
	PRIMARY KEY("id","first_name","last_name","sex")
)

CREATE VIEW IF NOT EXISTS likes_extended AS
SELECT likes.pid,
	from_user.id as from_uid,
	from_user.first_name||' '||from_user.last_name as from_name,
	from_user.sex as from_sex,
	to_user.id as to_uid,
	to_user.first_name||' '||to_user.last_name as to_name,
	to_user.sex as to_sex
FROM likes JOIN posts ON likes.pid = posts.id
JOIN users as from_user ON likes.uid = from_user.id
JOIN users as to_user ON posts.uid = to_user.id
;