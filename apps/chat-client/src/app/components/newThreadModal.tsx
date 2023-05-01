import { ChangeEvent, ReactElement, useRef } from 'react';
import { Button, Label, Modal, TextInput } from 'flowbite-react';
import {
  ConnectionHandler,
  commitMutation,
  graphql,
  readInlineData,
} from 'relay-runtime';
import { useMutation } from 'react-relay';
import { atom, useRecoilState } from 'recoil';

type Props = {
  connectionRef: any;
  show: boolean;
  onClose: () => void;
};

export default function NewThreadModal({
  connectionRef,
  show,
  onClose,
}: Props): ReactElement {
  const newthreadModalFragment = graphql`
    fragment newThreadModalFragment on QueryThreadsConnection @inline {
      __id
    }
  `;

  const data = readInlineData(newthreadModalFragment, connectionRef);

  const newThreadMutation = graphql`
    mutation newThreadModalThreadCreateMutation(
      $input: ThreadCreateInput!
      $connections: [ID!]!
    ) {
      threadCreate(input: $input) {
        threadEdge @prependEdge(connections: $connections) {
          node {
            ... on Thread {
              id
              createdAt
              name
            }
          }
        }
      }
    }
  `;

  const [commitNewThreadMutation] = useMutation(newThreadMutation);

  const threadNameInputAtom = atom({
    key: 'threadnameInput',
    default: '',
  });

  const [threadNameInput, setThreadNameInput] =
    useRecoilState(threadNameInputAtom);

  async function onCreate() {
    commitNewThreadMutation({
      variables: {
        input: {
          name: threadNameInput,
        },
        connections: [data.__id],
      },
    });
    closeModal();
  }

  function onChangeThreadNameInput(event: ChangeEvent<HTMLInputElement>) {
    setThreadNameInput(event.target.value);
  }

  function closeModal() {
    setThreadNameInput('');
    onClose();
  }

  return (
    <Modal
      dismissible={true}
      show={show}
      size="sm"
      className="sm:!h-full"
      onClose={closeModal}
      root={document.body}
    >
      <Modal.Header>
        <span className="text-2xl font-bold">new thread</span>
      </Modal.Header>
      <Modal.Body className="p-8">
        <div className="pb-2 block">
          <Label htmlFor="threadName" value="name for new thread" />
          <TextInput
            id="threadName"
            type="text"
            onChange={onChangeThreadNameInput}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="flex flex-grow flex-row-reverse gap-4">
          <Button onClick={onCreate}>create</Button>
          <Button color="gray" onClick={closeModal}>
            cancel
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
