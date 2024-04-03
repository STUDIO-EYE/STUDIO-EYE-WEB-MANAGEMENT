import React, { useEffect, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import StudioeyeLogo from "../../assets/logo/studioeye.png";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import projectApi from 'api/projectApi';
import jwt_decode from "jwt-decode";
import { Link } from "react-router-dom";
import { Name } from './Font';

// 전역 스타일로 폰트 설정
const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Pretendard-Regular';
    src: url('https://cdn.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff') format('woff');
    font-style: normal;
  }
`;

const NavigationBar = styled.div`
  width: 225px;
  height: 100vh;
  background-color: white;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
`;

const LogoBox = styled.img`
  margin: 30px 0 30px 45px;
  max-width: 60%;
  width: 170px;
  cursor: pointer;
`;

const NavigationWrapper = styled.div`
  flex-grow: 1;
`;

const NavigationContent = styled.div`
  padding: 0px;
  color: rgba(0, 0, 0, 1);
  width: 100%;
`;

const NavigationLink = styled.a`
  display: block;
  color: rgba(0, 0, 0, 0.5);
  text-decoration: none;
  margin-bottom: 15px;
  transition: background-color 0.3s, font-weight 0.3s;
  padding: 15px 20px;
  font-weight: 600;
  &:hover {
    background-color: #FEF7ED;
    font-weight: bold;
    color: rgba(0, 0, 0, 1);
  }
`;

const LoginButton = styled.button`
  border: none;
  outline: none;
  background-color: #EDA943;
  color: white;
  border-radius: 20px;
  width: 88px;
  height: 28px;
  cursor: pointer;
  margin: 20px;
  align-self: center;
  &:hover {
    background-color: #FEF7ED;
    color: rgba(0, 0, 0, 1);
  }
`;

const NameBlock = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 0 50px 20px;
  font-weight: 400;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  display: inline-block;
`;

const NavBar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [modalIsOpen, setIsOpen] = useState(false);
  const [myProjects, setMyProjects] = useState<any[]>([]);

  const handleProjectClick = (projectId: number) => {
    navigate(`/manage/${projectId}`);
  };

  const openModal = () => {
    setIsOpen(true);
    fetchMyProjects();
  };

  const closeModal = () => {
    setIsOpen(false);
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
      setUserName((decodedToken as any).username);
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

  const handleLogin = () => {
    navigate("/LoginPage");
  };

  return (
    <>
      <GlobalStyle />
      <NavigationBar>
        <LogoBox src={StudioeyeLogo} onClick={() => navigate("/")} />
        <NavigationWrapper>
          <NavigationContent>
            <NavigationLink href="/">Project</NavigationLink>
            <NavigationLink href="/dashboard">Manage</NavigationLink>
            <NavigationLink href="#">Auth</NavigationLink>
          </NavigationContent>
        </NavigationWrapper>
        <NameBlock>
        {isLoggedIn ? (
                    <>
                      <Name>{userName} 님</Name>
                      <StyledLink to="/">
                        <LoginButton onClick={handleLogout}>Log Out</LoginButton>
                      </StyledLink>
                    </>
                ) : (
                    <StyledLink to="/LoginPage">
                      <LoginButton>로그인</LoginButton>
                    </StyledLink>
                )}
        </NameBlock>
      </NavigationBar>
    </>
  );
};

export default NavBar;
