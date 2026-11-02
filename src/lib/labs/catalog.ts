import type { Lab } from "./types";

/** 画面とAPIが共有する唯一のシナリオデータ。時間は仮設定。 */
export const labCatalog: readonly Lab[] = [
  {
    id: "water-01",
    slug: "water-treatment",
    title: "浄水場へのサイバー攻撃",
    description:
      "水位・水圧・ポンプ・バルブに関する異常を調査し、模擬設備を安全な状態に戻すことを目標とする演習です。",
    difficulty: "beginner",
    status: "coming_soon",
    objectives: ["異常値の特定", "安全停止", "復旧"],
    assets: ["タンク", "ポンプ", "バルブ", "センサー"],
    estimatedMinutes: 30,
  },
  {
    id: "power-01",
    slug: "power-substation",
    title: "変電設備の異常対応",
    description:
      "仮想設備で発生した不正操作イベントや状態変化を、操作履歴・監視データから調査する演習です。",
    difficulty: "intermediate",
    status: "coming_soon",
    objectives: ["不正操作の発見", "封じ込め"],
    assets: ["変電設備", "開閉器", "計測値"],
    estimatedMinutes: 45,
  },
  {
    id: "rail-01",
    slug: "railway-operations",
    title: "鉄道運行管理システム",
    description:
      "模擬運行情報・列車位置・ダイヤの不整合を検知し、安全確認できない場合は運行を保留する判断を学ぶ演習です。",
    difficulty: "advanced",
    status: "coming_soon",
    objectives: ["運行情報不整合の検知", "安全な運行判断"],
    assets: ["仮想列車", "運行情報", "ダイヤ"],
    estimatedMinutes: 60,
  },
];
