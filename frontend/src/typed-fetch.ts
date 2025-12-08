import { WebApiEndpoints } from '@skills-matrix/types';
import { getTypedFetch } from '@typed-web-api/client';

const API_BASE_URL = 'http://localhost:3000/api';

export const typedFetch = getTypedFetch<WebApiEndpoints>({ baseUrl: API_BASE_URL });
