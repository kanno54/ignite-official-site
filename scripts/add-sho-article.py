import os
import json
from PIL import Image

site_dir = r'C:\Users\kanno\.gemini\antigravity-ide\scratch\ignite-official-site'
src_img_path = r'C:\Users\kanno\.gemini\antigravity-ide\brain\b87b4d11-11ef-4be7-91d5-516ee9752a2e\media__1785068114056.jpg'
articles_dir = os.path.join(site_dir, 'public', 'assets', 'images', 'articles')
manifest_path = os.path.join(site_dir, 'content', 'public', 'asset-manifest.json')
articles_path = os.path.join(site_dir, 'content', 'public', 'articles.json')

# 1. Save WebP Image
os.makedirs(articles_dir, exist_ok=True)
img = Image.open(src_img_path)
out_hero_path = os.path.join(articles_dir, 'hero-sho-burn-it-down.webp')
img.save(out_hero_path, 'WEBP', quality=95)
print(f"[OK] Saved SHO Article Hero WebP: {out_hero_path} ({img.size})")

# 2. Update asset-manifest.json
with open(manifest_path, 'r', encoding='utf-8') as f:
    manifest = json.load(f)

manifest['images']['article-hero-sho-burn-it-down'] = {
    'path': '/assets/images/articles/hero-sho-burn-it-down.webp',
    'status': 'ready',
    'aspect': '3:2'
}

with open(manifest_path, 'w', encoding='utf-8') as f:
    json.dump(manifest, f, indent=2, ensure_ascii=False)
print("[OK] Updated asset-manifest.json with article-hero-sho-burn-it-down!")

# 3. Add SHO Article to articles.json
with open(articles_path, 'r', encoding='utf-8') as f:
    articles = json.load(f)

sho_article = {
  "id": "sho-burn-it-down-interview",
  "slug": "sho-burn-it-down-interview",
  "title": "【SPECIAL INTERVIEW】綺麗なだけじゃ、踊れない",
  "kicker": "SPECIAL INTERVIEW / SHO",
  "dek": "メジャーデビューシングル『IGNITION』から三か月。2nd Single『BURN IT DOWN - Major Version -』で“崩す一拍”を選んだダンスリーダー・SHOが、表現の核心と覚悟を語る。",
  "publishDate": "2021-10",
  "publishDateFull": "2021.10.27",
  "readingTimeMinutes": 10,
  "mainSpeakerIds": ["sho", "kai", "leo", "ren", "yuto"],
  "heroAssetId": "article-hero-sho-burn-it-down",
  "relatedTrackIds": ["burn-it-down-main", "ashes-in-motion", "hands-up-hearts-out-live"],
  "blocks": [
    {
      "type": "lead",
      "content": "メジャーデビューシングル『IGNITION』から三か月。IGNITEが次に差し出したのは、明るい未来へ手を伸ばす曲ではなかった。低く沈むイントロ。言葉を切り裂くように入るKAIのラップ。一度崩れ、再び中央へ戻ってくる五人のフォーメーション。2nd Single『BURN IT DOWN - Major Version -』は、インディーズ期から存在していた楽曲を、メジャーのステージへ向けて再構築した一曲だ。その中でも、最も大きく姿を変えたのがダンスブレイクだった。「揃えるだけなら、たぶんできた」そう話すのは、ダンスリーダーのSHO。完成度を誰よりも重視する彼が、なぜこの曲で“崩す一拍”を選んだのか。その答えは、IGNITEが2枚目のシングルで何を燃やそうとしていたのか、その核心に近い。"
    },
    {
      "type": "question",
      "content": "――『BURN IT DOWN - Major Version -』は、インディーズ版からかなり印象が変わりました。SHOさん自身は、最初にこのアレンジを聴いた時どう感じましたか。"
    },
    {
      "type": "dialogue",
      "speakerId": "sho",
      "content": "重くなった、と思いました。音が太くなったという意味でもそうですけど、曲の立っている場所が変わった感じがしました。インディーズの頃の『BURN IT DOWN』は、もっと衝動が先にある曲だったんです。とにかく前に出る、壊す、止まらない。でもMajor Versionでは、同じ熱を持ったまま、ちゃんと狙って壊しにいく曲になった。だから、ただ激しく踊るだけでは足りないと思いました。"
    },
    {
      "type": "question",
      "content": "――“狙って壊す”というのは、かなりSHOさんらしい言葉ですね。"
    },
    {
      "type": "dialogue",
      "speakerId": "sho",
      "content": "壊すにも精度がいるので。適当に崩れるのは、ただのミスです。でも、どこを崩すか、どの拍で戻るか、誰が先にズレるかまで決めておけば、それは振付になる。『BURN IT DOWN』でやりたかったのは、そういうことでした。五人が綺麗に並んで、綺麗に動いて、綺麗に終わる。それもできると思います。でも、それならこの曲を2枚目で出す意味がない。"
    },
    {
      "type": "question",
      "content": "――サビ前に、一瞬だけ音が落ちるような箇所があります。あの一拍はかなり印象的でした。"
    },
    {
      "type": "dialogue",
      "speakerId": "sho",
      "content": "あそこは、最後まで残すか迷いました。スタッフさんからも、もう少し分かりやすく入った方がいいんじゃないか、という話はありました。ライブでやるなら、客席の熱が落ちる可能性もあるので。でも、あの一拍がないと、次に入る「BURN IT DOWN」が軽くなると思ったんです。息を止める場所があるから、次の音が燃える。ずっと強い音だけが鳴っていると、逆に熱が見えなくなる。"
    },
    {
      "type": "question",
      "content": "――そこに、五人の足音や息だけが残っているようにも聴こえます。"
    },
    {
      "type": "dialogue",
      "speakerId": "sho",
      "content": "実際、そういうイメージで作っています。完全な無音ではなくて、身体だけが残る一拍。音楽が止まったように見えて、五人は止まっていない。それがIGNITEらしいと思いました。曲が止まっても、身体は次の拍を知っている。照明が落ちても、立ち位置は変わらない。そういうものを、音にも振付にも入れたかった。"
    },
    {
      "type": "question",
      "content": "――ダンスブレイクでは、五人が一度別々の方向を向く構成になっています。あれも最初から決まっていたんですか。"
    },
    {
      "type": "dialogue",
      "speakerId": "sho",
      "content": "最初の案では、もっと揃っていました。全員が同じ角度で入って、同じタイミングで腕を出して、同じ場所へ戻る。それはそれで見栄えは良かったんですけど、綺麗すぎた。この曲は、五人が同じことをしているから強いんじゃなくて、違う熱を持ったまま、同じ場所へ戻ってくるから強い曲だと思ったんです。だから、一回だけバラけさせました。KAIは前へ出る。LEOは客席側へ熱を逃がす。RENは音の芯を残す。YUTOは少し遅れてでも戻ってくる。俺は、その全部が戻る場所を作る。そういう一拍にしたかった。"
    },
    {
      "type": "question",
      "content": "――“YUTOは少し遅れてでも戻ってくる”という言い方が印象的です。"
    },
    {
      "type": "dialogue",
      "speakerId": "sho",
      "content": "あいつは、すぐ急ぐので。でも、急ぐこと自体が悪いわけじゃないです。前に出たいと思っているから急ぐ。追いつきたいと思っているから、次の拍へ先に行こうとする。『BURN IT DOWN』の頃のYUTOには、その感じが必要だったと思います。綺麗に収まるより、少しはみ出して戻る方が、あいつの熱が見える。もちろん、本当にズレたら直しますけど。"
    },
    {
      "type": "question",
      "content": "――かなり厳しく見ているんですね。"
    },
    {
      "type": "dialogue",
      "speakerId": "sho",
      "content": "厳しく見ているというより、見えるだけです。誰がどこで迷っているか、どの足に体重が残っているか、どのタイミングで息を吸っているか。リハーサルをしていると、そういうのは見えます。見えるなら、言わないといけない。優しく言えるかどうかは、別の話ですけど。"
    },
    {
      "type": "question",
      "content": "――KAIさんのラップとの関係も強い曲です。KAIさんとは、振付について話しましたか。"
    },
    {
      "type": "dialogue",
      "speakerId": "sho",
      "content": "かなり話しました。KAIは、言葉で火を入れる人です。俺は、身体で温度を変える方なので。この曲では、その二つがぶつかった方がいいと思いました。KAIのラップが前に出る時、全員が後ろで揃っているだけだと、ただKAIを支えている構図になる。でも『BURN IT DOWN』は、そういう曲じゃない。KAIが火をつけて、他の四人がそれぞれ別の方向へ燃え広がる。それをもう一度、中央へ戻す。その動きがあって、初めて五人の曲になると思いました。"
    },
    {
      "type": "question",
      "content": "――2ndシングルでこの曲を出すことに、怖さはありませんでしたか。"
    },
    {
      "type": "dialogue",
      "speakerId": "sho",
      "content": "ありました。1枚目を出したあとだったので、もっと分かりやすく明るい曲を出す選択もあったと思います。その方が、新人としては見え方が良かったかもしれない。でも、ずっと見え方だけを選んでいたら、たぶんどこかで踊れなくなる。俺たちは、爽やかに見せるために集まったわけじゃない。綺麗なフォーメーションを見せるだけなら、他にもできる人はいる。IGNITEでやるなら、もっと身体の奥に残るものを出したかった。"
    },
    {
      "type": "question",
      "content": "――“綺麗なだけじゃ踊れない”という感覚でしょうか。"
    },
    {
      "type": "dialogue",
      "speakerId": "sho",
      "content": "そうですね。綺麗に踊ることは大事です。そこを捨てるつもりはないです。でも、綺麗に見せるために、熱を削るのは違う。汗も、息も、間違えそうになる瞬間も、全部消してしまったら、俺たちがこの曲をやる意味がなくなる。だから、Major Versionでは整えたかったんじゃなくて、もっと正確に荒くしたかった。"
    },
    {
      "type": "question",
      "content": "――“正確に荒くする”。"
    },
    {
      "type": "dialogue",
      "speakerId": "sho",
      "content": "はい。荒いまま出すのは、ただ未完成なだけです。でも、荒さをどこに残すか決めることはできる。音を重くする。サビ前に一拍落とす。ダンスブレイクで一度壊す。次の拍で戻る。それを全部決めたうえで、最後は熱に見えるようにする。そういう作業でした。"
    },
    {
      "type": "question",
      "content": "――カップリングの『Ashes in Motion』、そして3曲目の『Hands Up, Hearts Out - Live Version -』まで含めると、このシングルはかなり温度差があります。"
    },
    {
      "type": "dialogue",
      "speakerId": "sho",
      "content": "温度差はあります。でも、つながっていると思います。『BURN IT DOWN』で燃やす。『Ashes in Motion』で、燃やした後に残ったものを見る。『Hands Up, Hearts Out』で、それでも客席の前では笑える。その三つがあるから、ただ攻撃的なシングルにはなっていない。俺は、IGNITEは暗いグループだとは思っていないです。でも、明るいだけのグループでもない。笑うために、一回壊さないといけないものもある。このシングルは、そういう作品だと思います。"
    },
    {
      "type": "question",
      "content": "――ライブでこの曲を披露する時、いちばん見てほしいところはどこですか。"
    },
    {
      "type": "dialogue",
      "speakerId": "sho",
      "content": "サビ前の一拍です。派手なところではないです。照明も一瞬落ちるし、音も薄くなる。でも、あそこで五人が次の音を待っている。客席から見ると、一瞬止まったように見えるかもしれない。でも、俺たちは止まっていない。次に燃えるために、息を合わせている。そこを見てほしいです。"
    },
    {
      "type": "question",
      "content": "――最後に、SHOさんにとって『BURN IT DOWN - Major Version -』はどんな曲になりましたか。"
    },
    {
      "type": "dialogue",
      "speakerId": "sho",
      "content": "確認の曲です。自分たちが何を綺麗にしたくて、何を残したいのか。何を壊して、何を守るのか。それを五人で確認した曲。メジャーに行くと、いろんなものが整っていきます。音も、衣装も、見せ方も、言葉も。それは悪いことじゃないです。でも、整っていく中で、自分たちの熱まで薄くなるなら意味がない。だから、この曲で一回壊したかった。綺麗なだけじゃ終われないって、ちゃんと自分たちで言うために。"
    },
    {
      "type": "heading",
      "content": "記事には載らなかった話"
    },
    {
      "type": "paragraph",
      "content": "取材が終わったあと、SHOはしばらく椅子に座ったままだった。録音機が止まり、ライターがノートを閉じる。スタッフが次の撮影の準備を始める。遠くでLEOの笑い声がして、YUTOが何かを落とした音がした。"
    },
    {
      "type": "paragraph",
      "content": "SHOは右手の指で、膝の上に八つ数えた。一、二、三、四。五、六、七。そこで、わざと止める。身体の中では、もう次の拍が鳴っていた。待てばいい。崩れても、戻ればいい。"
    },
    {
      "type": "paragraph",
      "content": "「ショウ」振り返ると、KAIが立っていた。何かを聞く顔ではなかった。もう分かっている、という顔でもなかった。ただ、次のリハーサルへ行く時間だと告げるように、顎だけでドアの方を示した。"
    },
    {
      "type": "paragraph",
      "content": "SHOは立ち上がる。廊下の先で、LEOがYUTOの肩に腕を回していた。RENは二人の少し後ろを、飲み物を持ったまま歩いている。五人はまだ、綺麗に並んではいなかった。"
    },
    {
      "type": "paragraph",
      "content": "それでいい、とSHOは思った。次の拍で戻ればいい。スタジオの扉が開く。低いベース音が、床の向こうからかすかに漏れていた。SHOは一度だけ肩を回し、誰より先に中へ入った。"
    }
  ],
  "publication": {
    "fictionalReleaseDate": "2021-10",
    "publishAt": "2021-10-27T00:00:00Z",
    "visibility": "public",
    "campaignState": "past"
  }
}

# Add or replace in articles list
existing_idx = next((i for i, a in enumerate(articles) if a['id'] == sho_article['id']), -1)
if existing_idx >= 0:
    articles[existing_idx] = sho_article
else:
    articles.append(sho_article)

with open(articles_path, 'w', encoding='utf-8') as f:
    json.dump(articles, f, indent=2, ensure_ascii=False)
print("[OK] Updated content/public/articles.json with SHO BURN IT DOWN interview!")
