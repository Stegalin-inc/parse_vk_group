# получить токен
# https://oauth.vk.com/authorize?client_id=1&display=page&redirect_uri=http://vk.com/callback&scope=friends&response_type=token&v=5.131&state=123456
import sqlite3
from urllib import request, parse
import json
token_url = '__TOKEN_URL__'
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

def fetchPosts(stage = 0):
    executeUrl='https://api.vk.com/method/execute'
    code = '''
      var stage=%d;
      var result=[];
      var r={"c":[],"l":[],"uid":[],"d":[],"e":[],"id":[],"t":[]};
      var i=0;
      while(i<2){
        var a=API.wall.get({"owner_id":-100407134,"offset":stage*2500+i*100,"count":10});
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

fetched = fetchPosts(3)
print(fetched)

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
)
'''

def createTables():
    c = con.cursor()
    c.execute(createSql)
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

createTables()
writeToDb(fetched)
con.close()
