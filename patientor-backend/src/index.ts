import express from 'express';
import cors from 'cors';

import diagnoseRouter from "./routes/diagnoses";
import patientsRouter from "./routes/patients";

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3001;

app.get('/api/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

app.use('/api/diagnoses', diagnoseRouter);
app.use('/api/patients', patientsRouter);

app.listen(PORT, () => {
  console.log('\x1b[36m%s\x1b[0m', `🚀 Server running on http://localhost:${PORT}/`);
});


/*
9.12: Patientor backend, step5
Create a POST endpoint /api/patients for adding patients. Ensure that you can add patients also from the frontend. You can create unique ids of type string using the uuid library:

import {v1 as uuid} from 'uuid'
const id = uuid()
9.13: Patientor backend, step6
Set up safe parsing, validation and type guards to the POST /api/patients request.

Refactor the gender field to use an enum type.


linter
linter-ui-default
hyperclick
intentions
*/
