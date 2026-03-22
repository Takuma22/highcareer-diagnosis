import { Question } from "@/types/diagnosis";

// 28問（6軸、各4〜5問）、全問ポジティブ断定形
// direction: 全問 "positive" = 「とても当てはまる(5)」= 高スコア
// 全問「全く当てはまらない」→ 全軸ほぼ0 → 「準備中」タイプ
// 軸: 1=実行力 2=戦略思考 3=対人力 4=専門性 5=リーダーシップ 6=適応力

export const questions: Question[] = [
  // ===== 経験・実績 (7問) =====
  {
    id: 1,
    category: "experience",
    text: "これまでKPIや数値目標を自分で設定し、着実に達成してきた実績がある",
    axisImpact: { axis: 1, direction: "positive", weight: 3 },
  },
  {
    id: 2,
    category: "experience",
    text: "これまでの仕事で「なぜこの問題が起きているか」を深く分析し、根本的な解決策を提案したことがある",
    axisImpact: { axis: 2, direction: "positive", weight: 3 },
  },
  {
    id: 3,
    category: "experience",
    text: "交渉や調整ごとで相手を説得・納得させた経験が豊富だ",
    axisImpact: { axis: 3, direction: "positive", weight: 2 },
  },
  {
    id: 4,
    category: "experience",
    text: "業界や職種における専門的な経験を豊富に積んできた",
    axisImpact: { axis: 4, direction: "positive", weight: 3 },
  },
  {
    id: 5,
    category: "experience",
    text: "チームや部下をまとめてプロジェクトを成功に導いた経験がある",
    axisImpact: { axis: 5, direction: "positive", weight: 3 },
  },
  {
    id: 6,
    category: "experience",
    text: "転職・異動・新プロジェクトなど環境の変化に素早く適応してきた",
    axisImpact: { axis: 6, direction: "positive", weight: 2 },
  },
  {
    id: 7,
    category: "experience",
    text: "会社の上層部や重要な取引先に提案・プレゼンをした経験がある",
    axisImpact: { axis: 1, direction: "positive", weight: 2 },
  },

  // ===== スキル・能力 (7問) =====
  {
    id: 8,
    category: "skill",
    text: "物事の原因と結果を論理的に整理して、筋道立てて説明するのが得意だ",
    axisImpact: { axis: 2, direction: "positive", weight: 3 },
  },
  {
    id: 9,
    category: "skill",
    text: "特定の分野で深い知識やスキルを持ち、他者に教えられるレベルである",
    axisImpact: { axis: 4, direction: "positive", weight: 2 },
  },
  {
    id: 10,
    category: "skill",
    text: "相手の立場に立って物事を考え、自然に信頼関係を築くのが得意だ",
    axisImpact: { axis: 3, direction: "positive", weight: 2 },
  },
  {
    id: 11,
    category: "skill",
    text: "会議やミーティングでみんなの意見をまとめて話し合いをうまく進められる",
    axisImpact: { axis: 5, direction: "positive", weight: 2 },
  },
  {
    id: 12,
    category: "skill",
    text: "複数のプロジェクトや業務を同時に抱えても、上手くやりくりして結果を出せる",
    axisImpact: { axis: 1, direction: "positive", weight: 2 },
  },
  {
    id: 13,
    category: "skill",
    text: "データや数値を根拠に判断・意思決定を行う習慣がある",
    axisImpact: { axis: 2, direction: "positive", weight: 2 },
  },
  {
    id: 14,
    category: "skill",
    text: "知らない分野でも積極的に調べてすぐに習得できる",
    axisImpact: { axis: 6, direction: "positive", weight: 2 },
  },

  // ===== 適性・好み (7問) =====
  {
    id: 15,
    category: "aptitude",
    text: "初対面の人ともすぐに打ち解けて関係を築くのが得意だ",
    axisImpact: { axis: 3, direction: "positive", weight: 2 },
  },
  {
    id: 16,
    category: "aptitude",
    text: "複雑な課題を分解して構造的に整理することにやりがいを感じる",
    axisImpact: { axis: 2, direction: "positive", weight: 2 },
  },
  {
    id: 17,
    category: "aptitude",
    text: "グループの中で自然とリーダー的な役割を担うことが多い",
    axisImpact: { axis: 5, direction: "positive", weight: 2 },
  },
  {
    id: 18,
    category: "aptitude",
    text: "資格取得や専門的な学習に積極的に取り組んでいる",
    axisImpact: { axis: 4, direction: "positive", weight: 2 },
  },
  {
    id: 19,
    category: "aptitude",
    text: "目標を設定したら、困難があっても最後までやり遂げることにこだわる",
    axisImpact: { axis: 1, direction: "positive", weight: 2 },
  },
  {
    id: 20,
    category: "aptitude",
    text: "チームの人間関係を良好に保つことが得意で、周囲から頼られることが多い",
    axisImpact: { axis: 3, direction: "positive", weight: 2 },
  },
  {
    id: 21,
    category: "aptitude",
    text: "新しい環境や変化への対応が速く、柔軟に対処するのが得意だ",
    axisImpact: { axis: 6, direction: "positive", weight: 2 },
  },

  // ===== マインドセット (7問) =====
  {
    id: 22,
    category: "mindset",
    text: "方向性を示してメンバーを引っ張るリーダー役にやりがいを感じる",
    axisImpact: { axis: 5, direction: "positive", weight: 2 },
  },
  {
    id: 23,
    category: "mindset",
    text: "プレッシャーのかかる場面でも冷静に結果を出せる自信がある",
    axisImpact: { axis: 1, direction: "positive", weight: 2 },
  },
  {
    id: 24,
    category: "mindset",
    text: "困難や失敗を糧に素早く立ち直り、新しいアプローチで挑戦できる",
    axisImpact: { axis: 6, direction: "positive", weight: 2 },
  },
  {
    id: 25,
    category: "mindset",
    text: "自分の専門領域をさらに深め、業界のエキスパートになりたいという意欲がある",
    axisImpact: { axis: 4, direction: "positive", weight: 2 },
  },
  {
    id: 26,
    category: "mindset",
    text: "長期的な視点でキャリアや事業の戦略を立て、逆算して行動している",
    axisImpact: { axis: 2, direction: "positive", weight: 2 },
  },
  {
    id: 27,
    category: "mindset",
    text: "顧客や上司・同僚から信頼されており、重要な場面で頼られることが多い",
    axisImpact: { axis: 3, direction: "positive", weight: 2 },
  },
  {
    id: 28,
    category: "mindset",
    text: "重要な場面で最終的な意思決定を下し、その結果に責任を持てる",
    axisImpact: { axis: 5, direction: "positive", weight: 2 },
  },
];
