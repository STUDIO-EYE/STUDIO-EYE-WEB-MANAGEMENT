import React, { useState, useEffect } from "react";
import Body from "../../Components/common/Body";
import styled from "styled-components";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import boardApi from "../../api/boardApi";
import axios from "axios";

// WritingMainPage.js

const FormContainer = styled.div`
  max-height: 30rem; /* 컨테이너의 최대 높이 */
  max-width: 70rem;
  padding-left: 1%;
  padding-right: 1%;
  overflow-y: auto; /* 스크롤 가능하도록 설정 */
`;

const CustomQuillEditor = styled(ReactQuill)`
  /* 퀼 에디터의 커스텀 스타일 */

  .ql-editor {
    min-height: 20rem; /* 최소 높이 설정 */
  }

  .ql-container {
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  .ql-toolbar {
    /* 툴바 스타일 설정 */
    background-color: #ccc;
    border-radius: 5px;
  }
`;

const TitleInput = styled.input`
  border: none; /* 기본 테두리 제거 */
  width: 99%;
  height: 2rem;
  font-size: 1.3rem;
  margin-bottom: 1rem;
  border-bottom: 2px solid #ccc;
  outline: none;
`;

const PostsButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;
const PostsButton = styled.button`
  width: 6rem;
  height: 2rem;
  margin: 1%;
  font-size: 1rem;
  border-radius: 1rem;
  background-color: #ff530e;
  color: white;
  font-weight: bold;
  border: none;
  transition: background-color 0.3s;

  /* 마우스를 가져다 대었을 때의 스타일 */
  &:hover {
    background-color: #ff7c7c;
    color: white;
    cursor: pointer;
  }
`;

const WritingPage = ({ projectId, category }) => {
  const [editorHtml, setEditorHtml] = useState(""); // Quill Editor의 HTML 내용을 저장하는 상태
  const [title, setTitle] = useState(""); // 제목을 저장하는 상태

  const navigate = useNavigate();
  const goToPreviousPage = () => {
    setTimeout(function () {
      window.location.reload();
    }, 100);
  };

  const addPost = async () => {
    // HTML 태그 제거하기 위한 정규식
    const strippedHtml = editorHtml.replace(/<[^>]+>/g, "");

    // 제목 또는 에디터 내용이 비어있는지 확인
    if (!title.trim() || !strippedHtml.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return; // 함수 실행 종료
    }

    const postData = {
      projectId: projectId,
      title: title,
      content: editorHtml,
      category: category, // 임시로 PLANNING으로 설정. 필요에 따라 변경하세요.
    };

    try {
      // 백엔드 API 호출하여 게시글 작성
      //
      const response = await boardApi.postBoard(postData);
      if (response.data.success) {
        alert("게시글이 성공적으로 작성되었습니다.");
        setTimeout(function () {
          window.location.reload();
        }, 100);
        // 추가적인 로직 (예: 페이지 이동 또는 상태 초기화 등)
        setTitle("");
        setEditorHtml("");
        // 네비게이션 이동 또는 페이지 새로고침 로직이 필요한 경우 추가
      } else if (response.data.success === false) {
        if (response.data.code === 7000) {
          alert("로그인을 먼저 진행시켜 주시길 바랍니다.");
          navigate("/LoginPage");
        } else if (response.data.code === 7001) {
          alert("세션이 만료되었습니다. 다시 로그인 해주세요.");
          // 토큰 제거
          sessionStorage.removeItem("login-token");
          delete axios.defaults.headers.common["Authorization"];
          navigate("/LoginPage");
        } else if (response.data.code === 8000) {
          alert("해당 사용자는" + response.data.message); // "접근 권한이 없습니다."
        }
      } else {
        alert("게시글 작성 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert("게시글 작성 중 오류가 발생했습니다.");
    }
  };

  return (
    <>
      <FormContainer>
        <TitleInput
          type="text"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)} // 입력 값이 변경될 때마다 title 상태 업데이트
        />
        <CustomQuillEditor
          value={editorHtml}
          onChange={setEditorHtml}
          modules={{
            toolbar: [
              ["bold", "italic", "underline", "strike"], // 텍스트 스타일
              // [{'list': 'ordered'}, {'list': 'bullet'}],
              ["video"], // 이미지와 동영상 추가
              [{ font: [] }], // 글꼴 선택
              [{ size: ["small", false, "large", "huge"] }], // 텍스트 크기
              ["clean"],
            ],
          }}
        />
      </FormContainer>
      <PostsButtonContainer>
        <PostsButton onClick={addPost}>등록</PostsButton>
        <PostsButton onClick={goToPreviousPage}>취소</PostsButton>
      </PostsButtonContainer>
    </>
  );
};

export default WritingPage;
