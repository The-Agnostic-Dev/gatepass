import { NairaPipe, formatNaira } from './naira.pipe';

describe('NairaPipe', () => {
  const pipe = new NairaPipe();

  it('formats whole naira amounts with separators', () => {
    expect(formatNaira(25000)).toBe('₦25,000');
  });

  it('uses the free label for zero when given one', () => {
    expect(pipe.transform(0, 'Free')).toBe('Free');
    expect(pipe.transform(0)).toBe('₦0');
  });

  it('renders nothing for missing amounts', () => {
    expect(pipe.transform(null)).toBe('');
  });
});
