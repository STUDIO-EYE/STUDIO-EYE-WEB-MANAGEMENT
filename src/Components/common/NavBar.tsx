import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaBriefcase, FaUser, FaChartLine } from 'react-icons/fa';
import projectApi from '../../api/projectApi';

const NavigationBar = styled.div`
  width: 225px;
  height: calc(100vh - 4rem);
  background-color: white;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 4rem;
  left: 0;
  z-index: 1000;
`;

const NavigationWrapper = styled.div`
  flex-grow: 1;
`;

const NavigationContent = styled.div`
  padding: 20px 0;
  color: black;
  font-size: 1rem;
  transition: all 0.3s;
`;

const NavigationLink = styled.div`
  display: flex;
  align-items: center;
  text-decoration: none;
  font-size: 1rem;
  padding: 20px 55px;
  font-weight: 500;
  border-radius: 0 15px 15px 0;
  position: relative;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;

  color: black;
  &:hover {
    background-color: black;
    color: #FFC83D;
  }
`;

const ProjectDropdownContainer = styled.div<{ maxHeight: number }>`
  transition: max-height 0.3s;
  overflow: hidden;
  max-height: ${({ maxHeight }) => maxHeight}px;
`;

const ProjectList = styled.div`
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 0 0 15px 15px;
`;

const ProjectItem = styled.div`
  padding: 20px 15px;
  cursor: pointer;
  transition: background-color 0.3s;
  border-radius: 0 15px 15px 0;

  color: black;
  &:hover {
    background-color: black;
    color: #FFC83D;
  }
`;

const IconContainer = styled.span`
  margin-right: 15px;
  font-size: 25px;
`;

interface Project {
  projectId: number;
  name: string;
  isFinished: boolean;
  startDate: string;
  finishDate: string;
}

const NavBar = () => {
  const [ongoingProjects, setOngoingProjects] = useState<Project[]>([]);
  const [isProjectMenuOpen, setIsProjectMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await projectApi.getProjectList();
        const ongoing = response.data.list.filter(
          (project: { isFinished: boolean }) => !project.isFinished
        );
        setOngoingProjects(ongoing);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  const handleProjectClick = (projectId: number) => {
    navigate(`/Manage/${projectId}`);
  };

  const handleMouseEnter = () => {
    setIsProjectMenuOpen(true);
  };

  const handleMouseLeave = () => {
    setIsProjectMenuOpen(false);
  };

  const maxHeight = isProjectMenuOpen ? ongoingProjects.length * 60 + 10 : 0; 

  return (
    <NavigationBar>
      <NavigationWrapper>
        <NavigationContent
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <NavigationLink>
            <IconContainer>
              <FaBriefcase />
            </IconContainer>
            프로젝트
          </NavigationLink>

          <ProjectDropdownContainer maxHeight={maxHeight}>
            <ProjectList>
              {ongoingProjects.map((project) => (
                <ProjectItem
                  key={project.projectId}
                  onClick={() => handleProjectClick(project.projectId)}
                >
                  {project.name}
                </ProjectItem>
              ))}
            </ProjectList>
          </ProjectDropdownContainer>

          <NavigationLink
            onClick={() => navigate('/mypage')}
          >
            <IconContainer>
              <FaUser />
            </IconContainer>
            마이페이지
          </NavigationLink>

          <NavigationLink
            onClick={() => navigate('/Account')}
          >
            <IconContainer>
              <FaChartLine />
            </IconContainer>
            계정
          </NavigationLink>
        </NavigationContent>
      </NavigationWrapper>
    </NavigationBar>
  );
};

export default NavBar;