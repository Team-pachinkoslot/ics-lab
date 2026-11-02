import type { LabRuntimeProvider, RuntimeSession } from "./types";

export class RuntimeNotConfiguredError extends Error {
  readonly code = "RUNTIME_NOT_CONFIGURED";

  constructor() {
    super("VM接続は次フェーズで対応します。ランタイムは未接続です。");
    this.name = "RuntimeNotConfiguredError";
  }
}

/** 設定値にかかわらず実接続を行わない、フェーズ1唯一のProvider。 */
export class DisabledRuntimeProvider implements LabRuntimeProvider {
  async start(labId: string): Promise<RuntimeSession> {
    void labId;
    throw new RuntimeNotConfiguredError();
  }

  async getStatus(sessionId: string): Promise<RuntimeSession> {
    void sessionId;
    throw new RuntimeNotConfiguredError();
  }

  async stop(sessionId: string): Promise<void> {
    void sessionId;
    throw new RuntimeNotConfiguredError();
  }

  async reset(sessionId: string): Promise<void> {
    void sessionId;
    throw new RuntimeNotConfiguredError();
  }
}
