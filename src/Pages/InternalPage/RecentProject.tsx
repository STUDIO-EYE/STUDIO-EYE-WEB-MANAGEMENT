import React from "react";
import styled from "styled-components";

const Title = styled.div`
  font-weight: bold;
  font-size: 23px;
  padding-bottom: 0.3rem;
`;
const ProjectBox = styled.div`
  width: 500px;
  display: flex;
  flex-direction: column;
  margin-top: 50px;
  margin-bottom: 20px;
`;
const ProjectBody = styled.div`
  background-color: white;
  min-height: 300px;
`;
const RecentProject = () => {
  return (
    <ProjectBox>
      <Title>Recent Projects</Title>
      <ProjectBody></ProjectBody>
    </ProjectBox>
  );
};
export default RecentProject;
