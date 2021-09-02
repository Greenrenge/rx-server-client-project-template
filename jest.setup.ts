// @ts-ignore
global.console = {
   log: jest.fn(),
   info: jest.fn(),
   warn: jest.fn(),
   error: jest.fn(),
   debug: console.debug,
   trace: console.trace,
}
