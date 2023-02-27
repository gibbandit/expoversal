import styles from './thread-message-scroll.module.css';

/* eslint-disable-next-line */
export interface ThreadMessageScrollProps {}

/*
Use tailwind css classes to style the component
*/

export function ThreadMessageScroll(props: ThreadMessageScrollProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to ThreadMessageScroll!</h1>
    </div>
  );
}

export default ThreadMessageScroll;
