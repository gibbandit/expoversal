import koa from 'koa';
import { createYoga } from 'graphql-yoga';

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
