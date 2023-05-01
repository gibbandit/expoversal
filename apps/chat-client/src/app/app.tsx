// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.css';
import Titlebar from './components/titlebar';
import MainPage from './pages/mainPage';
import AuthPage from './pages/authPage';
import ProfileDropdown from './components/profileDropdown';
import { useRecoilValue } from 'recoil';
import { authAtom } from '../atoms';

export function App() {
  const isAuth = useRecoilValue(authAtom);

  return (
    <div className="h-screen flex flex-col overscroll-none">
      <div>
        {<Titlebar>{isAuth ? <ProfileDropdown /> : undefined}</Titlebar>}
      </div>
      <div className="flex justify-center items-center flex-grow overflow-hidden">
        <>{isAuth ? <MainPage /> : <AuthPage />}</>
      </div>
    </div>
  );
}

export default App;
