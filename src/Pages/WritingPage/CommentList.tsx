import React, { useState, useEffect } from "react";
import styled from "styled-components";
import commentApi from "../../api/commentApi";
import jwt_decode from "jwt-decode";
import { theme } from "LightTheme";
interface Comment {
    id: number;
    userName: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    isNew: boolean;
}

interface CommentData {
    content: Comment[];
}

const CommentList = ({
    selectedPost,
    comments = [],
    setComments,
    onDeleteComment,
    totalElements
}: {
    selectedPost: any;
    comments?: Comment[];
    setComments: (newComments: Comment[]) => void;
    onDeleteComment: () => void;
    totalElements: number;
}) => {
    useEffect(() => {
        console.log("CommentList rendered with comments:", comments);
    }, [comments]);
    const [editingCommentId, setEditingCommentId] = useState<number>(0);
    const [editedContent, setEditedContent] = useState("");
    const [tokenUserName, setTokenUserName] = useState("");
    const [tokenUserId, setTokenUserId] = useState("");
    const [tokenUserEmail, setTokenUserEmail] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const token = sessionStorage.getItem("login-token");
        if (token) {
            const decodedToken: any = jwt_decode(token);
            setTokenUserName(decodedToken.username);
            setTokenUserId(decodedToken.userId);
            setTokenUserEmail(decodedToken.sub);
        }
    }, []);

    const handleCancel = () => {
        if (isEditing) {
            const confirmCancel = window.confirm("작성 중인 내용이 있습니다. 그래도 나가시겠습니까?");
            if (confirmCancel) {
                setIsEditing(false);
                setEditingCommentId(0);
            }
        }
    };

    const startEditing = (commentId: number, content: string) => {
        setEditingCommentId(commentId);
        setEditedContent(content);
        setIsEditing(true);
    };

    const deleteComment = (commentId: number) => {
        commentApi
            .deleteComment(commentId)
            .then((response) => {
                alert("댓글이 성공적으로 삭제되었습니다.");
                const updatedComments: Comment[] = comments.filter(
                    (comment: Comment) => comment.id !== commentId
                );
                setComments(updatedComments);
                if (onDeleteComment) {
                    onDeleteComment();
                }
            })
            .catch((error) => {
                console.error("Error deleting comment:", error);
                alert("댓글 삭제 중 오류가 발생했습니다.");
            });
    };

    const finishEditing = (commentId: number) => {
        commentApi
            .putComment(commentId, { content: editedContent })
            .then((response) => {
                alert("댓글이 성공적으로 수정되었습니다.");
                const updatedComments: Comment[] = comments.map((comment: Comment) =>
                    comment.id === commentId ? { ...comment, content: editedContent } : comment
                );
                setComments(updatedComments);
                setEditingCommentId(0);
            })
            .catch((error) => {
                console.error("Error updating comment:", error);
                alert("댓글 수정 중 오류가 발생했습니다.");
            });
    };

    return (
        <>
            {comments.length > 0 && (
                <>
                    <CommentTitle>댓글 {totalElements}</CommentTitle>
                    {comments.map((comment: Comment, index: number) => (
                        <FormContainer key={index}>
                            <ButtonAuthorContainer>
                                <Author>{comment.userName}</Author>
                                <ButtonContainer>
                                    {tokenUserName === comment.userName && (
                                        <>
                                            {editingCommentId === comment.id ? (
                                                <>
                                                    <CommentButton onClick={handleCancel}>취소</CommentButton>
                                                    <CommentButton onClick={() => finishEditing(comment.id)}>완료</CommentButton>
                                                </>
                                            ) : (
                                                <>
                                                    <CommentButton onClick={() => startEditing(comment.id, comment.content)}>수정</CommentButton>
                                                    <CommentButton onClick={() => deleteComment(comment.id)}>삭제</CommentButton>
                                                </>
                                            )}
                                        </>
                                    )}
                                </ButtonContainer>
                            </ButtonAuthorContainer>
                            {editingCommentId === comment.id ? (
                                <CommentTextarea
                                    value={editedContent}
                                    onChange={(e) => setEditedContent(e.target.value)}
                                />
                            ) : (
                                <Content>{comment.content.includes('\n') ? comment.content.split('\n').map((line, index) => <div key={index}>{line}</div>) : comment.content}</Content>
                            )}
                            <Date>
                                {comment.updatedAt ? comment.updatedAt.toString() + "(수정됨)" : comment.createdAt.toString()}
                            </Date>
                        </FormContainer>
                    ))}
                </>
            )}
        </>
    );

};

export default CommentList;

const FormContainer = styled.div`
  border-radius: 5px;
  margin-bottom: 1rem;
  padding: 1rem;
  background-color: transparent;
  border-radius: 15px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.08);
  background-color: #F9FBFD;
`;

const Author = styled.div`
  font-weight: 800;
  font-size: 1rem;
  margin-bottom: 0.5rem;
  border-radius: 15px;
  display: inline-block;
`;

const Content = styled.div`
  margin-bottom: 0.5rem;
  margin-top: 0.2rem;
  font-size: 1rem;
  overflow-wrap: break-word;
  word-break: break-word;
`;

const Date = styled.div`
  color: #888;
  font-size: 0.7rem;
`;

const CommentTitle = styled.h3`
  font-size: 0.9rem;
  color: #282c34;
  margin-left: 0.5rem;
`;

const CommentButton = styled.div`
color: rgba(0, 0, 0, 0.5);
  font-size: 0.9rem;
  cursor: pointer;
  margin-right: 0.4rem;

  &:hover {
    color: rgba(0, 0, 0, 0.3);
  }
`;

const ButtonContainer = styled.div`
  font-size: 0.5rem;
  display: flex;
  justify-content: flex-end;
`;

const ButtonAuthorContainer = styled.div`
  display: flex;
  justify-content: space-between;

`;

const CommentTextarea = styled.textarea`
font-family: 'Pretendard';
  width: 97%;
  padding: 0.5rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  resize: none;
  font-size: 0.9rem;
  vertical-align: middle;
  margin-bottom: 1rem;

  &:focus {
    outline: 1px solid darkgray;
  }
`;