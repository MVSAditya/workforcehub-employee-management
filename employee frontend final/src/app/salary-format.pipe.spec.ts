import { SalaryFormatPipe } from './salary-format.pipe';

describe('SalaryFormatPipe', () => {
  it('should format a number into Indian Rupee format', () => {
    const pipe = new SalaryFormatPipe();
    expect(pipe.transform(250000)).toBe('₹ 2,50,000');
  });
});
