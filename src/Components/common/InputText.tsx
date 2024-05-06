import { theme } from "LightTheme";
import { ChangeEvent } from "jest-haste-map";
import React from "react";
import styled from "styled-components";



const StyledInputArea = styled.input<InputTextProps>`
  font-family: 'Pretendard';
  border-radius: 10px;
  width: ${(prop) => (prop.width)};
  height: ${(prop) => (prop.height)};
  padding: 0.5rem;
  margin-bottom: 0.3rem;
  outline: 1px solid ${theme.color.gray20};
  border:none;
  color: ${theme.color.black};
  resize: none;
  overflow-y: hidden;
  overflow-x: hidden;
  font-size: 0.9rem;
  vertical-align: middle;

  @media only screen and (max-width:50rem){
    width:97%;
}

  &:focus {
    outline: 2px solid ${theme.color.orange};
  }

  &::placeholder{
    font-size: 0.9rem;
  }
`;

interface InputTextProps {
  width: string;
  height: string;
  value?: string;
  onChange?: (value: any) => void;
  placeholder: string;
  name?: string;
  type?: string;
  onKeyDown?: (value: any) => void;
  data?: any;
}

const InputText: React.FC<InputTextProps> = (props) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    props.onChange?.(e);
  }
  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    props.onKeyDown?.(e);
  }

  return (
    <StyledInputArea
      width={props.width}
      height={props.height}
      value={props.value}
      onChange={handleChange}
      placeholder={props.placeholder}

      name={props.name}
      type={props.type}
      onKeyDown={handleOnKeyDown}
      data={props.data} />
  );
};
export default InputText;

