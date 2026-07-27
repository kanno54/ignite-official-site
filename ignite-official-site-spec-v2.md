
# IGNITE Official Portal

## Antigravity実装用 企画・クリエイティブ・UI/UX・技術設計書

Version: 2.0  
Current campaign: `NO_LIMITS`  
Public continuity: 2022年9月／3rd Single「No Limits」  
Hosting: お名前.com レンタルサーバー  
Architecture: Vite + React + TypeScript + Static Pre-rendering

---

## 0. Executive Summary

本サイトは、架空の5人組ダンス＆ボーカルグループ「IGNITE」の公式ポータルである。

役割は「外部サービスへのリンク集」ではない。公開済み楽曲を聴き、歌詞を読み、作品背景と人物の物語をたどり、ファン向けの小さな遊びまで一つの場所で体験できる、IGNITEの本拠地とする。

サイトの核は次の循環。

1. 楽曲を聴く
2. 歌詞とライナーノーツを読む
3. メンバーや制作背景へ進む
4. 関連記事・短編を読む
5. 次の曲を再生する

初期公開時点では「No Limits」が最新作であり、未来作は一切公開しない。

### 0-1. MVPの必須成果

- Top / Members / Discography / Features / Story
- メンバー5人の詳細ページ
- 公開済み4作品の詳細ページ
- No Limits期の記事2本
- 共有`HTMLAudioElement`を使う常駐カスタムプレイヤー
- 公開済み曲だけを扱うIGNITE JUKEBOX
- 端末内だけで生成するEMBER DIGITAL PASS
- 全既知URLの静的HTML生成
- 公開範囲・ID参照・素材不足を検証するビルドゲート
- GitHub Actionsから静的成果物をSFTP配備するワークフロー

### 0-2. MVPの対象外

- ユーザーアカウント
- 実在のファンクラブ決済
- サーバー側データベース
- DRM
- 完全な音源取得防止
- コメント、投票、チャット
- 未公開作品の予告ページ
- Suno埋め込み、Sunoリンクを主導線にすること
- 全曲の波形データ生成
- 全サイト検索

---

# 1. 正史、公開時点、情報管理

## 1-1. 設定資料の優先順位

競合がある場合は次の順に採用する。

1. `world-v02.md`
2. 直近の会話で確定した運用方針
3. 各シングル／アルバム個別資料
4. 初期のリリース一覧

この規則により、Indies Mini Album「FIRESTARTER」は2020年10月とする。

## 1-2. 初期公開スナップショット

| 項目 | 値 |
|---|---|
| 作中の現在 | 2022年9月 |
| Current Campaign | `NO_LIMITS` |
| Latest Release | 3rd Single「No Limits」 |
| 公開作品数 | 4 |
| 公開収録音源数 | 15 |
| Top Hero | No Limits |
| Pick Up Track | No Limits |
| 次の公開候補 | No Limits収録曲特集、NO LIMITSツアー関連 |
| 未公開 | Moonlit以降の全作品 |

### 公開済み4作品

1. 2020-10 Indies Mini Album「FIRESTARTER」
2. 2021-07 1st Single「IGNITION」
3. 2021-10 2nd Single「BURN IT DOWN」
4. 2022-09 3rd Single「No Limits」

## 1-3. 公開情報と内部設定の分離

公開サイトへ出すのは「公式に語れる設定」だけとする。

以下は公開JSONへ入れない。

- 本人しか知らない弱点
- 将来の事件の種
- 未公開の衝突、怪我、体調問題
- 将来曲によって初めて明らかになる成長
- 小説の核心
- 未公開作品名、収録曲、画像、歌詞、音源

メンバーページのBiographyは、No Limits時点までにファンから見える成長へ限定する。

## 1-4. コンテンツの公開制御

すべての公開単位は次の4項目を持つ。

```ts
type Publication = {
  fictionalReleaseDate: string;
  publishAt: string | null;
  visibility: "draft" | "scheduled" | "public" | "archived";
  campaignState: "past" | "current" | "future";
};
```

ただし、未来作品を公開JSONへ入れて`visibility: "draft"`で隠す運用はしない。

### 必須ルール

- 本番の入力は`content/public/`だけ
- 未来データは公開リポジトリや`src/`へ置かない
- 将来曲のMP3はリリース日まで公開サーバーへ置かない
- 公開対象をクライアントへ送ってから非表示にしない
- ビルド後のHTML、JS、JSON、sitemapに未来作が含まれないことを検査する

---

# 2. ブランドガイドライン

## 2-1. グループ

**IGNITE（イグナイト）**

2020年にインディーズで始動し、2021年にメジャーデビューした5人組ダンス＆ボーカルグループ。

全員が身体表現を基盤に持ち、歌唱、ダンス、照明、衣装、客席との呼吸を一体として見せる。スタジオ音源は完成形ではなく、ライブで別の表情へ変わるための基点でもある。

## 2-2. コアコンセプト

> まだ未完成な五人が、  
> それぞれの弱さや迷いを抱えたまま、  
> 同じステージへ戻ってくる。

火は破壊だけでなく、始まり、前進、誰かを照らす熱、消えずに残る火種を表す。

## 2-3. キャッチコピー

**We don’t just perform. We burn.**

日本語補助：

**ただ演じるのではない。自分たち自身を燃やして、舞台に立つ。**

## 2-4. ファンネーム

**EMBER（エンバー）**

燃え尽きた後にも残る小さな火種。

ファン向けコピーは、過度に可愛らしくせず次の語彙を使う。

- 火を持ち帰る
- まだ燃えている
- 同じ一拍に入る
- 次の曲を待つ
- 帰れる場所

## 2-5. ブランドの二層構造

### Permanent Core

- 暗転した黒いステージ
- 熱を示す赤橙
- 歌声と客席を示す金
- 白い照明
- 五本の光

### Campaign Skin

作品ごとに以下だけを差し替える。

- Hero画像
- Campaign accent
- 背景の抽象モチーフ
- Top copy
- Pick Up Track
- Latest Feature
- 一部の罫線と再生中の発光

ナビゲーション、ページ構造、操作方法、コアカラーは変更しない。

サイトそのものは黒いステージとして不変で、作品ごとに照明だけが変わる。

## 2-6. コアカラートークン

| 用途 | CSS変数 | HEX |
|---|---|---:|
| Primary | `--color-primary` | `#FF4B2B` |
| Primary Strong | `--color-primary-strong` | `#E2361E` |
| Secondary | `--color-secondary` | `#F4C34E` |
| Base Background | `--color-bg` | `#080A0F` |
| Surface | `--color-surface` | `#11151D` |
| Elevated Surface | `--color-surface-elevated` | `#171C26` |
| Border | `--color-border` | `#2A303C` |
| Text | `--color-text` | `#F6F3ED` |
| Muted Text | `--color-text-muted` | `#AEB6C4` |
| Focus | `--color-focus` | `#6CCBFF` |
| Error | `--color-error` | `#FF6B6B` |
| Success | `--color-success` | `#58C998` |

## 2-7. No Limits Campaign Skin

### Theme

**上昇、風、速度、扉の向こうに広がる大きな会場。**

初期の炎を残しつつ、赤一色から青空と白い光へ視野が開く時期。SOLARの真夏の金色までは進めない。

| 用途 | CSS変数 | HEX |
|---|---|---:|
| Campaign Accent | `--campaign-accent` | `#55A8FF` |
| Campaign Light | `--campaign-accent-2` | `#CBE7FF` |
| Campaign Deep | `--campaign-deep` | `#101B2D` |
| Campaign White | `--campaign-white` | `#F6F3ED` |
| Text on Accent | `--campaign-on-accent` | `#08111E` |

### Hero copy

- Eyebrow: `3RD SINGLE`
- Title: `NO LIMITS`
- Main copy: `五つの声で、まだ見ぬ場所へ。`
- Primary CTA: `LISTEN NOW`
- Secondary CTA: `VIEW RELEASE`

### Visual direction

- 五人が同じ方向へ進むが、横並びの記念写真にはしない
- 斜めの光、風を受ける衣装、踏み出す動き
- 青白い高所の光と、手前の暗いステージ
- 写真またはアニメ調イラストが主役
- 空、雲、光の筋は抽象度を保つ
- 炎は小さなコア要素に限定
- LINDENの緑、根、枝、葉脈は使用禁止

## 2-8. メンバーカラー

| Member | Name | HEX | Meaning |
|---|---|---:|---|
| KAI | Crimson Red | `#D62839` | 火、熱量、先導 |
| SHO | Purple | `#7B5CFF` | 夜、集中、鋭さ |
| LEO | Orange | `#FF8A24` | 太陽、親しみ、熱気 |
| REN | Gold | `#D9B44A` | 光、歌声、希望 |
| YUTO | Deep Blue | `#2450A4` | 夜明け前、成長、静かな強さ |

ページ背景全体をメンバーカラーにしない。発言者ラベル、細い罫線、小さな状態表示に使う。

## 2-9. トーン＆マナー

### 目標

- 実在するダンス＆ボーカルグループの公式アーカイブ
- 現代的な音楽雑誌
- 開演直前の暗いステージ
- 写真、大きなタイポグラフィ、余白
- 洗練されたダークモード
- 静かな場所に熱が残っている

### 避ける

- 黒背景、ネオン、カードを並べただけの汎用AIサイト
- サイバーパンク
- ゲームHUD
- 全面ガラスモーフィズム
- 常時動く炎、粒子、波形
- 文字が読めないグロー
- パステル中心の可愛いアイドルサイト
- 筋肉を商品広告のように扱う表現
- 五人を同じ顔、同じ輪郭で扱うビジュアル

発光は、現在地、再生ボタン、再生中の楽曲だけ。1画面の強い発光は最大2箇所。

## 2-10. タイポグラフィ

フォントはビルドへ同梱し、外部CDNから取得しない。

| 用途 | 推奨 |
|---|---|
| 英字大見出し | Bebas NeueまたはOswald系 |
| 日本語UI・本文 | Noto Sans JP |
| 記事・物語見出し | Shippori Mincho |
| 年代・曲番号 | IBM Plex Mono |

```css
--font-display: "Bebas Neue", "Arial Narrow", sans-serif;
--font-sans: "Noto Sans JP", "Yu Gothic", "Hiragino Kaku Gothic ProN", sans-serif;
--font-serif: "Shippori Mincho", "Yu Mincho", serif;
--font-mono: "IBM Plex Mono", ui-monospace, monospace;
```

推奨：

- Hero: `clamp(4rem, 12vw, 10rem)`
- Page title: `clamp(2.5rem, 7vw, 6rem)`
- Section title: `clamp(1.75rem, 4vw, 3.5rem)`
- Body: `clamp(1rem, 0.95rem + 0.2vw, 1.125rem)`
- Article line-height: `1.9`
- UI line-height: `1.45`

## 2-11. レイアウト

- Mobile first
- Max shell: `1440px`
- Standard content: `1280px`
- Article: `1040px`
- Story body: `720px`
- Desktop: 12 columns
- Tablet: 8 columns
- Mobile: 4 columns
- 8px spacing grid
- Touch target: 44×44px以上
- Fixed player分の下余白を全ページで確保

Breakpoints:

- `480px`
- `768px`
- `1024px`
- `1280px`

## 2-12. 画像仕様

| 種別 | 比率 | 推奨サイズ |
|---|---:|---:|
| Top hero desktop | 16:9 | 2400×1350 |
| Top hero mobile | 3:4 | 1440×1920 |
| Member profile | 4:5 | 1600×2000 |
| Member avatar | 1:1 | 640×640 |
| Discography square | 1:1 | 1600×1600 |
| Existing vertical cover | 3:4 | 1200×1600以上 |
| Feature hero | 3:2 | 1800×1200 |
| Story thumbnail | 4:5 | 1200×1500 |

形式：

- AVIFを第一候補
- WebP fallback
- PNGはロゴや透過素材だけ
- `picture`で適切な`srcset`
- Hero以外は遅延読み込み

既存3:4カバーを一覧でCSSトリミングするだけにせず、重要な顔やタイトルが欠けない1:1版を用意する。

### SHOとYUTOの描き分け

- SHO：切れ長の目、骨格が強い、黒に近いネイビー短髪、五人で最も筋肉量が多い
- YUTO：大きな瞳、柔らかい若さ、長めの黒い前髪、しなやかな体格

---

# 3. 情報設計とサイトマップ

## 3-1. ルート

| Route | Page | Static generation | Data |
|---|---|---:|---|
| `/` | Top | 必須 | 全公開データ |
| `/members/` | Member Index | 必須 | members |
| `/members/:slug/` | Member Detail | 5ページ | members |
| `/discography/` | Discography Index | 必須 | discography |
| `/discography/:slug/` | Release Detail | 4ページ | discography |
| `/features/` | Feature Index | 必須 | articles |
| `/features/:slug/` | Article Detail | 2ページ | articles |
| `/story/` | Story / Timeline | 必須 | site config / releases |
| `/fun/` | Mini Tools | 必須 | public tracks / members |
| `/privacy/` | Privacy | 必須 | static |
| `/accessibility/` | Accessibility | 必須 | static |
| `/404.html` | Not Found | 必須 | static |

URLは小文字、英数字、ハイフン、末尾スラッシュありで統一する。

## 3-2. 共通ヘッダー

Desktop:

- 左：IGNITE wordmark
- 中央：Members / Discography / Features / Story
- 右：Now Playing indicator / EMBER

Mobile:

- 左：wordmark
- 右：Now Playing / Menu
- メニューは全画面
- メニュー開閉で再生を止めない

スクロール時：

- 透明から半透明黒へ変化
- 現在地を線と文言で示す
- `backdrop-filter`なしでも読める背景色

## 3-3. Top `/`

表示順：

1. **No Limits Hero**
   - Hero画像
   - `3RD SINGLE`
   - `NO LIMITS`
   - `五つの声で、まだ見ぬ場所へ。`
   - `LISTEN NOW`
   - `VIEW RELEASE`
   - 自動再生しない

2. **Latest News**
   - 3件
   - 年月、カテゴリ、見出し

3. **Pick Up Track**
   - No Limits
   - カバー、短い解説、Play、Lyrics、Release
   - YUTOのハイトーン初フィーチャーを明記

4. **Current Release**
   - 3曲の収録順
   - No Limits / Higher Ground / Run With Us - Live Version -
   - 一括キューへ追加

5. **Five Members**
   - Desktopは五人を一つの画面に見せる
   - Mobileは縦カード
   - Hoverとfocusで役割と短いコピー

6. **Latest Feature**
   - No Limits座談会
   - 雑誌見開き風

7. **From the Archive**
   - FIRESTARTER / IGNITION / BURN IT DOWN
   - 原点から現在までを3枚で見せる

8. **Mini Tools**
   - IGNITE JUKEBOX
   - EMBER DIGITAL PASS

9. **Footer**

## 3-4. Members

### Index

- 4:5カード×5
- Stage name
- Role
- Member color
- Short copy
- Hoverとfocusを同等にする

### Detail

1. 大型プロフィール
2. Role / Height / Member color
3. Official biography
4. Origin / Turning Point / Current Chapter
5. Stage strengths
6. Signature performance
7. Public featured tracks
8. Related articles
9. 前後メンバー

年齢は誕生日設定と作中時点の整合が確定するまで表示しない。データにも確定年齢を持たせず、後から追加可能な型にする。

## 3-5. Discography

### Index

フィルター：

- All
- Single
- Mini Album
- Year
- Era

表示：

- Cover
- Title
- Release month
- Format
- Campaign state
- Playable count

初期は新しい順。状態はURLクエリへ反映する。

### Release Detail

1. Cover
2. Title / Format / Fictional release month
3. Description
4. Self liner notes
5. Track list
6. `PLAY RELEASE`
7. TrackごとのPlay、歌詞、解説
8. Stage notes
9. 同Eraの前後作品

音源未配置の曲は再生ボタンを出さず、`COMING SOON`にも見せない。単に再生UIを省略し、作品情報は読める状態にする。

## 3-6. Features

### Index

音楽雑誌の表紙棚を思わせる構成。

- COVER STORY
- PERFORMANCE FOCUS
- LONG INTERVIEW
- TOUR DOCUMENT

カード：

- Kicker
- Title
- Dek
- Publish month
- Reading time
- Main speaker
- Hero

### Detail

Desktop:

- Leadは全幅
- 本文は読みやすい2段組
- Dialogueは発言者名と左罫線
- Pull quoteは段をまたぐ

Mobile:

- 1段組
- 発言者名を省略しない
- チャット吹き出しにしすぎない

対応ブロック：

- `lead`
- `heading`
- `paragraph`
- `dialogue`
- `pullquote`
- `image`
- `divider`

## 3-7. Story `/story/`

初期は作品本文を大量に載せず、公式年表と外部アーカイブへの入口にする。

セクション：

1. Official Timeline 2020–2022
2. FIRESTARTER
3. IGNITION
4. BURN IT DOWN
5. NO LIMITS
6. Story Archive
7. External Reading

初期年表の終点は2022年9月。2023年以降をDOM、JSON、sitemapへ含めない。

外部作品カード：

- Title
- 100〜180字のsummary
- Era
- Related track
- Member
- Content note
- Cover
- External URL

リンクは新規タブ、外部リンク表示、`rel="noopener noreferrer"`。

## 3-8. Fun `/fun/`

初期公開：

- IGNITE JUKEBOX
- EMBER DIGITAL PASS

後日追加：

- LYRIC CARD
- SETLIST MAKER
- HISTORY PLAYER
- TOUR ARCHIVE

未来ツールのカードや予告は、解禁時まで表示しない。

## 3-9. Footer

- IGNITE wordmark
- Navigation
- 架空の所属情報
- 実際の権利表示
- `This is a fictional creative project.`
- Privacy
- Accessibility

架空のクレジットと実際の権利者表示を同じ行へ混在させない。

---

# 4. Global Audio Experience

## 4-1. 目的

公式サイトを公開済み楽曲の正規視聴場所にする。

Sunoへの移動を前提にせず、ページを移動しながら「聴く、読む、次へ進む」を継続できるようにする。

## 4-2. 配信方針

- 公開済み楽曲はフル再生
- 公開用MP3はマスターとは別に生成
- MP3 / 44.1kHz / 192〜256kbps
- 同一オリジン配信
- 未公開曲とマスターは公開サーバーへ置かない
- 音源はGitリポジトリへ入れない
- サイト配備と音源配備を分離する

推奨パス：

```text
/media/audio/firestarter/
/media/audio/ignition/
/media/audio/burn-it-down/
/media/audio/no-limits/
```

ファイル名：

```text
01-no-limits.v1.mp3
02-higher-ground.v1.mp3
03-run-with-us-live.v1.mp3
```

ファイル名にバージョンを持たせ、差し替え時のキャッシュを回避する。

## 4-3. Player Architecture

- アプリ全体で`HTMLAudioElement`は1つ
- Root layout直下の`AudioProvider`で保持
- クライアント内のルート遷移ではProviderを再マウントしない
- カードごとに`<audio>`を作らない
- 初回再生はユーザー操作から
- 自動再生しない
- `preload="metadata"`
- 一度に一曲だけ再生
- hard reload、新規タブでは再生を引き継がなくてよい

推奨状態：

```ts
type PlayerState = {
  trackId: string | null;
  queue: string[];
  queueContext: "release" | "jukebox" | "manual" | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  isExpanded: boolean;
  error: string | null;
};
```

Volumeだけ`localStorage`へ保存する。再読み込み後に勝手に再生を再開しない。

## 4-4. Mini Player

常に画面下部へ固定。

表示：

- Cover thumbnail
- Track title
- Release title
- Play / Pause
- Seek progress
- Next
- Expanded view

Desktop:

- 画面下部の細い横長バー
- 本文を過度に覆わない

Mobile:

- Safe Area対応
- 狭い画面ではRelease titleを省略可能
- 音量はExpanded viewへ移動

## 4-5. Expanded Player

Desktopは右側drawer、Mobileはbottom sheet。

表示：

- Large cover
- Track / Version / Release
- Play / Pause
- Previous / Next
- Seek
- Current time / duration
- Volume / mute
- Queue
- Lyrics
- Liner notes
- Related feature
- Release page

`Close`ではなく`Minimize`を主操作にする。

## 4-6. Queue

- Release detailの`PLAY RELEASE`：収録順
- Track play：その曲を先頭にし、同じ作品の残りを続ける
- Jukebox：選出曲1曲を再生し、任意で関連曲を続ける
- Live / Studio / Major Versionを別recordingとして扱う
- 同一楽曲名でもversion labelを必ず表示

## 4-7. Equalizer

初期実装は再生状態に同期するCSSバーでよい。

Web Audio APIを使う場合：

- `AnalyserNode`
- `createMediaElementSource()`は共有audioへ一度だけ
- 失敗時はCSSへfallback
- 正確な音圧表示を装わない
- 5本のバーで五人を象徴
- `prefers-reduced-motion`では静止

## 4-8. Media Session

Progressive Enhancementとして実装。

- Track title
- Artist: IGNITE
- Album / Release
- Artwork
- Play / Pause
- Previous / Next
- Seek backward / forward

非対応ブラウザでも基本再生が壊れないこと。

## 4-9. 一般的な保存導線の抑止

目標は「普通の利用者が右クリックや長押しで簡単に保存できない」こと。完全防止を目標にしない。

### 実装

- ブラウザ標準controlsを表示しない
- 独自UIだけを表示
- 音源URLを画面やリンクへ出さない
- `controlsList="nodownload noplaybackrate"`
- Playerとジャケット領域だけ`contextmenu`を抑止
- 同領域だけ`dragstart`を抑止
- 対象画像に`draggable="false"`
- Mobile対象領域に`-webkit-touch-callout: none`
- サイト全体の右クリック、テキスト選択は妨げない

```ts
function blockCasualSave(event: React.SyntheticEvent) {
  event.preventDefault();
}
```

この処理をセキュリティ対策とは説明しない。ブラウザへ送信された音声は、開発者ツール等で取得され得る。

## 4-10. エラー

- 404 / 403 / network timeoutを区別しすぎず、ユーザー向けには簡潔に表示
- `この音源は現在再生できません`
- Retry
- Queueから次の曲へ自動スキップしない
- エラー後もプレイヤーを操作可能に戻す
- 壊れたURLを無限再試行しない

## 4-11. アクセシビリティ

- Space：Play / Pause
- 左右：5秒移動
- `aria-valuetext`で現在時間
- 状態を`aria-live="polite"`
- 色だけで再生状態を表さない
- SeekとVolumeへ見えるlabel
- 動くバーを停止可能
- Screen readerへversion labelも通知

---

# 5. Mini Tools

## 5-1. IGNITE JUKEBOX

### 目的

公開済み楽曲を、作品順ではなく気分とメンバーから発見する。

### No Limits期の質問

**今の気分は？**

- 火をつけたい
- 前へ進みたい
- 一緒に騒ぎたい
- 朝の光へ戻りたい

**誰の声／パフォーマンスを追いたい？**

- KAI
- SHO
- LEO
- REN
- YUTO
- Five Members

### 選出ロジック

- `visibility: public`
- `audio.status: ready`
- `moodTags`
- `spotlightMemberIds`
- 同点は毎回ランダムにしてよい
- 候補0件なら、メンバー条件を外して気分だけで再検索
- それでも0件なら、No Limitsをfallback

選出だけで再生せず、結果画面の`PLAY`操作から再生する。

### 出力

- Track
- Version
- Release
- 80字以内の理由
- Play
- Lyrics
- Try again

データベースも外部APIも使わない。

## 5-2. EMBER DIGITAL PASS

### 入力

- Display name：1〜20文字
- Favorite member：任意
- Theme：初期値`NO_LIMITS`

### 表示

- `EMBER DIGITAL PASS`
- Display name
- Favorite member color
- Random member number
- Join date
- 五本の光
- IGNITE wordmark
- No Limits campaign accent

### Member number

- 初回生成時にランダム8桁
- `localStorage`
- サーバーへ送らない
- 名前からハッシュ生成しない

### 安全

- NFKC normalize
- 改行と制御文字を除去
- HTMLとして挿入しない
- `textContent`相当で描画
- `入力内容はこの端末内だけで使用します`と表示

### 出力

- SVGで画面表示
- CanvasでPNG書き出し
- 1200×760
- `ignite-ember-pass.png`

## 5-3. 段階的な追加

| Tool | Unlock | 理由 |
|---|---|---|
| Global Player | Launch | サイトの核 |
| IGNITE JUKEBOX | Launch | 15音源から回遊可能 |
| EMBER PASS | Launch | データベース不要 |
| LYRIC CARD | SOLAR期 | 歌詞とビジュアルが十分増える |
| SETLIST MAKER | SOLAR期 | 選曲の幅が成立する |
| HISTORY PLAYER | EQUINOX期 | 年代と作品数が蓄積 |
| TOUR ARCHIVE | 2024ツアー公開期 | 公演単位のデータが揃う |

未解禁ツールのコードを初期bundleへ入れない。

---

# 6. Interaction Design

## 6-1. Stage Blackout Transition

- Client navigation時だけ80〜180msの黒
- 次ページの先頭が照明のように現れる
- 300msを超えない
- 初回表示を遅らせない
- Playerは暗転しない
- `prefers-reduced-motion`では無効
- 連続クリックをqueueしない

## 6-2. Five Lights

五人を示す軽量な抽象モチーフ。

使用：

- Hero
- Loading placeholder
- EMBER PASS
- Footer

SVGまたはCSS gradient。常時Canvas animationにしない。

## 6-3. Scroll Motion

- 見出しの短いfade / rise
- カードのstaggerは最大5枚
- Hero画像のparallaxは4〜8px程度
- 長文記事では動きを抑える
- Reduced Motionでは変形を使わない

## 6-4. Loading

- SkeletonはSurface色と細い光
- 五本の光を短く使用可能
- `Loading...`だけを長時間見せない
- 音源のloadingとページのloadingを混同しない

## 6-5. Empty State

未来作を匂わせる`Coming Soon`は初期公開では使わない。

- 該当記事なし：フィルター解除
- 再生可能曲なし：条件を変える
- 外部Storyなし：セクション自体を非表示

---

# 7. Content Data Contract

## 7-1. ファイル

| File | Role |
|---|---|
| `site-config.json` | Current campaign、feature flags、brand tokens |
| `members.json` | 公開プロフィール、色、舞台特性 |
| `discography.json` | 公開4作品、15recordings、歌詞、音源状態 |
| `articles.json` | 発言者、No Limits期の記事 |
| `news.json` | Top news |
| `asset-manifest.json` | 必須素材と状態 |

すべてUTF-8、コメントなしの有効JSON。

## 7-2. ID規則

- 小文字kebab-case
- IDは変更しない
- Title変更でIDを変えない
- recordingとcompositionを混同しない
- Major / Indies / Liveは別recording ID

例：

```text
burn-it-down-indies
burn-it-down-major
heatwave-live
```

## 7-3. 必須参照検証

- `group.memberOrder[]` → member ID
- `featuredTrackIds[]` → recording ID
- `release.trackIds[]` → recording ID
- `recording.releaseIds[]` → release ID
- `spotlightMemberIds[]` → member ID
- `lyrics[].performerIds[]` → member IDまたは予約値`all`
- `article.mainSpeakerIds[]` → speaker ID
- `dialogue.speakerId` → speaker ID
- `relatedTrackIds[]` → recording ID
- `assetId` → asset manifest ID

## 7-4. Production Gate

Production buildを失敗させる条件：

- ID / slug重複
- 参照切れ
- `visibility`がpublic以外の項目が公開データに存在
- `campaignState: future`
- current releaseがNo Limits以外
- 公開予定外のrelease ID
- Required imageがpending / missing
- Required audioがpending / missing
- 音声durationが未設定
- ファイル不在
- sitemapに未公開slug
- HTML / JSONへ未公開作品名が混入

開発ビルドはpending素材を許容し、壊れた画像の代わりにプレースホルダーを出す。

---

# 8. Technical Architecture

## 8-1. 採用構成

**Vite + React + TypeScript + React Router Framework Mode**

React Router設定：

- `ssr: false`
- `prerender`へ全公開URLを列挙
- dynamic routeはJSONのslugからbuild時に生成
- runtime serverを必要としない
- route loaderはbuild時に公開JSONだけを読む

React Routerのstatic pre-renderingは、静的ファイルサーバー向けに`ssr: false`と併用できる。dynamic pathはslugから明示的に列挙する。

## 8-2. 出力

React Routerのclient buildを、検証後に`dist/`へstageする。

```text
npm run validate:data
npm run validate:assets
npm run build
npm run package:dist
npm run test:static
```

`dist/`だけをProductionへ送る。

## 8-3. 推奨ディレクトリ

```text
/
├─ app/
│  ├─ components/
│  │  ├─ audio/
│  │  ├─ articles/
│  │  ├─ discography/
│  │  ├─ members/
│  │  ├─ tools/
│  │  └─ common/
│  ├─ routes/
│  ├─ styles/
│  ├─ types/
│  └─ utils/
├─ content/
│  └─ public/
│     ├─ site-config.json
│     ├─ members.json
│     ├─ discography.json
│     ├─ articles.json
│     ├─ news.json
│     └─ asset-manifest.json
├─ public/
│  ├─ assets/
│  │  ├─ images/
│  │  ├─ fonts/
│  │  └─ icons/
│  ├─ favicon.svg
│  ├─ robots.txt
│  └─ site.webmanifest
├─ scripts/
│  ├─ validate-content.mjs
│  ├─ validate-assets.mjs
│  ├─ assert-public-cutoff.mjs
│  ├─ prepare-dist.mjs
│  └─ verify-static-output.mjs
├─ tests/
├─ .github/workflows/
│  └─ deploy.yml
├─ react-router.config.ts
├─ vite.config.ts
└─ package.json
```

`content/private/`を作らない。未来企画はこのリポジトリ外で管理する。

## 8-4. 必須コンポーネント

Common:

- `SiteHeader`
- `SiteFooter`
- `CampaignProvider`
- `PageTransition`
- `ResponsivePicture`
- `ExternalLink`
- `FiveLights`

Audio:

- `AudioProvider`
- `TrackPlayButton`
- `MiniPlayer`
- `ExpandedPlayer`
- `QueuePanel`
- `EqualizerBars`
- `LyricsPanel`

Members:

- `MemberCard`
- `MemberHero`
- `MemberStory`
- `MemberTrackList`

Discography:

- `ReleaseCard`
- `DiscographyFilter`
- `ReleaseTrackList`
- `TrackDetail`

Articles:

- `ArticleRenderer`
- `DialogueBlock`
- `PullQuote`
- `ArticleImage`
- `SpeakerLabel`

Tools:

- `JukeboxForm`
- `JukeboxResult`
- `EmberPassForm`
- `EmberPassCard`
- `exportPassAsPng`

## 8-5. Styling

- CSS Modulesまたは明示的なcomponent styles
- Brand tokenはglobal custom properties
- Campaign Skinは`data-campaign="no-limits"`で適用
- Tailwindの採用は任意だが、色や余白をクラスへ直書きしてCampaign Skinを分散させない
- Inline styleへブランド値を散らさない

## 8-6. Base Path

Root:

```text
VITE_BASE_PATH=/
```

Subdirectory:

```text
VITE_BASE_PATH=/ignite/
```

Viteの`base`と`import.meta.env.BASE_URL`を使う。URL文字列を各componentで連結しない。

## 8-7. Environment Variables

クライアントへ出してよい値だけ`VITE_`を付ける。

```text
VITE_BASE_PATH
VITE_SITE_URL
VITE_BUILD_MODE
```

SFTP credentialへ`VITE_`を付けない。クライアントbundleに含めない。

## 8-8. Audio Remote Layout

```text
remote-root/
├─ index.html
├─ assets/
├─ members/
├─ discography/
├─ features/
├─ story/
└─ media/
   └─ audio/
```

サイト配備は`media/audio/`を削除、上書き、同期削除しない。

音源は公開前に別経路でアップロードし、HTTPS HEAD / GET、MIME、Range Requestを確認してからJSONを`ready`へ変更する。

## 8-9. SFTP Deployment

推奨Secrets：

- `SFTP_HOST`
- `SFTP_PORT`
- `SFTP_USERNAME`
- `SFTP_PRIVATE_KEY`
- `SFTP_KNOWN_HOSTS`
- `SFTP_REMOTE_PATH`

Password認証しか使えない場合は、Secretsをログへ出さない方法で差し替える。

ルール：

- PreviewとProductionを分離
- Productionは`main`へのmergeまたはmanual approval
- `dist/`のみ転送
- Remote pathを明示
- 上位ディレクトリを削除しない
- `media/audio/`を削除対象にしない
- hashed assetsを先に、HTMLを最後に転送
- 転送後に主要URLをsmoke test
- host key検証を無効化しない

お名前.com側の実契約でSFTP、SSH、FTPSのどれが利用可能かは、実装前にコントロールパネルで確認する。利用可能な方式が異なる場合は転送部分だけ置き換え、サイト設計は変更しない。

---

# 9. SEO, Performance, Accessibility

## 9-1. Metadata

各ページ：

- `<title>`
- meta description
- canonical
- Open Graph
- X card
- Breadcrumb

JSON-LD:

- Top: `MusicGroup`
- Release: `MusicAlbum`
- Track data: `MusicRecording`
- Feature: `Article`
- Member: `Person`

架空プロジェクトであることをFooterとAbout情報に明記する。

## 9-2. Sitemap / Robots

- public routeだけ
- 未来slugを含めない
- asset pathを列挙しない
- Preview環境はindex禁止
- Productionだけindex可

## 9-3. Performance Budget

- Initial JS: gzip 200KB以下を目標
- Mobile hero: 350KB以下を目標
- 音源は初期ロードしない
- Hero以外の画像はlazy
- Article rendererとPNG exportはlazy load
- 常時Canvas animationを避ける
- Source mapはProduction公開しない

目標：

- Performance 90+
- Accessibility 95+
- Best Practices 95+
- SEO 95+

## 9-4. Accessibility

- WCAG 2.2 AA目標
- Keyboardで全操作
- Focusを消さない
- Reduced Motion
- 画像へ具体的alt
- 色以外の識別
- 記事のDOM順と読み順を一致
- 音声自動再生なし
- Playerとdrawerのfocus management
- Drawerを閉じたら起動ボタンへfocusを戻す
- Pass formのlabel / error

---

# 10. Privacy and Security

- 初期版はCookie不要
- EMBER入力を送信しない
- Analyticsは後日、同意設計とセット
- 外部リンクに`noopener noreferrer`
- JSON本文を生HTMLとして描画しない
- `dangerouslySetInnerHTML`を記事に使わない
- ユーザー入力をHTMLへ挿入しない
- Production source mapを公開しない
- SFTP secretsをGitHub Secretsで管理
- `VITE_*`へ秘密を入れない
- Content Security Policyは静的構成に合わせて設定可能な範囲で導入

右クリック抑止はUX上の抑止であり、権利保護やアクセス制御の代替ではない。

---

# 11. Testing

## 11-1. Unit

- Publication filter
- ID reference validation
- Slug uniqueness
- Jukebox selection / fallback
- Pass input normalization
- Time formatter
- Queue transitions

## 11-2. Component

- Mini Player
- Expanded Player focus trap
- Track error recovery
- Article block renderer
- Discography filter
- EMBER form errors

## 11-3. E2E

- TopからNo Limitsを再生
- Client navigation後も再生継続
- Release queueの次曲
- Lyricsを開く
- Jukeboxから再生
- EMBER Pass生成とPNG export
- Keyboard-only
- Reduced Motion
- Direct deep link
- 404

Viewport:

- 360
- 390
- 768
- 1024
- 1440

## 11-4. Static Output

- 全routeに実体HTML
- direct access 200
- public contentだけ
- sitemap一致
- unresolved dummy pathなし
- `Moonlit`、`Silent Signal`、`RISE AGAIN`、`EQUINOX`、`LINDEN`がProduction出力に含まれない

上記タイトルは検査側のdenylistとして保持する場合、検査スクリプト自体をclient bundleへ含めない。

---

# 12. Acceptance Criteria

## Product

- TopがNo Limits期に見える
- LINDEN表現がない
- 公開4作品だけ表示
- 5人のプロフィールがNo Limits時点まで
- 2記事がNo Limits期

## Audio

- 共有audioは1つ
- 自動再生なし
- Client navigationで継続
- Seek / Volume / Mute
- Release queue
- Standard controls非表示
- Player / artworkだけ右クリック・drag抑止
- Audio error後に操作復帰

## Tools

- Jukeboxがpublic + readyだけ選出
- EMBER入力が端末外へ送信されない
- PNG export

## Static / SEO

- 全route static HTML
- direct route 200
- metadata / canonical / OG
- sitemapに未来作なし

## Accessibility

- Keyboard操作
- Visible focus
- Screen readerで再生状態
- Reduced Motion
- Article speakerを色以外でも識別

## Deploy

- Content validation failureで停止
- Missing required assetでProduction停止
- `dist/`のみ配備
- Audio領域を削除しない
- Secrets非表示
- Post-deploy smoke test

---

# 13. Antigravityが判断してよい範囲

- component分割の細部
- cardやbuttonの正確な寸法
- breakpoint内の微調整
- CSS Modules等の具体的なstyle手法
- animationの実装API
- test fileの構成
- build scriptの内部構造

# 14. Antigravityが変更してはいけない範囲

- 公開時点
- 公開作品数
- Current Campaign
- Brand colors
- No Limits creative direction
- Sunoへ送客しない方針
- 共有audio element
- サイト全体の右クリックを禁止しないこと
- 未来データを公開ビルドへ入れないこと
- LINDENを現行テーマにしないこと
- 架空サイトである注記

---

# 15. 技術参照

- React Router Pre-Rendering: https://reactrouter.com/how-to/pre-rendering
- React Router Rendering Strategies: https://reactrouter.com/start/framework/rendering
- Vite Production Build / Base Path: https://vite.dev/guide/build
- Vite Environment Variables: https://vite.dev/guide/env-and-mode

実装時は公式ドキュメントの現行仕様を優先し、古いサンプルのversion番号を固定的に写さない。
