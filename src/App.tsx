import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import { Box, Tabs, Tab } from '@mui/material';
import Chat from './components/Chat';
import TwoGPTChat from './components/TwoGPTChat';
import AutoCounter from './components/AutoCounter';
import GameScene from './components/GameScene';
import GameSceneAuto from './components/GameSceneAuto';
import Simulation from './components/Simulation';
import SignIn from './components/SingIn';
import AppTheme from './theme/AppTheme';

const App: React.FC = () => {
  return (
    <Router>
      <MainTabs />
      <Routes>
        <Route path='/' element={<Chat />} />
        <Route path='/two-gpt-chat' element={<TwoGPTChat />} />
        <Route path='/auto-counter' element={<AutoCounter />} />
        <Route path='/game-scene' element={<GameScene />} />
        <Route path='/game-scene-auto' element={<GameSceneAuto />} />
        <Route path='/simulation' element={<Simulation />} />
        <Route path='/signin' element={<SignIn />} />
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
    <AppTheme>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: 2 }}>
        <Tabs
          value={location.pathname}
          onChange={handleTabChange}
          centered
          indicatorColor='primary'
          textColor='primary'
        >
          <Tab label='Chat' value='/' />
          <Tab label='Two GPT Chat' value='/two-gpt-chat' />
          <Tab label='Auto Counter' value='/auto-counter' />
          <Tab label='Game Scene' value='/game-scene' />
          <Tab label='Game Scene Auto' value='/game-scene-auto' />
          <Tab label='Simulation' value='/simulation' />
          <Tab label='SignIn' value='/signin' />
        </Tabs>
      </Box>
    </AppTheme>
  );
};

export default App;
