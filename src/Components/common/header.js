import React from 'react';
import styled from 'styled-components';
import Responsive from './responsive';
import Button from './Button';
import SearchBar from '../SearchBar';
import { Link } from 'react-router-dom';
import { CgMenu } from "react-icons/cg";

import { useEffect, useState } from 'react';

const HeaderBlock = styled.div`
  position: fixed;
  width: 100%;
  background: white;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.08);
`;

/**
 * Responsive 컴포넌트의 속성에 스타일을 추가해서 새로운 컴포넌트 생성
 */
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

/**
 * 헤더가 fixed로 되어 있기 때문에 페이지의 콘텐츠가 4rem 아래에 나타나도록 해 주는 컴포넌트
 */
const Spacer = styled.div`
  height: 4rem;
`;

const StyledLink = styled(Link)`
  text-decoration: none; /* 밑줄 제거 */
  color: inherit; /* 부모 요소의 색상 상속 */
  cursor: pointer; /* 포인터 커서 표시 */
  display: inline-block; /* 또는 block로 설정 */
`;

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // 로컬 스토리지에서 토큰을 가져옵니다.
        const token = localStorage.getItem('login-token');

        if (token) {
            // 토큰이 존재하면 로그인 상태로 설정
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
            <HeaderBlock className={"HeaderBlock"}>
                <Wrapper className={"Wrapper"}>
                    <div className="menu">
                        <CgMenu className="MenuIcon" size="2rem" />
                    </div>
                    <div className="logo">STUDIO I</div>
                    <div className="search">
                    <SearchBar />
                    </div>
                    <div className="right">
                        {isLoggedIn ? (<StyledLink to="/"><Button onClick={handleLogout}>
                            로그아웃
                        </Button></StyledLink>) : (
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