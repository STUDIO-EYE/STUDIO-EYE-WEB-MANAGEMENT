import axios, { AxiosResponse } from "axios";

const storedToken: string | null = sessionStorage.getItem('login-token');
if (storedToken) {
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + storedToken;
}

interface CheckTodoApi {
  getCheckTodo: (todoIndex: number) => Promise<AxiosResponse>;
  updateCheckTodo: (todoIndex: number, data: { todoContent: string; todoEmergency: boolean }) => Promise<AxiosResponse>;
  deleteCheckTodo: (todoIndex: number) => Promise<AxiosResponse>;
  getProjectTodo: (projectId: number) => Promise<AxiosResponse>;
  createCheckTodo: (projectId: number, data: { todoContent: string; todoEmergency: boolean }) => Promise<AxiosResponse>;
  pingTest: () => Promise<AxiosResponse>;
  completeCheckTodo: (todoIndex: number) => Promise<AxiosResponse>;
}

const checkTodoApi: CheckTodoApi = {
  getCheckTodo: async (todoIndex) => {
    const response = await axios.get(`/api/todo/${todoIndex}`);
    return response;
  },
  updateCheckTodo: async (todoIndex, data) => {
    const response = await axios.put(`/api/todo/${todoIndex}`, data);
    return response;
  },
  deleteCheckTodo: async (todoIndex) => {
    const response = await axios.delete(`/api/todo/${todoIndex}`);
    return response;
  },
  getProjectTodo: async (projectId) => {
    const response = await axios.get(`/api/projects/${projectId}/todo`);
    return response;
  },
  createCheckTodo: async (projectId, data) => {
    const response = await axios.post(`/api/projects/${projectId}/todo`, data);
    return response;
  },
  pingTest: async () => {
    const response = await axios.get(`/api/todo/ping`);
    return response;
  },
  completeCheckTodo: async (todoIndex) => {
    const response = await axios.get(`/api/todo/finish/${todoIndex}`);
    return response;
  },
};

export default checkTodoApi;
