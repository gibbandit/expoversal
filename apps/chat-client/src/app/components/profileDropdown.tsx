import { ReactElement } from 'react';
import { graphql, readInlineData } from 'react-relay';
import { Avatar, Dropdown } from 'flowbite-react';
import { IoSettingsOutline, IoLogOutOutline } from 'react-icons/io5';
import ProfileModal from './profileModal';
import { atom, useRecoilState } from 'recoil';
import { viewerAtom } from '../../atoms';
import { removeAuthToken } from '../../auth';
import SettingsModal from './settingsModal';

export default function ProfileDropdown(): ReactElement {
  const profileDropdownFragment = graphql`
    fragment profileDropdownFragment on User @inline {
      id
      username
      avatarUrl
      ...profileModalFragment
      ...settingsModalFragment
    }
  `;

  const [viewer] = useRecoilState(viewerAtom);

  const data = readInlineData(profileDropdownFragment, viewer);

  const profileModalAtom = atom({
    key: 'profileModal',
    default: false,
  });

  const settingsModalAtom = atom({
    key: 'settingsModal',
    default: false,
  });

  const [showProfileModal, setShowProfileModal] =
    useRecoilState(profileModalAtom);

  const [showSettingsModal, setShowSettingsModal] =
    useRecoilState(settingsModalAtom);

  function onCloseProfileModal() {
    setShowProfileModal(false);
  }

  function onCloseSettingsModal() {
    setShowSettingsModal(false);
  }

  function onClickProfile() {
    setShowProfileModal(true);
  }

  function onClickSettings() {
    setShowSettingsModal(true);
  }

  function onClickLogout() {
    removeAuthToken();
  }

  return (
    <div className="flex relative">
      <ProfileModal
        userRef={data}
        show={showProfileModal}
        onClose={onCloseProfileModal}
      />
      <SettingsModal
        userRef={data}
        show={showSettingsModal}
        onClose={onCloseSettingsModal}
      />
      <Dropdown
        arrowIcon={false}
        inline={true}
        label={<Avatar img={data?.avatarUrl} rounded={true} />}
      >
        <Dropdown.Header>
          <Dropdown.Item onClick={onClickProfile}>
            <div className="flex flex-col items-center">
              <Avatar
                alt="User avatar"
                img={data?.avatarUrl}
                className="mb-2"
                rounded={true}
              />
              <span className="block truncate text-sm font-medium self-center text-center">
                {data?.username}
              </span>
            </div>
          </Dropdown.Item>
        </Dropdown.Header>
        <Dropdown.Item onClick={onClickSettings}>
          <div className="flex items-center">
            <IoSettingsOutline className="mr-2 w-5 h-5" />
            <span>Settings</span>
          </div>
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item onClick={onClickLogout}>
          <div className="flex items-center text-red-600">
            <IoLogOutOutline className="mr-2 w-5 h-5" />
            <span>Logout</span>
          </div>
        </Dropdown.Item>
      </Dropdown>
    </div>
  );
}
