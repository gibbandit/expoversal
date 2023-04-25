import { ReactElement } from 'react';
import { TextInput, Button } from 'flowbite-react';
import { IoSend } from 'react-icons/io5';
import Message from './message';

export default function ThreadPlaceHolder(): ReactElement {
  return (
    <div className="flex flex-grow h-full justify-center items-center flex-col">
      <div className="flex w-full flex-col overflow-auto">
        <></>
      </div>
      <div className="flex flex-grow" />
      <div className="flex flex-row w-full items-center border-t border-gray-200">
        <div className="flex flex-grow p-4">
          <TextInput className="flex-grow" />
        </div>
        <div className="flex p-4 pl-0">
          <Button color="gray" pill={true} outline={true}>
            <IoSend />
          </Button>
        </div>
      </div>
    </div>
  );
}
