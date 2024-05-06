import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import projectApi from "../../api/projectApi";
import axios from "axios";

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Pretendard';
  }

  input, select, textarea, button {
    font-family: 'Pretendard';
  }
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: left;
  justify-content: space-between;
  width: 370px;
`;

const StyledSelect = styled.select`
  width: 230px;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
`;
const EmailContainer = styled.div``;
const Label = styled.div`
  /* float: left; */
  margin-bottom: 10px;
`;
const TotalContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  flex-direction: column;
  background-color: rgba(0, 0, 0, 0.01);
`;

const ProjectContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 80px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const InputMember = styled.input`
  padding: 10px;
  width: 130px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 20px;

  &:focus {
    outline: none;
    border-color: #ffa900;
  }
`;

const StyledInput = styled.input`
  padding: 10px;
  width: 210px;
  border: 1px solid #ccc;
  border-radius: 4px;

  &:focus {
    outline: none;
    border-color: #ffa900;
  }
`;
const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  float: left;
`;

const StyledTextArea = styled.textarea`
  width: 350px;
  min-height: 50px;
  text-align: left;
  justify-content: center;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 5px 10px;

  &:focus {
    outline: none;
    border-color: #ffa900;
  }
`;

const StyledButton = styled.button`
  padding: 10px 18px;
  border: none;
  border-radius: 5px;
  background-color: #ffa900;
  color: #ffffff;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    color: #ffa900;
    background-color: white;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  &:not(:last-child) {
    margin-right: 10px;
  }
`;

const CancelButton = styled.button`
  padding: 10px 18px;
  border: none;
  border-radius: 5px;
  background-color: white;
  color: #ffa900;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    color: white;
    background-color: #ffa900;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  &:not(:last-child) {
    margin-right: 10px;
  }
`;

function toKoreanTime(date: Date) {
  const offset = 9; // Korea is UTC+9
  const localDate = new Date(date.getTime() + offset * 60 * 60 * 1000);
  return localDate.toISOString().substr(0, 10);
}
function Project() {
  const [startDate, setStartDate] = useState(toKoreanTime(new Date()));
  const [endDate, setEndDate] = useState(toKoreanTime(new Date()));

  const [projectName, setProjectName] = useState("");
  const [projectDetails, setProjectDetails] = useState("");
  const [teamMemberCount, setTeamMemberCount] = useState<number>(0);
  const [teamMemberEmails, setTeamMemberEmails] = useState<string[]>([]);
  const [emailsRegisteredCheck, setEmailsRegisteredCheck] = useState<boolean[]>([]);

  const navigate = useNavigate();

  const handleSave = async () => {
    try {
      if (new Date(startDate) > new Date(endDate)) {
        alert("시작 날짜가 종료 날짜보다 이후입니다.");
        return;
      }

      const notRegistered = emailsRegisteredCheck.filter((check) => !check);
      if (notRegistered.length > 0) {
        alert(
          "인증되지 않은 팀원이 있습니다.\n모든 팀원의 이메일을 인증해주세요."
        );
        return;
      }

      if (!projectName.trim()) {
        alert("프로젝트명을 입력해주세요.");
        return;
      }

      if (!projectDetails.trim()) {
        alert("프로젝트 세부 내용을 입력해주세요.");
        return;
      }

      const emptyEmails = teamMemberEmails.filter((email) => !email.trim());
      if (emptyEmails.length > 0) {
        alert("모든 팀원의 이메일을 입력해주세요.");
        return;
      }

      const userIdsPromises = teamMemberEmails.map(async (email) => {
        const response = await axios.get(
          `/user-service/response_userByEmail/${email}`
        );
        return response.data.id;
      });

      const memberIdList = await Promise.all(userIdsPromises);

      const newProject = {
        name: projectName,
        description: projectDetails,
        startDate: `${startDate}`,
        finishDate: `${endDate}`,
        memberIdList: memberIdList,
      };

      const response = await projectApi.createProject(newProject);

      if (response.data && response.data.success === false) {
        if (response.data.code === 7000) {
          alert("로그인을 먼저 진행시켜 주시길 바랍니다.");
          navigate("/LoginPage");
        } else if (response.data.code === 7001) {
          alert("세션이 만료되었습니다. 다시 로그인 해주세요.");
          sessionStorage.removeItem("login-token");
          delete axios.defaults.headers.common["Authorization"];
          navigate("/LoginPage");
        } else if (response.data.code === 7005) {
          alert("jwt토큰오류");
        }
        return;
      }
      alert("프로젝트를 생성하였습니다.");
      navigate("/");
    } catch (error) {
      alert("프로젝트 생성에 실패했습니다."); 
    }
  };

  const handleTeamMemberChange = (index: number, email: string) => {
    const updatedEmails: string[] = [...teamMemberEmails];
    updatedEmails[index] = email;
    setTeamMemberEmails(updatedEmails);
  };
  const validateEmail = (email: string) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailPattern.test(email);
  };
  const handleEmailRegistration = async (index: number, email: string) => {
    if (!validateEmail(email)) {
      alert("이메일 형식이 올바르지 않습니다.");
      return;
    }

    try {
      const response = await axios.get(
        `/user-service/response_userByEmail/${email}`
      );
      console.log(response);
      console.log(response.data);
      alert("잘 등록되었습니다.");
      const updatedRegistered: boolean[] = [...emailsRegisteredCheck];
      updatedRegistered[index] = true;
      setEmailsRegisteredCheck(updatedRegistered);
    } catch (error: any) {
      console.error("Error during email registration: ", error);
      if (error.response && error.response.status === 500) {
        alert("존재하지 않는 이메일입니다.");
      } else {
        // 다른 종류의 오류가 발생한 경우
        alert("이메일 인증에 실패했습니다.");
      }
    }
  };

  return (
    <>
      <GlobalStyle />
      <TotalContainer>
        <ProjectContainer>
          <h2 style={{
            marginTop: "0px"
          }}>프로젝트 생성</h2>
          <FormContainer>
            <Label>시작 날짜&nbsp;&nbsp; </Label>
            <StyledInput
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </FormContainer>
          <FormContainer>
            <Label>종료 날짜&nbsp;&nbsp; </Label>
            <StyledInput
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </FormContainer>
          <FormContainer>
            <Label>팀원 수&nbsp;&nbsp; </Label>
            <StyledSelect
              value={teamMemberCount !== 0 ? teamMemberCount : ""}
              onChange={(e) => {
                const selectedCount = Number(e.target.value);
                setTeamMemberCount(selectedCount !== 0 ? selectedCount : 0);
                if (selectedCount !== 0) {
                  setTeamMemberEmails(new Array(selectedCount).fill(""));
                  setEmailsRegisteredCheck(new Array(selectedCount).fill(false));
                }
              }}
            >
              <option value="" disabled>
                선택
              </option>
              {[...Array(10)].map((_, index) => (
                <option key={index} value={index + 1}>
                  {index + 1}
                </option>
              ))}
            </StyledSelect>
          </FormContainer>
          {Array.from({ length: teamMemberCount }).map((_, index) => (
            <FormContainer
              key={index}
              style={{ display: "flex", alignItems: "center" }}
            >
              <Label>팀원 {index + 1}  &nbsp;&nbsp;</Label>
              <EmailContainer>
                <InputMember
                  type="email"
                  value={teamMemberEmails[index] || ""}
                  placeholder="팀원 이메일"
                  onChange={(e) => handleTeamMemberChange(index, e.target.value)}
                />
                {emailsRegisteredCheck[index] ? (
                  <span
                    style={{
                      fontFamily: "Pretendard",
                      color: "#ffa900",
                      fontWeight: "bold",
                    }}
                  >
                    인증 완료
                  </span>
                ) : (
                  <StyledButton
                    onClick={() =>
                      handleEmailRegistration(index, teamMemberEmails[index])
                    }
                  >
                    인증
                  </StyledButton>
                )}
              </EmailContainer>
            </FormContainer>
          ))}
          <FormContainer>
            <Label>프로젝트 이름&nbsp;&nbsp; </Label>
            <StyledInput
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </FormContainer>
          <TextContainer>
            <Label>프로젝트 상세정보&nbsp;&nbsp;</Label>
            <StyledTextArea
              value={projectDetails}
              onChange={(e) => setProjectDetails(e.target.value)}
            ></StyledTextArea>
          </TextContainer>
          <div>
            <StyledButton className="check" onClick={handleSave}>
              생성
            </StyledButton>
            <CancelButton className="check" onClick={() => navigate("/")}>
              취소
            </CancelButton>
          </div>
        </ProjectContainer>
      </TotalContainer>
    </>

  );
}

export default Project;
