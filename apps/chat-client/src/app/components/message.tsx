import { ReactElement } from 'react';
import { graphql, readInlineData } from 'react-relay';
import { messageFragment$key } from './__generated__/messageFragment.graphql';
import ProfileModal from './profileModal';
import { atom, useRecoilState } from 'recoil';
import { Avatar } from 'flowbite-react';

type Props = {
  messageRef: any;
};

export default function Message({ messageRef }: Props): ReactElement {
  const messageFragment = graphql`
    fragment messageFragment on Message @inline {
      id
      createdAt
      createdUser {
        id
        username
        avatarUrl
        ...profileModalFragment
      }
      content
    }
  `;

  const modalAtom = atom({
    key: 'profileModal',
    default: false,
  });

  const [showModal, setShowModal] = useRecoilState(modalAtom);

  function onCloseModal() {
    setShowModal(false);
  }

  const data = readInlineData(messageFragment, messageRef);

  return (
    <>
      <ProfileModal
        userRef={data?.createdUser}
        show={showModal}
        onClose={onCloseModal}
      />
      <div className="flex flex-grow flex-row w-full pt-1 pb-1" id={data?.id}>
        <Avatar
          alt="User avatar"
          img={data.viewer?.avatarUrl}
          className="self-center pl-4 w-16 h-16"
          rounded={true}
        />
        <div className="self-center flex flex-col">
          <div>
            <span className="pl-4 text-md font-medium">
              {data?.createdUser?.username}
            </span>
            <span className="pl-2 text-sm font-light">{data?.createdAt}</span>
          </div>
          <span className="pl-4 text-lg">{data?.content}</span>
        </div>
      </div>
    </>
  );
}
