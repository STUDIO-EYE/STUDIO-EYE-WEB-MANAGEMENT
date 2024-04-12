import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styled, { createGlobalStyle } from "styled-components";
import projectApi from "../../api/projectApi";

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Pretendard';
  }
  input, select, textarea, button {
    font-family: 'Pretendard';
  }
`;

const Label = styled.div`
  font-weight: 600;
`;

const MemberAddContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px; /* 요소들 사이의 간격 설정 */
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 80px;
  background-color: rgba(0, 0, 0, 0.01);
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  max-width: 370px;
  width: 100%;
  padding: 20px;
  
  gap: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
  padding: 10px 5px;
  margin-bottom: 10px;
  margin-top: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;

  &:focus {
    outline: none;
    border-color: #ffa900;
  }
`;

const TextArea = styled.textarea`
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const ButtonContainer = styled.div`
  justify-content: space-between;
`;

const EmailContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const Button = styled.button`
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

const MemberAddButton = styled.button`
  padding: 5px 18px;
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

const ModifyButton = styled.button`
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

function ModifyProject() {
  const { projectId } = useParams() as { projectId: any };
  const navigate = useNavigate();
  const [projectData, setProjectData] = useState({
    name: "",
    description: "",
    startDate: "",
    finishDate: "",
    teamMemberEmails: [] as string[],
  });
  const [emailsRegisteredCheck, setEmailsRegisteredCheck] = useState<boolean[]>([]);

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
          const teamMemberEmails: any[] = leaderAndMemberList.map(
            (member: any) => member.email
          );

          setProjectData({
            name,
            description,
            startDate,
            finishDate,
            teamMemberEmails,
          });
          setEmailsRegisteredCheck(
            new Array(teamMemberEmails.length).fill(true) as boolean[]
          );
        }
      } catch (error) {
        console.error("Error fetching project details:", error);
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  const handleChange = (e: any) => {
    setProjectData({ ...projectData, [e.target.name]: e.target.value });
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
      const updatedRegistered: boolean[] = [...emailsRegisteredCheck];
      updatedRegistered[index] = true;
      setEmailsRegisteredCheck(updatedRegistered);
      alert("이메일이 인증되었습니다.");
    } catch (error) {
      console.error("Error during email registration:", error);
      alert("이메일 인증에 실패했습니다.");
    }
  };

  const handleUpdate = async (e: any) => {
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

  const removeTeamMemberEmail = (index: number) => {
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

  const validateEmail = (email: string) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailPattern.test(email);
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <Form onSubmit={handleUpdate}>
          <h2 style={{
            marginTop: "0px"
          }}>프로젝트 수정</h2>
          <Label>프로젝트 이름</Label>
          <Input
            name="name"
            placeholder="프로젝트 이름"
            value={projectData.name}
            onChange={handleChange}
          />
          <Label>프로젝트 상세 정보</Label>
          <TextArea
            name="description"
            placeholder="프로젝트 설명"
            value={projectData.description}
            onChange={handleChange}
          />
          <Label>프로젝트 시작 날짜</Label>
          <Input
            type="date"
            name="startDate"
            value={projectData.startDate}
            onChange={handleChange}
          />
          <Label>프로젝트 종료 날짜</Label>
          <Input
            type="date"
            name="finishDate"
            value={projectData.finishDate}
            onChange={handleChange}
          />

          <MemberAddContainer>
            <Label>등록된 팀원</Label>
            <MemberAddButton type="button" onClick={addTeamMemberEmail}>추가</MemberAddButton>
          </MemberAddContainer>

          {projectData.teamMemberEmails.map((email, index: number) => (
            <EmailContainer key={`email-${index}`}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Input
                  type="email"
                  placeholder={`팀원 ${index + 1} 이메일`}
                  value={email}
                  onChange={(e) => {
                    const updatedEmails: any[] = [...projectData.teamMemberEmails];
                    updatedEmails[index] = e.target.value;
                    setProjectData({
                      ...projectData,
                      teamMemberEmails: updatedEmails,
                    });
                    const updatedChecks: boolean[] = [...emailsRegisteredCheck];
                    updatedChecks[index] = false;
                    setEmailsRegisteredCheck(updatedChecks);
                  }}
                />
                {emailsRegisteredCheck[index] && (
                  <span style={{ color: "green", marginLeft: "10px", fontWeight: "600" }}>
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

          <ModifyButton type="submit">완료</ModifyButton>
        </Form>
      </Container>
    </>

  );

}


export default ModifyProject;
