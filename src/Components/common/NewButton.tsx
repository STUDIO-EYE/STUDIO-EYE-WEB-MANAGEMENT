import React, { ReactNode,MouseEvent } from 'react';
import styled from 'styled-components';
import { media } from './Font';

interface RectangleProps{
  className?:string,
  backcolor:string,
  textcolor?:string,
  width:string,
  smallWidth?:string,
  height:string,
  children:ReactNode,
  style?:any,
  onClick?:(event:MouseEvent<HTMLDivElement>)=>void;
  padding?:string;
  fontSize?:string;
}

const StyledButton = styled.button<RectangleProps>`
  border: none;
  border-radius: 10px;
  font-size: ${(prop)=>prop?prop.fontSize:'1rem'};
  padding: ${(prop)=>prop?prop.padding:'0.25rem 0'};
  outline: none;
  cursor: pointer;
  color: ${(prop)=>prop.textcolor||'white'};
  background-color: ${(prop)=>prop.backcolor};
  width: ${(prop)=>prop.width};
  height: ${(prop)=>prop.height};

  &:hover {
    opacity: 0.6;
  }

  @media ${media.half}{
    width:${(prop)=>prop.smallWidth};
  }
`;

const WhiteButton: React.FC<RectangleProps> = (props) => (
    <StyledButton 
    textcolor={props.textcolor}
    backcolor={props.backcolor}
    width={props.width}
    smallWidth={props.smallWidth}
    height={props.height} 
    onClick={props.onClick}
    style={{...props}}>
      {props.children}</StyledButton>
);

export default WhiteButton;
