import { useMemo } from "preact/hooks";
import api from "../share/lib/api";
import { useFetched } from "../share/lib/useFetched";
import { Table, type Column } from "../share/ui/table";
import { useObject } from "../share/lib/useObject";
import { dateFormat } from "../share/lib/format";

const PAGE_COUNT = 1000;

export const AllPostsTable = () => {
  const allposts = useFetched(api.allpostsshort, []);
  const users = useFetched(api.users, {});
  const [filter, setFilter] = useObject({
    from: "",
    to: "",
    search: "",
  });

  const tabCnt = (allposts.length / PAGE_COUNT) | 0;

  const columns: Column[] = [
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
  ];

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
            !name.toLowerCase().includes(filter.search)
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

  const total = useMemo(() => {
    const byUser: any = {};
    for (const x of filtered) {
      if (!byUser[x.uid]) byUser[x.uid] = { uid: x.uid, all: 0, d: 0, c: 0, l: 0, t: 0 };
      const rec = byUser[x.uid];
      rec.all += 1;
      rec.d += x.d;
      rec.c += x.c;
      rec.l += x.l;
      rec.t += x.t;
    }
    return byUser;
  }, [filtered]);

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
      {/* <div className="toolbar">
        {
          Array(tabCnt).fill(0).map((x, i) => <button class={i === page ? 'selected' : ''} onClick={() => setPage(i)}>{i}</button>)
        }
      </div> */}
      {/* <Table columns={columns} data={allposts.slice(PAGE_COUNT * page, PAGE_COUNT * page + PAGE_COUNT)} />; */}
      <div style={{ display: 'grid', overflow: 'auto', maxHeight: '70vh' }}>
        <Table columns={columns} data={filtered} />
      По пользователю:
        <Table
          columns={[
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
          ]}
          data={Object.values(total)}
        />
      </div>
    </>
  );
};
