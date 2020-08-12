export interface StateMachine {
  transition(state: string, event: string): TransitionResult;
}

export interface TransitionResult {
  state: string;
}
