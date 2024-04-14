import React, { useState } from "react";
import styled from "styled-components";
import WeekCalendar from "./Dashboard/WeekCalendar";
import Today from "./Dashboard/Today";
import CheckList from "./Dashboard/CheckList";
import RightDashboard from "./Dashboard/RightDashboard";
import DashboardBody from "Components/common/DashboardBody";
import { useLocation } from "react-router-dom";
import ProjectProgress from "./Dashboard/ProjectProgress";
import { media } from "Components/common/Font";

const DashboardBox = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 90%;
  margin: auto;
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 24px;
  margin-bottom: 12px;
`;

const Panel = styled.div<{ expanded: boolean }>`
  display: flex;
  flex: 1;
  height: ${(props) => (props.expanded ? "1000px" : "500px")};
  transition: height 0.3s ease-in-out;

  @media ${media.half}{
    flex-direction:column;
  }
`;

const LeftComponent = styled.div`
  height: 33.33%;
  margin-bottom: 50px;
`;

const Left = styled.div<{ expanded: boolean }>`
  padding: 20px;
  background-color: white;
  flex-basis: 50%;
  height: ${(props) => (props.expanded ? "1000px" : "600px")}; // 크기 변경
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

const Line = styled.div`
  height: 80px;
`;

const Button = styled.button`
  width: 40px;
  background-color: white;
`;

const Arc = styled.div<{ scrolled: boolean }>` /* 스크롤 여부에 따라 스타일 변경 */
  margin-left: 225px;
  margin-bottom: 30px;
  display: flex;
  position: absolute; /* 절대 위치 설정 */
  transition: background-color 0.3s ease; /* 배경색 변경에 transition 적용 */
  ${(props) =>
    props.scrolled &&
    "background-color: rgba(255, 255, 255, 0.8);"} /* 스크롤 시 반투명하게 설정 */
`;

const NewPanel = styled.button`
  height: 300px;
  width: 100%;
  background-color: blue;
  border-radius: 40px;
  transition: height 0.3s ease-in-out; /* transition 추가 */
`;

const TodayChecklistContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr; /* 두 칸으로 분할 */
  gap: 20px;
`;

const Dashboard = ({ projectId }: { projectId: number }) => {
  const [expanded, setExpanded] = useState(false);
  const location=useLocation();
  const projectInfo={...location.state}
  const [scrolled, setScrolled] = useState(false); /* 스크롤 여부 상태 */

  const [completedCount, setCompletedCount] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);

  const updateProgress = (completed: number, total: number) => {
    setCompletedCount(completed);
    setTotalCount(total);
    console.log("개수" + completed);
  };

  const toggleExpansion = () => {
    setExpanded(!expanded);
  };

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop } = event.currentTarget;
    setScrolled(scrollTop > 0); /* 스크롤이 위로 올라가면 true, 아니면 false */
  };

  return (
    <DashboardBox>
      <Arc scrolled={scrolled}> {/* scrolled prop 전달 */}
        <Title>{projectId}번 프로젝트</Title>
      </Arc>
      <DashboardBody onScroll={() => handleScroll}> {/* 스크롤 이벤트 핸들러 추가 */}
        <Panel expanded={expanded}>
          <Left expanded={expanded}>
            <LeftComponent>
              <WeekCalendar projectId={projectId} />
            </LeftComponent>
            <LeftComponent>
              <ProjectProgress completedCount={completedCount} totalCount={totalCount} />
            </LeftComponent>
            {/* Today와 CheckList를 감싸는 컨테이너 추가 */}
            <TodayChecklistContainer>
              <LeftComponent>
                <Today projectId={projectId} />
              </LeftComponent>
              <LeftComponent>
                <CheckList projectId={projectId} updateProgress={updateProgress} />
              </LeftComponent>
            </TodayChecklistContainer>
          </Left>
          <RightDashboard projectData={projectInfo} projectId={projectId} />
        </Panel>
        {expanded && <NewPanel />}
      </DashboardBody>
    </DashboardBox>
  );
};

export default Dashboard;
