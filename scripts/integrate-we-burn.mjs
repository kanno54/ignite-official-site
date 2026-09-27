import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';
import { applyWeBurnPublication } from './we-burn-publication.mjs';

const root = path.resolve(import.meta.dirname, '..');
const packageRoot = process.env.WE_BURN_DELIVERY || 'C:/Users/kanno/OneDrive/project/material_control/asset-library/deliveries/we-burn/pkg-we-burn-2026-09-26T22-42-00-254Z';
const read = p => fs.readFileSync(p, 'utf8').replace(/^\uFEFF/, '');
const json = p => JSON.parse(read(p));
const write = (p, data) => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n'); };
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const delivery = json(path.join(packageRoot, 'manifest.json'));
if (delivery.campaign_id !== 'we-burn') throw new Error('Wrong delivery campaign');
for (const a of delivery.assets) {
  if (a.decision !== 'SELECTED' || a.production_status !== 'READY' || hash(path.join(packageRoot, a.file_path)) !== a.sha256) throw new Error(`Invalid delivery: ${a.asset_code}`);
}
const source = code => delivery.assets.find(a => a.asset_code === code);
const correctedFivePath = process.env.WE_BURN_FIVE_DIRECTIONS || 'C:/Users/kanno/OneDrive/project/material_control/asset-library/assets/we-burn/WB25-TXT-FEAT01/source/v01.md';
const correctedFive = read(correctedFivePath);
const memberOrder = [...correctedFive.matchAll(/^## \d{2}｜(KAI|SHO|LEO|REN|YUTO) /gm)].map(m=>m[1]);
if (memberOrder.join(',') !== 'KAI,SHO,LEO,REN,YUTO' || !correctedFive.startsWith('# FIVE DIRECTIONS') || (correctedFive.match(/――それぞれが新しいことを始めたら、IGNITEはどうなると思う？/g)||[]).length !== 5) throw new Error('FIVE DIRECTIONS v1 identity check failed');
const copy = code => code === 'WB25-TXT-FEAT01' ? correctedFive : read(path.join(packageRoot, source(code).file_path));
const canonical = path.join(root, 'content/canonical/we-burn');
fs.mkdirSync(canonical, { recursive: true });
write(path.join(canonical, 'manifest.json'), delivery);
for (const a of delivery.assets.filter(a => a.category === 'CONTENT')) fs.copyFileSync(path.join(packageRoot, a.file_path), path.join(canonical, a.delivery_filename));
fs.copyFileSync(correctedFivePath,path.join(canonical,'WB25-TXT-FEAT01_v01.md'));
write(path.join(canonical,'editorial-correction.json'),{assetCode:'WB25-TXT-FEAT01',usedVersion:1,sha256:hash(correctedFivePath),invalidVersion:2,reason:'User explicitly approved correct v1; selected v2 contains a NO PLAN group interview. Verified title, KAI/SHO/LEO/REN/YUTO sections, and five identical closing questions. Asset Studio unchanged.'});
const content = name => path.join(root, 'content/public', name + '.json');
const manifest = json(content('asset-manifest'));
const derivatives = json(content('image-derivatives'));
const visualCodes = ['WB25-WEB01','WB25-WEB02','WB25-JK01','WB25-WB01','WB25-WB02','WB25-NP01','WB25-NP02','WB25-BS01','WB25-BS02','WB25-FE01-HR01','WB25-FE02-HR01','WB25-FE02-PH01','WB25-FE02-IN01','WB25-FE02-IN02','WB25-FE01-SNS01','WB25-FE02-SNS01',...Array.from({length:5},(_,i)=>`WB25-M0${i+1}`)];
for (const code of visualCodes) {
  const a = source(code), id = code.toLowerCase();
  const src = path.join(packageRoot, a.file_path);
  const meta = await sharp(src).metadata();
  const url = `/assets/images/we-burn/${code}_v${String(a.version_no).padStart(2,'0')}.webp`;
  fs.mkdirSync(path.join(root, 'public/assets/images/we-burn'), {recursive:true});
  await sharp(src).webp({quality:88}).toFile(path.join(root,'public',url));
  const aspect = code === 'WB25-WEB02' ? '9:16' : /M0[1-5]$|PH01$|SNS01$/.test(code) ? '4:5' : /JK01$|(?:WB|NP|BS)01$/.test(code) ? '1:1' : /(?:WB|NP|BS)02$/.test(code) ? '3:4' : '16:9';
  manifest.images[id] = {path:url,status:'ready',aspect,assetCode:code,selectedVersion:a.version_no,selectedVersionId:a.version_id,sourceSha256:a.sha256,sourcePackage:delivery.package_id};
  const profile = `weBurn${Math.min(meta.width,1600)}`;
  derivatives.profiles[profile] = {format:'webp',quality:80,widths:[384,640,960,1280,1600].filter(w=>w<=meta.width)};
  derivatives.assets[id] = profile;
}
// Preserve the complete approved hero: pad to the social ratio, never crop faces.
for (const feature of ['FE01','FE02']) {
  for (const [suffix,width,height] of [['og-review',1200,630],['card',1080,1080]]) {
    const code = `WB25-${feature}-HR01`, id = `wb25-${feature.toLowerCase()}-${suffix}`;
    const url = `/assets/images/we-burn/${id}.jpg`;
    await sharp(path.join(packageRoot,source(code).file_path)).resize(width,height,{fit:'contain',background:'#151515'}).jpeg({quality:88}).toFile(path.join(root,'public',url));
    manifest.images[id] = {path:url,status:'ready',aspect:width===height?'1:1':'1200:630',assetCode:code,derivedFrom:code,editorialReview:'pending',sourcePackage:delivery.package_id};
  }
}
write(content('asset-manifest'),manifest);write(content('image-derivatives'),derivatives);
const publication = {fictionalReleaseDate:'',publishAt:null,visibility:'public',campaignState:'current'};
const disc = json(content('discography'));
const trackIds = ['we-burn-single','we-burn-no-plan','we-burn-back-to-the-spark-live'];
const titles = ['We Burn','NO PLAN','Back to the Spark - Live Version -'];
const upsert = (array,item) => {const i=array.findIndex(x=>x.id===item.id);if(i<0)array.push(item);else array[i]=item;};
upsert(disc.releases,{id:'we-burn',slug:'we-burn',title:'We Burn',format:'7th Single',fictionalReleaseDate:'',fictionalReleaseDateFull:'',coverAssetId:'wb25-jk01',description:copy('WB25-TXT-DISC01').split(/\r?\n/).filter(Boolean)[1],linerNotes:copy('WB25-TXT-LINER01'),trackIds,campaignState:'future',publication,canonicalMarkdown:copy('WB25-TXT-DISC01')});
trackIds.forEach((id,i)=>upsert(disc.recordings,{id,releaseId:'we-burn',title:titles[i],versionLabel:i===2?'Live Version':'Original',trackNumber:i+1,durationSeconds:0,audioUrl:'',audioStatus:'pending',spotlightMemberIds:[],moodTags:[],linerNotes:copy(`WB25-TXT-LINER0${i+2}`),lyrics:[],posterAssetId:['wb25-wb01','wb25-np01','wb25-bs01'][i]}));
write(content('discography'),disc);
const articles = json(content('articles'));
const addArticle = (code,slug,layout) => {
  const markdown=copy(code);const lines=markdown.replace(/\r\n/g,'\n').split('\n').filter(Boolean);
  const n=layout==='individual'?'01':'02';
  upsert(articles,{id:slug,slug,title:lines[0].replace(/^#\s+/,''),kicker:layout==='individual'?'FIVE DIRECTIONS':'NO PLAN',dek:lines.find(l=>l.startsWith(layout==='individual'?'今回は座談会':'未来へ踏み出す')) || lines[3],publishDate:'',publishDateFull:'',readingTimeMinutes:Math.ceil(markdown.length/600),mainSpeakerIds:['kai','sho','leo','ren','yuto'],heroAssetId:`wb25-fe${n}-hr01`,ogAssetId:`wb25-fe${n}-og-review`,cardAssetId:`wb25-fe${n}-card`,relatedTrackIds:[],relatedCampaignId:'we-burn',blocks:[{type:'paragraph',content:lines[3]}],canonicalMarkdown:markdown,sourceAssetCode:code,sourceVersion:layout==='individual'?1:source(code).version_no,featureLayout:layout,publication});
};
addArticle('WB25-TXT-FEAT02','no-plan','conversation');
const correctFive = /^#?\s*FIVE DIRECTIONS/.test(copy('WB25-TXT-FEAT01'));
if(correctFive) addArticle('WB25-TXT-FEAT01','five-directions','individual');
write(content('articles'),articles);
const campaigns=json(content('campaigns'));
upsert(campaigns,{id:'we-burn',slug:'we-burn',status:'current',releaseId:'we-burn',releaseDate:'',eyebrow:'IGNITE 7th Single',title:'We Burn',catchCopy:'燃える先は、ひとつじゃない。',desktopHero:manifest.images['wb25-web01'].path,mobileHero:manifest.images['wb25-web02'].path,heroAssetId:'wb25-web01',mobileHeroAssetId:'wb25-web02',ogAssetId:'wb25-jk01',primaryCta:{text:'VIEW RELEASE',action:'link',url:'/discography/we-burn/'},secondaryCta:{text:'READ NO PLAN',action:'link',url:'/features/no-plan/'},campaignColors:{accent:'#DFA16B',deep:'#171515',text:'#F3EADC'},relatedArticleIds:correctFive?['five-directions','no-plan']:['no-plan']});
write(content('campaigns'),campaigns);
write(content('we-burn'),{packageId:delivery.package_id,releaseMarkdown:copy('WB25-TXT-DISC01'),closingMarkdown:copy('WB25-TXT-WEB06'),seoDescription:copy('WB25-TXT-EXT09').trim(),ogDescription:copy('WB25-TXT-EXT08').trim(),tracks:titles.map((title,i)=>({title,direction:['FUTURE','NOW','ORIGIN'][i],markdown:copy(`WB25-TXT-WEB0${i+3}`),coverAssetId:['wb25-wb01','wb25-np01','wb25-bs01'][i],detailAssetId:['wb25-wb02','wb25-np02','wb25-bs02'][i]}))});
write(path.join(root,'reports/we-burn/asset-map.json'),[...delivery.assets.map(a=>({...a,sitePath:a.category==='AUDIO'?`/media/audio/we-burn/${a.delivery_filename}`:manifest.images[a.asset_code.toLowerCase()]?.path || null,disposition:a.asset_code==='WB25-TXT-FEAT01'?'INVALID v2: contains NO PLAN; replaced by explicitly user-approved v1':a.category==='AUDIO'?'used in staging player; approved bytes verified':manifest.images[a.asset_code.toLowerCase()]?'available in staging; see report for actual placements':a.category==='CONTENT'?'canonical source retained; only explicitly mapped copy rendered':'not used'})),{asset_code:'WB25-TXT-FEAT01',version_no:1,decision:'USER_APPROVED_OVERRIDE',file_path:'content/canonical/we-burn/WB25-TXT-FEAT01_v01.md',sha256:hash(correctedFivePath),sitePath:'/features/five-directions/',disposition:'used in staging; title, member order and closing questions verified'}]);
applyWeBurnPublication(root, packageRoot);
console.log('Verified delivery hashes and applied confirmed fictional dates, audio, and OGP policy to staging.');
