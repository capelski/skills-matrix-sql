import { QueryStringBase } from '@typed-web-api/common';

export interface PaginatedListParameters extends QueryStringBase {
  keywords?: string;
  page?: string;
  pageSize?: string;
}

export interface PaginatedList<T> {
  CurrentPage: number;
  Items: T[];
  TotalPages: number;
  TotalItems: number;
}
