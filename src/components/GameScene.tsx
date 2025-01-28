import React, { useEffect, useRef, useMemo } from 'react';
import { Box, Typography } from '@mui/material';

const GameScene: React.FC = () => {
  // 定義 Canvas 的引用
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // 使用 useMemo 創建玩家對象，確保不會在每次渲染時重新創建
  const player = useMemo(
    () => ({
      x: 50, // 玩家起始位置的 X 坐标
      y: 200, // 玩家起始位置的 Y 坐标
      width: 32, // 玩家宽度
      height: 32, // 玩家高度
      color: 'blue', // 玩家颜色
    }),
    []
  );

  // 使用 useMemo 創建房子對象
  const house = useMemo(
    () => ({
      x: 200, // 房子起始位置的 X 座標
      y: 150, // 房子起始位置的 Y 座標
      width: 100, // 房子寬度
      height: 100, // 房子高度
      color: 'brown', // 房子主體顏色
      roofColor: 'darkred', // 房頂顏色
    }),
    []
  );

  // useEffect 用於初始化畫布和處理鍵盤事件
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 繪製函數：負責清空畫布並重新繪製場景
    const draw = () => {
      // 清空整個畫布
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 繪製房子主体
      ctx.fillStyle = house.color;
      ctx.fillRect(house.x, house.y, house.width, house.height);

      // 繪製房頂
      ctx.fillStyle = house.roofColor;
      ctx.beginPath();
      ctx.moveTo(house.x, house.y); // 房頂左上角
      ctx.lineTo(house.x + house.width / 2, house.y - 50); // 房頂頂部尖點
      ctx.lineTo(house.x + house.width, house.y); // 房頂右上角
      ctx.closePath();
      ctx.fill();

      // 繪製玩家
      ctx.fillStyle = player.color;
      ctx.fillRect(player.x, player.y, player.width, player.height);
    };

    // 鍵盤事件處理：根據按鍵移動玩家位置
    const handleKeyDown = (e: KeyboardEvent) => {
      const speed = 5; // 玩家每次移動的步長（像素值）

      // 根據按下的鍵調整玩家的座標
      switch (e.key) {
        case 'ArrowUp': // 按下“向上”鍵
          player.y = Math.max(player.y - speed, 0); // Y 座標減小（向上移動），確保不超出畫布頂部
          break;
        case 'ArrowDown': // 按下“向下”鍵
          player.y = Math.min(player.y + speed, canvas.height - player.height); // Y 座標增加（向下移動），確保不超出畫布底部
          break;
        case 'ArrowLeft': // 按下“向左”鍵
          player.x = Math.max(player.x - speed, 0); // X 座標減小（向左移动），确保不超出画布左边
          break;
        case 'ArrowRight': // 按下“向右”鍵
          player.x = Math.min(player.x + speed, canvas.width - player.width); // X 座標增加（向右移動），確保不超出畫布右邊
          break;
        default:
          break; // 處理其他按鍵（未定義的按鍵不會影響移動）
      }

      // 每次移動後，重新繪製場景
      draw();
    };

    // 綁定鍵盤事件
    window.addEventListener('keydown', handleKeyDown);

    // 初始繪製
    draw();

    // 組件卸載時，移除事件監聽器
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
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
        2D 遊戲場景
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
          style={{ backgroundColor: '#87CEEB' }} // 背景為天藍色
        />
      </Box>
    </Box>
  );
};

export default GameScene;