import json
import os
import re

print("--- UPDATING RISE AGAIN DISCOGRAPHY DETAILS ---")

disc_path = "content/public/discography.json"
manifest_path = "content/public/asset-manifest.json"

# 1. Update Asset Manifest
with open(manifest_path, "r", encoding="utf-8") as f:
    manifest = json.load(f)

# Ensure all alias keys exist in manifest.images
manifest["images"]["cover-rise-again"] = {
    "path": "/media/images/rise-again/RA-C01_v01.png",
    "status": "ready",
    "aspect": "1:1"
}
manifest["images"]["RA-C01"] = {
    "path": "/media/images/rise-again/RA-C01_v01.png",
    "status": "ready",
    "aspect": "1:1"
}
manifest["images"]["poster-rise-again-title"] = {
    "path": "/media/images/rise-again/RA-C02_v01.png",
    "status": "ready",
    "aspect": "1:1"
}
manifest["images"]["RA-C02"] = {
    "path": "/media/images/rise-again/RA-C02_v01.png",
    "status": "ready",
    "aspect": "1:1"
}
manifest["images"]["poster-keep-the-flame"] = {
    "path": "/media/images/rise-again/RA-C03_v01.png",
    "status": "ready",
    "aspect": "1:1"
}
manifest["images"]["RA-C03"] = {
    "path": "/media/images/rise-again/RA-C03_v01.png",
    "status": "ready",
    "aspect": "1:1"
}
manifest["images"]["poster-afterglow-live"] = {
    "path": "/media/images/rise-again/RA-C04_v01.png",
    "status": "ready",
    "aspect": "1:1"
}
manifest["images"]["RA-C04"] = {
    "path": "/media/images/rise-again/RA-C04_v01.png",
    "status": "ready",
    "aspect": "1:1"
}

with open(manifest_path, "w", encoding="utf-8") as f:
    json.dump(manifest, f, ensure_ascii=False, indent=2)
print("  [OK] Updated asset-manifest.json with RISE AGAIN cover & poster keys.")

# 2. Helper to parse markdown lyrics clean into LyricLine objects
def parse_lyrics_file(file_path):
    if not os.path.exists(file_path):
        return []
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    lines = content.splitlines()
    lyrics = []
    current_speaker = ""
    for line in lines:
        line_str = line.strip()
        if line_str.startswith("#"):
            continue
        header_match = re.match(r"^[\*\_]*\[(.*?)\][\*\_]*$", line_str)
        if header_match:
            current_speaker = header_match.group(1)
            continue
        lyrics.append({"speaker": current_speaker, "text": line_str})
    return lyrics

lyrics_t01 = parse_lyrics_file("data/Lyrics/008-RiseAgain/01-RISE-AGAIN.md")
lyrics_t02 = parse_lyrics_file("data/Lyrics/008-RiseAgain/02-Keep-the-Flame.md")
lyrics_t03 = parse_lyrics_file("data/Lyrics/008-RiseAgain/03-Afterglow-Live.md")

# 3. Load & Update discography.json
with open(disc_path, "r", encoding="utf-8") as f:
    disc_data = json.load(f)

# Update Release object for rise-again
single_liner_notes = """『RISE AGAIN』は、うまくいった瞬間だけを切り取った勝利の歌ではない。

迷い、失敗し、立ち止まった時間まで抱えたまま、それでももう一度同じ場所に立とうとする五人を描いたシングルである。

前作『Silent Signal』で、IGNITEは言葉を減らし、視線や呼吸、身体の動きの中に感情を置いた。そこから続く本作では、その静けさのあとに残ったものを、再び動きへ変えていく。

三曲は、それぞれ異なる距離から「続けること」を描いている。

表題曲『RISE AGAIN』で立ち上がり、『Keep the Flame』で消さずに残し、『Afterglow - Live Version -』でステージを終えたあとにも残る熱を確かめる。

大きな答えを提示するのではなく、次へ進むための温度を手元に残す作品となった。"""

for r in disc_data["releases"]:
    if r["id"] == "rise-again":
        r["coverAssetId"] = "cover-rise-again"
        r["coverImage"] = "/media/images/rise-again/RA-C01_v01.png"
        r["linerNotes"] = single_liner_notes

# Remove any old rise-again recordings if present
disc_data["recordings"] = [rec for rec in disc_data["recordings"] if rec.get("releaseId") != "rise-again" and rec.get("id") not in ["rise-again-title", "rise-again-keep-the-flame", "rise-again-afterglow-live"]]

# Define full Track Recordings for Rise Again
ra_recordings = [
    {
        "id": "rise-again-title",
        "releaseId": "rise-again",
        "title": "RISE AGAIN",
        "versionLabel": "6th Single Title Track",
        "trackNumber": 1,
        "trackNo": 1,
        "durationSeconds": 215,
        "audioUrl": "/media/audio/rise-again/RA-A01_v01.mp3",
        "audioStatus": "ready",
        "posterAssetId": "poster-rise-again-title",
        "coverImage": "/media/images/rise-again/RA-C02_v01.png",
        "spotlightMemberIds": ["kai", "sho", "leo", "ren", "yuto"],
        "moodTags": ["再起", "決意", "暗青→白金", "アンセム"],
        "linerNotes": "「何度でも立ち上がる」という強い言葉を持ちながら、この曲が肯定しているのは無傷の強さではない。\n\n足が重い朝も、思うように届かなかった時間も、揃わなかったステップも、すべてを消さずに次へ持っていくことが、この曲の中心にある。\n\nIGNITEにとっての“再起”は、以前とまったく同じ自分たちへ戻ることではない。五人がそれぞれに変化したあと、もう一度同じステージに立ち、新しい形で呼吸を合わせることだ。\n\nサビは客席と一緒に歌える大きさを持ち、ライブでは会場そのものが曲の一部になる。\n\n暗い青から白金へ移っていく照明も、突然すべてが明るくなる演出ではない。傷や迷いの輪郭を残したまま、少しずつ朝へ近づいていく。\n\n「まだ終わっていない」という感覚を、五人だけではなく、その場にいる全員で共有するためのアンセムである。",
        "lyrics": lyrics_t01
    },
    {
        "id": "rise-again-keep-the-flame",
        "releaseId": "rise-again",
        "title": "Keep the Flame",
        "versionLabel": "6th Single Coupling Track",
        "trackNumber": 2,
        "trackNo": 2,
        "durationSeconds": 208,
        "audioUrl": "/media/audio/rise-again/RA-A02_v01.mp3",
        "audioStatus": "ready",
        "posterAssetId": "poster-keep-the-flame",
        "coverImage": "/media/images/rise-again/RA-C03_v01.png",
        "spotlightMemberIds": ["leo", "yuto", "ren"],
        "moodTags": ["火種", "維持", "静かな強さ"],
        "linerNotes": "表題曲が“立ち上がる瞬間”を描くなら、『Keep the Flame』が見つめるのは、そのあとに残った小さな熱だ。\n\nここで描かれる火は、何かを焼き尽くす大きな炎ではない。暗がりの中で静かに残る火種のような、手元で守り続ける温度に近い。\n\n一度立ち上がったからといって、迷いが消えるわけではない。それでも、完全に消してしまわなければ次へつなげられる。\n\n『RISE AGAIN』の強い再起と、『Afterglow』の静かな余韻の間に置かれることで、本作の三曲をつなぐ役割も持つ。\n\n前へ進むことだけではなく、“消さないこと”もまた意志である。\n\nその静かな強さを歌う一曲だ。",
        "lyrics": lyrics_t02
    },
    {
        "id": "rise-again-afterglow-live",
        "releaseId": "rise-again",
        "title": "Afterglow - Live Version -",
        "versionLabel": "Live Version (Tokyo Stage)",
        "trackNumber": 3,
        "trackNo": 3,
        "durationSeconds": 240,
        "audioUrl": "/media/audio/rise-again/RA-A03_v01.mp3",
        "audioStatus": "ready",
        "posterAssetId": "poster-afterglow-live",
        "coverImage": "/media/images/rise-again/RA-C04_v01.png",
        "spotlightMemberIds": ["leo", "kai", "ren"],
        "moodTags": ["ライブ余韻", "EDM/シティポップ", "余光"],
        "linerNotes": "『Afterglow』は、派手なステージが終わったあとに残る静かな感情を描いた楽曲。このシングルに収録されたのは、後に『EQUINOX』へ収められるスタジオ版より先に記録されたLive Versionである。\n\nライブ版では、原曲が持つ余韻を残しながら、テンポとビートを引き上げ、クールなEDM／シティポップの感触へ組み替えている。\n\n客席の光、会場の呼吸、歌い終えたあとの熱まで含めて一曲として残すことが、このバージョンの意味になっている。\n\nとくにLEOの柔らかな歌声は、派手な音の中でも温度を失わず、曲が終わりへ向かうほど客席との距離を近づけていく。\n\nステージを照らす無数のライトが星のように見える時間とともに、再起を掲げたシングルを静かな余韻へ着地させる。\n\n『RISE AGAIN』で立ち上がり、『Keep the Flame』で火を残し、『Afterglow - Live Version -』でその熱を持ち帰る。\n\nこの三曲で、IGNITEは“もう一度始めること”を、一瞬の決意ではなく、その後も続いていく時間として描いている。",
        "lyrics": lyrics_t03
    }
]

disc_data["recordings"].extend(ra_recordings)

with open(disc_path, "w", encoding="utf-8") as f:
    json.dump(disc_data, f, ensure_ascii=False, indent=2)

print("  [OK] Updated discography.json with split liner notes, track coverImages, posterAssetIds, and full parameters.")
