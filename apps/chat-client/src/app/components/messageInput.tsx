import { ChangeEvent, ReactElement } from 'react';
import { IoSend } from 'react-icons/io5';
import { Button, Spinner, TextInput } from 'flowbite-react';
import { ConnectionHandler, graphql } from 'relay-runtime';
import { useMutation } from 'react-relay';
import { atom, useRecoilState } from 'recoil';

type Props = {
  currentThreadId: string;
};

export default function MessageInput({ currentThreadId }: Props): ReactElement {
  const newMessageMutation = graphql`
    mutation messageInputMessageCreateMutation(
      $input: MessageCreateInput!
      $connections: [ID!]!
    ) {
      messageCreate(input: $input) {
        messageEdge @prependEdge(connections: $connections) {
          node {
            ...messageFragment
          }
        }
      }
    }
  `;

  const [commitNewMessageMutation, newMessageInFlight] =
    useMutation(newMessageMutation);

  const messageInputAtom = atom({
    key: `messageInput_${currentThreadId}`,
    default: '',
  });

  const [messageInput, setMessageInput] = useRecoilState(messageInputAtom);

  async function onSend() {
    const connectionID = ConnectionHandler.getConnectionID(
      currentThreadId,
      'MessageList_messages'
    );
    commitNewMessageMutation({
      variables: {
        input: {
          threadId: currentThreadId,
          content: messageInput,
        },
        connections: [connectionID],
      },
    });
    setMessageInput('');
  }

  function onChangeMessageInput(event: ChangeEvent<HTMLInputElement>) {
    setMessageInput(event.target.value);
  }

  async function onKeydown(event: { key: string }) {
    if (event.key === 'Enter' && messageInput != '') {
      onSend();
    }
  }

  return (
    <div className="flex flex-row w-full items-center border-t border-gray-200">
      <div className="flex flex-grow p-4">
        <TextInput
          className="w-full"
          onChange={onChangeMessageInput}
          onKeyDown={onKeydown}
          value={messageInput}
        />
      </div>
      <div className="p-4 pl-0 w-20">
        {!newMessageInFlight ? (
          <Button
            color="gray"
            pill={true}
            outline={true}
            onClick={onSend}
            disabled={messageInput == ''}
            className="w-full"
          >
            <IoSend />
          </Button>
        ) : (
          <Spinner className="w-full" />
        )}
      </div>
    </div>
  );
}
