export const generateId = (): string =>
   (Math.random() * 0.99 + 1.1).toString(36).substring(2);

export const keyValueObject = <T>(key: string, value: T): { [key: string]: T } => ({
   [key]: value,
});
