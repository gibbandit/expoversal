import koa from 'koa';
import { createYoga } from 'graphql-yoga';

import { pubsub } from '@expoversal/redis-pub-sub';

import { schema } from '@expoversal/graphql-message-service';
import { parseAuthHeader } from '@expoversal/graphql-utils';

const port = process.env.PORT ? Number(process.env.PORT) : 3002;

const app = new koa();

const yoga = createYoga<koa.ParameterizedContext>({
  schema,
  context: async ({ request }) => ({
    currentUser: await parseAuthHeader(request.headers.get('authorization')),
    pubsub,
  }),
  logging: 'debug',
});

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
    `🚀 message service graphql endpoint running at http://localhost:${port}`
  );
});
