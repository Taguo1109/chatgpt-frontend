import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Paper, Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const TwoGPTChat: React.FC = () => {
  const [isChatting, setIsChatting] = useState(false);
  const [leftMessages, setLeftMessages] = useState<Message[]>([]);
  const [rightMessages, setRightMessages] = useState<Message[]>([]);
  const [isTypingLeft, setIsTypingLeft] = useState(false);
  const [isTypingRight, setIsTypingRight] = useState(false);

  const leftEndRef = useRef<HTMLDivElement>(null);
  const rightEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom(leftEndRef);
  }, [leftMessages]);

  useEffect(() => {
    scrollToBottom(rightEndRef);
  }, [rightMessages]);

  useEffect(() => {
    console.log('isChatting updated:', isChatting);
  }, [isChatting]);

  const startChat = () => {
    setIsChatting(true);

    const initialLeftMessages: Message[] = [
      { role: 'user', content: '我們來聊天' },
    ];
    const initialRightMessages: Message[] = [
      { role: 'assistant', content: '我們來聊天' },
    ];

    setLeftMessages(initialLeftMessages);
    setRightMessages(initialRightMessages);

    console.log('Initial left messages:', initialLeftMessages);
    console.log('Initial right messages:', initialRightMessages);

    simulateGPTReply(initialLeftMessages, 'left');
  };

  const stopChat = () => {
    console.log('Stopping chat...');
    setIsChatting(false);
    setIsTypingLeft(false);
    setIsTypingRight(false);
  };

  const simulateGPTReply = async (
    input: Message[], // 接受输入或完整消息歷史
    side: 'left' | 'right'
  ) => {
    const setIsTyping = side === 'right' ? setIsTypingLeft : setIsTypingRight;
    const setMessages = side === 'right' ? setLeftMessages : setRightMessages;
    const setOtherMessages =
      side === 'right' ? setRightMessages : setLeftMessages;
    console.log(input);

    setIsTyping(true);

    try {
      // 调用 OpenAI API
      const response = await fetch(
        'https://api.openai.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: input,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        const reply = data.choices[0].message.content; // GPT 回復內容
        let currentIndex = 0;

        // 模擬逐字顯示
        const interval = setInterval(() => {
          let updatedMessages: Message[] = [];

          // 更新當前窗口消息
          setMessages((prev) => {
            const updated = [...prev];
            const lastMessage = updated[updated.length - 1];

            if (lastMessage?.role === 'user') {
              lastMessage.content = reply.slice(0, currentIndex + 1);
            } else {
              updated.push({
                role: 'user',
                content: reply.slice(0, currentIndex + 1),
              });
            }

            updatedMessages = updated; // 保存最新的消息狀態
            return updated;
          });

          // 同步逐字顯示到另一邊
          setOtherMessages((prev) => {
            const updated = [...prev];
            const lastMessage = updated[updated.length - 1];

            if (lastMessage?.role === 'assistant') {
              lastMessage.content = reply.slice(0, currentIndex + 1);
            } else {
              updated.push({
                role: 'assistant',
                content: reply.slice(0, currentIndex + 1),
              });
            }

            return updated;
          });

          currentIndex++;

          // 完成模擬打字後觸發下一輪
          if (currentIndex >= reply.length) {
            clearInterval(interval);
            setIsTyping(false);

            // 等待打字完成后，触发下一轮对话
            const nextSide = side === 'left' ? 'right' : 'left';
            setTimeout(() => simulateGPTReply(updatedMessages, nextSide), 500); // 延迟 500ms后触发下一轮
          }
        }, 50); // 模擬逐字打字速度
      } else {
        console.error('Error from OpenAI API:', data);
        setIsTyping(false);
      }
    } catch (error) {
      console.error('Error fetching reply from API:', error);
      setIsTyping(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 4,
        padding: 4,
        justifyContent: 'center',
        alignItems: 'flex-start',
      }}
    >
      {/* 左邊對話框 */}
      <Paper
        sx={{
          width: '40%',
          maxHeight: '500px',
          overflowY: 'scroll',
          padding: 2,
          backgroundColor: '#f9f9f9',
        }}
      >
        <Typography variant='h6' align='center'>
          GPT 1
        </Typography>
        {leftMessages.map((msg, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: 2,
            }}
          >
            <Box
              sx={{
                backgroundColor: msg.role === 'user' ? '#007bff' : '#e0e0e0',
                color: msg.role === 'user' ? 'white' : 'black',
                padding: 1.5,
                borderRadius: 2,
                maxWidth: '70%',
                wordWrap: 'break-word',
              }}
            >
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </Box>
          </Box>
        ))}
        {isTypingLeft && (
          <Typography variant='body2' sx={{ color: '#888' }}>
            GPT 1 正在輸入...
          </Typography>
        )}
        <div ref={leftEndRef} />
      </Paper>

      {/* 右邊對話框 */}
      <Paper
        sx={{
          width: '40%',
          maxHeight: '500px',
          overflowY: 'scroll',
          padding: 2,
          backgroundColor: '#f9f9f9',
        }}
      >
        <Typography variant='h6' align='center'>
          GPT 2
        </Typography>
        {rightMessages.map((msg, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: 2,
            }}
          >
            <Box
              sx={{
                backgroundColor: msg.role === 'user' ? '#007bff' : '#e0e0e0',
                color: msg.role === 'user' ? 'white' : 'black',
                padding: 1.5,
                borderRadius: 2,
                maxWidth: '70%',
                wordWrap: 'break-word',
              }}
            >
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </Box>
          </Box>
        ))}
        {isTypingRight && (
          <Typography variant='body2' sx={{ color: '#888' }}>
            GPT 2 正在輸入...
          </Typography>
        )}
        <div ref={rightEndRef} />
      </Paper>

      {/* 控制按鈕 */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          justifyContent: 'center',
        }}
      >
        <Button
          variant='contained'
          color='primary'
          onClick={startChat}
          disabled={isChatting}
        >
          開始聊天
        </Button>
        <Button
          variant='outlined'
          color='secondary'
          onClick={stopChat}
          disabled={!isChatting}
        >
          停止聊天
        </Button>
      </Box>
    </Box>
  );
};

export default TwoGPTChat;
