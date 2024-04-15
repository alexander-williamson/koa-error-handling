import { Context } from "koa";
import Router from "koa-router";
import { UsersService } from "../services/UsersService";

// I think this is a better shape
// We pass any edge cases up to the NotFoundMiddleware or GenericErrorHandlingMiddleware
// but the middleware needs to know each type

const usersService = new UsersService();

export function UsersHandler(): Router.IMiddleware<any, {}> {
  return async function (ctx: Context): Promise<void> {
    const user = usersService.GetUser(ctx.params.id);
    if (user) {
      ctx.status = 200;
      ctx.body = user; // in reality would map
    }
    // if no match then it's a 404
  };
}
