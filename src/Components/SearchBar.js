// SearchBar.js
import React from 'react';
import styled from 'styled-components';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

const SearchBarWrapper = styled.div`
  display: flex;
  align-items: center;
  /* background-color: #f1f1f1; */
  /* border-radius: 4px; */
  padding: 8px;
  border-bottom: #808080;
  
  
  input[type="text"] {
    flex: 1;
    border: darkgray;
    padding: 10px;
    /* border-radius: 4px; */
    outline: none;
    border-bottom: 2px solid darkgray;
    
  }
  
  button {
    background-color: #a0a0a0;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 8px 16px;
    margin-left: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    
    &:hover {
      background-color: #808080;
    }
  }
`;

const SearchBar = () => {
  return (
    <SearchBarWrapper>
      <SearchRoundedIcon />
      <input type="text" placeholder="검색어를 입력하세요" />
      <button>검색</button>
    </SearchBarWrapper>
  );
};

export default SearchBar;
