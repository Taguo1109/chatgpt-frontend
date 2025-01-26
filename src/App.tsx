import React from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Box, Tabs, Tab } from "@mui/material";
import Chat from "./components/Chat";
import TwoGPTChat from "./components/TwoGPTChat";

const App: React.FC = () => {
  return (
    <Router>
      <MainTabs />
      <Routes>
        <Route path="/" element={<Chat />} />
        <Route path="/two-gpt-chat" element={<TwoGPTChat />} />
      </Routes>
    </Router>
  );
};

const MainTabs: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    navigate(newValue);
  };

  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider", marginBottom: 2 }}>
      <Tabs
        value={location.pathname}
        onChange={handleTabChange}
        centered
        indicatorColor="primary"
        textColor="primary"
      >
        <Tab label="Chat" value="/" />
        <Tab label="Two GPT Chat" value="/two-gpt-chat" />
      </Tabs>
    </Box>
  );
};

export default App;