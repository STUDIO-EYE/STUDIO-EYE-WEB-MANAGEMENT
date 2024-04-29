import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FaPen, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import scheduleApi from "../../../api/scheduleApi";
import axios from "axios";
import { TitleSm } from "Components/common/Font";
import { theme } from "LightTheme";
import NewButton from "Components/common/NewButton";
import Calendar from "react-calendar";
import moment from "moment";

const Container = styled.div`
  background-color: #ffffff;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
`;

const CustomCalendar=styled(Calendar)`
.react-calendar {
  width: 100%;
  max-width: 100%;
  background: white;
  line-height: 1.125em;
}
.react-calendar button {
  margin: 0;
  border: 0;
  outline: none;
  border:none;
}
button {
  padding:4px;
  border-radius: 5px;
  &:hover {
    
  }
}

.react-calendar__navigation {
  display: flex;
  height: 44px;
  margin-bottom: 1em;
}
.react-calendar__navigation button {
  min-width: 44px;
  background: white;
  border:none;
  &:hover{
    background-color:${theme.color.gray10};
    cursor:pointer;
  }
}

.react-calendar__month-view__weekdays__weekday {
  font-size:0.7rem;
  color:${theme.color.gray40};
  margin-bottom:0.5rem;
  text-decoration:none;
}
.react-calendar__month-view__weekdays abbr {
  text-decoration: none;
}
.react-calendar__month-view__days__day--weekend {
  color: #fff;
  font-size: 18px;
  text-decoration: none;
  width: 44px;
  height: 44px;
  text-align: center;
}
.react-calendar__month-view__weekNumbers .react-calendar__tile {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  font: inherit;
  font-size: 0.3em;
}
.react-calendar__month-view__days__day--weekend {
  color: #d10000;
}

.react-calendar__month-view__days__day--neighboringMonth,
.react-calendar__decade-view__years__year--neighboringDecade,
.react-calendar__century-view__decades__decade--neighboringCentury {
  color: ${theme.color.gray20};
}

.react-calendar__year-view .react-calendar__tile,
.react-calendar__decade-view .react-calendar__tile,
.react-calendar__century-view .react-calendar__tile {
  padding: 2em 0.5em;
}

.react-calendar__tile {
  width: 100%;
  background: none;
  text-align: left;
  font: inherit;
  font-size: 0.7rem;
  display:flex;
  flex-direction:column;
  border:none;
}

.react-calendar__tile:disabled {
  background-color: #f0f0f0;
  color: #ababab;
}

.react-calendar__month-view__days__day--neighboringMonth:disabled,
.react-calendar__decade-view__years__year--neighboringDecade:disabled,
.react-calendar__century-view__decades__decade--neighboringCentury:disabled {
  color: #cdcdcd;
}

.react-calendar__tile:enabled:hover,
.react-calendar__tile:enabled:focus {
  background-color: ${theme.color.gray10};
}
.react-calendar__tile--now {
  background: ${theme.color.lightOrange};
}
.react-calendar__tile--now:enabled:hover,
.react-calendar__tile--now:enabled:focus {
  background: ${theme.color.lightOrange};
}

.react-calendar__tile--hasActive {
  background: ${theme.color.gray20};
}
.react-calendar__tile--active {
  background: ${theme.color.orange};
  color: white;
}
.react-calendar__tile--active:enabled:hover,
.react-calendar__tile--active:enabled:focus {
  background: ${theme.color.orange};
}
.react-calendar--selectRange .react-calendar__tile--hover {
  background-color: ${theme.color.orange};
}

/* 일정 있는 날 표시 점 */
.dot {
  height: 13px;
  width: 12px;
  background-color: ${theme.color.black};
  border-radius: 50%;
  text-align: center;
  margin-top: 3px;
}
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

interface Event {
  scheduleId: number;
  content: string;
  startDate: string;
  endDate:string;
}

interface WeekCalendarProps {
  projectId: number;
}

const WeekCalendar: React.FC<WeekCalendarProps> = ({ projectId }) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showEvent,setShowEvent]=useState<{is:boolean;event:Event[]}>({
    is:false,
    event:[]});
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isChanging,setIsChanging]=useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [selectDate,setSelectDate]=useState<Date>(new Date());

  const navigate = useNavigate();

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

    if(events!=null){
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
    }else return [];
  };

  const fetchEvents = async () => {
    try {
      const response = await scheduleApi.getScheduleList(projectId);
      setEvents(response.data.list);
    } catch (error) {
      console.error("Error fetching the schedules", error);
    }
  };

  const handleDeleteEvent = async (scheduleId: number) => {
    try {
      await scheduleApi.deleteSchedule(scheduleId);
      fetchEvents();
      alert("성공적으로 삭제되었습니다.");
      window.location.reload();
    } catch (error) {
      console.error("스케줄 삭제 중 오류 발생", error);
    }
  };

  const handleEditEventSave = async (scheduleId: number, newText: string) => {
    const eventToUpdate = events.find((e) => e.scheduleId === scheduleId);

    if (eventToUpdate) {
      try {
        const updatedData: Event = { ...eventToUpdate, content: newText };
        await scheduleApi.updateSchedule(scheduleId, updatedData);

        setEvents((prevEvents) =>
          prevEvents.map((e) => (e.scheduleId === scheduleId ? updatedData : e))
        );
        setShowModal(false);
        alert("성공적으로 수정되었습니다.");
        window.location.reload();
      } catch (error) {
        console.error("스케줄 업데이트 중 오류 발생", error);
      }
    }
  };

  const handleDateChange=(e:any)=>{
    setSelectDate(e);
  }

  return (
    <div className="App">
      <Container>
      <CustomCalendar 
        locale="en"
        onChange={handleDateChange}
        formatDay={(locale, date) => moment(date).format("DD")}
        tileContent={({date,view})=>{
          let html=[];
          if(events.find((x) =>
            (x.startDate <= moment(date).format("YYYY-MM-DD"))&& x.endDate>=moment(date).format("YYYY-MM-DD"))){
            html.push(<div className="dot" style={{color:"white"}}>{findEventsForDate(new Date(date!!)).length}</div>)
            return(
              <>
                <div className="etc">
                  {html}
                </div>
              </>
            )
          }
        }}
      />

<div style={{textAlign:'left', margin:'1rem 0 0.5rem 1rem'}}>{moment(selectDate).format("YYYY/MM/DD")}의 일정</div>
        {findEventsForDate(new Date(selectDate!!)).length!=0
          ? findEventsForDate(new Date(selectDate!!)).map((event)=>{
            return <div style={{cursor:'pointer', margin:'0.5rem 1rem',textAlign:'left',backgroundColor:theme.color.gray10,borderRadius:'10px',padding:'3px',fontSize:'0.9rem'}}
            onClick={()=>{
              setShowModal(true)
              setEditingEvent(event)
            }} key={event.scheduleId}>{event.content}</div>})
          :<div style={{margin:'0.5rem 1rem',textAlign:'left',padding:'3px',fontSize:'0.9rem',color:theme.color.gray40}}>오늘의 일정이 없습니다.</div>
        }


          {showModal && (
            <Modal>
              {editingEvent && (
                <div>
                  <textarea
                    style={{width:'100%',height:'4rem',marginBottom:'0.5rem',resize:'none',border:'0.001rem solid',borderRadius:'3px'}}
                    value={editingEvent.content}
                    onChange={(e) => {
                      if (editingEvent) {
                        const updatedEvent: Event = {
                          ...editingEvent,
                          content: e.target.value,
                        };
                        setEditingEvent(updatedEvent);
                        setIsChanging(true)
                      }
                    }}
                  />
                  <NewButton backcolor={theme.color.lightOrange} textcolor={theme.color.darkOrange} width={"49%"} height={""} margin="0 2% 0.3rem 0"
                    onClick={() =>{
                      editingEvent && handleEditEventSave(editingEvent.scheduleId, editingEvent.content)
                      setIsChanging(false)
                    }}>수정</NewButton>
                  <NewButton backcolor={theme.color.lightOrange} textcolor={theme.color.darkOrange} width={"49%"} height={""}
                    onClick={() =>{
                        if(window.confirm("정말 삭제하시겠습니까?")){
                          editingEvent && handleDeleteEvent(editingEvent.scheduleId)
                          setIsChanging(false)
                          setEditingEvent(null)
                          setShowModal(false)
                        }else{return}
                    }}>삭제</NewButton>
                </div>
              )}
              <NewButton backcolor={theme.color.orange} width={"100%"} height={"1.2rem"}
              onClick={()=>{
                if(isChanging){
                  if(window.confirm("변경 사항이 있습니다. 변경사항을 삭제하시겠습니까?")){
                    setIsChanging(false)
                    setShowModal(false)
                    setEditingEvent(null)
                  }else return
                }else{
                  setIsChanging(false)
                  setShowModal(false)
                setEditingEvent(null)
                }}}>닫기</NewButton>
            </Modal>
          )}
        <ManageButtonContainer>
          <ManageButton
            onClick={() =>
              navigate("/manage", { state: { projectId: projectId } })
            }
          >
            <FaPen />
          </ManageButton>
        </ManageButtonContainer>
      </Container>

    </div>
  );
};

export default WeekCalendar;

