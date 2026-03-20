import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { UserProfile, DiagnosisResult } from "@/types/diagnosis";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userProfile, result }: { userProfile: UserProfile; result: DiagnosisResult } = body;

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const prompt = buildPrompt(userProfile, result);

    const message = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const insight =
      message.content[0].type === "text" ? message.content[0].text : "";

    return NextResponse.json({ insight });
  } catch (error) {
    console.error("AI診断エラー:", error);
    return NextResponse.json(
      { error: "診断処理中にエラーが発生しました" },
      { status: 500 }
    );
  }
}

function buildPrompt(userProfile: UserProfile, result: DiagnosisResult): string {
  const {
    currentRole,
    yearsOfExperience,
    currentSalary,
    industry,
    skills,
  } = userProfile;

  const {
    type,
    title,
    consultingFit,
    axisPercentage,
    recommendedRoles,
  } = result;

  return `あなたはトップクラスのコンサルティング業界専門のキャリアアドバイザーです。
以下のユーザーの情報と診断結果をもとに、パーソナライズされた転職アドバイスを200〜300字で日本語で提供してください。

【ユーザー情報】
- 現職: ${currentRole}（${industry}業界）
- 経験年数: ${yearsOfExperience}年
- 現在年収: ${currentSalary}万円
- 保有スキル: ${skills.join("、")}

【診断結果】
- タイプ: ${type}「${title}」
- コンサルフィット度: ${consultingFit}%
- 戦略思考度: ${axisPercentage.s_percent}%
- データ思考度: ${axisPercentage.d_percent}%
- リーダーシップ度: ${axisPercentage.l_percent}%
- 向上心度: ${axisPercentage.a_percent}%
- おすすめロール: ${recommendedRoles.map((r) => `${r.title}（${r.firm}）`).join("、")}

【出力形式】
以下の形式で出力してください：
1. この人固有の強みを1〜2文で褒める（具体的に）
2. コンサル転職における最大のチャンスポイントを1文で
3. 今すぐ取るべき具体的なアクション1つを1文で
4. 年収アップの現実的な可能性を1文で（数字を入れること）

全体を通じて前向きで、行動を促すトーンにしてください。`;
}
