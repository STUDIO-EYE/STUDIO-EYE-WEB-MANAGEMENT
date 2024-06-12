import React, { useState, useEffect } from "react";
import styled from "styled-components";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useParams } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import boardApi from "../../api/boardApi";
import HorizontalLine from "Components/common/HorizontalLine"
import axios from "axios";
import jwt_decode from "jwt-decode";
import { Dropdown, DropdownItem } from "Components/common/DropDownBox";
import { FaEdit, FaTrash } from "react-icons/fa";
import NewButton from "Components/common/NewButton";
import { theme } from "LightTheme";

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 30rem;
  padding: 0 0.5rem;
  //overflow-y: auto;
`;

const TitleInput = styled.input`
  border: none;
  width: 99%;
  height: 2rem;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  border-bottom: 2px solid #ccc;
  outline: none;
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

const ViewTitleInput = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 0.1rem;
  padding-right: 1rem;
  padding-left: 1rem;
`;

const Title = styled.span`
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0.5rem 0 0 0;
`;

const AuthorDateDropDownContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
`;

const AuthorAndDate = styled.span`
  font-size: 0.9rem;
  color: gray;
  display: flex;
  align-items: top;
`;

const DropDownWrapper = styled.div`
  position: relative;
  bottom: 0.2rem;
`

const Content = styled.div`
  padding-right: 1rem;
  padding-left: 1rem;
  margin-top: 0.1rem;
  margin-bottom: 0.1rem;
  min-height: 10rem;
  white-space: nowrap;

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

const FileInput = styled.input`
  display: none;
`;

const SelectedFileLabel = styled.label`
  display: block;
  cursor: pointer;
  margin-top: 0.5rem;
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

const FileNameLink = styled.a`
  color: black;
  font-size: 1rem;
  width: 80%;
  margin-top: 10px;
  text-decoration: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  &:hover {
    text-decoration: underline;
  }
`;

const ViewWritingPage = ({ selectedRowId, projectId, postId }
  : { selectedRowId: number, projectId: number, postId: number }) => {
  const [editorHtml, setEditorHtml] = useState("");
  const [title, setTitle] = useState("");
  const [showViewWriting, setShowViewWriting] = useState(true);
  const [showPutWriting, setShowPutWriting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [tempExistingFiles, setTempExistingFiles]=useState<File[]>([]);
  const [existingFiles, setExistingFiles] = useState<File[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPost, setSelectedPost] = useState({
    commentId: 0,
    title: "",
    content: "",
    author: "",
    date: "",
    commentCount: 0,
    category: "",
    updatedAt: ""
  });
  const { category } = useParams();
  const navigate = useNavigate();

  const [tokenUserName, setTokenUserName] = useState("");
  const token = sessionStorage.getItem("login-token");
  useEffect(() => {
    if (token) {
      const decodedToken: any = jwt_decode(token)
      setTokenUserName(decodedToken.username);
    }
  }, []);

  const [filePaths, setFilePaths] = useState<string[]>([]);
  const [fileNames, setFileNames] = useState<string[]>([]);

  // async function urlToFile(url: string, fileName: string):Promise<File> {
  //   try {
  //     console.log("경로"+url)
  //     const response = await fetch(url);
  //     const blob = await response.blob();
  //     console.log(blob)
  //     return new File([blob], fileName);
  //   } catch (error) {
  //     console.error('Error URL to file:', error);
  //     throw error;
  //   }
  // }

  useEffect(() => {
    fetchFiles();
  }, [projectId, selectedRowId]);

  const fetchFiles = async () => {
    try {
      const response = await axios.get(`/api/posts/files?projectId=${projectId}&postId=${postId}`);
      const files = response.data.list;

      if (!Array.isArray(files)) {
        throw new Error("Files 응답이 배열이 아닙니다");
      }

      const existingFilesArray = files.map((file: { fileName: string, filePath: string }) => {
        if (!file.fileName || !file.filePath) {
          throw new Error("파일 객체에 예상된 속성이 없습니다");
        }
        return new File([], file.fileName);
      });

      setExistingFiles(existingFilesArray);

      const paths = files.map((file: { filePath: string }) => file.filePath);
      const names = files.map((file: { fileName: string }) => file.fileName);
      setFilePaths(paths);
      setFileNames(names);
    } catch (error) {
      console.error("파일을 가져오는 중 오류 발생:", error);
    }

    // try {
    //   const response = await axios.get(`/api/posts/files?projectId=${projectId}&postId=${postId}`);
    //   const files = response.data.list;
    //   if (!Array.isArray(files)) {
    //     throw new Error("Files 응답이 배열이 아닙니다");
    //   }
    //   const existingFilesArray = await Promise.all(
    //     files.map(async (file: { fileName: string, filePath: string }) => {
    //     if (!file.fileName || !file.filePath) {
    //       throw new Error("파일 객체에 예상된 속성이 없습니다");
    //     }
    //     const splitUrl=file.filePath.split("/")
    //     const convertedFile=await urlToFile(splitUrl[splitUrl.length-1],file.fileName)
    //     console.log(convertedFile)
    //     return convertedFile;
    //   }),)

    //   setExistingFiles(existingFilesArray);

    //   const paths = files.map((file: { filePath: string }) => file.filePath);
    //   const names = files.map((file: { fileName: string }) => file.fileName);
    //   setFilePaths(paths);
    //   setFileNames(names);
    // } catch (error) {
    //   console.error("파일을 가져오는 중 오류 발생:", error);
    // }
  };
  

  const goToPreviousPage = () => {
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const putWriting = async () => {
    if (!title.trim() || !editorHtml.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    const updatedPostData = {
      projectId: projectId.toString(),
      title: title,
      postId: selectedRowId,
      content: editorHtml,
      category: selectedPost.category,
      updatedAt: selectedPost.updatedAt,
    };

    const formData = new FormData();

    const json = JSON.stringify(updatedPostData);
    const blob = new Blob([json], { type: 'application/json' });

    formData.append("updatePostRequestDto", blob);

    const allFiles = [...existingFiles, ...selectedFiles];

    if (selectedFiles) {
      allFiles.forEach(file => {
        formData.append("files", file);
      })
    } else if (existingFiles) {
      existingFiles.forEach(file => {
        formData.append("files", file);
      })
    } else {
      formData.append("files", "");
    }

    try {
      const response = await boardApi.putBoard(formData);
      if (response.data.success) {
        alert("게시글이 성공적으로 수정되었습니다.");
        setTitle("");
        setEditorHtml("");
        setSelectedFiles([]);
        goToPreviousPage();
      } else {
        alert("게시글 수정 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("Error modifying post:", error);
      alert("각 게시글은 100MB 이하의 용량만 수용 가능합니다.");
    }
  };

  const deletePost = async () => {
    const token = sessionStorage.getItem('login-token');
    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }

    const confirmDelete = window.confirm("정말로 게시글을 삭제하시겠습니까?");
    if (!confirmDelete) {
      return;
    }

    try {
      await boardApi.deleteBoard({
        data: { projectId, postId: selectedRowId }
      });
      alert("게시글이 성공적으로 삭제되었습니다.");

      let redirectPath = '';
      switch (selectedPost.category) {
        case 'MAKING':
          redirectPath = `MakingMain`;
          break;
        case 'EDITING':
          redirectPath = `EditingMain`;
          break;
        case 'PLANNING':
          redirectPath = `PlanMain`;
          break;
      }
      navigate(`/${redirectPath}/${projectId}`);
      window.location.reload(); // ...
    } catch (error) {
      console.error("게시글 삭제 중 오류 발생:", error);
      alert("게시글 삭제 중 오류가 발생했습니다.");
    }
  };

  const changePutView = () => {
    setTitle(selectedPost.title);
    setEditorHtml(selectedPost.content);
    setIsEditing(true);
    setShowViewWriting(false);
    setShowPutWriting(true);
  };

  const handleCancel = () => {
    if (isEditing) {
      const confirmCancel = window.confirm("작성 중인 내용이 있습니다. 그래도 나가시겠습니까?");
      if (confirmCancel) {
        setIsEditing(false);
        let redirectPath = '';
        switch (selectedPost.category) {
          case 'MAKING':
            redirectPath = `MakingMain`;
            break;
          case 'EDITING':
            redirectPath = `EditingMain`;
            break;
          case 'PLANNING':
            redirectPath = `PlanMain`;
            break;
        }
        navigate(`/${redirectPath}/${projectId}`);
        window.location.reload(); // ...
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postResponse] = await Promise.all([
          boardApi.getBoard({ projectId, postId: selectedRowId }),
        ]);
        const postInfo = postResponse.data.data;
        setSelectedPost({
          commentId: postInfo.id,
          title: postInfo.title,
          content: postInfo.content,
          author: postInfo.userName,
          date: postInfo.startDate,
          commentCount: postInfo.commentSum,
          category: postInfo.category,
          updatedAt: postInfo.updatedAt,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedRowId, projectId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesToAdd = Array.from(e.target.files);
      console.log(filesToAdd)
      setSelectedFiles((prevFiles) => [...prevFiles, ...filesToAdd]);
    }
  };

  const handleDeleteFile = (fileNameToDelete: string, isExistingFile: boolean) => {
    const confirmDelete = window.confirm("정말로 해당 파일을 삭제하시겠습니까?");
    if (!confirmDelete) {
      return;
    }

    try {
      if (isExistingFile) {
        setExistingFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileNameToDelete));
      } else {
        setSelectedFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileNameToDelete));
      }
    } catch (error) {
      console.error("게시글 삭제 중 오류 발생:", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const updatedAtDate = new Date(selectedPost.updatedAt);
  const formattedUpdatedAt = `${updatedAtDate.getFullYear()}년 ${String(updatedAtDate.getMonth() + 1).padStart(2, '0')}월 ${String(updatedAtDate.getDate()).padStart(2, '0')}일 ${String(updatedAtDate.getHours()).padStart(2, '0')}:${String(updatedAtDate.getMinutes()).padStart(2, '0')}:${String(updatedAtDate.getSeconds()).padStart(2, '0')}`;

  //조회하면 showViewWriting + 수정화면 showPutWriting
  return (
    <>
      {showViewWriting ? (
        <>
          <FormContainer>
            <ViewTitleInput>
              <Title>{selectedPost.title}</Title>
              <AuthorDateDropDownContainer>
                <AuthorAndDate>
                  작성자 {selectedPost.author} | 작성 {selectedPost.date} | 수정 {formattedUpdatedAt}
                </AuthorAndDate>
                {
                  tokenUserName === selectedPost.author && (
                    <>
                      <DropDownWrapper>
                        <Dropdown>
                          <DropdownItem onClick={changePutView} style={{ color: 'green' }}>
                            <FaEdit /> 수정
                          </DropdownItem>
                          <DropdownItem onClick={deletePost} style={{ color: 'red' }}>
                            <FaTrash /> 삭제
                          </DropdownItem>
                        </Dropdown>
                      </DropDownWrapper>
                    </>
                  )}
              </AuthorDateDropDownContainer>
            </ViewTitleInput>
            <HorizontalLine />
            <Content dangerouslySetInnerHTML={{ __html: selectedPost.content.replace(/\n/g, '<br>') }} />
            {fileNames.length > 0 && (
              <div>
                <h4>첨부파일</h4>
                {fileNames.map((fileName, index) => (
                  <div key={fileName}>
                    <FileNameLink href={filePaths[index]} download>
                      {fileName}
                    </FileNameLink>
                  </div>
                ))}
              </div>
            )}
          </FormContainer>
        </>
      ) : showPutWriting ? (
        <>
          <FormContainer>
            <TitleInput
              type="text"
              placeholder="제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <button onClick={()=>{
          console.log(selectedFiles)
          console.log(existingFiles)
        }}>흥냥냐</button>
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
                      <DeleteFileButton onClick={() => handleDeleteFile(file.name, false)}>삭제</DeleteFileButton>
                    </div>
                  ))}
                </SelectedFilePreview>
                <SelectedFilePreview>
                  {existingFiles.map((file) => (
                    <div key={file.name}>
                      {file.name}
                      <DeleteFileButton onClick={() => handleDeleteFile(file.name, true)} > 삭제 </DeleteFileButton>
                    </div>
                  ))}
                </SelectedFilePreview>
              </FileContainer>
              <PostsButtonContainer>
                <NewButton onClick={putWriting} textcolor="white" backcolor={theme.color.orange} width={"6rem"} height={"2rem"} style={{ marginLeft: '1rem' }}>등록</NewButton>
                <NewButton onClick={handleCancel} textcolor="black" backcolor={theme.color.white} width={"6rem"} height={"2rem"}>취소</NewButton>
              </PostsButtonContainer>
            </FileButtonWrapper>
          </FormContainer>
        </>
      ) : null
      }
    </>
  );
};

export default ViewWritingPage;