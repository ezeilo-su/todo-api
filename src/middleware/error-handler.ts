import { ErrorRequestHandler } from 'express';

import { CustomErrorCodes } from '../enums';
import {
  ValidationIssues,
  RequestValidationError,
  TaskStartFinishTimeError,
  TaskTimelineError
} from '../errors/error';
import httpStatus from 'http-status';

interface ReqValidationErrRes {
  success: false;
  message: string;
  code: CustomErrorCodes.BAD_REQUEST;
  errors: ValidationIssues;
}

interface ServerErrRes {
  success: false;
  message: string;
  code: CustomErrorCodes.SERVER_ERROR;
}

interface ReqNotProcessedErrRes {
  success: false;
  message: string;
  code: CustomErrorCodes.NOT_PROCESSED;
  errors: string[];
}

type ErrRes = ReqValidationErrRes | ServerErrRes | ReqNotProcessedErrRes;

export const errorHandler: ErrorRequestHandler<unknown, ErrRes> = (err, _req, res, _next) => {
  try {
    switch (true) {
      case err instanceof RequestValidationError:
        console.error(err.toString(), '\n', JSON.stringify(err));

        res.status(httpStatus.BAD_REQUEST).json({
          success: false,
          message: err.message,
          code: CustomErrorCodes.BAD_REQUEST,
          errors: err.toJSON()
        });
        break;

      case err instanceof TaskTimelineError || err instanceof TaskStartFinishTimeError:
        console.error(err.toString(), '\n', JSON.stringify(err));
        res.status(httpStatus.CONFLICT).json({
          success: false,
          message: err.message,
          code: CustomErrorCodes.NOT_PROCESSED,
          errors: err.toJSON()
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
