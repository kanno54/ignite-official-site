# IGNITE サイト定型運用

Node.js 20 以上・npm・Git・既存 GitHub リポジトリへの push 権限を使用します。新しいサービス、FTP 認証情報のローカル保存、Codex の起動は不要です。初回のみ `npm ci` を実行してください。Windows はリポジトリ内の PowerShell で以下を実行します。

## 普段のコマンド

```powershell
# 軽いチェック（データ、ルート、キャンペーン選択）
.\site.cmd check

# 更新ファイルを通常どおりレビュー・コミットした後、反映先を確認
.\site.cmd stage

# ステージング反映 → Actions 完了待機 → 実URLの検証
.\site.cmd stage --apply

# 後から再確認（SHA は省略せず40桁を指定）
.\site.cmd verify staging --sha <公開したコミットSHA>

# 通信切断・タイムアウト後の待機再開（再push不要）
.\site.cmd wait staging --sha <公開したコミットSHA>
```

同じ操作は `npm run site -- stage --apply` のように実行できます。`<...>` は実際の値に置き換えてください。実行結果が終了コード0なら成功、それ以外は停止・失敗です。待機は60秒間隔、最大45分。失敗時に自動再デプロイや自動ロールバックはしません。画面に出るActions URLで原因を確認してください。GitHub API制限に達した場合も公開失敗とは限らないため、待機を再開します。

`stage` は現在の**コミット済みHEAD**を既存 `staging` ブランチへ通常pushします。作業ブランチ名は自由ですが、最新 `origin/staging` を含む必要があります。サイトや設定の未コミット変更がある場合は停止します。`reports/` の未コミット資料は無視し、追加・送信しません。競合時の強制pushは行いません。

通常反映のチェック・TypeScriptを含むビルド・静的HTML/SEO検証はActions内で一度実行します。ローカルでの同じビルドの繰り返し、全画像の派生生成チェック、ブラウザ全幅撮影は標準処理に含めません。画像変更や大規模修正時は明示的に以下を実行します。

```powershell
.\site.cmd check staging --full
npm run test:we-burn-interview
npm run test:story-we-burn
```

## 本番操作と初回導入の制限

**この実装をステージングに置いただけでは、main上の旧設定は変わりません。今回、本番ブランチも本番サイトも変更しません。** 旧mainにはpush公開と年次cron公開が残っています。本番運用を開始する前に、管理者が `.github/workflows/deploy.yml` の手動確認版と `scheduled-release.yml` の停止版、および本運用スクリプトをレビューしてmainへ取り込む必要があります。スクリプトはmain上の旧設定を検出すると本番操作を拒否します。設定導入のためにWe Burnの公開状態を一括変更しないでください。

本番の `SFTP_PROD_PATH` は実際に確認済みの専用ディレクトリに設定してください。許可値は `/ignite-official.site`、`/public_html/ignite-official.site` または先頭 `/` を除いた形です。以前の共用 `SFTP_REMOTE_PATH` や `/public_html` 全体へのフォールバックは使用しません。既存構成がこの値以外の場合は転送を止め、管理者が実パスを確認してから許可値を修正します。

導入後はmainへのpushだけでは公開されません。

```powershell
# 最新mainの対象確認（反映なし）
.\site.cmd production

# Actions書込権限のある既存GitHub tokenをGITHUB_TOKEN環境変数で設定した場合
# トークンをコマンド履歴・README・Gitに記録しないでください。
.\site.cmd production --sha <mainの40桁SHA> --apply --confirm PRODUCTION:<同じSHA>

.\site.cmd verify production --sha <公開した40桁SHA>
```

トークンを用意しない場合は [本番Actions](https://github.com/kanno54/ignite-official-site/actions/workflows/deploy.yml) の **Run workflow** でmainを選び、確認欄に `PRODUCTION:40桁SHA` を入力してください。その後 `site.cmd wait production --sha ...` で完了と実URLを検証できます。確認文字列が実際のmain SHAと異なる場合、Actionsの公開ジョブは実行されません。本番は常に既存の本番用コンテンツ選択を使い、staging状態を自動昇格しません。

## ロールバック

最後に成功確認したコミットSHAはActionsの成功runと `site-revision.json` で確認します。任意の過去コミットを「成功済み」と自動判定しません。戻すSHAをレビューし、まず差分を表示してください。

```powershell
.\site.cmd rollback staging --to <復元先SHA>
.\site.cmd rollback staging --to <復元先SHA> --apply

# 本番は、現main SHAへの確認で復元コミットを作るだけ（公開は別操作）
.\site.cmd rollback production --to <復元先SHA> --apply --confirm PRODUCTION:<現在のmainの40桁SHA>
# 出力された新しいSHAに対して、上記productionコマンドで別途公開確認
```

一時Git worktreeで復元コミットを作り、履歴を消さず通常pushします。現在の作業ツリーは書き換えません。復元先は対象ブランチの祖先である必要があります。運用コード・workflow・依存定義をまたぐロールバックは安全のため拒否し、レビューした修正コミットで対処します。**この運用導入前の版への自動ロールバックは対象外です。** 復元後もActionsの通常チェックを通ります。競合してpushできなかった場合、表示済みの復元コミットは公開されていません。作業ブランチは自動追従しないため、次回更新前に `git fetch origin` と通常のマージを行ってください。

FTP転送は従来どおり逐次更新で、原子的切替ではありません。転送途中の失敗は部分更新になり得ます。修正後は失敗したActionsを再実行し、`wait` で検証してください。別途アップロード済み音源を守るためリモート余剰ファイルは削除しません。ロールバックは参照されるサイト内容の復元であり、遠隔ディスク全体の完全復元ではありません。削除が必要な機密ファイルには別途管理者対応が必要です。

## 疎通確認の範囲

ビルドが `site-revision.json` に環境・Git SHA・主要ページと参照JS/CSSのSHA-256を記録します。公開後はキャッシュ回避リクエストで実ファイルを取得し、完全一致を確認します。React本文の文字列をHTML内から探す誤った検証は行いません。既存音源1本のMIME・先頭データ・Range応答も確認します。現在のサーバーはRange要求に200を返すため、200はその旨を表示して許容し、206の場合は範囲ヘッダーも検証します。音源全体はダウンロードしません。ブラウザでのレイアウト・全音源の再生・スマートフォン操作まで保証するチェックではありません。

ステージングURL: https://staging.ignite-official.site/

## 試作ZIPの精査結果

試作の「既存Git/Actionsを使う」「反映は明示オプション」「履歴を残す復元」は採用しました。以下はそのまま採用できないため変更しました。

- stagingブランチ固定と全未追跡資料による停止 → 任意作業ブランチのコミット済みHEADを使用。
- ローカルとCIで全チェック・ビルドを重複 → 通常CI一回、重いチェックは明示実行。
- push成功で終了、任意の本文文字列検索 → Actions待機とSHA・HTML・JS/CSSの実体照合。
- 音源確認未設定 → 実在音源のRange確認。
- 運用スクリプト自身も巻き戻す復元 → 運用/依存変更をまたぐ場合は停止。
- 本番未対応 → SHAに結びついた確認付き手動公開、旧定期公開の停止版。

既存本番workflowには転送対象dist内に認証情報入り `deploy.lftp` を生成する記述もありました。新実装では転送範囲外の一時ファイルだけを使います。過去にそのファイルが本番へ転送されたかは未確認です。サーバー管理者は旧ファイルの有無を確認し、残っていれば削除・認証情報更新を行ってください。本作業で本番サーバーを変更しません。
