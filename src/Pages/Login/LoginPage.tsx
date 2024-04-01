import React, { useState } from "react";
import LoginIMG from "./LoginIMG.png";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
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
// import jwt-decode from "jwt-decode";

const LoginContainer = styled.div`
  background-color: #fafafa;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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
  opacity: 1;
  transition: opacity 1s ease;

  @media ${media.mobileWithImage} {
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
  border-top: 1px solid #ccc;
  margin: 0.5rem 0;
  width: 100%;
`;

const VerticalLine = styled.div`
  border-left: 1px solid #ccc;
  height: 400px;
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
  transition: background-color 0.3s ease;
  margin: 0.5rem;
  height: 44px;
  &:hover {
    background-color: #cccccc;
  }
`;

const StyledButtonLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  width: 100%;
  display: inline-block;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  cursor: pointer;
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  }; 

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
            <LoginForm>
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
                  onKeyDown={handleKeyDown}
              />
              <HorizontalBox>
                <TextLg>Forget Password?</TextLg>
                <StyledLink to="#">
                  <TextLg>Here</TextLg>
                </StyledLink>
              </HorizontalBox>
              <LoginPageButton onClick={handleLogin}>LOGIN</LoginPageButton>
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
