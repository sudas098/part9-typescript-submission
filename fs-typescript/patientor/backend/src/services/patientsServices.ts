import { v1 as uuid } from 'uuid';
import { NonSensitivePatientsEntry, PatientsEntry, NewPatientsEntry, Entry, NewEntry } from '../type.ts';
import patientsEntries from '../data/patients.ts';

const getAllPatients = (): PatientsEntry[] => {
  return patientsEntries;
};

const getNonSensitivePatientsEntries = (): NonSensitivePatientsEntry[] => {
  return patientsEntries.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const findById = (id: string): PatientsEntry | undefined => {
  const patient = patientsEntries.find(p => p.id === id);
  return patient;
};

const addPatient = (entry: NewPatientsEntry): PatientsEntry => {
  const newPatientEntry = {
    id: uuid(),
    ...entry,
  };

  patientsEntries.push(newPatientEntry);
  return newPatientEntry;
};

const addEntry = (patientId: string, entry: NewEntry): Entry | undefined => {
  const patient = patientsEntries.find(p => p.id === patientId);
  if (!patient) {
    return undefined;
  }

  const newEntry: Entry = {
    id: uuid(),
    ...entry
  };

  patient.entries.push(newEntry);
  return newEntry;
};

export default {
  getAllPatients,
  getNonSensitivePatientsEntries,
  findById,
  addPatient,
  addEntry
};