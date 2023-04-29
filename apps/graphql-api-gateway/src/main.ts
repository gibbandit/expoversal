import koa from 'koa';
import Router from 'koa-router';
import { createYoga } from 'graphql-yoga';
import { GraphQLSchema } from 'graphql';
import { koaBody } from 'koa-body';
import cors from '@koa/cors';

import {
  createGatewaySchema,
  SubschemaOptions,
} from '@expoversal/graphql-gateway-service';

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const subschemaConfig: SubschemaOptions[] = [
  {
    serviceName: 'user',
    url: 'http://localhost:3001/graphql',
  },
  {
    serviceName: 'message',
    url: 'http://localhost:3002/graphql',
  },
  {
    serviceName: 'subscription',
    url: 'http://localhost:3003/graphql',
  },
];

//wait for the subschemas to be ready
const schema = new Promise<GraphQLSchema>(async (resolve) => {
  console.log('⏳ waiting for subschemas to be ready');
  await new Promise((resolve) => setTimeout(resolve, 10000));
  resolve(createGatewaySchema(subschemaConfig));
});

const app = new koa();
const router = new Router();

const yoga = createYoga<koa.ParameterizedContext>({
  schema,
  context: ({ request }) => ({
    authHeader: request.headers.get('authorization'),
  }),
  landingPage: false,
});

router.post('/auth', koaBody(), cors(), async (ctx) => {
  const { username } = ctx.request.body;

  if (!username) {
    ctx.status = 400;
    console.log('bad body for auth request');
    return;
  }

  const fetchRes = await fetch('http://localhost:3001/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `#graphql
       query _authUser($username: String!) {
          _authUser(username: $username) {
          id
        }
      }
      `,
      variables: {
        username: username,
      },
    }),
  });

  const body = await fetchRes.json();

  if (!body.data._authUser.id) {
    ctx.status = 400;
    console.log('bad response from user service for auth request');
    return;
  }

  ctx.type = 'application/json';
  ctx.body = { token: body.data._authUser.id };
});

app.use(router.routes());
app.use(router.allowedMethods());

app.use(async (ctx) => {
  const response = await yoga.handleNodeRequest(ctx.req, ctx);
  ctx.status = response.status;
  response.headers.forEach((value, key) => {
    ctx.append(key, value);
  });
  ctx.body = response.body;
});

app.listen(port, () => {
  console.log(
    `🚀 graphql api gateway endpoint running at http://localhost:${port}`
  );
});
