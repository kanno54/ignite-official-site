import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const articlesPath = path.resolve(__dirname, '../content/public/articles.json');
const campaignsPath = path.resolve(__dirname, '../content/public/campaigns.json');

const articles = JSON.parse(fs.readFileSync(articlesPath, 'utf8'));

const newArticle = {
  id: 'ren-moonlit-interview',
  slug: 'ren-moonlit-interview',
  title: '届かない夜に、声を置いていく',
  kicker: 'MOONLIT CAMPAIGN / REN LONG INTERVIEW',
  dek: '歌は誰かへ届かせるものだと思っていた。正しく美しく歌うだけでは完成しなかった「Moonlit」のレコーディングと、静かな夜をメインボーカルのRENが振り返る。',
  publishDate: '2023-05',
  publishDateFull: '2023.05.20',
  readingTimeMinutes: 11,
  mainSpeakerIds: ['ren'],
  heroAssetId: 'article-ren-moonlit-interview',
  relatedTrackIds: ['moonlit', 'afterimage-live'],
  publication: {
    fictionalReleaseDate: '2023-05-20',
    publishAt: null,
    visibility: 'public',
    campaignState: 'staging'
  },
  blocks: [
    {
      type: 'lead',
      content: '歌は、誰かへ届かせるものだと思っていた。音に埋もれず、客席の最後列まで迷わず運ぶ。そのために声を磨いてきたRENが、4th Single「Moonlit」のレコーディングで求められたのは、正反対の歌い方だった。\n\n「遠くへ届けなくていい。ここに置いていくように歌ってほしい」\n\n正しく、美しく歌うだけでは完成しなかった一曲。YUTOの息を含んだ歌い出し、SHOの届かない手、LEOが残したかった声の掠れ、そしてKAIが見守った沈黙。五人で作った静かな夜を、メインボーカルのRENが振り返る。'
    },
    {
      type: 'paragraph',
      content: '「Moonlit」の歌い出しはYUTOが担い、RENは月明かりの中で感情が輪郭を持ち始める瞬間から声を重ねる。\n\n抑えた歌唱から始まり、五人の声が開くサビへ。終盤のブリッジでは、それまで胸の内に留めていた「名前を呼んでみたい」という願いを、RENの声が初めて夜の外へ連れ出す。\n\nIGNITEのメインボーカルとして、楽曲の感情を引き上げる役割を担ってきたREN。その声は、この曲でも中心にある。\n\nけれど本人は、「Moonlit」を“うまく歌えた曲”とは呼ばなかった。'
    },
    {
      type: 'heading',
      content: '最初は、少し地味な曲だと思っていた'
    },
    {
      type: 'question',
      content: '――初めて「Moonlit」のデモを聴いた時、どんな印象を持ちましたか。'
    },
    {
      type: 'dialogue',
      speakerId: 'ren',
      content: '静かだな、と思いました。今までのIGNITEは、曲が始まった瞬間に「ここへ行く」と方向が見えるものが多かったんです。「FIRESTARTER」なら火をつける、「BURN IT DOWN」なら壊して進む、「No Limits」なら上へ抜けていく。「Moonlit」は、どこへ行くのかが最後まで明確ではなかった。\n\nだから最初は、少し地味かもしれないと思いました。盛り上がらないという意味ではなくて、聴いた人に何を持って帰ってもらう曲なのか、すぐには分からなかったんです。'
    },
    {
      type: 'question',
      content: '――歌詞には「君のいる場所まで行けたなら」とあります。目的地はあるようにも見えます。'
    },
    {
      type: 'dialogue',
      speakerId: 'ren',
      content: 'でも、実際には行けたとは歌っていないんですよね。「届かなくても」「同じ空を見ていたい」と続く。前へ歩いてはいるけれど、会えたわけでも、気持ちを伝えられたわけでもない。\n\n僕は歌う時、どこへ声を届けるのかを決めたいタイプなんです。相手が一人なのか、客席全体なのか、自分自身なのか。それが決まると、声の向きや息の使い方も決まる。でもこの曲は、その相手が最後まで見えなかった。'
    },
    {
      type: 'question',
      content: '――見えないまま歌うことに、難しさがあった。'
    },
    {
      type: 'dialogue',
      speakerId: 'ren',
      content: 'ありました。技術的には、ものすごく難しい音域ではないです。むしろ声を出しすぎず、静かに保つ方が大事な曲です。ただ、僕は分からないものを、歌唱で分かる形に整えようとしてしまった。それが、最初のレコーディングではうまくいかなかった理由だと思います。'
    },
    {
      type: 'pullquote',
      content: '分からないものを、きれいな歌に直そうとしていた。'
    },
    {
      type: 'heading',
      content: '「全部合っている。でも、もう一度」'
    },
    {
      type: 'question',
      content: '――レコーディングでは、RENさんのパートにかなり時間がかかったそうですね。'
    },
    {
      type: 'dialogue',
      speakerId: 'ren',
      content: 'かかりました（笑）。音程もリズムも外していないのに、何度歌ってもOKが出なかった。ディレクターからは最初に、「遠くへ届けようとしなくていい」「そこに声を置いていく感じで」と言われました。\n\n意味が分からなくて、「どこに置くんですか」と聞きそうになりました（笑）。'
    },
    {
      type: 'question',
      content: '――普段は、届けることを意識して歌っている？'
    },
    {
      type: 'dialogue',
      speakerId: 'ren',
      content: 'そうですね。ステージなら最後列まで、音源ならスピーカーの向こうまで。五人の声が重なった時も、自分の役割が消えないように、言葉の輪郭を作ってきました。声は届いて初めて意味を持つ、とまでは思っていなかったですけど、近い感覚はあったと思います。\n\nだから「届かせなくていい」と言われると、急に何を基準にすればいいのか分からなくなった。声を細くしたり、サビの入りを遅らせたり、語尾を短くしたりしました。でも、直すほど曲から離れていきました。'
    },
    {
      type: 'question',
      content: '――「綺麗なんだけど」と言われたことを覚えていますか。'
    },
    {
      type: 'dialogue',
      speakerId: 'ren',
      content: '覚えています。少し腹が立ちました（笑）。「綺麗」の何がいけないんだろう、と。\n\n音程か、語尾か、息か、一つずつ確認して、全部違うと言われたんです。それなら何を直せばいいのか分からない。今思えば、その「直すところを探す」という考え方自体が、曲と合っていなかったんですよね。'
    },
    {
      type: 'question',
      content: '――その時、ブースの外にいた四人は？'
    },
    {
      type: 'dialogue',
      speakerId: 'ren',
      content: 'みんな静かでした。KAIは、僕が自分から出てくるまで待っていたと思います。LEOは水を渡してくれたけど、珍しく何も言わなかった。たぶん、あそこで励まされても僕は聞かなかったから。\n\nSHOはずっと床のスピーカーを見ていました。YUTOは次に自分の歌い出しを録ることになって、少し緊張していたと思います。'
    },
    {
      type: 'question',
      content: '――一度、RENさんの録音を止めて、YUTOさんの歌い出しを先に録った。'
    },
    {
      type: 'dialogue',
      speakerId: 'ren',
      content: 'はい。流れを変えようということになりました。'
    },
    {
      type: 'heading',
      content: 'YUTOの声で、急に夜が近くなった'
    },
    {
      type: 'question',
      content: '――YUTOさんの最初のテイクを聴いて、どう感じましたか。'
    },
    {
      type: 'dialogue',
      speakerId: 'ren',
      content: '上手ではなかったです。'
    },
    {
      type: 'question',
      content: '――はっきり言いますね。'
    },
    {
      type: 'dialogue',
      speakerId: 'ren',
      content: '本人にも言えるので（笑）。二行目の入りが少し浅かったし、語尾には息が入りすぎていました。いつもの僕なら、もう少し整えてから使うと思ったはずです。\n\nでも、その声が流れた瞬間に、スタジオの空気が変わったんです。急に夜が近くなった。歌詞の中にある、誰にも見せなかった弱さや、名前のない気持ちが、説明されないままそこにあった。'
    },
    {
      type: 'question',
      content: '――完成度よりも、曲の空気を持っていた。'
    },
    {
      type: 'dialogue',
      speakerId: 'ren',
      content: 'そうだと思います。YUTOから「もっと綺麗に歌った方がいいですか」と聞かれて、「そのままでいい」と答えました。息が入りすぎていると言われても、「そこがいいんじゃないか」と。\n\nそうしたら、「RENなら直すでしょ」と返されたんです。'
    },
    {
      type: 'question',
      content: '――自分にも同じ基準を向けられた。'
    },
    {
      type: 'dialogue',
      speakerId: 'ren',
      content: '返事ができませんでした。YUTOの声に残したいと思ったものを、自分の声からは全部消そうとしていたので。\n\nYUTOは以前から、僕のように歌いたいと言うことがありました。でも、あの日は逆に僕が、YUTOの声から教えられた。未完成だから伝わる、という単純な話ではないです。直せる場所を直さないことと、その瞬間にしか出なかったものを消さないことは、違う。その区別を、僕はまだ分かっていなかったんだと思います。'
    },
    {
      type: 'question',
      content: '――YUTOさんは、RENさんの次のテイクを「消さないで」と言ったそうですね。'
    },
    {
      type: 'dialogue',
      speakerId: 'ren',
      content: 'ガラス越しに、口の動きだけで（笑）。あれは覚えています。\n\n普段は僕がYUTOへ「そこは残した方がいい」と言う側です。でもあの日は、逆でした。自分では掠れたし、息も入ったと思っていた。もう一度録れば、もっと整えられるとも思った。でもYUTOが首を振って、ディレクターも「今のを残そう」と言った。\n\n自分が欠点だと思ったものを、ほかの人が曲に必要だと判断した。歌を一人で完成させようとしなくていいんだと、初めて少し分かった気がします。'
    },
    {
      type: 'pullquote',
      content: '自分の声に残すことだけは、僕一人では決められなかった。'
    },
    {
      type: 'heading',
      content: 'SHOが伸ばした、届かない手'
    },
    {
      type: 'question',
      content: '――歌唱の答えを探している途中、隣のスタジオでSHOさんの振付を見たそうですね。'
    },
    {
      type: 'dialogue',
      speakerId: 'ren',
      content: '音を流さず、一人で同じ動きを繰り返していました。誰かへ手を伸ばすけれど、指先まで伸ばしきる前に止める。僕には「届かない手」に見えました。\n\nだから、「届かないなら、何のために伸ばすの」と聞いたんです。'
    },
    {
      type: 'question',
      content: '――SHOさんは何と？'
    },
    {
      type: 'dialogue',
      speakerId: 'ren',
      content: '「届かなかったことが残る」と。本人は振付の話だと言っていましたけど。\n\nその時は、よく分かりませんでした。「届かなくていい曲を歌う意味があるのか」とまで聞いたと思います。SHOには、「分からないまま歌えば」と言われました。'
    },
    {
      type: 'question',
      content: '――かなり突き放した答えにも聞こえます。'
    },
    {
      type: 'dialogue',
      speakerId: 'ren',
      content: 'SHOは、分かったふりをする方が嫌なんだと思います。振付でも、感情の意味を全部説明してから身体を動かす人ではないので。\n\n「そこに誰もいないと分かっていても、手は出る。その一回が残ればいい」と言われて、少しだけ曲の見え方が変わりました。届かなかったら無意味なのではなく、届かなかったことまで含めて、その人がそこにいた証拠になる。\n\n歌も同じなのかもしれない、と。'
    },
    {
      type: 'question',
      content: '――「Moonlit」のパフォーマンスでは、SHOさんの手が伸びきらない動きが印象的です。'
    },
    {
      type: 'dialogue',
      speakerId: 'ren',
      content: '五人とも誰かを求めているけれど、簡単には触れ合わない。視線もあまり交わさない。IGNITEは普段、五人の関係が見える振付が多いので、珍しいですよね。\n\nでも、離れているから一人というわけではない。同じ月明かりの中に五人がいる。その距離を埋めずに見せることが、この曲では大事だったと思います。'
    },
    {
      type: 'heading',
      content: '「Afterimage」に残った、直せない声'
    },
    {
      type: 'question',
      content: '――4th Singleには、「Afterimage - Live Version -」も収録されます。このライブ音源にも、今回のテーマと通じる出来事があったそうですね。'
    },
    {
      type: 'dialogue',
      speakerId: 'ren',
      content: '最後のフレーズで、少し声が掠れています。\n\n収録を前提にしたライブではなかったので、その場では歌い切ることだけを考えていました。でも後から音源になるかもしれないと聞いて、気になっていたんです。スタジオなら録り直せるけれど、ライブは戻れないので。'
    },
    {
      type: 'question',
      content: '――終演後、誰もいない客席へ戻った。'
    },
    {
      type: 'dialogue',
      speakerId: 'ren',
      content: 'はい。さっきまで人がいた場所が暗くなって、拍手も歓声もない。自分の声がどこまで届いたのか、急に確かめられなくなりました。\n\nそこへLEOが来て、水を一本くれました。掠れたことに気づいていたので謝ったら、「残るといいね」と言われたんです。'
    },
    {
      type: 'question',
      content: '――失敗した部分が？'
    },
    {
      type: 'dialogue',
      speakerId: 'ren',
      content: '僕も同じことを聞きました（笑）。LEOは、「あの瞬間にしか出ないから」「曲が終わった感じがした」と言っていました。\n\n「Afterimage」は、終わった後に残るものを歌う曲です。だったら、最後に声が少し崩れたことも、その日の余韻かもしれない。そう考えられるようになったのは、「Moonlit」のレコーディングと近い時期に、二つの出来事が重なったからだと思います。'
    },
    {
      type: 'question',
      content: '――結果として、その掠れは音源に残った。'
    },
    {
      type: 'dialogue',
      speakerId: 'ren',
      content: '残っています。今も聴くと気になりますけど（笑）。\n\nただ、もう直したいとは思いません。あの日の客席、照明、五人の呼吸が終わった場所に、声だけ置いてきたような感じがするので。きれいに差し替えたら、別の歌になってしまうと思います。'
    },
    {
      type: 'heading',
      content: '作り物の月が、夜を照らしていた'
    },
    {
      type: 'question',
      content: '――ミュージックビデオの撮影では、五人が誰とも目を合わせず、客席の少し上を見る最後のカットがあります。'
    },
    {
      type: 'dialogue',
      speakerId: 'ren',
      content: '実際には客席はなくて、カメラとスタッフがいるだけです。撮影用の月も、天井からワイヤーで吊られていました。近くで見ると継ぎ目があるし、裏側には機材も見える。\n\nでも、カメラの中では本当に夜を照らしているように見えました。'
    },
    {
      type: 'question',
      content: '――作り物だから、偽物というわけではない。'
    },
    {
      type: 'dialogue',
      speakerId: 'ren',
      content: 'ステージも同じですよね。照明で月を作り、霧を出して、何もない場所に夜を作る。僕たちも衣装を着て、決められた位置に立つ。手で生まれた気持ちまで偽物になるわけではない。\n\n最後のカットが終わった後、YUTOに「終わったよ」と呼ばれたんですけど、少しだけ上を見たままでいました。撮影用の月を見ながら、この曲は「届いた」と確認するところまで歌わなくていいのかもしれない、と思っていました。'
    },
    {
      type: 'question',
      content: '――声を置いていく、という最初のディレクションが、そこで理解できた？'
    },
    {
      type: 'dialogue',
      speakerId: 'ren',
      content: '完全に分かったとは言いたくないです。でも、歌った時点で、自分の中にはもう残っている。誰かがその夜に同じ気持ちになった時、あとから見つけてもらえるかもしれない。\n\n月明かりも、誰か一人に向かって照らしているわけではないですよね。見上げた人が、それぞれの場所で見つけるものだから。'
    },
    {
      type: 'heading',
      content: 'メインボーカルが、声を引かせた曲'
    },
    {
      type: 'question',
      content: '――「Moonlit」は、RENさんの歌唱が強く印象に残る曲です。一方で、制作では“歌い上げないこと”が重要だった。'
    },
    {
      type: 'dialogue',
      speakerId: 'ren',
      content: 'メインボーカルだから、曲の一番前に立たなければいけないと思っていました。声を大きくするという意味ではなく、感情の答えを自分が示すべきだと。\n\nでも「Moonlit」には、答えがない。誰にも言えないままでも、届かないままでも、消えないものがあると歌っている。そこで僕だけが分かりやすく感情を完成させたら、この曲の夜を終わらせてしまう。\n\nだから、声を引かせる必要がありました。YUTOの歌い出しにある揺れを残して、SHOの手が届かない場所を空けて、五人の声が重なった時も、誰か一人の答えにしない。\n\nそれでも曲が弱くならないように支える。それが、この曲での僕の役割だったと思います。'
    },
    {
      type: 'question',
      content: '――以前と比べて、歌に対する考え方は変わりましたか。'
    },
    {
      type: 'dialogue',
      speakerId: 'ren',
      content: '「届かせる」ことは、今も大切です。ライブでは、最後列まで届けたいと思っています。\n\nただ、届いたかどうかを自分で確かめられない歌もある。反応がなくても、数字にならなくても、誰かの夜に残ることがある。それなら、無理に答えへ変えず、その時の声を置いて帰ってもいい。\n\n前より少しだけ、歌った後の沈黙を怖がらなくなりました。'
    },
    {
      type: 'question',
      content: '――最後に、これから「Moonlit」を聴く人へ、この曲をどんなふうに受け取ってほしいですか。'
    },
    {
      type: 'dialogue',
      speakerId: 'ren',
      content: '受け取り方を決めなくていいと思います。\n\n会いたい人を思い浮かべてもいいし、自分でも名前をつけられない気持ちのまま聴いてもいい。何も解決しなくても、一曲が終わるまで同じ夜にいられたら、それで十分です。\n\n僕たちは、そこに声を置いておきます。\n\nいつか必要になった時に、見つけてもらえるように。'
    },
    {
      type: 'pullquote',
      content: '届いたか分からない声も、消えたことにはならない。'
    }
  ]
};

// Check if existing
const existingIdx = articles.findIndex(a => a.id === 'ren-moonlit-interview');
if (existingIdx >= 0) {
  articles[existingIdx] = newArticle;
} else {
  articles.unshift(newArticle);
}

fs.writeFileSync(articlesPath, JSON.stringify(articles, null, 2), 'utf8');
console.log('✔ REN Moonlit Interview added to articles.json!');

// Update campaigns.json
const campaigns = JSON.parse(fs.readFileSync(campaignsPath, 'utf8'));
const moonlitCamp = campaigns.find(c => c.id === 'moonlit');
if (moonlitCamp) {
  if (!moonlitCamp.relatedArticleIds) moonlitCamp.relatedArticleIds = [];
  if (!moonlitCamp.relatedArticleIds.includes('ren-moonlit-interview')) {
    moonlitCamp.relatedArticleIds.push('ren-moonlit-interview');
  }
  fs.writeFileSync(campaignsPath, JSON.stringify(campaigns, null, 2), 'utf8');
  console.log('✔ Updated campaigns.json with ren-moonlit-interview!');
}
