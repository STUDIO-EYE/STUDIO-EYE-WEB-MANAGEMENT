import commentApi from "api/commentApi";
import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import CommentList from "./CommentList";
import CommentForm from "./CommentForm";

interface Comment {
  id: number
  userName: string
  content: string
  createdAt: Date
  updatedAt: Date
  isNew: boolean
}

const CommentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items:stretch;
  min-height: 10rem;
  padding-bottom: 1rem;
`;

const CommentPage = ({ selectedRowId, projectId, postId }
  : { selectedRowId: number, projectId: number, postId: number }) => {
  const [showViewWriting, setShowViewWriting] = useState(true);
  const [selectedPost, setSelectedPost] = useState({
    commentId: 0,
    title: "",
    content: "",
    author: "",
    date: "",
    commentSum: 0,
    category: "",
  });
  const [comments, setComments] = useState<Comment[]>([]);

  const handleAddComment = (newComment: any) => {
    fetchData()
  };
  const handleDeleteComment = () => {
    fetchData()
  };

  useEffect(() => {
    fetchData();
  }, [selectedRowId, projectId]);

  const fetchData = async () => {
    try {
      const [commentsResponse] = await Promise.all([
        commentApi.getCommentList(selectedRowId),
      ]);
      if (commentsResponse.data.success) {
        setComments(commentsResponse.data.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <>
      {showViewWriting ? (
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
      ) : null}
    </>
  );
};

export default CommentPage;
