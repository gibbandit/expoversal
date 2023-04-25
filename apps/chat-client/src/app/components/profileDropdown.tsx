import { ReactElement } from 'react';
import { graphql } from 'react-relay';
import { profileDropdownQuery$data } from './__generated__/profileDropdownQuery.graphql';
import { Avatar, Dropdown } from 'flowbite-react';
import { IoSettingsOutline, IoLogOutOutline } from 'react-icons/io5';
import ProfileModal from './profileModal';
import { graphQLSelector } from 'recoil-relay';
import { recoilEnvironmentKey } from '../../relay';
import { atom, useRecoilState, useRecoilValue } from 'recoil';

export default function ProfileDropdown(): ReactElement {
  const profileDropdownQuery = graphQLSelector({
    key: 'profileDropdownQuery',
    environment: recoilEnvironmentKey,
    query: graphql`
      query profileDropdownQuery {
        viewer {
          id
          username
          avatarUrl
          ...profileModalFragment
        }
      }
    `,
    variables: {},
    mapResponse: (data) => data,
  });

  const data: profileDropdownQuery$data = useRecoilValue(profileDropdownQuery);

  const modalAtom = atom({
    key: 'profileModal',
    default: false,
  });

  const [showModal, setShowModal] = useRecoilState(modalAtom);

  function onCloseModal() {
    setShowModal(false);
  }

  function onClickProfile() {
    setShowModal(true);
  }

  return (
    <div className="flex relative">
      <Dropdown
        arrowIcon={false}
        inline={true}
        label={<Avatar img={data.viewer?.avatarUrl} rounded={true} />}
      >
        <Dropdown.Header>
          <ProfileModal
            userRef={data?.viewer}
            show={showModal}
            onClose={onCloseModal}
          />
          <Dropdown.Item onClick={onClickProfile}>
            <div className="flex flex-col items-center">
              <Avatar
                alt="User avatar"
                img={data.viewer?.avatarUrl}
                className="mb-2"
                rounded={true}
              />
              <span className="block truncate text-sm font-medium self-center text-center">
                {data.viewer?.username}
              </span>
            </div>
          </Dropdown.Item>
        </Dropdown.Header>
        <Dropdown.Item>
          <div className="flex items-center">
            <IoSettingsOutline className="mr-2 w-5 h-5" />
            <span>Settings</span>
          </div>
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item>
          <div className="flex items-center text-red-600">
            <IoLogOutOutline className="mr-2 w-5 h-5" />
            <span>Logout</span>
          </div>
        </Dropdown.Item>
      </Dropdown>
    </div>
  );
}
