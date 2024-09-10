import { render } from "preact";
import { useEffect, useMemo, useState } from "preact/hooks";

const api = () => {
  return fetch("http://localhost:8888/api/userposts/552926829", {
    /*  mode: "no-cors",
    method: "GET",
    referrerPolicy: "no-referrer",
    credentials: "omit", */
  }).then((x) => x.json());
};

const mockData = [
  {
    id: 38561781,
    uid: 561914035,
    c: 31,
    l: 0,
    ul: 0,
    d: 1717237582,
    e: 1717237603,
    t: "Вот он секрет счастливого брака. Порно актёр и и порно актрисса уже 12 лет в браке и чувства у них ни куда не делись, а всё потому что он ебёт других баб, а она других мужиков. Почти что секс коммунизм по Поднебесному.",
  },
  {
    id: 38561782,
    uid: 561914035,
    c: 21,
    l: 0,
    ul: 0,
    d: 1617237582,
    e: 1717237603,
    t: " Порно актёр и и порно актрисса уже 12 лет в браке и чувства у них ни куда не делись, а всё потому что он ебёт других баб, а она других мужиков. Почти что секс коммунизм по Поднебесному.",
  },
  {
    id: 38561783,
    uid: 561914035,
    c: 11,
    l: 0,
    ul: 0,
    d: 1517237582,
    e: 1717237603,
    t: ", а всё потому что он ебёт других баб, а она других мужиков. Почти что секс коммунизм по Поднебесному.",
  },
];

const Table = () => {
  const [data, setData] = useState(mockData);

  useEffect(() => {
    api().then(setData);
  }, []);

  const columns = [
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

  const [sort, setSort] = useState<[string | null, number]>([null, 0]);

  const onSort = (key: string) => {
    const [k, dir] = sort;
    if (k === key) {
      setSort([key, (dir + 1) % 2]);
    } else {
      setSort([key, 0]);
    }
  };

  const sorted = useMemo(() => {
    const [k, dir] = sort;
    if (!k) return data;
    const s = columns.find((x) => x.key === k)?.sort || ((x) => x);

    return data.sort((a, b) => (dir ? s(a[k]) - s(b[k]) : s(b[k]) - s(a[k])));
  }, [data, sort]);

  return (
    <table>
      <thead>
        {columns.map((x) => (
          <th onClick={() => onSort(x.key)} style={{ userSelect: "none" }}>
            {x.h || x.key} {x.key === sort[0] && (sort[1] ? "▲" : "▼")}
            <input type="text" onClick={(e) => e.stopPropagation()} />
          </th>
        ))}
      </thead>
      <tbody>
        {sorted.map((x) => (
          <tr>
            {columns.map((y) => (
              <td>{y.r ? y.r(x) : x[y.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const Card = ({ color, text }: { color: string; text: string }) => {
  const [col, setCol] = useState(color);

  const randCol = () => {
    const newCol = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    setCol(newCol);
  };

  return (
    <>
      <Table />
      <div
        style={{ background: col, padding: 10, border: "1px solid black", cursor: "pointer" }}
        onClick={randCol}
      >
        {text}
      </div>
    </>
  );
};

render(<Card color="red" text="Ya ne znayu sho skazat" />, document.body);
