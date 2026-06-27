# アプリ中毒ガード（iOS / Screen Time API）

「つい開いてしまう」アプリを、起動時に確認画面で割り込んで抑える iOS アプリ。
[@kensuu さんのアイデア](https://x.com/kensuu) の iPhone 版です。

iOS にはアプリ起動を任意に乗っ取る一般 API はありませんが、**Screen Time API**
（FamilyControls / ManagedSettings / DeviceActivity）を使うと、指定したアプリの起動時に
**システムのシールド画面**を出し、その見た目とボタン挙動をカスタムできます。本アプリはこれで
「本当に開く？」の割り込みを実現しています。

## 構成（4 ターゲット）

| ターゲット | 役割 |
| --- | --- |
| `AppGuard`（メインアプリ） | Screen Time の許可、ガード対象アプリの選択、ブロックの ON/OFF、今日の記録と理由付け |
| `ShieldConfig`（App Extension） | 割り込み画面（シールド）の見た目。アプリ名・今日の開いた回数・「本当に開く？」を表示 |
| `ShieldAction`（App Extension） | シールドのボタン処理。「開く」→記録して一時解除／「やめる」→閉じる |
| `DeviceActivityMonitor`（App Extension） | スケジュール境界でシールドを再適用する保険 |

共有データ（理由・開いた記録）は App Group `group.com.example.appguard` 経由で
`UserDefaults` に保存します（外部送信なし）。

## 必要なもの

- **Mac + Xcode 15 以上**
- **実機の iPhone（iOS 16 以上）** — Screen Time API はシミュレータでは動きません
- **Apple Developer アカウント**（有料）と **Family Controls ケイパビリティ**
  - 開発用は Xcode で `Family Controls` を追加すれば動作します
  - App Store 配布には Apple への [Family Controls (Distribution) エンタイトルメント申請](https://developer.apple.com/contact/request/family-controls-distribution) が別途必要です

## ビルド手順

`.xcodeproj` はリポジトリに含めず、[XcodeGen](https://github.com/yonaskolb/XcodeGen) で生成します。

```bash
brew install xcodegen
cd ios
xcodegen generate
open AppGuard.xcodeproj
```

Xcode 側で必要な設定:

1. 4 つのターゲットそれぞれの **Signing & Capabilities** で自分の **Team** を選択
   （`project.yml` の `DEVELOPMENT_TEAM` に Team ID を入れておくと自動化できます）
2. 各ターゲットに **Family Controls** と **App Groups（`group.com.example.appguard`）** が
   付いていることを確認（entitlements ファイルで設定済み）
3. バンドル ID を自分のものに変更する場合は `project.yml` と各 `*.entitlements`、`SharedStore.swift`
   の App Group 名をまとめて置き換える
4. 実機を繋いで `AppGuard` を Run

## 使い方

1. 起動 → **「Screen Time を許可する」** をタップして承認
2. **「アプリ／カテゴリを選ぶ」** でガードしたいアプリ（X / Instagram など）を選択
3. **「ブロックを有効化」** を ON
4. 対象アプリを開くと割り込み画面が出る
   - **開く（記録する）** … 1 回としてカウントし、今回だけ通す
   - **やめる** … アプリを閉じる
5. メインアプリの **「今日の記録」** で、各オープンに後から理由（暇つぶし／仕事で…）を付けられる

## 既知の制約（iOS の仕様）

- **シールドのボタンは 2 つまで。** スクショの「どうして開いたの？」4 択はシールド上には置けない
  ため、理由はメインアプリで後から付与する形にしています。
- **使用「時間」の即時計測は不可。** シールドは起動を検知できますが滞在時間は取れないため、本アプリは
  「回数」ベースです（時間ベースの上限は DeviceActivity のしきい値で別途実装可能）。
- **一時解除の戻し**は、メインアプリを次に開いたとき（および Monitor 拡張のスケジュール境界）に
  再シールドされます。即時の時間制限グレースが必要なら DeviceActivity のスケジュールで拡張してください。
- Screen Time API のため**実機・iOS 16 以上・Family Controls エンタイトルメント必須**です。
