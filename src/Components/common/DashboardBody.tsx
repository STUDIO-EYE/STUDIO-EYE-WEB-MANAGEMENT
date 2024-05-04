import React from "react";
import { ReactNode } from "react";
import styled from "styled-components";

const StyledDashboardBody = styled.div`
  width: 90%;
  height: auto;
  margin-bottom: 3rem;
  margin-left: 225px;
  margin-top: -3rem;
  display: flex;
  flex-direction: column;
  /* overflow-y: auto;
  margin-bottom: 3rem; */
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