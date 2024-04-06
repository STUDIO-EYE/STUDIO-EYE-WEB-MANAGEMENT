import React, { ReactNode,MouseEvent } from 'react';
import styled from 'styled-components';

interface RectangleProps{
  className?:string,
  backcolor:string,
  textcolor:string,
  width:string,
  height:string,
  children:ReactNode,
  style?:any,
  onClick?:(event:MouseEvent<HTMLDivElement>)=>void
}

const StyledButton = styled.button<RectangleProps>`
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  padding: 0.25rem 0;
  outline: none;
  cursor: pointer;
  color: ${(prop)=>prop.textcolor};
  background-color: ${(prop)=>prop.backcolor};
  width: ${(prop)=>prop.width};
  height: ${(prop)=>prop.height};

  &:hover {
    opacity: 0.6;
  }
`;

const WhiteButton: React.FC<RectangleProps> = (props) => (
    <StyledButton 
    textcolor={props.textcolor}
    backcolor={props.backcolor}
    width={props.width} 
    height={props.height} 
    onClick={props.onClick}
    style={{...props}}>
      {props.children}</StyledButton>
);

export default WhiteButton;
