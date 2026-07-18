import { v1 as uuid } from 'uuid';
import { NonSensitivePatientEntry, PatientsEntry, NewPatientsEntry } from '../type.ts';
import patientsEntries from '../data/patients.ts';

const getAllPatients = (): PatientsEntry[] => {
  return patientsEntries;
};

const getNonSensitivePatientsEntries = (): NonSensitivePatientEntry[] => {
  return patientsEntries.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const findBYId = (id: number): PatientsEntry | undefined => {

  return patientsEntries.find(p => Number(p.id) === id);
}

const addPatient = (entry: NewPatientsEntry): PatientsEntry => {
  const newPatientEntry = {
    id: uuid(),
    ...entry
  };

  patientsEntries.push(newPatientEntry);
  return newPatientEntry;
};

export default {
  getAllPatients,
  getNonSensitivePatientsEntries,
  findBYId,
  addPatient
};