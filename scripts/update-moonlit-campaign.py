import json

with open('content/public/campaigns.json', 'r', encoding='utf-8') as f:
    campaigns = json.load(f)

for c in campaigns:
    if c['id'] == 'moonlit':
        # Preserve Hero assets, status: "current", & basic metadata EXACTLY
        # Remove no-limits-interview from relatedArticleIds as requested in Section 13
        c['relatedArticleIds'] = [
            'ren-moonlit-interview',
            'between-the-lights-story'
        ]
        c['introduction'] = {
            'heading': 'ANOTHER KIND OF LIGHT',
            'body': '2023年5月20日、IGNITEは4th Single『Moonlit』をリリースした。\n\n3rd Single『No Limits』で、五人の声は初めて大きく外へ開いた。高く抜ける歌声、客席を一つにする振付、同じ未来へ進む言葉。IGNITEは、自分たちの熱がステージの外側まで届き、客席と一緒に大きな景色を作る喜びを知った。\n\nその次に五人が選んだのは、さらに強く、さらに大きく鳴る曲ではなかった。\n\n歓声が止んだあとにも残る感情。近くにいるのに言葉にできないこと。遠く離れた誰かと、同じ空を見ていたいという願い。\n\n『Moonlit』は、前作で外へ広げた視線を静かに五人の内側へ戻し、IGNITEが初めて本格的に「夜」を描いた作品である。\n\n願いが届いたとも、不安が消えたとも歌わない。それでも、言えなかった言葉や、名前をつけられない気持ちを無かったことにはしない。\n\n暗闇を消し去るのではなく、その中に残るものを静かに照らす。『Moonlit』は、五人が初めて手にした、もう一つの光だった。'
        }
        c['bannerCopy'] = "NOT EVERY LIGHT HAS TO BURN. SOME LIGHTS STAY QUIET."
        c['comparison'] = {
            'heading': 'FROM STILLNESS TO MOTION',
            'subtitle': '立ち止まる夜から、歩き続ける夜へ。',
            'indies': {
                'title': 'EARLY DIRECTION',
                'subtitle': 'A QUIET BALLAD',
                'body': '制作当初は、ピアノと歌を中心にした、より静かなバラードとして構想されていた。\n\n言葉にならない感情を抱え、夜の中で一度立ち止まることを強く感じさせる初期案だった。'
            },
            'major': {
                'title': 'FINAL DIRECTION',
                'subtitle': 'A WALKING MID-TEMPO',
                'body': '五人が求めたのは、答えが出るまで立ち止まる曲ではなかった。\n\n抑制されたビートを残し、陰影のあるシンセサイザーと柔らかな低音を重ねることで、名前を呼べなくても、その感情を抱えたまま歩いていけるミドルダンスナンバーへ組み替えられた。'
            }
        }
        c['vocalFocus'] = {
            'eyebrow': 'VOCAL FOCUS',
            'heading': 'TWO VOICES IN ONE NIGHT',
            'subtitle': '夜を近づける声と、そこへ置いていく声。',
            'yuto': {
                'label': 'THE CLOSEST BREATH',
                'body': '「Moonlit」の歌い出しを担うのはYUTO。\n\n前作「No Limits」では、ハイトーンによって五人をまだ見ぬ景色へ連れ出した。その次の作品で必要とされたのは、遠くまで飛ばす声ではなく、誰にも見せなかった弱さをすぐ近くの夜へ置く、息を含んだ低い声だった。\n\n語尾の揺れや息を技術で整えすぎず、その瞬間にしかない不確かさを残した歌唱が、曲の距離と温度を決めている。'
            },
            'ren': {
                'label': 'THE VOICE LEFT IN PLACE',
                'body': 'RENにも、それまでとは異なる役割が求められた。\n\n最後列まで迷わず声を届け、楽曲の感情を大きく引き上げるのではなく、行き先を決めずに声を「そこへ置く」こと。\n\nサビを支えながらも答えを示しすぎず、ブリッジでようやく「名前を呼んでみたい」という小さな願いへ触れる。\n\n感情を完成させずに支える抑制が、言えないまま残る気持ちのための余白を生んだ。'
            },
            'link': {
                'text': 'READ REN LONG INTERVIEW: 届かない夜に、声を置いていく →',
                'url': '/features/ren-moonlit-interview/'
            }
        }
        c['memberRoles'] = {
            'eyebrow': 'FIVE WAYS TO HOLD THE NIGHT',
            'heading': '誰か一人が答えを出さないために、五人で夜を支える。',
            'roles': [
                {
                    'name': 'YUTO',
                    'role': 'CLOSEST BREATH',
                    'desc': '息と揺れを残した歌い出しで、誰にも見せなかった弱さを夜のすぐ近くへ置く。'
                },
                {
                    'name': 'REN',
                    'role': 'UNFINISHED LIGHT',
                    'desc': 'サビを支えながら感情を歌唱で完成させず、届かない声が残る余白を守る。'
                },
                {
                    'name': 'SHO',
                    'role': 'UNTOUCHED DISTANCE',
                    'desc': '届く直前で止まる手と、容易には交わらない視線によって、近くにいても埋まらない距離を身体で描く。'
                },
                {
                    'name': 'LEO',
                    'role': 'GENTLE RELEASE',
                    'desc': '「Between the Lights」で五人の夜を外へ開き、「Afterimage」では掠れた声までその日の余韻として受け止める。'
                },
                {
                    'name': 'KAI',
                    'role': 'QUIET FRAME',
                    'desc': '答えを急いで言葉にせず、沈黙を見守る。「Between the Lights」ではラップで五人の歩幅を軽くする。'
                }
            ]
        }
        c['trackOverview'] = {
            'eyebrow': 'THREE NIGHTS, THREE LIGHTS',
            'heading': '一人で歩く夜。五人で遠回りする夜。終わったあとにも残る夜。',
            'items': [
                {
                    'trackNo': '01',
                    'title': 'Moonlit',
                    'subtitle': 'MOONLIGHT / THE UNSAID',
                    'desc': '月明かりの下を一人で歩き、届かない声と言えない願いを抱えたまま進む表題曲。'
                },
                {
                    'trackNo': '02',
                    'title': 'Between the Lights',
                    'subtitle': 'STREETLIGHTS / THE DETOUR',
                    'desc': 'ライブを終えた五人が、まだ帰りたくないからもう一つ先の角まで一緒に歩くカップリング曲。'
                },
                {
                    'trackNo': '03',
                    'title': 'Afterimage - Live Version -',
                    'subtitle': 'STAGE LIGHT / WHAT REMAINS',
                    'desc': '照明と歓声が消えたあとにも、身体と記憶へ残り続ける熱を、その日の会場の空気ごと収めたライブ音源。'
                }
            ]
        }
        c['trackDescriptions'] = {
            'moonlit-title': 'IGNITEが初めて本格的に夜と静寂を描いたミドルダンスナンバー。\n\nよりバラード寄りだった初期案にビートを残し、立ち止まるのではなく、答えのない夜を歩き続ける曲へ作り替えられた。YUTOの息を含んだ歌い出し、感情を完成させずに支えるRENの歌唱、届く直前で止まるSHOの動きが、近くにいながら埋められない距離を表現する。',
            'between-the-lights': 'ライブ後の夜道を、五人が目的もなく遠回りする軽やかなポップナンバー。\n\n「まだ帰りたくない」という感情を中心に、自動販売機、点滅する信号、ガラスに映る五人、街灯の間に伸びる影といった小さな出来事を重ねる。「Moonlit」で言葉にできなかったものを解決するのではなく、何も話さなくても一緒に歩ける時間によって少しだけほどいていく。',
            'afterimage-live': '当時まだスタジオ音源化されていなかった「Afterimage」を、ライブバンドの強い演奏と会場の空気ごと収めた音源。\n\n照明が落ちたあとにも消えない残像を、重いドラム、押し寄せるギター、張りつめた歌声で描く。終盤でわずかに掠れたRENの声も、その日の客席と五人の呼吸が終わった場所に残された余韻として、修正せず採用された。'
        }
        c['performance'] = {
            'heading': 'THE DISTANCE BETWEEN HANDS',
            'subtitle': '届かないことまで、身体の中へ残す。',
            'body': '「Moonlit」の振付は、五人の距離を簡単には埋めない。\n\n五人は同じ月明かりの中に立ちながら、互いの視線を容易には交わさない。誰かへ伸ばした手は、指先へ届く直前で止まる。\n\n触れ合えなかったこと、言えなかったことを、失敗として消さずに身体の中へ残す。\n\nSHOを中心に組み立てられた滑らかな動きと、青紫の照明が、熱量を大きく放出するそれまでのIGNITEとは異なる静かな緊張を作った。\n\nサビで五人の声が広がっても、全員が同じ感情の答えへ揃うことはない。\n\n同じ光の中にいることと、同じ場所へたどり着くことは違う。その距離を消さずに見せることが、「Moonlit」におけるパフォーマンスの中心である。',
            'elements': [
                '青から青紫を基調にした照明',
                '月明かりを思わせる柔らかな白い光',
                'YUTOの静かな歌い出し',
                'RENが声を強く押し出しすぎず、空間へ置く歌唱',
                'SHOを中心とした滑らかなダンス',
                '五人が同じ光の中に立ちながら、容易には目を合わせない構成',
                '誰かへ伸ばした手が、届く直前で止まる動き',
                'ダンスブレイクで孤独を激しさではなくリズムへ変える表現',
                '最後まで明確な解決や朝を示さない余韻'
            ]
        }

with open('content/public/campaigns.json', 'w', encoding='utf-8') as f:
    json.dump(campaigns, f, ensure_ascii=False, indent=2)

print('Successfully updated moonlit campaign in campaigns.json!')
