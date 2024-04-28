import DashboardBody from 'Components/common/DashboardBody';
import { media } from 'Components/common/Font';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import myPageApi from 'api/myPageApi';
import MyCalendar from './MyCalendar';
import RightMyPage from './RightMyPage';
import MyTodo from './MyTodo';

const DashboardBox = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 90%;
  margin: auto;
`;

const Panel = styled.div<{ expanded: boolean }>`
  display: flex;
  flex: 1;
  height: ${(props) => (props.expanded ? "1000px" : "500px")};
  transition: height 0.3s ease-in-out;

  @media ${media.half} {
    flex-direction: column;
  }
`;

const Left = styled.div<{ expanded: boolean }>`
  padding: 20px;
  background-color: white;
  flex-basis: 50%;
  height: ${(props) => (props.expanded ? "1000px" : "600px")};
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

const LeftComponent = styled.div`
  height: 33.33%;
  margin-bottom: 20px;
`;

const TodayChecklistContainer = styled.div`
  // display: grid;
  // grid-template-columns: 1fr 1fr;
  // gap: 20px;
`;

const CheckList = styled.div`
  height: 33.33%;
  margin-bottom: 20px;
`;

const Today = styled.div`
  height: 33.33%;
  margin-bottom: 20px;
`;

const RightDashboard = styled.div`
  height: 33.33%;
  margin-bottom: 20px;
`;

const MyPage = () => {
  const [expanded, setExpanded] = useState(false);
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();

  return (
    <DashboardBox>
      <DashboardBody>
        <Panel expanded={expanded}>
          <Left expanded={expanded}>
            <LeftComponent>
              <MyCalendar/>
            </LeftComponent>
          </Left>
          <RightDashboard />
          <RightMyPage/>
        </Panel>
      </DashboardBody>
    </DashboardBox>
  );
};

export default MyPage;
