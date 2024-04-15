import { Next } from "koa";
import Router from "koa-router";
import { CustomError } from "../services/UsersService";

export function CustomErrorMiddleware(): Router.IMiddleware<any, {}> {
  return async function (ctx, next: Next): Promise<void> {
    try {
      await next();
    } catch (error) {
      if (error instanceof CustomError) {
        ctx.status = 429;
        ctx.body = {
          errors: [
            {
              code: "CUSTOM_ERROR",
              message: "Custom error handled in CustomErrorMiddleware",
            },
          ],
        };
      } else {
        throw error;
      }
    }
  };
}
