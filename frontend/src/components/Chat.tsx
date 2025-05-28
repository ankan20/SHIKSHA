'use client';

import React, { useState, useEffect, useRef } from 'react';

interface Message {
  sender: string;
  content: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [username,setUsername]=useState<string | null>(null);

  // Fetch username from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
        const user = localStorage.getItem('user');
        if (user) {
          try {
            const userData = JSON.parse(user);
            setUsername(userData.username || 'User');
            
          } catch (error) {
            console.error('Error parsing user data:', error);
          }
        } else {
          setUsername('User');
        }
      }
  }, []);
  // Scroll chat to the bottom when a new message is added
  useEffect(() => {
    
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Send message and get response
  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = { sender: 'user', content: inputMessage };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputMessage ,username}),
      });

      const data = await res.json();
      const botMessage: Message = { sender: 'bot', content: data.response };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error fetching response:', error);
    }

    setInputMessage('');
  };

  return (
    <div className="flex flex-col h-[66vh] max-w-4xl mx-auto">
      {/* Username Container */}
      <div className="flex items-center justify-center p-2 bg-gray-800 text-white rounded-t-lg">
        <span className="text-lg font-semibold">{username} ask your doubts</span>
      </div>
      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-900 text-white rounded-b-lg" ref={chatContainerRef}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg mb-2 ${
                msg.sender === 'user' ? 'bg-blue-500' : 'bg-gray-700'
              }`}
            >
              <span className="block font-semibold text-green-200">{msg.sender === 'user' ? username : 'Bot'}</span>
              <p>{msg.content}</p>
            </div>
          </div>
        ))}
      </div>
      {/* Input Section */}
      <div className="flex items-center p-4 bg-gray-800">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={sendMessage}
          className="ml-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
