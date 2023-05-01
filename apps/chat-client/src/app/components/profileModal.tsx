import { ReactElement } from 'react';
import { graphql, readInlineData } from 'react-relay';
import {
  profileModalFragment$data,
  profileModalFragment$key,
} from './__generated__/profileModalFragment.graphql';
import { Avatar, Modal } from 'flowbite-react';
import { useRecoilValue } from 'recoil';
import { viewerAtom } from '../../atoms';

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
    <div>
      <Modal
        dismissible={true}
        show={show}
        onClose={onClose}
        size="sm"
        className="relative-0 w-screen h-screen sm:!h-full"
        root={document.body}
      >
        <Modal.Body>
          <div className="flex flex-col">
            <Avatar
              alt="User avatar"
              img={data?.avatarUrl}
              rounded={true}
              size="xl"
              className="mt-8"
            />
            <span className="mt-8 mb-8 self-center whitespace-nowrap text-4xl font-normal dark:text-white">
              {data?.username}
            </span>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
