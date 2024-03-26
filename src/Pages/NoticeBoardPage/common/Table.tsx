import React, { useState } from "react";
import styled from "styled-components";
import {TextLg, TextMd, TextSm} from "../../../Components/common/Font";

const TableContainer = styled.div`
  width: 100%;
  padding-bottom: 1rem;
  overflow-y: auto;
`;

const TableStyled = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th{
    text-align: left;
    padding: 16px;
    color: #DADADA;
  }
  
  th:first-child {
    width: 50%;
  }
  
  tbody tr {
    cursor: pointer;
    border: 2px solid #F8F8F8;
    &:hover {
      background-color: #FAFAFA;
    }
  }
  td {
    padding: 16px;
  }
`;

const TableCellCenter = styled.td`
  padding: 8px;
  text-align: center;
`;


const Table = ({  tableData, onRowClick }) => {

    // Table의 열을 클릭했을 때 호출될 함수
    const sendDataBoard = (rowId) => {
        onRowClick(rowId);
    };

    return (
        <TableContainer>
            <TableStyled>
                <thead>
                <tr>
                    <th><TextLg>제목</TextLg></th>
                    <th><TextLg>작성일자</TextLg></th>
                    <th><TextLg>작성자</TextLg></th>
                </tr>
                </thead>
                <tbody>
                {tableData.length === 0 ? (

                    <tr>
                        <TableCellCenter colSpan="5">게시글이 존재하지 않습니다.</TableCellCenter>
                    </tr>

                ) : (

                    tableData.map((row) => (
                        <tr
                            key={row.id}
                            onClick={() => sendDataBoard(row.id)}
                        >
                            <td>{row.title}</td>
                            <td>{row.startDate}</td>
                            <td>{row.userName}</td>
                        </tr>
                    ))
                )}
                </tbody>
            </TableStyled>
        </TableContainer>
    );
};

export default Table;