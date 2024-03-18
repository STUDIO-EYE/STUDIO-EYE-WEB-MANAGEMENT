import React from "react";
import styled from "styled-components";

import { FaProjectDiagram, FaFolderOpen } from "react-icons/fa";
import {
  media,
  TitleLg,
  TitleMd,
  TitleSm,
  TextLg,
  TextMd,
  TextSm,
} from "../../Components/common/Font";
import { CgMenu } from "react-icons/cg";
import NEWSearchBar from "../NEWSearchBar";
import { useEffect, useState } from "react";
import StudioeyeLogo from "../../assets/logo/studioeye.png";
import Button from "./Button";
import { Link } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import projectApi from "../../api/projectApi";
import Modal from "react-modal";
import ChatModal from "./ChatModal";
import { useLocation } from "react-router-dom";
import axios from "axios";

const HeaderWrapper = styled.div`
  position: fixed;
  height: 4rem;
  width: 100%;
  background: white;
  /* box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.08); */
  border-bottom: 1px solid rgba(200, 200, 200, 0.6);
`;

const SpaceBetweenBlock = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
`;

const RightBlock = styled.div`
  display: flex;
  margin-right: 120px;
`;
const NameBlock = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
`;

const IconBlock = styled.div`
  height: 100%;
  font-size: 2rem;
  margin-right: 0.5rem;
`;

const ProjectButton = styled.button`
  border: none;
  outline: none;
  background: transparent;
  color: black;
  font-size: 1.5rem;
  cursor: pointer;
  margin-right: 16px;
  margin-left: -8px;
  margin-top: 4px;

  &:hover {
    color: #eb3225;
  }
`;
const TextLgButton = styled(TextLg)`
  cursor: pointer;
  margin-right: 20px;
`;
const LoginButton = styled.button`
  border: none;
  outline: none;
  background-color: #ffa900;
  color: white;
  border-radius: 20px;
  width: 88px;
  height: 28px;
  /* padding: 4px; */
  /* margin: 10px; */
  cursor: pointer;
  &:hover {
    background-color: #ffa900;
  }
`;

const LogoBox = styled.img`
  margin-left: 60px;
  margin-right: 16px;
  max-width: 100%;
  width: 170px;
  cursor: pointer;
`;

const StyledLink = styled(Link)`
  text-decoration: none; /* 밑줄 제거 */
  color: inherit; /* 부모 요소의 색상 상속 */
  cursor: pointer; /* 포인터 커서 표시 */
  display: inline-block; /* 또는 block로 설정 */
`;

Modal.setAppElement("#root"); // 모달을 렌더링할 때 root 요소 설정

const customStyles = {
  content: {
    top: "20%",
    left: "83%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const NEWheader = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [modalIsOpen, setIsOpen] = useState(false);
  const [myProjects, setMyProjects] = useState([]);
  const [chatIsOpen, setChatIsOpen] = useState(false);

  const handleProjectClick = (projectId) => {
    navigate(`/manage/${projectId}`);
  };

  const openModal = () => {
    setIsOpen(true);
    fetchMyProjects();
  };

  const closeModal = () => {
    setIsOpen(false);
  };
  const openChat = () => {
    setChatIsOpen(true);
  };
  const closeChat = () => {
    setChatIsOpen(false);
  };

  const fetchMyProjects = async () => {
    try {
      const response = await projectApi.getMyProjects();
      setMyProjects(response.data.list);
    } catch (error) {
      console.error("프로젝트를 가져오는 중 에러가 발생했습니다.", error);
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem("login-token");
    if (token) {
      setIsLoggedIn(true);
      const decodedToken = jwt_decode(token);
      setUserName(decodedToken.username);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("login-token");
    delete axios.defaults.headers.common["Authorization"];
    setIsLoggedIn(false);
    setUserName("");
    alert("로그아웃 완료");
    navigate("/");
  };

  return (
    <>
      <HeaderWrapper>
        <SpaceBetweenBlock>
          <LogoBox src={StudioeyeLogo} onClick={() => navigate("/")} />
          <RightBlock>
            <NameBlock>
              {isLoggedIn ? (
                <>
                  <TextLgButton>{userName} 님</TextLgButton>
                  <ProjectButton onClick={openModal}>
                    <FaFolderOpen />
                  </ProjectButton>
                  <StyledLink to="/LoginPage">
                    <LoginButton onClick={handleLogout}>로그아웃</LoginButton>
                  </StyledLink>
                </>
              ) : (
                <StyledLink to="/LoginPage">
                  <LoginButton>로그인</LoginButton>
                </StyledLink>
              )}
            </NameBlock>
          </RightBlock>
        </SpaceBetweenBlock>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="My Projects Modal"
        >
          <h2>내 프로젝트</h2>
          {myProjects && myProjects.length ? (
            myProjects.map((project, index) => (
              <div
                key={index}
                onClick={() => handleProjectClick(project.projectId)}
                style={{ cursor: "pointer" }}
              >
                {project.projectId}. {project.name}
              </div>
            ))
          ) : (
            <p>프로젝트가 없습니다.</p>
          )}
          <button onClick={closeModal}>닫기</button>
        </Modal>
      </HeaderWrapper>
    </>
  );
};

export default NEWheader;
