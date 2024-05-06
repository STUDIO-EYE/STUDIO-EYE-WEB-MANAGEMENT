import React, { useState } from "react";
import styled from "styled-components";
import scheduleApi from "../../../api/scheduleApi";
import { Refresh } from "@mui/icons-material";

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
  background-color: #ffffff;
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

const StyledTextArea = styled.textarea`
  width: 100%;
  min-height: 100px;
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
  color: #ffffff;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: black;
  }
`;


function toKoreanTime(date: Date) {
  const offset = 9; // 한국은 UTC+9
  const localDate = new Date(date.getTime() + offset * 60 * 60 * 1000);
  return localDate.toISOString().substr(0, 10);
}

const Manage: React.FC<{ projectId: number; onClose: () => void }> = ({ projectId, onClose }) => {
  const [startDate, setStartDate] = useState(toKoreanTime(new Date()));
  const [endDate, setEndDate] = useState(toKoreanTime(new Date()));
  const [eventText, setEventText] = useState("");

  const handleSave = async () => {
    // 이벤트 저장 로직
    if (new Date(startDate) > new Date(endDate)) {
      alert("시작 날짜가 종료 날짜보다 이후입니다.");
      return;
    }

    const eventData = {
      content: eventText,
      startDate,
      endDate,
    };

    try {
      const response = await scheduleApi.createSchedule(projectId, eventData);
      if (response.data.success) {
        alert("일정이 성공적으로 추가되었습니다.");
        window.location.reload();
        onClose();
      } else {
        alert("일정 작성 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("일정 저장 중 오류", error);
    }
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
          placeholder="일정을 입력하세요."
          value={eventText}
          onChange={(e) => setEventText(e.target.value)}
        />
        <ButtonContainer>
          <StyledButton onClick={handleSave}>저장</StyledButton>
          <CancelButton onClick={onClose}>취소</CancelButton>
        </ButtonContainer>
      </ManageContainer>
    </TotalContainer>
  );
};

export default Manage;
