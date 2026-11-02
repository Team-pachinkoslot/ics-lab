import { afterEach, describe, expect, it, vi } from "vitest";
import { GET as health } from "@/app/api/health/route";
import { GET as list } from "@/app/api/labs/route";
import { GET as detail } from "@/app/api/labs/[slug]/route";
import { labCatalog } from "@/lib/labs/catalog";

afterEach(() => vi.useRealTimers());

describe("API契約", () => {
  it("ヘルスチェックはWeb稼働とVM未接続を返し、UTC応答時刻を毎回生成する", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-11-02T01:00:00.000Z"));
    const first = health();
    expect(first.status).toBe(200);
    expect(first.headers.get("cache-control")).toBe("no-store");
    expect(await first.json()).toEqual({ status: "ok", service: "ics-lab-web", runtime: "not_configured", timestamp: "2026-11-02T01:00:00.000Z" });
    vi.setSystemTime(new Date("2026-11-03T02:03:04.000Z"));
    expect(await health().json()).toHaveProperty("timestamp", "2026-11-03T02:03:04.000Z");
  });

  it("一覧は共有カタログ全件と件数を返す", async () => {
    const response = list();
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ data: labCatalog, meta: { total: 3 } });
  });

  it.each(labCatalog)("$slug の詳細は同じLabデータを返す", async (lab) => {
    const response = await detail(new Request(`http://localhost/api/labs/${lab.slug}`), { params: Promise.resolve({ slug: lab.slug }) });
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ data: lab });
  });

  it("未知のslugはJSONエラーとHTTP 404を返す", async () => {
    const response = await detail(new Request("http://localhost/api/labs/unknown"), { params: Promise.resolve({ slug: "unknown" }) });
    expect(response.status).toBe(404);
    expect(response.headers.get("content-type")).toContain("application/json");
    expect(await response.json()).toEqual({ error: { code: "LAB_NOT_FOUND", message: "指定された演習が見つかりません。" } });
  });
});
