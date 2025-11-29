export type PaginatedListParameters = {
  keywords?: string;
  page?: number;
  pageSize?: number;
};

export type PaginatedList<T> = {
  CurrentPage: number;
  Items: T[];
  TotalPages: number;
  TotalItems: number;
};
