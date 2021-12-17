import express from 'express';
import patientService from "../services/patientService";
import { toNewPatient, toNewEntry } from "../utils";

const router = express.Router();

router.get('/', (_req, res) => {
  res.send(patientService.getPatients());
});

router.get('/:id', (req, res) => {
  const patient = patientService.findPatientById(String(req.params.id));

  if (patient) {
    res.send(patient);
  } else {
    res.sendStatus(404);
  }
});

router.post('/', (req, res) => {
  try {
    const newPatient = toNewPatient(req.body);
    const addedPatient = patientService.addPatient(newPatient);
    res.json(addedPatient);
  } catch (error: unknown) {

    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += '\nError: ' + error.message;
    }
    console.error(errorMessage);

    let newEM = "";
    if (error instanceof Error) {
      newEM += error.message;
    }

    res.status(400).json({ error: newEM });
  }

});

router.post('/:id/entries', (req, res) => {
  const patient = patientService.findPatientById(String(req.params.id));

  if (patient) {
    try {
      const newEntry = toNewEntry(req.body);
      const updatedPatient = patientService.updatePatient(patient, newEntry);
      res.json(updatedPatient);
    } catch (error: unknown) {
      let errorMessage = 'Something went wrong.';
      if (error instanceof Error) {
        errorMessage += ' Error: ' + error.message;
      }
      res.status(400).json({error: errorMessage});
    }
  } else {
    res.status(404).send('No such patient found.');
  }

});

export default router;
