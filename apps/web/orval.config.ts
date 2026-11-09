import { defineConfig } from 'orval';

export default defineConfig({
  myApi: {
    input: {
      target: './api/bmstu-actibank-spec.json',
    },
    output: {
      target: './src/shared/api/openapi/client.ts',
      schemas: './src/shared/api/openapi/model',
      client: 'react-query',
      httpClient: 'fetch',
      mode: 'single',
      mock: false,
      clean: true,
      override: {
        mutator: {
          path: './src/shared/api/http-client.ts',
          name: 'customFetch'
        }
      }
    },
  },
});
