import styles from './message-bubble.module.css';

/* eslint-disable-next-line */
export interface MessageBubbleProps {}

/*
Use tailwind css classes to style the component
*/

export function MessageBubble(props: MessageBubbleProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to MessageBubble!</h1>
    </div>
  );
}

export default MessageBubble;
