import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { PatientsSchemaEntry } from './type.ts';

export const errorMiddleware = (error: unknown, _req: Request, res: Response, next: NextFunction) => {

  if (error instanceof z.ZodError) {
    res.status(400).json({error: error.issues});
  } else {
    next(error);
  }
}

export const newPatientParse = (req: Request, _res: Response, next: NextFunction) => {

  try {
    PatientsSchemaEntry.parse(req.body);
  } catch (error: unknown) {
    next(error);
  }
}