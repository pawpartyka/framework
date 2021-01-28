import { Schedule } from '../../src/lib/services/schedule';

describe('Schedule', () => {
  it('should extends Map', () => {
    expect(new Schedule()).toBeInstanceOf(Map);
  });
});
