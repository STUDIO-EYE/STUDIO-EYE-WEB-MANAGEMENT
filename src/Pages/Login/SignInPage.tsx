import React, { useState, useEffect, ReactElement, ChangeEvent } from "react";
import styled from "styled-components";
import LoginIMG from "../../assets/logo/studioeye.png";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { media, TitleLg, TitleMd, TitleSm, TextLg, TextMd, TextSm } from '../../Components/common/Font';
import InputText from "Components/common/InputText";
import NewButton from "Components/common/NewButton";
import { theme } from "LightTheme";
import swal from 'sweetalert';

const SignInContainer = styled.div`
  background: #FAFAFA;
  display: flex;
  flex-direction: column;
  justify-content: center; /* 수평 가운데 정렬 */
  align-items: center; /* 수직 가운데 정렬 */
  height: 100vh;

  @media ${media.mobile}{
    display: block;
    background-color: #FFFFFF;
  }
`;

const WhiteBoxContainer = styled.div`
    // padding: 32px 256px 32px 256px;
    height:100vh;
    margin:0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #ffffff;
`;

const TitleCenterBox = styled.div`
  display: flex;
  flex-direction:column;
  justify-content: center;
  align-items: center;
  max-width: 512px;
`;
const LoginImage = styled.img`
  max-width: 100%;
  height: auto;
  margin-bottom: 0.3rem;
  opacity: 1;
  transition: opacity 1s ease;
`;

const SignInBox = styled.div`
  display: flex;
  flex-direction:column;
  align-items: center;
  justify-content:center;
  background-color: #ffffff;
  margin: 10px;
  width: 40vw;

  @media ${media.half} {
    width: 50vw;
    padding: 20px;
  }
`;

const SignInForm = styled.div`
  margin: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SubInputForm = styled.div`
  width:100%;
  align-items: flex-start;
  padding: 0.5rem;
`;

const InputSize = styled.input`
  border: none;
  border-bottom: 1px solid #000000;
  width: 288px;
  height: 32px;
  margin: 8px 0px;

  &:focus{
    outline: none;
  }
`;

const InputSizeWithBtn = styled.input`
  border: none;
  border-bottom: 1px solid #000000;
  width: 192px;
  margin: 8px 4px 8px 0px;

  &:focus{
    outline: none;
  }
`;

const SignInPageButton = styled.button`
  background-color: #EB3225;
  color: #FFFFFF;
  width: 100%;
  padding: 8px 20px;
  border: none;
  border-radius: 32px;
  cursor: pointer;
  transition: background-color 0.3s ease; /* 배경색 변화 시 부드러운 전환 효과 */
  margin: 0.5rem;
  height: 48px;
  &:hover {
    background-color: #cccccc;
    color: black;
  }
`;

const BtnWithInput = styled.button`
  background-color: #EB3225;
  color: #fff;
  width: 90px;
  padding: 8px 20px;
  border: none;
  border-radius: 32px;
  cursor: pointer;
  transition: background-color 0.3s ease; /* 배경색 변화 시 부드러운 전환 효과 */
  &:hover {
    background-color: #cccccc;
  }
`;

const HorizontalBox = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

function SignInPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        pwd: "",
        name: "",
        phoneNumber: "",
        verificationCode: "",
        role: "USER"
    });
    const [pwcheck,setpwcheck]=useState("")

    const formatPhoneNumber = (value: string) => {
        const numericValue = value.replace(/\D/g, ''); // 숫자 이외의 문자 제거
        const formattedValue = numericValue.slice(0, 11);

        const parts = [];
        if (formattedValue.length > 0) {
            parts.push(formattedValue.slice(0, 3));
        }
        if (formattedValue.length > 3) {
            parts.push(formattedValue.slice(3, 7));
        }
        if (formattedValue.length > 7) {
            parts.push(formattedValue.slice(7, 11));
        }

        return parts.join('-');
    };

    const handleChange = (e:ChangeEvent<HTMLInputElement>) => {
        if(e.target.name=="phoneNumber"){
            setFormData((prevData) => ({
                ...prevData,
                ["phoneNumber"]: formatPhoneNumber(e.target.value),
            }));
        }else{
            setFormData((prevData) => ({
                ...prevData,
                [e.target.name]: e.target.value,
            }));
        }
    };
    const handlePwCheck=(e:ChangeEvent<HTMLInputElement>)=>{
        setpwcheck(e.target.value)
    };
    const handleSubmit = () => {
        if(formData.pwd!=pwcheck){
            swal('비밀번호가 일치하지 않습니다.', "", 'error')
        }
        // Send a POST request to your endpoint with formData.
        axios.post('/user-service/register', formData)
            .then((response) => {
                console.log({ message: response.data });
                alert("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.")
                navigate('/LoginPage');
                //이전 페이지로 이동
            })
            .catch((error) => {
                console.error('API 요청 중 오류 발생:', error);
            });
    };

    //-----------------------Email Verification-----------------------

    const [isCodeSent, setIsCodeSent] = useState(false);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [timeLeft, setTimeLeft] = useState(600); // 10분 = 600초
    const [isVerified, setIsVerified] = useState(false);

    const handleSendCode = () => {
        const data = {
            email: formData.email // 실제 이메일 값을 사용
        };

        axios.post('/user-service/emails/verification-requests', null, {
            params:data,
        })
            .then((response) => {
                console.log({ message: response.data });
                alert("입력하신 이메일로 인증코드가 전송되었습니다.");
                setIsCodeSent(true);
                startTimer();
            })
            .catch((error) => {
                console.error('API 요청 중 오류 발생:', error);
            });
    }


    const startTimer = () => {
        setIsTimerRunning(true);
    };

    useEffect(() => {
        let timer: NodeJS.Timeout;

        const handleTimer = () => {
            if (isTimerRunning && timeLeft > 0) {
                timer = setInterval(() => {
                    setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
                }, 1000);
            } else if (timeLeft === 0) {
                setIsTimerRunning(false);
                if (timer) {
                    clearInterval(timer);
                }
            }
        };

        handleTimer();

        return () => {
            clearInterval(timer);
        };
    }, [isTimerRunning, timeLeft]);


    const handleVerifiyCode = () => {

        const email = formData.email;
        const authCode = formData.verificationCode;

        axios.get(`/user-service/emails/verifications?email=${email}&code=${authCode}`)
            .then((response) => {
                console.log({ message: response.data });
                alert(response.data.message);
                if (response.data.verificationStatus) {
                    setIsCodeSent(false);
                    setIsVerified(true);
                } else {
                    setIsCodeSent(true);
                    setIsVerified(false);
                }
            })
            .catch((error) => {
                console.error('API 요청 중 오류 발생:', error);
                setIsVerified(false);
            });
    }

    //-----------------------------phoneNum--------------------------

    return (
        <WhiteBoxContainer className="WhiteBoxContainer">

            <TitleCenterBox>
              <LoginImage src={LoginIMG} />
              <TitleLg>MANAGEMENT PAGE</TitleLg>
            </TitleCenterBox>

            <TextMd>Role</TextMd>
                <select
                    name="role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                    <option value="USER">사용자</option>
                    <option value="ADMIN">관리자</option>
                </select>

            <SignInBox className="SignInBox">
                    <SubInputForm className="SubInputFormWithButton">
                        <TextMd>EMAIL</TextMd>
                        <HorizontalBox>
                            <InputText
                                width={"100%"} height={""}
                                name="email" value={formData.email}
                                placeholder={"이메일을 입력하세요."}
                                onChange={handleChange} data={formData}></InputText>
                            <div style={{width:'1rem'}}/>
                            <NewButton backcolor={theme.color.orange}
                                textcolor={""} width={"10rem"} height={"2.2rem"}
                                smallWidth={"5rem"} onClick={handleSendCode}>인증</NewButton>
                        </HorizontalBox>
                    </SubInputForm>

                    {isCodeSent && (
                        <SubInputForm>
                            <HorizontalBox>
                                <TextMd>Email Verification Code</TextMd>
                                {isTimerRunning && !isVerified && (
                                    <TextMd>
                                        {Math.floor(timeLeft / 60)}:
                                        {timeLeft % 60 < 10 ? "0" + (timeLeft % 60).toString() : (timeLeft % 60).toString()}
                                    </TextMd>
                                )}
                            </HorizontalBox>
                            <HorizontalBox>
                            <InputText
                                width={"100%"} height={""}
                                name="verificationCode" value={formData.verificationCode}
                                placeholder={"인증 코드를 입력하세요."}
                                onChange={handleChange}/>
                            <div style={{width:'1rem'}}/>
                            <NewButton onClick={handleVerifiyCode}
                                backcolor={theme.color.orange} width={"10rem"}
                                height={"2.2rem"} smallWidth={"5rem"} >확인</NewButton>
                            </HorizontalBox>
                        </SubInputForm>
                    )}
                    <SubInputForm className="SubInputForm">
                        <TextMd>Password</TextMd>
                        <InputText
                                width={"100%"} height={""}
                                name="pwd" value={formData.pwd}
                                placeholder={"비밀번호를 입력하세요."}
                                onChange={handleChange} type="password"/>
                    </SubInputForm>
                    <SubInputForm className="SubInputForm">
                        <TextMd>Confirm Password</TextMd>
                        <InputText width={"100%"} height={""}
                                name="pwdcheck" value={pwcheck}
                                placeholder={"동일한 비밀번호를 입력하세요."}
                                onChange={handlePwCheck} type="password"/>
                    </SubInputForm>
                    
                    <SubInputForm className="SubInputForm">
                        <TextMd>Name</TextMd>
                        <InputText
                                width={"100%"} height={""}
                                name="name" value={formData.name}
                                placeholder={"이름을 입력하세요."}
                                onChange={handleChange}/>
                    </SubInputForm>
                    <SubInputForm className="SubInputForm">
                        <TextMd>Phone</TextMd>
                        <InputText
                                width={"100%"} height={""}
                                name="phoneNumber" value={formData.phoneNumber}
                                placeholder={"010-0000-0000"}
                                onChange={handleChange} type="tel"/>
                    </SubInputForm>
                    <NewButton backcolor={theme.color.orange}
                    width={"100%"} height={"2.2rem"} onClick={handleSubmit}>제출</NewButton>
            </SignInBox>

        </WhiteBoxContainer>
    );
}

export default SignInPage;