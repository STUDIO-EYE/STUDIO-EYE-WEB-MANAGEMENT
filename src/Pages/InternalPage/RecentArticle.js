import React from "react";
import styled from "styled-components";

const Title = styled.div`
  font-weight: bold;
  font-size: 23px;
  padding-bottom: 0.3rem;
`;
const ArticleBox = styled.div`
  width: 500px;
  display: flex;
  flex-direction: column;
  margin-top: 50px;
  margin-bottom: 20px;
`;
const ArticleBody = styled.div`
  background-color: white;
  min-height: 300px;
`;
const RecentArticle = () => {
  return (
    <ArticleBox>
      <Title>Recent Articles</Title>
      <ArticleBody></ArticleBody>
    </ArticleBox>
  );
};
export default RecentArticle;
