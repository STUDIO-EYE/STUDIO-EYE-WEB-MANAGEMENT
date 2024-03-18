import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { media ,TitleLg, TitleMd, TitleSm, TextLg, TextMd, TextSm } from '../../Components/common/Font';

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

const SignInBox = styled.div`
  display: flex;
  align-items: center;
  background-color: #ffffff;
  margin: 10px;
  width: 70%;

  @media ${media.mobile} {
    padding: 20px;
    display: inherit;
    width: auto;
  }
`;

const TitleCenterBox = styled.div`
  display: flex;
  justify-content: center;
`;

const SignInForm = styled.div`
  margin: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SubInputForm = styled.div`
  align-items: flex-start;
  padding: 0.5rem;
`;

const SubInputFormWithButton = styled.div`
  display: flex;
  width: auto;
`;

const Margin16px = styled.div`
  margin: 1rem;
`;

const HorizontalLine = styled.div`
  border-top: 1px solid #ccc; /* 가로 선 스타일 */
  margin: 0.5rem 0; /* 원하는 간격 설정 */
  width: 100%;
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

const WhiteBoxContainer = styled.div`
    padding: 32px 256px 32px 256px; 
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #ffffff;
    box-shadow: 0px 2px 4px 2px #E9E9E9;
  
    @media ${media.mobile}{
      box-shadow: none;
    }
`;

const HorizontalBox = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

function SignInPage(){
   const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        pwd: "",
        name: "",
        phoneNumber: "",
        verificationCode: "",
    });

    const formatPhoneNumber = (value) => {
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


    const handleChange = (e) => {
        const { name, value } = e.target;

        // phoneNumber 필드만 형식을 맞추고 나머지 필드는 그대로 유지
        if (name === 'phoneNumber') {
            setFormData((prevData) => ({
                ...prevData,
                [name]: formatPhoneNumber(value),
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };
    const handleSubmit = () => {
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
        const params = {
            email: formData.email // 실제 이메일 값을 사용
        };

        axios.post('/user-service/emails/verification-requests', null,{
            params: params,
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
        let timer;

        if (isTimerRunning && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsTimerRunning(false);
            clearInterval(timer);
        }

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
                    if(response.data.verificationStatus){
                        setIsCodeSent(false);
                        setIsVerified(true);
                    }else{
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

    return(
        <SignInContainer>
            <WhiteBoxContainer className="WhiteBoxContainer">
                <TitleCenterBox className="TitleCenterBox">
                    <Margin16px><TitleLg>Sign In</TitleLg></Margin16px>
                </TitleCenterBox>
            <SignInBox className="SignInBox">
                <SignInForm className="SignInForm">
                    <SubInputForm className="SubInputFormWithButton">
                        <TextMd>Email</TextMd>
                        <HorizontalBox>
                            <InputSizeWithBtn   name="email"
                                                value={formData.email}
                                                onChange={handleChange} />
                            <BtnWithInput onClick={handleSendCode}>Send</BtnWithInput>
                        </HorizontalBox>

                    </SubInputForm>
                    {isCodeSent && (
                    <SubInputForm>
                        <HorizontalBox>
                            <TextMd>Email Verification Code</TextMd>
                            {isTimerRunning && !isVerified && (
                                <TextMd>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</TextMd>
                            )}
                        </HorizontalBox>
                        <InputSizeWithBtn   name="verificationCode"
                                            value={formData.verificationCode}
                                            onChange={handleChange} />
                        <BtnWithInput onClick={handleVerifiyCode}>Verify</BtnWithInput>
                    </SubInputForm>
                        )}
                    <SubInputForm className="SubInputForm">
                        <TextMd>Password</TextMd>
                        <InputSize   name="pwd"
                                     value={formData.pwd}
                                     onChange={handleChange}
                                     type="password"
                        />
                    </SubInputForm>
                    <SubInputForm className="SubInputForm">
                        <TextMd>Confirm Password</TextMd>
                        <InputSize type="password" />
                    </SubInputForm>
                    <SubInputForm className="SubInputForm">
                        <TextMd>Name</TextMd>
                        <InputSize   name="name"
                                     value={formData.name}
                                     onChange={handleChange}
                        />
                    </SubInputForm>
                    <SubInputForm className="SubInputForm">
                        <TextMd>Phone</TextMd>
                        <InputSize   name="phoneNumber"
                                     value={formData.phoneNumber}
                                     onChange={handleChange}
                                     type="tel"
                                     placeholder="010-1234-5678"
                        />
                    </SubInputForm>
                <SignInPageButton onClick={() => handleSubmit()}>Sign In</SignInPageButton>
                </SignInForm>
            </SignInBox>

            </WhiteBoxContainer>
        </SignInContainer>
    );
}

export default SignInPage;