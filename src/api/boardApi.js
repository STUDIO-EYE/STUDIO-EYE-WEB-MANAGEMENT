import axios from "axios";
const storedToken = sessionStorage.getItem('login-token');
if (storedToken) {
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + storedToken;
}
// 게시글 crud api
const boardApi = {
  // 계획 최신 3개 불러오기
  getPlanningDashboard: async (projectId) => {
    const response = await axios.get(
        `/api/project/${projectId}/posts/recent?category=PLANNING`
    );
    return response;
  },
  // 제작 최신 3개 불러오기
  getProductionDashboard: async (projectId) => {
    const response = await axios.get(
        `/api/project/${projectId}/posts/recent?category=PRODUCTION`
    );
    return response;
  },
  // 편집 최신 3개 불러오기
  getEditingDashboard: async (projectId) => {
    const response = await axios.get(
        `/api/project/${projectId}/posts/recent?category=EDITING`
    );
    return response;
  },
  // 게시글 작성
  postBoard: async (data) => {
    const response = await axios.post('/api/posts', data);
    return response;
  },
  // 게시글 수정
  putBoard: async (data) => {
    const response = await axios.put('/api/posts', data);
    return response;
  },
  // 게시글 삭제
  deleteBoard: async (data) => {
    const response = await axios.delete('/api/posts', data);
    return response;
  },
  // 게시글 상세보기
  getBoard: async (data) => {
    const response = await axios.get(`/api/posts?projectId=${data.projectId}&postId=${data.postId}`);
    return response;
  },
  // 게시글 리스트 가져오기 기획/편집/제작 카테고리 별로.
  getBoardList: async (projectId, category) => {
    const response = await axios.get(`/api/project/${projectId}/posts/all?category=${category}`);
    return response;
  },
};

export default boardApi;
