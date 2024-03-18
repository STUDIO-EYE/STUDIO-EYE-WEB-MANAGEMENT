import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import projectApi from "../../api/projectApi";

const Container = styled.div`
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  max-width: 500px;
  width: 100%;
  padding: 20px;
  background-color: #f7f7f7;
`;

const Input = styled.input`
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const TextArea = styled.textarea`
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
`;
const ButtonContainer = styled.div`
  display: grid;
  justify-content: center;
`;
const EmailContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const Button = styled.button`
  padding: 5px 10px;
  background-color: #ff530e;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: red;
  }
`;
const Button2 = styled.button`
  width: 160px;
  height: 30px;
  background-color: #ff530e;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: red;
  }
`;
const ModifyButton = styled.button`
  width: 160px;
  height: 30px;
  background-color: red;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: deeppink;
  }
`;

const TextMd = styled.p`
  font-family: "Roboto", sans-serif; // Apply the Roboto font
  font-weight: bold; // Make the text bold
  font-size: 16px; // Optionally, adjust the font size
  // Add any other styles you want here
`;

function ModifyProject() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [projectData, setProjectData] = useState({
    name: "",
    description: "",
    startDate: "",
    finishDate: "",
    teamMemberEmails: [],
  });
  const [emailsRegisteredCheck, setEmailsRegisteredCheck] = useState([]);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await projectApi.getProjectById(projectId);
        if (response.data.code === 200 && response.data.data) {
          const {
            name,
            description,
            startDate,
            finishDate,
            leaderAndMemberList,
          } = response.data.data;
          const teamMemberEmails = leaderAndMemberList.map(
            (member) => member.email
          );

          setProjectData({
            name,
            description,
            startDate,
            finishDate,
            teamMemberEmails,
          });
          setEmailsRegisteredCheck(
            new Array(teamMemberEmails.length).fill(true)
          );
        }
      } catch (error) {
        console.error("Error fetching project details:", error);
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  const handleChange = (e) => {
    setProjectData({ ...projectData, [e.target.name]: e.target.value });
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
      const updatedRegistered = [...emailsRegisteredCheck];
      updatedRegistered[index] = true;
      setEmailsRegisteredCheck(updatedRegistered);
      alert("이메일이 인증되었습니다.");
    } catch (error) {
      console.error("Error during email registration:", error);
      alert("이메일 인증에 실패했습니다.");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const notRegistered = emailsRegisteredCheck.includes(false);
    if (notRegistered) {
      alert("모든 팀원의 이메일을 인증해주세요.");
      return;
    }
    const memberIdList = await Promise.all(
      projectData.teamMemberEmails.map(async (email) => {
        const response = await axios.get(
          `/user-service/response_userByEmail/${email}`
        );
        return response.data.id;
      })
    );
    const updateData = {
      ...projectData,
      memberIdList: memberIdList,
    };

    console.log("Updating project with data:", projectData); // 데이터 로그 출력

    try {
      const response = await projectApi.updateProject(projectId, updateData);
      if (response.data.success) {
        alert("프로젝트가 성공적으로 수정되었습니다.");
        navigate("/");
      } else {
        alert("프로젝트 수정에 문제가 발생했습니다: " + response.data.message);
      }
    } catch (error) {
      console.error("Error updating project:", error);
      alert("프로젝트 수정 권한이 없습니다.");
    }
  };

  const addTeamMemberEmail = () => {
    setProjectData({
      ...projectData,
      teamMemberEmails: [...projectData.teamMemberEmails, ""],
    });
    setEmailsRegisteredCheck([...emailsRegisteredCheck, false]);
  };

  const removeTeamMemberEmail = (index) => {
    const updatedEmails = projectData.teamMemberEmails.filter(
      (_, idx) => idx !== index
    );
    const updatedChecks = emailsRegisteredCheck.filter(
      (_, idx) => idx !== index
    );
    setProjectData({
      ...projectData,
      teamMemberEmails: updatedEmails,
    });
    setEmailsRegisteredCheck(updatedChecks);
  };

  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailPattern.test(email);
  };

  return (
    <Container>
      <Form onSubmit={handleUpdate}>
        <h2>Modify Project</h2>
        <TextMd>프로젝트 이름</TextMd>
        <Input
          name="name"
          placeholder="프로젝트 이름"
          value={projectData.name}
          onChange={handleChange}
        />
        <TextMd>프로젝트 상세 정보</TextMd>
        <TextArea
          name="description"
          placeholder="프로젝트 설명"
          value={projectData.description}
          onChange={handleChange}
        />
        <TextMd>프로젝트 시작 날짜</TextMd>
        <Input
          type="date"
          name="startDate"
          value={projectData.startDate}
          onChange={handleChange}
        />
        <TextMd>프로젝트 종료 날짜</TextMd>
        <Input
          type="date"
          name="finishDate"
          value={projectData.finishDate}
          onChange={handleChange}
        />
        <TextMd>등록된 팀원</TextMd>
        {projectData.teamMemberEmails.map((email, index) => (
          <EmailContainer key={`email-${index}`}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Input
                type="email"
                placeholder={`팀원 ${index + 1} 이메일`}
                value={email}
                onChange={(e) => {
                  const updatedEmails = [...projectData.teamMemberEmails];
                  updatedEmails[index] = e.target.value;
                  setProjectData({
                    ...projectData,
                    teamMemberEmails: updatedEmails,
                  });
                  const updatedChecks = [...emailsRegisteredCheck];
                  updatedChecks[index] = false;
                  setEmailsRegisteredCheck(updatedChecks);
                }}
              />
              {emailsRegisteredCheck[index] && (
                <span style={{ color: "green", marginLeft: "10px" }}>
                  인증됨
                </span>
              )}
            </div>
            <div>
              {!emailsRegisteredCheck[index] && (
                <Button
                  type="button"
                  onClick={() => handleEmailRegistration(index, email)}
                >
                  인증
                </Button>
              )}
              <Button
                type="button"
                onClick={() => removeTeamMemberEmail(index)}
              >
                삭제
              </Button>
            </div>
          </EmailContainer>
        ))}
        <ButtonContainer>
          <Button2 type="button" onClick={addTeamMemberEmail}>
            팀원 추가
          </Button2>
          <ModifyButton type="submit">수정 완료</ModifyButton>
        </ButtonContainer>
      </Form>
    </Container>
  );
}

export default ModifyProject;
