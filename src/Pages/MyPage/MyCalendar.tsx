import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FaPen, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import myPageApi from "../../api/myPageApi";
import axios from "axios";
import { theme } from "LightTheme";
import NewButton from "Components/common/NewButton";

const Container = styled.div`
  background-color: #ffffff;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
  margin-bottom: 50px;
  border-radius: 15px;
`;

const List = styled.div`
  margin-top: -15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 0.1rem solid ${theme.color.gray20};
`;

const ArrowButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 12px;
`;

const Calendar = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 14%);
  gap: 1px;
  // border: 1px solid #e0e0e0;
  max-width: 100%;
  // background-color: #f7f7f7;
  margin-left: 0.1rem;
  margin-right: auto;
`;

const ManageButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 0 5px 10px 0;
`;

const ManageButton = styled.button`
  background-color: white;
  display: flex;
  color: #a9a9a9;
  border: none;
  padding: 8px 16px;
  font-size: 10px;
  align-items: flex-end;
  cursor: pointer;
  border-radius: 5px;

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
  text-align: start;
  position: fixed;
  width: 30%;
  height: 20%;
  overflow-x: hidden;
  top: 40%;
  left: 50%;
  transform: translate(-30%, -30%);
  border-radius:10px;
  background-color: white;
  padding: 1rem;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

const DayHeader = styled.div<{ isWeekend: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  height: 30px;
  font-size: 12px;
  font-weight: 500;
  color: ${(props) => (props.isWeekend ? "red" : "black")};
`;

const Day = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  background-color: #ffffff;
  height: 3rem;
  font-size: 12px;
  color: black;
  cursor: pointer;
  margin:0.1rem;

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

const EventItem=styled.span`
  cursor:pointer;
  display:block;
  font-size:0.85rem;
  margin-bottom:0.2rem;
  padding: 0.2rem;
  background-color:${theme.color.gray10};
  border-radius: 5px;
`;

interface Event {
  userScheduleId: number;
  content: string;
  startDate: string;
  endDate:string;
}

const MyCalendar = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showEvent,setShowEvent]=useState<{is:boolean;event:Event[]}>({
    is:false,
    event:[]});
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [message, setMessage] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await myPageApi.getCalendarEvents();
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
  }, []);

  const getDayColor = (dayIndex: number): string => {
    switch (dayIndex) {
      case 0:
        return "#ffb3b3";
      case 1:
        return "#ffdab3";
      case 2:
        return "#ffffb3";
      case 3:
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

  const getWeekDates = (date: Date): Date[] => {
    const weekDates: Date[] = [];
    let startDate = new Date(date);
    startDate.setDate(date.getDate() - date.getDay());

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      weekDates.push(currentDate);
    }

    return weekDates;
  };

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

  const findEventsForDate = (date: Date): Event[] => {
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

  const currentWeekDates = getWeekDates(currentDate);

  const fetchEvents = async () => {
    try {
      const response = await myPageApi.getCalendarEvents();
      setEvents(response.data.list);
    } catch (error) {
      console.error("Error fetching the schedules", error);
    }
  };

  const handleDeleteEvent = async (scheduleId: number) => {
    try {
      await myPageApi.deleteCalendarEvent(scheduleId);
      fetchEvents();
      alert("성공적으로 삭제되었습니다.");
      window.location.reload();
    } catch (error) {
      console.error("스케줄 삭제 중 오류 발생", error);
    }
  };

  const handleEditEventSave = async (scheduleId: number, newText: string) => {
    const eventToUpdate = events.find((e) => e.userScheduleId === scheduleId);

    if (eventToUpdate) {
      try {
        const updatedData: Event = { ...eventToUpdate, content: newText };
        await myPageApi.putCalendarEventByUserId(scheduleId, updatedData);

        setEvents((prevEvents) =>
          prevEvents.map((e) => (e.userScheduleId === scheduleId ? updatedData : e))
        );
        setShowModal(false);
        alert("성공적으로 수정되었습니다.");
        window.location.reload();
      } catch (error) {
        console.error("스케줄 업데이트 중 오류 발생", error);
      }
    }
  };

  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  return (
    <div className="App">
      <Container>
        <CalendarHeader>
          <span style={{cursor: 'pointer',fontSize:'0.8rem',margin:'1rem'}} onClick={goToNewDate}>
            {currentDate.toLocaleString('en-GB',{month:'long'})+" "+currentDate.getFullYear()}
          </span>
          <div>
            <ArrowButton onClick={goToPreviousWeek}>
              <FaArrowLeft />
            </ArrowButton>
            <ArrowButton onClick={goToNextWeek} style={{margin:'1rem'}}>
              <FaArrowRight />
            </ArrowButton>
          </div>
        </CalendarHeader>
        <Calendar>
          {days.map((day, index) => (
            <DayHeader key={index} isWeekend={index === 0 || index === 6}>
              {day}
            </DayHeader>
          ))}

          {currentWeekDates.map((date) => {
            const eventsForDate = findEventsForDate(date);
            return (
              <Day
                key={date.toString()}
                onClick={() => {
                  if (eventsForDate.length) {
                    setShowEvent({is:true,event:eventsForDate});
                    // setEditingEvent(eventsForDate[0]);
                    setShowModal(true);
                  }
                }}
              >
                <div>{date.getDate()}</div>
                <ScheduleItem
                  onClick={() => {
                    setShowEvent({is:true,event:eventsForDate});
                    setShowModal(true);
                  }}
                  style={{ backgroundColor: getDayColor(date.getDay()) }}>
                    {eventsForDate.length!=0?eventsForDate.length:""}
                  </ScheduleItem>
              </Day>
            );
          })}


          {showModal && (
            <Modal>
              {showEvent.is&&(
                <>
                <span style={{fontWeight:'500', marginBottom:'0.5rem',display:'block'}}>이벤트 목록</span>
                {showEvent.event.map((event)=>{
                  return (
                    <EventItem onClick={() => {
                      setShowEvent({is:false,event:showEvent.event})
                      setEditingEvent(event);
                      }}>{
                        event.content.length>22?event.content.slice(0,22)+"...":
                        event.content}</EventItem>
                  )
                })}
                </>
              )}
              {editingEvent && (
                <div>
                  <textarea
                    style={{width:'100%',height:'4rem',marginBottom:'0.5rem'}}
                    value={editingEvent.content}
                    onChange={(e) => {
                      if (editingEvent) {
                        const updatedEvent: Event = {
                          ...editingEvent,
                          content: e.target.value,
                        };
                        setEditingEvent(updatedEvent);
                      }
                    }}
                  />
                  <NewButton backcolor={theme.color.lightOrange} textcolor={theme.color.darkOrange} width={"30%"} height={""} margin="0 5% 0.3rem 0"
                    onClick={() =>
                      editingEvent && handleEditEventSave(editingEvent.userScheduleId, editingEvent.content)}>수정</NewButton>
                  <NewButton backcolor={theme.color.lightOrange} textcolor={theme.color.darkOrange} width={"30%"} height={""} margin="0 5% 0 0"
                    onClick={() =>
                      editingEvent && handleDeleteEvent(editingEvent.userScheduleId)}>삭제</NewButton>
                  <NewButton backcolor={theme.color.lightOrange} textcolor={theme.color.darkOrange} width={"30%"} height={""} margin="0 0 0 0"
                    onClick={() => {
                      setEditingEvent(null)
                      setShowEvent({is:true,event:showEvent.event})
                    }}>취소</NewButton>
                </div>
              )}
              <NewButton backcolor={theme.color.orange} width={"100%"} height={"1.2rem"} onClick={()=>{setShowModal(false)
                setEditingEvent(null)}}>닫기</NewButton>
            </Modal>
          )}
        </Calendar>
        <ManageButtonContainer>
          <ManageButton
            onClick={() =>
              navigate("/myManage")
            }
          >
            <FaPen />
          </ManageButton>
        </ManageButtonContainer>
      </Container>

    </div>
  );
};

export default MyCalendar;
