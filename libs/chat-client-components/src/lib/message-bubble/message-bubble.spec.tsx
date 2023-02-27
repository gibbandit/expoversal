import { render } from '@testing-library/react';

import MessageBubble from './message-bubble';

describe('MessageBubble', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MessageBubble />);
    expect(baseElement).toBeTruthy();
  });
});
