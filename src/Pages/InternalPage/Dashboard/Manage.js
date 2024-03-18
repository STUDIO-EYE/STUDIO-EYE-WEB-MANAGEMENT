import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import scheduleApi from "../../../api/scheduleApi";
import axios from "axios";

const TotalContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  flex-direction: column;
  background-color: #f7f7f7;
`;

const ManageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  padding: 100px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const StyledInput = styled.input`
  padding: 10px;
  width: 300px; // Adjusted width
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const StyledTextArea = styled.textarea`
  width: 320px;
  margin-left: 40px;
  min-height: 100px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;
const ButtonContainer = styled.div`
  display: flex;
  margin-left: 20px;
  gap: 30px;
`;

const StyledButton = styled.button`
  padding: 10px 20px;
  width: 100px;
  border: none;
  border-radius: 4px;
  background-color: #ff530e;
  color: #ffffff;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: red;
  }
`;

const CancelButton = styled.button`
  padding: 10px 20px;
  width: 100px;
  border: none;
  border-radius: 4px;
  background-color: grey;
  color: #ffffff;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: black;
  }
`;
function toKoreanTime(date) {
  const offset = 9; // Korea is UTC+9
  const localDate = new Date(date.getTime() + offset * 60 * 60 * 1000);
  return localDate.toISOString().substr(0, 10);
}
//프로젝트의 시작날짜와 마지막 날짜 사이에 일정이 추가되어야 함.
function Manage() {
  const [startDate, setStartDate] = useState(toKoreanTime(new Date()));
  const [endDate, setEndDate] = useState(toKoreanTime(new Date()));

  const [eventText, setEventText] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const projectId = location.state.projectId;

  const handleSave = async () => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      alert("시작 날짜는 종료 날짜보다 이전이어야 합니다.");
      return;
    }

    const eventData = {
      content: eventText,
      startDate: startDate,
      endDate: endDate,
    };

    try {
      const response = await scheduleApi.createSchedule(projectId, eventData);
      if (response.data.success) {
        alert("일정이 성공적으로 추가되었습니다.");
        navigate(`/Manage/${projectId}`);
      } else if (response.data.success === false) {
        if (response.data.code === 7000) {
          alert("로그인을 먼저 진행시켜 주시길 바랍니다.");
          navigate("/LoginPage");
        } else if (response.data.code === 7001) {
          alert("세션이 만료되었습니다. 다시 로그인 해주세요.");
          // 토큰 제거
          sessionStorage.removeItem("login-token");
          delete axios.defaults.headers.common["Authorization"];
          navigate("/LoginPage");
        } else if (response.data.code === 8000) {
          alert("해당 사용자는" + response.data.message); // "접근 권한이 없습니다."
        } else if (response.data.code === 6004) {
          alert(
            response.data.message + "\n프로젝트 기간 내의 일정을 입력해주세요."
          ); // "프로젝트의 일정 범위를 벗어났습니다."
        }
      } else {
        alert("일정 작성 중 오류가 발생했습니다.");
      }
    } catch (error) {
      alert("프로젝트 일정 내용을 입력해주세요.");
    }
  };

  return (
    <TotalContainer>
      <h2>Manage Events</h2>
      <ManageContainer>
        <div>
          <label>시작 : </label>
          <StyledInput
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label>종료 : </label>
          <StyledInput
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div>
          <StyledTextArea
            placeholder="일정을 입력하세요."
            value={eventText}
            onChange={(e) => setEventText(e.target.value)}
          />
        </div>
        <div>
          <ButtonContainer>
            <StyledButton onClick={handleSave}>Save</StyledButton>
            <CancelButton onClick={() => navigate(`/Manage/${projectId}`)}>
              Cancel
            </CancelButton>
          </ButtonContainer>
        </div>
      </ManageContainer>
    </TotalContainer>
  );
}

export default Manage;
