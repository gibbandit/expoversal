import { Button, Card, Label, TextInput } from 'flowbite-react';
import { ChangeEvent, ReactElement } from 'react';
import { RiUser4Line } from 'react-icons/ri';
import { RecoilState, atom, useRecoilState } from 'recoil';
import { fetchAuthToken } from '../../auth';

type Props = {
  viewerState: RecoilState<any>;
};

export default function LoginCard(): ReactElement {
  history.replaceState(null, '', '/login');

  const usernameInputAtom = atom({
    key: 'usernameInput',
    default: '',
  });

  const authLoadingAtom = atom({
    key: 'authLoading',
    default: false,
  });

  const [usernameInput, setUsernameInput] = useRecoilState(usernameInputAtom);
  const [authLoading, setAuthLoading] = useRecoilState(authLoadingAtom);

  function onChangeUsernameInput(event: ChangeEvent<HTMLInputElement>) {
    setUsernameInput(event.target.value);
  }

  async function onSubmit() {
    setAuthLoading(true);
    await fetchAuthToken(usernameInput);
  }

  async function onKeydown(event: { key: string }) {
    if (event.key === 'Enter') {
      setAuthLoading(true);
      await fetchAuthToken(usernameInput);
    }
  }

  return (
    <div className="flex flex-grow flex-col place-content-center">
      <div className="grid justify-content-center place-content-center flex-wrap">
        <div className="grid">
          <img
            src="/logo.svg"
            alt="Expoversal Logo"
            className="self-center place-self-center pb-8 w-32 h-32"
          />
          <Card>
            <span className="pb-4 text-4xl text-center font-bold dark:text-white">
              Login
            </span>
            <div>
              <div className="pb-2 block">
                <Label htmlFor="username" value="enter your username" />
              </div>
              <TextInput
                id="username"
                type="text"
                rightIcon={RiUser4Line}
                placeholder="username"
                required={true}
                className="w-64"
                onChange={onChangeUsernameInput}
                onKeyDown={onKeydown}
              />
            </div>
            <Button type="submit" onClick={onSubmit} disabled={authLoading}>
              Submit
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
