import React, { useEffect, useState } from "react";
import styled from "styled-components";
import commentApi from "../../api/commentApi";
import jwt_decode from "jwt-decode";
import InputText from "Components/common/InputText";
import TextArea from "Components/common/TextArea";
import NewButton from "Components/common/NewButton";
import { orange } from "@mui/material/colors";
import { theme } from "LightTheme";

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  padding: 20px 20px 0 20px;
  background-color: #F9FBFD;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.08);
  border-radius: 10px;
`;

const StyledTextArea = styled(TextArea)`
  width: 100%;
  min-height: 100px;
  border-radius: 8px;
  border: 1px solid #ccc;
  padding: 0.5rem;
  resize: none;
`;

const StyledButton = styled(NewButton)`
  width: 40%;
  min-height: 40px;
  font-size: 1rem;
  border-radius: 20px;
  transition: all 0.3s;
  &:hover {
    
    cursor: pointer;
  }
`;

const CommentForm = ({ onAddComment, postId, selectedPost }: { onAddComment: any; postId: number; selectedPost: any }) => {
  const [content, setContent] = useState("");
  const [tokenUserName, setTokenUserName] = useState("");
  const token = sessionStorage.getItem("login-token");

  useEffect(() => {
    if (token) {
      const decodedToken: any = jwt_decode(token);
      setTokenUserName(decodedToken.username);
    }
  }, []);

  const handleSubmit = async () => {
    try {
      const response = await commentApi.postComment(postId, { content: content });

      const formatDate = () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();

        return `${year}년 ${month}월 ${day}일 ${hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
      };

      const newComment = {
        id: response.data.id,
        content,
        userName: tokenUserName,
        createdAt: formatDate(),
        isNew: true,
      };

      onAddComment(newComment);
      alert("댓글이 성공적으로 추가되었습니다.");
      setContent("");
    } catch (error) {
      console.error("댓글 추가 중 오류:", error);
      alert("댓글 추가 중 오류가 발생했습니다.");
    }
  };

  const handleContentChange = (content: string) => {
    setContent(content);
  };

  return (
    <FormContainer>
      <StyledTextArea
        width="98%"
        height="100%"
        value={content}
        onChange={handleContentChange}
        placeholder="내용을 입력하세요."
      />
      <StyledButton
        textcolor="black"
        backcolor="transparent"
        width={"30%"}
        onClick={handleSubmit}
        height={"100%"}
      >
        작성
      </StyledButton>
    </FormContainer>
  );
};

export default CommentForm;
