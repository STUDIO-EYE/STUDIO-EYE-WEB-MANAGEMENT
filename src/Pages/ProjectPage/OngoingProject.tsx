import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { TitleSm, TextLg, TextMd } from "../../Components/common/Font";
import projectApi from "../../api/projectApi";
import { FaTrash, FaCheck, FaEdit } from "react-icons/fa";
import axios from "axios";
import jwt_decode from "jwt-decode";
import swal from 'sweetalert';


interface Project{
  projectId:number
  name:string
  startDate:Date
  finishDate:Date
  description:string
}

const ProjectWrapper = styled.div`
  width: 400px;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.08);
`;

const AppContainer = styled.div`
  text-align: center;
  justify-content: center;
  align-items: center;
  margin-top: 16px;
`;

const Container = styled.div`
  text-align: left;
`;

const ProjectsContainer = styled.div`
  display: ;
  flex-wrap: wrap;
  margin-top: 20px;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
`;

const ProjectItem = styled.div`
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

const ProjectTitle = styled.div`
  flex: 1;
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 10px;
  text-align: left;
`;

const ProjectPeriod = styled.div`
  margin-bottom: 10px;
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

const DeleteButton = styled.button`
  background-color: white;
  border-radius: 32px;
  border: none;
  outline: none;
  color: black;
  margin: 4px;

  &:hover {
    background-color: grey;
  }
`;
const CompleteButton = styled.button`
  background-color: white;
  border-radius: 32px;
  border: none;
  outline: none;
  color: green;
  margin: 4px;

  &:hover {
    background-color: grey;
  }
`;
const ModifyButton = styled.button`
  background-color: transparent;
  border-radius: 32px;
  border: none;
  outline: none;
  color: #ffa900;
  margin: 4px;

  &:hover {
    background-color: grey;
  }
`;

const LabelArea = styled.div`
  width: 100%;
  text-align: left;
`;

const CreateButton = styled.button`
  background-color: white;
  border-radius: 64px;
  border: 4px solid #ffa900;
  outline: none;

  color: #ffa900;
  padding: 8px 14px;
  margin: 4px;

  &:hover {
    background-color: #ffe9d2;
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
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentDetailsProjects, setCurrentDetailsProjects] = useState<any[]>([]);

  const projectsPerPage = 10;
  const navigate = useNavigate();

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects.slice(
    indexOfFirstProject,
    indexOfLastProject
  );
  //토큰 정보 저장
  const [tokenUserId, setTokenUserId] = useState("");
  // 페이지 번호를 렌더링하기 위한 컴포넌트
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

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await projectApi.getProjectList();
        if (response.data && response.data.success === false) {
          if (response.data.code === 7000) {
            //swal("로그인을 먼저 진행시켜 주시길 바랍니다.");
            //navigate("/LoginPage");
          } else if (response.data.code === 7001) {
            alert("세션이 만료되었습니다. 다시 로그인 해주세요.");
            sessionStorage.removeItem("login-token");
            delete axios.defaults.headers.common["Authorization"];
            navigate("/LoginPage");
          }
          return;
        }
        const checkedProjects = response.data.list.filter(
          (item:any) => item.isFinished === false
        );
        setProjects(checkedProjects.reverse());

        // 각 프로젝트에 대한 정보를 가져와서 저장
        const projectDetails:any[] = await Promise.all(
            checkedProjects.map((project:Project) =>
                projectApi.getProjectDetails(project.projectId)
            )
        );
        // console.log(projectDetails[index].data.success); 이걸 전부 돌려서 true인것 중에 현재 나의 토큰유저ID와 같은 맴버의 유저ID의 role이 팀장인 프로젝트만 수정 삭제 완료 버튼이 보이도록.
        // console.log(projectDetails[index].data.data.leaderAndMemberList[index].role); //역할 경로
        // console.log(projectDetails[index].data.data.leaderAndMemberList[index].userId); //유저 경로
        const token = sessionStorage.getItem("login-token");
        if (token) {
          const decodedToken:any = jwt_decode(token);
          setTokenUserId(decodedToken.userId);
        }
        setCurrentDetailsProjects(projectDetails);

      } catch (error) {
        console.error("Error fetching the projects:", error);
      }
    };

    fetchProjects();
  }, []);
  const isTeamLeader = (currentDetailsProjects:any) => {
    if (!currentDetailsProjects.data.success) {

      return false;
    }
    const leaderAndMemberList = currentDetailsProjects.data.data.leaderAndMemberList;
    const teamLeader = leaderAndMemberList.find(
        (member:any) => member.userId === tokenUserId && member.role === '팀장'
    );

    return !!teamLeader;
  };


  const handleAddProject = () => {
    navigate("/Project");
  };
  const handleRowClick = (projectId:number) => {
    navigate(`/Manage/${projectId}`);
  };
  const goToHome = () => {
    // setTimeout(function () {
    //   window.location.reload();
    // }, 100);
    navigate(`/`);
  };
  const refresh = () => {
    setTimeout(function () {
      window.location.reload();
    }, 100);
  };
  const renumberProjects = (projects:Project[]) => {
    return projects.map((project:Project, index:number) => {
      return {
        ...project,
        id: index + 1,
      };
    });
  };

  const handleDeleteClick = async (e:any, projectId:number) => {
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

      // const updatedProjects = projects.filter(
      //   (project) => project.projectIndex !== projectId
      // );
      // setProjects(updatedProjects);
    } catch (error) {
      console.error("Error deleting the project:", error);
      alert("프로젝트 삭제에 실패했습니다."); // 에러 알림 메시지 추가
    }
  };

  const handleCompleteClick = async (e:any, projectId:number) => {
    e.stopPropagation();
    const isConfirmed = window.confirm("프로젝트를 완료하시겠습니까?");
    if (!isConfirmed) return;
    try {
      // const updatedProject = projects.find(
      //   (project) => project.projectIndex === projectId
      // );
      // updatedProject.status = "Completed";
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
      // const updatedProjects = projects.map((project) =>
      //   project.projectIndex === projectId ? updatedProject : project
      // );
      // setProjects(updatedProjects);
    } catch (error) {
      console.error("Error marking the project as complete:", error);
      alert("프로젝트 완료 처리에 실패했습니다."); // 에러 알림 메시지 추가
    }
  };

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
              <ProjectItem
                key={project.projectId}
                onClick={() => handleRowClick(project.projectId)}
              >
                <ProjectTitle>{project.name}</ProjectTitle>
                <ProjectPeriod>
                  {project.startDate.toString()}~{project.finishDate.toString()}
                </ProjectPeriod>
                <ProjectDescription>{project.description}</ProjectDescription>
                <ButtonsContainer>
                  {isTeamLeader(currentDetailsProjects[index]) && (
                    <>
                      <ModifyButton
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/modify/${project.projectId}`);
                        }}
                      >
                        <FaEdit />
                      </ModifyButton>
                      <CompleteButton
                        onClick={(e) => handleCompleteClick(e, project.projectId)}
                      >
                        <FaCheck />
                      </CompleteButton>
                      <DeleteButton
                        onClick={(e) => handleDeleteClick(e, project.projectId)}
                      >
                        <FaTrash />
                      </DeleteButton>
                    </>
                  )}
                </ButtonsContainer>
              </ProjectItem>
            ))
          )}
        </ProjectsContainer>
        {/* 페이지 번호를 렌더링 */}
        <PageNumbers />
      </ProjectWrapper>
    </AppContainer>
  );
}

export default OngoingProject;
