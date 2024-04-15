import axios from "axios";

const storedToken = sessionStorage.getItem("login-token");
if (storedToken) {
  axios.defaults.headers.common["Authorization"] = "Bearer " + storedToken;
}

interface ProjectApi {
  putProject: (projectIndex: number) => Promise<any>;
  updateProject: (projectIndex: number, data: any) => Promise<any>;
  deleteProject: (projectIndex: number) => Promise<any>;
  getProjectList: () => Promise<any>;
  createProject: (data: any) => Promise<any>;
  getMyProjects: () => Promise<any>;
  pingTest: () => Promise<any>;
  getProjectDetails: (projectId: number) => Promise<any>;
  getProjectById: (projectId: number) => Promise<any>;
  getFileList: (projectId: number) => Promise<any>;
}

const projectApi: ProjectApi = {
  putProject: async (projectIndex: number) => {
    const response = await axios.put(`/api/projects/${projectIndex}/finish`);
    return response;
  },
  updateProject: async (projectIndex: number, data: any) => {
    const response = await axios.put(`/api/projects/${projectIndex}`, data);
    return response;
  },
  deleteProject: async (projectIndex: number) => {
    const response = await axios.delete(`/api/projects/${projectIndex}`);
    return response;
  },
  getProjectList: async () => {
    const response = await axios.get(`/api/projects`);
    return response;
  },
  createProject: async (data: any) => {
    const response = await axios.post(`/api/projects`, data);
    return response;
  },
  getMyProjects: async () => {
    const response = await axios.get(`/api/projects/me`);
    return response;
  },
  pingTest: async () => {
    const response = await axios.get(`/api/projects/ping`);
    return response;
  },
  getProjectDetails: async (projectId: number) => {
    const response = await axios.get(`/api/projects/${projectId}`);
    return response;
  },
  getProjectById: async (projectId: number) => {
    const response = await axios.get(`/api/projects/${projectId}`);
    return response;
  },
  getFileList: async (projectId: number) => {
    const response = await axios.get(`/api/projects/${projectId}/files`);
    return response;
  },

};

export default projectApi;
