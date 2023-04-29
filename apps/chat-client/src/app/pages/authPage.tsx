import LoginCard from '../components/loginCard';

export function AuthPage() {
  history.replaceState(null, '', '/login');

  return (
    <div className="flex flex-grow">
      <LoginCard />
    </div>
  );
}

export default AuthPage;
