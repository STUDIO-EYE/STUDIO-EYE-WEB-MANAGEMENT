import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import StudioeyeLogo from "../../assets/logo/studioeye.png";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import projectApi from 'api/projectApi';
import jwt_decode from "jwt-decode";
import { Link } from "react-router-dom";
import { Name } from './Font';
import { FaBriefcase, FaChartLine, FaSignOutAlt, FaUser } from 'react-icons/fa';

const NavigationBar = styled.div`
  width: 225px;
  height: 100vh;
  background-color: #f8f9fa;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
`;

const LogoBox = styled.img`
  margin: 30px 0 20px 45px;
  max-width: 60%;
  width: 170px;
  cursor: pointer;
`;

const NavigationWrapper = styled.div`
  flex-grow: 1;
`;

const NavigationContent = styled.div`
  padding: 20px 0;
  color: #495057;
  font-size: 1rem;
`;

const NavigationLink = styled.a`
  display: flex;
  align-items: center;
  color: #495057;
  text-decoration: none;
  margin-bottom: 15px;
  transition: background-color 0.3s, font-weight 0.3s;
  padding: 10px 20px;
  font-weight: 500;
  &:hover {
    background-color: #e9ecef;
  }
`;

const LoginButton = styled.button`
  border: none;
  display: flex;
  align-items: center;
  text-decoration: none;
  margin-top: 15px;
  transition: background-color 0.3s, font-weight 0.3s;
  padding: 10px 20px;
  font-weight: 500;
  width: 100%;
  cursor: pointer;
  font-size: 1rem;
  &:hover {
    background-color: #e9ecef;
  }
`;

const NameBlock = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  margin-bottom: 100px;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  cursor: pointer;
`;

const NavBar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

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

  return (
    <>
      <NavigationBar>
        <LogoBox src={StudioeyeLogo} onClick={() => navigate("/")} />
        <NavigationWrapper>
          <NavigationContent>
            <NavigationLink href="/">
              <FaBriefcase style={{ marginRight: '10px' }} /> Project
            </NavigationLink>
            <NavigationLink href="/mypage">
              <FaUser style={{ marginRight: '10px' }} /> My Page
            </NavigationLink>
            <NavigationLink href="#">
              <FaChartLine style={{ marginRight: '10px' }} /> Auth
            </NavigationLink>
          </NavigationContent>
        </NavigationWrapper>
        <NameBlock>
          {isLoggedIn ? (
            <>
              <Name>{userName} 님, 안녕하세요.</Name>
              <StyledLink to="/">
                <LoginButton onClick={handleLogout}>
                  <FaSignOutAlt style={{ marginRight: '10px' }} />
                  Log Out
                </LoginButton>
              </StyledLink>
            </>
          ) : (
            <StyledLink to="/LoginPage">
              <LoginButton>Log In</LoginButton>
            </StyledLink>
          )}
        </NameBlock>
      </NavigationBar>
    </>
  );
};

export default NavBar;
