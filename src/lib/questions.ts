import { Question } from "@/types/diagnosis";

// 28問（各軸7問）、5段階リッカートスケール形式（「当てはまる/当てはまらない」で答えられる断定形）
// direction: "positive" = 強く同意(5)がpositive軸方向
// direction: "negative" = 強く同意(5)がnegative軸方向（スコア計算時に反転）

export const questions: Question[] = [
  // ===== 経験・実績 (7問) =====
  {
    id: 1,
    category: "experience",
    text: "これまでの仕事で、「なぜこの問題が起きているか」を深く考え、根本的な解決策を提案したことがある",
    axisImpact: { axis: 1, direction: "positive", weight: 3 },
  },
  {
    id: 2,
    category: "experience",
    text: "数字やデータを使って仕事の成果を説明したり、資料をまとめたりするのが得意だ",
    axisImpact: { axis: 2, direction: "positive", weight: 2 },
  },
  {
    id: 3,
    category: "experience",
    text: "チームや部下をまとめてプロジェクトを進めた経験が豊富だ",
    axisImpact: { axis: 3, direction: "positive", weight: 3 },
  },
  {
    id: 4,
    category: "experience",
    text: "より良い環境や高い報酬を求めて、積極的にキャリアチェンジや挑戦をしてきた",
    axisImpact: { axis: 4, direction: "positive", weight: 2 },
  },
  {
    id: 5,
    category: "experience",
    text: "会社の上層部や重要な取引先に対して、提案やプレゼンをした経験がある",
    axisImpact: { axis: 1, direction: "positive", weight: 2 },
  },
  {
    id: 6,
    category: "experience",
    text: "複数のプロジェクトや業務を同時に抱えて、上手くやりくりした経験がある",
    axisImpact: { axis: 3, direction: "positive", weight: 2 },
  },
  {
    id: 7,
    category: "experience",
    text: "年収・役職などのキャリア目標を明確に意識して行動し、実際に成果を上げてきた",
    axisImpact: { axis: 4, direction: "positive", weight: 2 },
  },

  // ===== スキル・能力 (7問) =====
  {
    id: 8,
    category: "skill",
    text: "物事の原因と結果を論理的に整理して、筋道立てて説明するのが得意だ",
    axisImpact: { axis: 1, direction: "positive", weight: 3 },
  },
  {
    id: 9,
    category: "skill",
    text: "Excelや集計ツールを使って、データを分析したりグラフを作ったりするのが得意だ",
    axisImpact: { axis: 2, direction: "positive", weight: 2 },
  },
  {
    id: 10,
    category: "skill",
    text: "相手に伝わりやすい資料やレポートを作るのが得意だ",
    axisImpact: { axis: 1, direction: "positive", weight: 2 },
  },
  {
    id: 11,
    category: "skill",
    text: "会議やミーティングで、みんなの意見をまとめて話し合いをうまく進められる",
    axisImpact: { axis: 3, direction: "positive", weight: 2 },
  },
  {
    id: 12,
    category: "skill",
    text: "自分の専門分野や得意領域では、周囲よりも深い知識や技術を持っている",
    axisImpact: { axis: 3, direction: "negative", weight: 2 },
  },
  {
    id: 13,
    category: "skill",
    text: "業界全体のトレンドや競合状況など、広い視点で物事を調べて分析できる",
    axisImpact: { axis: 2, direction: "positive", weight: 2 },
  },
  {
    id: 14,
    category: "skill",
    text: "スケジュール管理やリスク対策など、プロジェクト全体を見渡して進める能力がある",
    axisImpact: { axis: 3, direction: "positive", weight: 3 },
  },

  // ===== 適性・好み (7問) =====
  {
    id: 15,
    category: "aptitude",
    text: "「どうすれば問題を解決できるか」を考えることに、強いやりがいを感じる",
    axisImpact: { axis: 1, direction: "positive", weight: 2 },
  },
  {
    id: 16,
    category: "aptitude",
    text: "感情や雰囲気よりも、データや根拠を重視して物事を判断する",
    axisImpact: { axis: 2, direction: "positive", weight: 3 },
  },
  {
    id: 17,
    category: "aptitude",
    text: "グループの中で自然とリーダー的な役割を担うことが多い",
    axisImpact: { axis: 3, direction: "positive", weight: 3 },
  },
  {
    id: 18,
    category: "aptitude",
    text: "何か新しいことを始めるとき、まず全体の計画を立ててから動く",
    axisImpact: { axis: 1, direction: "positive", weight: 2 },
  },
  {
    id: 19,
    category: "aptitude",
    text: "人の気持ちや関係性を大切にしながら、周囲と協力して物事を進めることが得意だ",
    axisImpact: { axis: 2, direction: "negative", weight: 2 },
  },
  {
    id: 20,
    category: "aptitude",
    text: "知らない分野や難しい課題でも、積極的に調べてチャレンジするのが好きだ",
    axisImpact: { axis: 1, direction: "positive", weight: 2 },
  },
  {
    id: 21,
    category: "aptitude",
    text: "専門的なスキルを極めて、その道のプロとして認められることに価値を感じる",
    axisImpact: { axis: 3, direction: "negative", weight: 2 },
  },

  // ===== マインドセット (7問) =====
  {
    id: 22,
    category: "mindset",
    text: "新しいスキルや知識を身につけるために、自分からセミナーや勉強会に積極的に参加している",
    axisImpact: { axis: 4, direction: "positive", weight: 1 },
  },
  {
    id: 23,
    category: "mindset",
    text: "高収入・高い地位を目指して、ハードな環境でも積極的に頑張りたい",
    axisImpact: { axis: 4, direction: "positive", weight: 3 },
  },
  {
    id: 24,
    category: "mindset",
    text: "5年後には今よりずっと高いポジションや収入を実現していたい",
    axisImpact: { axis: 4, direction: "positive", weight: 2 },
  },
  {
    id: 25,
    category: "mindset",
    text: "プレッシャーのかかる場面でも、冷静に状況を整理して対処できる",
    axisImpact: { axis: 1, direction: "positive", weight: 2 },
  },
  {
    id: 26,
    category: "mindset",
    text: "自分の市場価値を常に意識して、良いチャンスがあれば積極的につかみにいきたい",
    axisImpact: { axis: 4, direction: "positive", weight: 3 },
  },
  {
    id: 27,
    category: "mindset",
    text: "未知の難しい問題に直面すると、不安よりも「面白い」と感じることが多い",
    axisImpact: { axis: 1, direction: "positive", weight: 2 },
  },
  {
    id: 28,
    category: "mindset",
    text: "組織の中心で重要な役割を担い、自分なしでは回らないポジションに就きたい",
    axisImpact: { axis: 3, direction: "positive", weight: 2 },
  },
];
