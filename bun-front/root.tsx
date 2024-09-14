import { render, type ComponentChild } from "preact";
import { useEffect, useState } from "preact/hooks";
import { UserTable } from "./pages/user-table";
import { TopUsersTable } from "./pages/top-users-table";
import { AllPostsTable } from "./pages/all-posts-table";
import { MessageContext } from "./messageContext";

const Card = ({ color, text }: { color: string; text: string }) => {
  const [col, setCol] = useState(color);

  const [tab, setTab] = useState(0)
  
  const [msg, setMsg] = useState<ComponentChild>('')


  const randCol = () => {
    const newCol = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    setCol(newCol);
  };

  useEffect(randCol, []);

  const tabs = [UserTable, TopUsersTable, AllPostsTable]

  const CurrentComponent = tabs[tab]

  return (
    <MessageContext.Provider value={msg=>setMsg(msg)}>
      {msg}
      <div class="toolbar">
        <button class={tab == 0 ? 'selected' : ''} onClick={() => setTab(0)}>По пользователю</button>
        <button class={tab == 1 ? 'selected' : ''} onClick={() => setTab(1)}>Топ пользователей</button>
        <button class={tab == 2 ? 'selected' : ''} onClick={() => setTab(2)}>Все посты</button>
        <div style={{ flex: 1 }}></div>
        <button
          onClick={(e) => document.body.classList.toggle("dark")}
        >
          Тема
        </button>
      </div>
      <CurrentComponent />
      <div
        style={{ background: col, padding: 10, border: "1px solid black", cursor: "pointer" }}
        onClick={randCol}
      >
        {text}
      </div>
    </MessageContext.Provider>
  );
};

render(<Card color="red" text="Ya ne znayu sho skazat" />, document.body);
