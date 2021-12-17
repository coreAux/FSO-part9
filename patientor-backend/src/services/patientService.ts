import {v1 as uuid} from 'uuid';

import patientData from "../data/patients";

import { Patient, PublicPatient, NewPatient, NewEntry } from "../types";

let patients: Array<Patient> = patientData;

const getPatients = (): Array<PublicPatient> => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const findPatientById = (id: string): Patient | undefined => {
  const onePatient = patients.find((d) => d.id === id);

  return onePatient;
};

const addPatient = (entry: NewPatient): Patient => {

  const newPatient = {
    id: uuid(),
    ...entry
  };

  patients.push(newPatient);
  return newPatient;
};

const updatePatient = (patient: Patient, entry: NewEntry): Patient => {

  const newEntry = {
    id: uuid(),
    ...entry
  };

  patient.entries = [newEntry, ...patient.entries];

  patients = patients.map((p) => p.id === patient.id ? patient : p);

  return patient;
};

export default {
  getPatients,
  addPatient,
  findPatientById,
  updatePatient
};
