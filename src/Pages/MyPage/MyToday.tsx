import React, { useState, useEffect } from "react";
import styled from "styled-components";
import myPageApi from "../../api/myPageApi";
import axios from "axios";
import { TitleSm } from "Components/common/Font";

const Container = styled.div`
  max-width: 225px;
  min-height: 150px; /* 기본 높이 설정 */
  background-color: #ffffff;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin: 20px auto;
  border-radius: 15px;
`;

const ListItem = styled.div`
  margin-top: 5px;
`;

const Item = styled.li`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 10px;
  border-radius: 5px;
  margin: 10px 0 10px 0;
  background-color: #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  overflow-x: auto;

  white-space: nowrap;
  text-overflow: ellipsis;
`;

function MyToday() { // projectId 타입 명시
  const [todayEvents, setTodayEvents] = useState<any[]>([]); // todayEvents의 타입 명시

  useEffect(() => {
    const fetchTodayEvents = async () => {
      try {
        const kstToday = new Date().toLocaleDateString("en-CA", {
          timeZone: "Asia/Seoul",
        });
        const todayTimestamp = new Date(kstToday).getTime();

        const response = await myPageApi.getCalendarEvents();
        if (response.data && response.data.success === false) {
          if (response.data.code === 6001) {
            console.log(response.data.message); // "일정 목록이 존재하지 않습니다."
          } else if (response.data.code === 7001) {
            sessionStorage.removeItem("login-token");
            delete axios.defaults.headers.common["Authorization"];
            return;
          }
          return;
        }
        const filteredEvents = response.data.list.filter((e: any) => { // e의 타입 명시
          const eventStartDateTimestamp = new Date(e.startDate).getTime();
          const eventEndDateTimestamp = new Date(e.endDate).getTime();

          // startDate가 오늘이거나, 오늘이 startDate와 endDate 사이에 있거나, endDate가 오늘인 경우를 모두 고려
          return (
            todayTimestamp >= eventStartDateTimestamp &&
            todayTimestamp <= eventEndDateTimestamp
          );
        });

        setTodayEvents(filteredEvents);
      } catch (error) {
        console.error("오늘의 일정을 가져오는 중 오류 발생", error);
      }
    };

    fetchTodayEvents();
  }, []);

  return (
    <Container>
      <TitleSm>오늘의 일정</TitleSm>
      <ListItem>
        {todayEvents.length === 0 ? (
          <p>오늘의 일정이 없습니다.</p>
        ) : (
          todayEvents.map((event) => (
            <Item key={event.startDate}>
              {event.content}
            </Item>
          ))
        )}
      </ListItem>
    </Container>
  );
}

export default MyToday;