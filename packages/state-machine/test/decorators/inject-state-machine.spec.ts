import { INJECT_METADATA, InjectMetadata } from '@artisanjs/core';
import { InjectStateMachine } from '../../src/lib/decorators/inject-state-machine';
import { getStateMachineToken } from '../../src/lib/providers/state-machine';

describe('InjectStateMachine', () => {
  it('should set the correct metadata on the class reference', () => {
    const bar = 'bar';
    const baz = 'baz';

    class Foo {
      constructor(@InjectStateMachine(bar) bar: any,
                  @InjectStateMachine(baz) baz: any) {
      }
    }

    const metadata: InjectMetadata = Reflect.getMetadata(INJECT_METADATA, Foo);

    expect(metadata.size).toBe(2);
    expect(metadata.get(0)).toBe(getStateMachineToken(bar));
    expect(metadata.get(1)).toBe(getStateMachineToken(baz));
  });
});
