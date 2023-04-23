import { ReactElement } from "react";
import { graphql, useLazyLoadQuery } from "react-relay";
import { testQuery } from "./__generated__/testQuery.graphql";

export default function Test(): ReactElement {
  const data = useLazyLoadQuery<testQuery>(
    graphql`
      query testQuery {
        me {
          id
          username
        }
      }
    `,
    {},
  );

  return (
    <>
      <h1>Expoversal</h1>
      <h2 id="user">current user</h2>
      <ul aria-labelledby="user">
        {
          <li key={data.me?.id}>{data.me?.username}</li>
        }
      </ul>
    </>
  );
}