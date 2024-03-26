import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FaPen, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import scheduleApi from "../../../api/scheduleApi";
import axios from "axios";

const List = styled.div`
  margin-top: -15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;
const Title = styled.text`
  font-size: 1.5rem;
  font-weight: 600;
`;
const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
`;

const ArrowButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 20px;
`;

const Calendar = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  border: 1px solid #e0e0e0;
  max-width: 100%;
  background-color: #f7f7f7;
  margin-left: auto;
  margin-right: auto;
`;
const ManageButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 20px 0;
`;

const ManageButton = styled.button`
  background-color: white;
  display: flex;
  color: #a9a9a9;
  border: none;
  padding: 8px 16px;
  font-size: 20px;
  align-items: flex-end;
  cursor: pointer;
  border-radius: 5px;
  margin-top: -20px;

  transition: background-color 0.3s;

  &:hover {
    background-color: whitesmoke;
  }
`;
const MoreButton = styled.button`
  background-color: transparent;
  border: transparent;
  font-size: 12px;
`;

const Modal = styled.div`
  text-align: center;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

const DayHeader = styled.div<{ isWeekend: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  height: 30px;
  font-size: 14px;
  color: ${(props) => (props.isWeekend ? "red" : "black")};
`;

const Day = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  background-color: #ffffff;
  height: 86px;
  font-size: 12px;
  color: black;
  cursor: pointer;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const ScheduleItem = styled.p`
  margin-top: -2px;
  margin-bottom: 6px;
  color: grey;
  background-color: red;
  padding: 0px 8px;
  border-radius: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
  cursor: pointer;
`;

function WeekCalendar({ projectId }: { projectId: number }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<any[]>([]);
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await scheduleApi.getScheduleList(projectId);
        if (response.data && response.data.success === false) {
          if (response.data.code === 6001) {
            setMessage(response.data.message);
          } else if (response.data.code === 7001) {
            sessionStorage.removeItem("login-token");
            delete axios.defaults.headers.common["Authorization"];
            return;
          }
          return;
        }
        setEvents(response.data.list);
      } catch (error) {
        console.error("Error fetching the schedules", error);
      }
    };

    fetchEvents();
  }, [projectId]);

  const getDayColor = (dayIndex: number) => {
    switch (dayIndex) {
      case 0:
        return "#ffb3b3";
      case 1:
        return "#ffdab3";
      case 2:
        return "#ffffb3";
      case       3:
        return "#d1ffb3";
      case 4:
        return "#b3e0ff";
      case 5:
        return "#dab3ff";
      case 6:
        return "#ffb3e1";
      default:
        return "#ffffff";
    }
  };

  const getWeekDates = (date: Date) => {
    const weekDates: Date[] = [];
    let startDate = new Date(date.getTime());
    startDate.setDate(date.getDate() - date.getDay());

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      weekDates.push(currentDate);
    }

    return weekDates;
  };

  const currentWeekDates = getWeekDates(currentDate);

  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const goToNewDate = () => {
    const newDateString = window.prompt(
        "궁금한 일정을 YYYY-MM-DD 형식으로 입력하세요:",
        currentDate.toISOString().split("T")[0]
    );
    if (newDateString) {
      const newDate = new Date(newDateString);
      if (!isNaN(newDate.getTime())) {
        setCurrentDate(newDate);
      } else {
        alert("유효한 날짜 형식이 아닙니다.");
      }
    }
  };

  const findEventsForDate = (date: Date) => {
    const targetDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
    ).getTime();

    return events.filter((e) => {
      const eventStartDate = new Date(
          new Date(e.startDate).getFullYear(),
          new Date(e.startDate).getMonth(),
          new Date(e.startDate).getDate()
      ).getTime();
      const eventEndDate = new Date(
          new Date(e.endDate).getFullYear(),
          new Date(e.endDate).getMonth(),
          new Date(e.endDate).getDate(),
          23,
          59,
          59,
          999
      ).getTime();

      return targetDate >= eventStartDate && targetDate <= eventEndDate;
    });
  };

  const days = ["일", "월", "화", "수", "목", "금", "토"];

  return (
      <div className="App">
        <div>
          <div>
            <button onClick={goToPreviousWeek}>
              <FaArrowLeft />
            </button>
            <span onClick={goToNewDate}>{currentDate.toDateString()}</span>
            <button onClick={goToNextWeek}>
              <FaArrowRight />
            </button>
          </div>
          <div>
            {days.map((day) => (
                <div key={day}>{day}</div>
            ))}
          </div>
          <div>
            {currentWeekDates.map((date) => {
              const eventsForDate = findEventsForDate(date);
              const hasMoreEvents = eventsForDate.length > 3;
              return (
                  <div key={date.toISOString()}>
                    <DayHeader isWeekend={date.getDay() === 0 || date.getDay() === 6}>
                      {date.getDate()}
                    </DayHeader>
                    {eventsForDate.slice(0, 3).map((event, index) => (
                        <ScheduleItem key={index}>{event.content}</ScheduleItem>
                    ))}
                    {hasMoreEvents && (
                        <button onClick={() => setShowModal(true)}>더보기..</button>
                    )}
                  </div>
              );
            })}
          </div>
        </div>
        <div>
          <button onClick={() => navigate("/manage", { state: { projectId: projectId } })}>
            <FaPen />
          </button>
        </div>
      </div>
  );
}

export default WeekCalendar;
