export interface CoursePartBase {
  name: string;
  exerciseCount: number;
  description?: string; // Moved description here to be shared
}

export interface CoursePartBasic extends CoursePartBase {
  kind: "basic";
}

export interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: "group";
}

export interface CoursePartBackground extends CoursePartBase {
  backgroundMaterial: string;
  kind: "background";
}

export interface CoursePartSpecial extends CoursePartBase {
  requirements: string[];
  kind: "special";
}

export type CoursePart = 
  | CoursePartBasic 
  | CoursePartGroup 
  | CoursePartBackground
  | CoursePartSpecial;

export const assertNever = (value: never): never => {
  throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
};