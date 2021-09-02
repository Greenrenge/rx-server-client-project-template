module.exports = {
   roots: ['<rootDir>'],
   testMatch: ['**/?(*.)+(spec|test).+(ts|tsx)'],
   transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest',
   },
};
