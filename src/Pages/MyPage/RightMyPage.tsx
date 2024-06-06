import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import boardApi from "../../api/boardApi";
import axios from "axios";
import { TitleSm } from "Components/common/Font";
import MyTodo from "./MyTodo";
import myPageApi from "api/myPageApi";
import MyBoard from "./MyBoard";
import { useRecoilValue } from "recoil";
import { modalOn } from "recoil/atoms";

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

const PaginationContainer = styled.div`
margin:-5px 0px;
  .pagination {
    list-style-type: none;
    display: flex;
    justify-content: center;
    padding: 0;
  }
  .page-item {
    margin: 0 5px;
    cursor: pointer;
  }
  .page-link {
    color: black;
    text-decoration: none;
  }
  .active .page-link {
    font-weight: bold;
  }
`;

const RightDashboard = () => {
  const navigate = useNavigate();
  const [projectList,setProjectList]=useState<Project[]>([])
  const onModal=useRecoilValue(modalOn)

  const [currentPage, setCurrentPage] = useState(1);
  const projectPerPage=3;
  const indexOfLastProject = currentPage * projectPerPage;
  const indexOfFirstProject = indexOfLastProject - projectPerPage;
  const currentProjects = projectList.slice(
    indexOfFirstProject,
    indexOfLastProject
  );

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

  const paginate = (pageNumber: number) => !onModal?setCurrentPage(pageNumber):null;
  const PageNumbers = () => {
    const totalPages = Math.ceil(projectList.length / projectPerPage);
    return (
      <PaginationContainer>
        <nav>
          <ul className="pagination">
            {currentPage > 1 && (
              <li className="page-item">
                <a
                  onClick={() => paginate(currentPage - 1)}
                  className="page-link"
                >
                  &laquo;
                </a>
              </li>
            )}

            <li className="page-item active">
              <a className="page-link">{currentPage}</a>
            </li>

            {currentPage < totalPages && (
              <li className="page-item">
                <a
                  onClick={() => paginate(currentPage + 1)}
                  className="page-link"
                >
                  &raquo;
                </a>
              </li>
            )}
          </ul>
        </nav>
      </PaginationContainer>
    );
  };

  return (
    <RightDashboardBox>
      {currentProjects.map((project)=>{
        return (
          <MyBoard project={project}/>
        )
      })}
      <PageNumbers/>
    </RightDashboardBox>
  );
};

export default RightDashboard;