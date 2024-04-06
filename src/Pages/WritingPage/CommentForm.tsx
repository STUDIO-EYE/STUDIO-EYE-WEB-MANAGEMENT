// CommentForm.js
import React, {useEffect, useState} from "react";
import styled from "styled-components";
import commentApi from "../../api/commentApi";
import jwt_decode from "jwt-decode";
import { theme } from "LightTheme";
import InputText from "Components/common/InputText";
import TextArea from "Components/common/TextArea";
import WhiteButton from "Components/common/NewButton";
import NewButton from "Components/common/NewButton";

const FormContainer = styled.div`
  width:100%;
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-content:center;
`;

const CommentForm = ({ onAddComment, postId, selectedPost }
  :{onAddComment:any,postId:number,selectedPost:any}) => {
  const [content, setContent] = useState("");
  const [tokenUserName, setTokenUserName] = useState("");
  const token = sessionStorage.getItem("login-token");
  useEffect(() => {

    if (token) {
      const decodedToken:any = jwt_decode(token);
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

  const handleContentChange=(content:string)=>{
    setContent(content);
  };

  const tokencheck=()=>{
    console.log(sessionStorage.getItem('login-token'))
  };

  return (
    <FormContainer>
        <TextArea
          width="95%" height="100%"
          value={content}
          onChange={handleContentChange}
          placeholder="내용 입력"
        />
        <NewButton textcolor="white"
        backcolor={theme.color.orange}
        width={"100%"}
        onClick={handleSubmit}
        height={"100%"}>작성하기</NewButton>
    </FormContainer>
  );
};

export default CommentForm;
