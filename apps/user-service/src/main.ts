import koa from 'koa';
import { createYoga } from 'graphql-yoga';

import { schema } from '@expoversal/graphql-user-service';

const port = process.env.PORT ? Number(process.env.PORT) : 3001;

const app = new koa();

async function getCurrentUser(authorization: string | undefined) {
  return authorization ? { id: authorization } : undefined;
}

const yoga = createYoga<koa.ParameterizedContext>({
  context: async ({ request }) => ({
    currentUser: await getCurrentUser(
      request.headers.get('authorization') || undefined
    ),
  }),
  schema: schema,
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
