import { Schedule } from '../../src/lib/services/schedule';

describe('Schedule', () => {
  it('should extends Array', () => {
    expect(new Schedule()).toBeInstanceOf(Array);
  });
});
