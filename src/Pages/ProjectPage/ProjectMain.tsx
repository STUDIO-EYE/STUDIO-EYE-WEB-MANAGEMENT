import React from "react";
import Body from "../../Components/common/Body";
import FinishProject from "./FinishProject";
import OngoingProject from "./OngoingProject";
import styled, { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
    background-color: white;
    margin: 0;
  }
`;

const MainBody = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: white;
`;

const Title = styled.text`
  font-size: 2rem;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 80%;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const Container = styled.div`
  background-color: white;
  display: flex;
  justify-content: center;
  position: relative;
  margin-left: 300px;
  width: calc(100% - 225px);
`;

const ProjectMain = () => {
  const ProjectMainContent = () => {
    return (
      <>
        <GlobalStyle />
        <MainBody>
          <Container>
            <OngoingProject />
            <FinishProject />
          </Container>
        </MainBody>
      </>
    );
  };

  return (
    <Body>
      <ProjectMainContent />
    </Body>
  );
};
export default ProjectMain;
