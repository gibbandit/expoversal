import { ReactElement } from 'react';
import { TextInput, Button } from 'flowbite-react';
import { IoSend } from 'react-icons/io5';
import Message from './message';
import { ConnectionHandler, graphql, readInlineData } from 'relay-runtime';
import {
  useFragment,
  useRefetchableFragment,
  useSubscription,
} from 'react-relay';
import MessageInput from './messageInput';

type props = {
  threadRef: any;
};

export default function ThreadView({ threadRef }: props): ReactElement {
  const threadViewFragment = graphql`
    fragment threadViewFragment on Thread {
      id
      name
      messages(first: 100) @connection(key: "MessageList_messages") {
        edges {
          node {
            ... on Message {
              id
              content
              ...messageFragment
            }
          }
        }
      }
    }
  `;

  const threadViewSubscription = graphql`
    subscription threadViewSubscription($id: ID!, $connections: [ID!]!) {
      threadMessageUpdates(threadId: $id)
        @prependEdge(connections: $connections) {
        node {
          ... on Message {
            id
            content
            ...messageFragment
          }
        }
      }
    }
  `;

  const data = useFragment(threadViewFragment, threadRef);

  //use subscription to update messages
  function subscribeToNewMessages() {
    const connection = ConnectionHandler.getConnection(
      data.id,
      'MessageList_messages'
    );
    const subscriptionConfig = {
      subscription: threadViewSubscription,
      variables: {
        id: data.id,
        connections: [connection],
      },
    };
    return useSubscription(subscriptionConfig);
  }

  //subscribeToNewMessages();

  return (
    <div className="flex flex-grow h-full flex-col">
      <div className="flex-grow flex flex-col-reverse h-full w-full scroll-smooth overflow-y-auto overscroll-y-contain">
        {data?.messages?.edges?.map((edge: any) => {
          if (edge?.node.id === undefined) {
            return <></>;
          }
          return <Message key={edge?.node?.id} messageRef={edge?.node} />;
        })}
      </div>
      <div className="flex flex-grow" />
      <MessageInput key={data.id} currentThreadId={data.id} />
    </div>
  );
}
