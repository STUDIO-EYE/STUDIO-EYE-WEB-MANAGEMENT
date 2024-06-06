import { theme } from "LightTheme";
import React, { ChangeEvent } from "react";
import styled from "styled-components";

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
  disabled?: boolean;
}

const StyledInputArea = styled.input<InputTextProps>`
  font-family: 'Pretendard';
  border-radius: 10px;
  width: ${(prop) => (prop.width)};
  height: ${(prop) => (prop.height)};
  min-height: 2rem;
  padding: 0.5rem 0 0.5rem 1rem;
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

const InputText: React.FC<InputTextProps> = (props) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.onChange?.(e);
  }
  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
      data={props.data}
      disabled={props.disabled}
    />
  );
};
export default InputText;
