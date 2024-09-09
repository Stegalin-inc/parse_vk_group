from typing import TypedDict
from models.model import model

class Post(TypedDict):
    id: int
    c: int
    l: int
    uid: int
    d: int
    e: int
    t: str
    ul: int
    
class post(model):
    table = 'posts'
    model = {
        'id': 'INTEGER PRIMARY KEY',
        'uid': 'INTEGER',
        'c': 'INTEGER',
        'l': 'INTEGER',
        'ul': 'INTEGER',
        'd': 'INTEGER',
        'e': 'INTEGER',
        't': 'TEXT'
    }
    def __init__(self) -> None:
        super().__init__(self)
    def print(self):
        super().print()

