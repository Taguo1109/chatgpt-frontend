import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, IconButton, Paper } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

const AutoCounter: React.FC = () => {
  // 狀態管理
  const [count, setCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // 使用 useRef 儲存 setInterval 的 ID
  const intervalRef = useRef<number | null>(null);

  // 開始計數
  const startCounter = () => {
    if (!isRunning) {
      setIsRunning(true);
    }
  };

  // 暫停計數
  const stopCounter = () => {
    setIsRunning(false);
  };

  // 重置計數
  const resetCounter = () => {
    setCount(0);
    setIsRunning(false);
  };

  // 計數邏輯 (透過副作用實現)
  useEffect(() => {
    if (isRunning) {
      // 啟動計時器
      intervalRef.current = window.setInterval(() => {
        setCount((prevCount) => prevCount + 1);
      }, 1000);
    } else if (!isRunning && intervalRef.current !== null) {
      // 清除計時器
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // 在組件卸載時清除計時器
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  return (
    <Box
      sx={{
        textAlign: 'center',
        marginTop: '50px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          borderRadius: 2,
          maxWidth: '400px',
          width: '100%',
          textAlign: 'center',
        }}
      >
        <Typography variant='h4' gutterBottom>
          自動計數器
        </Typography>
        <Typography variant='h2' color='primary' sx={{ fontWeight: 'bold' }}>
          {count}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 2,
            marginTop: 3,
          }}
        >
          <IconButton
            color='success'
            onClick={startCounter}
            disabled={isRunning}
            size='large'
          >
            <PlayArrowIcon fontSize='inherit' />
          </IconButton>
          <IconButton
            color='warning'
            onClick={stopCounter}
            disabled={!isRunning}
            size='large'
          >
            <PauseIcon fontSize='inherit' />
          </IconButton>
          <IconButton color='error' onClick={resetCounter} size='large'>
            <RestartAltIcon fontSize='inherit' />
          </IconButton>
        </Box>
      </Paper>
    </Box>
  );
};

export default AutoCounter;
