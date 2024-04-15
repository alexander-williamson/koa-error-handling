import Koa from "koa";
import Router from "koa-router";
import { UsersHandler } from "./handlers/UsersHandler";
import { GenericErrorHandlingMiddleware } from "./middleware/GenericErrorHandlingMiddleware";
import { NotFoundMiddleware } from "./middleware/NotFoundMiddleware";

const app = new Koa();

const router = new Router({ prefix: "/users" });
router.use(NotFoundMiddleware());
router.use(GenericErrorHandlingMiddleware());
router.get("/:id", UsersHandler());

app.use(router.routes()).use(router.allowedMethods());

export { app };
