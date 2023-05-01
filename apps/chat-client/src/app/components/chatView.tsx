import { ReactElement } from 'react';
import { graphql } from 'react-relay';
import { graphQLSelector } from 'recoil-relay';
import { recoilEnvironmentKey } from '../../relay';
import { atom, useRecoilState, useRecoilValue } from 'recoil';
import { chatViewQuery$data } from './__generated__/chatViewQuery.graphql';
import Threadbar, { ThreadbarItem } from './threadbar';
import ThreadView from './threadView';
import ThreadPlaceHolder from './threadPlaceholder';

export default function ChatView(): ReactElement {
  const chatViewQuery = graphQLSelector({
    key: 'chatViewQuery',
    environment: recoilEnvironmentKey,
    query: graphql`
      query chatViewQuery {
        threads(first: 100) @connection(key: "ThreadList_threads") {
          ...newThreadModalFragment
          edges {
            node {
              ... on Thread {
                id
                name
                ...threadbarItemFragment
                ...threadViewFragment
              }
            }
          }
        }
      }
    `,
    variables: {},
    mapResponse: (data) => data,
  });

  const data: chatViewQuery$data = useRecoilValue(chatViewQuery);

  const activeThreadIdAtom = atom({
    key: 'activeThreadIdKey',
    default: '',
  });

  const activeThreadAtom = atom({
    key: 'activeThreadKey',
    default: null,
  });

  const [activeThreadId, setActiveThreadId] =
    useRecoilState(activeThreadIdAtom);

  const [activeThread, setActiveThread] = useRecoilState(activeThreadAtom);

  function onClickThread(thread: any) {
    setActiveThreadId(thread.id);
    setActiveThread(thread);
  }

  function threadIsActive(threadId: string): boolean {
    return threadId === activeThreadId;
  }

  return (
    <div className="flex h-full flex-row flex-grow">
      <Threadbar connectionRef={data.threads}>
        {data?.threads?.edges?.map((edge) => {
          if (edge?.node.id === undefined) {
            return <></>;
          }
          return (
            <ThreadbarItem
              threadRef={edge?.node}
              onClick={() => onClickThread(edge.node)}
              active={threadIsActive(edge?.node.id)}
            />
          );
        })}
      </Threadbar>
      {activeThreadId ? (
        <ThreadView threadRef={activeThread} />
      ) : (
        <ThreadPlaceHolder />
      )}
    </div>
  );
}
