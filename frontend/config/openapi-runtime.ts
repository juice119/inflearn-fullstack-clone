import { CreateClientConfig } from '@/generated/openapi.ts/client';

const API_URL = process.env.API_URL || 'http://localhost:8000';

export const createClientConfig: CreateClientConfig = (config) => ({
  ...config,
  baseUrl: API_URL,
});
