import { ReactElement } from 'react';
import { graphql, readInlineData } from 'react-relay';
import { messageFragment$key } from './__generated__/messageFragment.graphql';
import ProfileModal from './profileModal';
import { atom, useRecoilState } from 'recoil';
import { Avatar } from 'flowbite-react';
import dayjs from 'dayjs';

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

  const data = readInlineData(messageFragment, messageRef);

  const modalAtom = atom({
    key: `profileChatModal_${data.id}`,
    default: false,
  });

  const [showModal, setShowModal] = useRecoilState(modalAtom);

  function onCloseModal() {
    setShowModal(false);
  }

  function onClickAvatar() {
    setShowModal(true);
  }

  return (
    <>
      <ProfileModal
        userRef={data?.createdUser}
        show={showModal}
        onClose={onCloseModal}
      />
      <div className="justify-self-end">
        <div className="flex flex-grow flex-row w-full pt-1 pb-1" id={data?.id}>
          <Avatar
            alt="User avatar"
            img={data.createdUser?.avatarUrl}
            className="self-center pl-4 w-16 h-16"
            rounded={true}
            onClick={onClickAvatar}
          />
          <div className="self-center flex flex-col">
            <div>
              <span className="pl-4 text-md font-medium">
                {data?.createdUser?.username}
              </span>
              <span className="pl-2 text-xs font-light">
                {dayjs(data?.createdAt).format('DD/MM/YYYY h:mm A')}
              </span>
            </div>
            <span className="pl-4 text-lg">{data?.content}</span>
          </div>
        </div>
      </div>
    </>
  );
}
