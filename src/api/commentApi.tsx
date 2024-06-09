import axios, { AxiosResponse } from "axios";

const storedToken: string | null = sessionStorage.getItem('login-token');
if (storedToken) {
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + storedToken;
}

interface CommentApi {
  postComment: (postId: number, data: any) => Promise<AxiosResponse>;
  putComment: (commentId: number, data: any) => Promise<AxiosResponse>;
  deleteComment: (commentId: number) => Promise<AxiosResponse>;
  getCommentList: (postId: number, page: number, pageSize: number) => Promise<AxiosResponse>;
}

const commentApi: CommentApi = {
  postComment: async (postId, data) => {
    const response = await axios.post(`/api/posts/${postId}/comment`, data);
    return response;
  },
  putComment: async (commentId, data) => {
    const response = await axios.put(`/api/comment/${commentId}`, data);
    return response;
  },
  deleteComment: async (commentId) => {
    const response = await axios.delete(`/api/comment/${commentId}`);
    return response;
  },
  getCommentList: async (postId, page = 0, pageSize = 5) => {
    const params: any = {};
    if (page !== 0) params.page = page + 1; // 1을 더해서 1부터 시작하도록 변경
    if (pageSize !== 5) params.size = pageSize;

    const response = await axios.get(`/api/posts/${postId}/comments`, { params });
    return response;
},

};

export default commentApi;
