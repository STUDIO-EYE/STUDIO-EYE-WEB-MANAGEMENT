import React, { useEffect, useState } from "react";
import styled from "styled-components";
import commentApi from "../../api/commentApi";
import jwt_decode from "jwt-decode";
import InputText from "Components/common/InputText";
import TextArea from "Components/common/TextArea";
import NewButton from "Components/common/NewButton";
import { orange } from "@mui/material/colors";
import { theme } from "LightTheme";
import { ContentState, EditorState, convertToRaw } from 'draft-js';

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  padding: 20px;
  background-color: #F9FBFD;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.08);
  border-radius: 10px;
`;

const StyledButton = styled.button`
  width: fit-content;
  height: fit-content;
  font-family: 'Pretendard';
  font-size: 0.9rem;
  border: none;
  font-weight: 600;
  outline: none;
  cursor: pointer;
  background-color: transparent;
  &:hover {
    color: gray;
  }
`;

const StyledTextArea = styled.textarea`
font-family: 'pretendard';
  width: 95%;
  height: 3rem;
  padding: 10px;
  font-size: 1rem;
  font-weight: 400;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: none;

  &:focus {
    outline: none;
  }
`;

const TextButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`

const TextCounter = styled.span`
color: lightgray;
  font-size: 0.9rem;
`;

const MAX_TEXT_LENGTH = 255;

const CommentForm = ({ onAddComment, postId, selectedPost }: { onAddComment: any; postId: number; selectedPost: any }) => {
  const [content, setContent] = useState("");
  const [tokenUserName, setTokenUserName] = useState("");
  const token = sessionStorage.getItem("login-token");
  const [textValue, setTextValue] = useState('');
  const [textLength, setTextLength] = useState(0);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newTextValue = e.target.value;
    setTextValue(newTextValue);
    setTextLength(newTextValue.length);
  };

  useEffect(() => {
    if (token) {
      const decodedToken: any = jwt_decode(token);
      setTokenUserName(decodedToken.username);
    }
  }, []);

  const handleSubmit = async () => {
    try {
      if (!textValue.trim()) {
        alert("내용을 입력해주세요.");
        return;
      }

      const response = await commentApi.postComment(postId, { content: textValue });

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
      setTextValue("");
      setTextLength(0);
    } catch (error) {
      console.error("댓글 추가 중 오류:", error);
      alert("댓글 추가 중 오류가 발생했습니다.");
    }
  };

  return (
    <FormContainer>
      <StyledTextArea
        placeholder={'내용을 입력하세요.'}
        value={textValue}
        onChange={handleTextChange}
        maxLength={MAX_TEXT_LENGTH}
        style={{ whiteSpace: 'pre-wrap' }}
      />
      <TextButtonWrapper>
        <TextCounter>
          {textLength}/{MAX_TEXT_LENGTH}자
        </TextCounter>
        <StyledButton onClick={handleSubmit}>
          작성
        </StyledButton>
      </TextButtonWrapper>
    </FormContainer>
  );
};

export default CommentForm;