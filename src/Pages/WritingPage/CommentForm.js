// CommentForm.js
import React, {useEffect, useState} from "react";
import styled from "styled-components";
import CommentIMG from "./CommentButton.png";
import CommentHoverIMG from "./CommentButtonHover.png";
import commentApi from "../../api/commentApi";
import jwt_decode from "jwt-decode";

const FormContainer = styled.div`
  align-items: center; /* 요소를 세로 가운데 정렬 */
  border-top: 1px solid darkgray; /* 위쪽 선 스타일 */
  padding: 1% 5%; /* 위아래 여백 추가 */
`;

const CommentTextarea = styled.textarea`
  width: 80%;
  padding: 0.1rem;
  margin-right: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  color: #999;
  max-height: 1.7rem;
  min-height: 1.7rem;
  resize: none;
  font-size: 1rem;
  vertical-align: middle;

  &:focus {
    outline: 1px solid gray;
  }
`;

const SubmitButton = styled.button`
  background-image: url(${CommentIMG});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  width: 35px; // 이미지의 원본 크기에 맞게 조절
  height: 28px;
  background-color: #eeeeee;
  color: white;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  vertical-align: middle;
  border-radius: 4px;
  &:hover {
    background-color: gray;
    background-image: url(${CommentHoverIMG});
  }
`;

const CommentForm = ({ onAddComment, postId, selectedPost }) => {
  const [content, setContent] = useState("");
  const [tokenUserName, setTokenUserName] = useState("");
  const token = sessionStorage.getItem("login-token");
  useEffect(() => {

    if (token) {
      const decodedToken = jwt_decode(token);
      setTokenUserName(decodedToken.username);
    }
  }, []);
  const handleSubmit = async () => {
    try {


      // 서버에 댓글 추가 요청
      const response = await commentApi.postComment(postId, {
        content: content,
      });

      const formatDate = () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // 월은 0부터 시작하므로 1을 더함
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();

        return `${year}년 ${month}월 ${day}일 ${hours}:${
          minutes < 10 ? "0" + minutes : minutes
        }:${seconds < 10 ? "0" + seconds : seconds}`;
      };
      const newComment = {
        id: response.data.id, // 서버에서 반환된 ID
        content: content,
        userName: tokenUserName, // 현재 로그인한 사용자 정보
        createdAt: formatDate(), // 현재 시간
        isNew: true,
      };

      onAddComment(newComment);
      alert("댓글이 성공적으로 추가되었습니다.");
      setContent("");
    } catch (error) {
      console.error("댓글 추가 중 오류 발생:", error);
      alert("댓글 추가 중 오류가 발생했습니다.");
    }
  };

  return (
    <FormContainer>
      <>
        <CommentTextarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="댓글 추가..."
        />
        <SubmitButton onClick={handleSubmit}></SubmitButton>
      </>
    </FormContainer>
  );
};

export default CommentForm;
