import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export const publicationDates = {
  announcement: '2025-03-26T12:00:00+09:00',
  artwork: '2025-04-02T12:00:00+09:00',
  fiveDirections: '2025-04-18T12:00:00+09:00',
  release: '2025-04-23',
  releaseUpdate: '2025-04-23T12:00:00+09:00',
  noPlan: '2025-04-25T12:00:00+09:00',
};

// Sum actual MPEG Layer III frame samples, rather than estimating from file size.
export function mp3Duration(bytes) {
  let offset = 0, seconds = 0, frames = 0;
  if (bytes.toString('ascii',0,3)==='ID3') {
    offset = 10 + ((bytes[6]&127)<<21) + ((bytes[7]&127)<<14) + ((bytes[8]&127)<<7) + (bytes[9]&127);
    if(bytes[5]&16) offset += 10;
  }
  while(offset+4<=bytes.length) {
    const header=bytes.readUInt32BE(offset), version=(header>>>19)&3, layer=(header>>>17)&3;
    const bitrateIndex=(header>>>12)&15, rateIndex=(header>>>10)&3;
    if((header>>>21)!==2047 || version===1 || layer!==1 || bitrateIndex===0 || bitrateIndex===15 || rateIndex===3) { offset++; continue; }
    const bitrate=(version===3?[0,32,40,48,56,64,80,96,112,128,160,192,224,256,320]:[0,8,16,24,32,40,48,56,64,80,96,112,128,144,160])[bitrateIndex]*1000;
    const rate=[44100,48000,32000][rateIndex]/(version===3?1:version===2?2:4);
    const length=Math.floor((version===3?144:72)*bitrate/rate)+((header>>>9)&1);
    if(offset+length>bytes.length) break;
    seconds+=(version===3?1152:576)/rate; frames++; offset+=length;
  }
  if(frames<100 || !Number.isFinite(seconds)) throw new Error('No valid MP3 frame sequence');
  return Math.round(seconds);
}

export function applyWeBurnPublication(root, packageRoot) {
  const read = name => JSON.parse(fs.readFileSync(path.join(root,'content/public',name+'.json'),'utf8'));
  const write = (name,data) => fs.writeFileSync(path.join(root,'content/public',name+'.json'),JSON.stringify(data,null,2)+'\n');
  const delivery = JSON.parse(fs.readFileSync(path.join(packageRoot,'manifest.json'),'utf8'));
  const disc=read('discography');
  const release=disc.releases.find(r=>r.id==='we-burn');
  Object.assign(release,{fictionalReleaseDate:'2025-04',fictionalReleaseDateFull:'2025.04.23',campaignState:'current'});
  Object.assign(release.publication,{fictionalReleaseDate:publicationDates.release,publishAt:publicationDates.releaseUpdate,campaignState:'current'});
  for(const recording of disc.recordings.filter(r=>r.releaseId==='we-burn')) {
    const asset=delivery.assets.find(a=>a.asset_code===`WB25-AUD0${recording.trackNumber}`);
    const bytes=fs.readFileSync(path.join(packageRoot,asset.file_path));
    const sha256=crypto.createHash('sha256').update(bytes).digest('hex');
    if(asset.decision!=='SELECTED'||asset.production_status!=='READY'||sha256!==asset.sha256) throw new Error(`Invalid audio ${asset.asset_code}`);
    const audioUrl=`/media/audio/we-burn/${asset.delivery_filename}`;
    fs.mkdirSync(path.join(root,'public/media/audio/we-burn'),{recursive:true});
    fs.writeFileSync(path.join(root,'public',audioUrl),bytes);
    Object.assign(recording,{audioUrl,audioStatus:'ready',durationSeconds:mp3Duration(bytes),publicationState:'RELEASED',source:{campaignId:'we-burn',audioAssetCode:asset.asset_code,audioVersionId:asset.version_id,audioSha256:sha256}});
  }
  write('discography',disc);
  const articles=read('articles');
  for(const a of articles.filter(a=>a.relatedCampaignId==='we-burn')) {
    const date=a.slug==='five-directions'?publicationDates.fiveDirections:publicationDates.noPlan;
    Object.assign(a,{publishDate:'2025-04',publishDateFull:date.slice(0,10).replaceAll('-','.')});
    Object.assign(a.publication,{fictionalReleaseDate:date.slice(0,10),publishAt:date,campaignState:'current'});
    delete a.ogAssetId;
  }
  write('articles',articles);
  const campaigns=read('campaigns'),campaign=campaigns.find(c=>c.id==='we-burn');
  campaign.releaseDate='2025.04.23';delete campaign.ogAssetId;
  const approvedCopy=read('we-burn');
  const plain=value=>value.replaceAll('\r\n','\n').replace(/^#{1,3}\s+[^\n]*\n/gm,'').replaceAll('**','').trim();
  campaign.bannerCopy='FIVE DIRECTIONS. ONE FIRE.';
  campaign.introduction={heading:'7th Single『We Burn』',body:plain(approvedCopy.releaseMarkdown)};
  campaign.trackDescriptions=Object.fromEntries(disc.recordings.filter(r=>r.releaseId==='we-burn').map((r,i)=>[r.id,plain(approvedCopy.tracks[i].markdown)]));
  campaign.relatedArticleIds=['five-directions','no-plan'];
  campaign.relatedCampaignIds=['live-album-2024','equinox'];
  write('campaigns',campaigns);
  const copy=read('we-burn');
  Object.assign(copy,{publicationDates,externalLinks:[],ogImage:null});
  write('we-burn',copy);
}

if(process.argv[1] && path.resolve(process.argv[1])===import.meta.filename) {
  applyWeBurnPublication(path.resolve(import.meta.dirname,'..'),process.env.WE_BURN_DELIVERY || 'C:/Users/kanno/OneDrive/project/material_control/asset-library/deliveries/we-burn/pkg-we-burn-2026-09-26T22-42-00-254Z');
}
