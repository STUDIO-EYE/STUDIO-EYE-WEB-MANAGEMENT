import { TitleSm, TableText } from "Components/common/Font";
import myPageApi from "api/myPageApi";
import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Selector from "Components/common/Selector";
import MyTable from "./MyTable";

interface RightBoardProps {
    children: React.ReactNode;
    isEditing?: boolean;
  }

interface Post{
    category:string,
    id:number,
    title:string,
    updatedDate:Date,
    userName:string,
    page:number,
}

const MyBoard=(project:any)=>{
    const [postData, setPostData] = useState<Post[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const postPerPage = 3;
    const indexOfLastPost = currentPage * postPerPage;
    const indexOfFirstPost = indexOfLastPost - postPerPage;
    const currentPosts = postData.slice(
        indexOfFirstPost,
        indexOfLastPost
    );

    useEffect(() => {
        const fetchPosts = async () => {
          try {
            const postResponse = await myPageApi.getBoardPost(project.project.projectId);
            if (postResponse.data && postResponse.data.success) {
                setPostData(postResponse.data.list);
            } else if (postResponse.data.code === 7001) {
              sessionStorage.removeItem("login-token");
              delete axios.defaults.headers.common["Authorization"];
              return;
            }
        }catch(error){
            console.error("Error fetching myPage posts:", error);
        }}
        fetchPosts();
    }, [project.project.projectId]);

    const handleRowClick=()=>{
        // setSelectedRowId(rowId);
        // setShowTable(false);
        // setShowWritingPage(false);
        // setShowViewWritingPage(true);
    }

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
    const PageNumbers = () => {
        const totalPages = Math.ceil(postData.length / postPerPage);
        return (
          <PaginationContainer>
            <nav>
              <ul className="pagination">
                {currentPage > 1 && (
                  <li className="page-item">
                    <a
                      onClick={() => paginate(currentPage - 1)}
                      className="page-link"
                    >
                      &laquo;
                    </a>
                  </li>
                )}
    
                <li className="page-item active">
                  <a className="page-link">{currentPage}</a>
                </li>
    
                {currentPage < totalPages && (
                  <li className="page-item">
                    <a
                      onClick={() => paginate(currentPage + 1)}
                      className="page-link"
                    >
                      &raquo;
                    </a>
                  </li>
                )}
              </ul>
            </nav>
          </PaginationContainer>
        );
      };
    

    return (
        <RightboardBody>
        <BoardTitleDiv>
            {/**click 이벤트 연결할 것, project page로 이동하기*/}
            <BoardTitleText><TitleSm>{project.project.name}</TitleSm></BoardTitleText>
        </BoardTitleDiv>
        <BoardContentDiv>
            <MyTable tableData={currentPosts} onRowClick={handleRowClick}/>
            <PageNumbers/>
        </BoardContentDiv>
        </RightboardBody>
    );
};

export default MyBoard;

const RightboardBody = styled.div<RightBoardProps>`
  width: 90%;
  margin-bottom: 1rem;
  margin-left: 2rem;
  flex-direction: column;
  background-color: white;
  overflow: hidden;
  transition: height 0.3s ease-in-out;
  flex: 1;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
  ${(props) => props.isEditing && "margin-bottom: 100px;"}
`;

const BoardTitleDiv = styled.div`
  display: flex;
  text-align: center;
  margin: 20px 20px 0px 20px;
  height: 20%;
`;
const BoardTitleText=styled.div`
cursor:pointer;
&:hover{
  opacity:0.5;
}
`;

const BoardContentDiv = styled.div`
  text-align: center;
  width: 100%;
  margin: 0px 10px 0px 10px;
`;

const PaginationContainer = styled.div`
margin:-5px 0px;
  .pagination {
    list-style-type: none;
    display: flex;
    justify-content: center;
    padding: 0;
  }
  .page-item {
    margin: 0 5px;
    cursor: pointer;
  }
  .page-link {
    color: black;
    text-decoration: none;
  }
  .active .page-link {
    font-weight: bold;
  }
`;