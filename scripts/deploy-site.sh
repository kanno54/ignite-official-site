#!/usr/bin/env bash
# Existing lftp transport; run only in GitHub Actions with environment secrets.
set -euo pipefail
case "$SITE_ENV" in
  staging)
    if [[ -n "${FTP_PATH:-}" && "$FTP_PATH" != *staging* ]]; then
      echo 'Refusing non-staging path'; exit 1
    fi
    candidates=("${FTP_PATH:-}" /staging.ignite-official.site /public_html/staging.ignite-official.site /staging /public_html/staging staging.ignite-official.site public_html/staging.ignite-official.site)
    ;;
  production)
    # Never guess a production directory or fall back to the account root.
    case "${FTP_PATH:-}" in
      /ignite-official.site|/public_html/ignite-official.site|ignite-official.site|public_html/ignite-official.site) ;;
      *) echo 'Set SFTP_PROD_PATH to the verified ignite-official.site directory; refusing other paths'; exit 1 ;;
    esac
    candidates=("$FTP_PATH")
    ;;
  *) echo 'Unknown environment'; exit 1 ;;
esac
# Values enter the lftp command language, not a shell. Reject its control characters.
for value in "$FTP_HOST" "$FTP_USER" "$FTP_PASS" "${candidates[@]}"; do
  if [[ "$value" == *'"'* || "$value" == *'\'* || "$value" == *$'\n'* || "$value" == *$'\r'* ]]; then
    echo 'Unsupported quote/control character in FTP configuration'; exit 1
  fi
done
script=$(mktemp)
trap 'rm -f "$script"' EXIT
chmod 600 "$script"
connection() {
  printf '%s\n' 'set cmd:fail-exit yes' 'set ftp:ssl-allow no' 'set ftp:passive-mode on' 'set net:timeout 15' 'set net:max-retries 2'
  printf 'open -u "%s","%s" "%s"\n' "$FTP_USER" "$FTP_PASS" "$FTP_HOST"
}
chosen=''
for candidate in "${candidates[@]}"; do
  [[ -n "$candidate" ]] || continue
  { connection; printf 'cd "%s"\npwd\nquit\n' "$candidate"; } > "$script"
  if lftp -f "$script" >/dev/null 2>&1; then chosen="$candidate"; break; fi
done
[[ -n "$chosen" ]] || { echo 'No verified deployment directory'; exit 1; }
echo "Deploying $SITE_ENV to $chosen"
cd dist
{ connection; printf 'cd "%s"\n' "$chosen";
  # Keep separately uploaded audio. Never place credentials in this directory.
  echo 'mirror -R --verbose --no-perms --no-symlinks --ignore-time --parallel=2 . .'
  while IFS= read -r -d '' page; do
    printf 'put "%s" -o "%s"\n' "$page" "$page"
  done < <(find . -type f \( -name '*.html' -o -name '*.xml' -o -name '.htaccess' -o -name 'robots.txt' \) -print0)
  # Publish the build identity last, including when its byte length is unchanged.
  echo 'put "site-revision.json" -o "site-revision.json"'
  echo 'quit'
} > "$script"
lftp -f "$script"
