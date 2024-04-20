import DashboardBody from 'Components/common/DashboardBody';
import { media } from 'Components/common/Font';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import myPageApi from 'api/myPageApi';

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
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
`;

const WeekCalendar = styled.div`
  height: 50%;
  margin-bottom: 20px;
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

  useEffect(() => {
    const fetchCalendarEvents = async () => {
      try {
        const response = await myPageApi.getCalendarEventsByUserId(userId); // userId 전달
        const responseData = response.data; // data 속성 가져오기
        
        if (responseData.success) {
          alert("Calendar events fetched");
          // 추가 로직 구현
        } else if (responseData.success === false) {
          if (responseData.code === 7000) {
            alert("로그인을 먼저 진행시켜 주시길 바랍니다.");
            navigate("/LoginPage");
          } else if (responseData.code === 7001) {
            alert("세션이 만료되었습니다. 다시 로그인 해주세요.");
            sessionStorage.removeItem("login-token");
            delete axios.defaults.headers.common["Authorization"];
            navigate("/LoginPage");
          } else if (responseData.code === 8000) {
            alert("해당 사용자는 " + responseData.message);
          }
        } else {
          alert("오류가 발생했습니다.");
        }
      } catch (error) {
        console.error("Error fetching calendar events:", error);
        alert("오류가 발생했습니다.");
      }
    };

    fetchCalendarEvents();
  }, [userId, navigate]);
  return (
    <DashboardBox>
      <DashboardBody>
        <Panel expanded={expanded}>
          <Left expanded={expanded}>
            <LeftComponent>
              <WeekCalendar />
            </LeftComponent>

            <TodayChecklistContainer>
              <LeftComponent>
                <Today />
              </LeftComponent>
              <LeftComponent>
                <CheckList />
              </LeftComponent>
            </TodayChecklistContainer>
          </Left>
          <RightDashboard />
        </Panel>
      </DashboardBody>
    </DashboardBox>
  );
};

export default MyPage;
