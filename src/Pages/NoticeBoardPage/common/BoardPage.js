// BoardPage.js
import React, {useState, useEffect} from "react";
import styled from "styled-components";
import {useNavigate} from "react-router-dom";
import Table from "./Table";
import WritingPage from "../../WritingPage/WritingPage";
import ViewWritingPage from "../../WritingPage/ViewWritingPage";
import {
    media,
    TitleLg,
    TitleMd,
    TitleSm,
    TextLg,
    TextMd,
    TextSm,
} from "../../../Components/common/Font";


const MainBody = styled.div`
  //max-width : 1184px;
  display: flex;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  margin-top: 4rem;
  
`;

const DashboardDiv = styled.div`
  flex-direction: column;
  min-width: 80%;
  background-color: white;
  border-radius: 32px;
  padding: 32px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.08);
`;

const BoardTitleDiv = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
`;

const DashboardBox = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 1rem;
`;
const Title = styled.div`
  cursor: pointer;
  padding-left: 4px;
  padding-right: 4px;
`;

////////////////버튼/////////////////////
const WritingButton = styled.button`
  width: 6rem;
  height: 2rem;
  margin: 1%;
  font-size: 1rem;
  border-radius: 1rem;
  background-color: #FF1E1E;
  color: white;
  font-weight: bold;
  border: none;
  transition: background-color 0.3s;

  /* 마우스를 가져다 대었을 때의 스타일 */

  &:hover {
    background-color: #FF7C7C;
    color: white;
    cursor: pointer;
`;




const BoardPage = ({ subTitle , tableData , writingButtonContent, projectId,postId, category }) => {
    const navigate = useNavigate();
    const [showTable, setShowTable] = useState(true);
    const [showWritingPage, setShowWritingPage] = useState(false);
    const [showViewWritingPage, setShowViewWritingPage] = useState(false);
    const [selectedRowId, setSelectedRowId] = useState("");

    useEffect(() => {
        if (postId) {
            handleRecentClick(postId);
        }
    }, [postId]);

    const goToHomePage = () => {
        navigate("/");
    };

    const goToProjectPage = () => {
        navigate(`/manage/${projectId}`);
    };

    const goToWritingPage = () => {
        setShowTable(false);
        setShowWritingPage(true);
        setShowViewWritingPage(false);
    };
    const handleRowClick = (rowId) => {
        setSelectedRowId(rowId);
        setShowTable(false);
        setShowWritingPage(false);
        setShowViewWritingPage(true);
    };
    const handleRecentClick = (postId) => {
        setSelectedRowId(postId);
        setShowTable(false);
        setShowWritingPage(false);
        setShowViewWritingPage(true);
    };

    // WritingMainPage 컴포넌트가 마운트될 때 goToWritingMainPage 함수를 자동으로 호출
    return (
        <>
            <MainBody class="MainBody">
                <DashboardDiv class="DashboardDiv">
                    <BoardTitleDiv>
                        <Title onClick={goToHomePage}>
                           <TitleSm>HOME</TitleSm>
                        </Title>
                        <Title onClick={goToProjectPage}>
                            <TextMd>> Project</TextMd>
                        </Title>
                        <Title>
                            <TextSm>> {subTitle}</TextSm>
                        </Title>
                    </BoardTitleDiv>
                    <DashboardBox>
                        {showTable ? (
                            <>
                                <Table tableData={tableData} onRowClick={handleRowClick}/>
                                <WritingButton onClick={goToWritingPage}>{writingButtonContent}</WritingButton>
                            </>
                        ) :  showWritingPage ? (
                            <WritingPage projectId={projectId} category={category}>
                            </WritingPage>
                        ) : showViewWritingPage ? (
                            <ViewWritingPage selectedRowId = {selectedRowId} projectId={projectId} postId={postId}>
                            </ViewWritingPage>
                        ) : null }
                    </DashboardBox>
                </DashboardDiv>
            </MainBody>
        </>
    );
};

export default BoardPage;