import axios from "axios";
const storedToken = sessionStorage.getItem('login-token');
if (storedToken) {
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + storedToken;
}
// 체크리스트 crud api
const checkTodoApi = {
  // 할일 선택 조회 (없애도됌)
  getCheckTodo: async (todoIndex) => {
    const response = await axios.get(`/api/todo/${todoIndex}`);
    return response;
  },
  // 할일 업데이트
  // data안에는 객체로 todoContent, todoEmergency가들어있어야 함.(없애도됌)
  updateCheckTodo: async (todoIndex, data) => {
    const response = await axios.put(`/api/todo/${todoIndex}`, data);
    return response;
  },
  // 할일 삭제
  deleteCheckTodo: async (todoIndex) => {
    const response = await axios.delete(`/api/todo/${todoIndex}`);
    return response;
  },
  // 할일 조회
  getProjectTodo: async (projectId) => {
    const response = await axios.get(
      `/api/projects/${projectId}/todo`
    );
    return response;
  },
  // 할일 등록
  // data안에는 객체로 todoContent, todoEmergency가들어있어야 함.
  createCheckTodo: async (projectId, data) => {
    const response = await axios.post(
      `/api/projects/${projectId}/todo`,
      data
    );
    return response;
  },
  // ping test (이건 안해도 괜춘)
  pingTest: async () => {
    const response = await axios.get(`/api/todo/ping`);
    return response;
  },
  // 할일 완료 표시
  completeCheckTodo: async (todoIndex) => {
    const response = await axios.get(`/api/todo/finish/${todoIndex}`);
    return response;
  },
};

export default checkTodoApi;
