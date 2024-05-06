import React from "react";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import axios from "axios";
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import StudioeyeLogo from "../../assets/logo/studioeye.png";
import { MdFace } from "react-icons/md";

const HeaderWrapper = styled.div`
  position: fixed;
  height: 4rem;
  width: 100%;
  background-color: white;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center; 
  padding: 0 16px;
`;

const LogoBox = styled.img`
  margin: 20px 0 20px 45px;
  max-width: 60%;
  width: 170px;
  cursor: pointer;
`;

const RightBlock = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-right: 50px;
`;

const NameBlock = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
`;

const LoginButton = styled.button`
  font-family: 'Pretendard';
  font-size: 1rem;
  border: none;
  outline: none;
  background-color: transparent;
  color: black;
  border-radius: 15px 0 15px 0;
  width: 130px;
  height: 4rem;
  margin-left: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background-color: black;
    color: white;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  display: inline-block;
`;

const IconStyled = styled(MdFace)`
  font-size: 25px;
  cursor: pointer;
  margin-right: 7px;

  &:hover {
    color: #FFC83D;
  }
`;

const NEWheader = () => {
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
    //window.location.reload();
    navigate("/LoginPage");
  };

  return (
    <HeaderWrapper>
      <LogoBox src={StudioeyeLogo} onClick={() => navigate("/")} />
      <RightBlock>
        {isLoggedIn ? (
          <>
            <IconStyled onClick={() => navigate("/mypage")} />
            <NameBlock>
              {userName} 님
            </NameBlock>
            <LoginButton onClick={handleLogout}>
              <FaSignOutAlt style={{ marginRight: "8px", fontSize: "20px" }} />
              로그아웃
            </LoginButton>
          </>
        ) : (
          <StyledLink to="/LoginPage">
            <LoginButton>
              <FaSignInAlt style={{ marginRight: "8px" }} />
              로그인
            </LoginButton>
          </StyledLink>
        )}
      </RightBlock>
    </HeaderWrapper>
  );
};

export default NEWheader;
