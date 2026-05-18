export enum InternalActionType {
  INIT = "INIT",
  LOG = "LOG",
}

export type InternalInitAction = { type: InternalActionType.INIT };
export type InternalLogAction = {
  type: InternalActionType.LOG;
  message: string;
};
export type InternalAction = InternalInitAction | InternalLogAction;
