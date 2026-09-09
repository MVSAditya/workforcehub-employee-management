import { CustomDatePipe } from './custom-date.pipe';

describe('CustomDatePipe', () => {
  it('should format the date in a readable format', () => {
    const pipe = new CustomDatePipe();
    expect(pipe.transform('2024-09-15')).toContain('15');
  });
});
