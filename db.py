import sqlite3
import sqls


class db:
    con = sqlite3.connect("vk_fob.db")

    def __init__(self) -> None:
       self.con.execute(sqls.createSql)
       self.con.execute(sqls.createLikes)
       self.con.execute(sqls.createLikes)

    def writeDataToTable(data, table, model):
      def prepareSqlData(data):
          result = []
          for i in data:
              record = []
              for field in model:
                record.append(i.get(field))
              result.append(tuple(record))

          return result
      c = db.con.cursor()
      c.executemany(f'REPLACE INTO {table} VALUES({",".join(["?"]*len(model))})', prepareSqlData(data))
      db.con.commit()

    def readDataBySql(model: tuple|dict, sql: str):
       c=db.con.cursor()
       result = []

       for row in c.execute(sql):
          record = {}
          keys = model.keys() if type(model) is dict else model
          for i in range(len(keys)):
             record[keys[i]] = row[i]
          result.append(record)
             
       c.close()
       return result
    
    def ensureCreatedTable(model):
       db.con.execute(f"CREATE TABLE {model.table} IF NOT EXISTS ({', '.join(map(lambda k: f'{k} {model[k]}', model.keys()))})")
    def __del__():
        db.con.close()
    def closeDb():
       db.con.close()