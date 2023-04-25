import { ReactElement } from 'react';
import { graphql } from 'react-relay';
import { graphQLSelector } from 'recoil-relay';
import { recoilEnvironmentKey } from '../../relay';
import { useRecoilValue } from 'recoil';
import { chatViewQuery$data } from './__generated__/chatViewQuery.graphql';
import Threadbar from './threadbar';
import ThreadView from './threadView';

export default function ChatView(): ReactElement {
  const chatViewQuery = graphQLSelector({
    key: 'chatViewQuery',
    environment: recoilEnvironmentKey,
    query: graphql`
      query chatViewQuery {
        ...threadbarFragment
      }
    `,
    variables: {},
    mapResponse: (data) => data,
  });

  const data: chatViewQuery$data = useRecoilValue(chatViewQuery);

  return (
    <div className="overflow-auto flex flex-row flex-grow">
      <Threadbar threadsRef={data} />
      <ThreadView />
    </div>
  );
}
