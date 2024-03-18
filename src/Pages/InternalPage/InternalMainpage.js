import React from "react";
import Header from "../../Components/common/header";
import Dashboard from "./Dashboard";
import RecentArticle from "./RecentArticle";
import RecentProject from "./RecentProject";
import styled, { createGlobalStyle } from "styled-components";
import Body from "../../Components/common/Body";
import { useParams } from "react-router-dom";

const GlobalStyle = createGlobalStyle`
  body {
    background-color: #fafafa;
    margin: 0;
  }
`;

const MainBody = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100%;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  /* max-width: 100%; */
  flex-wrap: wrap;
`;

const InternalMainpage = () => {
  const InternalMainpageContent = () => {
    const { projectId } = useParams();
    return (
      <>
        <GlobalStyle />
        <MainBody>
          <Wrapper>
            <Dashboard projectId={projectId}></Dashboard>
          </Wrapper>
          <Wrapper></Wrapper>
        </MainBody>
      </>
    );
  };

  return (
    <Body>
      <InternalMainpageContent />
    </Body>
  );
};
export default InternalMainpage;
