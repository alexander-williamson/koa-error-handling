# Error handling strategies in Koa

```
npm install
npm run dev
```

There are several approaches in this demo:

### Default Koa Pipeline

There is no customised 404 or Error handling, you handle it in every handler (terrible):

| Link                                                                                                     | Description                                    | Output                          |
| -------------------------------------------------------------------------------------------------------- | ---------------------------------------------- | ------------------------------- |
| [http://localhost:8000/without-middleware/users/123](http://localhost:8000/without-middleware/users/123) | Happy path                                     | User is returned                |
| [http://localhost:8000/without-middleware/users/999](http://localhost:8000/without-middleware/users/999) | User that doesn't exist                        | `Not Found` from Koa            |
| [http://localhost:8000/without-middleware/users/111](http://localhost:8000/without-middleware/users/111) | default Koa handling of a generic `Error`      | Internal Server Error from Koa  |
| [http://localhost:8000/without-middleware/users/222](http://localhost:8000/without-middleware/users/111) | default Koa handling of a custom `CustomError` | Custom handling code in handler |

### The middleware-only approach

This moves the logic for handling exceptional application flow out of your handler into the middleware. I am not a fan of this - it's quite ASP.NET like. I think too many coponents need to coordinate flow here, and below there is a better (hybrid) approach.

| Link                                                                                               | Description          | Output                          |
| -------------------------------------------------------------------------------------------------- | -------------------- | ------------------------------- |
| [http://localhost:8000/with-middleware/users/123](http://localhost:8000/with-middleware/users/123) | Happy path           | User is returned                |
| [http://localhost:8000/with-middleware/users/999](http://localhost:8000/with-middleware/users/999) | user doesn't exist   | `Not Found` from Koa            |
| [http://localhost:8000/with-middleware/users/111](http://localhost:8000/with-middleware/users/111) | generic error thrown | handled in middleware           |
| [http://localhost:8000/with-middleware/users/222](http://localhost:8000/with-middleware/users/111) | custom error thrown  | Custom handling code in handler |

### The hybrid approach

I prefer this. Any localised application flow is kept to the handler and mapped appropriately. Anything that needs to be raised higher is passed to the NotFoundMiddleware or GenericErrorHandlingMiddleware in edge cases that I have not caught. I think this is the best balance.

| Link                                                                                                   | Description          | Output                          |
| ------------------------------------------------------------------------------------------------------ | -------------------- | ------------------------------- |
| [http://localhost:8000/hybrid-middleware/users/123](http://localhost:8000/hybrid-middleware/users/123) | Happy path           | User is returned                |
| [http://localhost:8000/hybrid-middleware/users/999](http://localhost:8000/hybrid-middleware/users/999) | user does not exist  | not found handled in middleware |
| [http://localhost:8000/hybrid-middleware/users/111](http://localhost:8000/with-middleware/users/111)   | generic error thrown | error handled in middleware     |
| [http://localhost:8000/hybrid-middleware/users/222](http://localhost:8000/with-middleware/users/111)   | custom error thrown  | Custom handling code in handler |

## Other notes on application flow

You could use a `type Result { error: any, value: any }` and not rely on exceptions. Inside the handlers you would not rely on exceptions for application flow, instead use `Result`. You would still need the hybrid approach of edge case capturing using NotFoundMiddleware and GenericErrorHandlingMiddleware to capture everything you miss. That approach might look like this:

The UsersService uses a `Result` object to pass the unhappy path cases back:

```
class UsersService {
  GetUser(id: string): Result<User, NotFound> {
    if(userExists) {
      // do lookup
      return { error: undefined, value: existingUser }
    }
    return { error: new NotFoundError(), value: undefined }
  }
}
```

The handler would have more logic but reads nicely:

```
export function UsersHandler(): Router.IMiddleware<any, {}> {
  return async function (ctx: Context): Promise<void> {

    const result = userService.getUser(ctx.params.id);
    if(result.user) {
      GenerateOK(ctx, Map(user));
    }

    // work with any known flows
    // could use error.code === "not-found" etc
    if(result.error instanceOf NotFound) {
      return GenerateNotFound(ctx);
    }

    // handle everything else in here
    return UnexpecteError(ctx);
  }
}
```

## Default Koa Behavious

With no middleware handling/intercepting an error, you get a `500` Internal Server Error with the basic text body:

```
Internal Server Error
```

A 404 returns a similar basic response with `404` Not Found status code:

```
Not Found
```

## Customising a Koa 404 Not Found response

You can add custom middleware for Not Found cases:

```
import { Next } from "koa";
import Router from "koa-router";

export function NotFoundMiddleware(): Router.IMiddleware<any, {}> {
  return async function (ctx, next: Next): Promise<void> {

    // do the work
    await next();

    // Koa sets the default status to 404
    // so if it's not been set elsewhere it will still be 404
    if (ctx.response.status === 404) {
      ctx.body = "Your 404 Not Found body goes here"
  };
}
```

## Handling edge errors

Koa supports awaiting the `next()` call, so you can use a try, catch approach:

```
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
```
