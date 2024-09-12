import { useEffect, useState } from "preact/hooks";
import api from "../share/lib/api";
import { Table, type Column } from "../share/ui/table";
import { useFetched } from "../share/lib/useFetched";

export const UserTable = () => {
  const [data, setData] = useState([]);
  const last10 = useFetched(api.last10, []);

  useEffect(() => {
    const uid = new URL(document.location.href).searchParams.get("uid") || 552926829;
    api.postByUser(+uid).then(setData);
  }, []);

  return (
    <>
      <h5>Количество постов: {data.length}</h5>
      <Table columns={columns} data={data} />;
    </>
  );
};

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
        {row.uid}
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
  {
    key: "t",
    h: "📋",
    sort: (a) => a.length,
  },
];
