import { Request, Response, NextFunction, RequestHandler } from "express";
import { ZodSchema, ZodError } from "zod";

export const validateData = (
  schema: ZodSchema<any>,
  genericMessage?: string
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
      return;
    } catch (error) {
      if (error instanceof ZodError) {
        if (genericMessage) {
          res.status(400).json({ message: genericMessage });
          return;
        }
        const messages = error.errors.map((err) => err.message);
        res.status(400).json({ errors: messages });
        return;
      }
      next(error);
      return;
    }
  };
};
