import api
from db import db
import time
for i in range(1000):
    pids = db.readDataBySql(('id',), 'select id from posts where c>0 and id not in (select pid from comments where pid notnull) order by d desc limit 25')
    pids = [x['id'] for x in pids]
    print(pids)
    commentModel = ('id', 'uid', 'pid', 'c', 'l', 'ul', 'd', 'to_c', 't', 'att', )
    data = api.fetchComments(pids)

    db.writeDataToTable(data, 'comments', commentModel)
    print(i)
    time.sleep(10)


"""
with open('comments.json', 'w') as file:
    json.dump(data, file)
print(data)"""



