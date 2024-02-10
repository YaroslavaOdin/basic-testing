import { throttledGetDataFromApi } from './index';

const axios = jest.requireActual('axios');

jest.mock('lodash', () => {
  const originalModule = jest.requireActual('lodash');

  return {
    __esModule: true,
    ...originalModule,
    throttle: jest.fn((func) => func),
  };
});

const path = 'path';
const data = 'data';

describe('throttledGetDataFromApi', () => {
  beforeEach(() => {
    axios.create = jest.fn(() => ({
      get: jest.fn(() => Promise.resolve({ data: data })),
    }));
  });

  test('should create instance with provided base url', async () => {
    await throttledGetDataFromApi(path);
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    const mock = jest.fn().mockResolvedValue({ data: data });
    axios.create = jest.fn(() => ({
      get: mock,
    }));

    await throttledGetDataFromApi(path);

    expect(mock).toHaveBeenCalledWith(path);
  });

  test('should return response data', async () => {
    expect(await throttledGetDataFromApi(path)).toBe(data);
  });
});
