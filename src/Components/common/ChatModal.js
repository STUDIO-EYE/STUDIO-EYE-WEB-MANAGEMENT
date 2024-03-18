import React, { useState } from "react";
import Modal from "react-modal";
import styled from "styled-components";
import { FaRegComments } from "react-icons/fa";
import { FaComment } from "react-icons/fa";
import ChatRoom from "./ChatRoom"; // ChatRoom 컴포넌트 추가

const StyledFaRegComments = styled(FaRegComments)`
  font-size: 2rem;
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const ChatTitle = styled.h2`
  text-align: center;
  width: 100%;
  margin-left: 20px;
`;

const ChatButton = styled.button`
  background-color: white;
  font-size: 16px;
  border-color: transparent;
`;

const ChatList = styled.div`
  margin-top: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  overflow: hidden;
  width: 100%;
`;

const ChatRoomItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  gap: 15px;
  border: 1px solid #eee;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f0f0f0;
  }
`;
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "300px",
    height: "600px",
  },
};

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const EmailInput = styled.input`
  margin-top: 10px;
  padding: 5px;
`;

const ErrorMessage = styled.p`
  color: red;
`;

const Divider = styled.div`
  width: 100%;
  border-bottom: 2px solid #ddd;
  margin: 20px 0;
`;

const ChatModal = ({ isOpen, onRequestClose }) => {
  const [chatRooms, setChatRooms] = useState([]);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [selectedChatRoom, setSelectedChatRoom] = useState(null);

  const handleInvite = () => {
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("유효한 이메일을 입력해주세요.");
      return;
    }

    // 채팅방 생성 및 추가
    const newChatRoom = { id: Date.now(), name: email.split("@")[0] };
    setChatRooms([...chatRooms, newChatRoom]);

    setEmail("");
    setError("");
    setShowEmailInput(false);
  };

  const handleChatRoomClick = (chatRoom) => {
    setSelectedChatRoom(chatRoom);
  };

  const handleBackToChatList = () => {
    setSelectedChatRoom(null);
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles}>
      <ModalContent>
        {selectedChatRoom ? (
          <ChatRoom
            chatRoomName={selectedChatRoom.name}
            onBack={handleBackToChatList}
          />
        ) : (
          <>
            <TitleContainer>
              <ChatTitle>채팅</ChatTitle>
              <ChatButton onClick={() => setShowEmailInput(!showEmailInput)}>
                +
              </ChatButton>
            </TitleContainer>
            <StyledFaRegComments />
            {showEmailInput && (
              <>
                <EmailInput
                  type="email"
                  placeholder="이메일 입력"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <ChatButton onClick={handleInvite}>초대</ChatButton>
                {error && <ErrorMessage>{error}</ErrorMessage>}
              </>
            )}
            <Divider />
            <ChatList>
              {chatRooms.map((room) => (
                <ChatRoomItem
                  key={room.id}
                  onClick={() => handleChatRoomClick(room)}
                >
                  <div className="icon">
                    <FaComment />
                  </div>
                  {room.name}
                </ChatRoomItem>
              ))}
            </ChatList>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ChatModal;
