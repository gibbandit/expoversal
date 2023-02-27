import styles from './top-navbar.module.css';

/* eslint-disable-next-line */
export interface TopNavbarProps {}

/*
Use tailwind css classes to style the component
*/

export function TopNavbar(props: TopNavbarProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to TopNavbar!</h1>
    </div>
  );
}

export default TopNavbar;
