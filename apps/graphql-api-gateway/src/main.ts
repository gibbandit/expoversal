import koa from 'koa';
import { createYoga } from 'graphql-yoga';

import { createGatewaySchema } from '@expoversal/graphql-gateway-service';

import { schema as userSchema } from '@expoversal/graphql-user-service';
import { schema as messageSchema } from '@expoversal/graphql-message-service';
import { schema as messageSubscriptionSchema } from '@expoversal/graphql-message-subscription-service';

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const subschemaConfig = [
  { url: 'http://localhost:3001/graphql', schema: userSchema },
  { url: 'http://localhost:3002/graphql', schema: messageSchema },
  { url: 'http://localhost:3003/graphql', schema: messageSubscriptionSchema },
];

const schema = createGatewaySchema(subschemaConfig);

const app = new koa();

const yoga = createYoga<koa.ParameterizedContext>({
  schema,
  context: ({ request }) => ({
    authHeader: request.headers.get('authorization'),
  }),
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
    `🚀 graphql api gateway endpoint running at http://localhost:${port}`
  );
});
