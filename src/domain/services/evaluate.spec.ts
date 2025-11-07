import { evaluateGuess } from './evaluate';

describe('evaluateGuess', () => {
  it('marks correct letters', () => {
    expect(evaluateGuess('TEST', 'TEST')).toEqual(['correct','correct','correct','correct']);
  });
  it('marks present and absent letters', () => {
    expect(evaluateGuess('ABCD', 'AAXX')).toEqual(['correct','absent','absent','absent']);
  });
  it('handles duplicate letters properly', () => {
    expect(evaluateGuess('BALAI', 'AAAAA')).toEqual(['absent','correct','absent','correct','absent']);
  });
});
