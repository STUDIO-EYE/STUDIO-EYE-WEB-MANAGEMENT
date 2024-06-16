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

const SubInputForm = styled.div`
  width:100%;
  align-items: flex-start;
  padding: 0.5rem;
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
        verificationCode: ""
    });
    const [pwcheck, setPwcheck] = useState("")
    const [isPasswordMatch, setIsPasswordMatch] = useState(true);
    const [isCapsLockActive, setIsCapsLockActive] = useState(false);
    const [isNameValid, setIsNameValid] = useState(true);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        setIsCapsLockActive(e.getModifierState("CapsLock"));
    };

    const formatPhoneNumber = (value: string) => {
        const numericValue = value.replace(/\D/g, '');
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

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "name") {
            if (value.length > 17) {
                return;
            }
            setIsNameValid(value.length >= 2);
        }
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));

        if (e.target.name == "phoneNumber") {
            setFormData((prevData) => ({
                ...prevData,
                ["phoneNumber"]: formatPhoneNumber(e.target.value),
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [e.target.name]: e.target.value,
            }));
        }
    };

    const handlePwCheck = (e: ChangeEvent<HTMLInputElement>) => {
        setPwcheck(e.target.value);
        setIsPasswordMatch(formData.pwd === e.target.value);
    };

    const handleSubmit = () => {
        if (!isPasswordMatch) {
            swal('비밀번호가 일치하지 않습니다.', "", 'error');
            return;
        }
        axios.post('/user-service/register', formData)
            .then((response) => {
                if (response.status === 201) {
                    alert("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.")
                    navigate('/LoginPage');
                }
            })
            .catch((error) => {
                if (error.response) {
                    if (error.response.status === 409) {
                        alert('이미 사용 중인 번호입니다.');
                    } else {
                        console.error('API 요청 중 오류 발생:', error.response.status, error.response.data);
                    }
                } else {
                    console.error('API 요청 중 오류 발생:', error.message);
                }
            });
    };

    //-----------------------Email Verification-----------------------

    const [isCodeSent, setIsCodeSent] = useState(false);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [timeLeft, setTimeLeft] = useState(600); // 10분 = 600초
    const [isVerified, setIsVerified] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSendCode = () => {
        const data = {
            email: formData.email
        };

        setLoading(true);  // 로딩 시작

        axios.post('/user-service/emails/verification-requests', null, {
            params: data,
        })
            .then((response) => {
                setLoading(false);  // 로딩 종료
                if (response.status === 200) {
                    alert("입력하신 이메일로 인증코드가 전송되었습니다.");
                    setIsCodeSent(true);
                    startTimer();
                }
            })
            .catch((error) => {
                setLoading(false);  // 로딩 종료
                if (error.response) {
                    if (error.response.status === 409) {
                        alert("이미 사용 중인 이메일입니다.");
                    } else {
                        console.error('API 요청 중 오류 발생:', error.response.status, error.response.data);
                    }
                } else {
                    console.error('API 요청 중 오류 발생:', error.message);
                }
            });
    };

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
                alert('인증에 성공하였습니다.');
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

    return (
        <WhiteBoxContainer className="WhiteBoxContainer">

            <TitleCenterBox>
                <LoginImage src={LoginIMG} />
                <TitleLg>MANAGEMENT PAGE</TitleLg>
            </TitleCenterBox>

            <SignInBox className="SignInBox">
                <SubInputForm className="SubInputFormWithButton">
                    {loading &&
                        <TextSm style={{ color: 'darkgray' }}>로딩 중...</TextSm>
                    }
                    <TextMd>EMAIL</TextMd>
                    <HorizontalBox>
                        <InputText
                            width={"100%"}
                            height={""}
                            name="email"
                            value={formData.email}
                            placeholder={"이메일을 입력하세요."}
                            onChange={handleChange}
                            data={formData}
                            disabled={isVerified}
                        />

                        <div style={{ width: '1rem' }} />
                        {!isVerified && (
                            <NewButton
                                backcolor={theme.color.orange}
                                textcolor={""}
                                width={"10rem"}
                                height={"3rem"}
                                smallWidth={"5rem"}
                                onClick={handleSendCode}
                            >
                                {isCodeSent ? "재전송" : "인증"}
                            </NewButton>
                        )}
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
                                onChange={handleChange} />
                            <div style={{ width: '1rem' }} />
                            <NewButton onClick={handleVerifiyCode}
                                backcolor={theme.color.orange} width={"10rem"}
                                height={"3rem"} smallWidth={"5rem"} >확인</NewButton>
                        </HorizontalBox>
                    </SubInputForm>
                )}
                <SubInputForm className="SubInputForm">
                    <TextMd>Password</TextMd>
                    <InputText
                        width={"98%"} height={""}
                        name="pwd" value={formData.pwd}
                        placeholder={"비밀번호를 입력하세요."}
                        onChange={handleChange} type="password"
                        onKeyDown={handleKeyDown} />
                </SubInputForm>
                <SubInputForm className="SubInputForm">
                    <TextMd>Confirm Password</TextMd>
                    <InputText width={"98%"} height={""}
                        name="pwdcheck" value={pwcheck}
                        placeholder={"동일한 비밀번호를 입력하세요."}
                        onChange={handlePwCheck} type="password"
                        onKeyDown={handleKeyDown} />
                    {!isPasswordMatch && (
                        <TextSm style={{ color: 'red' }}>비밀번호가 일치하지 않습니다.</TextSm>
                    )}
                    {isCapsLockActive && (
                        <TextSm>Caps Lock이 켜져 있습니다. 비밀번호를 정확히 입력하세요.</TextSm>
                    )}
                </SubInputForm>
                <SubInputForm className="SubInputForm">
                    <TextMd>Name</TextMd>
                    <InputText
                        width={"98%"} height={""}
                        name="name" value={formData.name}
                        placeholder={"이름을 입력하세요.(2-17자)"}
                        onChange={handleChange} />
                    {!isNameValid && (
                        <TextSm style={{ color: 'red' }}>이름은 2자 이상 17자 이하여야 합니다.</TextSm>
                    )}
                </SubInputForm>
                <SubInputForm className="SubInputForm">
                    <TextMd>Phone</TextMd>
                    <InputText
                        width={"98%"} height={""}
                        name="phoneNumber" value={formData.phoneNumber}
                        placeholder={"번호를 입력하세요."}
                        onChange={handleChange} type="tel" />
                </SubInputForm>
                <NewButton backcolor={theme.color.orange}
                    width={"100%"} height={"2.2rem"} onClick={handleSubmit}>회원 가입</NewButton>
            </SignInBox>

        </WhiteBoxContainer>
    );
}

export default SignInPage;