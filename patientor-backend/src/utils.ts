import { Gender, NewPatient, NewEntry, HealthCheckRating } from "./types";

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isNumber = (number: unknown): number is string => {
  return typeof number === 'number' || number instanceof Number;
};

const parseName = (name: unknown): string => {
  if (!name || !isString(name)) {
    throw new Error('Incorrect or missing name');
  }

  return name;
};

const parseDob = (dob: unknown): string => {
  if (!dob || !isString(dob) || !isDate(dob)) {
      throw new Error('Incorrect or missing date of birth: ' + dob);
  }
  return dob;
};

const parseSsn = (ssn: unknown): string => {
  if (!ssn || !isString(ssn)) {
    throw new Error('Incorrect or missing ssn');
  }

  return ssn;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isGender = (param: any): param is Gender => {
  return Object.values(Gender).includes(param as Gender);
};

const parseGender = (gender: unknown): Gender => {
  if (!gender || !isGender(gender)) {
    throw new Error('Incorrect or missing gender: ' + gender);
  }

  return gender;
};

const parseOccupation = (occupation: unknown): string => {
  if (!occupation || !isString(occupation)) {
    throw new Error('Incorrect or missing occupation');
  }

  return occupation;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const toNewPatient = (object: any): NewPatient => {
  const newEntry: NewPatient = {
    name: parseName(object.name),
    dateOfBirth: parseDob(object.dateOfBirth),
    ssn: parseSsn(object.ssn),
    gender: parseGender(object.gender),
    occupation: parseOccupation(object.occupation),
    entries: []
  };

  return newEntry;
};

// - - - - - - - - - -

const parseDescription = (description: unknown): string => {
  if (!description || !isString(description)) {
    throw new Error('Incorrect or missing description');
  }

  return description;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
      throw new Error('Incorrect or missing date: ' + date);
  }
  return date;
};

const parseSpecialist = (specialist: unknown): string => {
  if (!specialist || !isString(specialist)) {
    throw new Error('Incorrect or missing specialist');
  }

  return specialist;
};

const parseDiagnosisCodes = (diagnosisCodes: unknown): Array<string> => {
  if (!Array.isArray(diagnosisCodes)) {
    throw new Error('Incorrect or missing diagnosisCodes');
  }

  if (diagnosisCodes.length > 0) {
    diagnosisCodes.forEach((dc) => {
      if (!dc || !isString(dc)) {
        throw new Error('Incorrect diagnosisCodes');
      }
    });
  }

  return diagnosisCodes as Array<string>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isHealthCheckRating = (param: any): param is HealthCheckRating => {
  return Object.values(HealthCheckRating).includes(param as HealthCheckRating);
};

const parseHealthCheckRating = (healthCheckRating: unknown): HealthCheckRating => {
  if (!isNumber(healthCheckRating) || !isHealthCheckRating(healthCheckRating)) {
    throw new Error('Incorrect or missing healthcheck rating');
  }

  return healthCheckRating;
};

const parseEmployername = (employerName: unknown): string => {
  if (!employerName || !isString(employerName)) {
    throw new Error('Incorrect or missing employerName');
  }

  return employerName;
};

const parseDischargeCriteria = (criteria: unknown): string => {
  if (!criteria || !isString(criteria)) {
    throw new Error("Incorrect or missing criteria");
  }

  return criteria;
};

const parseDischargeDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error('Incorrect or missing date: ' + date);
  }

  return date;
};

const parseStartDate = (startDate: unknown): string => {
  if (!startDate || !isString(startDate) || !isDate(startDate)) {
    throw new Error('Incorrect or missing startDate: ' + startDate);
  }

  return startDate;
};

const parseEndDate = (endDate: unknown): string => {
  if (!endDate || !isString(endDate) || !isDate(endDate)) {
    throw new Error('Incorrect or missing endDate: ' + endDate);
  }

  return endDate;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const toNewEntry = (object: any): NewEntry => {

  switch (object.type) {
  case "HealthCheck":
    const healthCheckEntry: Extract<NewEntry, {type: "HealthCheck"}> = {
      type: "HealthCheck",
      description: parseDescription(object.description),
      date: parseDate(object.date),
      specialist: parseSpecialist(object.specialist),
      diagnosisCodes: object.diagnosisCodes ? parseDiagnosisCodes(object.diagnosisCodes) : undefined,
      healthCheckRating: parseHealthCheckRating(Number(object.healthCheckRating))
    };
    return healthCheckEntry;
  case "Hospital":
    const hospitalEntry: Extract<NewEntry, {type: "Hospital"}> = {
      type: "Hospital",
      description: parseDescription(object.description),
      date: parseDate(object.date),
      specialist: parseSpecialist(object.specialist),
      diagnosisCodes: object.diagnosisCodes ? parseDiagnosisCodes(object.diagnosisCodes) : undefined,
      discharge: {
        criteria: parseDischargeCriteria(object.discharge.criteria),
        date: parseDischargeDate(object.discharge.date)
      }
    };
    return hospitalEntry;
  case "OccupationalHealthcare":
    const occupationalHealthcareEntry: Extract<NewEntry, {type: "OccupationalHealthcare"}> = {
      type: "OccupationalHealthcare",
      description: parseDescription(object.description),
      date: parseDate(object.date),
      specialist: parseSpecialist(object.specialist),
      diagnosisCodes: object.diagnosisCodes ? parseDiagnosisCodes(object.diagnosisCodes) : undefined,
      employerName: parseEmployername(object.employerName),
      sickLeave: object.sickLeave ? { startDate: parseStartDate(object.sickLeave.startDate), endDate: parseEndDate(object.sickLeave.endDate) } : undefined
    };
    return occupationalHealthcareEntry;
  default:
    throw new Error('Inorrect or missing type.');
  }
};
