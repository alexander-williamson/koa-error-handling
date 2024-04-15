import Koa from "koa";
import Router from "koa-router";
import { UsersHandler } from "./handlers/UsersHandler";

const app = new Koa();

const router = new Router({ prefix: "/users" });
router.get("/:id", UsersHandler());

app.use(router.routes()).use(router.allowedMethods());

export { app };
