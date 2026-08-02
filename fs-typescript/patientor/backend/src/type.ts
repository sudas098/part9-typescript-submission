import { z } from 'zod';

export interface DiagnoseEntry {
  code: string;
  name: string;
  latin?: string;
}

export const Gender = {
  Male: 'male',
  Female: 'female',
  Other: 'other'
} as const;

export type Gender = typeof Gender[keyof typeof Gender];

export const HealthCheckRating = {
  Healthy: 0,
  LowRisk: 1,
  HighRisk: 2,
  CriticalRisk: 3
} as const;

export type HealthCheckRating = typeof HealthCheckRating[keyof typeof HealthCheckRating];

interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Array<DiagnoseEntry['code']>;
}

export interface HospitalEntry extends BaseEntry {
  type: "Hospital";
  discharge: {
    date: string;
    criteria: string;
  };
}

export interface OccupationalHealthcareEntry extends BaseEntry {
  type: "OccupationalHealthcare";
  employerName: string;
  sickLeave?: {
    startDate: string;
    endDate: string;
  };
}

export interface HealthCheckEntry extends BaseEntry {
  type: "HealthCheck";
  healthCheckRating: HealthCheckRating;
}

export type Entry =
  | HospitalEntry
  | OccupationalHealthcareEntry
  | HealthCheckEntry;


type UnionOmit<T, K extends string | symbol> = T extends unknown ? Omit<T, K> : never;
export type NewEntry = UnionOmit<Entry, 'id'>;


const baseEntrySchema = z.object({
  description: z.string(),
  date: z.string(),
  specialist: z.string(),
  diagnosisCodes: z.array(z.string()).optional(),
});

const hospitalEntrySchema = baseEntrySchema.extend({
  type: z.literal("Hospital"),
  discharge: z.object({
    date: z.string(),
    criteria: z.string(),
  }),
});

const occupationalHealthcareEntrySchema = baseEntrySchema.extend({
  type: z.literal("OccupationalHealthcare"),
  employerName: z.string(),
  sickLeave: z.object({
    startDate: z.string(),
    endDate: z.string(),
  }).optional(),
});

const healthCheckEntrySchema = baseEntrySchema.extend({
  type: z.literal("HealthCheck"),
  healthCheckRating: z.union([
    z.literal(HealthCheckRating.Healthy),
    z.literal(HealthCheckRating.LowRisk),
    z.literal(HealthCheckRating.HighRisk),
    z.literal(HealthCheckRating.CriticalRisk),
  ]),
});

export const NewEntrySchema = z.discriminatedUnion("type", [
  hospitalEntrySchema,
  occupationalHealthcareEntrySchema,
  healthCheckEntrySchema,
]);

export interface PatientsEntry {
  id: string;
  name: string;
  ssn?: string;
  occupation: string;
  gender: Gender;
  dateOfBirth: string;
  entries: Entry[];
}

export const PatientsSchemaEntry = z.object({
  name: z.string(),
  dateOfBirth: z.string(),
  ssn: z.string().optional(),
  gender: z.enum(Gender),
  occupation: z.string(),
  entries: z.array(z.custom<Entry>()).default([])
});

export type NewPatientsEntry = z.infer<typeof PatientsSchemaEntry>;

export type NonSensitiveDiagnoseEntry = Omit<DiagnoseEntry, 'latin'>;

export type NonSensitivePatientsEntry = Omit<PatientsEntry, 'ssn' | 'entries'>;