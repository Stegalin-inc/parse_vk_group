import { useState } from "preact/hooks";
import api from "../share/lib/api";
import { useFetched } from "../share/lib/useFetched";
import { Table, type Column } from "../share/ui/table";

const PAGE_COUNT = 1000

export const AllPostsTable = () => {
  const allposts = useFetched(api.allpostsshort, []);
  const users = useFetched(api.users, {})
  const [page, setPage] = useState(0)

  const tabCnt = (allposts.length / PAGE_COUNT) | 0

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
      r: (row) => new Date(row.d * 1000).toLocaleString(),
    },
    {
      key: "e",
      h: "📆✏",
    },
  ];

  return (
    <>
      <h5>Всего постов: {allposts.length}</h5>
      {/* <div className="toolbar">
        {
          Array(tabCnt).fill(0).map((x, i) => <button class={i === page ? 'selected' : ''} onClick={() => setPage(i)}>{i}</button>)
        }
      </div> */}
      {/* <Table columns={columns} data={allposts.slice(PAGE_COUNT * page, PAGE_COUNT * page + PAGE_COUNT)} />; */}
      <Table columns={columns} data={allposts} />;
    </>
  );
};


