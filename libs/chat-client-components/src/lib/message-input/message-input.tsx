import styles from './message-input.module.css';

/* eslint-disable-next-line */
export interface MessageInputProps {}

/*
Use tailwind css classes to style the component
*/

export function MessageInput(props: MessageInputProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to MessageInput!</h1>
    </div>
  );
}

export default MessageInput;
