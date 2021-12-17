const parseArgs = (args: Array<string> | Array<number>, min: number, max: number): Array<number> => {

  if (args.length < min) throw new Error('Not enough arguments');
  if (args.length > max) throw new Error('Too many arguments');

  args.forEach((a) => {

    if (isNaN(Number(a))) {
      throw new Error('Provided values were not numbers!');
    }

  });

  const numbersArr = args.map((a) => Number(a));

  return numbersArr;
};

export default parseArgs;
