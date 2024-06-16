import React, { useState } from 'react';
import styled from 'styled-components';

interface IPaginationProps {
    postsPerPage: number;
    totalPosts: number;
    paginate: (pageNumber: number) => void;
}

const Pagination = ({ postsPerPage, totalPosts, paginate }: IPaginationProps) => {
    const [currentPageRange, setCurrentPageRange] = useState(0);
    const [index, setIndex] = useState<null | number>(0);
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
        pageNumbers.push(i);
    }

    const displayedPages = pageNumbers.slice(currentPageRange * 10, (currentPageRange + 1) * 10);

    const handlePrevRange = () => {
        if (currentPageRange > 0) {
            setCurrentPageRange(currentPageRange - 1);
        }
    };

    const handleNextRange = () => {
        if (currentPageRange < Math.ceil(pageNumbers.length / 10) - 1) {
            setCurrentPageRange(currentPageRange + 1);
        }
    };

    return (
        <Wrapper>
            {currentPageRange > 0 && (
                <>
                    <PageLi onClick={() => setCurrentPageRange(0)} selected={false}>{"<<"}</PageLi>
                    <PageLi onClick={handlePrevRange} selected={false}>{"<"}</PageLi>
                </>
            )}
            {displayedPages.map(number => (
                <PageLi key={number} onClick={() => paginate(number)} selected={number === index ? true : false}>
                    {number}
                </PageLi>
            ))}
            {currentPageRange < Math.ceil(pageNumbers.length / 10) - 1 && (
                <>
                    <PageLi onClick={handleNextRange} selected={false}>{">"}</PageLi>
                    <PageLi onClick={() => setCurrentPageRange(Math.ceil(pageNumbers.length / 10) - 1)} selected={false}>{">>"}</PageLi>
                </>
            )}
        </Wrapper>
    );
};

export default Pagination;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
`;

const PageLi = styled.div<{ selected: boolean }>`
  display: inline-flex; /* Changed from flex to inline-flex */
  justify-content: center;
  align-items: center;
  font-size: 0.9rem;
  padding: 10px 15px;
  margin-right: 3px;
  box-sizing: border-box;
  font-family: 'pretendard';
  font-weight: 800;
  transition: all 300ms ease-in-out;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    transition: all 300ms ease-in-out;
    cursor: pointer;
    color: white;
    background-color: #ffa900;
  }
`;
