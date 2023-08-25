# получить токен
# https://oauth.vk.com/authorize?client_id=1&display=page&redirect_uri=http://vk.com/callback&scope=friends,wall&response_type=token&v=5.131&state=123456
import sqlite3
from urllib import request, parse
import json
import time
import sys
token_url = "https://api.vk.com/blank.html#access_token=vk1.a.4xiHzMGViqoXqM2ik3Ut_XTtdrNrc23fK9erHtNEyqUpcRZwXv22U61jYwdd_yg37lQy75WFM_1dZUB_8Oe3ShniR7Ch2rxByG9B9lXR--tFTLAnV5sIVRT4wYe_oljhHnv9EO7vyG183p1okcPDsuJAs1dxfFh5UVpYmZ3ZPM1ktHMCGhVnIgI3WzMREYJ-&expires_in=86400&user_id=552926829&state=123456"
con = sqlite3.connect("vk_fob.db")
def getToken():
    start = token_url.find('access_token=')+len('access_token=')
    end = token_url.find('&expires_in')
    return token_url[start:end]
access_token = 'vk1.a.1UHiyidgSN3L-TVilvlSwSWQzEA7Xnc7876786987789nagqSLKJfYzZBwc1sjowiIsUZZyuZGH7BNGKAIgKrG8AMx0OX-ZJBXMqKF0b5sRbZrl8xqp56GPQ'#getToken()

group_id = -100407134

def formatResponse(data):
    data['c'] = [x['count'] for x in data['c']]
    data['ul'] = [x['user_likes'] for x in data['l']]
    data['l'] = [x['count'] for x in data['l']]
    return data

def vkApi(method, data):
    url = 'https://api.vk.com/method/'+method
    data['v'] = 5.131
    data['access_token'] = access_token

    data = parse.urlencode(data).encode()
    req = request.Request(url, method='POST', data=data)
    with request.urlopen(req) as res:
        #print(res.read().decode('utf-8'))
        return json.loads(res.read().decode('utf-8'))['response']

def fetchPosts(stage = 0, passes=25, cnt=100):
    executeUrl='https://api.vk.com/method/execute'
    code = '''
      var stage=%d;
      var pass = %d;
      var cnt = %d;
      var result=[];
      var r={"c":[],"l":[],"uid":[],"d":[],"e":[],"id":[],"t":[]};
      var i=0;
      while(i<pass){
        var a=API.wall.get({"owner_id":-100407134,"offset":stage*pass*cnt+i*cnt,"count":cnt});
        r.c=r.c+a.items@.comments;
        r.l=r.l+a.items@.likes;
        r.uid=r.uid+a.items@.from_id;

        r.d=r.d+a.items@.date;
        r.e=r.e+a.items@.edited;
        r.id=r.id+a.items@.id;
        r.t=r.t+a.items@.text;
        i=i+1;
      }
      return r;
    ''' % (stage, passes, cnt)
    data = {'code': code, 'access_token': access_token, 'v':5.131}
    data = parse.urlencode(data).encode()
    req = request.Request(executeUrl, method='POST', data=data)
    
    with request.urlopen(req) as res:
        return formatResponse(json.loads(res.read().decode('utf-8'))['response'])

def fetchUsers(ids):
    user_ids = ','.join([str(i) for i in ids])
    res = vkApi('users.get', {'user_ids': user_ids, 'fields': 'sex'})
    return res

def fetchLikes(ids):
    code = '''
        var pids=%s;
        var r=[];
        var i=0;
        while(i<pids.length){
            var a=API.wall.getLikes({"owner_id":-100407134,"post_id":pids[i]});
            var j=0;
            while(j<a.count){
                r.push({"pid":pids[i],"uid":a.users[j].uid});
                j=j+1;
            }
            i=i+1;
        }
        return r;
    ''' % (str(ids))
    res = vkApi('execute', {'code':code})
    return res
#fetched = fetchPosts(3)
#print(fetched)

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

sql_user_by_posts = 'SELECT uid, count(uid) from posts GROUP by uid order by count(uid) DESC'
sql_user_by_posts_with_names = 'select count(uid) as cnt, uid, first_name, last_name from posts left join (select DISTINCT * from users) as u on posts.uid = u.id  group by uid order by count(uid) desc'
sql_get_unloaded_users = 'select distinct uid from posts where uid not in (SELECT id from users)'
sql_get_unloaded_users_likes = 'select distinct uid from likes where uid not in (SELECT id from users)'
sql_post_without_loaded_user_limit = 'select id from posts where uid not in ( select id from users) limit 25'
sql_post_without_loaded_likes_limit = 'select id from posts where id not in ( select pid from likes) and l > 0 order by d desc limit 25'
sql_find_oldov = "select count(uid), datetime(max(d), 'unixepoch'), max(d), uid, first_name, last_name from posts left join (select DISTINCT * from users) as u on posts.uid = u.id  group by uid order by max(d) desc"
sql_group_by_day = "SELECT count(d), d / (60*60*24), datetime(d, 'unixepoch') from posts GROUP by d / (60*60*24) order by count(d) DESC"
sql_max_interrupt = "select datetime(d, 'unixepoch'), datetime(lead(d) over (order by d desc), 'unixepoch'),d- lead(d) over (order by d desc) as dif from posts order by dif DESC"
sql_samolaik='select * from posts join likes on posts.id=pid join users on posts.uid=users.id where posts.uid=likes.uid'
sql_lovers='SELECT *, count(uid) from likes join users on uid=id group by id order by count(uid) desc'
sql_who_whom_love='''
select 	fu, 
		tu, 
		(select first_name||' '||last_name from users where id=fu),
		(select first_name||' '||last_name from users where id=tu), 
		count(tu)
from 
	(select likes.uid as fu, posts.uid as tu from likes join posts on posts.id=likes.pid) 
	group by fu, tu 
	order by count(tu) desc'''
def createTables():
    c = con.cursor()
    c.execute(createSql)
    c.execute(createUsers)
    c.execute(createLikes)
    con.commit()

def prepareToSql(data):
    result = []
    i=0
    while i < len(data['id']):
        item = (data['id'][i], data['uid'][i], data['c'][i], data['l'][i], data['ul'][i], data['d'][i], data['e'][i], data['t'][i])
        result.append(item)
        i=i+1
    return result

def writeToDb(data):
    c = con.cursor()
    c.executescript
    c.executemany('REPLACE INTO posts VALUES(?, ?, ?, ?, ?, ?, ?, ?)', prepareToSql(data))
    con.commit()

def writeDataToTable(data, table, model):
    def prepareSqlData(data):
        result = []
        for i in data:
            record = []
            for field in model:
              record.append(i[field])
            result.append(tuple(record))

        return result
    c = con.cursor()
    c.executemany(f'REPLACE INTO {table} VALUES({",".join(["?"]*len(model))})', prepareSqlData(data))
    con.commit()

def writeUsers(data):
    def prepareUsersToSql(users):
        return [(x['id'],x['first_name'],x['last_name'],x['sex']) for x in data]
    c = con.cursor()
    c.executemany('REPLACE INTO users VALUES(?, ?, ?, ?)', prepareUsersToSql(data))
    con.commit()

def getUsers():
    c = con.cursor()
    users = c.execute(sql_user_by_posts).fetchall()
    c.close()
    return [x[0] for x in users]

def getUnloadedUsers():
    c = con.cursor()
    users = c.execute(sql_get_unloaded_users_likes).fetchall()
    c.close()
    return [x[0] for x in users]

def getUnloadedLikes():
    c = con.cursor()
    likes = c.execute(sql_post_without_loaded_likes_limit).fetchall()
    c.close()
    return [x[0] for x in likes]

createTables()
def loadAllUnloadedUsers():
  users = getUnloadedUsers()
  if len(users)==0: return
  fetched = fetchUsers(users[:1000])
  writeUsers(fetched)
loadAllUnloadedUsers()
def loadPosts():
  for i in range(40, 46):
      print(i)
      fetched = fetchPosts(i)
      writeToDb(fetched)
      time.sleep(15)

def loadLikes():
    ids=getUnloadedLikes()
    data=fetchLikes(ids)
    writeDataToTable(data, 'likes', model_likes)


#for i in range(1000):
#    print(i)
#    sys.stdout.flush()
#    loadLikes()
#    time.sleep(3)

con.close()

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
