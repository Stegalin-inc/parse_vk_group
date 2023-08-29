from models.model import model
class post(model):
    table = 'posts'
    model = {
        'id': 'INTEGER PRIMARY KEY',
        'uid': 'INTEGER',
        'pid': 'INTEGER',
        'l': 'INTEGER',
        'd': 'INTEGER',
        't': 'TEXT'
    }
    def __init__(self) -> None:
        super().__init__(self)
    def print(self):
        super().print()