import axios, { AxiosResponse } from "axios";

const storedToken: string | null = sessionStorage.getItem('login-token');
if (storedToken) {
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + storedToken;
}

interface MyPageApi {
  getCalendarEventsByUserId: (userId: string) => Promise<AxiosResponse>;
  getTodoListByUserId: (userId: string) => Promise<AxiosResponse>;
  getBoardByUserId: (userId: string) => Promise<AxiosResponse>;
  getTodayByUserId: (userId: string) => Promise<AxiosResponse>;
}

const myPageApi: MyPageApi = {
  getCalendarEventsByUserId: async (userId) => {
    const response = await axios.get(`/api/calendar/user/${userId}`);
    return response;
  },
  
  getTodoListByUserId: async (userId) => {
    const response = await axios.get(`/api/todo/user/${userId}`);
    return response;
  },

  getBoardByUserId: async (userId) => {
    const response = await axios.get(`/api/board/user/${userId}`);
    return response;
  },
  
  getTodayByUserId: async (userId) => {
    const response = await axios.get(`/api/today/user/${userId}`);
    return response;
  },
};

export default myPageApi;
