import express from "express";
import type { Response } from "express";
import diagnosesServices from "../services/diagnosesServices.ts";
import { NonSensitiveDiagnoseEntry } from "../type.ts";

const diagnosesRouter = express.Router();

diagnosesRouter.get('/', (_req, res: Response<NonSensitiveDiagnoseEntry[]>) => {
    res.json(diagnosesServices.getNonSensitiveDiagnosesEntries());
});

export default diagnosesRouter;