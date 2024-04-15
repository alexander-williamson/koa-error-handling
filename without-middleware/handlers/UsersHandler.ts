import { Context } from "koa";
import Router from "koa-router";
import { CustomError, UsersService } from "../services/UsersService";

// I think this is pretty horrible, but you don't have the tradeoff of knowing your middleware
// the benefit is all the code is handled in one place so it can be tested in full

const usersService = new UsersService();

export function UsersHandler(): Router.IMiddleware<any, {}> {
  return async function (ctx: Context): Promise<void> {
    console.debug("without-middleware: users handler called");
    try {
      const user = usersService.GetUser(ctx.params.id);
      console.debug("without-middleware: user: " + JSON.stringify(user));
      if (user) {
        ctx.body = user; // todo map
        ctx.status == 200;
        return;
      }
      ctx.body = "Not found handled in Usershandler";
    } catch (error) {
      if (error instanceof CustomError) {
        ctx.status = 429;
        ctx.body = "Custom error handled in UsersHandler";
      } else {
        ctx.status = 500;
        ctx.body = "Generic error handled in UsersHandler";
      }
    }
  };
}
