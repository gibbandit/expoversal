import { ReactElement } from 'react';

export default function ThreadPlaceHolder(): ReactElement {
  return (
    <div className="flex flex-grow justify-center items-center flex-col">
      <img src="/logo.svg" alt="Expoversal Logo" className="h-24 w-24" />
      <span className="mt-1 text-xl text-gray-600 font-bold dark:text-white">
        select a thread
      </span>
    </div>
  );
}
