
# IGNITE Official Site — Antigravity Handoff

Version: 2.0  
Prepared for: Google Antigravity  
Public continuity: 3rd Single「No Limits」リリース時点

## 1. このパッケージの目的

架空の5人組ダンス＆ボーカルグループ「IGNITE」の公式サイトを、Antigravityがそのまま実装へ移せる粒度で定義した資料一式。

今回の重要な変更は次の4点。

1. 公開済み作品を3rd Single「No Limits」までに限定
2. Sunoへの送客ではなく、公式サイト内で公開済み楽曲をフル再生
3. 常駐音楽プレイヤーとミニツールをサイト体験の中心に配置
4. 新譜ごとに見た目を切り替える「Campaign Skin」と、段階的な更新運用を導入

## 2. Antigravityへ渡す順番

1. `ANTIGRAVITY_MASTER_PROMPT.md`
2. `ignite-official-site-spec-v2.md`
3. `ui-wireframes.md`
4. `release-operations.md`
5. `data/site-config.json`
6. `data/members.json`
7. `data/discography.json`
8. `data/articles.json`
9. `data/news.json`
10. `data/asset-manifest.json`

Antigravityには、上記を同じ作業コンテキストへ投入すること。

## 3. 正本と公開範囲

- 世界観と年代：`world-v02.md`を最優先
- 現在の公開地点：2022年9月、3rd Single「No Limits」
- 公開作品：
  - Indies Mini Album「FIRESTARTER」
  - 1st Single「IGNITION」
  - 2nd Single「BURN IT DOWN」
  - 3rd Single「No Limits」
- 「Moonlit」以降は制作済みであっても未公開として扱う
- LINDENの樹木、根、葉、緑色は現行サイトへ出さない
- 未公開作品のJSON、画像、音源を本番ビルドや公開サーバーへ置かない

資料間で競合した「FIRESTARTER」の時期は、`world-v02.md`に従い2020年10月で統一する。

## 4. 実装の優先順位

### Phase 1 — 基盤

- Vite + React + TypeScript
- React Router Framework Mode
- `ssr: false` + 全既知ルートの静的プリレンダリング
- JSON型検証
- Campaign Skin
- レスポンシブな共通レイアウト

### Phase 2 — 音楽体験

- 1つの共有`HTMLAudioElement`
- 常駐Mini Player
- Expanded Player
- リリース単位の再生キュー
- 歌詞とライナーノーツ
- 右クリック／長押しによる一般的な保存導線の抑止

### Phase 3 — コンテンツ

- Members
- Discography
- Features
- Story / Timeline
- News

### Phase 4 — ミニツール

- IGNITE JUKEBOX
- EMBER DIGITAL PASS

### Phase 5 — 品質と配備

- 静的ルート、参照整合、アクセシビリティ、レスポンシブのテスト
- GitHub Actions
- お名前.comサーバーへのSFTP配備
- 音源領域をサイト配備の削除対象から除外

## 5. 素材が未配置の状態

データ内の画像・音源パスは「配置予定の正式パス」であり、素材そのものは含まれていない。

- 開発・Previewでは、未配置素材をプレースホルダーで表示する
- `audio.status: "pending"`の曲には再生ボタンを出さない
- Productionでは、公開対象の必須素材が不足していたらビルドを失敗させる
- 音源を配置したら、`audio.status`、`durationSeconds`、`asset-manifest.json`を同時に更新する

## 6. 実装上の禁止事項

- Suno埋め込みやSunoへの主要導線
- 全ページ共通の右クリック禁止
- ブラウザ標準音声コントロールの常時表示
- 音声の自動再生
- SPAの1枚HTMLだけを置く構成
- LINDENを現行テーマとして使用
- 未公開作品をCSSだけで隠す
- 未来情報をクライアントへ送信してからJavaScriptで除外
- 過剰なネオン、ゲームHUD、全面ガラスモーフィズム
- ダミー音源や壊れた再生ボタンをProductionへ出す

## 7. 実素材投入前に人が決める項目

- 本番ドメインまたはサブディレクトリ
- お名前.com側の実際の転送方式、ポート、公開ルート
- GitHub Actionsで使用するSFTP認証方式
- ロゴ、ヒーロー、メンバー、ジャケット、記事画像
- 公開用MP3の最終ファイル名と再生時間
- Pixiv等の外部作品URL
- 実際の権利表記

これらが未確定でも、Antigravityはプレースホルダーと設定値を使って実装・テストまで進めること。
