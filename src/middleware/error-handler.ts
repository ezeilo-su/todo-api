import { ErrorRequestHandler } from 'express';
import { CustomErrorCodes } from '../enums';
import { ValidationIssues, RequestValidationError } from '../errors/error';
import httpStatus from 'http-status';

interface ReqValidationErrorRes {
  success: false;
  message: string;
  code: CustomErrorCodes.BAD_REQUEST;
  errors: ValidationIssues;
}

interface ServerErrorRes {
  success: false;
  message: string;
  code: CustomErrorCodes.SERVER_ERROR;
}

type ErrRes = ReqValidationErrorRes | ServerErrorRes;

export const handleError: ErrorRequestHandler<unknown, ErrRes> = (err, _req, res, _next) => {
  try {
    switch (true) {
      case err instanceof RequestValidationError:
        console.error(err.toString(), '\n', JSON.stringify(err));

        const errors = err.toJSON();

        res.status(httpStatus.BAD_REQUEST).json({
          success: false,
          message: err.message,
          code: CustomErrorCodes.BAD_REQUEST,
          errors
        });
        break;

      default:
        console.error(err.message);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          code: CustomErrorCodes.SERVER_ERROR,
          message: err.message
        });
        break;
    }
  } catch (error) {
    console.error(err.message);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      code: CustomErrorCodes.SERVER_ERROR,
      message: err.message
    });
  }
};
