import { StatusCodes } from "http-status-codes";
import AppError from "./AppError.js";

export default class BadRequest extends AppError {
  constructor(message: string) {
    super(StatusCodes.BAD_REQUEST, message);
  }
}
