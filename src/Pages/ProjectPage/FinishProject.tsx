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
const StyledTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 16px;

  th,
  td {
    padding: 15px;
    text-align: center;
  }

  tbody tr {
    background-color: #ffffff;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.08);
  }
  tbody tr td {
    padding: 20px 64px;
  }

  thead tr th:nth-child(3),
  thead tr th:nth-child(4) {
    margin-left: 10px !important;
  }

  tbody tr:hover {
    background-color: #f5f5f5;
  }
  tbody tr td:nth-child(3),
  tbody tr td:nth-child(4) {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 150px;
  }
`;
const LabelArea = styled.div`
  width: 128px;
  background: transparent;
  border: 2px solid #ff530e;
  border-radius: 32px;
  text-align: center;
  color: #ff530e;
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

  // ...기존 함수들...

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects.slice(
    indexOfFirstProject,
    indexOfLastProject
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
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

  const handleDeleteClick = async (e, projectId) => {
    e.stopPropagation();
    const isConfirmed = window.confirm("프로젝트를 삭제하시겠습니까?");
    if (!isConfirmed) return;

    try {
      const response = await projectApi.deleteProject(projectId);
      if (response.data && response.data.success) {
        // If deletion is successful, filter out the deleted project and update the state
        const updatedProjects = projects.filter(
          (project) => project.projectId !== projectId
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
          (item) => item.isFinished === true
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
      <Container>
        <LabelArea>
          <TitleSm>완료</TitleSm>
        </LabelArea>
      </Container>

      <StyledTable>
        <thead>
          <tr>
            <th>번호</th>
            <th>기한</th>
            <th>프로젝트명</th>
            <th>프로젝트 소개</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.projectId}>
              {/*<td>{index + 1}</td>*/}
              <td>{project.projectId}</td>
              <td>
                {project.startDate}~{project.finishDate}
              </td>
              <td>{project.name}</td>
              <td>{project.description}</td>
              <td>
                <DeleteButton
                  onClick={(e) => handleDeleteClick(e, project.projectId)}
                >
                  <FaTrash />
                </DeleteButton>
              </td>
            </tr>
          ))}
        </tbody>
      </StyledTable>
      <PageNumbers />
    </AppContainer>
  );
}
export default FinishProject;
