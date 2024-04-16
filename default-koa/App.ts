import Koa, { Context, Next } from "koa";
import Router from "koa-router";

const app = new Koa();

const router = new Router({ prefix: "/users" });

router.get("/:id", async (ctx: Context, next: Next): Promise<void> => {
  console.debug("called but did not adjust status");
  ctx.body = "Hello world";
});

app.use(router.routes()).use(router.allowedMethods());

export { app };
