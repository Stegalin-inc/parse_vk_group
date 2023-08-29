from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import sqls
from db import db

def getDailyStat():
    model = ("day", "count")
    return db.readDataBySql(model, sqls.group_by_day)

def getTopUser():
    model = ("cnt", "uid", "first_name", "last_name")
    return db.readDataBySql(model, sqls.user_by_posts_with_names)
    

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
    def do_GET(self):
        code = 200
        response = b'777'
        contentType = 'application/json; charset=utf-8'
        try:
            paths = self.path.split('/')[1:]
            print(paths)
            if paths[0]=='api' and getattr(self, paths[1]):
                response = getattr(self, paths[1])(paths[2:]).encode()
            elif paths[0] == '':
                with open("./front.html", "rb") as file:
                    response = file.read()
                    contentType = 'text/html; charset=utf-8'
        except Exception as inst:
            print(inst)
            code = 400
            response = b'{"error": "No such method"}'
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