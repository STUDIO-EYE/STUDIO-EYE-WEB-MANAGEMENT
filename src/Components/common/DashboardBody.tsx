import React from "react";
import { ReactNode } from "react";
import styled from "styled-components";

const StyledDashboardBody = styled.div`
  width: 85%;
  margin-left: 225px;
  display: flex;
  flex-direction: column;
  //overflow-y: hidden;
  transition: height 0.3s ease-in-out;
  position: relative; /* 상대 위치 설정 */
`;

interface DashboardProp{
    children?:ReactNode,
    onScroll?:React.UIEventHandler<HTMLDivElement>
}

const DashboardBody:React.FC<DashboardProp>=({children,onScroll})=>{
    return(
        <StyledDashboardBody onScroll={()=>onScroll}>{children}</StyledDashboardBody>
    )
}

export default DashboardBody;