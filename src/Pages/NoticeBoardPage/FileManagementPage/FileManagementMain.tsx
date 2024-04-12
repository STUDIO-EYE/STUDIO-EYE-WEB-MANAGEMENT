import Body from 'Components/common/Body';
import React, { useState } from 'react';
import styled, { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Pretandard';
  }
`;


const FileManagementMain = () => {
  const FileManagementMainContent = () => {
    return (
      <>
        <GlobalStyle />
        
      </>
    );
  };

  return (
    <Body>
      <FileManagementMainContent />
    </Body>
  );
};
export default FileManagementMain;
