export class UnknownError extends Error {
  private readonly error: unknown;
  public constructor(error: unknown) {
    super(`UnknownError`);
    this.error = error;
  }

  public getSource(): unknown {
    return this.error;
  }
}

export class NullOrUndefinedError extends Error {
  public constructor(message: string) {
    super(message);
  }
}
