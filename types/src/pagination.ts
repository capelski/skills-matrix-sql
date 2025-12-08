export type PaginatedListParameters = {
  keywords?: string;
  page?: string;
  pageSize?: string;
};

export type PaginatedList<T> = {
  CurrentPage: number;
  Items: T[];
  TotalPages: number;
  TotalItems: number;
};
