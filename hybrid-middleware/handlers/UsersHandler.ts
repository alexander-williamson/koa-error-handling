import { Context } from "koa";
import Router from "koa-router";
import { CustomError, UsersService } from "../services/UsersService";

// I think this is a better shape
// We pass any edge cases up to the NotFoundMiddleware or GenericErrorHandlingMiddleware

const usersService = new UsersService();

export function UsersHandler(): Router.IMiddleware<any, {}> {
  return async function (ctx: Context): Promise<void> {
    try {
      const user = usersService.GetUser(ctx.params.id);
      if (user) {
        ctx.status = 200;
        ctx.body = user; // todo map
      }
      // if no match then it's a 404
    } catch (error: any) {
      // if this is an error I want to do something about, do it here
      if (error instanceof CustomError) {
        SetCustomError(ctx);
      } else {
        // otherwise let it bubble up, this is the hybrid approach
        // you could optionally handle the 404 here if you find it clearer
        throw error;
      }
    }
  };
}

function SetCustomError(ctx: Context) {
  ctx.status = 429; // too many requests
  ctx.body = {
    errors: [
      {
        code: "CUSTOM_ERROR",
        message: "Too Many Requests (you can retry)",
      },
    ],
  };
}
