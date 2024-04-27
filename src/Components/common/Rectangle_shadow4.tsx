import React,{ReactNode,MouseEvent} from 'react';
import styled from 'styled-components';
import { media } from './Font';
import { width } from '@mui/system';

const StyledRectangle=styled.div<rectangleProps>`
    width: ${(prop) => prop.width};
    margin: ${(prop)=>prop.margin};
    box-shadow: 0px 4px 4px rgba(0,0,0,0.04);
    border-radius:1.6rem;
    //background-color:white;
    padding: 0.2rem 1rem;
    flex-direction: column;

    @media only screen and (max-width:70rem){
        width:100%;
    }
`

interface rectangleProps{
    className?:string,
    width:string,
    margin?:string,
    children:ReactNode,
    onClick?:(event:MouseEvent<HTMLDivElement>)=>void
}

const Rectangle:React.FC<rectangleProps>=(prop)=>{
        return(
            <StyledRectangle width={prop.width} margin={prop.margin} className={prop.className} onClick={prop.onClick}>
                {prop.children}
            </StyledRectangle>
        )
    };

export default Rectangle;
