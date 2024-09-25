export class NotFoundError extends Error {
  digest = "HTTP:404"

  constructor() {
    super("NotFoundError")
    this.name = "NotFoundError"
  }
}
