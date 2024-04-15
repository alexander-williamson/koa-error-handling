export class UsersService {
  GetUser(id: string): User | undefined {
    if (id === "123") {
      return { id: "123" };
    }
    if (id === "111") {
      throw new Error("Generic Error");
    }
    if (id === "222") {
      throw new CustomError("Custom Error");
    }
  }
}

export type User = { id: string };

export class CustomError extends Error {
  // https://stackoverflow.com/questions/31626231/custom-error-class-in-typescript
  constructor(msg: string) {
    super(msg);
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}
