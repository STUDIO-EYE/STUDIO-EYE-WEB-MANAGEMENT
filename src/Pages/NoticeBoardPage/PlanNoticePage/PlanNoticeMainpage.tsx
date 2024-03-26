import React, {useState, useEffect} from "react";
import styled from "styled-components";
import Body from "../../../Components/common/Body";
import BoardPage from "../common/BoardPage";
import {useNavigate, useParams} from "react-router-dom";
import boardApi from "../../../api/boardApi";
import axios from "axios";

const PlanNoticeManinpage = () => {
    const {projectId, postId} = useParams();
    const navigate = useNavigate();
    const getPostsByCategory = async (category) => {
        try {
            const response = await boardApi.getBoardList(projectId, category);
            if (response.data && response.data.success === false) {
                if(response.data.code === 7000){
                    alert("로그인을 먼저 진행시켜 주시길 바랍니다.");
                    navigate("/LoginPage");
                }else if(response.data.code === 7001){
                    alert("세션이 만료되었습니다. 다시 로그인 해주세요.");
                    // 토큰 제거
                    sessionStorage.removeItem("login-token");
                    delete axios.defaults.headers.common['Authorization'];
                    navigate("/LoginPage");
                }
                return;
            }
            return response.data; // 게시글 목록을 반환
        } catch (error) {
            console.error('게시글을 불러오는 중 오류가 발생했습니다.', error);
            throw error;
        }
    };
    const subTitle = "기획";
    const writingButtonContent = "글쓰기";
    const category = "PLANNING"

    const [tableData, setTableData] = useState([]);

    const fetchData = async () => {
        try {
            const posts = await getPostsByCategory(category);
            setTableData(posts.list);
        } catch (error) {
            console.error('게시글을 불러오는 중 오류가 발생했습니다.', error);
            // 오류 처리
        }
    };

    useEffect(() => {
        fetchData();
    }, []);
    return (
        <Body>
                <BoardPage subTitle={subTitle}
                           tableData={tableData}
                           writingButtonContent={writingButtonContent}
                           projectId={projectId}
                           postId={postId}
                           category={category}/>
        </Body>
    );
};
export default PlanNoticeManinpage;