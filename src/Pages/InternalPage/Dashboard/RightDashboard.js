import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import boardApi from "../../../api/boardApi";
import axios from "axios";

const RightDashboardBox = styled.div`
  border-left: 1px dotted black;
  background-color: white;
  flex-basis: 50%;
  padding-left: 1rem;
  padding-top: 0.1rem;
`;

const RightboardBody = styled.div`
  width: 90%;
  height: 33%; // 크기 변경
  margin: 0.2rem;
  flex-direction: column;
  background-color: white;
  overflow: hidden;
  transition: height 0.3s ease-in-out;
  flex: 1;
`;

const BoardTitleDiv = styled.div`
  display: flex;
  text-align: center;
  height: 30%;
`;

const BoardContentDiv = styled.div`
  text-align: center;
  height: 70%;
  width: 100%;
`;

const ContentDiv = styled.div`
  display: flex;
  text-align: center;
  width: 100%;
  height: 33%;
  background-color: white;
  min-width: 8rem;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin: -10px;
`;

const SubTitle = styled.text`
  font-weight: 600;
  font-size: 1.5rem;
`;

const Text = styled.text`
  font-size: 1rem;
  text-decoration: underline;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: pointer;
  padding-left: 1rem;
`;
const GoButton = styled.div`
  cursor: pointer;
  font-weight: 600;
  font-size: 1.5rem;
  margin-left: auto;
`;

const RightDashboard = ({ projectId }) => {
  const navigate = useNavigate();
  const [planData, setPlanData] = useState([]);
  const [productionDate, setProductionDate] = useState([]);
  const [editData, setEditData] = useState([]);
  const goToPlanPage = () => {
    navigate(`/PlanMain/${projectId}`);
  };

  const goToMakingPage = () => {
    navigate(`/MakingMain/${projectId}`);
  };

  const goToEditPage = () => {
    navigate(`/EditMain/${projectId}`);
  };
  useEffect(() => {
    // 데이터를 불러오는 함수
    const fetchPosts = async () => {
      try {
        const planResponse = await boardApi.getPlanningDashboard(projectId);
        if (planResponse.data && planResponse.data.success) {
          setPlanData(planResponse.data.list);
        }else if(planResponse.data.code === 7001){
          sessionStorage.removeItem("login-token");
          delete axios.defaults.headers.common['Authorization'];
          return;
        }


        const productionResponse = await boardApi.getProductionDashboard(projectId);
        if (productionResponse.data && productionResponse.data.success) {
          setProductionDate(productionResponse.data.list);
        }else if(productionResponse.data.code === 7001){
          sessionStorage.removeItem("login-token");
          delete axios.defaults.headers.common['Authorization'];
          return;
        }


        const editResponse = await boardApi.getEditingDashboard(projectId);
        if (editResponse.data && editResponse.data.success) {
          setEditData(editResponse.data.list);
        }else if(editResponse.data.code === 7001){
          sessionStorage.removeItem("login-token");
          delete axios.defaults.headers.common['Authorization'];
          return;
        }

      } catch (error) {
        console.error("Error fetching recent posts:", error);
      }
    };

    fetchPosts();
  }, []);
  const handlePostClick = (id, type) => {
    if(type === "plan") {
      navigate(`/PlanMain/${projectId}/${id}`);
    } else if(type === "production") {
      navigate(`/MakingMain/${projectId}/${id}`);
    } else if(type === "edit") {
      navigate(`/EditMain/${projectId}/${id}`);
    }
  };
  return (
    <RightDashboardBox>
      <RightboardBody>
        <BoardTitleDiv>
          <SubTitle>기획</SubTitle>
          <GoButton onClick={goToPlanPage}>+</GoButton>
        </BoardTitleDiv>
        <BoardContentDiv>
          {
            planData.length === 0 ? (
                <div>게시글내용이 없습니다</div>
            ) : (
                planData.map(plan => (
                    <ContentDiv key={plan.id} onClick={() => handlePostClick(plan.id, "plan")}>
                      <Text>{plan.title}</Text>
                    </ContentDiv>
                ))
            )
          }
        </BoardContentDiv>
      </RightboardBody>
      <RightboardBody>
        <BoardTitleDiv>
          <SubTitle>제작</SubTitle>
          <GoButton onClick={goToMakingPage}>+</GoButton>
        </BoardTitleDiv>
        <BoardContentDiv>
          {
            productionDate.length === 0 ? (
                <div>게시글내용이 없습니다</div>
            ) : (
                productionDate.map(production => (
                    <ContentDiv key={production.id} onClick={() => handlePostClick(production.id, "production")}>
                      <Text>{production.title}</Text>
                    </ContentDiv>
                ))
            )
          }
        </BoardContentDiv>
      </RightboardBody>
      <RightboardBody>
        <BoardTitleDiv>
          <SubTitle>편집</SubTitle>
          <GoButton onClick={goToEditPage}>+</GoButton>
        </BoardTitleDiv>
        <BoardContentDiv>
          {
            editData.length === 0 ? (
                <div>게시글내용이 없습니다</div>
            ) : (
                editData.map(edit => (
                    <ContentDiv key={edit.id} onClick={() => handlePostClick(edit.id, "edit")}>
                      <Text>{edit.title}</Text>
                    </ContentDiv>
                ))
            )
          }
        </BoardContentDiv>
      </RightboardBody>
    </RightDashboardBox>
  );
};
export default RightDashboard;
