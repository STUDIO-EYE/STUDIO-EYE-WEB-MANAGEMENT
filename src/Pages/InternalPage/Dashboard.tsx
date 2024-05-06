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
  padding: 20px;
  @media ${media.half} {
    overflow:visible;
  }
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
  width: 100%;
  height: auto;
  margin-top: -4rem;
  @media ${media.half}{
    flex-direction:column;
  }
`;

const LeftComponent = styled.div`
  margin-bottom: 20px;
`;

const Left = styled.div<{ expanded: boolean }>`
margin-top: 15px;
  flex-basis: 50%;
  height: ${(props) => (props.expanded ? "1000px" : "600px")};
  display: flex;
  flex-direction: column;
`;

const NewPanel = styled.button`
  height: 300px;
  width: 100%;
  background-color: blue;
  border-radius: 40px;
  transition: height 0.3s ease-in-out;
`;

const Dashboard = ({ projectId }: { projectId: number }) => {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();
  const projectInfo = { ...location.state }
  const [scrolled, setScrolled] = useState(false);

  const [completedCount, setCompletedCount] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [modaldiv, setModaldiv] = useState(false);

  const updateProgress = (completed: number, total: number) => {
    setCompletedCount(completed);
    setTotalCount(total);
  };

  const toggleExpansion = () => {
    setExpanded(!expanded);
  };

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop } = event.currentTarget;
    setScrolled(scrollTop > 0); /* 스크롤이 위로 올라가면 true, 아니면 false */
  };

  const onDarkBackground = (is: boolean) => {
    setModaldiv(is)
  }

  return (
    // <div style={{ position: 'relative' }}>
    //   {modaldiv ? <div style={{ position: 'fixed', backgroundColor: "black", zIndex: 999, width: '100%', height: '100%', marginTop: '0', opacity: '0.3', top: 0, left: 0, touchAction: 'none' }} />
    //     : null}
    <DashboardBox>
      <DashboardBody onScroll={() => handleScroll}>
        <Panel expanded={expanded}>
          <Left expanded={expanded}>
            <LeftComponent>
              <WeekCalendar projectId={projectId} onDarkBackground={onDarkBackground} />
              <CheckList projectId={projectId} updateProgress={updateProgress} />
            </LeftComponent>
          </Left>
          <RightDashboard
            projectData={projectInfo}
            projectId={projectId}
            completedCount={completedCount}
            totalCount={totalCount}
          />
        </Panel>
        {expanded && <NewPanel />}
      </DashboardBody>
    </DashboardBox>
  );
};

export default Dashboard;
