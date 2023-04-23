import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

import { RelayEnvironmentProvider } from 'react-relay';
import { RelayEnvironment } from './relay';

import App from './app/app';

/*
  import components from the library @expoversal/chat-client-components
  keep this application minimal
*/

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <RelayEnvironmentProvider environment={RelayEnvironment}>
      <App />
    </RelayEnvironmentProvider>
  </StrictMode>
);
