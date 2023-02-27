import { render } from '@testing-library/react';

import TopNavbar from './top-navbar';

describe('TopNavbar', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TopNavbar />);
    expect(baseElement).toBeTruthy();
  });
});
