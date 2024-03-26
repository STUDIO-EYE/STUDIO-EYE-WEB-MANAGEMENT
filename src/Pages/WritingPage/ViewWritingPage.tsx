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
// WritingMainPage.js

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
  border: 1px solid #ccc;
  border-radius: 5px;
  padding-right: 1rem;
  padding-left: 1rem;
`;

const Title = styled.h2`
  font-size: 1.2rem;
  margin-bottom: 0rem;
`;

const AuthorAndDate = styled.p`
  font-size: 0.8rem;
  color: gray;
  display: flex;
  align-items: center;
`;

const Dot = styled.span`
  font-size: 1rem;
  color: gray;
  margin: 0 0.2rem;
`;
const ReplyCount = styled.span`
  font-size: 0.8rem;
  color: gray;
`;
//////내용부분/////////////
const Content = styled.div`
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 1rem;
  margin-top: 0.1rem;
  margin-bottom: 0.5rem;
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
const CommentContainer = styled.div`
  background-color: #eeeeee;
  min-height: 13rem;
`;
const ViewWritingPage = ({ selectedRowId, projectId, postId }) => {
  const [editorHtml, setEditorHtml] = useState(""); // Quill Editor의 HTML 내용을 저장하는 상태
  const [title, setTitle] = useState(""); // 제목을 저장하는 상태
  const [showViewWriting, setShowViewWriting] = useState(true);
  const [showPutWriting, setShowPutWriting] = useState(false);
  const [selectedPost, setSelectedPost] = useState({
    commentId: "",
    title: "",
    content: "",
    author: "",
    date: "",
    commentCount: 0,
    category: "",
  });
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();

  const goToPreviousPage = () => {
    setTimeout(function () {
      window.location.reload();
    }, 100);
  };
  const goToHome = () => {
    navigate(`/manage/${projectId}`);
  };

  // // 글쓰기 수정 함수
  const putWiring = () => {
    // HTML 태그 제거하기 위한 정규식
    const strippedHtml = editorHtml.replace(/<[^>]+>/g, "");

    // 제목 또는 에디터 내용이 비어있는지 확인
    if (!title.trim() || !strippedHtml.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return; // 함수 실행 종료
    }

    const updatedPostData = {
      projectId: projectId,
      postId: selectedRowId,
      title: title,
      content: editorHtml,
      category: selectedPost.category, // 이미 저장된 category 정보 사용
    };

    // axios를 사용하여 PUT 요청 보내기
    boardApi
      .putBoard(updatedPostData)
      .then((response) => {
        console.log(response.data);
        alert("게시글이 성공적으로 업데이트 되었습니다.");
        setTitle(""); // 필드 초기화
        setEditorHtml("");

        if (postId) {
          goToHome();
        } else {
          goToPreviousPage();
        }
      })
      .catch((error) => {
        console.error("Error updating post:", error);
        alert("게시글 업데이트 중 오류가 발생했습니다.");
      });
  };
  const deletePost = () => {
    boardApi
      .deleteBoard({
        data: {
          projectId: projectId,
          postId: selectedRowId,
        },
      })
      .then(() => {
        alert("게시글이 성공적으로 삭제되었습니다.");
        // 게시글 삭제 후 페이지를 새로고침하거나 다른 페이지로 리다이렉트
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
  const handleAddComment = (newComment) => {
    setComments((prevComments) => [...prevComments, newComment]); //댓글 최신게 나중에 보여주기
    setSelectedPost((prevPost) => ({
      ...prevPost,
      commentCount: prevPost.commentCount + 1,
    }));
  };
  const handleDeleteComment = () => {
    setSelectedPost((prevPost) => ({
      ...prevPost,
      commentCount: prevPost.commentCount - 1,
    }));
  };

  useEffect(() => {
    // 병렬로 API 호출을 수행하는 함수
    const fetchData = async () => {
      try {
        const [postResponse, commentsResponse] = await Promise.all([
          boardApi.getBoard({ projectId: projectId, postId: selectedRowId }),
          commentApi.getCommentList({ postId: selectedRowId }),
        ]);
        // postResponse 처리
        const postInfo = postResponse.data.data;
        setSelectedPost({
          postId: postInfo.id,
          title: postInfo.title,
          content: postInfo.content,
          author: postInfo.userName,
          date: postInfo.startDate,
          commentCount: postInfo.commentSum,
          category: postInfo.category,
        });

        if (commentsResponse.data.success) {
          setComments(commentsResponse.data.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedRowId, projectId]);
  //조회하면 showViewWriting + 수정화면 showPutWriting
  return (
    <>
      {showViewWriting ? (
        <>
          <FormContainer>
            <ViewTitleInput>
              <Title>{selectedPost.title}</Title>
              <AuthorAndDate>
                {selectedPost.author}
                <Dot>·</Dot>
                {selectedPost.date}
              </AuthorAndDate>
            </ViewTitleInput>
            <Content
              dangerouslySetInnerHTML={{ __html: selectedPost.content }}
            />
            <CommentContainer>
              <CommentForm
                postId={selectedRowId}
                onAddComment={handleAddComment}
                selectedPost={selectedPost}
              />
              <CommentList
                comments={comments}
                selectedPost={selectedPost}
                setComments={setComments}
                onDeleteComment={handleDeleteComment}
              />
            </CommentContainer>
          </FormContainer>
          <PostsButtonContainer>
            <PostsButton onClick={changePutView}>수정</PostsButton>
            <PostsButton onClick={deletePost}>삭제</PostsButton>
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
          </FormContainer>
          <PostsButtonContainer>
            <PostsButton onClick={putWiring}>완료</PostsButton>
            <PostsButton onClick={goToPreviousPage}>취소</PostsButton>
          </PostsButtonContainer>
        </>
      ) : null}
    </>
  );
};

export default ViewWritingPage;
