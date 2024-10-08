# получить токен
# https://oauth.vk.com/authorize?client_id=1&display=page&redirect_uri=http://vk.com/callback&scope=friends,wall&response_type=token&v=5.131&state=123456
from dataclasses import dataclass
import json
import os
from typing import TypedDict
from urllib import parse, request

from models.post import Post


token_url = "https://api.vk.com/blank.html#access_token=vk1.a.u_lTIsVXeg-YYf3QTPjgHS7GvRHzchurdKf30N8qHbJ2dAsgiNlg6nWovVZQnPeqMw8uN6qhPkOtE34oQHJSpjuLuwVhQFRJzaz9e2sXhuwxFnzQRvG3CxsWP6LFSTJUct7Inktp5iB-yJo2GN9ssWUEjOSqoV5DcfxLgfoJ9-6GHc-ti3MDMJSHm_47H9z8IerYHr4X5q8NpdvtNCli5g&expires_in=86400&user_id=552926829&state=123456"
def getToken():
    start = token_url.find('access_token=')+len('access_token=')
    end = token_url.find('&expires_in')
    return token_url[start:end]
access_token = os.environ.get('API_KEY')#getToken()#'vk1.a.1UHiyidgSN3L-TVilvlSwSWQzEA7Xnc7mfB27_LdyXrD7SxrZf8pKrmCBOCbmd5THyPnurd2Yb9ytjQkyVjslHaIHleJ6c3-rlH4p2jRifseXg5VPZUglVqa2cPqt3s-8tqNkJq1iWnagqSLKJfYzZBwc1sjowiIsUZZyuZGH7BNGKAIgKrG8AMx0OX-ZJBXMqKF0b5sRbZrl8xqp56GPQ'#getToken()

group_id = -100407134


def vkApi(method, data):
    access_token = os.environ.get('API_KEY')
    url = 'https://api.vk.com/method/'+method
    data['v'] = 5.131
    data['access_token'] = access_token

    data = parse.urlencode(data).encode()
    req = request.Request(url, method='POST', data=data)
    with request.urlopen(req) as res:
        #print(res.read().decode('utf-8'))
        return json.loads(res.read().decode('utf-8'))['response']

def prepareComments(data):
    def transformComment(comment):
        return {
                "id": comment.get("id"),
                "uid": comment.get("from_id"),
                "d": comment.get("date"),
                "t": comment.get("text"),
                "pid": comment.get("post_id"),
                "l": comment.get("likes").get("count") if comment.get("likes") else None,
                "ul": comment.get("likes").get("user_likes") if comment.get("likes") else None,
                "c": comment.get("thread").get("count") if comment.get("thread") else None,
                "to_c": comment.get("reply_to_comment"),
                "att": json.dumps(comment.get("attachments")) if comment.get("attachments") else None,
            }
    result = []
    for item in data:
        if type(item) is not dict: continue
        if type(item["items"]) is not list: continue
        for comment in item["items"]:
            result.append(transformComment(comment))
            for reply in comment["thread"]["items"]:
               result.append(transformComment(reply))
    return result

def fetchComments(ids: list[int]):
    code = '''
        var pids=%s;
        var r=[];
        var i=0;
        while(i<pids.length){
            var a=API.wall.getComments({"owner_id":-100407134,"post_id":pids[i],"thread_items_count":10,"need_likes":1,"count":100,"preview_length":0});
            r=r+[a];
            i=i+1;
        }
        return r;
    ''' % (str(ids))
    res = vkApi('execute', {'code':code})
    return prepareComments(res)

def fetchPosts(stage = 0, passes=25, cnt=100) -> list[Post]:
    def formatResponse(data):
        data['c'] = [x['count'] for x in data['c']]
        data['ul'] = [x['user_likes'] for x in data['l']]
        data['l'] = [x['count'] for x in data['l']]
        res = []
        for i in range(len(data['c'])):
            res.append({})
            for key in ['c', 'l', 'uid', 'd', 'e', 'id', 't', 'ul']:
                res[-1][key] = data[key][i]
            # res[-1] = Post.
        return res
    
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

    data = {'code': code}

    return formatResponse(vkApi('execute', data))