import { useMemo, useState } from "preact/hooks";

export type Column = {
  key: string;
  h: string;
  r?: (row: any) => any;
  sort?: (row: any) => number;
};

type Props = {
  columns: Column[];
  data: any[];
};

export const Table = ({ columns, data }: Props) => {
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
            {/* <input type="text" onClick={(e) => e.stopPropagation()} /> */}
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
