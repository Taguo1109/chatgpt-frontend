import React, { useState, useEffect, useRef } from "react";

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
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>自動計數器</h1>
      <p>計數值：{count}</p>
      <div>
        <button onClick={startCounter} disabled={isRunning}>
          開始
        </button>
        <button onClick={stopCounter} disabled={!isRunning}>
          暫停
        </button>
        <button onClick={resetCounter}>重置</button>
      </div>
    </div>
  );
};

export default AutoCounter;