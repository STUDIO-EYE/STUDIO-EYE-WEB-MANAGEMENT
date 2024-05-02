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

// import jwt-decode from "jwt-decode";

// const LoginContainer = styled.div`
//   background-color: #fafafa;
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
//   height: 100vh;

//   @media ${media.mobile} {
//     display: block;
//     background-color: #ffffff;
//   }
// `;

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
const LoginFormItem=styled.div`
  margin-top:0.5rem;
  display:flex;
  flex-direction:column;
  @media ${media.half}{
    width:70vw;
  }
`

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

const StyledLink = styled(Link)<{margin?:string}>`
  margin:${(props)=>props.margin||'-0.1rem'};
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

function LoginPage() {
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
    if (e.key === "Enter") {
      handleLogin();
    }
  }; 

  const handleLogin = () => {
    axios
      .post("/user-service/login", formData)
      .then((response) => {
        if(response.data.approved){
          const accessToken = response.data.accessToken;
          axios.defaults.headers.common["Authorization"] =
          "Bearer " + accessToken; // 토큰을 HTTP 헤더에 포함
          sessionStorage.setItem("login-token", accessToken);

          swal('로그인 성공!', "", 'success')
          .then(function() { navigate("/"); })
        }else{
          swal('로그인 실패',"관리자의 승인이 필요한 계정입니다.",'warning')
        }
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
              name="email" onChange={handleData}/></LoginFormItem>
              <LoginFormItem><AlignLeft><TextMd>PASSWORD</TextMd></AlignLeft></LoginFormItem>
              <LoginFormItem><InputText width={"69vw"} height={""} value={formData.pwd} placeholder={"비밀번호를 입력해주세요."}
              name="pwd" onChange={handleData} type="password" onKeyDown={handleKeyDown}/></LoginFormItem>
              
              <LoginFormItem>
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
