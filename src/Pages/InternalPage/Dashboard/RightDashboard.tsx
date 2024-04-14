import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import boardApi from "../../../api/boardApi";
import axios from "axios";
import { TitleSm } from "Components/common/Font";

interface Post {
  id: number;
  title: string;
}

interface RightBoardProps {
  children: React.ReactNode;
  isEditing?: boolean;
}

interface DashboardProps {
  projectData: any;
  projectId: number;
}

const RightDashboardBox = styled.div`
  background-color: white;
  flex-basis: 50%;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 15px;
  }

  &::-webkit-scrollbar-track {
    background: white;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 15px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.08);
  }
`;

const RightboardBody = styled.div<RightBoardProps>`
  width: 90%;
  height: 33.33%;
  margin-top: 1rem;
  margin-left: 2rem;
  flex-direction: column;
  background-color: white;
  overflow: hidden;
  transition: height 0.3s ease-in-out;
  flex: 1;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
  ${(props) => props.isEditing && "margin-bottom: 100px;"}
`;

const GoToFilePageButton = styled.div<RightBoardProps>`
  width: 90%;
  margin-top: 1rem;
  margin-left: 2rem;
  flex-direction: column;
  background-color: white;
  overflow: hidden;
  transition: height 0.3s ease-in-out;
  flex: 1;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
  ${(props) => props.isEditing && "margin-bottom: 100px;"}
`;

const BoardTitleDiv = styled.div`
  display: flex;
  text-align: center;
  margin: 20px;
  height: 20%;
`;

const BoardContentDiv = styled.div`
  text-align: center;
  height: 70%;
  width: 100%;
  margin: 0 10px 0 10px;
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

const RightDashboard: React.FC<DashboardProps> = ({ projectData, projectId }) => {
  const navigate = useNavigate();
  const [planData, setPlanData] = useState<Post[]>([]);
  const [productionDate, setProductionDate] = useState<Post[]>([]);
  const [editData, setEditData] = useState<Post[]>([]);

  const goToPlanPage = () => {
    navigate(`/PlanMain/${projectId}`,{state:{name:projectData.name}});
  };

  const goToMakingPage = () => {
    navigate(`/MakingMain/${projectId}`,{state:{name:projectData.name}});
  };

  const goToEditPage = () => {
    navigate(`/EditMain/${projectId}`,{state:{name:projectData.name}});
  };
  const goToEditWritingPage=()=>{
    //edit 글쓰기 페이지로 이동
  }

  const goToFilePage = () => {
    navigate(`/Manage/${projectId}/file`);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const planResponse = await boardApi.getPlanningDashboard(projectId);
        if (planResponse.data && planResponse.data.success) {
          setPlanData(planResponse.data.list);
        } else if (planResponse.data.code === 7001) {
          sessionStorage.removeItem("login-token");
          delete axios.defaults.headers.common["Authorization"];
          return;
        }

        const productionResponse = await boardApi.getProductionDashboard(
          projectId
        );
        if (productionResponse.data && productionResponse.data.success) {
          setProductionDate(productionResponse.data.list);
        } else if (productionResponse.data.code === 7001) {
          sessionStorage.removeItem("login-token");
          delete axios.defaults.headers.common["Authorization"];
          return;
        }

        const editResponse = await boardApi.getEditingDashboard(projectId);
        if (editResponse.data && editResponse.data.success) {
          setEditData(editResponse.data.list);
        } else if (editResponse.data.code === 7001) {
          sessionStorage.removeItem("login-token");
          delete axios.defaults.headers.common["Authorization"];
          return;
        }
      } catch (error) {
        console.error("Error fetching recent posts:", error);
      }
    };

    fetchPosts();
  }, [projectId]);

  const handlePostClick = (id: number, type: string) => {
    if (type === "plan") {
      navigate(`/PlanMain/${projectId}/${id}`);
    } else if (type === "production") {
      navigate(`/MakingMain/${projectId}/${id}`);
    } else if (type === "edit") {
      navigate(`/EditMain/${projectId}/${id}`);
    }
  };

  return (
    <RightDashboardBox>
      <GoToFilePageButton>
        goToFilePage 버튼
        <GoButton onClick={goToFilePage}>+</GoButton>
      </GoToFilePageButton>
      <RightboardBody>
        <BoardTitleDiv>
          <TitleSm onClick={goToPlanPage}>기획</TitleSm>
          <GoButton onClick={goToPlanPage}>+</GoButton>
        </BoardTitleDiv>
        <BoardContentDiv>
          {planData.length === 0 ? (
            <div style={{ color: "grey" }}>게시글이 없습니다.</div>
          ) : (
            planData.map((plan) => (
              <ContentDiv
                key={plan.id}
                onClick={() => handlePostClick(plan.id, "plan")}
              >
                <Text>{plan.title}</Text>
              </ContentDiv>
            ))
          )}
        </BoardContentDiv>
      </RightboardBody>
      <RightboardBody>
        <BoardTitleDiv>
          <TitleSm onClick={goToMakingPage}>제작</TitleSm>
          <GoButton onClick={goToMakingPage}>+</GoButton>
        </BoardTitleDiv>
        <BoardContentDiv>
          {productionDate.length === 0 ? (
            <div style={{ color: "grey" }}>게시글이 없습니다.</div>
          ) : (
            productionDate.map((production) => (
              <ContentDiv
                key={production.id}
                onClick={() => handlePostClick(production.id, "production")}
              >
                <Text>{production.title}</Text>
              </ContentDiv>
            ))
          )}
        </BoardContentDiv>
      </RightboardBody>
      <RightboardBody isEditing>
        <BoardTitleDiv>
          <TitleSm onClick={goToEditPage}>편집</TitleSm>
          <GoButton onClick={goToEditPage}>+</GoButton>
        </BoardTitleDiv>
        <BoardContentDiv>
          {editData.length === 0 ? (
            <div style={{ color: "grey" }}>게시글이 없습니다.</div>
          ) : (
            editData.map((edit) => (
              <ContentDiv
                key={edit.id}
                onClick={() => handlePostClick(edit.id, "edit")}
              >
                <Text>{edit.title}</Text>
              </ContentDiv>
            ))
          )}
        </BoardContentDiv>
      </RightboardBody>
    </RightDashboardBox>
  );
};

export default RightDashboard;