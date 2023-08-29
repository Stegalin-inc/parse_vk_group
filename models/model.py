from db import db
class model:
    
    def __init__(self) -> None:
        db.ensureCreatedTable(self.model)
    def print(self):
        print(self.model, self.x)