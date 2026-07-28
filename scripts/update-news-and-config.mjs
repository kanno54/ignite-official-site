import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const newsPath = path.resolve(__dirname, '../content/public/news.json');
const news = JSON.parse(fs.readFileSync(newsPath, 'utf8'));

const moonlitNews = [
  {
    id: 'news-2023-05-20-1',
    date: '2023.05.20',
    category: 'RELEASE',
    title: '4th Single「Moonlit」本日発売！全曲フル配信＆公式ライナーノーツ公開',
    url: '/discography/moonlit/'
  },
  {
    id: 'news-2023-05-20-2',
    date: '2023.05.20',
    category: 'MAGAZINE',
    title: '【COVER STORY】REN ロングインタビュー『届かない夜に、声を置いていく』公開',
    url: '/features/ren-moonlit-interview/'
  },
  {
    id: 'news-2023-05-22-1',
    date: '2023.05.22',
    category: 'TRACK STORY',
    title: '【TRACK STORY】「Between the Lights」楽曲ストーリー『夜を終わらせない、五人の遠回り』公開',
    url: '/features/between-the-lights-story/'
  }
];

// Add if not present
moonlitNews.forEach(item => {
  if (!news.some(n => n.id === item.id)) {
    news.unshift(item);
  }
});

// Sort newest first
news.sort((a, b) => (a.date < b.date ? 1 : -1));

fs.writeFileSync(newsPath, JSON.stringify(news, null, 2), 'utf8');
console.log('✔ Updated news.json with Moonlit news items!');
