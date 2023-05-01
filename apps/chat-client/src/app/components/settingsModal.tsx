import { ChangeEvent, ReactElement } from 'react';
import {
  commitMutation,
  graphql,
  readInlineData,
  useMutation,
} from 'react-relay';
import { profileModalFragment$key } from './__generated__/profileModalFragment.graphql';
import { Avatar, Button, Label, Modal, TextInput } from 'flowbite-react';
import { init } from '@paralleldrive/cuid2';
import { atom, useRecoilState } from 'recoil';

type Props = {
  userRef: any;
  show: boolean;
  onClose: () => void;
};

const cuid = init({
  length: 25,
});

export default function SettingsModal({
  userRef,
  show,
  onClose,
}: Props): ReactElement {
  const userFragment = graphql`
    fragment settingsModalFragment on User @inline {
      id
      username
      avatarUrl
    }
  `;

  const updateAvatarMutation = graphql`
    mutation settingsModalChangeAvatarMutation(
      $input: UserChangeAvatarSeedInput!
    ) {
      userChangeAvatarSeed(input: $input) {
        viewer {
          avatarUrl
          id
        }
      }
    }
  `;

  const [commitAvatarMutation] = useMutation(updateAvatarMutation);

  const data = readInlineData(userFragment, userRef);

  const avatarUrlAtom = atom({
    key: 'avatarUrl',
    default: data?.avatarUrl,
  });

  const [avatarUrl, setAvatarUrl] = useRecoilState(avatarUrlAtom);

  function onClickChangeIcon() {
    const newAvatarUrl = `http://localhost:3004/avatar/${cuid()}.svg`;
    setAvatarUrl(newAvatarUrl);
  }

  function onSave() {
    commitAvatarMutation({
      variables: {
        input: {
          avatarSeed: avatarUrl
            .replace('http://localhost:3004/avatar/', '')
            .replace('.svg', ''),
        },
      },
    });
    onClose();
  }

  function onCancel() {
    setAvatarUrl(data?.avatarUrl);
    onClose();
  }

  return (
    <Modal
      dismissible={true}
      show={show}
      onClose={onCancel}
      size="sm"
      className="sm:!h-full"
    >
      <Modal.Header>
        <span className="text-2xl font-bold">settings</span>
      </Modal.Header>
      <Modal.Body>
        <div className="flex flex-col items-center gap-8 my-4">
          <div className="flex flex-col items-center gap-6">
            <Avatar
              alt="User avatar"
              img={avatarUrl}
              rounded={true}
              size="xl"
            />
            <Button
              pill={true}
              size="sm"
              onClick={onClickChangeIcon}
              className="w-32"
            >
              change avatar
            </Button>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="flex flex-grow flex-row-reverse gap-4">
          <Button onClick={onSave}>update</Button>
          <Button color="gray" onClick={onCancel}>
            cancel
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
