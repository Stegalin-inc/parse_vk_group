// получить токен
// https://oauth.vk.com/authorize?client_id=1&display=page&redirect_uri=http://vk.com/callback&scope=friends,wall&response_type=token&v=5.131&state=123456

type Res<T> = { res: T, err: undefined } | { res: undefined, err: object }

const transform = <P, T>(fn: (res: T) => P): ((t: Res<T>) => Res<P>) => {
    return (res) => {
        if (res.err) return res
        return { res: fn(res.res), err: res.err }
    }
}

type User = {
    id: number,
    sex: 1 | 2,
    first_name: string,
    last_name: string,
    can_access_closed: boolean,
    is_closed: boolean,
}

type Post = {
    id: number,
    l: number,
    ul: number,
    c: number,
    d: number,
    e: number,
    uid: number,
    t: string,
}
type PostRaw = {
    c: { count: number }[],
    l: {
        can_like: number,
        count: number,
        user_likes: number,
    }[]
    uid: number[],
    d: number[],
    e: Array<number | null>,
    id: number[],
    t: string[]
}

const vkApi = <T>(method: string, data: any = {}) => {
    const url = 'https://api.vk.com/method/' + method
    data.v = 5.131
    data.access_token = Bun.env.VK_TOKEN
    

    return fetch(url, { body: new URLSearchParams(data), method: 'POST' }).then(x =>
        x.json().then(x =>
            ({ res: x.response, err: x.error })
        )
    ) as Promise<Res<T>>
}

export const getMe = () => vkApi<User[]>('users.get', { 'user_ids': [1], 'fields': 'sex' })

export default {
    users: (user_ids: number[]) => vkApi<User[]>('users.get', { user_ids, fields: 'sex' }),
    posts: (stage = 0, pass = 25, cnt = 100) => vkApi<PostRaw>('execute', {
        code: `
      var stage=${stage};
      var pass = ${pass}; 
      var cnt = ${cnt};
      var result=[];
      var r={"c":[],"l":[],"uid":[],"d":[],"e":[],"id":[],"t":[]};
      var i=0;
      while(i<pass){
        var a=API.wall.get({"owner_id":-100407134,"offset":stage*pass*cnt+i*cnt,"count":cnt});
        r.c=r.c+a.items@.comments;
        r.l=r.l+a.items@.likes;
        r.uid=r.uid+a.items@.from_id;

        r.d=r.d+a.items@.date;
        r.e=r.e+a.items@.edited;
        r.id=r.id+a.items@.id;
        r.t=r.t+a.items@.text;
        i=i+1;
      }
      return r;`}).then(transform(data => data.id.map((id, i) => ({
            id,
            l: data.l[i].count,
            ul: data.l[i].user_likes,
            c: data.c[i].count,
            d: data.d[i],
            e: data.e[i],
            uid: data.uid[i],
            t: data.t[i],
        } as Post))))
}