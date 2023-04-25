import { ReactElement } from 'react';
import { graphql, readInlineData } from 'react-relay';
import { Button, Sidebar } from 'flowbite-react';
import { IoAdd } from 'react-icons/io5';
import { threadbarFragment$key } from './__generated__/threadbarFragment.graphql';

type Props = {
  threadsRef: threadbarFragment$key | null;
};

export default function Threadbar({ threadsRef }: Props): ReactElement {
  const threadbarFragment = graphql`
    fragment threadbarFragment on Query @inline {
      threads(first: 100) {
        edges {
          node {
            ... on Thread {
              id
              name
            }
          }
        }
      }
    }
  `;

  const data = readInlineData(threadbarFragment, threadsRef);

  return (
    <div className="w-fit h-full scroll-smooth overflow-y-auto">
      <Sidebar
        collapseBehavior="hide"
        collapsed={false}
        className="hidden md:block border-r border-gray-200"
      >
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            <div className="flex justify-center items-center self-center">
              <Button color="gray" pill={true} className="w-48">
                <div className="inline-flex items-center">
                  <IoAdd className="inline-block mr-1 w-5 h-5" />
                  <span className="text-lg font-normal">new thread</span>
                </div>
              </Button>
            </div>
            {data?.threads?.edges?.map((edge) => (
              <Sidebar.Item key={edge?.node?.id}>
                {edge?.node?.name}
              </Sidebar.Item>
            ))}
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </div>
  );
}
