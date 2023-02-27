import { render } from '@testing-library/react';

import ThreadMessageScroll from './thread-message-scroll';

describe('ThreadMessageScroll', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ThreadMessageScroll />);
    expect(baseElement).toBeTruthy();
  });
});
