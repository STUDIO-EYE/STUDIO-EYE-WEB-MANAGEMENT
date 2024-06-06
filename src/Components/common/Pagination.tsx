import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

interface IPaginationProps {
    postsPerPage: number;
    totalPosts: number;
    paginate: (pageNumber: number) => void;
}

const Pagination = ({ postsPerPage, totalPosts, paginate }: IPaginationProps) => {
    const [currentPageRange, setCurrentPageRange] = useState(0);
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
        <div>
            {currentPageRange > 0 && (
                <>
                    <button onClick={() => setCurrentPageRange(0)}>{"<<"}</button>
                    <button onClick={handlePrevRange}>{"<"}</button>
                </>
            )}
            {displayedPages.map(number => (
                <button key={number} onClick={() => paginate(number)}>
                    {number}
                </button>
            ))}
            {currentPageRange < Math.ceil(pageNumbers.length / 10) - 1 && (
                <>
                    <button onClick={handleNextRange}>{">"}</button>
                    <button onClick={() => setCurrentPageRange(Math.ceil(pageNumbers.length / 10) - 1)}>{">>"}</button>
                </>
            )}
        </div>
    );
};

export default Pagination;


const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
`;

const PageLi = styled.div<{ selected: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  padding: 10px 15px;
  margin-right: 3px;
  box-sizing: border-box;
  font-family: 'pretendard-semibold';
  transition: all 300ms ease-in-out;
  border-radius: 5px;
  cursor: pointer;

`;
