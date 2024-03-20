export enum ServerAction {
  Start = "Start",
  Stop = "Stop",
}

export function isServerActionValid(value: string) {
  return Object.values(ServerAction).includes(value as ServerAction);
}
