import {
  DiagnosisType,
  DiagnosisResult,
  AxisPercentage,
  UserProfile,
} from "@/types/diagnosis";

type DiagnosisTypeData = Omit<
  DiagnosisResult,
  "axisPercentage" | "salaryProjection" | "aiInsight"
>;

export const diagnosisTypeData: Record<DiagnosisType, DiagnosisTypeData> = {
  // Strategic + Data + Leadership + Ambition
  SDLA: {
    type: "SDLA",
    title: "戦略ファームのエース候補",
    subtitle: "Strategy × Data × Leadership × Ambition",
    description:
      "論理的思考力・数値分析力・リーダーシップ・向上心を兼ね備えた、まさにコンサルタントのモデル型。マッキンゼー・BCG・ベインなどトップファームのパートナー候補として最も高いポテンシャルを持つタイプです。",
    strengths: ["仮説思考・構造化思考", "データドリブンな意思決定", "チームを引っ張るリーダーシップ", "高い目標設定と達成意欲"],
    challenges: ["完璧主義が足を引っ張ることも", "スピードより質を求めすぎる傾向", "チームへの過剰な要求"],
    consultingFit: 95,
    recommendedRoles: [
      { title: "戦略コンサルタント", firm: "MBB（マッキンゼー/BCG/ベイン）", fitScore: 95, description: "最も親和性が高い。早期選考・リファラル活用を推奨" },
      { title: "戦略コンサルタント", firm: "ATカーニー/ローランドベルガー", fitScore: 90, description: "即戦力採用でのオファーが期待できる" },
      { title: "経営企画・事業開発", firm: "PE/スタートアップ", fitScore: 85, description: "コンサル後のキャリアとしても最有力" },
    ],
    consultingAdvice: {
      overview: "あなたはコンサルタントとして最高の素養を持っています。あとは「コンサルタントとしての型」を身につけるだけで、即戦力として活躍できます。",
      strengthsToLeverage: ["論理的分析力をケース面接で最大限発揮", "リーダーシップ経験をBEI面接でアピール", "数値実績を具体的に言語化"],
      skillsToAcquire: ["コンサルタントの資料作成フォーマット（Pyramid Principle）", "業界知識の幅を広げる（金融・製造・小売など）", "クライアント関係構築のスキル"],
      timeline: "3〜6ヶ月の集中準備でMBBを狙える",
      firstStep: "まずは当チャンネルの選考対策コンテンツを活用し、ケース面接の練習を開始しましょう",
    },
    lineCtaMessage: "あなたはMBB狙える素質があります！限定選考サポートの詳細をLINEでお届けします👇",
  },

  // Strategic + Data + Leadership + Balance
  SDLB: {
    type: "SDLB",
    title: "バランス型戦略コンサルタント",
    subtitle: "Strategy × Data × Leadership × Balance",
    description:
      "高い分析力とリーダーシップを持ちながら、持続可能なペースを重視するタイプ。総合系ファームやシニアポジションでの活躍が期待できます。長期的な信頼関係構築に優れた安定型のコンサルタント。",
    strengths: ["分析力×リーダーシップの両立", "持続可能な高パフォーマンス", "チームの安定と成果を両立"],
    challenges: ["競争激しい環境でのスピード感", "野心的な目標設定の弱さ"],
    consultingFit: 85,
    recommendedRoles: [
      { title: "マネジメントコンサルタント", firm: "デロイト/PwC/EY", fitScore: 88, description: "総合系ファームのシニアアソシエイト〜マネージャー" },
      { title: "ITコンサルタント", firm: "アクセンチュア/IBM", fitScore: 82, description: "テクノロジー×経営の橋渡し役として活躍" },
      { title: "経営企画", firm: "大手事業会社", fitScore: 80, description: "コンサル経験後の着地点として最適" },
    ],
    consultingAdvice: {
      overview: "あなたの安定感と分析力は総合系ファームで高く評価されます。ワークライフバランスを保ちながら高収入を実現できるポジションが多数あります。",
      strengthsToLeverage: ["データ分析実績の具体化", "リーダーシップ事例の整理", "長期的な信頼関係構築力のアピール"],
      skillsToAcquire: ["デジタル・DX関連の知識", "業界特化の深い知識（金融・医療・製造など）", "提案書作成スキル"],
      timeline: "6〜9ヶ月で総合系ファームへの転職を実現",
      firstStep: "希望する業界・サービスラインを絞り込み、的確なアピールポイントを整理しましょう",
    },
    lineCtaMessage: "総合系ファームで年収アップを狙いませんか？あなたに合った求人をLINEで紹介します👇",
  },

  // Strategic + Data + eXpert + Ambition
  SDXA: {
    type: "SDXA",
    title: "データ戦略の専門家",
    subtitle: "Strategy × Data × Expert × Ambition",
    description:
      "深い分析力と戦略思考を持ちながら、特定領域での専門性を極めることで高い価値を発揮するタイプ。データアナリティクス・フィンテック・経営コンサルの専門家として重宝される存在です。",
    strengths: ["深い分析・定量思考", "専門領域での圧倒的な知識", "高い向上心と自己研鑽"],
    challenges: ["横断的なリーダーシップの弱さ", "専門性の外への発信力"],
    consultingFit: 80,
    recommendedRoles: [
      { title: "データ/デジタルコンサルタント", firm: "McKinsey QuantumBlack/BCG Gamma", fitScore: 88, description: "データ専門チームでの活躍が期待できる" },
      { title: "戦略コンサルタント（専門特化）", firm: "A.T.カーニー/L.E.K.", fitScore: 82, description: "特定産業・機能での専門家コンサルタント" },
      { title: "シニアアナリスト", firm: "PE/VC/投資銀行", fitScore: 78, description: "高報酬の分析専門ポジション" },
    ],
    consultingAdvice: {
      overview: "あなたの専門性×分析力は希少価値があります。その専門性を武器に、コンサルティング業界で際立った存在になれます。",
      strengthsToLeverage: ["専門領域での実績・成果の数値化", "データ分析ポートフォリオの作成", "業界内ネットワークの活用"],
      skillsToAcquire: ["戦略フレームワーク（3C/4P/Porter等）", "クライアントコミュニケーション・ストーリーライン構築", "チームをリードする経験"],
      timeline: "6〜12ヶ月でデータ専門コンサルへ転身",
      firstStep: "専門領域のケーススタディを作成し、コンサルへの転身ストーリーを磨きましょう",
    },
    lineCtaMessage: "あなたの専門性はコンサル業界で武器になります！LINEで詳しくご相談ください👇",
  },

  SDXB: {
    type: "SDXB",
    title: "安定志向の分析エキスパート",
    subtitle: "Strategy × Data × Expert × Balance",
    description:
      "高い分析能力と戦略眼を持ちながら、安定したキャリアを好む専門家タイプ。インハウスのシニアアナリスト・経営企画などで高い価値を発揮します。",
    strengths: ["深い分析力と論理思考", "専門知識の積み重ね", "安定したパフォーマンス"],
    challenges: ["新環境への適応スピード", "競合との差別化"],
    consultingFit: 70,
    recommendedRoles: [
      { title: "経営企画・事業企画", firm: "大手事業会社", fitScore: 85, description: "分析力を活かした経営支援ポジション" },
      { title: "ITコンサルタント", firm: "総合系ファーム", fitScore: 75, description: "安定環境でのコンサルキャリア" },
      { title: "シニアアナリスト", firm: "調査系・シンクタンク", fitScore: 72, description: "深い分析を武器にした専門家ポジション" },
    ],
    consultingAdvice: {
      overview: "あなたの分析力を活かしつつ、安定したキャリアアップを実現できるポジションが多数あります。",
      strengthsToLeverage: ["分析実績の具体的な数値化", "業務効率改善の成果アピール", "専門知識の深さをアピール"],
      skillsToAcquire: ["コンサルタント的な提案力", "コミュニケーション・プレゼンスキル", "プロジェクトマネジメント"],
      timeline: "6〜12ヶ月でコンサル系企業へ転身",
      firstStep: "分析実績をポートフォリオ化し、応募先に合わせたアピールを整理しましょう",
    },
    lineCtaMessage: "分析スキルを活かしてキャリアアップしませんか？LINEで求人をご紹介します👇",
  },

  SRLA: {
    type: "SRLA",
    title: "人を動かす戦略家",
    subtitle: "Strategy × Relation × Leadership × Ambition",
    description:
      "戦略思考と人間関係構築力を兼ね備えたリーダータイプ。クライアントを魅了しながら組織を動かす「コンサルの花形」とも言えるタイプ。BIG4やハンズオン型ファームで特に力を発揮します。",
    strengths: ["人を巻き込む推進力", "戦略立案×関係構築の両立", "クライアント信頼の獲得"],
    challenges: ["定量分析の強化が必要", "感情に流されない意思決定"],
    consultingFit: 88,
    recommendedRoles: [
      { title: "ビジネスコンサルタント", firm: "BIG4（デロイト/PwC/EY/KPMG）", fitScore: 90, description: "クライアントリレーション×戦略で最大の強みを発揮" },
      { title: "組織変革コンサルタント", firm: "マーサー/コーンフェリー", fitScore: 85, description: "人・組織を扱うテーマで圧倒的な強み" },
      { title: "事業開発・BD", firm: "PE/成長企業", fitScore: 82, description: "ネットワークと戦略眼を活かした職種" },
    ],
    consultingAdvice: {
      overview: "人を動かす力と戦略思考の組み合わせは、コンサルタントの中でも希少です。クライアント向けポジションで特に高く評価されます。",
      strengthsToLeverage: ["リーダーシップ・推進力の具体事例", "人間関係構築による実績アピール", "変革プロジェクト経験のアピール"],
      skillsToAcquire: ["定量分析・Excel/データスキル", "ロジカルシンキングの強化", "財務・会計の基礎知識"],
      timeline: "3〜6ヶ月でBIG4コンサルへの転職が現実的",
      firstStep: "変革実績・リーダーシップエピソードを整理し、コンサル向けに言語化しましょう",
    },
    lineCtaMessage: "あなたのリーダーシップはBIG4で活かせます！LINEで個別相談を受け付けています👇",
  },

  SRLB: {
    type: "SRLB",
    title: "信頼のリーダー型コンサルタント",
    subtitle: "Strategy × Relation × Leadership × Balance",
    description:
      "人間関係を大切にしながら組織をリードする、信頼性の高いリーダータイプ。変革よりも着実な成果を重視し、クライアントからの長期的な信頼を得ることが得意です。",
    strengths: ["高い信頼関係構築力", "チームの安定した運営", "長期的なクライアント関係"],
    challenges: ["スピード感・アジリティの向上", "定量分析力の強化"],
    consultingFit: 80,
    recommendedRoles: [
      { title: "マネジメントコンサルタント", firm: "BIG4・総合系ファーム", fitScore: 82, description: "長期プロジェクトで信頼関係を活かす" },
      { title: "HRコンサルタント", firm: "マーサー/コーンフェリー/リクルートMS", fitScore: 85, description: "人材・組織領域での活躍が期待できる" },
      { title: "経営企画", firm: "事業会社（メガベンチャー含む）", fitScore: 78, description: "安定したリーダーポジション" },
    ],
    consultingAdvice: {
      overview: "あなたの誠実さと信頼性は、長期にわたるコンサルティング関係で最大の武器になります。",
      strengthsToLeverage: ["長期プロジェクト・継続案件の実績", "チームビルディングの成功事例", "クライアントとの信頼構築エピソード"],
      skillsToAcquire: ["データ分析・Excel高度活用", "業界知識の幅を広げる", "変革プロジェクトの経験を積む"],
      timeline: "6〜9ヶ月で総合コンサルへの転職を実現",
      firstStep: "信頼関係を活かした実績をまとめ、コンサル転職の軸を明確にしましょう",
    },
    lineCtaMessage: "あなたの信頼構築力は大手コンサルで重宝されます！LINEで詳細をご確認ください👇",
  },

  SRXA: {
    type: "SRXA",
    title: "人材・組織の専門家",
    subtitle: "Strategy × Relation × Expert × Ambition",
    description:
      "人との関係性を大切にしながら、特定専門領域での深い知識を武器にする野心的な専門家タイプ。HRコンサル・組織開発・人材系ファームで圧倒的な強みを発揮します。",
    strengths: ["深い専門知識と人間力の両立", "人材・組織への深い理解", "強い向上心"],
    challenges: ["組織全体のリードへの挑戦", "定量的な成果の可視化"],
    consultingFit: 75,
    recommendedRoles: [
      { title: "HRコンサルタント", firm: "コーンフェリー/マーサー/ウイリス", fitScore: 88, description: "人材・報酬・組織設計で専門性を発揮" },
      { title: "組織開発コンサルタント", firm: "リクルート/パーソル系列", fitScore: 82, description: "人材ビジネスの知見×コンサルスキル" },
      { title: "エグゼクティブサーチ", firm: "ヘッドハンター系ファーム", fitScore: 78, description: "人的ネットワークと専門知識を活かす" },
    ],
    consultingAdvice: {
      overview: "人への深い理解と専門知識は、HRコンサルティング分野で最強の武器です。人材×コンサルの希少人材として高く評価されます。",
      strengthsToLeverage: ["人材・採用・育成に関する実績の整理", "専門領域（HR/組織/教育等）の深さをアピール", "変革に貢献したエピソードの言語化"],
      skillsToAcquire: ["戦略的思考・フレームワーク活用", "データ分析による示唆出し", "経営視点のHR提案力"],
      timeline: "6〜9ヶ月でHR系コンサルへの転換",
      firstStep: "HRコンサルタントとして活躍するロールモデルを研究し、自分の強みとのマッチを確認しましょう",
    },
    lineCtaMessage: "HR・組織コンサルで年収アップを実現しませんか？LINEで詳しくご相談ください👇",
  },

  SRXB: {
    type: "SRXB",
    title: "縁の下の専門家",
    subtitle: "Strategy × Relation × Expert × Balance",
    description:
      "専門知識と良好な人間関係を武器に、安定した環境でじっくりと価値を発揮するタイプ。専門系コンサルやインハウスのシニアスペシャリストとして長期的な活躍が期待できます。",
    strengths: ["専門知識の深さ", "良好な人間関係の構築", "安定したパフォーマンス"],
    challenges: ["変化への適応力", "収入・キャリアの積極的な向上"],
    consultingFit: 65,
    recommendedRoles: [
      { title: "専門職コンサルタント", firm: "税理士法人/法律事務所系", fitScore: 75, description: "専門知識を活かしたアドバイザリー" },
      { title: "シニアスペシャリスト", firm: "大手事業会社・金融機関", fitScore: 78, description: "専門家として長期的に貢献" },
      { title: "HRビジネスパートナー", firm: "外資系企業", fitScore: 72, description: "人事専門家としてのキャリア" },
    ],
    consultingAdvice: {
      overview: "あなたの専門性と人間力は確かな価値を持っています。一歩踏み出すことで、現状より大幅な年収アップが見込めます。",
      strengthsToLeverage: ["専門知識の幅広い活用事例", "信頼関係による成果のアピール", "安定した成果実績"],
      skillsToAcquire: ["戦略的思考・提案力の強化", "マーケット感覚・収益意識の向上", "自己ブランディング"],
      timeline: "9〜12ヶ月でのキャリアアップを目指す",
      firstStep: "まずは現在の専門性の市場価値を確認することから始めましょう",
    },
    lineCtaMessage: "あなたのキャリアをプロがサポートします！LINEで無料相談を受け付け中👇",
  },

  EDLA: {
    type: "EDLA",
    title: "実行力抜群のデータリーダー",
    subtitle: "Execution × Data × Leadership × Ambition",
    description:
      "「やると決めたら必ずやる」実行力と、データに基づく判断力、そしてチームを引っ張る力を持つ野心家タイプ。PMコンサル・デジタル変革・オペレーション改善領域で特に力を発揮します。",
    strengths: ["圧倒的な実行力と推進力", "データ×実行の両立", "チームを成果に導くリーダーシップ"],
    challenges: ["戦略・全体観の視野を広げる", "大局観・Why思考の強化"],
    consultingFit: 78,
    recommendedRoles: [
      { title: "PMコンサルタント", firm: "アクセンチュア/デロイト", fitScore: 85, description: "大規模変革の実行推進で強みを発揮" },
      { title: "オペレーションコンサルタント", firm: "BIG4系", fitScore: 82, description: "業務改革・効率化プロジェクトのリード" },
      { title: "CDO・DX推進", firm: "事業会社", fitScore: 78, description: "デジタル変革の実行責任者" },
    ],
    consultingAdvice: {
      overview: "あなたの実行力はコンサルでも希少な強みです。「戦略を実行に落とす」役割で圧倒的な価値を発揮できます。",
      strengthsToLeverage: ["数値で語れる実行実績", "チームを成果に導いたエピソード", "データを活用した改善事例"],
      skillsToAcquire: ["戦略フレームワークと全体観", "クライアント提案・プレゼン力", "業界横断の知見"],
      timeline: "6〜9ヶ月でPM/オペレーションコンサルへ転身",
      firstStep: "実行した改善プロジェクトの成果をROIで整理し、コンサル向けに再フレーミングしましょう",
    },
    lineCtaMessage: "実行力でコンサル業界を変えませんか？LINEで個別相談を受け付けています👇",
  },

  EDLB: {
    type: "EDLB",
    title: "安定型の実行リーダー",
    subtitle: "Execution × Data × Leadership × Balance",
    description:
      "確実な実行力とデータ活用力でチームを安定的に運営するリーダータイプ。大企業のコンサルや安定型の総合ファームで高い評価を得られます。",
    strengths: ["安定した実行とデータ活用", "チームの安定運営", "リスク管理能力"],
    challenges: ["変革・挑戦への踏み出し", "戦略思考の強化"],
    consultingFit: 72,
    recommendedRoles: [
      { title: "ITコンサルタント", firm: "アクセンチュア/富士通コンサル", fitScore: 80, description: "システム×業務改革での活躍" },
      { title: "プロジェクトマネージャー", firm: "BIG4・大手SIer", fitScore: 78, description: "大規模プロジェクトの安定運営" },
      { title: "業務改革推進", firm: "大手事業会社", fitScore: 75, description: "社内変革のリード役" },
    ],
    consultingAdvice: {
      overview: "安定的な実行力とデータ活用力は、大規模プロジェクトを成功に導く力として高く評価されます。",
      strengthsToLeverage: ["プロジェクト成功の実績（納期・品質・コスト）", "データ活用による改善実績", "チームマネジメント経験"],
      skillsToAcquire: ["戦略思考・提案力の向上", "コンサルタント的な問題設定力", "クライアント折衝スキル"],
      timeline: "6〜12ヶ月でコンサル系への転身",
      firstStep: "PMの実績をROIで整理し、コンサルティング提案力へのアップグレードを図りましょう",
    },
    lineCtaMessage: "安定キャリアをさらにステップアップしませんか？LINEで相談受付中👇",
  },

  EDXA: {
    type: "EDXA",
    title: "スペシャリスト型実行者",
    subtitle: "Execution × Data × Expert × Ambition",
    description:
      "専門分野での深い知識と実行力、強い向上心を持つタイプ。特定領域（IT・金融・医療等）での専門家コンサルタントや、スタートアップのCXOとして活躍できます。",
    strengths: ["専門×実行の圧倒的強み", "データを活用した実行力", "高い向上心"],
    challenges: ["組織全体のリード力", "大局観・戦略思考"],
    consultingFit: 70,
    recommendedRoles: [
      { title: "テクニカルコンサルタント", firm: "アクセンチュア/IBM/NTTデータ", fitScore: 82, description: "専門技術×コンサルで高単価案件" },
      { title: "業界専門コンサルタント", firm: "業界特化ファーム", fitScore: 78, description: "専門知識を最大限に活かせる環境" },
      { title: "CTO/VPoE候補", firm: "スタートアップ/メガベンチャー", fitScore: 75, description: "専門性×実行力でのキャリアアップ" },
    ],
    consultingAdvice: {
      overview: "専門性と実行力の組み合わせは、特化型コンサルや高成長企業で非常に高く評価されます。",
      strengthsToLeverage: ["専門領域での具体的な実績", "データを活用した改善成果", "自己研鑽の姿勢と成果"],
      skillsToAcquire: ["コンサルタント的な提案・ストーリーライン構築", "クライアントコミュニケーション", "ビジネス全体像の理解"],
      timeline: "6〜9ヶ月で専門特化コンサルへの転身",
      firstStep: "専門領域での実績を体系化し、コンサルティングへの転換ストーリーを作りましょう",
    },
    lineCtaMessage: "専門性を活かして年収を大幅アップしませんか？LINEで詳しくご相談ください👇",
  },

  EDXB: {
    type: "EDXB",
    title: "着実な専門家プレイヤー",
    subtitle: "Execution × Data × Expert × Balance",
    description:
      "専門性と実行力を持ちながら、安定した環境での深化を好むタイプ。シニアエンジニア・アナリスト・専門職として安定的なキャリアアップが可能です。",
    strengths: ["専門知識の深さ", "確実な実行力", "安定したパフォーマンス"],
    challenges: ["キャリアの積極的な転換", "市場価値の向上への意識"],
    consultingFit: 60,
    recommendedRoles: [
      { title: "シニアエンジニア/アーキテクト", firm: "ITコンサル/SIer", fitScore: 75, description: "技術専門家としてのキャリア継続" },
      { title: "データアナリスト/サイエンティスト", firm: "IT・金融・流通", fitScore: 72, description: "データ専門家としての市場価値向上" },
      { title: "業務改革担当", firm: "大手事業会社", fitScore: 70, description: "専門×実行でのインハウス活躍" },
    ],
    consultingAdvice: {
      overview: "あなたの専門性と実行力は確かな市場価値を持っています。少しの視点転換でコンサル転身も十分に狙えます。",
      strengthsToLeverage: ["専門領域での実績の可視化", "業務効率化の成果数値化", "実行してきたプロジェクトの整理"],
      skillsToAcquire: ["コンサルタント的な提案力・問題設定", "クライアント・上位職とのコミュニケーション", "ビジネス・経営視点の強化"],
      timeline: "9〜15ヶ月でのキャリアステップアップ",
      firstStep: "現在の専門性の市場価値を把握し、一歩踏み出す準備を整えましょう",
    },
    lineCtaMessage: "今の専門性を活かしてキャリアを変えませんか？LINEで無料診断中👇",
  },

  ERLA: {
    type: "ERLA",
    title: "人を動かす実行型リーダー",
    subtitle: "Execution × Relation × Leadership × Ambition",
    description:
      "人間力と実行力を兼ね備えた、現場を動かすリーダータイプ。組織変革・HR・人材系コンサルで特に高い評価を受けます。野心もあり、マネージャー以上への早期昇格も期待できます。",
    strengths: ["チームを動かす人間力", "確実な実行と成果達成", "強いリーダーシップと野心"],
    challenges: ["論理・定量思考の強化", "戦略的な視野の拡大"],
    consultingFit: 75,
    recommendedRoles: [
      { title: "組織変革コンサルタント", firm: "マーサー/コーンフェリー/アクセンチュア", fitScore: 82, description: "人と組織の変革実行で強みを発揮" },
      { title: "営業/BD コンサルタント", firm: "BIG4・総合ファーム", fitScore: 78, description: "人間力×実行力での新規開拓" },
      { title: "人材系スタートアップ幹部", firm: "HR Tech/人材系ベンチャー", fitScore: 80, description: "事業と人を動かす役割で活躍" },
    ],
    consultingAdvice: {
      overview: "人を動かす実行力は、コンサルで最も希少な資質の一つです。あとは「論理の言語化」ができれば鬼に金棒です。",
      strengthsToLeverage: ["チームを率いて達成した成果の言語化", "人材育成・組織変革の実績", "野心と実行力のアピール"],
      skillsToAcquire: ["ロジカルシンキング・MECEな思考", "データを使った示唆出し", "戦略フレームワークの習得"],
      timeline: "6〜9ヶ月でHR/組織系コンサルへ転身",
      firstStep: "リーダーシップ実績を構造的に整理し、コンサル向けのBEIを準備しましょう",
    },
    lineCtaMessage: "あなたのリーダーシップでコンサル業界を変えましょう！LINEで相談受付中👇",
  },

  ERLB: {
    type: "ERLB",
    title: "信頼されるチームリーダー",
    subtitle: "Execution × Relation × Leadership × Balance",
    description:
      "チームから信頼され、着実に結果を出すリーダータイプ。安定した環境での人材・組織系コンサルやHRビジネスパートナーとして長期的な活躍が期待できます。",
    strengths: ["チームからの信頼と求心力", "着実な実行と成果", "持続可能なリーダーシップ"],
    challenges: ["高い目標設定への挑戦", "変化・変革への積極性"],
    consultingFit: 68,
    recommendedRoles: [
      { title: "HRビジネスパートナー", firm: "外資系・メガベンチャー", fitScore: 80, description: "人事のビジネスパートナーとして活躍" },
      { title: "組織開発コンサルタント", firm: "HR系ファーム", fitScore: 75, description: "組織と人を育てる専門家" },
      { title: "マネージャー", firm: "BIG4コンサル", fitScore: 70, description: "安定したチームマネジメントで評価される" },
    ],
    consultingAdvice: {
      overview: "あなたのチームリーダーとしての実績は、HR・組織系コンサルで高く評価されます。",
      strengthsToLeverage: ["チームビルディングの成功事例", "組織改善・風土変革の実績", "メンバーの成長を促した経験"],
      skillsToAcquire: ["戦略的人事・組織設計", "データを活用した人事施策の効果測定", "経営視点のHR提案"],
      timeline: "9〜12ヶ月でHR/組織系へキャリアチェンジ",
      firstStep: "HR・組織開発分野の知識習得と、自身の実績の整理から始めましょう",
    },
    lineCtaMessage: "チームリーダーとしての強みを活かしませんか？LINEで無料相談中👇",
  },

  ERXA: {
    type: "ERXA",
    title: "現場の人間系エキスパート",
    subtitle: "Execution × Relation × Expert × Ambition",
    description:
      "特定専門領域での深い実行経験と人間力、強い向上心を持つタイプ。業界特化型コンサルや専門職コンサルタントとして、現場からの提案力で勝負できます。",
    strengths: ["専門×人間力×向上心の三拍子", "現場感覚を活かした提案", "信頼と実績の積み上げ"],
    challenges: ["定量・論理思考の補強", "全体戦略視点の獲得"],
    consultingFit: 68,
    recommendedRoles: [
      { title: "業界特化コンサルタント", firm: "業界専門ファーム（医療/建設/物流等）", fitScore: 80, description: "業界知識×人間力で差別化" },
      { title: "フィールドコンサルタント", firm: "総合系ファーム", fitScore: 72, description: "現場改善×提案力で活躍" },
      { title: "事業会社の変革推進", firm: "大手事業会社", fitScore: 75, description: "業界知識×人脈を活かす" },
    ],
    consultingAdvice: {
      overview: "業界の深い知識と人間力は、業界特化コンサルで最大の武器になります。",
      strengthsToLeverage: ["業界特有の実績・知見の整理", "人間力・ネットワークの活用", "現場改善の実績数値化"],
      skillsToAcquire: ["コンサルタント的な提案・構造化力", "論理的なプレゼン・レポート作成", "業界横断の知見"],
      timeline: "9〜12ヶ月で業界特化コンサルへ転身",
      firstStep: "得意業界・専門領域を明確にし、そこに特化したコンサル転職を検討しましょう",
    },
    lineCtaMessage: "業界特化コンサルで年収を上げませんか？LINEで求人紹介中👇",
  },

  ERXB: {
    type: "ERXB",
    title: "現場を支える縁の下の力持ち",
    subtitle: "Execution × Relation × Expert × Balance",
    description:
      "専門知識と人間力を活かして現場を支える、縁の下の力持ちタイプ。安定した環境での専門家・シニアスタッフとして高い評価を得られます。コンサルへの転身はやや挑戦になりますが、確実な成長が見込めます。",
    strengths: ["専門知識と現場感覚", "人間関係の構築力", "安定した実行力"],
    challenges: ["積極的なキャリア転換", "論理・戦略思考の強化", "市場価値の向上"],
    consultingFit: 55,
    recommendedRoles: [
      { title: "業務コンサルタント", firm: "中堅ファーム・独立系", fitScore: 65, description: "専門×現場感覚を活かしたコンサル入門" },
      { title: "シニアスペシャリスト", firm: "大手事業会社", fitScore: 75, description: "専門家としての安定したキャリア" },
      { title: "採用コンサルタント/CA", firm: "人材エージェント", fitScore: 70, description: "人間力を武器にしたキャリアチェンジ" },
    ],
    consultingAdvice: {
      overview: "コンサルへの転身は挑戦になりますが、あなたの専門性と人間力は確かな価値を持っています。段階的なキャリアアップで着実に成長できます。",
      strengthsToLeverage: ["専門領域での確かな実績", "人間関係を活かした成果のアピール", "着実な実行力の可視化"],
      skillsToAcquire: ["ロジカルシンキングの基礎から実践", "データリテラシー・分析基礎", "戦略的なキャリア設計"],
      timeline: "12〜18ヶ月で段階的なキャリアアップ",
      firstStep: "まずは現在の市場価値を把握し、スキルアップの方向性を明確にしましょう",
    },
    lineCtaMessage: "今から始めるキャリア転換をプロがサポート！LINEで無料相談中👇",
  },
};

export function getDiagnosisType(
  axis1: number,
  axis2: number,
  axis3: number,
  axis4: number
): DiagnosisType {
  const a1: "S" | "E" = axis1 >= 0 ? "S" : "E";
  const a2: "D" | "R" = axis2 >= 0 ? "D" : "R";
  const a3: "L" | "X" = axis3 >= 0 ? "L" : "X";
  const a4: "A" | "B" = axis4 >= 0 ? "A" : "B";
  return `${a1}${a2}${a3}${a4}` as DiagnosisType;
}

export function calculateAxisPercentage(
  axis1: number,
  axis2: number,
  axis3: number,
  axis4: number
): AxisPercentage {
  // -100~+100 を 0~100% に変換
  const toPercent = (val: number, positiveLabel: "S" | "D" | "L" | "A") => {
    const normalized = (val + 100) / 2; // 0~100
    return positiveLabel === "S" || positiveLabel === "D" || positiveLabel === "L" || positiveLabel === "A"
      ? normalized
      : 100 - normalized;
  };

  return {
    s_percent: Math.round((axis1 + 100) / 2),
    d_percent: Math.round((axis2 + 100) / 2),
    l_percent: Math.round((axis3 + 100) / 2),
    a_percent: Math.round((axis4 + 100) / 2),
  };
}

export function calculateSalaryProjection(
  currentSalary: number,
  diagnosisType: DiagnosisType,
  consultingFit: number
) {
  const fitMultiplier = consultingFit / 100;
  const base = currentSalary;

  // コンサルタントの年収テーブル（万円）
  const growth = {
    year1: Math.round(base * (1 + 0.15 * fitMultiplier)),
    year3: Math.round(base * (1 + 0.45 * fitMultiplier)),
    year5: Math.round(base * (1 + 0.85 * fitMultiplier)),
    bestCase: Math.round(base * (1 + 1.5 * fitMultiplier)),
  };

  return {
    current: base,
    year1: Math.max(growth.year1, base + 50),
    year3: Math.max(growth.year3, base + 150),
    year5: Math.max(growth.year5, base + 300),
    bestCase: Math.max(growth.bestCase, base + 500),
    currency: "万円" as const,
  };
}
