import axios, { AxiosResponse } from "axios";

const storedToken: string | null = sessionStorage.getItem('login-token');
if (storedToken) {
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + storedToken;
}

interface ScheduleApi {
  getSchedule: (scheduleId: number) => Promise<AxiosResponse>;
  updateSchedule: (scheduleId: number, data: any) => Promise<AxiosResponse>;
  deleteSchedule: (scheduleId: number) => Promise<AxiosResponse>;
  getScheduleList: (projectId: number) => Promise<AxiosResponse>;
  createSchedule: (projectId: number, data: any) => Promise<AxiosResponse>;
}

const scheduleApi: ScheduleApi = {
  getSchedule: async (scheduleId) => {
    const response = await axios.get(`/api/schedules/${scheduleId}`);
    return response;
  },
  updateSchedule: async (scheduleId, data) => {
    const response = await axios.put(`/api/schedules/${scheduleId}`, data);
    return response;
  },
  deleteSchedule: async (scheduleId) => {
    const response = await axios.delete(`/api/schedules/${scheduleId}`);
    return response;
  },
  getScheduleList: async (projectId) => {
    const response = await axios.get(`/api/projects/${projectId}/schedules`);
    return response;
  },
  createSchedule: async (projectId, data) => {
    const response = await axios.post(`/api/projects/${projectId}/schedules`, data);
    return response;
  },
};

export default scheduleApi;
