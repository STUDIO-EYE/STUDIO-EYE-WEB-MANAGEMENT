import React, { useState } from "react";
import LoginIMG from "../../assets/logo/studioeye.png";
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
import swal from 'sweetalert';
import InputText from "Components/common/InputText";
import { theme } from "LightTheme";
import NewButton from "Components/common/NewButton";

const LoginBox = styled.div`
  display: flex;
  align-items: center;
  margin: 10px auto;
  padding: 5px 80px;
  // @media ${media.mobileWithImage} {
  //   padding: 20px;
  //   display: inherit;
  // }
`;

const LoginForm = styled.div`
  margin: 0.1rem auto;
  display: flex;
  flex-direction: column;
  align-items: left;
`;
const LoginFormItem = styled.div`
  margin-top:0.5rem;
  display:flex;
  flex-direction:column;
  @media ${media.half}{
    width:70vw;
  }
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
  margin-bottom: 0.3rem;
  opacity: 1;
  transition: opacity 1s ease;
`;

const AlignLeft = styled.div`
  align-self: flex-start;
`;

const TitleCenterBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items:center;
  justify-items: center;
`;

const StyledLink = styled(Link) <{ margin?: string }>`
  margin:${(props) => props.margin || '-0.1rem'};
  text-align: center;
  text-decoration: underline;
  cursor: pointer;
  color: ${theme.color.orange};
`;

const WhiteBoxContainer = styled.div`
  width:100%;
  height:100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;

  @media ${media.mobile} {
    box-shadow: none;
  }
`;

const HorizontalBox = styled.div`
  padding: 8px;
  margin: 8px 8px 8px 8px;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const CapsLockWarning = styled.div`
  color: red;
  font-size: 0.8rem;
`;

function LoginPage() {
  const [isCapsLockActive, setIsCapsLockActive] = useState(false);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    pwd: "",
  });
  const handleData = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setIsCapsLockActive(e.getModifierState("CapsLock"));

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

        swal('로그인 성공!', "", 'success')
          .then(function () { navigate("/"); })
      })
      .catch((error) => {
        alert("로그인 실패");
        console.error("API 요청 중 오류 발생:", error);
      });
  };

  return (
    <WhiteBoxContainer>
      <TitleCenterBox>
        <LoginImageBox>
          <LoginImage src={LoginIMG} />
        </LoginImageBox>
        <TitleLg>MANAGEMENT PAGE</TitleLg>
      </TitleCenterBox>
      <LoginBox>
        <LoginForm>
          <LoginFormItem><AlignLeft><TextMd>EMAIL</TextMd></AlignLeft></LoginFormItem>
          <LoginFormItem><InputText width={"69vw"} height={""} value={formData.email} placeholder={"이메일을 입력해주세요."}
            name="email" onChange={handleData} /></LoginFormItem>
          <LoginFormItem><AlignLeft><TextMd>PASSWORD</TextMd></AlignLeft></LoginFormItem>
          <LoginFormItem><InputText width={"69vw"} height={""} value={formData.pwd} placeholder={"비밀번호를 입력해주세요."}
            name="pwd" onChange={handleData} type="password" onKeyDown={handleKeyDown} /></LoginFormItem>
          <LoginFormItem>
            {isCapsLockActive && (
              <CapsLockWarning>Caps Lock이 켜져 있습니다. 비밀번호를 정확히 입력하세요.</CapsLockWarning>
            )}
            <StyledLink to="#" margin="0.8rem">
              <TextSm>비밀번호를 잊어버리셨나요?</TextSm>
            </StyledLink>
            <NewButton backcolor={theme.color.orange} textcolor={"white"} width={"70vw"} height={""} padding="0.5rem" onClick={handleLogin}>로그인</NewButton>
            <HorizontalBox>
              <TextSm>계정이 없으신가요?&nbsp;</TextSm>
              <StyledLink to="/SignInPage">
                <TextSm>이곳에 문의하세요.</TextSm>
              </StyledLink>
            </HorizontalBox>
          </LoginFormItem>
        </LoginForm>
      </LoginBox>
    </WhiteBoxContainer>
  );
}

export default LoginPage;
