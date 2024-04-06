import commentApi from "api/commentApi";
import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import CommentList from "./CommentList";
import CommentForm from "./CommentForm";

interface Comment{
    id:number
    userName:string
    content:string
    createdAt:Date
    updatedAt:Date
    isNew:boolean
  }

const CommentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items:stretch;
  min-height: 10rem;
  padding-bottom:0.5rem
`;

const CommentPage = ({ selectedRowId, projectId, postId }
    :{selectedRowId:number,projectId:number,postId:number}) => {
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
    const navigate = useNavigate();

    const handleAddComment = (newComment:any) => {
        setComments((prevComments) => [...prevComments, newComment]); //댓글 최신게 나중에 보여주기
        setSelectedPost((prevPost) => ({
          ...prevPost,
          commentSum: prevPost.commentSum + 1,
        }));
        //이런 로직 쓸거면 한 다음에 댓글 수 서버에 저장?하는 기능도 필요할듯
      };
      const handleDeleteComment = () => {
        setSelectedPost((prevPost) => ({
          ...prevPost,
          commentSum: prevPost.commentSum - 1,
        }));
      };

    useEffect(() => {
        // 병렬로 API 호출을 수행하는 함수
        const fetchData = async () => {
          try {
            const [commentsResponse] = await Promise.all([
              commentApi.getCommentList(selectedRowId),
            ]);
            // postResponse 처리
    
            if (commentsResponse.data.success) {
              setComments(commentsResponse.data.data);
            }
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };
    
        fetchData();
      }, [selectedRowId, projectId]);

      return (
        <>
          {showViewWriting ? (
                <CommentContainer>
                  <CommentList
                    comments={comments}
                    selectedPost={selectedPost}
                    setComments={setComments}
                    onDeleteComment={handleDeleteComment}
                  />
                  <CommentForm
                    postId={selectedRowId}
                    onAddComment={handleAddComment}
                    selectedPost={selectedPost}
                  />
                </CommentContainer>
          ) : null}
        </>
      );
    };
    
    export default CommentPage;
    