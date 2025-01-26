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
  const isChattingRef = useRef(isChatting); // 用來同步最新的 isChatting 值

  useEffect(() => {
    scrollToBottom(leftEndRef);
  }, [leftMessages]);

  useEffect(() => {
    scrollToBottom(rightEndRef);
  }, [rightMessages]);

  useEffect(() => {
    isChattingRef.current = isChatting; // 每次更新 isChatting 時同步 ref
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

    simulateGPTReply(initialLeftMessages, 'left');
  };

  const stopChat = () => {
    setIsChatting(false);
    setIsTypingLeft(false);
    setIsTypingRight(false);
  };

  const simulateGPTReply = async (input: Message[], side: 'left' | 'right') => {
    const setIsTyping = side === 'right' ? setIsTypingLeft : setIsTypingRight;
    const setMessages = side === 'right' ? setLeftMessages : setRightMessages;
    const setOtherMessages =
      side === 'right' ? setRightMessages : setLeftMessages;

    setIsTyping(true);

    try {
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
        typeNextCharacter(
          reply,
          setMessages,
          setOtherMessages,
          side,
          setIsTyping
        );
      } else {
        console.error('Error from OpenAI API:', data);
        setIsTyping(false);
      }
    } catch (error) {
      console.error('Error fetching reply from API:', error);
      setIsTyping(false);
    }
  };
  
  /**
   * 問題：
   * isChattingRef並沒有更新
   * 閉包陷阱 (Closure Issue)：
   * 在 typeNextCharacter 函數內部，isChatting 的值被捕獲為定義該函數時的值（即 false），即使在後續更新後，它仍然是舊值。
   * React 的狀態更新是異步的，當閉包內捕獲狀態時，該狀態不會自動跟隨最新值。
   * setTimeout 的執行上下文：
   * 每次調用 typeNextCharacter 時，isChatting 的值基於當前閉包的上下文，而不是最新的 React 狀態。
   * 解決方法：
   * 可以使用 useRef 儲存最新的 isChatting 值，因為 useRef 的值在組件更新時保持穩定，不會受閉包影響。
   *   useEffect(() => {
   *    // 每次 isChatting 更新時同步更新 ref 的值
   *    isChattingRef.current = isChatting;
   *    console.log('isChatting updated:', isChatting);
   *    }, [isChatting]);
   */
  const typeNextCharacter = (
    reply: string,
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    setOtherMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    side: 'left' | 'right',
    setIsTyping: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    let currentIndex = 0;

    const displayNextCharacter = () => {
      if (!isChattingRef.current) return; // 若聊天已停止，終止遞歸
      let updatedMessages: Message[] = [];
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

      if (currentIndex < reply.length) {
        setTimeout(displayNextCharacter, 50);
      } else {
        setIsTyping(false);

        // 完成模擬打字後觸發下一輪
        if (isChattingRef.current) {
          const nextSide = side === 'left' ? 'right' : 'left';
          setTimeout(() => simulateGPTReply(updatedMessages, nextSide), 500);
        }
      }
    };

    displayNextCharacter();
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
