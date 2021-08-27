export const meanAverage = (numbers: number[]): number | undefined =>
   numbers.length > 0 ? (sum(numbers) / numbers.length) : undefined;

const sum = (numbers: number[]) =>
   numbers.reduce((sum, value) => sum + value, 0);
