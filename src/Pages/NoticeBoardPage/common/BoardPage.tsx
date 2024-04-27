// BoardPage.js
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
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
    TableText,
} from "../../../Components/common/Font";
import Rectangle from "Components/common/Rectangle_shadow4";
import CommentPage from "Pages/WritingPage/CommentPage";
import writeBtnImg from "../../../assets/drawable/WriteButton.svg";
import Dropdown from "Components/common/Selector";
import Selector from "Components/common/Selector";
import DashboardBody from "Components/common/DashboardBody";


const MainBody = styled.div`
  max-width : 100%;
  display: flex;
  align-items: left;
  flex-direction: column;
  height: 100vh;
  padding: 0 2rem;
  class:${props => props.className};
`;

const DashboardDiv = styled.div`
  flex-direction: column;
  min-width: 80%;
  background-color: white;
  border-radius: 32px;
  padding: 32px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.08);
`;

const DashboardBox = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 1rem;
`;

const Title = styled(TitleSm)`
  width:max-content;
  cursor: pointer;
  padding-left: 4px;
  padding-right: 4px;
  margin-bottom:1rem;
  display:flex;
`;

const WriteButton = styled.button`
  background-image:url(${writeBtnImg});
  background-size: cover;
  border:none;
  background-color: white;
  width: 1rem;
  height: 1rem;
  margin:0 0.5rem;

  &:hover {
    cursor: pointer;
  }
`;


const BoardPage = ({ subTitle, tableData, fetchTable, writingButtonContent, projectId, postId, category }
    : { subTitle: string, tableData: any, fetchTable: any, writingButtonContent: string, projectId: number, postId: number, category: string }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const projectInfo = { ...location.state };

    const [showTable, setShowTable] = useState(true);
    const [showWritingPage, setShowWritingPage] = useState(false);
    const [showViewWritingPage, setShowViewWritingPage] = useState(false);
    const [selectedRowId, setSelectedRowId] = useState(0);
    const SORT_LIST = [
        '최신순',
        '오래된 순'];
    const [selectedSortValue, setSelectedSortValue] = useState('최신순');

    useEffect(() => {
        if (postId) {
            handleRecentClick(postId);
        }
    }, [postId]);

    useEffect(() => {
        //처음에만 실행하는 useEffect
        //writring이 넘어오면 실행
        if (projectInfo && projectInfo.writing) {
            setShowTable(false);
            setShowWritingPage(true);
            setShowViewWritingPage(false);
        }
    }, [])

    const goToHomePage = () => {
        navigate("/");
    };

    const goToProjectPage = () => {
        navigate(`/manage/${projectId}`, { state: { name: projectInfo.name } });
    };

    const goToWritingPage = () => {
        setShowTable(false);
        setShowWritingPage(true);
        setShowViewWritingPage(false);
    };
    const goToBoardPage = () => {
        setShowTable(true);
        setShowWritingPage(false);
        setShowViewWritingPage(false);
    };
    const handleRowClick = (rowId: any) => {
        setSelectedRowId(rowId);
        setShowTable(false);
        setShowWritingPage(false);
        setShowViewWritingPage(true);
    };
    const handleRecentClick = (postId: any) => {
        setSelectedRowId(postId);
        setShowTable(false);
        setShowWritingPage(false);
        setShowViewWritingPage(true);
    };
    const handleSortValue = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedSortValue(e.target.value)
    }

    // WritingMainPage 컴포넌트가 마운트될 때 goToWritingMainPage 함수를 자동으로 호출
    return (
        <>
            <DashboardBody>
                <MainBody className="MainBody">
                    <Title>
                        {
                            showWritingPage ? (
                                <div>글쓰기</div>
                            ) : (
                                <>
                                    <div onClick={goToProjectPage}>{projectInfo.name}&nbsp;</div>
                                    <div onClick={goToBoardPage}>{subTitle} 게시판</div>
                                </>
                            )
                        }

                    </Title>
                    <div className="content" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Rectangle className="DashboardDiv" width={!showViewWritingPage ? '100%' : '60%'} margin="0 0.5rem 0.5rem 0">
                            <DashboardBox>
                                {showTable ? (
                                    <>
                                        <div style={{ width: '100%', flexDirection: 'row', justifyContent: 'center' }}>
                                            <TableText style={{ marginRight: '0.2rem' }}>프로젝트 {subTitle}
                                                <WriteButton onClick={goToWritingPage} />
                                            </TableText>
                                            <Selector width={'4rem'} onChange={handleSortValue}>
                                                <option value='최신순'>최신순</option>
                                                <option value='오래된순'>오래된순</option>
                                            </Selector>
                                        </div>
                                        <Table tableData={tableData} fetchTable={fetchTable} onRowClick={handleRowClick} sortValue={selectedSortValue} />
                                    </>
                                ) : showWritingPage ? (
                                    <WritingPage projectId={projectId} category={category} onBack={goToBoardPage} />
                                ) : showViewWritingPage ? (
                                    <ViewWritingPage selectedRowId={selectedRowId} projectId={projectId} postId={postId} />
                                ) : null}
                            </DashboardBox>
                        </Rectangle>
                        {
                            showViewWritingPage ? (
                                <Rectangle className="CommentDiv" width={"30%"}>
                                    <CommentPage selectedRowId={selectedRowId} projectId={projectId} postId={postId} />
                                </Rectangle>
                            ) : null
                        }
                    </div>
                </MainBody>
            </DashboardBody>
        </>
    );
};

export default BoardPage;