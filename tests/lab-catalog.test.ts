import { describe, expect, it } from "vitest";
import { labCatalog } from "@/lib/labs/catalog";
import { getLabBySlug, getLabNumber, getLabs } from "@/lib/labs/queries";

describe("フェーズ1カタログの要件", () => {
  it("固定ID・slug・正式名称・難易度・時間を3件だけ保持する", () => {
    expect(labCatalog.map(({ id, slug, title, difficulty, estimatedMinutes }) => ({ id, slug, title, difficulty, estimatedMinutes }))).toEqual([
      { id: "water-01", slug: "water-treatment", title: "浄水場へのサイバー攻撃", difficulty: "beginner", estimatedMinutes: 30 },
      { id: "power-01", slug: "power-substation", title: "変電設備の異常対応", difficulty: "intermediate", estimatedMinutes: 45 },
      { id: "rail-01", slug: "railway-operations", title: "鉄道運行管理システム", difficulty: "advanced", estimatedMinutes: 60 },
    ]);
    expect(new Set(labCatalog.map(({ id }) => id)).size).toBe(3);
    expect(new Set(labCatalog.map(({ slug }) => slug)).size).toBe(3);
  });

  it("すべて準備中で、紹介・学習目標・予定設備を備える", () => {
    for (const lab of labCatalog) {
      expect(lab.status).toBe("coming_soon");
      expect(lab.description.length).toBeGreaterThan(20);
      expect(lab.objectives.length).toBeGreaterThan(0);
      expect(lab.assets.length).toBeGreaterThan(0);
      expect([...lab.objectives, ...lab.assets]).not.toContain("");
    }
  });

  it("取得関数は共通カタログを参照し、番号を順に付ける", () => {
    expect(getLabs()).toBe(labCatalog);
    labCatalog.forEach((lab, index) => {
      expect(getLabBySlug(lab.slug)).toBe(lab);
      expect(getLabNumber(lab.id)).toBe(`0${index + 1}`);
    });
  });

  it.each(["unknown", "", "WATER-TREATMENT", "__proto__", "water-treatment/extra"])("未知のslug %j を解決しない", (slug) => {
    expect(getLabBySlug(slug)).toBeUndefined();
  });
});
