import os
import json
from PIL import Image

site_dir = r'C:\Users\kanno\.gemini\antigravity-ide\scratch\ignite-official-site'
brain_dir = r'C:\Users\kanno\.gemini\antigravity-ide\brain\b87b4d11-11ef-4be7-91d5-516ee9752a2e'

articles_img_dir = os.path.join(site_dir, 'public', 'assets', 'images', 'articles')
manifest_path = os.path.join(site_dir, 'content', 'public', 'asset-manifest.json')
articles_path = os.path.join(site_dir, 'content', 'public', 'articles.json')

os.makedirs(articles_img_dir, exist_ok=True)

# Image sources mapping
img_sources = {
    'article-hero-ignition': ('media__1785068676806.jpg', 'hero-ignition-feature.webp', '3:2'),
    'article-ignition-cover': ('media__1785068685916.jpg', 'ignition-mag-cover.webp', '3:4'),
    'article-ignition-roundtable': ('media__1785068685939.jpg', 'ignition-roundtable.webp', '3:4'),
    'article-ignition-live-why': ('media__1785068685976.jpg', 'ignition-live-why.webp', '3:4'),
    'article-ignition-member-file': ('media__1785068685989.jpg', 'ignition-member-file.webp', '3:4'),
}

# 1. Process and save images
with open(manifest_path, 'r', encoding='utf-8') as f:
    manifest = json.load(f)

for asset_id, (src_fname, out_fname, aspect) in img_sources.items():
    src_path = os.path.join(brain_dir, src_fname)
    out_path = os.path.join(articles_img_dir, out_fname)
    img = Image.open(src_path)
    img.save(out_path, 'WEBP', quality=95)
    print(f"[OK] Processed {asset_id} -> {out_fname} ({img.size})")

    manifest['images'][asset_id] = {
        'path': f'/assets/images/articles/{out_fname}',
        'status': 'ready',
        'aspect': aspect
    }

with open(manifest_path, 'w', encoding='utf-8') as f:
    json.dump(manifest, f, indent=2, ensure_ascii=False)
print("[OK] Updated asset-manifest.json with all IGNITION feature images!")

# 2. Define IGNITION Special Feature Article
ignition_article = {
  "id": "ignition-special-feature",
  "slug": "ignition-special-feature",
  "title": "【COVER STORY】Major 1st Single『IGNITION』誕生ドキュメント — 始まりの火を胸に",
  "kicker": "COVER STORY / IGNITION",
  "dek": "メジャーという新たな戦場へ。5人が語る『IGNITION』の衝動、ライブ音源『Heatwave』収録の裏側、そして「まだ見たことのない景色」への誓い。",
  "publishDate": "2021-07",
  "publishDateFull": "2021.07.21",
  "readingTimeMinutes": 8,
  "mainSpeakerIds": ["kai", "sho", "leo", "ren", "yuto"],
  "heroAssetId": "article-hero-ignition",
  "relatedTrackIds": ["ignition-main", "back-to-the-spark", "heatwave-live"],
  "blocks": [
    {
      "type": "lead",
      "content": "2021年7月、IGNITEの記念すべきメジャーデビュー1stシングル『IGNITION』が放たれた。暗闇を切り裂く烈火のような疾走感と力強いダンスチューンでグループの覚悟を提示した本作。音楽誌『SOUND NOTE』の巻頭特集およびメンバー座談会記事を一堂に収録。"
    },
    {
      "type": "image",
      "assetId": "article-ignition-cover",
      "caption": "SOUND NOTE Vol.121 巻頭特集『Major 1st Single IGNITION』表紙"
    },
    {
      "type": "heading",
      "content": "ROUND TABLE INTERVIEW 「メジャーでも、始まりの熱は消さない」"
    },
    {
      "type": "paragraph",
      "content": "インディーズ時代の熱量をそのままに、メジャーという広大なステージへ踏み出した5人。楽屋裏で繰り広げられたラウンドテーブル・インタビュー。"
    },
    {
      "type": "image",
      "assetId": "article-ignition-roundtable",
      "caption": "ROUND TABLE INTERVIEW 誌面スプレッド"
    },
    {
      "type": "question",
      "content": "KAI（LEADER / RAP）"
    },
    {
      "type": "dialogue",
      "speakerId": "kai",
      "content": "「整えるだけじゃなく、熱も残したかった」 クオリティはもちろん大事。でも、俺たちがここまで走ってきた理由は“熱量”で、そこは絶対に手放したくない。だからこそ、ライブでも音源でも、その熱をどうきちんと残せるかを一番考えた。メジャーは通過点。ここからが本当の勝負だと思ってる。"
    },
    {
      "type": "question",
      "content": "SHO（DANCE LEADER）"
    },
    {
      "type": "dialogue",
      "speakerId": "sho",
      "content": "「大きい会場でも届く動きにした」 ステージが広くなる分、動きの一つひとつに意味が必要になる。遠くの人にも気持ちが伝わるように、見せ方やフォーメーションを何度も見直した。派手な演出だけじゃなく、五人の呼吸とシンクロ感をもっと意識してる。進化したい俺たちを見てほしい。"
    },
    {
      "type": "question",
      "content": "LEO（VOCAL / MOOD MAKER）"
    },
    {
      "type": "dialogue",
      "speakerId": "leo",
      "content": "「客席に返ってくる声で、曲が完成する」 レコーディングでは声の角度やプレスまでこだわりました。でも、完成はライブだと思っていて、みんなの声や表情が返ってきた瞬間に、この曲は初めて完成する。歌って、聴いて、五人とみんなで一つの景色をつくりたいです。"
    },
    {
      "type": "question",
      "content": "REN（MAIN VOCAL）"
    },
    {
      "type": "dialogue",
      "speakerId": "ren",
      "content": "「音の余白まで、今の五人で届けたい」 細かいニュアンスや余白の使い方にすごくこだわった。静けさの中にも想いを乗せられるように。歌やハーモニーを重ねていき、僕たちの“今”が詰まった一枚なので、その温度を感じてもらえたら嬉しいです。"
    },
    {
      "type": "question",
      "content": "YUTO（VOCAL / YOUNGEST）"
    },
    {
      "type": "dialogue",
      "speakerId": "yuto",
      "content": "「今の自分たちでもう一度始めたかった」 メジャーはゴールじゃなくて、スタートラインを引き直すタイミングだと思う。今の俺たちだからこそ描ける音楽があるし、届けたい景色もある。初心を忘れず、もっと高い場所を目指していきたいです。"
    },
    {
      "type": "heading",
      "content": "WHY LIVE VERSION? 『Heatwave - Live at 2021.06.12 -』を入れた理由"
    },
    {
      "type": "image",
      "assetId": "article-ignition-live-why",
      "caption": "SPECIAL FEATURE: 『Heatwave』ライブ音源収録の真相"
    },
    {
      "type": "paragraph",
      "content": "このシングルには、スタジオでのベストテイクではなく、あえてライブ音源を収録しました。それは——この曲が、あの日の声ではじめて完成したと、俺たちが信じているからです。"
    },
    {
      "type": "paragraph",
      "content": "『Heatwave』は、俺たちにとって特別なスタートを切った曲です。でも、あの日のライブで聴こえた歓声も、合いの手も、ペンライトの波も——それまでにない熱を持って、ステージに返ってきたんです。その瞬間、歌っている俺たちの中で、何かが変わりました。「この曲は、もう俺たちだけのものじゃない」って、心から思えた。"
    },
    {
      "type": "paragraph",
      "content": "音の揺れも、息づかいも、ちょっとしたミスさえも、そのすべてがリアルで、大切で、あの日の空気そのものを閉じ込めた“作品”だと思った。だからこそ、ライブ音源を選びました。みんなと一緒に作った『Heatwave』を、そのままこのシングルに込め込みたくて。"
    },
    {
      "type": "pullquote",
      "content": "あの日の声を、ちゃんとこの作品に残したかった。あの声があるから、今の俺たちがいる。 — LEO"
    },
    {
      "type": "heading",
      "content": "MEMBER FILE & NEXT STAGE 「また、ここから始まる。」"
    },
    {
      "type": "image",
      "assetId": "article-ignition-member-file",
      "caption": "MEMBER FILE & NEXT STAGE 誌面スプレッド"
    },
    {
      "type": "paragraph",
      "content": "つらい時期も、ぶつかり合う瞬間も、乗り越えてきた時間も、すべてが今のIGNITEをつくっている。ステージの上で交わす視線、重なる想い、響き合う声。それは、5人が本気で「音楽」と向き合ってきた証。これからも挑戦は続いていく。もっと高く、もっと遠くへ。この手でつかみたい未来がある。支えてくれるあなたと一緒に、まだ見たことのない景色へ。"
    },
    {
      "type": "pullquote",
      "content": "この5人で、まだ見たことのない景色へ。 — IGNITE"
    }
  ],
  "publication": {
    "fictionalReleaseDate": "2021-07",
    "publishAt": "2021-07-21T00:00:00Z",
    "visibility": "public",
    "campaignState": "past"
  }
}

# Add or replace in articles.json
with open(articles_path, 'r', encoding='utf-8') as f:
    articles = json.load(f)

existing_idx = next((i for i, a in enumerate(articles) if a['id'] == ignition_article['id']), -1)
if existing_idx >= 0:
    articles[existing_idx] = ignition_article
else:
    articles.append(ignition_article)

with open(articles_path, 'w', encoding='utf-8') as f:
    json.dump(articles, f, indent=2, ensure_ascii=False)

print("[OK] Updated articles.json with IGNITION special feature!")
