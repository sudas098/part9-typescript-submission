import { z } from 'zod';

export interface DiagnoseEntry {
     code: string,
    name: string,
    latin?: string
};

export const Gender = {
  Male: 'male',
  Female: 'female',
  Other: 'other'
} as const;

export type Gender = typeof Gender [keyof typeof Gender];



export const PatientsSchemaEntry = z.object({
  name: z.string(),
  dateOfBirth: z.iso.date(),
  ssn: z.string().optional(),
  gender: z.enum(Gender),
  occupation: z.string()
});

export type NewPatientsEntry = z.infer<typeof PatientsSchemaEntry>;

export interface PatientsEntry extends NewPatientsEntry {
  id: string
} 

export type NonSensitiveDiagnoseEntry = Omit<DiagnoseEntry, 'latin'>;

export type NonSensitivePatientEntry = Omit<PatientsEntry, 'ssn'>;

