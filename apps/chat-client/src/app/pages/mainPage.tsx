import ChatView from '../components/chatView';

export function MainPage() {
  history.replaceState(null, '', '/');

  return (
    <div className="flex flex-grow">
      <ChatView />
    </div>
  );
}

export default MainPage;
