import { render } from '@testing-library/react';

import ThreadListCard from './thread-list-card';

describe('ThreadListCard', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ThreadListCard />);
    expect(baseElement).toBeTruthy();
  });
});
