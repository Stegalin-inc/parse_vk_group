from db import db
import re

text = 'sdfs'

def getWordStat():
    texts = db.readDataBySql(('t'), 'SELECT t FROM posts')
    wordRe = re.compile('[а-яё]+', re.IGNORECASE)
    result = {}
    for t in texts:
        for w in wordRe.findall(t['t']):
            w = w.lower()
            if(w not in result): result[w] = 0
            result[w] += 1
    return dict(sorted(result.items(), key=lambda item: item[1], reverse=True)[:1000])

print(getWordStat().keys())
            