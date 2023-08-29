
createSql = '''
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
'''

createComments = '''
CREATE TABLE IF NOT EXISTS comments (
id INTEGER PRIMARY KEY,
uid INTEGER,
pid INTEGER,
l INTEGER,
d INTEGER,
t TEXT
);
'''

createLikes = '''
CREATE TABLE IF NOT EXISTS likes (
pid INTEGER,
uid INTEGER
);
'''
model_likes = ('pid', 'uid')

createUsers = '''
CREATE TABLE IF NOT EXISTS users (
id INTEGER,
first_name TEXT,
last_name TEXT,
sex int
);
'''
model_user = ('id', 'first_name', 'last_name', 'sex')

user_by_posts = 'SELECT uid, count(uid) from posts GROUP by uid order by count(uid) DESC'
user_by_posts_with_names = 'select count(uid) as cnt, uid, first_name, last_name from posts left join (select DISTINCT * from users) as u on posts.uid = u.id  group by uid order by count(uid) desc'
get_unloaded_users = 'select distinct uid from posts where uid not in (SELECT id from users)'
get_unloaded_users_likes = 'select distinct uid from likes where uid not in (SELECT id from users)'
post_without_loaded_user_limit = 'select id from posts where uid not in ( select id from users) limit 25'
post_without_loaded_likes_limit = 'select id from posts where id not in ( select pid from likes) and l > 0 order by d desc limit 25'
find_oldov = "select count(uid), datetime(max(d), 'unixepoch'), max(d), uid, first_name, last_name from posts left join (select DISTINCT * from users) as u on posts.uid = u.id  group by uid order by max(d) desc"
group_by_day = "SELECT date(d, 'unixepoch'), count(d), d / (60*60*24) from posts GROUP by d / (60*60*24)"
max_interrupt = "select datetime(d, 'unixepoch'), datetime(lead(d) over (order by d desc), 'unixepoch'),d- lead(d) over (order by d desc) as dif from posts order by dif DESC"
samolaik='select * from posts join likes on posts.id=pid join users on posts.uid=users.id where posts.uid=likes.uid'
lovers='SELECT *, count(uid) from likes join users on uid=id group by id order by count(uid) desc'
who_whom_love='''
select 	fu, 
		tu, 
		(select first_name||' '||last_name from users where id=fu),
		(select first_name||' '||last_name from users where id=tu), 
		count(tu)
from 
	(select likes.uid as fu, posts.uid as tu from likes join posts on posts.id=likes.pid) 
	group by fu, tu 
	order by count(tu) desc'''

sql_who_whom_most_love_oxuet = '''
SELECT  total_fu,
		(select first_name||' '||last_name from users where id=fu),
		cnt_tu,
		(select first_name||' '||last_name from users where id=tu),
		total_tu,
		cnt_tu*1.0 / total_fu as perc
FROM (
(
    SELECT likes.uid AS fu, posts.uid AS tu, count(posts.uid) as cnt_tu
    FROM likes JOIN posts ON likes.pid=posts.id
	GROUP BY fu, tu
) as ft
JOIN
(
    SELECT SUM(l) AS total_tu, uid as total_tuid
    FROM posts
    GROUP BY uid
) as tt
ON ft.tu=tt.total_tuid
JOIN
(
    SELECT count(uid) as total_fu, uid as total_fuid
    FROM LIKES
    GROUP BY uid
) as tf
ON ft.fu=tf.total_fuid
)
ORDER BY perc DESC
'''

sql_who_likes_tyanok = '''
SELECT fname, fs, ts, tname, count(case ts when 2 then 1 else null end) as m, count(case ts when 1 then 1 else null end) as w
FROM 
	likes JOIN posts ON likes.pid=posts.id
	JOIN (select id as fuid, first_name||' '||last_name as fname, sex as fs from users) as fu ON likes.uid=fuid
	JOIN (select id as tuid, first_name||' '||last_name as tname, sex as ts from users) as fu ON posts.uid=tuid
GROUP BY fname
ORDER BY w*1.0/m DESC
'''

sql_hate_love_sex = '''
SELECT fname, count(case ts when 2 then 1 else null end) as m, count(case ts when 1 then 1 else null end) as w, fs, ts, tname
FROM 
	likes JOIN posts ON likes.pid=posts.id
	JOIN (select id as fuid, first_name||' '||last_name as fname, sex as fs from users) as fu ON likes.uid=fuid
	JOIN (select id as tuid, first_name||' '||last_name as tname, sex as ts from users) as fu ON posts.uid=tuid
GROUP BY fname
HAVING w>80 or m> 80
ORDER BY m-w DESC'''

sql_who_jmot = '''
SELECT * FROM 
(SELECT uid as wuid, count(uid) as wp
FROM posts
GROUP BY uid
ORDER BY count(uid) DESC) AS cp
JOIN 
(SELECT *, count(uid) as lgive from likes join users on uid=id group by id order by count(uid) desc) as lg
ON cp.wuid = lg.uid
ORDER BY lgive*1.0-wp'''

print('print in toplevel "sqls.py"')