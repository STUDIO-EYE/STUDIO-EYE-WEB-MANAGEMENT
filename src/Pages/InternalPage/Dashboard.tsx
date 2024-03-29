import React, { useState } from "react";
import styled from "styled-components";
import WeekCalendar from "./Dashboard/WeekCalendar";
import Today from "./Dashboard/Today";
import CheckList from "./Dashboard/CheckList";
import RightDashboard from "./Dashboard/RightDashboard";

const DashboardBox = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 50px;
  min-width: 90%;
  margin: 0 auto;
  margin-top: 32px;
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 24px;
  margin-bottom: 12px;
`;

const DashboardBody = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: height 0.3s ease-in-out;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-top: 12px;
`;

const Panel = styled.div<{ expanded: boolean }>`
  display: flex;
  flex: 1;
  height: ${(props) => (props.expanded ? "1000px" : "500px")};
  transition: height 0.3s ease-in-out;
`;
const LeftComponent = styled.div`
  height: 33.33%;
`;

const Left = styled.div<{ expanded: boolean }>`
  padding: 20px;
  background-color: white;
  flex-basis: 50%;
  height: ${(props) => (props.expanded ? "1000px" : "600px")}; // 크기 변경
  overflow-y: auto;
`;

const Line = styled.div`
  height: 80px;
`;

const Button = styled.button`
  width: 40px;
  background-color: white;
`;

const Arc = styled.div`
  display: flex;
`;

const NewPanel = styled.button`
  height: 300px;
  width: 100%;
  background-color: blue;
  border-radius: 40px;
  transition: height 0.3s ease-in-out; /* transition 추가 */
`;

const Dashboard = ({ projectId }: { projectId: number }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpansion = () => {
    setExpanded(!expanded);
  };
  return (
      <DashboardBox>
        <Arc>
          <Title>Dashboard</Title>
        </Arc>
        <DashboardBody>
          <Panel expanded={expanded}>
            <Left expanded={expanded}>
              <LeftComponent>
                <WeekCalendar projectId={projectId} />
              </LeftComponent>
              <LeftComponent>
                <Line />
                <Today projectId={projectId} />
              </LeftComponent>
              <LeftComponent>
                <CheckList projectId={projectId} />
              </LeftComponent>
            </Left>
            <RightDashboard projectId={projectId} />
          </Panel>
          {expanded && <NewPanel />}
        </DashboardBody>
      </DashboardBox>
  );
};

export default Dashboard;
