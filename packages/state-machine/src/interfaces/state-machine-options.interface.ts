export interface StateMachineOptions {
  states: {
    [state: string]: {
      on: {
        [state: string]: string;
      };
    };
  };
}
