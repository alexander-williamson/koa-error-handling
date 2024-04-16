import Koa from "koa";
import mount from "koa-mount";
import { app as withMiddleware } from "./with-middleware/App";
import { app as withoutMiddleware } from "./without-middleware/App";
import { app as hybridMiddleware } from "./hybrid-middleware/App";
import { app as defaultMiddleware } from "./default-koa/App";

const PORT = process.env.PORT || 8000;

const app = new Koa();

app
  .use(mount("/with-middleware", withMiddleware))
  .use(mount("/without-middleware", withoutMiddleware))
  .use(mount("/hybrid-middleware", hybridMiddleware))
  .use(mount("/default-koa", defaultMiddleware))
  .listen(PORT, () => console.log(`listening on http://localhost:${PORT}...`));
