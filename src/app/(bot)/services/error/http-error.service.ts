// utils/http-error.ts
export class HttpError extends Error {
  status: number
  cause?: unknown

  constructor(message: string, status: number = 500, cause?: unknown) {
    super(message)
    this.status = status
    this.cause = cause
    Object.setPrototypeOf(this, HttpError.prototype)
  }
}
