import { theme } from "LightTheme";
import { ChangeEvent } from "jest-haste-map";
import React from "react";
import styled from "styled-components";



const StyledInputArea = styled.input<InputTextProps>`
  width: ${(prop)=>(prop.width)};
  height: ${(prop)=>(prop.height)};
  padding: 0.5rem;
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

  &::placeholder{
    font-size: 0.8rem;
  }
`;

interface InputTextProps{
    width:string;
    height:string;
    value?:string;
    onChange?:(value:any)=>void;
    placeholder:string;
    name?:string;
    type?:string;
    onKeyDown?:(value:any)=>void;
    data?:any;
}

const InputText:React.FC<InputTextProps>=(props)=>{
    const handleChange=(e:React.ChangeEvent<HTMLTextAreaElement>)=>{
        props.onChange?.(e);
    }
    const handleOnKeyDown=(e:React.ChangeEvent<HTMLTextAreaElement>)=>{
      props.onKeyDown?.(e.target);
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
            data={props.data}/>
    );
};
export default InputText;

