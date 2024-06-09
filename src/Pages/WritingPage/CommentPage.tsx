import commentApi from "api/commentApi";
import React from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import styled from "styled-components";
import CommentList from "./CommentList";
import CommentForm from "./CommentForm";
import Pagination from "Components/common/Pagination";
import { Comment, ICommentPaginationData } from '../../types/comment';

const CommentPage = ({ selectedRowId, projectId, postId }: { selectedRowId: number, projectId: number, postId: number }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [comments, setComments] = useState<Comment[]>([]);
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
  const [commentsData, setCommentsData] = useState({
    content: [],
    pageable: {
      sort: [],
      pageNumber: 0,
      pageSize: 5,
      offset: 0,
      paged: true,
      unpaged: false,
    },
    totalPages: 0,
    totalElements: 0,
    last: false,
    pageSize: 5,
    number: 0,
    sort: [],
    numberOfElements: 0,
    first: true,
    empty: true,
  });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const page = parseInt(queryParams.get('page') || '1', 10);
    setCurrentPage(page);
    fetchData(page - 1, commentsData.pageSize);
  }, [location.search]);

  const fetchData = async (page: number = 0, pageSize: number = 5) => {
    try {
      const response = await commentApi.getCommentList(selectedRowId, page, pageSize);
      console.log("Fetched comments data:", response.data);

      if (response.data.success) {
        const commentsContent = response.data.data.commentResponses;
        console.log("Comments content:", commentsContent);

        setComments(commentsContent);
        setCommentsData({
          content: commentsContent,
          pageable: {
            sort: [],
            pageNumber: response.data.data.currentPageNumber,
            pageSize: response.data.data.pageSize,
            offset: 0,
            paged: true,
            unpaged: false,
          },
          totalPages: response.data.data.totalPages,
          totalElements: response.data.data.totalElements,
          last: response.data.data.currentPageNumber === response.data.data.totalPages,
          pageSize: response.data.data.pageSize,
          number: response.data.data.currentPageNumber,
          sort: [],
          numberOfElements: commentsContent.length,
          first: response.data.data.currentPageNumber === 1,
          empty: commentsContent.length === 0,
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


  const handleAddComment = () => {
    fetchData(currentPage - 1, commentsData.pageSize);
  };

  const handleDeleteComment = () => {
    fetchData(currentPage - 1, commentsData.pageSize);
  };

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    navigate(`?page=${pageNumber}`);
  };

  useEffect(() => {
    console.log("Comments state updated:", comments);
  }, [comments]);

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
            setComments={(newComments) => setComments(newComments)}
            onDeleteComment={handleDeleteComment}
            totalElements={commentsData.totalElements}
          />

          <Pagination
            postsPerPage={commentsData.pageSize}
            totalPosts={commentsData.totalElements}
            paginate={paginate}
          />
        </CommentContainer>
      ) : null}
    </>
  );
};

export default CommentPage;

const CommentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items:stretch;
  min-height: 10rem;
  padding-bottom: 1rem;
`;