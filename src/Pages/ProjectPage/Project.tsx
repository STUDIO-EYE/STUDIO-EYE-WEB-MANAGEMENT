import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import projectApi from "../../api/projectApi";
import axios from "axios";

const FormContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 370px;
`;
// const StyledOption = styled.option`
//   width: 300px;
// `;
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
  background-color: #f7f7f7;
  background-image: linear-gradient(
    to right top,
    #f7f7f7,
    #f9f9f9,
    #fbfbfb,
    #fdfdfd,
    #ffffff
  );
  margin: 10px;
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
  /* margin-left: 30px; */
  width: 130px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 20px;
`;

const StyledInput = styled.input`
  padding: 10px;
  width: 210px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;
const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  float: left;
`;

const StyledTextArea = styled.textarea`
  width: 360px;
  min-height: 100px;
  text-align: center;
  justify-content: center;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const StyledButton = styled.button`
  padding: 10px 18px;
  border: none;
  border-radius: 5px;
  background-color: #ff530e;
  color: #ffffff;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: red;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  &:not(:last-child) {
    margin-right: 10px;
  }
`;

const CancelButton = styled.button`
  padding: 12px 18px;
  border: none;
  border-radius: 5px;
  background-color: grey;
  color: #ffffff;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: black;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  &:not(:last-child) {
    margin-right: 10px;
  }
`;
function toKoreanTime(date) {
  const offset = 9; // Korea is UTC+9
  const localDate = new Date(date.getTime() + offset * 60 * 60 * 1000);
  return localDate.toISOString().substr(0, 10);
}
function Project() {
  const [startDate, setStartDate] = useState(toKoreanTime(new Date()));
  const [endDate, setEndDate] = useState(toKoreanTime(new Date()));

  const [projectName, setProjectName] = useState("");
  const [projectDetails, setProjectDetails] = useState("");
  const [teamMemberCount, setTeamMemberCount] = useState("");
  const [teamMemberEmails, setTeamMemberEmails] = useState([]);
  const [emailsRegisteredCheck, setEmailsRegisteredCheck] = useState([]);

  const navigate = useNavigate();

  const handleSave = async () => {
    try {
      const notRegistered = emailsRegisteredCheck.filter((check) => !check);
      if (notRegistered.length > 0) {
        alert(
          "인증되지 않은 팀원이 있습니다.\n모든 팀원의 이메일을 인증해주세요."
        );
        return;
      }
      // 유효성 검사
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
      // 1. 각 이메일 주소에 해당하는 유저 ID를 가져옵니다.
      const userIdsPromises = teamMemberEmails.map(async (email) => {
        const response = await axios.get(
          `/user-service/response_userByEmail/${email}`
        );
        return response.data.id; // UserResponse 객체에서 id를 가져옵니다.
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
      // 서버에서 실패 응답을 보냈는지 확인
      if (response.data && response.data.success === false) {
        if (response.data.code === 7000) {
          alert("로그인을 먼저 진행시켜 주시길 바랍니다.");
          navigate("/LoginPage");
        } else if (response.data.code === 7001) {
          alert("세션이 만료되었습니다. 다시 로그인 해주세요.");
          sessionStorage.removeItem("login-token");
          delete axios.defaults.headers.common["Authorization"];
          navigate("/LoginPage");
        }
        return;
      }
      alert("프로젝트를 생성하였습니다.");
      navigate("/");
    } catch (error) {
      console.error("Error: ", error);
      alert("프로젝트 생성에 실패했습니다."); // 에러 알림 메시지
    }
  };
  const handleTeamMemberChange = (index, email) => {
    const updatedEmails = [...teamMemberEmails];
    updatedEmails[index] = email;
    setTeamMemberEmails(updatedEmails);
  };
  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailPattern.test(email);
  };
  const handleEmailRegistration = async (index, email) => {
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
      //이 api 지금 아무것도 안뱉어내서 에러처리 못함. 등록되지않은 email도 잘 등록되었습니다. 라는 문구가 뜰수밖에없음.
      alert("잘 등록되었습니다.");
      const updatedRegistered = [...emailsRegisteredCheck];
      updatedRegistered[index] = true;
      setEmailsRegisteredCheck(updatedRegistered);
    } catch (error) {
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
    <TotalContainer>
      <h2>CREATE PROJECT</h2>
      <ProjectContainer>
        <FormContainer>
          <Label>시작&nbsp;&nbsp;날짜&nbsp;&nbsp;:&nbsp; </Label>
          <StyledInput
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </FormContainer>
        <FormContainer>
          <Label>종료&nbsp;&nbsp;날짜&nbsp;&nbsp;:&nbsp; </Label>
          <StyledInput
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </FormContainer>
        <FormContainer>
          <Label>팀원 수&nbsp;: </Label>
          <StyledSelect
            value={teamMemberCount}
            onChange={(e) => {
              setTeamMemberCount(Number(e.target.value));
              setTeamMemberEmails(new Array(Number(e.target.value)).fill(""));
              setEmailsRegisteredCheck(
                new Array(Number(e.target.value)).fill(false)
              );
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
            <Label>팀원{index + 1} : &nbsp;</Label>
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
                    color: "red",
                    marginLeft: "10px",
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
          <Label>프로젝트 이름&nbsp;: </Label>
          <StyledInput
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
        </FormContainer>
        <TextContainer>
          <Label>프로젝트 상세정보&nbsp;:&nbsp;</Label>
          <StyledTextArea
            value={projectDetails}
            onChange={(e) => setProjectDetails(e.target.value)}
          ></StyledTextArea>
        </TextContainer>
        <div>
          <StyledButton className="check" onClick={handleSave}>
            Save
          </StyledButton>
          <CancelButton className="check" onClick={() => navigate("/")}>
            Cancel
          </CancelButton>
        </div>
      </ProjectContainer>
    </TotalContainer>
  );
}

export default Project;
