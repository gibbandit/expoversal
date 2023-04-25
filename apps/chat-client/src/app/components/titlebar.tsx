import { ReactElement } from 'react';
import { Navbar } from 'flowbite-react';

import ProfileDropdown from './profileDropdown';

export default function Titlebar(props: {
  onSidebarButtonClick: () => void;
}): ReactElement {
  return (
    <Navbar fluid={true} border={true}>
      <Navbar.Toggle onClick={props.onSidebarButtonClick} />
      <Navbar.Brand>
        <img src="/logo.svg" alt="Expoversal Logo" className="mr-2 w-8 h-8" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          Expoversal
        </span>
      </Navbar.Brand>
      <ProfileDropdown />
    </Navbar>
  );
}
