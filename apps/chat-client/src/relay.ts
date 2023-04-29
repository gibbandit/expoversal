import { EnvironmentKey } from 'recoil-relay';
import {
  Environment,
  Network,
  Observable,
  RecordSource,
  Store,
} from 'relay-runtime';
import { authHeader } from './auth';

async function FetchGraphQL(
  query: any,
  variables: any
) /* eslint-disable-line @typescript-eslint/no-explicit-any */ {
  const response = await fetch('http://localhost:3000/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeader(),
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  return await response.json();
}

export const recoilEnvironmentKey = new EnvironmentKey('RecoilEnvironmentKey');

export const relayEnvironment = new Environment({
  network: Network.create(
    (
      params: any,
      variables: any
    ) /* eslint-disable-line @typescript-eslint/no-explicit-any */ =>
      Observable.create((sink) => {
        FetchGraphQL(params.text, variables).then((payload) => {
          sink.next(payload);
          sink.complete();
        });
      })
  ),
  store: new Store(new RecordSource()),
});
