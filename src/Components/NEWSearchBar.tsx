import React from 'react';
import styled from 'styled-components';
import { CgSearch } from "react-icons/cg";


const SearchBarWrapper = styled.div`
  display: flex;
  justify-content: left;
  width: 100%;
`;

const InputArea = styled.div`
  display: flex;
  border: 2px solid black;
  border-radius: 4rem;
  padding: 0.5rem;
`;

const SearchInput = styled.input`
  width: 100%;
  border: none;
  margin-left: 0.5rem;
  
  &:focus{
    outline: none;
  }
`;

const NEWSearchBar = () => {
    return (
        <SearchBarWrapper>
            <InputArea>
                <CgSearch/>
                <SearchInput />
            </InputArea>
        </SearchBarWrapper>

    );
};

export default NEWSearchBar;
