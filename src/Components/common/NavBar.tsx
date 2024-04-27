import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from "react-router-dom";
import { FaBriefcase, FaChartLine, FaSignOutAlt, FaUser } from 'react-icons/fa';

const NavigationBar = styled.div`
  width: 225px;
  height: calc(100vh - 4rem);
  background-color: white;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 4rem;
  left: 0;
  z-index: 1000;
`;

const NavigationWrapper = styled.div`
  flex-grow: 1;
`;

const NavigationContent = styled.div`
  padding: 20px 0;
  color: black;
  font-size: 1rem;
`;

const IconContainer = styled.span`
  margin-right: 15px;
  margin-top: 5px;
  color: black;
  font-size: 25px;
`;

const NavigationLink = styled.a`
  display: flex;
  align-items: center;
  text-decoration: none;
  font-size: 1rem;
  transition: background-color 0.3s, font-weight 0.3s;
  padding: 20px 55px;
  font-weight: 500;
  border-radius: 0 15px 15px 0;
  color: black;

  &:hover {
    background-color: black;
    color: white;
  }

  &:hover ${IconContainer} {
    color: #FFC83D;
  }
`;

const NavBar = () => {
  const navigate = useNavigate();

  return (
    <NavigationBar>
      <NavigationWrapper>
        <NavigationContent>
          <NavigationLink href="/">
            <IconContainer>
              <FaBriefcase />
            </IconContainer>
            프로젝트
          </NavigationLink>
          <NavigationLink href="/mypage">
            <IconContainer>
              <FaUser />
            </IconContainer>
            마이페이지
          </NavigationLink>
          <NavigationLink href="/Account">
            <IconContainer>
              <FaChartLine />
            </IconContainer>
            계정
          </NavigationLink>
        </NavigationContent>
      </NavigationWrapper>
    </NavigationBar>
  );
};


export default NavBar;
