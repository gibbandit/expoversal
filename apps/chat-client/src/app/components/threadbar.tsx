import { Children, ReactElement } from 'react';
import { graphql, readInlineData } from 'react-relay';
import { Button, Sidebar } from 'flowbite-react';
import { IoAdd } from 'react-icons/io5';
import { threadbarFragment$key } from './__generated__/threadbarFragment.graphql';
import NewThreadModal from './newThreadModal';
import { atom, useRecoilState } from 'recoil';

type ThreadbarProps = {
  connectionRef: any;
  children?: ReactElement | ReactElement[];
};

export default function Threadbar({
  connectionRef,
  children,
}: ThreadbarProps): ReactElement {
  const newThreadaModalAtom = atom({
    key: 'newThreadModal',
    default: false,
  });

  const [showNewThreadModal, setNewThreadModal] =
    useRecoilState(newThreadaModalAtom);

  function onClickNewThread() {
    setNewThreadModal(true);
  }

  function onCloseNewThreadModal() {
    setNewThreadModal(false);
  }

  return (
    <div className="flex flex-col w-fit h-full scroll-smooth overflow-y-auto overscroll-y-contain">
      <NewThreadModal
        connectionRef={connectionRef}
        show={showNewThreadModal}
        onClose={onCloseNewThreadModal}
      />
      <Sidebar
        collapseBehavior="hide"
        collapsed={false}
        className="hidden md:block border-r border-gray-200"
      >
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            <div className="flex justify-center items-center self-center">
              <Button
                color="gray"
                pill={true}
                onClick={onClickNewThread}
                className="w-48"
              >
                <div className="inline-flex items-center">
                  <IoAdd className="inline-block mr-1 w-5 h-5" />
                  <span className="text-lg font-normal">new thread</span>
                </div>
              </Button>
            </div>
            {children}
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </div>
  );
}

type ThreadbarItemProps = {
  threadRef: any;
  onClick?: () => void;
  active?: boolean;
};

export function ThreadbarItem({
  threadRef,
  onClick,
  active,
}: ThreadbarItemProps): ReactElement {
  const threadbarFragment = graphql`
    fragment threadbarItemFragment on Thread @inline {
      id
      name
    }
  `;

  const data = readInlineData(threadbarFragment, threadRef);

  return (
    <Sidebar.Item key={data.id} onClick={onClick} active={active}>
      {data.name}
    </Sidebar.Item>
  );
}
