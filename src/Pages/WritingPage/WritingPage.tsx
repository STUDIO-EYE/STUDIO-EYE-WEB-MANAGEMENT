import React, { useState } from "react";
import Body from "../../Components/common/Body";
import styled from "styled-components";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import boardApi from "../../api/boardApi";
import axios from "axios";
import { TableText, TextMd } from "Components/common/Font";
import InputText from "Components/common/InputText";
import Button from "Components/common/Button";
import NewButton from "Components/common/NewButton";
import { theme } from "LightTheme";
import { left } from "@popperjs/core";

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 30rem;
  max-width: 70rem;
  padding: 0 0.5rem;
  overflow-y: auto;
`;

const CustomQuillEditor = styled(ReactQuill)`

  .ql-editor {
    min-height: 20rem;
  }

  .ql-container {
    border: 1px solid #ccc;
    border-radius: 15px;
  }

  .ql-toolbar {
    background-color: rgba(0, 0, 0, 0.03);
    border-radius: 15px;
  }
`;

const WritingTitle = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: black;
`;

const PostsButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const FileInput = styled.input`
  display: none;
`;

const SelectedFileLabel = styled.label`
  display: block;
  cursor: pointer;
  margin-top: 0.5rem;
`;

const WritingPage = ({ projectId, category }: { projectId: number; category: string }) => {
  const [editorHtml, setEditorHtml] = useState("");
  const [title, setTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const navigate = useNavigate();

  const handleContentChange = (content: string) => {
    setTitle(content);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const addPost = async () => {
    // HTML 태그 제거하기 위한 정규식
    const strippedHtml = editorHtml.replace(/<[^>]+>/g, "");

    // 제목 또는 에디터 내용이 비어있는지 확인
    if (!title.trim() || !strippedHtml.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return; // 함수 실행 종료
    }

    // FormData 생성
    const formData = new FormData();
    formData.append("projectId", projectId.toString());
    formData.append("title", title);
    formData.append("category", category);

    formData.append("content", strippedHtml);

    if (selectedFile) {
      formData.append("file", selectedFile);
    }

    try {
      // 백엔드 API 호출하여 게시글 작성
      const response = await boardApi.postBoard(formData);
      if (response.data.success) {
        alert("게시글이 성공적으로 작성되었습니다.");
        setTimeout(function () {
          window.location.reload();
        }, 100);

        setTitle("");
        setEditorHtml("");
        setSelectedFile(null);

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
          alert("해당 사용자는" + response.data.message);
        }
      } else {
        alert("게시글 작성 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert("게시글 작성 중 오류가 발생했습니다.");
    }
  };

  const goToPreviousPage = () => {
    setTimeout(function () {
      window.location.reload();
    }, 100);
  };

  return (
    <>
      <FormContainer>
        <WritingTitle style={{ margin: "0.5rem 0" }}>제목</WritingTitle>
        <InputText
          placeholder="제목을 입력하세요."
          value={title}
          onChange={handleContentChange}
          width={"99%"}
          height="2rem"
        />
        <CustomQuillEditor
          value={editorHtml}
          onChange={setEditorHtml}
          modules={{
            toolbar: [
              ["bold", "italic", "underline", "strike"],
              ["video"],
              [{ font: [] }],
              [{ size: ["small", false, "large", "huge"] }],
              ["clean"],
            ],
          }}
        />
        <FileInput
          type="file"
          id="file"
          onChange={handleFileChange}
          accept="image/*, application/pdf" // 이미지와 pdf 파일만 허용하는 걸로
        />
        <SelectedFileLabel htmlFor="file">파일 선택</SelectedFileLabel>
        {selectedFile && <div>{selectedFile.name}</div>}
      </FormContainer>
      <PostsButtonContainer>
        <NewButton
          onClick={addPost}
          textcolor="white"
          backcolor={theme.color.orange}
          width={"6rem"}
          height={"2rem"}
          style={{ marginLeft: "1rem" }}
        >
          등록
        </NewButton>
        <NewButton
          onClick={goToPreviousPage}
          textcolor="black"
          backcolor={theme.color.white}
          width={"6rem"}
          height={"2rem"}
        >
          취소
        </NewButton>
      </PostsButtonContainer>
    </>
  );
};

export default WritingPage;
