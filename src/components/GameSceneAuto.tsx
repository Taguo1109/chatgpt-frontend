import React, { useEffect, useRef, useMemo, useState } from 'react';
import { Box, Typography } from '@mui/material';

const GameScene: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // 使用 useState 管理玩家狀態
  const [player, setPlayer] = useState({
    x: 50,
    y: 200,
    width: 32,
    height: 32,
    color: 'blue',
  });

  // 使用 useMemo 建立房子物件
  const house = useMemo(
    () => ({
      x: 200,
      y: 150,
      width: 100,
      height: 100,
      color: 'brown',
      roofColor: 'darkred',
    }),
    []
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 繪製函數
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 繪製房子主體
      ctx.fillStyle = house.color;
      ctx.fillRect(house.x, house.y, house.width, house.height);

      // 繪製房頂
      ctx.fillStyle = house.roofColor;
      ctx.beginPath();
      ctx.moveTo(house.x, house.y); // 房頂左上角
      ctx.lineTo(house.x + house.width / 2, house.y - 50); // 房頂尖點
      ctx.lineTo(house.x + house.width, house.y); // 房頂右上角
      ctx.closePath();
      ctx.fill();

      // 繪製玩家
      ctx.fillStyle = player.color;
      ctx.fillRect(player.x, player.y, player.width, player.height);
    };

    // 每一步隨機選擇一個方向移動
    const movePlayer = () => {
      const speed = 10; // 移動步數
      let { x, y } = player;

      // 隨機生成一個方向的函數
      const randomDirection = () => {
        const directions = ['up', 'down', 'left', 'right'];
        return directions[Math.floor(Math.random() * directions.length)];
      };

      // 隨機選擇一個方向
      const direction = randomDirection();

      // 根據隨機方向移動
      switch (direction) {
        case 'up':
          y -= speed;
          break;
        case 'down':
          y += speed;
          break;
        case 'left':
          x -= speed;
          break;
        case 'right':
          x += speed;
          break;
        default:
          break;
      }

      // 確保玩家不超出畫布範圍
      x = Math.max(0, Math.min(x, canvas.width - player.width));
      y = Math.max(0, Math.min(y, canvas.height - player.height));

      // 更新玩家狀態
      setPlayer({ x, y, width: player.width, height: player.height, color: player.color });
    };

    // 每 100 毫秒自動移動並繪製
    const interval = setInterval(() => {
      movePlayer();
      draw();
    }, 100);

    // 清除定時器
    return () => {
      clearInterval(interval);
    };
  }, [house, player]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
      }}
    >
      {/* 標題 */}
      <Typography variant="h4" gutterBottom>
        2D 遊戲場景 - 隨機移動每步改變方向
      </Typography>

      {/* 包含 Canvas 的容器 */}
      <Box
        sx={{
          position: 'relative',
          display: 'inline-block',
          border: '1px solid black',
        }}
      >
        {/* Canvas 元素 */}
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          style={{ backgroundColor: '#87CEEB' }}
        />
      </Box>
    </Box>
  );
};

export default GameScene;