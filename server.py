from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import sqls
from db import db
import re

def getDailyStat():
    model = ("day", "count")
    return db.readDataBySql(model, sqls.group_by_day)

def getTopUser():
    model = ("cnt", "uid", "first_name", "last_name")
    return db.readDataBySql(model, sqls.user_by_posts_with_names)

def getWordStatByUser(uid):
    texts = db.readDataBySql(('t'), f'SELECT t FROM posts where uid = {uid}')
    wordRe = re.compile('[а-яё]+', re.IGNORECASE)
    result = {}
    for t in texts:
        for w in wordRe.findall(t['t']):
            w = w.lower()
            if(w not in result): result[w] = 0
            result[w] += 1
    return sorted(result.items(), key=lambda item: item[1], reverse=True)

def getWordStatCommon():
    return dict(db.con.execute('select * from wordstat').fetchall())

allWords = getWordStatCommon()
def getUniqUsersWords(uid):
    userWords = getWordStatByUser(uid)
    result=[]
    for (word, count) in userWords:
        coeff = count/allWords[word] 
        if coeff>0.5 and coeff < 0.9:
            result.append(word)
    return result

class RequestHandler(BaseHTTPRequestHandler):
    def xuesos(self, params):
        return "{'message': hello xuesosi!}"
    
    def dailystat(self, params):
        stat = getDailyStat()
        return json.dumps(stat)
    
    def usertopposts(self, params):
        stat = getTopUser()
        return json.dumps(stat)

    def userposts(self, params):
        uid = params[0]
        model = ('id', 'c', 'l', 'd', 't')
        sql = f"SELECT id, c, l, d, t FROM posts WHERE posts.uid = {uid}"
        stat = db.readDataBySql(model, sql)
        return json.dumps(stat)

    def postsbyday(self, params):
        day = params[0]
        model = ('id', 'c', 'l', 'd', 'name', 't')
        sql = f"SELECT id, c, l, d, (SELECT first_name||' '||last_name FROM users WHERE users.id=posts.uid) as name, t FROM posts WHERE date(d, 'unixepoch')='{day}'"
        stat = db.readDataBySql(model, sql)
        return json.dumps(stat)
    
    def userlikes(self, params):
        uid = params[0]
        model = ('pid', 'from_uid', 'from_name', 'from_sex', 'to_uid', 'to_name', 'to_sex', 'cnt')
        sql = f"SELECT *, count(pid) as cnt FROM likes_extended WHERE from_uid={uid} GROUP BY to_uid ORDER BY cnt DESC"
        stat = db.readDataBySql(model, sql)
        return json.dumps(stat)

    def getUniqUsersWords(self, params):
        return json.dumps(getUniqUsersWords(params[0]))
    
    def do_GET(self):
        code = 200
        response = b'777'
        contentType = 'application/json; charset=utf-8'
        try:
            paths = self.path.split('/')[1:]
            print(paths)
            if paths[0]=='api' and getattr(self, paths[1]):
                response = getattr(self, paths[1])(paths[2:]).encode()
            elif paths[0]=='static':
                with open(f"./static/{paths[1]}", "rb") as file:
                    response = file.read()
                    contentType = 'text; charset=utf-8'
            elif paths[0] == '':
                with open("./front.html", "rb") as file:
                    response = file.read()
                    contentType = 'text/html; charset=utf-8'
        except Exception as inst:
            print(inst)
            code = 400
            response = ('{"error": "%s"}' % str(inst)).encode()
        self.send_response(code)
        self.send_header('content-type', contentType)
        self.end_headers()
        self.wfile.write(response)

def run(server_class=HTTPServer, handler_class=BaseHTTPRequestHandler):
  server_address = ('', 8888)
  httpd = HTTPServer(server_address, RequestHandler)
  try:
      httpd.serve_forever()
  except KeyboardInterrupt:
      print('Goodbye!')
      httpd.server_close()
      db.closeDb
run()