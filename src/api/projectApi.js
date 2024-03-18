import axios from "axios";

const storedToken = sessionStorage.getItem("login-token");
if (storedToken) {
  axios.defaults.headers.common["Authorization"] = "Bearer " + storedToken;
}
const projectApi = {
  // 프로젝트 완료 표시
  putProject: async (projectIndex) => {
    const response = await axios.put(`/api/projects/${projectIndex}/finish`);
    return response;
  },
  // 프로젝트 수정 (사용 안함)
  // data안에는 수정할 내용에 관한 정보가 들어있어야 함.
  updateProject: async (projectIndex, data) => {
    const response = await axios.put(`/api/projects/${projectIndex}`, data);
    return response;
  },
  // 프로젝트 삭제
  deleteProject: async (projectIndex) => {
    const response = await axios.delete(`/api/projects/${projectIndex}`);
    return response;
  },
  // 프로젝트 전체목록 조회
  getProjectList: async () => {
    const response = await axios.get(`/api/projects`);
    return response;
  },
  // 프로젝트 생성
  // data안에는 프로젝트 생성 관련 정보가 들어있어야 함.
  createProject: async (data) => {
    const response = await axios.post(`/api/projects`, data);
    return response;
  },
  getMyProjects: async () => {
    const response = await axios.get(`/api/projects/me`);
    return response;
  },
  // 핑 테스트
  pingTest: async () => {
    const response = await axios.get(`/api/projects/ping`);
    return response;
  },
};

projectApi.getProjectDetails = async (projectId) => {
  const response = await axios.get(`/api/projects/${projectId}`);
  return response;
};
projectApi.getProjectById = async (projectId) => {
  const response = await axios.get(`/api/projects/${projectId}`);
  return response;
};

export default projectApi;
