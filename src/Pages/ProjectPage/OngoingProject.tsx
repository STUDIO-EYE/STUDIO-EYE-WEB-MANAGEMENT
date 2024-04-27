import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { TitleSm, TextLg, TextMd } from "../../Components/common/Font";
import projectApi from "../../api/projectApi";
import { FaTrash, FaCheck, FaEdit, FaEllipsisH, FaCrown, FaUser, FaUserSlash } from "react-icons/fa";
import axios from "axios";
import jwt_decode from "jwt-decode";
import swal from 'sweetalert';
import { Tooltip } from "@mui/material";
import { IoAddCircle } from "react-icons/io5";
import { Dropdown, DropdownItem } from "Components/common/DropDownBox";

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

const ProjectWrapper = styled.div`
  width: 400px;
  background-color: white;
  padding: 20px;
  margin-right: 50px;
  margin-bottom: 100px;
  border-radius: 15px;
  box-shadow: 0px 15px 15px rgba(0, 0, 0, 0.1);
`;

const ProjectsContainer = styled.div`
  flex-wrap: wrap;
  margin-top: 20px;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
`;

const ProjectItemWrapper = styled.div<{ isTeamLeader: boolean }>`
  width: calc(100% - 40px);
  background-color: ${(props) => (props.isTeamLeader ? "#FFC83D" : "#F9FBFD")};
  color: ${(props) => (props.isTeamLeader ? "black" : "black")};
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  padding: 20px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  position: relative;
  border-radius: 20px;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${(props) => (props.isTeamLeader ? "#F9FBFD" : "black")};
    color: ${(props) => (props.isTeamLeader ? "black" : "white")};
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
  top: 15px;
  right: 10px;
  display: flex;
  align-items: center;
`;

const DropdownButton = styled.button<{ isTeamLeader: boolean }>`
  display: ${(props) => (props.isTeamLeader ? "block" : "none")}; 
  background-color: transparent;
  border: none;
  outline: none;
`;

const LabelArea = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  text-align: left;
  margin-bottom: 50px;
`;

const CreateButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 2rem;

  &:hover {
    color: #FFC83D;
  }
`;

const PaginationContainer = styled.div`
    margin-top: 50px;
    

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
    font-weight: 600;
    font-size: 0.5rem;
    background-color: black;
    color: white;
    padding: 10px;

    &:hover {
      background-color: #FFC83D;
      color: white;
    }
  }
`;

const MemberInfo = styled.div`
  display: flex;
  font-size: 0.8rem;
`;

const MemberInitials = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  margin-right: 5px;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 1;
  background-color: ${props => props.color || "#FFA900"};
  color: white;
  cursor: pointer;
`;

interface TooltipState {
  projectId: number;
  userId: string;
  name: string;
  email: string;
}

interface ProjectMember {
  userId: string;
  name: string;
  email: string;
  role: string;
}

function OngoingProject() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentDetailsProjects, setCurrentDetailsProjects] = useState<any[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState<{ [key: number]: boolean }>({});
  const [userInProjects, setUserInProjects] = useState<boolean[]>([]);
  const [tooltipVisible, setTooltipVisible] = useState<TooltipState | null>(null);
  const projectsPerPage = 10;
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const token = sessionStorage.getItem("login-token");
    if (token) {
      const decodedToken: any = jwt_decode(token);
      setUserName(decodedToken.username); // 토큰에서 사용자 이름 가져오기
    }
  }, []);

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
      const clickedInsideDropdown = (e.target as HTMLElement).closest('.dropdown-menu');
      if (!clickedInsideDropdown) {
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

          // 사용자가 각 프로젝트의 멤버인지 확인
          const isUserInProjects = projectDetails.map((projectDetail: any) => {
            if (
              projectDetail.data &&
              projectDetail.data.data &&
              projectDetail.data.data.leaderAndMemberList
            ) {
              return projectDetail.data.data.leaderAndMemberList.some(
                (member: any) => member.userId === decodedToken.userId
              );
            }
            return false;
          });
          setUserInProjects(isUserInProjects);
        }
        setCurrentDetailsProjects(projectDetails);
      } catch (error) {
        console.error("Error fetching the projects:", error);
      }
    };

    fetchProjects();
  }, []);


  const isTeamLeader = (projectDetails: any) => {
    if (!projectDetails || !projectDetails.data || !projectDetails.data.success) {
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

  const handleRowClick = (projectId: number, projectName: string) => {
    navigate(`/Manage/${projectId}`, { state: { name: projectName } });
  };

  const goToHome = () => {
    navigate(`/`);
  };

  const refresh = () => {
    setTimeout(function () {
      window.location.reload();
    }, 100);
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

  function handleModifyClick(e: React.MouseEvent, projectId: number): void {
    e.stopPropagation();
    navigate(`/modify/${projectId}`);
  }

  const handleMouseEnter = (projectId: number, member: ProjectMember) => {
    setTooltipVisible({
      projectId,
      userId: member.userId,
      name: member.name,
      email: member.email,
    });
  };

  const handleMouseLeave = () => {
    setTooltipVisible(null);
  };

  const isTooltipOpen = (
    tooltip: TooltipState | null,
    projectId: number,
    userId: string
  ) => {
    return (
      tooltip !== null &&
      tooltip.projectId === projectId &&
      tooltip.userId === userId
    );
  };

  return (
    <AppContainer>
      <ProjectWrapper>
        <LabelArea>
          <TitleSm>진행 중인 <br></br> 프로젝트 👇</TitleSm>
          <CreateButton type="button" onClick={handleAddProject}>
            <IoAddCircle />
          </CreateButton>
        </LabelArea>
        <ProjectsContainer>
          {currentDetailsProjects.length > 0 && (
            currentProjects.map((project: Project, index) => (
              <ProjectItemWrapper
                key={project.projectId}
                isTeamLeader={isTeamLeader(currentDetailsProjects[index])}
              >
                <ProjectItemContent onClick={() => handleRowClick(project.projectId, project.name)}>
                  <div>
                    <ProjectTitle>{project.name}</ProjectTitle>
                    <ProjectPeriod>
                      {project.startDate.toString()}~{project.finishDate.toString()}
                    </ProjectPeriod>
                    <ProjectDescription>{project.description}</ProjectDescription>
                    <MemberInfo>
                      {userInProjects[index] ? (
                        currentDetailsProjects[index]?.data?.data?.leaderAndMemberList?.map((member: ProjectMember, memberIndex: number) => (
                          <Tooltip
                            key={member.userId}
                            title={`${member.name} (${member.email})`}
                            open={isTooltipOpen(tooltipVisible, project.projectId, member.userId)}
                            disableHoverListener
                          >
                            <MemberInitials
                              onMouseEnter={() => handleMouseEnter(project.projectId, member)}
                              onMouseLeave={handleMouseLeave}
                              color={`hsl(${(memberIndex * 50) % 360}, 50%, 50%)`}
                            >
                              {member.name.slice(-2)}
                            </MemberInitials>
                          </Tooltip>
                        ))
                      ) : (
                        <span style={{ color: 'red' }}>해당 프로젝트의 멤버가 아닙니다.</span>
                      )}
                    </MemberInfo>
                  </div>
                  <ButtonsContainer>
                    <DropdownButton isTeamLeader={isTeamLeader(currentDetailsProjects[index])} onClick={(e) => toggleDropdown(e, project.projectId)}>
                      <Dropdown>
                        {isTeamLeader(currentDetailsProjects[index]) ? (
                          <>
                            <DropdownItem onClick={(e) => handleModifyClick(e, project.projectId)} style={{ color: 'black' }}>
                              <FaEdit /> 수정
                            </DropdownItem>
                            <DropdownItem onClick={(e) => handleCompleteClick(e, project.projectId)} style={{ color: 'green' }}>
                              <FaCheck /> 완료
                            </DropdownItem>
                            <DropdownItem onClick={(e) => handleDeleteClick(e, project.projectId)} style={{ color: 'red' }}>
                              <FaTrash /> 삭제
                            </DropdownItem>
                          </>
                        ) : (
                          <DropdownItem>
                            팀장이 아니므로 드롭다운 메뉴를 열 자격이 없습니다.
                          </DropdownItem>
                        )}
                      </Dropdown>
                    </DropdownButton>
                  </ButtonsContainer>
                </ProjectItemContent>
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
