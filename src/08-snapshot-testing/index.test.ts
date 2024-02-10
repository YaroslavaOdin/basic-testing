import { generateLinkedList } from './index';

describe('generateLinkedList', () => {
  const listValues = [1, 2, 3];

  test('should generate linked list from values 1', () => {
    expect(generateLinkedList(listValues)).toStrictEqual({
      value: 1,
      next: {
        value: 2,
        next: {
          value: 3,
          next: {
            next: null,
            value: null,
          },
        },
      },
    });
  });

  test('should generate linked list from values 2', () => {
    expect(generateLinkedList(listValues)).toMatchSnapshot();
  });
});
