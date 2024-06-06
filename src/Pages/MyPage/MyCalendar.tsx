import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FaPen, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import myPageApi from "../../api/myPageApi";
import axios from "axios";
import { theme } from "LightTheme";
import NewButton from "Components/common/NewButton";
import Calendar from "react-calendar";
// import 'react-calendar/dist/Calendar.css'
import moment from "moment";
import { FaPenToSquare } from "react-icons/fa6";
import MyManage from "./MyManage";
import { useSetRecoilState } from "recoil";
import { modalOn } from "recoil/atoms";

const Container = styled.div`
  font-family: 'Pretendard';
  font-size: 1rem;
  background-color: white;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
  padding: 10px;
`;

const CustomCalendar = styled(Calendar)`
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
  font-family: 'Pretendard';
  font-size: 1rem;
  font-weight: 600;

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
  color: white;
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
  cursor:pointer;
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
  justify-content: space-between;
  align-items: center;
`;

const ManageButton = styled.button`
  background-color: transparent;
  color: #a9a9a9;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    color: whitesmoke;
  }
`;

const Modal = styled.div`
  font-family: 'Pretendard';
  text-align: start;
  position: fixed;
  width: 30%;
  min-width: 400px;
  height: auto;
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

const DropdownContainer = styled.div`
  margin-right: 15px;
  display: flex;
`;

const CustomSelect = styled.select`
  font-size: 0.9rem;
  margin-top: 5px;
  padding: 5px;
  border-radius: 15px;
  color: ${theme.color.gray50};
  border: none;
  outline: none;
  transition: border-color 0.3s ease-in-out;
  font-family: 'Pretendard';

  &:hover {
    background-color: ${theme.color.gray10};
    cursor: pointer;
  }

  option {
    padding: 0.5rem;
    font-size: 0.9rem;
    color: ${theme.color.gray50};
    background: white;
    border: none;
    outline: none;

    &:hover {
      background: ${theme.color.gray20};
    }
  }
`;

const Label = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
`;

interface Event {
  userScheduleId: number;
  content: string;
  startDate: string;
  endDate: string;
}

const MyCalendar = ({ onDarkBackground }: { onDarkBackground: any }) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [isChange, setIsChange] = useState(false);
  const [eventsForDate, setEventsForDate] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showEvent, setShowEvent] = useState<{ is: boolean; event: Event[] }>({
    is: false,
    event: []
  });
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [selectDate, setSelectDate] = useState<Date>(new Date());
  const [criterion, setCriterion] = useState<string>("day");
  const [showManageModal, setShowManageModal] = useState(false);
  const setOnModal=useSetRecoilState(modalOn);
  const handleOpenManageModal = () => {
    setOnModal(true)
    setShowManageModal(true)
  };
  const handleCloseManageModal = () => {
    setOnModal(false)
    setShowManageModal(false)
  };

  const focusSchedule=useRef<HTMLTextAreaElement>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await myPageApi.getCalendarEvents();
        if (response.data && response.data.success === false) {
          if (response.data.code === 6001) {
            // setMessage(response.data.message);
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

  const findEventsForDate = (date: Date): Event[] => {
    const targetDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    ).getTime();
    if (events != null) {
      return events.filter((e) => {
        if (criterion == "day" || criterion == "week" || criterion == "month") {
          if(criterion==="week"){
            const target = moment(targetDate).subtract(1,"day")
            const eventStartDate = moment(e.startDate).subtract(1,"day").startOf("week")
            const eventEndDate = moment(e.endDate).subtract(1,"day").endOf("week")
            return target >= eventStartDate && target <= eventEndDate;
          }else{
            const target = moment(targetDate)
            const eventStartDate = moment(e.startDate).startOf(criterion)
            const eventEndDate = moment(e.endDate).endOf(criterion)
            return target >= eventStartDate && target <= eventEndDate;
          }
        }
      });
    } else return [];
  };
  const findEventCount = (date: Date): number => {
    const eventlist = events.filter((e) => {
      const target = moment(date)
      const eventStartDate = moment(e.startDate).startOf("day")
      const eventEndDate = moment(e.endDate).endOf("day")
      return target >= eventStartDate && target <= eventEndDate;
    })
    return eventlist.length
  }

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
      // window.location.reload();
    } catch (error) {
      console.error("스케줄 삭제 중 오류 발생", error);
    }
  };

  const handleEditEventSave = async (scheduleId: number, newText: string) => {
    const eventToUpdate = events.find((e) => e.userScheduleId === scheduleId);

    if(!newText){
      focusSchedule.current?.focus();
      return;
    }

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

  const handleDateChange = (e: any) => {
    setSelectDate(e);
  }

  const handleCriterion = (e: any) => {
    setCriterion(e.target.value)
  }

  const getCurrentweek: () => string = () => {
    var now = moment(selectDate).subtract(1,"day").week()
    var lastmonthweek = moment(selectDate).subtract(1, 'months').endOf('month').week()
    return moment(selectDate).format("YYYY년 MM월 ") + (now - lastmonthweek + 1).toString() + "주차"
  }

  //   const addHoliday=()=>{
  //     var xhr = new XMLHttpRequest();
  //     var url = 'http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo'; /*URL*/
  //     var queryParams = '?' + encodeURIComponent('serviceKey') + '='+'서비스키'; /*Service Key*/
  //     queryParams += '&' + encodeURIComponent('solYear') + '=' + encodeURIComponent('2015'); /**/
  //     queryParams += '&' + encodeURIComponent('solMonth') + '=' + encodeURIComponent('09'); /**/
  //     xhr.open('GET', url + queryParams);
  //     xhr.onreadystatechange = function () {
  //       if (this.readyState == 4) {
  //         alert('Status: '+this.status+'nHeaders: '+JSON.stringify(this.getAllResponseHeaders())+'nBody: '+this.responseText);
  //       }
  // };

  // xhr.send('');
  //   }

  return (
    <div className="App">
      <Container>
        <CustomCalendar
          locale="ko"
          onChange={handleDateChange}
          formatDay={(locale, date) => moment(date).format("DD")}
          tileContent={({ date, view }) => {
            let html = [];
            if (events.find((x) =>
              (x.startDate <= moment(date).format("YYYY-MM-DD")) && x.endDate >= moment(date).format("YYYY-MM-DD"))) {
              html.push(<div className="dot" style={{ color: "white" }}>{findEventCount(date)}</div>)
              return (
                <>
                  <div className="etc">
                    {html}
                  </div>
                </>
              )
            }
          }}
        />
        <ManageButtonContainer>
          <div style={{ display: 'flex', justifyContent: 'space-between', margin: '1rem 1rem 0.5rem 1rem' }}>
            <Label>
              <div style={{ textAlign: 'left' }}>{
                criterion == "day" ? moment(selectDate).format("YYYY년 MM월 DD일")
                  : criterion == "week" ? getCurrentweek()
                    : moment(selectDate).format("YYYY년 MM월")}의 일정</div>
            </Label>
            <ManageButton onClick={handleOpenManageModal}>
              <FaPenToSquare /></ManageButton>
          </div>
          <DropdownContainer>
            <CustomSelect onChange={handleCriterion}>
              <option value="day">하루</option>
              <option value="week">일주일</option>
              <option value="month">한 달</option>
            </CustomSelect>
          </DropdownContainer>
        </ManageButtonContainer>
        {findEventsForDate(new Date(selectDate!!)).length != 0
          ? findEventsForDate(new Date(selectDate!!)).map((event) => {
            return <div style={{ cursor: 'pointer', margin: '0.5rem 1rem', textAlign: 'left', backgroundColor: theme.color.gray10, borderRadius: '10px', padding: '3px', fontSize: '1rem' }}
              onClick={() => {
                onDarkBackground(true)
                setShowModal(true)
                setEditingEvent(event)
              }} key={event.userScheduleId}>{event.content}</div>
          })
          : <div style={{ margin: '0.5rem 1rem', textAlign: 'left', padding: '3px', fontSize: '1rem', color: theme.color.gray40 }}>오늘의 일정이 없습니다.</div>
        }

        {showModal && (
          <Modal>
            {editingEvent && (
              <div>
                <textarea
                  style={{ width: '100%', height: '4rem', marginBottom: '0.5rem', resize: 'none', border: '0.001rem solid', borderRadius: '3px', fontFamily: 'Pretendard', fontSize: '1rem' }}
                  value={editingEvent.content}
                  onChange={(e) => {
                    if(e.target.value.length<=30){
                      if (editingEvent) {
                        const updatedEvent: Event = {
                          ...editingEvent,
                          content: e.target.value,
                        };
                        setEditingEvent(updatedEvent);
                        setIsChange(true)
                      }
                    }else{
                      alert("일정은 30자 이내로 입력해주세요.")
                    }
                  }}
                  placeholder="일정을 입력하세요. (최대 30자)"
                  maxLength={30}
                  ref={focusSchedule}
                />
                <NewButton backcolor={theme.color.lightOrange} textcolor={theme.color.darkOrange} width={"49%"} height={""} margin="0 2% 0.3rem 0"
                  onClick={() => {
                    editingEvent && handleEditEventSave(editingEvent.userScheduleId, editingEvent.content)
                    setIsChange(false)
                  }}>수정</NewButton>
                <NewButton backcolor={theme.color.lightOrange} textcolor={theme.color.darkOrange} width={"49%"} height={""}
                  onClick={() => {
                    if (window.confirm("정말 삭제하시겠습니까?")) {
                      editingEvent && handleDeleteEvent(editingEvent.userScheduleId)
                      setIsChange(false)
                      onDarkBackground(false)
                      setShowModal(false)
                      setEditingEvent(null)
                    } else { return }
                  }}>삭제</NewButton>
              </div>
            )}
            <NewButton backcolor={theme.color.orange} width={"100%"} height={"2rem"}
              onClick={() => {
                if (isChange) {
                  if (window.confirm("변경 사항이 있습니다. 변경사항을 삭제하시겠습니까?")) {
                    setIsChange(false)
                    onDarkBackground(false)
                    setShowModal(false)
                    setEditingEvent(null)
                  } else return
                } else {
                  setIsChange(false)
                  onDarkBackground(false)
                  setShowModal(false)
                  setEditingEvent(null)
                }
              }}>닫기</NewButton>
          </Modal>
        )}

        {showManageModal && (
          <Modal>
            <MyManage onClose={handleCloseManageModal} />
          </Modal>
        )}
      </Container>
    </div>
  );
};

export default MyCalendar;

