import { render } from "preact";
import { useEffect, useState } from "preact/hooks";
import { UserTable } from "./pages/user-table";
import { TopUsersTable } from "./pages/top-users-table";

const Card = ({ color, text }: { color: string; text: string }) => {
  const [col, setCol] = useState(color);

  const randCol = () => {
    const newCol = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    setCol(newCol);
  };

  useEffect(randCol, []);

  return (
    <>
      <div style={{ height: 500, overflow: "auto" }}>
        <UserTable />
      </div>
      <div style={{ height: 500, overflow: "auto" }}>
        <TopUsersTable />
      </div>
      <button
        onClick={(e) => document.body.classList.toggle("dark")}
        style={{ padding: "5px 12px", margin: 12 }}
      >
        Тема
      </button>
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
