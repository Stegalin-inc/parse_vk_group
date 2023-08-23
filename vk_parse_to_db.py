# получить токен
# https://oauth.vk.com/authorize?client_id=1&display=page&redirect_uri=http://vk.com/callback&scope=friends,wall&response_type=token&v=5.131&state=123456
import sqlite3
from urllib import request, parse
import json
import time
token_url = "https://api.vk.com/blank.html#access_token=vk1.a.4xiавпрывапiR7Ch2rxByG9B9lXR--tFTLAnV5sIVRT4wYe_oljhHnv9EO7vyG183p1okcPDsuJAs1dxfFh5UVpYmZ3ZPM1ktHMCGhVnIgI3WzMREYJ-&expires_in=86400&user_id=552926829&state=123456"
con = sqlite3.connect("vk_fob.db")
def getToken():
    start = token_url.find('access_token=')+len('access_token=')
    end = token_url.find('&expires_in')
    return token_url[start:end]
access_token = getToken()

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

def fetchPosts(stage = 0):
    executeUrl='https://api.vk.com/method/execute'
    code = '''
      var stage=%d;
      var pass = 25;
      var cnt = 100;
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
    ''' % (stage)
    data = {'code': code, 'access_token': access_token, 'v':5.131}
    data = parse.urlencode(data).encode()
    req = request.Request(executeUrl, method='POST', data=data)
    
    with request.urlopen(req) as res:
        return formatResponse(json.loads(res.read().decode('utf-8'))['response'])

def fetchUsers(ids):
    user_ids = ','.join([str(i) for i in ids])
    res = vkApi('users.get', {'user_ids': user_ids, 'fields': 'sex'})
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
uid INTEGER,
);
'''

createUsers = '''
CREATE TABLE IF NOT EXISTS users (
id INTEGER,
first_name TEXT,
last_name TEXT,
sex int
);
'''

sql_user_by_posts = 'SELECT uid, count(uid) from posts GROUP by uid order by count(uid) DESC'
sql_user_by_posts_with_names = 'select count(uid) as cnt, uid, first_name, last_name from posts left join (select DISTINCT * from users) as u on posts.uid = u.id  group by uid order by count(uid) desc'
sql_get_unloaded_users = 'select uid from posts where uid not in (SELECT id from users)'
sql_find_oldov = "select count(uid), datetime(max(d), 'unixepoch'), max(d), uid, first_name, last_name from posts left join (select DISTINCT * from users) as u on posts.uid = u.id  group by uid order by max(d) desc"
def createTables():
    c = con.cursor()
    c.execute(createSql)
    c.execute(createUsers)
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
    c.executemany('REPLACE INTO posts VALUES(?, ?, ?, ?, ?, ?, ?, ?)', prepareToSql(data))
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
    users = c.execute(sql_get_unloaded_users).fetchall()
    c.close()
    return [x[0] for x in users]

createTables()
def loadAllUnloadedUsers():
  users = getUnloadedUsers()
  if len(users)==0: return
  fetched = fetchUsers(users[:500])
  writeUsers(fetched)

# for i in range(10):
#     print(i)
#     fetched = fetchPosts(i)
#     writeToDb(fetched)
#     time.sleep(15)
con.close()
