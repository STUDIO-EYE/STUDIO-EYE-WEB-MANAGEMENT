import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { NavigateOptions, useNavigate } from "react-router-dom";
import boardApi from "../../api/boardApi";
import axios from "axios";
import InputText from "Components/common/InputText";
import NewButton from "Components/common/NewButton";
import { theme } from "LightTheme";

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 30rem;
  padding: 0 0.5rem;
  //overflow-y: auto;
`;

const CustomQuillEditor = styled(ReactQuill)`
  resize: none;
  margin-top: 1rem;

  .ql-editor {
    height: 50vh;
    overflow: auto;
  }

  .ql-container {
    border: 1px solid ${theme.color.gray20};
    border-radius: 0 0 10px 10px;
  }

  .ql-toolbar {
    background-color: rgba(0, 0, 0, 0.03);
    border: 1px solid ${theme.color.gray20};
    border-radius: 10px 10px 0 0;
  }

  .ql-size-huge {
    font-size: 2.5em;
  }
  .ql-size-large {
    font-size: 1.5em;
  }
  .ql-size-small {
    font-size: 0.75em;
  }
  .ql-bold {
    font-weight: 800;
  }
  .ql-italic {
    font-style: italic;
  }
  .ql-underline {
    text-decoration: underline;
  }
  .ql-strike {
    text-decoration: overline;
}
`;

const FileButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
`;

const PostsButtonContainer = styled.div`
  width: 50%;
  gap: 1rem;
  display: flex;
  justify-content: flex-end;
`;

const FileContainer = styled.div`
  width: 50%;
`;

const FileInput = styled.input`
  display: none;
`;

const SelectedFileLabel = styled.label`
  display: block;
  cursor: pointer;
  font-weight: 600;
  &:hover {
    font-weight: 800;
  }
`;

const SelectedFilePreview = styled.div`
  margin-top: 0.5rem;
`;

const DeleteFileButton = styled.button`
  margin-left: 0.5rem;
  background-color: transparent;
  border: none;
  color: red;
  cursor: pointer;
  &:hover {
    font-weight: 600;
  }
`;

const WritingPage = ({ projectId, category, onBack }: { projectId: number, category: string, onBack: any; }) => {

  const [editorHtml, setEditorHtml] = useState("");
  const [title, setTitle] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  // const [isDirty, setIsDirty] = useState(false);

  // const beforeUnloadHandler = useCallback(
  //   (event: BeforeUnloadEvent) => {
  //     // 페이지를 벗어나지 않아야 하는 경우
  //     if (isDirty) {
  //       event.preventDefault();
  //       event.returnValue = true;
  //     }
  //   },
  //   [isDirty],
  // );
  
  // useEffect(() => {
  //   const originalPush = router.push;
  //   const newPush = (
  //     href: string,
  //     options?: NavigateOptions | undefined,
  //   ): void => {
  //     // 페이지를 벗어나지 않아야 하는 경우
  //     if (isDirty && href === '/' && !confirm('')) {
  //       return;
  //     }
  
  //     originalPush(href, options);
  //     return;
  //   };
  //   router.push = newPush;
  //   window.onbeforeunload = beforeUnloadHandler;
  //   return () => {
  //     router.push = originalPush;
  //     window.onbeforeunload = null;
  //   };
  // }, [isDirty, router, beforeUnloadHandler]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (title.trim() || editorHtml.trim() || selectedFiles.length > 0) {
        event.preventDefault();
        event.returnValue = "작성 중인 내용이 있습니다. 페이지를 떠나시겠습니까?";
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [title, editorHtml, selectedFiles]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesToAdd = Array.from(e.target.files);
      const totalFileSize = filesToAdd.reduce((acc, file) => acc + file.size, 0);
      const maxSize = 100 * 1024 * 1024;

      if (totalFileSize > maxSize) {
        alert('파일 크기는 100MB를 초과할 수 없습니다.');
        e.target.value = "";
        return;
      }

      setSelectedFiles((prevFiles) => [...prevFiles, ...filesToAdd]);
    }
  };


  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTitle(e.target.value);
    setIsEditing(true);
  };

  const goToHome = () => {
    navigate(`/Manage/${projectId}`);
  };

  const addPost = async () => {
    const strippedHtml = editorHtml.replace(/<[^>]+>/g, "");

    if (!title.trim() || !strippedHtml.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    const data: { [key: string]: string } = {
      projectId: projectId.toString(),
      title: title,
      content: editorHtml,
      category: category,
    }

    const formData = new FormData();

    const json = JSON.stringify(data);
    const blob = new Blob([json], { type: 'application/json' });
    
    formData.append("createPostDto", blob);
    if (selectedFiles) {
      selectedFiles.forEach(file => {
        formData.append("files", file);
      })
    } else {
      formData.append("files", "");
    }

    try {
      const response = await boardApi.postBoard(formData);
      if (response.data.success) {
        alert("게시글이 성공적으로 작성되었습니다.");
        setTitle("");
        setEditorHtml("");
        setSelectedFiles([]);
        goToHome();
      } else {
        alert("게시글 작성 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert("게시글 작성 중 오류가 발생했습니다.");
    }
  };

  const handleDeleteFile = (fileNameToDelete: string) => {
    setSelectedFiles((prevFiles) => prevFiles.filter(file => file.name !== fileNameToDelete));
  };

  const handleCancel = () => {
    if (isEditing) {
      const confirmCancel = window.confirm("작성 중인 내용이 있습니다. 그래도 나가시겠습니까?");
      if (confirmCancel) {
        setIsEditing(false);
        goToHome();
      }
    }
  };

  return (
    <>
      <FormContainer>
        <InputText
          placeholder="제목을 입력하세요."
          value={title}
          onChange={handleContentChange}
          width={"98.5%"}
          height="3rem"
        />
        <CustomQuillEditor
          value={editorHtml}
          onChange={setEditorHtml}
          modules={{
            toolbar: [
              ["bold", "italic", "underline", "strike"],
              ['video'],
              [{ size: ["small", false, "large", "huge"] }],
            ],
          }}
        />
        <FileButtonWrapper>
          <FileContainer>
            <FileInput
              type="file"
              id="file"
              onChange={handleFileChange}
              multiple
            />
            <SelectedFileLabel htmlFor="file">파일 선택</SelectedFileLabel>
            <SelectedFilePreview>
              {selectedFiles && selectedFiles.map(file => (
                <div key={file.name}>
                  {file.name}
                  <DeleteFileButton onClick={() => handleDeleteFile(file.name)}>삭제</DeleteFileButton>
                </div>
              ))}
            </SelectedFilePreview>
          </FileContainer>
          <PostsButtonContainer>
            <NewButton onClick={addPost} textcolor="white" backcolor={theme.color.orange} width={"6rem"} height={"2rem"} style={{ marginLeft: '1rem' }}>등록</NewButton>
            <NewButton onClick={handleCancel} textcolor="black" backcolor={theme.color.white} width={"6rem"} height={"2rem"}>취소</NewButton>
          </PostsButtonContainer>
        </FileButtonWrapper>
      </FormContainer>

    </>
  );
};

export default WritingPage;