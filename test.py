from models.model import model
from models.post import post

a= post()
b=model()
#b.print()
res=", ".join(map(lambda k: f"{k} {a.model[k]}", a.model.keys()))
print(res)
model.x=900
a.print()
#b.print()
a.print()