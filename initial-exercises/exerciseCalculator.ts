import parseArgs from './validator';

interface Result {
  periodLength: number;
  trainingDays: number;
  target: number;
  average: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
}

const calculateExercises = (args: Array<number>, target: number): Result => {

  const periodLength: number = args.length;
  const trainingDays = args.filter((d) => d > 0).length;
  const totalTime = args.reduce((a, b) => a + b);
  const average = totalTime / args.length;
  const success = average >= target;
  let rating: number;
  let ratingDescription: string;

  switch(true) {
  case ((target - average) > 5):
    rating = 3;
    ratingDescription = 'Could be better';
    break;
  case ((target - average) > 0):
    rating = 2;
    ratingDescription = 'Almost there';
    break;
  case ((target - average) <= 0):
    rating = 1;
    ratingDescription = 'Excellent';
    break;
  default:
    throw new Error('Something went wrong...');
  }

  return {
    periodLength,
    trainingDays,
    target,
    average,
    success,
    rating,
    ratingDescription
  };
};

if (process.argv[1].includes('exerciseCalculator.ts')) {
  try {
    const [ , , ...args] = [...process.argv];
    const [target, ...data] = parseArgs(args, 2, args.length);
    console.log(calculateExercises(data, target));
  } catch (error: unknown) {
    let errorMessage = '\n' + 'Something bad happened...';
    if (error instanceof Error) {
      errorMessage += '\n' + 'Error: ' + error.message;
    }
    console.error('\x1b[31m%s\x1b[0m', errorMessage);
  }
}

export default calculateExercises;
