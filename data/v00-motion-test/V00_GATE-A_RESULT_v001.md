# V00 IDENTITY-SAFE MOTION TEST｜Gate A 判定結果記録メモ

- **策定日**: 2026-08-01
- **検証対象**: V00 IDENTITY-SAFE MOTION TEST (16:9 Review Master & 9:16 Editorial Strip Version)
- **区分**: Gate A／非公開技術検証
- **判定結果**: **【合格（PASSED）】**

---

## 1. Hard Gate 判定一覧

| Gate | 必須評価項目 | 判定 | 評価メモ |
|---|---|:---:|---|
| **A1 Identity** | 人物部分へ生成処理を行っていない | **PASS** | 正本画像（R05, R03-05, R03-02）を非破壊・完全固定のマスタープレートとして使用し、0%生成処理を達成。 |
| **A1 Identity** | R05の5人が欠けず、身長差・体格・衣装が正本通り | **PASS** | C01（16:9）および 9:16 Editorial Strip レイアウトにおいて、5人全員の全身ラインナップを欠損なく完全維持。 |
| **A1 Identity** | YUTOとSHOの顔、首、肩幅、筋肉量が明確に違う | **PASS** | C02（YUTO）と C03（SHO）のクロップ画角において、首の太さ・肩幅・表情の特徴を正本通り明確に表現。 |
| **A1 Identity** | トランジション中も顔が重ならず、変形した印象がない | **PASS** | クロスディゾルブ・モーフを全廃し、Beat Cut および 2〜4f の Platinum Flash のみを採用することで変形感を排除。 |
| **A2 Motion** | 静止が事故ではなく、意図的なキャンペーン演出に見える | **PASS** | 4秒/3秒の緩やかなカメラドリー（100%→102.5%等）とタイポグラフィ、背景光線・粒子の組み合わせにより高品位な Editorial Motion を確立。 |
| **A2 Motion** | 10秒内に光・文字・音の変化があり、単なる画像送りに見えない | **PASS** | `FIVE LIGHTS.` → `ONE CYCLE.` → `YUTO/BEFORE DAWN` → `SHO/NIGHT` → `SOLAR CYCLE` + GFX01 の連続的グラフィック構成を実証。 |
| **A3 Format** | 9:16で5人を欠けさせず、人物と文字が安全域内 | **PASS** | R05 を縦画面中央へ高さ 608px の Editorial Strip として配置し、上下安全域（上端180px/下端300px）内にテキストを配置。 |
| **A3 Format** | 縦版が横版の廉価な自動変換に見えない | **PASS** | 横長ストリップ構造＋上下グラフィック色面による洗練された縦版専用グラフィックレイアウトを実現。 |

---

## 2. QA静止画検証結果

| カット | 検証フレーム | 出力ファイル名 | 品質検証所見 |
|---|---|---|---|
| C01 (5人) | 1.50s (f045) | `data/v00-motion-test/qa_frames/V00_QA_C01_0150.png` | 5人の輪郭・足元・頭頂部に欠損なし。文字 `FIVE LIGHTS.` の視認性良好。 |
| C02 (YUTO) | 5.50s (f165) | `data/v00-motion-test/qa_frames/V00_QA_C02_0550.png` | 胸上クロップにおけるYUTOの瞳・衣装アクセントが鮮明。文字重ねなし。 |
| C03 (SHO) | 8.50s (f255) | `data/v00-motion-test/qa_frames/V00_QA_C03_0850.png` | SHOの肩幅・重厚感が保持され、`SOLAR CYCLE` + GFX01 の視認性確認。 |

---

## 3. 次工程（V03/Gate B）への推奨事項

1. **TMPL01 v0.1 レイヤー構造の標準化**: 5層構造（Typography / Front Atmosphere / Source Plate / Back Light / Background）は長尺本編（15秒〜30秒）へそのまま適用可能。
2. **音響・アタック連携**: 拍マーカーに基づく Beat Cut と Platinum Flash は顔の印象を損ねずに高精度なテンポ感を生むため、V03でも本仕様を継続採用する。
