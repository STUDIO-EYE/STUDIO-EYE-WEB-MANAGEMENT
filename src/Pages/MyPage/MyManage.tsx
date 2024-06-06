import React, { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import myPageApi from "../../api/myPageApi";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import { modalOn } from "recoil/atoms";

const TotalContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const ManageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  padding: 50px;
  background-color: white;
  border-radius: 8px;
`;

const Label = styled.label`
  font-size: 1rem;
  width: 30px;
`;

const DateContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  padding: 10px;
  align-items: center;
`;

const StyledInput = styled.input`
  padding: 10px;
  width: 130px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-family: 'Pretendard';
  margin-right: 10px;
`;

const StyledTextArea = styled.input`
  width: 100%;
  min-height: 30px;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: none;
  font-family: 'Pretendard';
  font-size: 1rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
`;

const StyledButton = styled.button`
  padding: 10px 20px;
  width: 100px;
  border: none;
  border-radius: 4px;
  background-color: #FFC83D;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: black;
    color: #FFC83D;
  }
`;

const CancelButton = styled.button`
  padding: 10px 20px;
  width: 100px;
  border: none;
  border-radius: 4px;
  background-color: grey;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: black;
  }
`;

function toKoreanTime(date: Date): string {
  const offset = 9; // Korea is UTC+9
  const localDate = new Date(date.getTime() + offset * 60 * 60 * 1000);
  return localDate.toISOString().substr(0, 10);
}

//프로젝트의 시작날짜와 마지막 날짜 사이에 일정이 추가되어야 함.
const MyManage: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [startDate, setStartDate] = useState(toKoreanTime(new Date()));
  const [endDate, setEndDate] = useState(toKoreanTime(new Date()));
  const setOnModal=useSetRecoilState(modalOn);

  const focusSchedule=useRef<HTMLInputElement>(null);

  const [eventText, setEventText] = useState("");
  const navigate = useNavigate();

  const handleSave = async () => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if(!eventText){
      focusSchedule.current?.focus();
      return;
    }

    if (start > end) {
      alert("시작 날짜는 종료 날짜보다 이전이어야 합니다.");
      return;
    }

    const eventData = {
      content: eventText,
      startDate: startDate.toString(),
      endDate: endDate.toString(),
    };

    try {
      const response = await myPageApi.postCalendarEvent(eventData);
      console.log(response.data)
      if (response.data.success) {
        alert("일정이 성공적으로 추가되었습니다.");
        window.location.reload();
        onClose();
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
    setOnModal(false)
  };

  return (
    <TotalContainer>
      <ManageContainer>
        <DateContainer>
          <Label>시작</Label>
          <StyledInput
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Label>종료</Label>
          <StyledInput
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </DateContainer>

        <StyledTextArea
          placeholder="일정을 입력하세요. (최대 30자)"
          value={eventText}
          onChange={(e) => {e.target.value.length<=30?setEventText(e.target.value):alert("일정은 30자 이내로 입력해주세요.")}}
          maxLength={30}
          ref={focusSchedule}
        />
        <ButtonContainer>
          <StyledButton onClick={handleSave}>저장</StyledButton>
          <CancelButton onClick={onClose}>취소</CancelButton>
        </ButtonContainer>
      </ManageContainer>
    </TotalContainer>
  );
};

export default MyManage;
