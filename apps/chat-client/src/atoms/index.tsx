import {
  graphQLMutationEffect,
  graphQLQueryEffect,
  graphQLSelector,
} from 'recoil-relay';
import { recoilEnvironmentKey } from '../relay';
import { graphql } from 'relay-runtime';
import { atom } from 'recoil';

const localStorageEffect =
  (key: string) =>
  ({ setSelf, onSet }: any) => {
    const savedValue = localStorage.getItem(key);
    if (savedValue != null) {
      setSelf(savedValue);
    }

    onSet((newValue: any, _: any, isReset: any) => {
      isReset
        ? localStorage.removeItem(key)
        : localStorage.setItem(key, newValue);
    });
  };

export const authAtom = atom({
  key: 'Auth',
  default: null,
  effects: [localStorageEffect('authKey')],
});

const currentUserIDState = atom({
  key: 'CurrentUserID',
  default: 1,
  effects: [localStorageEffect('current_user')],
});
export const viewerAtom = graphQLSelector({
  key: 'testAtom',
  environment: recoilEnvironmentKey,
  query: graphql`
    query atomsViewerQuery {
      viewer {
        id
        username
        avatarUrl
        ...profileDropdownFragment
      }
    }
  `,
  variables: {},
  mapResponse: (data) => data.viewer,
});
