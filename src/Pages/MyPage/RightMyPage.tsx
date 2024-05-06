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
  flex-basis: 50%;
  //overflow-y: auto;

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

const RightDashboard = () => {
  const navigate = useNavigate();
  const [projectList,setProjectList]=useState<Project[]>([])

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
      {projectList.map((project)=>{
        return (
          <MyBoard project={project}/>
        )
      })}
    </RightDashboardBox>
  );
};

export default RightDashboard;