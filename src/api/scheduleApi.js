import axios from "axios";
const storedToken = sessionStorage.getItem('login-token');
if (storedToken) {
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + storedToken;
}
//schedule에 관련된 crud 작업 수행
const scheduleApi = {
  // 일정 가져오기(schedule ID를 통해 특정 일정 가져옴)
  getSchedule: async (scheduleId) => {
    const response = await axios.get(`/api/schedules/${scheduleId}`);
    return response;
  },
  // 일정 수정하기
  // data안에는 객체로 content, startDate, endDate가 들어있어야 함.
  //아마 우리 코드 중 수정은 내용만 바꾸게 할 수 있었던 것 같은데 이 경우 startdate, enddate 필요 x
  updateSchedule: async (scheduleId, data) => {
    const response = await axios.put(`/api/schedules/${scheduleId}`, data);
    return response;
  },
  // 일정 삭제하기
  deleteSchedule: async (scheduleId) => {
    const response = await axios.delete(`/api/schedules/${scheduleId}`);
    return response;
  },
  // 일정 목록 가져오기
  getScheduleList: async (projectId) => {
    const response = await axios.get(`/api/projects/${projectId}/schedules`);
    return response;
  },
  // 일정 목록 등록하기
  // data안에는 객체로 content, startDate, endDate가 들어있어야 함.
  createSchedule: async (projectId, data) => {
    const response = await axios.post(
      `/api/projects/${projectId}/schedules`,
      data
    );
    return response;
  },
};

export default scheduleApi;
