import React from "react";
import styled from 'styled-components';

const StyledHorizontalLine=styled.hr`
    border-top: 1px solid #F4F4F5;
`

const HorizontalLine:React.FC=(prop)=>{
    return (
        <StyledHorizontalLine/>
    )
}

export default HorizontalLine;