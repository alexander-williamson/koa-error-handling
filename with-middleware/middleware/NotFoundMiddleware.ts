import { Next } from "koa";
import Router from "koa-router";

export function NotFoundMiddleware(): Router.IMiddleware<any, {}> {
  return async function (ctx, next: Next): Promise<void> {
    await next();
    if (ctx.res.statusCode === 404) {
      ctx.body = {
        errors: [
          {
            code: "NOT_FOUND",
            message: "Custom not found message handled in NotFoundMiddleware",
          },
        ],
      };
    }
  };
}
