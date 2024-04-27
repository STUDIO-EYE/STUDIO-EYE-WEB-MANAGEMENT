import React, { ReactNode,MouseEvent } from 'react';
import styled from 'styled-components';
import { media } from './Font';
import { theme } from 'LightTheme';

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
  margin?:string;
}

const StyledButton = styled.button<RectangleProps>`
  font-family: 'Pretendard';
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
  margin: ${(prop)=>prop.margin};

  &:hover {
    color: ${theme.color.orange};
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
