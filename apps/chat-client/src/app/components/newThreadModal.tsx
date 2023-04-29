import { ReactElement } from 'react';
import { Button, Label, Modal, TextInput } from 'flowbite-react';
import { init } from '@paralleldrive/cuid2';
import { graphql } from 'relay-runtime';

type Props = {
  show: boolean;
  onClose: () => void;
};

const cuid = init({
  length: 25,
});

export default function NewThreadModal({ show, onClose }: Props): ReactElement {
  /* const newThreadMutation = graphql`
    mutation threadCreate($input: threadInput!) {
      threadCreate(input: $input) {
        id
        createdAt
        name
      }
    }
  `;
 */
  return (
    <Modal
      dismissible={true}
      show={show}
      size="sm"
      className="sm:!h-full"
      onClose={onClose}
    >
      <Modal.Header>
        <span className="text-2xl font-bold">New Thread</span>
      </Modal.Header>
      <Modal.Body className="p-8">
        <div className="pb-2 block">
          <Label htmlFor="threadName" value="name for new thread" />
        </div>
        <TextInput id="threadName" />
      </Modal.Body>
      <Modal.Footer>
        <div className="flex flex-grow flex-row-reverse gap-4">
          <Button>create</Button>
          <Button color="gray" onClick={onClose}>
            cancel
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
