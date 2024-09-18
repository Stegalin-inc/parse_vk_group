import { useContext, useEffect, useMemo, useState } from "preact/hooks";
import api from "../share/lib/api";
import { useFetched } from "../share/lib/useFetched";
import { Table, type Column } from "../share/ui/table";
import { Loader } from "../share/ui/loader";
import { useObject } from "../share/lib/useObject";
import { dateFormat } from "../share/lib/format";
import { MessageContext } from "../messageContext";
import { Chart } from "../share/ui/chart";

const PAGE_COUNT = 1000;

export const AllPostsTable = () => {
  const allposts = useFetched(api.allpostsshort, []);
  const setMsg = useContext(MessageContext)
  const users = useFetched(api.users, {});
  const [tab, setTab] = useState(0)
  const [filter, setFilter] = useObject({
    from: "",
    to: "",
    search: "",
  });

  useEffect(() => {
    setMsg?.(allposts.length ? '' : <><Loader /> Загруз очка...</>)
  }, [allposts])

  const tabCnt = (allposts.length / PAGE_COUNT) | 0;

  const columns: Column[] = getCols(users, ['id', 'uid', 'c', 'l', 't', 'd',]);

  const filtered = useMemo(
    () =>
      allposts.filter((x) => {
        // try {
        if (filter.from && x.d < new Date(filter.from).getTime() / 1000) return false;
        if (filter.to && x.d > new Date(filter.to).getTime() / 1000) return false;
        if (filter.search) {
          const name = users[x.uid]?.first_name + " " + users[x.uid]?.last_name;
          if (
            !x.uid?.toString().includes(filter.search) &&
            !name.toLowerCase().includes(filter.search.toLowerCase())
          )
            return false;
        }
        /* } catch {
          return false;
        } */
        return true;
      }),
    [filter, filter.search, allposts]
  );

  const [total, byDate, byHour] = useMemo(() => {
    const byUser: any = {};
    const byDate: any = {};
    const byHour: any = {};
    for (const x of filtered) {
      const date = dateFormat.format(x.d*1000)
      const d = date.slice(0, 8)
      const h = date.slice(10, 12)
      if (!byUser[x.uid]) byUser[x.uid] = { uid: x.uid, all: 0, d: 0, c: 0, l: 0, t: 0 };
      if (!byDate[d]) byDate[d] = {  all: 0, d: x.d, c: 0, l: 0, t: 0 };
      if (!byHour[h]) byHour[h] = {  all: 0, d: x.d, c: 0, l: 0, t: 0 };
      for(let rec of [byUser[x.uid], byDate[d], byHour[h]]){
        rec.all += 1;
        rec.c += x.c;
        rec.l += x.l;
        rec.t += x.t;
      }
    }
    return [byUser, byDate, byHour];
  }, [filtered]);

  const totalColumns: Column[] = getCols(users, ['uid', 'all', 'c', 'l', 't', 'd', 'mean']);
  
  return (
    <>
      <div className="toolbar">
        всего: {allposts.length} фильтр: {filtered.length}
        <input
          type="date"
          value={filter.from}
          onInput={(e) => setFilter({ from: e.currentTarget.value })}
        />
        <input
          type="date"
          value={filter.to}
          onInput={(e) => setFilter({ to: e.currentTarget.value })}
        />
        <input
          type="text"
          value={filter.search}
          onChange={(e) => setFilter({ search: e.currentTarget.value })}
          placeholder="Поиск"
        />
      </div>
      <div class="toolbar">
        <button class={tab == 0 ? 'selected' : ''} onClick={e => setTab(0)}>Все</button>
        <button class={tab == 1 ? 'selected' : ''} onClick={e => setTab(1)}>По пользователю</button>
        <button class={tab == 2 ? 'selected' : ''} onClick={e => setTab(2)}>По дате</button>
        <button class={tab == 3 ? 'selected' : ''} onClick={e => setTab(3)}>По часу</button>
      </div>
      <div style={{ display: 'grid', overflowY: 'auto', maxHeight: '100vh' }}>
        <Chart data={Object.values(byHour)} getter={r=>r.all/400} />
        {tab == 0 && <Table columns={columns} data={filtered} />}
        {tab == 1 && <Table
          columns={totalColumns.filter(x=>x.key!=='d')}
          data={Object.values(total)}
          />}
          {tab == 2 && <Table columns={totalColumns.filter(x=>x.key!=='uid')} data={Object.values(byDate)} />}
          {tab == 3 && <Table columns={totalColumns.filter(x=>x.key!=='uid')} data={Object.values(byHour)} />}
      </div>
    </>
  );
};

const getCols = (users: any, cols=['id']): Column[] => {
  const all: Column[] =  [
    {
      key: "id",
      h: "ID",
      r: (row) => (
        <a href={`https://vk.com/wall-100407134_${row.id}`} target="_blank">
          {row.id}
        </a>
      ),
    },
    {
      key: "uid",
      h: "🙍‍♂️",
      r: (row) => (
        <a href={`https://vk.com/id${row.uid}`} target="_blank">
          {users[row.uid]?.first_name} {users[row.uid]?.last_name}
        </a>
      ),
    },
    {
      key: "all",
      h: "✏",
    },
    {
      key: "c",
      h: "📝",
    },
    {
      key: "l",
      h: "❤",
    },
    /* {
        "key": "ul"
        ,h: 'Пользователь'
      }, */
    {
      key: "d",
      h: "📆",
      r: (row) => dateFormat.format(row.d * 1000),
    },
    {
      key: "e",
      h: "📆✏",
    },
    {
      key: "t",
      h: "📋",
    },
    {
      key: "mean",
      h: "средний ❤",
      r: (row) => row.l / row.all,
      sort: (_, a) => (!a ? 0 : (a.l ?? 0) / (a.all || 1)),
    },
  ];

  return cols.map(x=>all.find(c=>c.key===x)!)
}

