import { Next } from "koa";
import Router from "koa-router";

export function GenericErrorHandlingMiddleware(): Router.IMiddleware<any, {}> {
  return async function (ctx, next: Next): Promise<void> {
    try {
      await next();
    } catch (error: any) {
      console.error("handling uncaught error");
      ctx.status = 500;
      ctx.body = {
        errors: [
          {
            code: "UNEXPECTED_ERROR",
            message:
              "An unhandled error occurred handled in GenericErrorHandlingMiddleware",
          },
        ],
      };
    }
  };
}
