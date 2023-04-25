import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import { RecoilRelayEnvironmentProvider } from 'recoil-relay';

import { relayEnvironment, recoilEnvironmentKey } from './relay';

import App from './app/app';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <RecoilRoot>
      <RecoilRelayEnvironmentProvider
        environment={relayEnvironment}
        environmentKey={recoilEnvironmentKey}
      >
        <App />
      </RecoilRelayEnvironmentProvider>
    </RecoilRoot>
  </StrictMode>
);
