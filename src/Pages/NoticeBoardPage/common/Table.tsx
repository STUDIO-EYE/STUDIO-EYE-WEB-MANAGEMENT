import React, { useState } from "react";
import styled from "styled-components";
import {TextLg, TextMd, TextSm, TableText} from "../../../Components/common/Font";

const TableContainer = styled.div`
  width: 100%;
  padding-bottom: 1rem;
  margin: 1rem;
  overflow-y: auto;
`;

const TableStyled = styled.table`
  width: 96%;
  border-collapse: collapse;
  
  th{
    text-align: left;
    padding: 10px;
    color: #DADADA;
  }
  
  th:first-child{
    width:20%
  }
  th:nth-child(2) {
    width: 40%;
  }
  th:nth-child(4){
    width: 20%;
  }
  
  tbody tr {
    cursor: pointer;
    border-top: 2px solid #F8F8F8;
    border-bottom: 2px solid #F8F8F8;
    &:hover {
      background-color: #FAFAFA;
    }
  }
  td {
    font-size: 0.9rem;
    padding: 10px;
  }
`;

const TableCellCenter = styled.td`
  padding: 8px;
  text-align: center;
  colSpan:${props=>props.colSpan};
`;


const Table = ({  tableData, onRowClick, sortValue }
  :{tableData:any,onRowClick:any, sortValue:string}) => {

    // Table의 열을 클릭했을 때 호출될 함수
    const sendDataBoard = (rowId:number) => {
      onRowClick(rowId);
    };
    // 날짜 형식 변경
    const changeDate=(date: string) :string=>{
      date=date.replaceAll(/년|월|일/gi,"")
      let datestrings:string[]=date.split(" ")
      return datestrings[0]+"-"+datestrings[1]+"-"+datestrings[2]
    };
    //게시글 정렬 함수(최신순, 오래된순)
    const sortData=()=>{
      const sortedData=[...tableData];
      sortedData.sort((a:any,b:any)=>{
        const dateA = new Date(changeDate(a.startDate));
        const dateB = new Date(changeDate(b.startDate));

        switch(sortValue){
          case '최신순':return dateB.getTime() - dateA.getTime();
          case '오래된순':return dateA.getTime() - dateB.getTime();
        }
        return dateB.getTime() - dateA.getTime();//기본 최신순
    });
    return sortedData
  };

    return (
        <TableContainer>
            <TableStyled>
                <thead>
                <tr>
                  <th><TableText>글 번호</TableText></th>
                  <th><TableText>제목</TableText></th>
                  <th><TableText>작성자</TableText></th>
                  <th><TableText>작성일자</TableText></th>
                </tr>
                </thead>
                <tbody>
                {tableData.length === 0 ? (
                    <tr>
                        <TableCellCenter colSpan={5}>게시글이 존재하지 않습니다.</TableCellCenter>
                    </tr>

                ) : (

                  sortData().map((row:any) => (
                        <tr
                            key={row.id}
                            onClick={() => sendDataBoard(row.id)}
                        >
                            <td>{row.id}</td>
                            <td>{row.title}</td>
                            <td>{row.userName}</td>
                            <td>{changeDate(row.startDate)}</td>
                        </tr>
                    ))
                )}
                </tbody>
            </TableStyled>
        </TableContainer>
    );
};

export default Table;