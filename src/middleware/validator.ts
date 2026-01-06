import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await Promise.all(validations.map((validation) => validation.run(req)));

      const errors = validationResult(req);
      if (errors.isEmpty()) {
        return next();
      }

      const extractedErrors = errors.array().map((err) => ({
        field: err.type === 'field' ? err.path : 'unknown',
        message: err.msg,
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: extractedErrors,
      });
    } catch (error) {
      // Handle any unexpected validation errors
      return res.status(400).json({
        success: false,
        message: 'Validation error occurred',
        errors: [{
          field: 'unknown',
          message: error instanceof Error ? error.message : 'Invalid input data',
        }],
      });
    }
  };
};

// Middleware to check if request body exists for POST/PUT/PATCH requests
export const requireBody = (req: Request, res: Response, next: NextFunction): void => {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    if (!req.body || Object.keys(req.body).length === 0) {
      res.status(400).json({
        success: false,
        message: 'Request body is required',
        errors: [{
          field: 'body',
          message: 'Request body cannot be empty',
        }],
      });
      return;
    }
  }
  next();
};
