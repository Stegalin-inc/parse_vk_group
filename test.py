from db import db
import re

text = 'sdfs'

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
        if coeff>0.2 and coeff < 0.4:
            result.append(word)
    return result

print(getUniqUsersWords(308085033))     
# print(getUniqUsersWords(552926829))     


users = '''1672	340409943	Семёнъ Федорцовъ
1669	550634817	Максъ Дилдинъ
1626	401037726	Lonely Soul
1580	461225184	Русланъ Логиновъ
1433	364402810	Саша Савельевъ
1432	150375044	Наталья Корзунъ
1295	91988599	Александръ Поляковъ
1268	2903880	Игорь Николаевъ
1256	387416068	Irish Fildish
1236	215116172	Алексѣй Иридiевъ
1098	137613249	Степанъ Борисевичъ
1039	617052552	Лихорадка Долины-Рифтъ
1004	7902194	Володя Журавлёвъ
973	368844290	Катерина Пробужденiе
902	412435238	Dream Walker
663	168865549	Ольга Радчина
653	266326564	Gor Genych
413	693817066	Ugly Woman
412	140205372	Викторъ Горбъ
405	43244116	Альбина Комиссарова
289	392274397	Михаилъ Витухновскiй
246	224380376	Дарья Калоша
224	295461857	Regtime Pineapple
210	23315981	Павелъ Румянцевъ
178	560925140	Марайя Русалкина
77	573208956	Запахъ Инцела
72	200304879	Женя Захаровъ'''
#for line in users.splitlines():
#    data =  line.split('	')
#    words = getUniqUsersWords(data[1])
#    print (data[2], words[:20])


'''c = db.con.cursor()
c.executemany(f'REPLACE INTO wordstat VALUES(?, ?)', getWordStat())
db.con.commit()
711	532910793	Антонъ Горбуновъ 
632 681495917	Михаилъ Горбуновъ
'''



db.closeDb()




            