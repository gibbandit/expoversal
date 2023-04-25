import koa from 'koa';
import Router from 'koa-router';
import React from 'react';
import { renderToString } from 'react-dom/server';

import Avatar from 'boring-avatars';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3004;

const app = new koa();
const router = new Router();

router.get('/avatar/:id.svg', async (ctx) => {
  const id = ctx.params?.id;
  ctx.type = 'image/svg+xml';

  const avatar = renderToString(
    React.createElement(
      Avatar,
      {
        size: 128,
        name: id,
        variant: 'beam',
        colors: ['#EFF3CD', '#B2D5BA', '#61ADA0', '#248F8D', '#605063'],
      },
      null
    )
  );

  ctx.body = avatar;
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
