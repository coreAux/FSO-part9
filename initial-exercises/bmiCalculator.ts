import parseArgs from './validator';

const calculateBmi = (l: number, m: number): string => {
  const lengthInMeters = l / 100;
  const bmi = (m / (lengthInMeters * lengthInMeters));

  switch(true) {
  case (bmi < 16):
    return 'Underweight (Severe thinness)';
  case (bmi < 17):
    return 'Underweight (Moderate thinness)';
  case (bmi < 18.5):
    return 'Underweight (Mild thinness)';
  case (bmi < 25):
    return 'Normal range';
  case (bmi < 30):
    return 'Overweight (Pre-obese)';
  case (bmi < 35):
    return 'Obese (Class I)';
  case (bmi < 40):
    return 'Obese (Class II)';
  case (bmi >= 40):
    return 'Obese (Class III)';
  default:
    throw new Error('Something went wrong...');
  }
};

if (process.argv[1].includes('bmiCalculator.ts')) {
  try {
    const [ , , ...args] = [...process.argv];
    const [length, mass] = parseArgs(args, 2, 2);
    console.log(calculateBmi(length, mass));
  } catch (error: unknown) {

    let errorMessage = '\n' + 'Something bad happened...';
    if (error instanceof Error) {
      errorMessage += '\n' + 'Error: ' + error.message;
    }
    console.error('\x1b[31m%s\x1b[0m', errorMessage);
  }
}

export default calculateBmi;
