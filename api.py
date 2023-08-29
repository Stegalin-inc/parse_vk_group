# получить токен
# https://oauth.vk.com/authorize?client_id=1&display=page&redirect_uri=http://vk.com/callback&scope=friends,wall&response_type=token&v=5.131&state=123456
import json
from urllib import parse, request


token_url = "https://api.vk.com/blank.html#access_token=vk1.a.4xiHzMGViqoXqM2ik3Ut_XTtdrNrc23fK9erHtNEyqUpcRZwXv22U61jYwdd_yg37lQy75WFM_1dZUB_8Oe3ShniR7Ch2rxByG9B9lXR--tFTLAnV5sIVRT4wYe_oljhHnv9EO7vyG183p1okcPDsuJAs1dxfFh5UVpYmZ3ZPM1ktHMCGhVnIgI3WzMREYJ-&expires_in=86400&user_id=552926829&state=123456"
def getToken():
    start = token_url.find('access_token=')+len('access_token=')
    end = token_url.find('&expires_in')
    return token_url[start:end]
access_token = 'vk1.a.1UHiyidgSN3L-TVilvlSwSWQzEA7Xnc7mfB27_LdyXrD7SxrZf8pKrmCBOCbmd5THyPnurd2Yb9ytjQkyVjslHaIHleJ6c3-rlH4p2jRifseXg5VPZUglVqa2cPqt3s-8tqNkJq1iWnagqSLKJfYzZBwc1sjowiIsUZZyuZGH7BNGKAIgKrG8AMx0OX-ZJBXMqKF0b5sRbZrl8xqp56GPQ'#getToken()

group_id = -100407134


def fetch(method, data):
    url = 'https://api.vk.com/method/'+method
    data['v'] = 5.131
    data['access_token'] = access_token

    data = parse.urlencode(data).encode()
    req = request.Request(url, method='POST', data=data)
    with request.urlopen(req) as res:
        #print(res.read().decode('utf-8'))
        return json.loads(res.read().decode('utf-8'))['response']
