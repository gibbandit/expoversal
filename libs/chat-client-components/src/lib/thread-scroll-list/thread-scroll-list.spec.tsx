import { render } from '@testing-library/react';

import ThreadScrollList from './thread-scroll-list';

describe('ThreadScrollList', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ThreadScrollList />);
    expect(baseElement).toBeTruthy();
  });
});
