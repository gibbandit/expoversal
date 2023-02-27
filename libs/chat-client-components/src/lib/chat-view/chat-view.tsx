import styles from './chat-view.module.css';

/* eslint-disable-next-line */
export interface ChatViewProps {}

/*
Use tailwind css classes to style the component
*/

export function ChatView(props: ChatViewProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to ChatView!</h1>
    </div>
  );
}

export default ChatView;
