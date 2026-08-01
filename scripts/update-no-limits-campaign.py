import json

with open('content/public/campaigns.json', 'r', encoding='utf-8') as f:
    campaigns = json.load(f)

for c in campaigns:
    if c['id'] == 'no-limits':
        # Preserve original Hero & Basic Metadata EXACTLY
        # Add enriched sections
        c['introduction'] = {
            'heading': 'THE FIRST ANTHEM',
            'body': '2022年9月、IGNITEは3rd Single『No Limits』をリリースした。\n\n『IGNITION』で内側の火を外の世界へ運び、『BURN IT DOWN』で周囲から与えられた輪郭を壊した五人が、次に見つめたのは、その先に初めて開けた景色だった。\n\n各地のリリースイベントやライブを重ねる中で、五人は同じ曲でも客席によって呼吸や熱の返り方が変わることを知った。\n\n自分たちだけで完成させたはずの音楽が、手拍子や声を受け取るたびに別の形へ育っていく。\n\nその経験から生まれた「No Limits」は、前作までの荒々しさを残しながら、走り出すビート、空へ抜けるコーラス、客席が一斉に腕を上げられる大きな振付によって、五人の熱をステージの外側へ解き放った。\n\nIGNITEが初めて大きな会場を明確に意識して作り、初の代表曲と呼ばれるようになったアンセムである。'
        }
        c['focusSection'] = {
            'eyebrow': 'PERFORMANCE FOCUS / YUTO',
            'heading': 'THE VOICE THAT BROKE THROUGH',
            'subtitle': 'その声が、五人の届く距離を変えた。',
            'body': '「No Limits」の入口を任されたのは、五人の中で最も若いYUTOだった。\n\nそれまでのYUTOの高音は、楽曲へ色を足すように使われることが多かった。本作では、その声がなければ全員のサビへ進めない場所に置かれた。\n\nRENなら、もっと安定して同じ高さへ届くかもしれない。それでも必要とされたのは、きれいにまとめる前に先へ飛び出していくYUTOの声だった。\n\nレコーディングでは一度で成功したわけではない。音へ届かない、長さが足りない、入りが遅れる。失敗を重ねたあと、YUTOは高い音を取りに行くのではなく、まだ見えない客席のさらに向こうへ言葉を投げるように歌った。\n\nその声を聞いてSHOに振付の動きが見え、KAIが立ち位置を決め、LEOが客席へ広げ、RENの声が後ろから支えた。\n\nYUTO一人が曲を完成させたのではない。YUTOの声から始まったことで、五人全員の形が初めて一つ決まった。',
            'link': {
                'text': 'READ PERFORMANCE FOCUS: 高音が、曲の入口になった →',
                'url': '/features/yuto-hightone-feature/'
            }
        }
        c['memberRoles'] = {
            'eyebrow': 'FIVE VOICES, ONE ASCENT',
            'heading': '一つの声から、五人の上昇へ。',
            'roles': [
                {
                    'name': 'YUTO',
                    'role': 'FIRST SIGNAL',
                    'desc': 'ハイトーンで曲の入口を開き、四人と客席が入ってくる最初の合図を担う。'
                },
                {
                    'name': 'REN',
                    'role': 'MELODIC LIFT',
                    'desc': '伸びやかなサビとコーラスで、先へ飛び出すYUTOの声を五人の旋律へつなぐ。'
                },
                {
                    'name': 'KAI',
                    'role': 'FORWARD DRIVE',
                    'desc': 'ラップで五人の基準を言葉にし、終盤では客席へ声を預けて曲を会場全体へ開く。'
                },
                {
                    'name': 'SHO',
                    'role': 'MOTION DESIGN',
                    'desc': '大きな会場でも意味が届くフォーメーションと、客席が参加できる腕の動きを組み立てる。'
                },
                {
                    'name': 'LEO',
                    'role': 'OPEN INVITATION',
                    'desc': '客席の小さな反応を見つけ、五人の熱を初めて見る人まで広げる。'
                }
            ]
        }
        c['comparison'] = {
            'heading': 'FROM ONE TO US',
            'subtitle': '一人で越える限界から、誰かと越える限界へ。',
            'indies': {
                'title': 'EARLY DIRECTION',
                'subtitle': '自分の限界へ挑む、個人の決意。',
                'body': '制作初期は、一人の主人公が自分の限界へ挑み、前へ進むことを強く押し出す歌詞だった。'
            },
            'major': {
                'title': 'FINAL DIRECTION',
                'subtitle': '遅れても、転んでも、同じ方向へ進む僕ら。',
                'body': '各地の客席から返ってくる手拍子や声を知ったことで、主語は「一人」から「僕ら」へ移った。限界を越える強さよりも、誰かと進み続けることが曲の中心になった。'
            }
        }
        c['bannerCopy'] = "WE DIDN'T JUST RAISE OUR VOICES. WE RAISED THE ROOM."
        c['trackOverview'] = {
            'eyebrow': 'THREE WAYS FORWARD',
            'heading': '同じ前進を、三つの距離から描く。',
            'items': [
                {
                    'trackNo': '01',
                    'title': 'No Limits',
                    'subtitle': 'THE OPEN SKY',
                    'desc': '五人と客席が同じ方向へ腕を上げ、まだ見ぬ場所へ進む表題曲。'
                },
                {
                    'trackNo': '02',
                    'title': 'Higher Ground',
                    'subtitle': 'BEFORE THE DOOR OPENS',
                    'desc': '搬入口の非常灯と鉄の扉が開く直前、五人だけが知っていた沈黙を記録する曲。'
                },
                {
                    'trackNo': '03',
                    'title': 'Run With Us - Live Version -',
                    'subtitle': 'THE ROOM IN MOTION',
                    'desc': 'LEOとYUTOの呼びかけに客席が応え、その日の会場全体で完成するライブ曲。'
                }
            ]
        }
        c['trackDescriptions'] = {
            'no-limits-title': '初めて大きな会場を明確に意識して制作された、IGNITE初期を代表する前向きなアンセム。\n\n個人の限界突破を歌う初期案から、仲間や客席と同じ未来へ進む歌へ主題が変化した。YUTOのハイトーンを入口に、RENのサビ、KAIのラップ、SHOのフォーメーション、LEOの客席を巻き込む力が一つになる。',
            'higher-ground': 'ステージへ続く搬入口を舞台に、鉄の扉が開く直前の数秒を描いたミドルナンバー。\n\n非常灯、コンクリート、かすれた番号、立ち位置を示す印など、具体的な物の中へ五人が積み上げた時間を刻む。「No Limits」の開放感を、舞台裏の静かな緊張から支える曲である。',
            'run-with-us-live': '当時はまだスタジオ音源化されていなかった観客参加型の楽曲を、会場の反応ごと収録したライブ音源。\n\nLEOとYUTOの呼びかけ、返ってくる声と手拍子、会場ごとに変化する間までを曲の一部として記録している。後に1st Full Albumへスタジオ版が収録されるまで、このライブ版が曲の原点だった。'
        }
        c['performance'] = {
            'heading': 'HANDS IN THE AIR',
            'subtitle': '一人の手から、会場全体の振付へ。',
            'body': '現在の「No Limits」を象徴する、サビで腕を高く上げる振付は、正式なMV撮影前のイベントリハーサルで生まれた。\n\n当初は、大きな会場でも映える複雑な振付が検討されていた。しかし手数を増やすほど、曲が持つ開放感は失われていった。\n\n一度振付を考えずに曲を通した時、YUTOの声を聞いたステージ脇のスタッフが、無意識に片手を上げた。\n\nその動きをLEOが見つけ、KAI、REN、SHOへ広がり、五人の腕がまだ誰もいない客席へ向かって開いた。\n\nSHOが残したのは、五人だけが見せる難しい動きではなく、客席が続けられる形だった。\n\n一人へ届いた声を五人が受け取り、やがて客席全体で再現できる振付へ変える。その過程そのものが、「No Limits」が一人の限界を越える歌から、誰かと一緒に進む歌へ変わったことを表している。',
            'elements': [
                'サビで客席が一斉に手を上げる',
                'LEDに空、雲、白い光の筋を使う',
                '大きな会場でも意味が届くフォーメーション',
                'KAIが曲の終盤で客席へ声を預ける',
                '地方公演では会場名を入れた煽りが加わる',
                '2024年ツアーでは序盤の一体感を作る役目'
            ]
        }
        c['timelineHeading'] = 'FROM LIVE HOUSE TO ANTHEM'
        c['timelineSubtitle'] = '客席を知り、代表曲が生まれるまで。'
        c['timeline'] = [
            {
                'date': '2022.02',
                'title': 'RELEASE EVENT TOUR',
                'body': '初の全国規模となるリリースイベントツアーを開催。地方ごとに客席の反応が変わる面白さを五人が知る。'
            },
            {
                'date': '2022.07',
                'title': 'FIRST LARGE MUSIC EVENT',
                'body': '夏の大型音楽イベントへ初出演。「ライブで評価が上がるグループ」として知られ始める。'
            },
            {
                'date': '2022.09',
                'title': 'NO LIMITS RELEASE',
                'body': '3rd Single『No Limits』をリリース。客席が一斉に手を上げる演出が定着し、初の代表曲の一つになる。'
            },
            {
                'date': '2022.11',
                'title': 'LIVE HOUSE TOUR “NO LIMITS”',
                'body': '初のライブハウスツアーを開催。五人はパフォーマンスの完成度と、ライブ中の自由さの両方を求め始める。'
            },
            {
                'date': '2022.12',
                'title': 'YEAR-END LIVE “FIRST LIGHT”',
                'body': '年末単独公演を開催。翌年のフルアルバム制作と夏に向けた展開が発表される。'
            }
        ]

with open('content/public/campaigns.json', 'w', encoding='utf-8') as f:
    json.dump(campaigns, f, ensure_ascii=False, indent=2)

print('Successfully updated no-limits campaign in campaigns.json!')
