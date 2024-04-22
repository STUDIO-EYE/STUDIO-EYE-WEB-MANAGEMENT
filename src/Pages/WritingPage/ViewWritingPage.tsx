import React, { useState, useEffect } from "react";
import styled from "styled-components";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList"; // Quill Editor의 스타일을 불러옵니다.
import "react-quill/dist/quill.snow.css";
import boardApi from "../../api/boardApi";
import commentApi from "../../api/commentApi";
import HorizontalLine from "Components/common/HorizontalLine"
import axios from "axios";
import jwt_decode from "jwt-decode";
// WritingMainPage.js

interface PostInfo {
  id: number
  title: string
  content: string
  userName: string
  startDate: string
  commentSum: number
  category: string,
  updatedAt: string
}

/////////제목,내용/////////
const FormContainer = styled.div`
  max-height: 30rem; /* 댓글 컨테이너의 최대 높이 */
  max-width: 70rem;
  padding-left: 1%;
  padding-right: 1%;
  overflow-y: auto; /* 스크롤 가능하도록 설정 */
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
const CustomQuillEditor = styled(ReactQuill)`
  /* 퀼 에디터의 커스텀 스타일 */

  .ql-editor {
    min-height: 28rem; /* 최소 높이 설정 */
  }

  .ql-container {
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  .ql-toolbar {
    /* 툴바 스타일 설정 */
    background-color: #ccc; /* 툴바 배경색을 파란색으로 변경 */
    border-radius: 5px; /* 툴바 테두리 모서리 둥글게 설정 */
  }
`;

////////////버튼/////////////
const PostsButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;
const PostsButton = styled.button`
  width: 5.5rem;
  height: 2rem;
  margin: 0.5%;
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
//////////글쓰기 조회//////////
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
  margin: 0.5rem 0 0.5rem 0;
`;

const AuthorAndDate = styled.span`
  font-size: 0.7rem;
  color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: top;
`;
//////내용부분/////////////
const Content = styled.div`
  padding-right: 1rem;
  padding-left: 1rem;
  margin-top: 0.1rem;
  margin-bottom: 0.1rem;
  min-height: 10rem;
  .ql-font-serif {
    font-family: Georgia, Times New Roman, serif, "Courier New", Courier,
      monospace;
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
  margin-top: 0.5rem;
  color: red;
`;


const ViewWritingPage = ({ selectedRowId, projectId, postId }
  : { selectedRowId: number, projectId: number, postId: number }) => {
  const [editorHtml, setEditorHtml] = useState(""); // Quill Editor의 HTML 내용을 저장하는 상태
  const [title, setTitle] = useState(""); // 제목을 저장하는 상태
  const [showViewWriting, setShowViewWriting] = useState(true);
  const [showPutWriting, setShowPutWriting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [existingFiles, setExistingFiles] = useState<File[]>([]);
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
  const navigate = useNavigate();

  const [tokenUserName, setTokenUserName] = useState("");
  const token = sessionStorage.getItem("login-token");
  useEffect(() => {
    if (token) {
      const decodedToken: any = jwt_decode(token)
      setTokenUserName(decodedToken.username);
    }
  }, []);

  const goToPreviousPage = () => {
    setTimeout(function () {
      window.location.reload();
    }, 100);
  };
  const goToHome = () => {
    navigate(`/manage/${projectId}`);
  };

  const putWriting = () => {
    if (!title.trim() || !editorHtml.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }
  
    const updatedPostData = {
      projectId: projectId,
      postId: selectedRowId,
      title: title,
      content: editorHtml,
      category: selectedPost.category,
      updatedAt: selectedPost.updatedAt,
    };
  
    const json = JSON.stringify(updatedPostData);
    const blob = new Blob([json], { type: 'application/json' });
  
    const formData = new FormData();
    formData.append("updatePostRequestDto", blob);
  
    // 기존 파일과 새로 선택한 파일을 모두 합쳐서 formData에 추가
    const allFiles = [...existingFiles, ...selectedFiles];
    allFiles.forEach((file) => formData.append("files", file));
  
    boardApi
      .putBoard(formData)
      .then((response) => {
        alert("게시글이 성공적으로 업데이트 되었습니다.");
        setTitle(""); // 필드 초기화
        setEditorHtml("");
        setSelectedFiles([]); // 선택된 파일을 초기화
        goToHome();
      })
      .catch((error) => {
        console.error("Error updating post:", error);
        alert("게시글 업데이트 중 오류가 발생했습니다.");
      });
  };
  

  //게시글 삭제 함수
  const deletePost = () => {
    const token = sessionStorage.getItem('login-token');
    console.log(token);

    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }

    boardApi
      .deleteBoard({
        data: {
          projectId: projectId,
          postId: selectedRowId
        }
      })
      .then(() => {
        alert("게시글이 성공적으로 삭제되었습니다.");
        if (postId) {
          goToHome();
        } else {
          goToPreviousPage();
        }
      })
      .catch((error) => {
        console.error("Error deleting post:", error);
        alert("게시글 삭제 중 오류가 발생했습니다.");
      });
  };

  const changePutView = () => {
    setTitle(selectedPost.title);
    setEditorHtml(selectedPost.content);

    setShowViewWriting(false);
    setShowPutWriting(true);
  };
  // 게시글 내용을 담을 객체 나중에 DB연결하면 내용 set해주기

  useEffect(() => {
    // 병렬로 API 호출을 수행하는 함수
    const fetchData = async () => {
      try {
        const [postResponse] = await Promise.all([
          boardApi.getBoard({ projectId: projectId, postId: selectedRowId }),
        ]);
        // postResponse 처리

        const postInfo: PostInfo = postResponse.data.data;
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

  const [filePaths, setFilePaths] = useState<string[]>([]);
  const [fileNames, setFileNames] = useState<string[]>([]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get(`/api/posts/files?projectId=${projectId}&postId=${postId}`);
        const files = response.data.list;
  
        // 기존 파일 목록을 File 객체로 변환하고 existingFiles에 저장
        const existingFilesArray = files.map((file: any) => new File([], file.fileName));
        setExistingFiles(existingFilesArray); // 기존 파일 상태 업데이트
  
        const paths = files.map((file: any) => file.filePath);
        const names = files.map((file: any) => file.fileName);
        setFilePaths(paths);
        setFileNames(names);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };
  
    fetchFiles();
  }, [projectId, selectedRowId]);
  

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesToAdd = Array.from(e.target.files);
      setSelectedFiles((prevFiles) => [...prevFiles, ...filesToAdd]);
    }
  };

  // 파일 삭제 핸들러
  const handleDeleteFile = (fileNameToDelete: string, isExistingFile: boolean) => {
    if (isExistingFile) {
      // 기존 파일 목록에서 파일을 삭제
      setExistingFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileNameToDelete));
    } else {
      // 새로 선택한 파일 목록에서 파일을 삭제
      setSelectedFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileNameToDelete));
    }
  };

  // 수정 시간
  const updatedAtDate = new Date(selectedPost.updatedAt);
  const formattedUpdatedAt = `${updatedAtDate.getFullYear()}년 ${String(updatedAtDate.getMonth() + 1).padStart(2, '0')}월 ${String(updatedAtDate.getDate()).padStart(2, '0')}일 ${String(updatedAtDate.getHours()).padStart(2, '0')}:${String(updatedAtDate.getMinutes()).padStart(2, '0')}:${String(updatedAtDate.getSeconds()).padStart(2, '0')}`;

  //조회하면 showViewWriting + 수정화면 showPutWriting
  return (
    <>
      {console.log(tokenUserName)}
      {console.log(selectedPost.author)}
      {showViewWriting ? (
        <>
          <FormContainer>
            <ViewTitleInput>
              <Title>{selectedPost.title}</Title>
              <AuthorAndDate>
                작성자: {selectedPost.author} | 작성일시: {selectedPost.date}
              </AuthorAndDate>
              <AuthorAndDate>
                <span>마지막 수정 시간: {formattedUpdatedAt}</span>
              </AuthorAndDate>
            </ViewTitleInput>
            <HorizontalLine />
            <Content dangerouslySetInnerHTML={{ __html: selectedPost.content }} />
            {/* 파일 미리보기
            {filePaths.map((filePath, index, fileName) => (
              <div key={index}>
                {filePath.endsWith(".png") || filePath.endsWith(".jpg") || filePath.endsWith(".jpeg") ? (
                  <img src={filePath} alt="파일 미리보기" />
                ) : (
                  <div>
                    파일: {fileName}<a href={filePath} download>다운로드</a>
                  </div>
                )}
              </div>
            ))} */}

            {/* 첨부파일을 목록으로 표시 */}
            {fileNames.length > 0 && (
              <div>
                <h4>첨부파일</h4>
                {fileNames.map((fileName, index) => (
                  <div key={index}>
                    {fileName} <a href={filePaths[index]} download>다운로드</a>
                  </div>
                ))}
              </div>
            )}

          </FormContainer>
          <PostsButtonContainer>
            {
              tokenUserName == selectedPost.author && (
                <>
                  <PostsButton onClick={changePutView}>수정</PostsButton>
                  <PostsButton onClick={deletePost}>삭제</PostsButton>
                </>
              )}

            {postId ? (
              <PostsButton onClick={goToHome}>취소</PostsButton>
            ) : (
              <PostsButton onClick={goToPreviousPage}>취소</PostsButton>
            )}
          </PostsButtonContainer>
        </>
      ) : showPutWriting ? (
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
                  // ['image', 'video'], // 이미지와 동영상 추가
                  [{ font: [] }], // 글꼴 선택
                  [{ size: ["small", false, "large", "huge"] }], // 텍스트 크기
                  ["clean"],
                ],
              }}
            />
            <FileInput
              type="file"
              id="file"
              onChange={handleFileChange}
              accept="image/*, application/pdf"
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
            {/* 파일 미리보기
            {filePaths.map((filePath, index) => (
              <div key={index}>
                {filePath.endsWith(".png") || filePath.endsWith(".jpg") || filePath.endsWith(".jpeg") ? (
                  <img src={filePath} alt="파일 미리보기" />
                ) : (
                  <div>
                    파일: <a href={filePath} download>다운로드</a>
                  </div>
                )}
              </div>
            ))} */}
            {/* 기존 파일 목록에서도 삭제 버튼 추가 */}
            {existingFiles.map((file) => (
                <div key={file.name}>
                  {file.name}
                  <DeleteFileButton
                    onClick={() => handleDeleteFile(file.name, true)}
                  >
                    삭제
                  </DeleteFileButton>
                </div>
              ))}
          </FormContainer>
          <PostsButtonContainer>
            <PostsButton onClick={putWriting}>완료</PostsButton>
            <PostsButton onClick={goToPreviousPage}>취소</PostsButton>
          </PostsButtonContainer>
        </>
      ) : null}
    </>
  );
};

export default ViewWritingPage;
