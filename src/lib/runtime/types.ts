export type RuntimeState =
  | "idle"
  | "provisioning"
  | "running"
  | "stopping"
  | "stopped"
  | "failed";

export interface RuntimeSession {
  sessionId: string;
  labId: string;
  state: RuntimeState;
}

export interface LabRuntimeProvider {
  start(labId: string): Promise<RuntimeSession>;
  getStatus(sessionId: string): Promise<RuntimeSession>;
  stop(sessionId: string): Promise<void>;
  reset(sessionId: string): Promise<void>;
}
