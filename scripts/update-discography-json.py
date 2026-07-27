import os
import shutil
import json

site_dir = r'C:\Users\kanno\.gemini\antigravity-ide\scratch\ignite-official-site'
drop_dir = os.path.join(site_dir, 'audio_drop')
audio_base = os.path.join(site_dir, 'public', 'media', 'audio')
discography_path = os.path.join(site_dir, 'content', 'public', 'discography.json')

# Copy MP3 files from audio_drop to public/media/audio/
file_mappings = [
    # FIRESTARTER (Indies Mini Album)
    ('01-firestarter.v1.mp3', 'firestarter/01-firestarter.v1.mp3'),
    ('02-ignition-indies.v1.mp3', 'firestarter/02-ignition-indies.v1.mp3'),
    ('03-burn-it-down-indies.v1.mp3', 'firestarter/03-burn-it-down-indies.v1.mp3'),
    ('04-heatwave-indies.v1.mp3', 'firestarter/04-heatwave-indies.v1.mp3'),
    ('05-runaway-beat.v1.mp3', 'firestarter/05-runaway-beat.v1.mp3'),
    ('06-first-light.v1.mp3', 'firestarter/06-first-light.v1.mp3'),

    # IGNITION (1st Single)
    ('01-ignition-major.v1.mp3', 'ignition/01-ignition-major.v1.mp3'),
    ('02-back-to-the-spark.v1.mp3', 'ignition/02-back-to-the-spark.v1.mp3'),
    ('03-heatwave-live.v1.mp3', 'ignition/03-heatwave-live.v1.mp3'),

    # BURN IT DOWN (2nd Single)
    ('01-burn-it-down-major.v1.mp3', 'burn-it-down/01-burn-it-down-major.v1.mp3'),
    ('02-ashes-in-motion.v1.mp3', 'burn-it-down/02-ashes-in-motion.v1.mp3'),
    ('03-hands-up-hearts-out-live.v1.mp3', 'burn-it-down/03-hands-up-hearts-out-live.v1.mp3'),

    # No Limits (3rd Single)
    ('01-no-limits.v1.mp3', 'no-limits/01-no-limits.v1.mp3'),
    ('02-higher-ground.v1.mp3', 'no-limits/02-higher-ground.v1.mp3'),
    ('03-run-with-us-live.v1.mp3', 'no-limits/03-run-with-us-live.v1.mp3'),
]

print("--- COPYING MP3 FILES TO MATCH USER JSON ---")
for src_file, rel_target in file_mappings:
    src_path = os.path.join(drop_dir, src_file)
    dst_path = os.path.join(audio_base, rel_target)
    os.makedirs(os.path.dirname(dst_path), exist_ok=True)
    if os.path.exists(src_path):
        shutil.copy2(src_path, dst_path)
        print(f"[OK] {src_file} -> {rel_target} ({os.path.getsize(dst_path)} bytes)")
    elif os.path.exists(dst_path):
        print(f"[OK-EXIST] {rel_target} already exists ({os.path.getsize(dst_path)} bytes)")
    else:
        print(f"[WARN] Missing: {src_file}")

# Write new discography.json strictly following user instructions
discography_data = {
  "releases": [
    {
      "id": "firestarter",
      "slug": "firestarter",
      "title": "FIRESTARTER",
      "format": "Indies Mini Album",
      "fictionalReleaseDate": "2020-10",
      "fictionalReleaseDateFull": "2020.10.14",
      "coverAssetId": "cover-firestarter",
      "description": "IGNITEの原点となるインディーズ初ミニアルバム。小さな spark から大きな炎へと広がっていく初期衝動と五人の誓いを凝縮。",
      "linerNotes": "まだ何者でもなかった5人が、自分たちの足で立った最初の一歩。泥臭くも熱いビートとまっすぐな言葉が詰まった原点作。",
      "trackIds": [
        "firestarter-main",
        "firestarter-ignition-indies",
        "firestarter-burn-it-down-indies",
        "firestarter-heatwave-indies",
        "firestarter-runaway-beat",
        "firestarter-first-light"
      ],
      "campaignState": "past",
      "publication": {
        "fictionalReleaseDate": "2020-10",
        "publishAt": "2020-10-14T00:00:00Z",
        "visibility": "public",
        "campaignState": "past"
      }
    },
    {
      "id": "ignition",
      "slug": "ignition",
      "title": "IGNITION",
      "format": "1st Single",
      "fictionalReleaseDate": "2021-07",
      "fictionalReleaseDateFull": "2021.07.21",
      "coverAssetId": "cover-ignition",
      "description": "記念すべきメジャーデビューシングル。暗闇を切り裂く烈火のような疾走感と力強いダンスチューンでグループの覚悟を提示。",
      "linerNotes": "メジャーという新たな戦場への覚悟。五つの火種が一つに合わさり、爆発的なエネルギーとなって解き放たれる瞬間を切り取った。",
      "trackIds": [
        "ignition-main",
        "back-to-the-spark",
        "heatwave-live"
      ],
      "campaignState": "past",
      "publication": {
        "fictionalReleaseDate": "2021-07",
        "publishAt": "2021-07-21T00:00:00Z",
        "visibility": "public",
        "campaignState": "past"
      }
    },
    {
      "id": "burn-it-down",
      "slug": "burn-it-down",
      "title": "BURN IT DOWN",
      "format": "2nd Single",
      "fictionalReleaseDate": "2021-10",
      "fictionalReleaseDateFull": "2021.10.27",
      "coverAssetId": "cover-burn-it-down",
      "description": "過剰な自己装飾を燃やし尽くし、表現の本質へ向かう強靭な2ndシングル。SHOによるソリッドな振付と圧巻の重厚感が話題に。",
      "linerNotes": "「全てを燃やし尽くした後に何が残るか」。過去の自分たちを脱ぎ捨て、より高く洗練されたパフォーマンスへ到達するための自己革新。",
      "trackIds": [
        "burn-it-down-main",
        "ashes-in-motion",
        "hands-up-hearts-out-live"
      ],
      "campaignState": "past",
      "publication": {
        "fictionalReleaseDate": "2021-10",
        "publishAt": "2021-10-27T00:00:00Z",
        "visibility": "public",
        "campaignState": "past"
      }
    },
    {
      "id": "no-limits",
      "slug": "no-limits",
      "title": "No Limits",
      "format": "3rd Single",
      "fictionalReleaseDate": "2022-09",
      "fictionalReleaseDateFull": "2022.09.14",
      "coverAssetId": "cover-no-limits",
      "description": "上昇気流に乗って限界を破る3rdシングル。青空と白い光へと視覚を開き、YUTOの初ハイトーンフィーチャーが光る最高到達点。",
      "linerNotes": "これまでの重厚な暗闇から一転、スピード感あふれるスカイブルーの世界へと視界がひろがる楽曲。五人の歌声が重なり合い、まだ見ぬ場所へ駆け抜ける。",
      "trackIds": [
        "no-limits-title",
        "higher-ground",
        "run-with-us-live"
      ],
      "campaignState": "current",
      "publication": {
        "fictionalReleaseDate": "2022-09",
        "publishAt": "2022-09-14T00:00:00Z",
        "visibility": "public",
        "campaignState": "current"
      }
    }
  ],
  "recordings": [
    # FIRESTARTER (Indies Mini Album)
    {
      "id": "firestarter-main",
      "releaseId": "firestarter",
      "title": "FIRESTARTER",
      "versionLabel": "Indies Version",
      "trackNumber": 1,
      "durationSeconds": 220,
      "audioUrl": "/media/audio/firestarter/01-firestarter.v1.mp3",
      "audioStatus": "ready",
      "spotlightMemberIds": ["kai", "leo"],
      "moodTags": ["火をつけたい"],
      "linerNotes": "IGNITE結成の原点。泥臭くも途切れぬ情熱で、自らの手で火を点ける決意を謳う。",
      "lyrics": [
        { "speaker": "KAI", "text": "暗闇の中に 一筋の火種を" },
        { "speaker": "all", "text": "俺たちが FIRESTARTER" }
      ]
    },
    {
      "id": "firestarter-ignition-indies",
      "releaseId": "firestarter",
      "title": "IGNITION",
      "versionLabel": "Indies Version",
      "trackNumber": 2,
      "durationSeconds": 210,
      "audioUrl": "/media/audio/firestarter/02-ignition-indies.v1.mp3",
      "audioStatus": "ready",
      "spotlightMemberIds": ["kai", "sho"],
      "moodTags": ["火をつけたい"],
      "linerNotes": "インディーズ時代の初期型IGNITION。原石のままの荒々しさと熱量が宿る。",
      "lyrics": [
        { "speaker": "KAI", "text": "ここから始まる 初期衝動の火花" }
      ]
    },
    {
      "id": "firestarter-burn-it-down-indies",
      "releaseId": "firestarter",
      "title": "BURN IT DOWN",
      "versionLabel": "Indies Version",
      "trackNumber": 3,
      "durationSeconds": 195,
      "audioUrl": "/media/audio/firestarter/03-burn-it-down-indies.v1.mp3",
      "audioStatus": "ready",
      "spotlightMemberIds": ["sho"],
      "moodTags": ["火をつけたい"],
      "linerNotes": "インディーズ版BURN IT DOWN。粗削りなビートと直感的なダンスパフォーマンス。",
      "lyrics": [
        { "speaker": "SHO", "text": "過去を燃やして 前へ進む" }
      ]
    },
    {
      "id": "firestarter-heatwave-indies",
      "releaseId": "firestarter",
      "title": "Heatwave",
      "versionLabel": "Indies Version",
      "trackNumber": 4,
      "durationSeconds": 205,
      "audioUrl": "/media/audio/firestarter/04-heatwave-indies.v1.mp3",
      "audioStatus": "ready",
      "spotlightMemberIds": ["leo"],
      "moodTags": ["一緒に騒ぎたい"],
      "linerNotes": "熱気と歓声を巻き起こすインディーズナンバー。",
      "lyrics": [
        { "speaker": "LEO", "text": "押し寄せる熱波を感じて" }
      ]
    },
    {
      "id": "firestarter-runaway-beat",
      "releaseId": "firestarter",
      "title": "Runaway Beat",
      "versionLabel": "Indies Version",
      "trackNumber": 5,
      "durationSeconds": 200,
      "audioUrl": "/media/audio/firestarter/05-runaway-beat.v1.mp3",
      "audioStatus": "ready",
      "spotlightMemberIds": ["sho", "leo"],
      "moodTags": ["前へ進みたい"],
      "linerNotes": "疾走するビートとパッション溢れるラップ。",
      "lyrics": [
        { "speaker": "SHO", "text": "駆け抜けるビート 誰も止められない" }
      ]
    },
    {
      "id": "firestarter-first-light",
      "releaseId": "firestarter",
      "title": "First Light",
      "versionLabel": "Indies Version",
      "trackNumber": 6,
      "durationSeconds": 240,
      "audioUrl": "/media/audio/firestarter/06-first-light.v1.mp3",
      "audioStatus": "ready",
      "spotlightMemberIds": ["ren", "yuto"],
      "moodTags": ["朝の光へ戻りたい"],
      "linerNotes": "暗闇の先にある最初の光を描いたバラード。",
      "lyrics": [
        { "speaker": "REN", "text": "夜明けの光が 未来を照らす" }
      ]
    },

    # IGNITION (1st Single)
    {
      "id": "ignition-main",
      "releaseId": "ignition",
      "title": "IGNITION - Major Version -",
      "versionLabel": "Major Version",
      "trackNumber": 1,
      "durationSeconds": 218,
      "audioUrl": "/media/audio/ignition/01-ignition-major.v1.mp3",
      "audioStatus": "ready",
      "spotlightMemberIds": ["kai", "sho"],
      "moodTags": ["火をつけたい"],
      "linerNotes": "メジャーデビューの火蓋を切ったアッパーチューン。KAIの咆哮とSHOのラップが強烈。",
      "lyrics": [
        { "speaker": "KAI", "text": "火花を散らせ IGNITION!" }
      ]
    },
    {
      "id": "back-to-the-spark",
      "releaseId": "ignition",
      "title": "Back to the Spark",
      "versionLabel": "Original Version",
      "trackNumber": 2,
      "durationSeconds": 200,
      "audioUrl": "/media/audio/ignition/02-back-to-the-spark.v1.mp3",
      "audioStatus": "ready",
      "spotlightMemberIds": ["leo", "sho"],
      "moodTags": ["一緒に騒ぎたい"],
      "linerNotes": "原点である火種へと回帰するメッセージソング。",
      "lyrics": [
        { "speaker": "SHO", "text": "原点の輝きへと手を伸ばす" }
      ]
    },
    {
      "id": "heatwave-live",
      "releaseId": "ignition",
      "title": "Heatwave - Live Version -",
      "versionLabel": "Live Version",
      "trackNumber": 3,
      "durationSeconds": 225,
      "audioUrl": "/media/audio/ignition/03-heatwave-live.v1.mp3",
      "audioStatus": "ready",
      "spotlightMemberIds": ["ren", "yuto"],
      "moodTags": ["一緒に騒ぎたい"],
      "linerNotes": "熱気あふれるライブ会場の歓声と圧倒的パフォーマンスを収録。",
      "lyrics": [
        { "speaker": "LEO", "text": "会場全体で熱くなろうぜ！" }
      ]
    },

    # BURN IT DOWN (2nd Single)
    {
      "id": "burn-it-down-main",
      "releaseId": "burn-it-down",
      "title": "BURN IT DOWN - Major Version -",
      "versionLabel": "Major Version",
      "trackNumber": 1,
      "durationSeconds": 212,
      "audioUrl": "/media/audio/burn-it-down/01-burn-it-down-major.v1.mp3",
      "audioStatus": "ready",
      "spotlightMemberIds": ["sho", "kai"],
      "moodTags": ["火をつけたい", "前へ進みたい"],
      "linerNotes": "ソリッドな重低音と激しいフォーメーションダンスで魅せる2ndシングル。",
      "lyrics": [
        { "speaker": "SHO", "text": "余分な装飾はすべて Burn it down" }
      ]
    },
    {
      "id": "ashes-in-motion",
      "releaseId": "burn-it-down",
      "title": "Ashes in Motion",
      "versionLabel": "Original Version",
      "trackNumber": 2,
      "durationSeconds": 235,
      "audioUrl": "/media/audio/burn-it-down/02-ashes-in-motion.v1.mp3",
      "audioStatus": "ready",
      "spotlightMemberIds": ["ren", "yuto"],
      "moodTags": ["朝の光へ戻りたい"],
      "linerNotes": "舞い上がる灰の中で躍動する意志を描いたナンバー。",
      "lyrics": [
        { "speaker": "REN", "text": "舞い上がる灰を超えて進む" }
      ]
    },
    {
      "id": "hands-up-hearts-out-live",
      "releaseId": "burn-it-down",
      "title": "Hands Up, Hearts Out - Live Version -",
      "versionLabel": "Live Version",
      "trackNumber": 3,
      "durationSeconds": 245,
      "audioUrl": "/media/audio/burn-it-down/03-hands-up-hearts-out-live.v1.mp3",
      "audioStatus": "ready",
      "spotlightMemberIds": ["kai", "sho", "leo", "ren", "yuto"],
      "moodTags": ["一緒に騒ぎたい"],
      "linerNotes": "手を掲げ心を解放するライブでの圧巻パフォーマンス。",
      "lyrics": [
        { "speaker": "all", "text": "Hands up, Hearts out!" }
      ]
    },

    # No Limits (3rd Single)
    {
      "id": "no-limits-title",
      "releaseId": "no-limits",
      "title": "No Limits",
      "versionLabel": "Original Version",
      "trackNumber": 1,
      "durationSeconds": 215,
      "audioUrl": "/media/audio/no-limits/01-no-limits.v1.mp3",
      "audioStatus": "ready",
      "spotlightMemberIds": ["yuto", "kai", "ren"],
      "moodTags": ["前へ進みたい", "火をつけたい"],
      "linerNotes": "YUTOの突き抜けるハイトーンサビと、KAI/RENのツインボーカルが駆け抜ける3rdシングル表題曲。",
      "lyrics": [
        { "speaker": "KAI", "text": "見上げた空の深さに 理由を探していた" },
        { "speaker": "YUTO", "text": "風が切り開く未来へ 踏み出すこの一歩" },
        { "speaker": "all", "text": "We burn, We fly, 限界なんて超えてゆけ！" }
      ]
    },
    {
      "id": "higher-ground",
      "releaseId": "no-limits",
      "title": "Higher Ground",
      "versionLabel": "Original Version",
      "trackNumber": 2,
      "durationSeconds": 204,
      "audioUrl": "/media/audio/no-limits/02-higher-ground.v1.mp3",
      "audioStatus": "ready",
      "spotlightMemberIds": ["ren", "sho"],
      "moodTags": ["朝の光へ戻りたい", "前へ進みたい"],
      "linerNotes": "RENの透明感溢れるファルセットと、SHOのエモーショナルな低音ラップが響くカップリングナンバー。",
      "lyrics": [
        { "speaker": "REN", "text": "朝の光が差し込む前に 高い場所へ" },
        { "speaker": "SHO", "text": "影を振り払い 確かな足跡を刻む" },
        { "speaker": "all", "text": "Higher and higher, 光の射す方へ" }
      ]
    },
    {
      "id": "run-with-us-live",
      "releaseId": "no-limits",
      "title": "Run With Us - Live Version -",
      "versionLabel": "Live Version",
      "trackNumber": 3,
      "durationSeconds": 230,
      "audioUrl": "/media/audio/no-limits/03-run-with-us-live.v1.mp3",
      "audioStatus": "ready",
      "spotlightMemberIds": ["leo", "kai", "sho", "ren", "yuto"],
      "moodTags": ["一緒に騒ぎたい", "火をつけたい"],
      "linerNotes": "観客との一体感を最高潮に引き上げるアンセムの熱狂ライブテイク。",
      "lyrics": [
        { "speaker": "LEO", "text": "準備はいいか？ 手を打ち鳴らせ！" },
        { "speaker": "all", "text": "一緒に走ろう この火が消える前に！" }
      ]
    }
  ]
}

with open(discography_path, 'w', encoding='utf-8') as f:
    json.dump(discography_data, f, indent=2, ensure_ascii=False)

print("[OK] Updated content/public/discography.json following user instructions!")
