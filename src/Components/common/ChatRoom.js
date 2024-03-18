import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

const ChatRoomContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

const ChatHeader = styled.div`
  padding: 10px;
  text-align: center;
  color: black;
  display: flex;
  gap: 160px;
  align-items: center;
`;

const ChatMessages = styled.div`
  flex: 1;
  padding: 10px;
  padding-bottom: 60px; // 추가된 부분
`;

const ChatMessage = styled.div`
  background-color: #f0f0f0;
  padding: 10px;
  margin: 10px;
  border-radius: 10px;
  max-width: 70%;
`;

const ChatInputContainer = styled.div`
  background-color: #fff;
  padding: 10px;
  display: flex;
  align-items: center;
  position: fixed; // 추가된 부분
  bottom: 0; // 추가된 부분
  width: 100%; // 추가된 부분
  box-sizing: border-box; // 추가된 부분
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 5px;
  outline: none;
  font-size: 16px;
`;

const ChatButton = styled.button`
  background-color: transparent;
  border-color: transparent;
`;

const ChatSendButton = styled.button`
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  margin-left: 10px;
  cursor: pointer;
`;

const ChatRoom = ({ chatRoomName, onBack }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const chatMessagesRef = useRef(null);
  const chatInputContainerRef = useRef(null);

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      setMessages([...messages, { text: message, time: new Date() }]);
      setMessage("");
    }
  };

  // 새 메시지가 추가될 때마다 스크롤을 아래로 이동
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);

  // 화면 로딩 시 메시지 입력 부분으로 스크롤
  useEffect(() => {
    if (chatInputContainerRef.current) {
      chatInputContainerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <ChatRoomContainer>
      <ChatHeader>
        <ChatButton onClick={onBack}>뒤로</ChatButton>
        <h3>{chatRoomName}</h3>
      </ChatHeader>
      <ChatMessages ref={chatMessagesRef}>
        {messages.map((msg, index) => (
          <ChatMessage key={index}>
            <div>{msg.text}</div>
            <div style={{ fontSize: "12px", color: "#777" }}>
              {msg.time.toLocaleTimeString()}
            </div>
          </ChatMessage>
        ))}
      </ChatMessages>
      <ChatInputContainer ref={chatInputContainerRef}>
        <ChatInput
          type="text"
          placeholder="메시지 입력"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <ChatSendButton onClick={handleSendMessage}>전송</ChatSendButton>
      </ChatInputContainer>
    </ChatRoomContainer>
  );
};

export default ChatRoom;
