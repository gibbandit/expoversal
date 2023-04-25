// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.css';
import Titlebar from './components/titlebar';
import ChatView from './components/chatView';

export function App() {
  return (
    <div className="h-screen flex flex-col">
      <Titlebar onSidebarButtonClick={() => null} />
      <ChatView />
    </div>
  );
}

export default App;
