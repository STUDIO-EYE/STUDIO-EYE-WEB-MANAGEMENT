import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import Responsive from './responsive';
import Button from './Button';
import SearchBar from '../SearchBar';
import { Link } from 'react-router-dom';
import { CgMenu } from "react-icons/cg";

const HeaderBlock = styled.div`
  position: fixed;
  width: 100%;
  background: white;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.08);
`;

const Wrapper = styled(Responsive)`
  height: 4rem;
  width: 100%;
  display: flex;
  align-items: center;
  
  .logo {
    font-size: 2.25rem;
    font-weight: 600;
    letter-spacing: 2px;
    white-space: nowrap;
    
    @media(max-width: 390px){
      font-size: 1.625rem;
    }
  }
  .menu{
    width: 10%;
    padding-left: 1rem;

  }
  .search{
    width: 30%;
  }
  
  .right {
    display: flex;
    align-items: center;
    margin-left: 20%;
    width: 20%;
    justify-content: center;
  }
`;

const Spacer = styled.div`
  height: 4rem;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  display: inline-block;
`;

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('login-token');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    function handleLogout() {
        localStorage.removeItem('login-token');
        setIsLoggedIn(false);
        alert("로그아웃 완료");
    }

    return (
        <>
            <HeaderBlock>
                <Wrapper>
                    <div className="menu">
                        <CgMenu className="MenuIcon" size="2rem" />
                    </div>
                    <div className="logo">STUDIO I</div>
                    <div className="search">
                        <SearchBar />
                    </div>
                    <div className="right">
                        {isLoggedIn ? (
                            <StyledLink to="/">
                                <Button onClick={handleLogout}>
                                    로그아웃
                                </Button>
                            </StyledLink>
                        ) : (
                            <StyledLink to="/LoginPage">
                                <Button>
                                    로그인
                                </Button>
                            </StyledLink>
                        )}
                    </div>
                </Wrapper>
            </HeaderBlock>
            <Spacer />
        </>
    );
};

export default Header;
