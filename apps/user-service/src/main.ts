import koa from 'koa';
import { createYoga } from 'graphql-yoga';

import { schema } from '@expoversal/graphql-user-service';
import { parseAuthHeader } from '@expoversal/graphql-utils';

const port = process.env.PORT ? Number(process.env.PORT) : 3001;

const app = new koa();

const yoga = createYoga<koa.ParameterizedContext>({
  schema,
  context: async ({ request }) => ({
    currentUser: await parseAuthHeader(request.headers.get('authorization')),
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
    `🚀 user service graphql endpoint running at http://localhost:${port}`
  );
});
