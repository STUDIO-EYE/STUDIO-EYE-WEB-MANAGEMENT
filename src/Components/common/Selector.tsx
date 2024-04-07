import React, { ReactNode, useState,ChangeEvent } from 'react';
import styled from 'styled-components';

const CustomSelector=styled.select<SelectorProps>`
  width:${(props)=>props.width};
`;

interface SelectorProps{
  width:string,
  children?:ReactNode,
  onChange?:(event:ChangeEvent<HTMLSelectElement>)=>void
};

const Selector:React.FC<SelectorProps> = (props) => {
  return (
    <CustomSelector width={props.width} onChange={props.onChange}>
      {props.children}
    </CustomSelector>
  );
};

export default Selector;