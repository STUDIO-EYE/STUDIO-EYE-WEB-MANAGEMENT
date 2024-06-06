export interface Comment {
  id: number;
  userName: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  isNew: boolean;
}

export interface ICommentPaginationData<T> {
  content: T[];
  pageable: {
    sort: any[];
    pageNumber: number;
    pageSize: number;
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  pageSize: number;
  number: number;
  sort: any[];
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}