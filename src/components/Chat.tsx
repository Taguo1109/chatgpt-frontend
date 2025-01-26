import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  CircularProgress,
  Avatar,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import ReactMarkdown from "react-markdown";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Chat: React.FC = () => {
  const [input, setInput] = useState<string>(''); // 使用者輸入
  const [messages, setMessages] = useState<Message[]>([]); // 聊天歷史
  const [loading, setLoading] = useState<boolean>(false); // 加載狀態
  const [isComposing, setIsComposing] = useState<boolean>(false); // 是否組字中
  const [isTyping, setIsTyping] = useState<boolean>(false); // 是否正在模擬打字

  const messagesEndRef = useRef<HTMLDivElement>(null); // 用於滾動到最新訊息的參考

  // 滾動到最新訊息
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    setLoading(true); // 開始加載
    try {
      const apiKey = process.env.REACT_APP_OPENAI_API_KEY; // 獲取 API 密鑰
      if (!apiKey) {
        throw new Error('API key is missing! Please set it in your .env file.');
      }

      const response = await fetch(
        'https://api.openai.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              ...messages.map((msg) => ({
                role: msg.role,
                content: msg.content,
              })),
              { role: 'user', content: input },
            ],
          }),
        }
      );

      const data = await response.json();
      const newMessage = data.choices[0].message.content;

      setMessages((prev) => [
        ...prev,
        { role: 'user', content: input },
      ]);

      // 逐字顯示 GPT 回覆
      simulateTyping(newMessage);
      setInput(''); // 清空輸入框
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false); // 結束加載
    }
  };

  // 模擬 GPT 打字回覆
  const simulateTyping = (content: string) => {
    let currentIndex = 0;
    setIsTyping(true); // 開始逐字打字

    const interval = setInterval(() => {
      setMessages((prev) => {
        const updatedMessages = [...prev];
        const lastMessage = updatedMessages[updatedMessages.length - 1];

        if (lastMessage?.role === 'assistant') {
          if (currentIndex < content.length) {
            lastMessage.content = content.slice(0, currentIndex + 1); // 逐字顯示
          }
        } else {
          updatedMessages.push({
            role: 'assistant',
            content: '',
          });
        }

        return updatedMessages;
      });

      currentIndex++;
      scrollToBottom();

      if (currentIndex >= content.length) {
        clearInterval(interval);
        setIsTyping(false); // 結束逐字打字
      }
    }, 50);
  };

  return (
    <Box
      sx={{
        maxWidth: '800px',
        margin: '20px auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Typography variant='h4' align='center' gutterBottom>
        GPT-4o-mini Chat
      </Typography>

      <Paper
        elevation={3}
        sx={{
          flexGrow: 1,
          padding: 2,
          minHeight: '300px',
          maxHeight: '500px',
          overflowY: 'scroll',
          backgroundColor: '#f9f9f9',
        }}
      >
        {messages.map((msg, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: '10px',
            }}
          >
            {msg.role === 'assistant' && (
              <Avatar sx={{ bgcolor: '#e0e0e0', marginRight: '10px' }}>
                <SmartToyIcon />
              </Avatar>
            )}
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
              {msg.role === 'assistant' ? (
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              ) : (
                <Typography variant='body1'>{msg.content}</Typography>
              )}
            </Box>
            {msg.role === 'user' && (
              <Avatar
                sx={{ bgcolor: '#007bff', color: 'white', marginLeft: '10px' }}
              >
                <PersonIcon />
              </Avatar>
            )}
          </Box>
        ))}
        {loading && (
          <Box sx={{ textAlign: 'center', marginTop: 1 }}>
            <CircularProgress size={24} />
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Paper>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          variant='outlined'
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !isComposing && !loading && !isTyping) {
              handleSend(); // 僅在組字完成且未加載、未打字時發送訊息
            }
          }}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          placeholder={loading ? '等待回覆中...' : 'Type your message...'}
          disabled={loading || isTyping} // 加載中或正在打字時禁用輸入框
        />
        <Button
          variant='contained'
          color='primary'
          onClick={handleSend}
          disabled={loading || isTyping || !input.trim()} // 加載中或正在打字時禁用按鈕
        >
          {loading ? '等待中...' : 'Send'}
        </Button>
      </Box>
    </Box>
  );
};

export default Chat;