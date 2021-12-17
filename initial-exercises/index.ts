import express, { Request } from 'express';
import parseArgs from './validator';
import bmiCalculator from './bmiCalculator';
import exerciseCalculator from './exerciseCalculator';

const app = express();
app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const params = req.query;

  try {
    const [length, mass] = parseArgs([`${params.height}`, `${params.weight}`], 2, 2);
    const bmi = bmiCalculator(length, mass);

    res.json({ weight: mass, height: length, bmi });
  } catch (error: unknown) {
    let errorMessage = '';
    if (error instanceof Error) {
      errorMessage += error.message;
    }
    console.error('\x1b[31m%s\x1b[0m', errorMessage);

    res.status(400).json({ error: 'malformatted parameters' });
  }

});

interface ExBody {
  daily_exercises: Array<number>;
  target: number;
}

interface CustomRequest<T> extends Request {
  body: T
}

app.post('/exercises', (req: CustomRequest<ExBody>, res) => {
  const body: ExBody = req.body;
  const { daily_exercises, target } = body;

  if ('target' in body && 'daily_exercises' in body) {

    try {
      const daily_exercises_vals = parseArgs(daily_exercises, 1, daily_exercises.length);
      const target_vals = parseArgs([target], 1, 1);
      const result = exerciseCalculator(daily_exercises_vals, target_vals[0]);

      res.json({ ...result });
    } catch (error: unknown) {
      let errorMessage = '';
      if (error instanceof Error) {
        errorMessage += error.message;
      }
      console.error('\x1b[31m%s\x1b[0m', errorMessage);

      res.status(400).json({ error: 'malformatted parameters' });
    }

  } else {

    res.status(400).json({ error: 'parameters missing'});

  }




});

const PORT = 3002;

app.listen(PORT, () => {
  console.log('\x1b[36m%s\x1b[0m', `🚀 Server running on http://localhost:${PORT}/`);
});
