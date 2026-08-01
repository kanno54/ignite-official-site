import json

ignition_campaign = {
    'id': 'ignition',
    'status': 'archived',
    'releaseId': 'ignition',
    'releaseDate': '2021-07-21',
    'archiveOrderDate': '2021-07-21',
    'eyebrow': 'MAJOR DEBUT SINGLE / 2021.07 RELEASE',
    'title': 'IGNITION',
    'catchCopy': '五人の名前を、初めて外の世界へ。',
    'headline': '五人の名前を、初めて外の世界へ。',
    'subheadline': 'インディーズ期の約束を、初めて外の世界への宣言に変えたメジャー1st Single。',
    'desktopHero': '/assets/images/heroes/hero-ignition-campaign-desktop.webp',
    'mobileHero': '/assets/images/heroes/hero-ignition-campaign-mobile.webp',
    'heroAlt': '火花が立ち上がるデビューステージで、KAIを中心に陣形を組むIGNITEの五人',
    'primaryCta': {
        'text': 'LISTEN NOW ▶',
        'action': 'play'
    },
    'secondaryCta': {
        'text': 'VIEW RELEASE ➔',
        'action': 'link',
        'url': '/discography/ignition/'
    },
    'campaignColors': {
        'accent': '#FF4500',
        'deep': '#0F0705',
        'text': '#F6F3ED'
    },
    'relatedArticleIds': [
        'ignition-special-feature',
        'kai-ignition-five-names'
    ],
    'introduction': {
        'heading': 'THE FIRST MAJOR SPARK',
        'body': '2021年7月、IGNITEは『IGNITION』でメジャーデビューした。\n\n表題曲「IGNITION - Major Version -」は、インディーズMini Album『FIRESTARTER』に収録されていた原曲を、より大きな会場へ届けるために再構成した楽曲である。\n\nBPM、低域、サビのコーラス、五人の歌割りは更新された。しかし、原曲が持っていた未完成な勢いと、「まだ何者でもない五人が、ここから始める」という衝動は消されなかった。\n\nこれは、過去を否定して作り直したデビュー曲ではない。\n\n五人の間で交わしていた約束を、初めて外の世界へ向けて告げるための『IGNITION』だった。'
    },
    'comparison': {
        'heading': 'FROM PROMISE TO DECLARATION',
        'subtitle': '約束から、宣言へ。',
        'indies': {
            'title': 'INDIES VERSION',
            'subtitle': '自分たちへ向けた約束。',
            'body': '小規模な会場と近い客席の中で、五人がこの名前で進むことを確かめるために歌われた。\n\n歌唱やパフォーマンスの荒さ、まだ定まりきらない役割、緊張まで含めて、“最初のIGNITION”として残っている。'
        },
        'major': {
            'title': 'MAJOR VERSION',
            'subtitle': '外の世界へ向けた宣言。',
            'body': '強化された低域とコーラス、五人の声が順番に立ち上がる歌割りによって、より大きな会場を開くための曲へ更新された。\n\n曲の方が先に広い場所へ進み、その後ろを五人が追いかけていた時期の記録でもある。'
        }
    },
    'trackDescriptions': {
        'ignition-main': 'インディーズ版の衝動を残しながら、BPM、低域、サビのコーラス、五人の歌割りを再調整したメジャーデビュー曲。\n\n五人が別々の場所から現れ、サビで初めて一つになるパフォーマンスは、当時のIGNITEの姿そのものだった。',
        'back-to-the-spark': 'まだ何者でもなかった頃に見つけた小さな熱を振り返るカップリング曲。\n\n過去へ戻るためではなく、最初の火種をこれから先へ連れていくために歌われる。',
        'heatwave-live': 'インディーズ期から客席とのコール＆レスポンスで育ったライブ定番曲。\n\nメジャーデビュー作にあえてライブ音源を収録することで、「IGNITEはライブで完成するグループ」であることを最初に示した。'
    },
    'performance': {
        'heading': 'FIVE POSITIONS, ONE NAME',
        'subtitle': '五つの場所から、一つの名前へ。',
        'body': '『IGNITION』のステージは、五人が最初から一つの場所に立つ構成ではない。\n\n暗転した会場にメンバーの名前が順番に映し出され、五人は別々の位置から現れる。\n\nそれぞれの声と動きが順番に立ち上がり、サビで初めて中央へ集まる。\n\n誰か一人が完成した五人を率いるのではなく、別々の場所にいた五人が、同じ名前の下へ集まる。その瞬間が『IGNITION』の中心にある。',
        'elements': [
            '暗転した客席',
            '順番に映し出される五人の名前',
            '別々の位置から現れるメンバー',
            'サビで初めて中央へ集まるフォーメーション',
            '黒、赤、白を基調とした硬質な衣装',
            '赤とオレンジのステージライト',
            '床から立ち上がる火花',
            '派手な炎より、五人が正面へ踏み出す瞬間'
        ]
    }
}

with open('content/public/campaigns.json', 'r', encoding='utf-8') as f:
    campaigns = json.load(f)

# Filter out if exists
campaigns = [c for c in campaigns if c['id'] != 'ignition']

# Insert right after no-limits
nl_idx = -1
for i, c in enumerate(campaigns):
    if c['id'] == 'no-limits':
        nl_idx = i
        break

if nl_idx != -1:
    campaigns.insert(nl_idx + 1, ignition_campaign)
else:
    campaigns.append(ignition_campaign)

with open('content/public/campaigns.json', 'w', encoding='utf-8') as f:
    json.dump(campaigns, f, ensure_ascii=False, indent=2)

print('Successfully added ignition campaign to campaigns.json!')
