import { ReactElement } from 'react';
import { graphql, readInlineData } from 'react-relay';
import { profileModalFragment$key } from './__generated__/profileModalFragment.graphql';
import { Modal } from 'flowbite-react';

type Props = {
  userRef: any;
  show: boolean;
  onClose: () => void;
};

export default function ProfileModal({
  userRef,
  show,
  onClose,
}: Props): ReactElement {
  const userFragment = graphql`
    fragment profileModalFragment on User @inline {
      id
      username
      avatarUrl
    }
  `;

  const data = readInlineData(userFragment, userRef);

  return (
    <Modal
      dismissible={true}
      show={show}
      onClose={onClose}
      size="sm"
      className="sm:!h-full"
    >
      <Modal.Body>
        <div className="flex flex-col items-center justify-center">
          <img
            src={data?.avatarUrl}
            alt="Profile avatar"
            className="mt-8 w-32 h-32"
          />
          <span className="mt-8 mb-8 self-center whitespace-nowrap text-4xl font-normal dark:text-white">
            {data?.username}
          </span>
        </div>
      </Modal.Body>
    </Modal>
  );
}
