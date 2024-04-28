import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {TextLg, TextMd, TextSm, media} from "../../Components/common/Font";

const TableContainer = styled.div`
  width: 100%;
  overflow-y: auto;
`;

const TableStyled = styled.table`
  width: 95%;
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

const TableText=styled.span`
  white-space:nowrap;
  font-size: 0.8rem;
  font-weight: 600;
  color: black;

  @media ${media.half}{
    font-size: 0.9rem;
  }
`;

const TableCellCenter = styled.td`
  padding: 3px;
  text-align: center;
  colSpan:${props=>props.colSpan};
`;
const TableCell=styled.td`
text-align:left;
`;

interface pageData{
    p:number,
    data:any[]
}

const MyTable = ({  tableData, onRowClick }
  :{tableData:any, onRowClick:any}) => {

    // Table의 열을 클릭했을 때 호출될 함수
    const sendDataBoard = (rowId:number) => {
      onRowClick(rowId);
    };
    // 날짜 형식 변경
    const changeDate=(date: string) :string=>{
    //   date=date.replaceAll(/년|월|일/gi,"")
      let datestrings:string[]=date.split("T")
      return datestrings[0]
    };

    const sortData=()=>{
        const sortedData=[...tableData];
        sortedData.sort((a:any,b:any)=>{
          const dateA = new Date(a.updatedDate);
          const dateB = new Date(b.updatedDate);
          return dateB.getTime() - dateA.getTime();//기본 최신순
      });
      return sortedData
    };

    return (
        <TableContainer>
            <TableStyled>
                <thead>
                <tr>
                  <th><TableText>카테고리</TableText></th>
                  <th><TableText>제목</TableText></th>
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
                        <>
                        <tr
                            key={row.id}
                            onClick={() => 
                                sendDataBoard(row.id)
                            }
                        >
                            <TableCell><text style={{fontSize:'0.8rem'}}>{row.category}</text></TableCell>
                            <TableCell>{row.title}</TableCell>
                            <TableCell>{changeDate(row.updatedDate)}</TableCell>
                        </tr>
                        </>
                    ))
                )
                }
                </tbody>
            </TableStyled>
        </TableContainer>
    );
};

export default MyTable;