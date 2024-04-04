import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { TitleSm, TextLg, TextMd } from "../../Components/common/Font";
import projectApi from "../../api/projectApi";
import { FaTrash, FaCheck, FaEdit, FaEllipsisH, FaCrown } from "react-icons/fa";
import axios from "axios";
import jwt_decode from "jwt-decode";
import swal from 'sweetalert';

interface Project {
  projectId: number;
  name: string;
  startDate: Date;
  finishDate: Date;
  description: string;
  members: string[]; // 멤버 목록 추가
}

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
  margin-right: 50px;
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

const DropdownMenu = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.08);
  z-index: 1;
`;

const DropdownButton = styled.button`
  background-color: transparent;
  border: none;
  outline: none;
  cursor: pointer;

  &:hover {
    color: rgba(0, 0, 0, 0.08);
  }
`;

const DeleteButton = styled.button`
  background-color: white;
  border: none;
  outline: none;
  color: red;
  margin: 4px;
  cursor: pointer;

  &:hover {
    background-color: rgba(0, 0, 0, 0.08);
  }
`;
const CompleteButton = styled.button`
  background-color: white;
  border: none;
  outline: none;
  color: green;
  margin: 4px;
  cursor: pointer;

  &:hover {
    background-color: rgba(0, 0, 0, 0.08);
  }
`;
const ModifyButton = styled.button`
  background-color: transparent;
  border: none;
  outline: none;
  color: #ffa900;
  margin: 4px;
  cursor: pointer;

  &:hover {
    background-color: rgba(0, 0, 0, 0.08);
  }
`;

const LabelArea = styled.div`
  width: 100%;
  text-align: left;
`;

const CreateButton = styled.button`
  background-color: white;
  border: 0px;
  margin-left: 275px;
  cursor: pointer;

  &:hover {
    background-color: rgba(0, 0, 0, 0.03);
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

function OngoingProject() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentDetailsProjects, setCurrentDetailsProjects] = useState<any[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState<{ [key: number]: boolean }>({});

  const projectsPerPage = 10;
  const navigate = useNavigate();

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects.slice(
    indexOfFirstProject,
    indexOfLastProject
  );

  // 토큰 정보 저장
  const [tokenUserId, setTokenUserId] = useState("");

  // 페이지 번호를 렌더링하기 위한 컴포넌트
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

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

  useEffect(() => {
    const closeDropdownMenu = (e: MouseEvent) => {
      // 클릭된 요소가 드롭다운 메뉴 내부 요소인지 확인
      const clickedInsideDropdown = (e.target as HTMLElement).closest('.dropdown-menu');
      if (!clickedInsideDropdown) {
        // 다른 데 클릭하면 드롭다운 메뉴 닫기
        setDropdownOpen({});
      }
    };

    document.addEventListener('click', closeDropdownMenu);

    return () => {
      document.removeEventListener('click', closeDropdownMenu);
    };
  }, []);


  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await projectApi.getProjectList();
        if (response.data && response.data.success === false) {
          if (response.data.code === 7000) {
            swal("세션이 만료되었습니다. 다시 로그인 해주세요.");
            sessionStorage.removeItem("login-token");
            delete axios.defaults.headers.common["Authorization"];
            navigate("/LoginPage");
          }
          return;
        }
        const checkedProjects = response.data.list.filter(
          (item: any) => item.isFinished === false
        );
        setProjects(checkedProjects.reverse());

        // 각 프로젝트에 대한 정보를 가져와서 저장
        const projectDetails: any[] = await Promise.all(
          checkedProjects.map((project: Project) =>
            projectApi.getProjectDetails(project.projectId)
          )
        );

        const token = sessionStorage.getItem("login-token");
        if (token) {
          const decodedToken: any = jwt_decode(token);
          setTokenUserId(decodedToken.userId);
        }
        setCurrentDetailsProjects(projectDetails);
      } catch (error) {
        console.error("Error fetching the projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const isTeamLeader = (projectDetails: any) => {
    if (!projectDetails.data.success) {
      return false;
    }
    const leaderAndMemberList = projectDetails.data.data.leaderAndMemberList;
    const teamLeader = leaderAndMemberList.find(
      (member: any) =>
        member.userId === tokenUserId && member.role === "팀장"
    );

    return !!teamLeader;
  };

  const handleAddProject = () => {
    navigate("/Project");
  };

  const handleRowClick = (projectId: number) => {
    navigate(`/Manage/${projectId}`);
  };

  const goToHome = () => {
    navigate(`/`);
  };

  const refresh = () => {
    setTimeout(function () {
      window.location.reload();
    }, 100);
  };

  const renumberProjects = (projects: Project[]) => {
    return projects.map((project: Project, index: number) => {
      return {
        ...project,
        id: index + 1,
      };
    });
  };

  const handleDeleteClick = async (e: any, projectId: number) => {
    e.stopPropagation();
    const isConfirmed = window.confirm("프로젝트를 삭제하시겠습니까?");
    if (!isConfirmed) return;

    try {
      const response = await projectApi.deleteProject(projectId);
      if (response.data && response.data.success === false) {
        if (response.data.code === 8000) {
          alert(
            "해당 사용자는 프로젝트를 생성한 '팀장'이 아닙니다.\n따라서 해당 프로젝트에 대한 권한이 없어 삭제가 불가능합니다."
          );
        }
      } else if (response.data && response.data.success === true) {
        alert("프로젝트가 삭제 처리 되었습니다.");
        refresh();
      }
    } catch (error) {
      console.error("Error deleting the project:", error);
      alert("프로젝트 삭제에 실패했습니다."); // 에러 알림 메시지 추가
    }
  };

  const handleCompleteClick = async (e: any, projectId: number) => {
    e.stopPropagation();
    const isConfirmed = window.confirm("프로젝트를 완료하시겠습니까?");
    if (!isConfirmed) return;
    try {
      const response = await projectApi.putProject(projectId);
      if (response.data && response.data.success === false) {
        if (response.data.code === 8000) {
          alert(
            "해당 사용자는 프로젝트를 생성한 '팀장'이 아닙니다.\n따라서 해당 프로젝트에 대한 권한이 없어 프로젝트 완료가 불가능합니다."
          );
        }
      } else if (response.data && response.data.success === true) {
        alert("프로젝트가 완료 처리 되었습니다.");
        refresh();
      }
    } catch (error) {
      console.error("Error marking the project as complete:", error);
      alert("프로젝트 완료 처리에 실패했습니다."); // 에러 알림 메시지 추가
    }
  };

  const toggleDropdown = (e: React.MouseEvent, projectId: number) => {
    e.stopPropagation();
    setDropdownOpen(prevState => ({
      ...prevState,
      [projectId]: !prevState[projectId]
    }));
  };

  const isDropdownOpen = (projectId: number) => dropdownOpen[projectId] || false;

  function handleModifyClick(projectId: number): void {
    navigate(`/modify/${projectId}`);
  }

  return (
    <AppContainer>
      <ProjectWrapper>
        <Container>
          <LabelArea>
            <TitleSm>In Progress</TitleSm>
            <CreateButton type="button" onClick={handleAddProject}>
              <TextLg>+</TextLg>
            </CreateButton>
          </LabelArea>
        </Container>
        <ProjectsContainer>
          {currentDetailsProjects.length > 0 && (
            currentProjects.map((project: Project, index) => (
              <ProjectItemWrapper key={project.projectId}>

                {/* 임시 추가 */}
                {isTeamLeader(currentDetailsProjects[index]) && (
                  <div style={{ position: 'absolute', top: '5px', left: '20px' }}>
                    <FaCrown color="#ffa900" size={15} />
                  </div>
                )}

                <ProjectItemContent onClick={() => handleRowClick(project.projectId)}>
                  <div>
                    <ProjectTitle>{project.name}</ProjectTitle>
                    <ProjectPeriod>
                      {project.startDate.toString()}~{project.finishDate.toString()}
                    </ProjectPeriod>
                    <ProjectDescription>{project.description}</ProjectDescription>
                  </div>
                  <ButtonsContainer>
                    <DropdownButton onClick={(e) => toggleDropdown(e, project.projectId)}>
                      <FaEllipsisH />
                    </DropdownButton>
                  </ButtonsContainer>

                </ProjectItemContent>
                {isDropdownOpen(project.projectId) && (
                  <DropdownMenu>
                    {isTeamLeader(currentDetailsProjects[index]) && (
                      <>
                        <ModifyButton onClick={() => handleModifyClick(project.projectId)}>
                          <FaEdit /> 수정
                        </ModifyButton>
                        <CompleteButton onClick={(e) => handleCompleteClick(e, project.projectId)}>
                          <FaCheck /> 완료
                        </CompleteButton>
                        <DeleteButton onClick={(e) => handleDeleteClick(e, project.projectId)}>
                          <FaTrash /> 삭제
                        </DeleteButton>
                      </>
                    )}
                  </DropdownMenu>
                )}
              </ProjectItemWrapper>
            ))
          )}
        </ProjectsContainer>
        <PageNumbers />
      </ProjectWrapper>
    </AppContainer>
  );
}

export default OngoingProject;
