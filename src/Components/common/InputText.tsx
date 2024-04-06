import { theme } from "LightTheme";
import { ChangeEvent } from "jest-haste-map";
import React from "react";
import styled from "styled-components";



const StyledInputArea = styled.input<InputTextProps>`
  width: ${(prop)=>(prop.width)};
  height: ${(prop)=>(prop.height)};
  padding: 0.3rem;
  margin-bottom: 0.3rem;
  outline: 1px solid ${theme.color.gray20};
  border:none;
  border-radius: 12px;
  color: ${theme.color.black};
  resize: none;
  font-size: 1rem;
  vertical-align: middle;

  @media only screen and (max-width:50rem){\
    width:97%;
}

  &:focus {
    outline: 2px solid ${theme.color.orange};
  }
`;

interface InputTextProps{
    width:string;
    height:string;
    value:string;
    onChange?:(value:any)=>void;
    placeholder:string;
}

const InputText:React.FC<InputTextProps>=(props)=>{
    const handleChange=(e:React.ChangeEvent<HTMLTextAreaElement>)=>{
        props.onChange?.(e.target.value);
    }

    return (
        <StyledInputArea
            width={props.width}
            height={props.height}
            value={props.value}
            onChange={handleChange}
            placeholder={props.placeholder}/>
    );
};
export default InputText;

