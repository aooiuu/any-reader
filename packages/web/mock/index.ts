import type { MockMethod } from 'vite-plugin-mock';

export default [
  {
    url: '/test',
    method: 'get',
    response: () => {
      return {
        code: 0,
        data: []
      };
    }
  }
] as MockMethod[];
