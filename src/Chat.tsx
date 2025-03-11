import React, { useState, useEffect } from 'react';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  useEffect(() => {
    // Create an EventSource that listens to the SSE endpoint
    const eventSource = new EventSource('http://localhost:3000/chat/sse');

    // When the server sends a message event
    eventSource.onmessage = (event) => {
      // event.data will be the message string
      setMessages((prevMessages) => [...prevMessages, event.data]);
    };

    // Cleanup when component unmounts
    return () => {
      eventSource.close();
    };
  }, []);

  // Send message to the server
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    try {
      await fetch('http://localhost:3000/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: inputMessage }),
      });
      setInputMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div style={{ margin: '2rem' }}>
      <h1>Simple SSE Chat</h1>

      <div style={{ border: '1px solid #ccc', padding: '1rem', height: '300px', overflowY: 'auto' }}>
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>

      <form onSubmit={sendMessage} style={{ marginTop: '1rem' }}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Enter your message"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;
