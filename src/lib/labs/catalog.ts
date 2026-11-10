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
    levels: [
      {
        difficulty: "beginner",
        title: "異常値の確認",
        description:
          "センサー値の上昇と警告ログを確認し、設備が異常な状態になっている箇所を特定するステップです。",
        objectives: ["水位と圧力の異常を特定", "警告の発生箇所を確認", "異常時の初動を理解"],
        assets: ["タンク計測値", "警報ログ", "水位センサー"],
        estimatedMinutes: 10,
      },
      {
        difficulty: "intermediate",
        title: "応急停止と封じ込め",
        description:
          "ポンプの挙動と制御系の履歴を整理し、影響範囲を絞り込んで一時停止と封じ込めを判断します。",
        objectives: ["異常の影響範囲を推定", "ポンプ停止の判断を確認", "封じ込め手順を整理"],
        assets: ["ポンプ制御", "運転履歴", "バルブ状態"],
        estimatedMinutes: 12,
      },
      {
        difficulty: "advanced",
        title: "復旧計画の立案",
        description:
          "運転条件の変化と原因候補を比較し、再起動の前提を確認して安全な復旧計画をまとめます。",
        objectives: ["原因候補を比較", "再開条件を整理", "復旧シナリオを検討"],
        assets: ["制御ログ", "ポンプ運転計画", "復旧手順"],
        estimatedMinutes: 8,
      },
    ],
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
    levels: [
      {
        difficulty: "beginner",
        title: "イベントの整理",
        description:
          "監視データと開閉器の履歴を頼りに、いつどこで異常が起きたかを整理して影響の大きさを把握します。",
        objectives: ["異常時刻を特定", "操作履歴を整理", "影響範囲を確認"],
        assets: ["制御履歴", "監視グラフ", "開閉器状態"],
        estimatedMinutes: 15,
      },
      {
        difficulty: "intermediate",
        title: "不正操作の切り分け",
        description:
          "計測値の急変と操作ログの差異を比較し、故障と不正操作の切り分けを進めます。",
        objectives: ["異常要因を切り分け", "不正操作のパターンを特定", "影響箇所を限定"],
        assets: ["負荷計測", "ログ比較", "制御パネル"],
        estimatedMinutes: 18,
      },
      {
        difficulty: "advanced",
        title: "安全復旧の計画",
        description:
          "運用制限と遮断優先順を踏まえて、復旧と安全確認をどう進めるべきかをまとめます。",
        objectives: ["遮断優先順位を検討", "再投入条件を整理", "監視設計を確認"],
        assets: ["復旧手順", "制御条件", "安全確認項目"],
        estimatedMinutes: 12,
      },
    ],
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
    levels: [
      {
        difficulty: "beginner",
        title: "位置情報と時刻の確認",
        description:
          "列車位置と運行予定のズレを見つけ、異常があるかどうかを可視化して確認する導入ステップです。",
        objectives: ["列車位置を比較", "時刻の差異を確認", "異常発生を整理"],
        assets: ["駅時刻表", "列車位置", "運行ログ"],
        estimatedMinutes: 20,
      },
      {
        difficulty: "intermediate",
        title: "運行保留の判断",
        description:
          "複数の列車やダイヤの変化を踏まえて、情報が不十分な場合に運行を停止すべきかを判断します。",
        objectives: ["安全判断基準を確認", "運行保留の条件を整理", "影響範囲を比較"],
        assets: ["ダイヤ表", "列車指令", "保安装置メモ"],
        estimatedMinutes: 22,
      },
      {
        difficulty: "advanced",
        title: "復旧と再開条件の検討",
        description:
          "一時停止後の再開に必要な安全確認と、異常が残る場合の運用制限を設計する上級レベルです。",
        objectives: ["再開条件を定義", "運用制限の影響を試算", "安全確保の判断をまとめる"],
        assets: ["再開計画", "安全確認チェック", "列車運行表"],
        estimatedMinutes: 18,
      },
    ],
  },
];
