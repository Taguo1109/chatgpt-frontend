import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Button, Typography, Paper } from '@mui/material';
import { PlayArrow, Pause } from '@mui/icons-material';

// 註冊必要的組件
Chart.register(
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Simulation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);
  const [points, setPoints] = useState<
    { x: number; y: number; assets: number }[]
  >([]);
  const [distribution, setDistribution] = useState<number[]>([]);
  const [isRunning, setIsRunning] = useState(false); // 控制模擬是否運行

  const totalPoints = 1000;
  const canvasWidth = 800;
  const canvasHeight = 600;
  const simulationInterval = useRef<NodeJS.Timeout | null>(null);

  const updateDistribution = useCallback(
    (points: { x: number; y: number; assets: number }[]) => {
      // 找到當前最大資產值
      const maxAssetValue = Math.max(...points.map((p) => p.assets));
      const binCount = 20;
      const binSize = maxAssetValue / binCount;
      const bins = Array(binCount).fill(0);
      points.forEach((point) => {
        const index = Math.min(binCount - 1, Math.floor(point.assets / binSize));
        bins[index] += 1; // 計算在每個資產範圍內的人數
      });
      setDistribution(bins);
    },
    []
  );

  // 初始化點
  useEffect(() => {
    const initialPoints = Array.from({ length: totalPoints }, () => ({
      x: Math.random() * canvasWidth,
      y: Math.random() * canvasHeight,
      assets: 1000,
    }));
    setPoints(initialPoints);
  }, []);

  // 隨機移動與資產更新
  useEffect(() => {
    if (isRunning) {
      simulationInterval.current = setInterval(() => {
        setPoints((prevPoints) => {
          const updatedPoints = prevPoints.map((point) => {
            let newAssets = point.assets + (Math.random() - 0.5) * 200;
            newAssets = Math.max(0, newAssets); // 確保資產不為負數

            const newX = Math.max(
              0,
              Math.min(canvasWidth, point.x + (Math.random() - 0.5) * 10)
            );
            const newY = Math.max(
              0,
              Math.min(canvasHeight, point.y + (Math.random() - 0.5) * 10)
            );
            return { ...point, x: newX, y: newY, assets: newAssets };
          });

          updateDistribution(updatedPoints);
          return updatedPoints;
        });
      }, 100);
    } else if (simulationInterval.current) {
      clearInterval(simulationInterval.current);
    }

    return () => {
      if (simulationInterval.current) {
        clearInterval(simulationInterval.current!);
      }
    };
  }, [isRunning, updateDistribution]);

  // 繪製畫布
  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        const drawPoints = () => {
          ctx.clearRect(0, 0, canvasWidth, canvasHeight);
          points.forEach(({ x, y, assets }) => {
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 0, 255, ${Math.min(assets / 2000, 1)})`;
            ctx.fill();
            ctx.closePath();
          });
        };
        drawPoints();
      }
    }
  }, [points]);

  // 初始化或更新圖表
  useEffect(() => {
    const chartCanvas = document.getElementById('chartCanvas') as HTMLCanvasElement;
    if (chartCanvas) {
      if (!chartInstanceRef.current) {
        // 初始化圖表實例
        chartInstanceRef.current = new Chart(chartCanvas.getContext('2d')!, {
          type: 'bar',
          data: {
            labels: Array.from(
              { length: 20 },
              (_, i) => `${Math.round((i * 2000) / 20)}-${Math.round(
                ((i + 1) * 2000) / 20
              )}`
            ),
            datasets: [
              {
                label: '人數分佈',
                data: distribution,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: { title: { display: true, text: '資產範圍' } },
              y: { title: { display: true, text: '人數' } },
            },
          },
        });
      } else {
        // 更新現有圖表數據
        const chart = chartInstanceRef.current;
        chart.data.labels = Array.from(
          { length: 20 },
          (_, i) => `${Math.round((i * 2000) / 20)}-${Math.round(
            ((i + 1) * 2000) / 20
          )}`
        );
        chart.data.datasets[0].data = distribution;
        chart.update();
      }
    }
  }, [distribution]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
      }}
    >
      <Typography variant="h4" gutterBottom>
        隨機點模擬與資產分佈
      </Typography>
      <Button
        variant="contained"
        color={isRunning ? 'secondary' : 'primary'}
        onClick={() => setIsRunning((prev) => !prev)}
        startIcon={isRunning ? <Pause /> : <PlayArrow />}
      >
        {isRunning ? '暫停' : '開始'}
      </Button>
      <Paper
        style={{
          marginTop: '20px',
          padding: '20px',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          style={{ border: '1px solid black' }}
        ></canvas>
      </Paper>
      <div style={{ width: canvasWidth, height: 400, marginTop: '20px' }}>
        <canvas id="chartCanvas"></canvas>
      </div>
    </div>
  );
};

export default Simulation;
