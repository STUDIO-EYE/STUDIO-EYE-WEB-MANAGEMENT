import axios, { AxiosResponse } from "axios";

const storedToken: string | null = sessionStorage.getItem('login-token');
if (storedToken) {
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + storedToken;
}

interface MyPageApi {
  getCalendarEvents: () => Promise<AxiosResponse>;
  getCalendarEventDetail:(userScheduleId:number)=>Promise<AxiosResponse>;
  deleteCalendarEvent: (userScheduleId: number)=>Promise<AxiosResponse>;
  postCalendarEvent:(data:any)=>Promise<AxiosResponse>;
  putCalendarEventByUserId:(userScheduleId:number, data:any)=>Promise<AxiosResponse>;

  getTodoList: () => Promise<AxiosResponse>;
  deleteTodo: (userTodoId:number)=>Promise<AxiosResponse>;
  updateToto: (userTodoId:number,data:any)=>Promise<AxiosResponse>;
  createTodo: (data:any)=>Promise<AxiosResponse>;
  checkTodo:(userTodoId:number)=>Promise<AxiosResponse>;

  getBoardByUserId: () => Promise<AxiosResponse>;
  getBoardPost:(projectId:number)=>Promise<AxiosResponse>;
}

const myPageApi: MyPageApi = {
  getCalendarEvents: async () => {
    const response = await axios.get(`/api/userSchedules`);
    return response;
  },
  getCalendarEventDetail: async (userScheduleId) => {
    const response = await axios.get(`/api/userSchedules/${userScheduleId}`);
    return response;
  },
  deleteCalendarEvent: async (userScheduleId) => {
    const response = await axios.delete(`/api/userSchedules/${userScheduleId}`);
    return response;
  },
  postCalendarEvent: async (data) => {
    const response = await axios.post(`/api/userSchedules`, data);
    return response;
  },
  putCalendarEventByUserId: async (userScheduleId, data) => {
    const response = await axios.put(`/api/userSchedules/${userScheduleId}`, data);
    return response;
  },


  getTodoList: async () => {
    const response = await axios.get(`/api/userTodo`);
    return response;
  },
  deleteTodo: async (userTodoId: number) => {
    const response = await axios.delete(`/api/userTodo/${userTodoId}`);
    return response;
  },
  updateToto: async (userTodoId, data) => {
    const response = await axios.put(`/api/userTodo/${userTodoId}`, data);
    return response;
  },
  createTodo: async (data) => {
    console.log(sessionStorage.getItem('login-token'));
    const response = await axios.post(`/api/userTodo`, data);
    return response;
  },
  checkTodo: async (userTodoId) => {
    console.log(sessionStorage.getItem('login-token'));
    const response = await axios.patch(`/api/userTodo/checking/${userTodoId}`);
    return response;
  },

  getBoardByUserId: async () => {
    const response = await axios.get(`/api/projects/me`);
    return response;
  },
  getBoardPost: async (projectId: number)=>{
    const response=await axios.get(`/api/project/${projectId}/myPosts`);
    return response;
  }
};

export default myPageApi;
