import express from 'express';
import {Request, Response } from 'express';
import patientsServices from '../services/patientsServices.ts';
import { newPatientParse, newEntryParse } from '../utils.ts';
import { NewPatientsEntry, NonSensitivePatientsEntry, PatientsEntry, NewEntry, Entry } from '../type.ts';

const patientsRouter = express.Router();

patientsRouter.get('/', (_req, res: Response<NonSensitivePatientsEntry[]>) => {
  res.send(patientsServices.getNonSensitivePatientsEntries());
});

patientsRouter.get('/:id', (req, res: Response<PatientsEntry>) => {
  const patient = patientsServices.findById(req.params.id);

  if (patient) {
    res.json(patient);
  } else {
    res.sendStatus(404);
  }
});

patientsRouter.post('/', newPatientParse, (req: Request<unknown, unknown, NewPatientsEntry>, res: Response<PatientsEntry>) => {
  const addedEntry = patientsServices.addPatient(req.body);
  res.json(addedEntry);
});

patientsRouter.post('/:id/entries', newEntryParse, (req: Request<{ id: string }, unknown, NewEntry>, res: Response<Entry>) => {
  const addedEntry = patientsServices.addEntry(req.params.id, req.body);

  if (addedEntry) {
    res.json(addedEntry);
  } else {
    res.sendStatus(404);
  }
});

export default patientsRouter;