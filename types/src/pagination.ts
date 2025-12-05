export interface PaginatedListParameters {
  keywords?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedList<T> {
  CurrentPage: number;
  Items: T[];
  TotalPages: number;
  TotalItems: number;
}
