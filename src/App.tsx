import React from "react";
import Chat from "./components/Chat";

const App: React.FC = () => {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Welcome to My GPT-4o-mini Chat App</h1>
      <Chat />
    </div>
  );
};

export default App;