export enum InternalActionType {
  INIT = "INTERNAL_INIT",
  LOG = "INTERNAL_LOG",
}

export type InternalInitAction = { type: InternalActionType.INIT };
export type InternalLogAction = {
  type: InternalActionType.LOG;
  message: string;
};
export type InternalAction = InternalInitAction | InternalLogAction;
