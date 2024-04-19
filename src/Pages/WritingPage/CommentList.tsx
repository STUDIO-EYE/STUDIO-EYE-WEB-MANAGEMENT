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

const FormContainer = styled.div`
  border-radius: 5px;
  margin-bottom: 1rem;
  padding: 1rem;
  background-color: transparent;
  border-radius: 15px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.08);
`;

const Author = styled.div`
  font-weight: 500;
  font-size: 1rem;
  margin-bottom: 0.07rem;
  background-color: ${theme.color.orange};
  border-radius: 15px;
  padding: 0.1rem 0.3rem;
  display: inline-block;
  color: white;
`;

const Content = styled.div`
  margin-bottom: 0.5rem;
  margin-top: 0.2rem;
  font-size: 1rem;
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
  font-size: 0.7rem;
  cursor: pointer;
  margin-right: 0.4rem;

  &:hover {
    color: rgba(0, 0, 0, 0.5);
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
  width: 80%;
  padding: 0.1rem;
  border: 1px solid #ccc;
  border-radius: 2px;
  color: #282c34;
  max-height: 1rem;
  min-height: 1rem;
  resize: none;
  font-size: 1rem;
  vertical-align: middle;

  &:focus {
    outline: 0.5px solid darkgray;
  }
`;

const CommentList = ({
    selectedPost,
    comments,
    setComments,
    onDeleteComment,
}: {
    selectedPost: any;
    comments: any;
    setComments: any;
    onDeleteComment: any;
}) => {
    const [editingCommentId, setEditingCommentId] = useState<number>(0);
    const [editedContent, setEditedContent] = useState("");
    const [tokenUserName, setTokenUserName] = useState("");
    const [tokenUserId, setTokenUserId] = useState("");
    const [tokenUserEmail, setTokenUserEmail] = useState("");

    const deleteComment = (commentId: number) => {
        commentApi
            .deleteComment(commentId)
            .then((response) => {
                alert("댓글이 성공적으로 삭제되었습니다.");
                const updatedComments = comments.filter(
                    (comment: { id: number }) => comment.id !== commentId
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

    const startEditing = (commentId: number, content: string) => {
        setEditingCommentId(commentId);
        setEditedContent(content);
    };

    useEffect(() => {
        const token = sessionStorage.getItem("login-token");
        if (token) {
            const decodedToken: any = jwt_decode(token);
            setTokenUserName(decodedToken.username);
            setTokenUserId(decodedToken.userId);
            setTokenUserEmail(decodedToken.sub);
        }
    }, []);

    const finishEditing = (commentId: number) => {
        commentApi
            .putComment(commentId, { content: editedContent })
            .then((response) => {
                alert("댓글이 성공적으로 수정되었습니다.");
                const updatedComments = comments.map((comment: { id: number }) =>
                    comment.id === commentId
                        ? { ...comment, content: editedContent }
                        : comment
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
            <CommentTitle>댓글 {comments.length}</CommentTitle>
            {comments.map((comment: Comment, index: number) => (
                <FormContainer key={index}>
                    <ButtonAuthorContainer>
                        <Author>{comment.userName}</Author>

                            <ButtonContainer>
                                {tokenUserName === comment.userName && (
                                    <>
                                        <CommentButton onClick={() => deleteComment(comment.id)}>
                                            삭제
                                        </CommentButton>
                                        {editingCommentId === comment.id ? (
                                            <CommentButton onClick={() => finishEditing(comment.id)}>
                                                완료
                                            </CommentButton>
                                        ) : (
                                            <CommentButton
                                                onClick={() =>
                                                    startEditing(comment.id, comment.content)
                                                }
                                            >
                                                수정
                                            </CommentButton>
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
                        <Content>{comment.content}</Content>
                    )}
                    <Date>
                        {comment.updatedAt ? comment.updatedAt.toString() + "(수정됨)"
                        : comment.createdAt.toString()}
                    </Date>

                </FormContainer>
            ))}
        </>
    );
};

export default CommentList;
