import React, { useState } from "react";
import LoginIMG from "./LoginIMG.png";
import styled from "styled-components";
import { Link } from "react-router-dom";
import {
  media,
  TitleLg,
  TitleMd,
  TitleSm,
  TextLg,
  TextMd,
  TextSm,
} from "../../Components/common/Font";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";

const LoginContainer = styled.div`
  background-color: #fafafa;
  display: flex;
  flex-direction: column;
  justify-content: center; /* 수평 가운데 정렬 */
  align-items: center; /* 수직 가운데 정렬 */
  height: 100vh;

  @media ${media.mobile} {
    display: block;
    background-color: #ffffff;
  }
`;

const LoginBox = styled.div`
  display: flex;
  align-items: center;
  margin: 10px;
  padding: 5px 80px;

  @media ${media.mobileWithImage} {
    padding: 20px;
    display: inherit;
  }
`;

const LoginForm = styled.div`
  margin: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LoginImageBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 512px;
  height: inherit;
`;

const LoginImage = styled.img`
  max-width: 100%;
  height: auto;
  opacity: 1; /* 초기 투명도 설정 */
  transition: opacity 1s ease; /* 투명도 변경에 대한 트랜지션 설정 */

  @media ${media.mobileWithImage} {
    //opacity: 0; /* 미디어 쿼리 범위에서 이미지를 초기 상태로 설정 */
    //transition: opacity 1s ease; /* 트랜지션 설정 */
    //height: 0;
    display: none;
  }
`;

const AlignLeft = styled.div`
  align-self: flex-start;
  padding: 8px;
`;

const TitleCenterBox = styled.div`
  display: block;
  justify-items: center;
`;

const HorizontalLine = styled.div`
  border-top: 1px solid #ccc; /* 가로 선 스타일 */
  margin: 0.5rem 0; /* 원하는 간격 설정 */
  width: 100%;
`;

const VerticalLine = styled.div`
  border-left: 1px solid #ccc; /* 세로선 색상과 스타일 지정 */
  height: 400px; /* 세로선의 높이를 부모 요소에 맞게 설정 */
  margin: 0.5rem;

  @media ${media.mobileWithImage} {
    display: none;
  }
`;

const InputSize = styled.input`
  border: none;
  border-bottom: 1px solid #000000;
  width: 100%;
  min-width: 288px;
  height: 40px;
  margin: 16px;
  &:focus {
    outline: none;
  }
`;

const Margin16px = styled.div`
  margin: 1rem;
`;

const LoginPageButton = styled.button`
  background-color: #ff530e;
  color: #ffffff;
  width: 100%;
  padding: 8px 20px;
  border: none;
  border-radius: 32px;
  cursor: pointer;
  transition: background-color 0.3s ease; /* 배경색 변화 시 부드러운 전환 효과 */
  margin: 0.5rem;
  height: 44px;
  &:hover {
    background-color: #cccccc;
  }
`;

const StyledButtonLink = styled(Link)`
  text-decoration: none; /* 밑줄 제거 */
  color: inherit; /* 부모 요소의 색상 상속 */
  cursor: pointer; /* 포인터 커서 표시 */
  width: 100%;
  display: inline-block; /* 또는 block로 설정 */
`;

const StyledLink = styled(Link)`
  text-decoration: none; /* 밑줄 제거 */
  cursor: pointer; /* 포인터 커서 표시 */
  color: #eb3225;
`;

const WhiteBoxContainer = styled.div`
  padding: 16px 64px 64px 64px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  box-shadow: 0px 2px 4px 2px #e9e9e9;

  @media ${media.mobile} {
    box-shadow: none;
  }
`;

const HorizontalBox = styled.div`
  padding: 8px;
  margin: 0px 8px 8px 8px;
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    pwd: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  // const healthCheckTest =()=> {
  //     // Axios를 사용하여 Spring Boot API에 GET 요청을 보냅니다.
  //     axios.get('/user-service/login', formData)
  //         .then(response => {
  //             console.log({message: response.data})
  //
  //         })
  //         .catch(error => {
  //             console.error('API 요청 중 오류 발생:', error);
  //         });
  // }

  const handleLogin = () => {
    axios
      .post("/user-service/login", formData)
      .then((response) => {
        const accessToken = response.data.accessToken;
        axios.defaults.headers.common["Authorization"] =
          "Bearer " + accessToken; // 토큰을 HTTP 헤더에 포함
        sessionStorage.setItem("login-token", accessToken);

        alert("로그인 성공");
        navigate("/");
      })
      .catch((error) => {
        alert("로그인 실패");
        console.error("API 요청 중 오류 발생:", error);
      });
  };

  return (
    <LoginContainer>
      <WhiteBoxContainer>
        <TitleCenterBox>
          <Margin16px>
            <TitleLg>LOGIN</TitleLg>
          </Margin16px>
        </TitleCenterBox>
        <LoginBox>
          <LoginForm onKeyDown={handleKeyDown}>
            <AlignLeft>
              <TextMd>Email</TextMd>
            </AlignLeft>
            <InputSize
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <AlignLeft>
              <TextMd>Password</TextMd>
            </AlignLeft>
            <InputSize
              name="pwd"
              value={formData.pwd}
              onChange={handleChange}
              type="password"
            />
            <HorizontalBox>
              <TextLg>Forget Password?</TextLg>
              <StyledLink>
                <TextLg>Here</TextLg>
              </StyledLink>
            </HorizontalBox>
            <LoginPageButton onClick={() => handleLogin()}>
              LOGIN
            </LoginPageButton>
            <HorizontalBox>
              <TextLg>Don't you have an account?</TextLg>
              <StyledLink to="/SignInPage">
                <TextLg>Sign Up</TextLg>
              </StyledLink>
            </HorizontalBox>
          </LoginForm>
          <LoginImageBox>
            <LoginImage src={LoginIMG} />
          </LoginImageBox>
        </LoginBox>
      </WhiteBoxContainer>
    </LoginContainer>
  );
}

export default LoginPage;
