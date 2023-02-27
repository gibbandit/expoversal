import styles from './thread-list-card.module.css';

/* eslint-disable-next-line */
export interface ThreadListCardProps {}

/*
Use tailwind css classes to style the component
*/

export function ThreadListCard(props: ThreadListCardProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to ThreadListCard!</h1>
    </div>
  );
}

export default ThreadListCard;
