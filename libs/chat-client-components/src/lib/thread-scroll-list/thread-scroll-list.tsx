import styles from './thread-scroll-list.module.css';

/* eslint-disable-next-line */
export interface ThreadScrollListProps {}

/*
Use tailwind css classes to style the component
*/

export function ThreadScrollList(props: ThreadScrollListProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to ThreadScrollList!</h1>
    </div>
  );
}

export default ThreadScrollList;
