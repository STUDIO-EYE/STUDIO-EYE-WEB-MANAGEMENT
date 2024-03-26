import React , { useState, useEffect }from "react";
import styled from "styled-components";
import commentApi from "../../api/commentApi";
import jwt_decode from "jwt-decode";

const FormContainer = styled.div`
  border-radius: 5px;
  margin-bottom: 0.01rem;
  padding: 0.5rem;
  //background-color: #FC9EBD ;
`;

const Author = styled.div`
  font-weight: bold;
  margin-bottom: 0.07rem;
  font-size: 0.75rem;
  background-color: #D79278;
  border-radius: 999px; /* 큰 값으로 설정하여 타원 모양 생성 */
  padding: 0.1rem 0.3rem; /* 내용 주변에 좀 더 공간을 주기 위한 패딩 설정 */
  display: inline-block; /* 인라인 요소로 표시하여 내용과 함께 가로 정렬 */
  color: white; /* 텍스트 색상을 흰색으로 설정 */
`;

const Content = styled.div`
  margin-bottom: 0.05rem;
  font-size: 0.75rem;
`;

const Date = styled.div`
  color: #888;
  font-size: 0.7rem;
`;
const CommentTitle = styled.h3`
  font-size: 1rem;
  color: #282c34;
  margin-left: 0.5rem;
`;
const CommentButton = styled.div`
  font-size: 0.5rem;
  margin-right: 0.4rem;
`;
const ButtonContainer = styled.div`
  font-size: 0.5rem;
  display: flex;
`;
const CommentTextarea = styled.textarea`
  width: 80%;
  padding: 0.1rem;
  border: 1px solid #ccc;
  border-radius: 2px;
  color: #282c34;
  max-height: 1rem;
  min-height: 1rem;
  resize: none;
  font-size: 0.5rem;
  vertical-align: middle;

  &:focus {
    outline: 0.5px solid darkgray;
  }
`;

const CommentList = ({ selectedPost, comments, setComments, onDeleteComment}) => {
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editedContent, setEditedContent] = useState("");
    const [tokenUserName, setTokenUserName] = useState("");
    const [tokenUserId, setTokenUserId] = useState("");
    const [tokenUserEmail, setTokenUserEmail] = useState("");

    const deleteComment = (commentId) => {
        commentApi.deleteComment(commentId)
            .then(response => {
                alert('댓글이 성공적으로 삭제되었습니다.');
                // 댓글이 성공적으로 삭제되면 해당 댓글을 상태에서 제거하거나
                const updatedComments = comments.filter(comment => comment.id !== commentId);
                setComments(updatedComments);
                if (onDeleteComment) { // 추가된 코드
                    onDeleteComment();
                }
            })
            .catch(error => {
                console.error('Error deleting comment:', error);
                alert('댓글 삭제 중 오류가 발생했습니다.');
            });
    };

    const startEditing = (commentId, content) => {
        setEditingCommentId(commentId);
        setEditedContent(content);
    };

    useEffect(() => {
        const token = sessionStorage.getItem("login-token");
        if (token) {
            const decodedToken = jwt_decode(token);
            setTokenUserName(decodedToken.username);
            setTokenUserId(decodedToken.userId);
            setTokenUserEmail(decodedToken.sub);
        }
    }, []);



    const finishEditing = (commentId) => {
        commentApi.putComment(commentId, { content: editedContent })
            .then(response => {
                alert('댓글이 성공적으로 수정되었습니다.');
                const updatedComments = comments.map(comment =>
                    comment.id === commentId ? {...comment, content: editedContent} : comment
                );
                setComments(updatedComments);
                setEditingCommentId(null);
            })
            .catch(error => {
                console.error('Error updating comment:', error);
                alert('댓글 수정 중 오류가 발생했습니다.');
            });
    };
    return (
        <>
            <CommentTitle>댓글 {selectedPost.commentCount} 개</CommentTitle>
            {comments.map((comment, index) => (
                <FormContainer key={index}>
                    <Author>{comment.userName}</Author>
                    {editingCommentId === comment.id ? (
                        <CommentTextarea
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                        />
                    ) : (
                        <Content>{comment.content}</Content>
                    )}
                    <Date>{comment.updatedAt ?
                        comment.updatedAt + "(수정됨)"
                        : comment.createdAt
                    }</Date>
                    {!comment.isNew && (
                        <ButtonContainer>
                            {tokenUserName === comment.userName && (
                                <>
                                    <CommentButton onClick={() => deleteComment(comment.id)}>삭제</CommentButton>
                                    {editingCommentId === comment.id ? (
                                    <CommentButton onClick={() => finishEditing(comment.id)}>완료</CommentButton>
                                    ) : (
                                    <CommentButton onClick={() => startEditing(comment.id, comment.content)}>수정</CommentButton>
                                    )}
                                </>
                            )}
                        </ButtonContainer>
                    )}
                </FormContainer>
            ))}
        </>
    );
};

export default CommentList;