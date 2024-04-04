import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FaTrash } from "react-icons/fa";
import {
  media,
  TitleLg,
  TitleMd,
  TitleSm,
  TextLg,
  TextMd,
  TextSm,
} from "../../Components/common/Font";
import projectApi from "../../api/projectApi";
import axios from "axios";

const AppContainer = styled.div`
  text-align: center;
  justify-content: center;
  align-items: center;
  margin-top: 16px;
`;

const Container = styled.div`
  text-align: left;
`;

const ProjectWrapper = styled.div`
  width: 400px;
  background-color: #ffffff;
  padding: 20px;
  margin-bottom: 100px;
  border-radius: 15px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.08);
`;

const ProjectsContainer = styled.div`
  flex-wrap: wrap;
  margin-top: 20px;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
`;

const ProjectItemWrapper = styled.div`
  width: calc(100% - 40px);
  background-color: white;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  padding: 20px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  position: relative;
  border-radius: 15px;

  &:hover {
    background-color: rgba(0, 0, 0, 0.01);
  }
`;

const ProjectItemContent = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ProjectTitle = styled.div`
  flex: 1;
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 10px;
  text-align: left;
`;

const ProjectPeriod = styled.div`
  margin-bottom: 20px;
  text-align: left;
  font-size: 12px;
`;

const ProjectDescription = styled.div`
  flex: 1;
  text-align: left;
  margin: 10px 0;
  font-size: 14px;
`;

const ButtonsContainer = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  align-items: center;
`;

const StyledTable = styled.table`
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: space-between;

  th,
  td {
    width: calc(50% - 8px); /* 2개의 열이 나란히 위치하도록 */
    margin-bottom: 16px;
    box-sizing: border-box;
    padding: 15px;
    text-align: left;
    word-wrap: break-word; /* 줄바꿈 */
  }

  th:last-child {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  tbody tr {
    width: calc(50% - 8px); /* 2개의 열이 나란히 위치하도록 */
    background-color: #ffffff;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.08);
    cursor: pointer;

    &:hover {
      background-color: rgba(0, 0, 0, 0.03);
    }
  }

  tbody tr:nth-child(even) {
    margin-left: 16px; /* 짝수 행이 오른쪽으로 밀림 */
  }
`;

const LabelArea = styled.div`
  width: 100%;
  text-align: left;
`;

const DeleteButton = styled.button`
  background-color: white;
  border-radius: 32px;
  border: none;
  outline: none;
  color: grey;
  margin: 4px;

  &:hover {
    background-color: black;
  }
`;

const PaginationContainer = styled.div`
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

function FinishProject() {
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 10;


  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects.slice(
    indexOfFirstProject,
    indexOfLastProject
  );

  const paginate = (pageNumber:number) => setCurrentPage(pageNumber);
  const PageNumbers = () => {
    const totalPages = Math.ceil(projects.length / projectsPerPage);

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

  const refresh = () => {
    // Use setTimeout for a simple refresh delay, could be replaced with state-based re-rendering if needed
    setTimeout(function () {
      window.location.reload();
    }, 100);
  };

  const handleDeleteClick = async (e:React.MouseEvent<HTMLButtonElement>, projectId:number) => {
    e.stopPropagation();
    const isConfirmed = window.confirm("프로젝트를 삭제하시겠습니까?");
    if (!isConfirmed) return;

    try {
      const response = await projectApi.deleteProject(projectId);
      if (response.data && response.data.success) {
        // If deletion is successful, filter out the deleted project and update the state
        const updatedProjects = projects.filter(
          (project:any) => project.projectId !== projectId
        );
        setProjects(updatedProjects);
        alert("프로젝트가 삭제 처리 되었습니다.");
      } else {
        // Handle the case where the API did not return a success message
        alert("프로젝트 삭제에 실패했습니다. " + response.data.message);
      }
    } catch (error) {
      console.error("Error deleting the project:", error);
      alert("프로젝트 삭제에 실패했습니다.");
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await projectApi.getProjectList();
        if (response.data && response.data.success === false) {
          if (response.data.code === 7000) {
            //OngoingProject에서 해줌.
          } else if (response.data.code === 7001) {
            sessionStorage.removeItem("login-token");
            delete axios.defaults.headers.common["Authorization"];
          }
          return;
        }
        const checkedProjects = response.data.list.filter(
          (item:any) => item.isFinished === true
        );

        setProjects(checkedProjects);
      } catch (error) {
        console.error("Error fetching the projects:", error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <AppContainer>
      <ProjectWrapper>
      <Container>
        <LabelArea>
          <TitleSm>Done</TitleSm>
        </LabelArea>
      </Container>

      <ProjectsContainer>
          {projects.map((project:any) => (
              <ProjectItemWrapper>
                <ProjectItemContent>
                  <div>
                    <ProjectTitle>{project.name}</ProjectTitle>
                    <ProjectPeriod>
                      {project.startDate.toString()}~{project.finishDate.toString()}
                    </ProjectPeriod>
                    <ProjectDescription>{project.description}</ProjectDescription>
                  </div>
                  </ProjectItemContent>
                <ButtonsContainer>
                  <DeleteButton
                    onClick={(e) => handleDeleteClick(e, project.projectId)}
                  >
                    <FaTrash />
                  </DeleteButton>
                </ButtonsContainer>
              </ProjectItemWrapper>
            ))
          }
        </ProjectsContainer>

      <PageNumbers />
      </ProjectWrapper>
    </AppContainer>
  );
}
export default FinishProject;
