import time
import api
from db import db
import sys


from models.post import post

def printHelp():
  print('''
Available commands:
  fetch sleep=15 passes=25 - fetch unloaded posts with specified sleep and passes
''')

def fetchUnloaded(sleep = 15, passes = 25):
  lastDate = db.readDataBySql(('d'), 'SELECT d FROM posts ORDER BY d DESC LIMIT 1')[0]['d']
  print('lastDate: ', lastDate)
  i = 0
  while 1:
    print(i)
    posts = api.fetchPosts(i, passes)
    db.writeDataToTable(posts, 'posts', tuple(post.model.keys()))
    if(posts[-1]['d'] < lastDate): break
    print('d: ', posts[-1]['d'])
    i+=1
    time.sleep(sleep)
    



command = sys.argv[1] if len(sys.argv) > 1 else None


commands = {
  'fetch': {
    'args': ['sleep', 'passes'],
    'func': fetchUnloaded
  }
}

if(not command): printHelp()

if(command in commands):
  params = commands[command]
  # params['func'](**{k: v for k, v in zip(params['args'], sys.argv[2:])})
  args = {k: v for k, v in zip(sys.argv[2::2],sys.argv[3::2]) if k in params['args']}
  params['func'](**args)
else: printHelp()
