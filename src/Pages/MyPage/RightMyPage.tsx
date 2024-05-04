import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import boardApi from "../../api/boardApi";
import axios from "axios";
import { TitleSm } from "Components/common/Font";
import MyTodo from "./MyTodo";
import myPageApi from "api/myPageApi";
import MyBoard from "./MyBoard";

interface Post {
  id: number;
  title: string;
}

interface Project{
  projectId:number,
  name:string,
  description:string,
  startDate:string,
  finishDate:string,
  isFinished:boolean;
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

// const GoToFilePageButton = styled.div<RightBoardProps>`
//   width: 90%;
//   margin-top: 1rem;
//   margin-left: 2rem;
//   flex-direction: column;
//   background-color: white;
//   overflow: hidden;
//   transition: height 0.3s ease-in-out;
//   flex: 1;
//   box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
//   ${(props) => props.isEditing && "margin-bottom: 100px;"}
// `;



const RightDashboard = () => {
  const navigate = useNavigate();
  const [projectList,setProjectList]=useState<Project[]>([])

//   const goToPlanPage = () => {
//     navigate(`/PlanMain/${projectId}`,{state:{name:projectData.name}});
//   };
//   const goToPlanWritingPage=()=>{//plan 글쓰기 페이지로 이동
//     navigate(`/PlanMain/${projectId}`,{state:{name:projectData.name, writing:true}})
//   }

//   const goToMakingPage = () => {
//     navigate(`/MakingMain/${projectId}`,{state:{name:projectData.name}});
//   };
//   const goToMakingWritingPage=()=>{//making 글쓰기 페이지로 이동
//     navigate(`/MakingMain/${projectId}`,{state:{name:projectData.name, writing:true}})
//   }

//   const goToEditPage = () => {
//     navigate(`/EditMain/${projectId}`,{state:{name:projectData.name}});
//   };
//   const goToEditWritingPage=()=>{//edit 글쓰기 페이지로 이동
//     navigate(`/EditMain/${projectId}`,{state:{name:projectData.name, writing:true}})
//   }

//   const goToFilePage = () => {
//     navigate(`/Manage/${projectId}/files`);
//   };

  useEffect(() => {
    const fetchProject=async()=>{
      try{
        const projectResponse=await myPageApi.getBoardByUserId();
        if (projectResponse.data && projectResponse.data.success) {
          setProjectList(projectResponse.data.list);         
        }else if(projectResponse.data.code===7001){
          sessionStorage.removeItem("login-token");
          delete axios.defaults.headers.common["Authorization"];
          return;
        }
      }catch(error){
        console.error("Error fetching myPage projects:", error);
      }
    }
    fetchProject();
  }, []);

  return (
    <RightDashboardBox>
      <MyTodo/>
      {projectList.map((project)=>{
        return (
          <MyBoard project={project}/>
        )
      })}
    </RightDashboardBox>
  );
};

export default RightDashboard;