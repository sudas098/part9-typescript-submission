import express from 'express';
import { Request, Response } from 'express';
import patientsServices from '../services/patientsServices.ts';
import { newPatientParse } from '../utils.ts';
import { NewPatientsEntry, NonSensitivePatientEntry } from '../type.ts';


const patientsRouter = express.Router();

patientsRouter.get('/', (_req, res: Response<NonSensitivePatientEntry[]>) => {
  res.send(patientsServices.getNonSensitivePatientsEntries());
});

patientsRouter.get('/:id', (req, res: Response<NonSensitivePatientEntry>) => {
     const patient = patientsServices.findBYId(Number(req.body.params));

     if (patient) {
      res.json(patient);
     } else {
      res.sendStatus(404);
     }
})

patientsRouter.post('/', newPatientParse, (req: Request<unknown, unknown, NewPatientsEntry>, res: Response<NewPatientsEntry>) => {
 
    const addedEntry = patientsServices.addPatient(req.body);
    res.json(addedEntry);
  
});

export default patientsRouter;