import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const articlesPath = path.resolve(__dirname, '../content/public/articles.json');
const manifestPath = path.resolve(__dirname, '../content/public/asset-manifest.json');
const campaignsPath = path.resolve(__dirname, '../content/public/campaigns.json');

const articles = JSON.parse(fs.readFileSync(articlesPath, 'utf8'));

const newArticle = {
  id: 'between-the-lights-story',
  slug: 'between-the-lights-story',
  title: '夜を終わらせない、五人の遠回り',
  kicker: 'BETWEEN THE LIGHTS — TRACK STORY',
  dek: 'ステージを降りた五人が、夜を終わらせないために選んだ遠回り。4th Single「Moonlit」カップリング曲「Between the Lights」の世界観を紐解くトラックストーリー。',
  publishDate: '2023-05',
  publishDateFull: '2023.05.22',
  readingTimeMinutes: 7,
  mainSpeakerIds: ['kai', 'sho', 'leo', 'ren', 'yuto'],
  heroAssetId: 'article-between-the-lights-story',
  relatedTrackIds: ['between-the-lights', 'moonlit'],
  publication: {
    fictionalReleaseDate: '2023-05-22',
    publishAt: null,
    visibility: 'public',
    campaignState: 'staging'
  },
  blocks: [
    {
      type: 'lead',
      content: 'ライブが終わった。照明は落ち、歓声は扉の向こうへ遠ざかっていく。それでも、五人の夜はまだ終わらない。\n\n4th Single「Moonlit」のカップリングに収録された「Between the Lights」は、終演後の帰り道を描く軽やかなポップナンバーだ。街灯、ネオン、自動販売機、点滅する信号。歌詞に並ぶのは、どこにでもある夜の風景ばかり。大きな事件も、新しい決意もない。\n\nあるのは、真っ直ぐ帰るには少しだけ惜しい夜と、「まだ帰りたくない」という気持ちだけだ。\n\n「Moonlit」が、誰にも言えない感情を胸に抱えて歩く夜なら、「Between the Lights」は、そんな夜を五人で少しだけ長引かせる歌。同じ街を舞台にしながら、二曲は月明かりと街灯のように、異なる距離から五人を照らしている。'
    },
    {
      type: 'heading',
      content: 'ステージを降りた、その先から'
    },
    {
      type: 'paragraph',
      content: '曲は、LEOの声から始まる。\n\n「袖を抜けた風が / まだ熱をさらっていかない」\n\nここでいう「袖」は、服の袖にも、ステージ袖にも聞こえる。たった二行で、ライブを終えたばかりの身体と、会場の外へ踏み出した瞬間が重なっていく。\n\n裏口のドアを開けると、急に街が近くなる。さっきまで彼らは照明の中心に立つIGNITEだった。けれど、外へ出れば、誰かが先に走り、自動販売機の同じボタンへ手を伸ばし、「それ俺の」と笑い合う五人の青年に戻る。\n\nこの曲が切り取るのは、華やかなステージの裏側というより、ステージと日常の境目だ。\n\n衣装や汗にはまだライブの熱が残っている。しかし、彼らを照らすのはもうスポットライトではない。等間隔に並ぶ街灯や、店先のネオン、信号機の青。その光をひとつ通り過ぎるたび、五人は少しずつアイドルの時間から離れていく。\n\nそれでも、すぐに帰ろうとはしない。\n\n大切なのは目的地ではなく、次の角まで一緒に歩けることだからだ。'
    },
    {
      type: 'heading',
      content: '「まだ帰りたくない」は、引き止める言葉ではない'
    },
    {
      type: 'paragraph',
      content: 'サビで繰り返される「まだ帰りたくない」は、誰か一人へ向けた願いではない。\n\n今日のライブが成功したから祝いたい、失敗したから慰め合いたい、という明確な理由も語られない。ただ、今ここにある空気を終わらせたくない。くだらない話をしながら、もう少しだけ同じ夜にいたい。それは、名前をつけた瞬間に少し違うものになってしまうような感情だ。\n\nだからこの曲では、「言えなかったこと」を無理に打ち明ける必要もない。\n\n「言えなかったことなんて / 今はなくてもいい」\n\n「Moonlit」には、いつか呼んでみたい名前がある。声が届かなくても、同じ空を見たいという願いがある。対して「Between the Lights」は、沈黙を答えへ変えようとしない。一緒に歩き、肩が触れ、誰かが変な顔をして笑わせる。それだけで、固くなっていたものが少しずつほどけていく。\n\n五人は、互いのすべてを言葉にできるから一緒にいるのではない。\n\n何も話さなくても、一緒に遠回りできる。その気安さが、この曲では信頼の形として描かれている。'
    },
    {
      type: 'heading',
      content: '五人の個性が、夜道のリズムになる'
    },
    {
      type: 'paragraph',
      content: '「Between the Lights」は全員曲だが、五人が同じ性格の主人公を演じているわけではない。歌割りを追うと、帰り道での立ち位置がそれぞれ違って見えてくる。\n\n最初にドアを開け、街へ飛び出す場面を担うのはLEO。五人の空気を外へ開き、何でもない出来事を楽しさへ変える。曲の最後に「じゃあ、次の角まで」と夜を延長する声もLEOだ。終わりを拒むのではなく、小さな約束へ言い換える明るさがよく似合う。\n\nYUTOは、点滅する信号を前に「急がなくてもいいのに」と立ち止まる。それでも青に変わった瞬間、みんなと一緒に走り出す。ブリッジでは、帰る場所があるからこそ寄り道が愛しくなると歌う。最年少らしい無邪気さだけでなく、この時間が永遠ではないことを誰より早く感じ取っているようにも聞こえる。\n\nRENが見るのは、ガラス越しに映った五人の姿だ。少しだけ大人びて見えた次の瞬間、目が合えば変な顔で笑わされる。「Moonlit」で感情の輪郭を声にしたRENが、ここでは五人を少し離れた場所から見つめ、その可笑しさまで静かに受け取っている。\n\nSHOは、誰かが落としたリズムを足先で拾う。揃えるためのダンスではなく、「好きに踊ればいい」と身体を解放するダンスだ。ステージでは精密さを求めるSHOが、街灯の影を飛び越えながら、ばらばらの靴音をそのまま一曲のグルーヴへ変えていく。\n\nそしてKAIは、真っ直ぐ帰るだけではもったいないと、もう一つ先の角を指す。ラップパートは誰かを強く引っ張る号令ではなく、五人の歩幅を軽くする誘いかけだ。「誰が先とか関係ない」と歌う言葉には、先頭に立つことだけがリーダーの役目ではないという、KAIらしい距離感もにじむ。\n\n五人の声はサビで重なる。しかし、そこへ至るまでの歩き方は違う。その違いが残っているからこそ、「まだ帰りたくない」という同じ言葉が、五人全員の実感として響く。'
    },
    {
      type: 'heading',
      content: 'ポップロックの中にある、少しだけ大人の夜'
    },
    {
      type: 'paragraph',
      content: 'サウンドの土台は、軽快なポップロック。前へ進むドラムとギターが、夜道を歩く五人の足取りを作っていく。\n\nそこへ、跳ねるベース、短く切られたギター、ジャズやファンクを思わせるコードとリズムの揺れが加わる。一直線に駆け抜けるのではなく、立ち止まったり、誰かを待ったり、急に走り出したりする。その小さな速度差が、心地よいグルーヴになっている。\n\n「La la la」と靴音を鳴らすポストコーラス、KAIのラップ、SHOのダンスブレイクへと場面が移っても、曲は大げさなクライマックスを目指さない。賑やかさは増していくが、最後まで五人の手の届く範囲に収まっている。\n\nそれは、街全体を巻き込む祝祭ではない。\n\nライブを終えた五人だけが共有している、小さなアフターパーティーだ。\n\nジャズやファンクのエッセンスは、若さを背伸びして大人っぽく見せるためのものでもない。ネオンに映る自分たちが一瞬だけ大人に見え、それをすぐ互いに笑い飛ばす。その少し洒落た響きと無邪気さの同居が、この曲の夜を作っている。'
    },
    {
      type: 'heading',
      content: '街灯と街灯の、あいだにあるもの'
    },
    {
      type: 'paragraph',
      content: 'タイトルの「Between the Lights」という言葉は、歌詞の中には登場しない。\n\nその代わり、街灯やネオン、信号、ガラスに映る光が、夜のあちこちに置かれている。光の下では互いの顔が見える。次の街灯へ向かう途中には、ほんの短い暗がりがある。\n\n五人は、その明るさと暗さを何度も行き来する。\n\nスポットライトの下にいる時だけがIGNITEなのではない。誰にも見られていない道でふざけ、歩幅を崩し、目的もなく曲がった角の先にも、五人の時間は続いている。\n\nむしろ、名前のつかない思い出は、光そのものではなく、その「あいだ」に生まれるのかもしれない。\n\n写真には残らない会話。どこを歩いたかも曖昧な遠回り。自動販売機の前で重なった手。青信号で、なぜか全員が走り出した瞬間。どれも特別な出来事ではない。だからこそ、あとになって不意に思い出す。\n\n曲の終盤、五人の影はひとつに重なり、ようやく明日へ歩き出す。\n\n夜を終わらせないことと、朝を拒むことは違う。「もう少しだけ」を一緒に過ごせたから、五人はそれぞれの明日へ帰っていける。\n\nそして最後に聞こえるのは、LEOの何気ない一言だ。\n\n「じゃあ、次の角まで」\n\nきっと、その角に着いても、誰かがもう一度言う。\n\nもう一つだけ、曲がろうぜ――と。'
    }
  ]
};

// Insert
const existingIdx = articles.findIndex(a => a.id === 'between-the-lights-story');
if (existingIdx >= 0) {
  articles[existingIdx] = newArticle;
} else {
  articles.splice(1, 0, newArticle);
}

fs.writeFileSync(articlesPath, JSON.stringify(articles, null, 2), 'utf8');
console.log('✔ Between the Lights Track Story added to articles.json!');

// Register in asset-manifest.json
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
manifest.images['article-between-the-lights-story'] = {
  path: '/assets/images/articles/hero-between-the-lights-story.jpg',
  status: 'ready',
  aspect: '16:9'
};
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
console.log('✔ Registered article-between-the-lights-story in asset-manifest.json!');

// Register in campaigns.json
const campaigns = JSON.parse(fs.readFileSync(campaignsPath, 'utf8'));
const moonlitCamp = campaigns.find(c => c.id === 'moonlit');
if (moonlitCamp) {
  if (!moonlitCamp.relatedArticleIds) moonlitCamp.relatedArticleIds = [];
  if (!moonlitCamp.relatedArticleIds.includes('between-the-lights-story')) {
    moonlitCamp.relatedArticleIds.push('between-the-lights-story');
  }
  fs.writeFileSync(campaignsPath, JSON.stringify(campaigns, null, 2), 'utf8');
  console.log('✔ Updated campaigns.json with between-the-lights-story!');
}
