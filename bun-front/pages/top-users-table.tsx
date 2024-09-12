import api from "../share/lib/api";
import { useFetched } from "../share/lib/useFetched";
import { Table } from "../share/ui/table";

export const TopUsersTable = () => {
  const top = useFetched(api.top, []);
  const users = useFetched(api.users, {});

  return (
    <Table
      data={top}
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
        { key: "count", h: "C" },
      ]}
    />
  );
};
