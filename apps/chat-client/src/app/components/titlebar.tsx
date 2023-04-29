import { ReactElement } from 'react';
import { Navbar } from 'flowbite-react';

import ProfileDropdown from './profileDropdown';

type Props = {
  children?: ReactElement[] | ReactElement;
};

export default function Titlebar({ children }: Props): ReactElement {
  return (
    <Navbar fluid={true} border={true}>
      <Navbar.Brand>
        <img src="/logo.svg" alt="Expoversal Logo" className="mr-2 w-8 h-8" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          Expoversal
        </span>
      </Navbar.Brand>
      {children}
    </Navbar>
  );
}
