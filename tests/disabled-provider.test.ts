import { describe, expect, it } from "vitest";
import { DisabledRuntimeProvider, RuntimeNotConfiguredError } from "@/lib/runtime/disabled-provider";

describe("未接続ランタイムのフェイルクローズ", () => {
  const provider = new DisabledRuntimeProvider();

  it.each(["start", "getStatus", "stop", "reset"] as const)("%s は成功や仮セッションを返さず明確なエラーで拒否する", async (operation) => {
    await expect(provider[operation]("test-id")).rejects.toBeInstanceOf(RuntimeNotConfiguredError);
    await expect(provider[operation]("test-id")).rejects.toMatchObject({ code: "RUNTIME_NOT_CONFIGURED" });
  });
});
