{
  "assetId": "LV-SO-R01",
  "component": "relatedReleases",
  "campaign": "LIVE SOLAR TOUR 2023",
  "placement": "Related",
  "heading": "RELATED RELEASES",
  "description": "SOLAR TOURを形作った楽曲と、その前史となるリリースへ。",
  "items": [
    {
      "kind": "RELEASE",
      "releaseId": "solar-album",
      "releaseSlug": "solar",
      "title": "SOLAR",
      "format": "album",
      "relation": "PRIMARY_RELEASE",
      "description": "朝、昼、夕方、夜、次の朝へ。一日の光の流れをライブへ展開した、SOLAR TOURの中心作品。",
      "ctaLabel": "SOLARを見る"
    },
    {
      "kind": "RELEASE",
      "releaseId": "moonlit-single",
      "releaseSlug": "moonlit",
      "title": "Moonlit",
      "format": "single",
      "relation": "RELATED_RELEASE",
      "description": "SOLAR TOURの“夜”を象徴する楽曲。青紫の静けさと身体表現によって、IGNITEのライブに新しい距離を持ち込んだ。",
      "ctaLabel": "Moonlitを見る"
    },
    {
      "kind": "TRACK",
      "trackId": "run-with-us",
      "title": "Run With Us",
      "parentReleaseId": "solar-album",
      "parentReleaseSlug": "solar",
      "parentTrackPosition": 7,
      "relation": "TOUR_KEY_TRACK",
      "description": "ツアーを通じて客席参加型の楽曲として成長し、IGNITEとEMBERが一緒にライブを作る文化を象徴する一曲。",
      "ctaLabel": "Run With Usを見る",
      "history": {
        "previousLiveVersion": {
          "releaseId": "no-limits-single",
          "releaseSlug": "no-limits",
          "trackId": "run-with-us-live",
          "title": "Run With Us - Live Version -"
        }
      }
    },
    {
      "kind": "TRACK",
      "trackId": "hands-up-hearts-out",
      "title": "Hands Up, Hearts Out",
      "parentReleaseId": "solar-album",
      "parentReleaseSlug": "solar",
      "parentTrackPosition": 11,
      "relation": "TOUR_KEY_TRACK",
      "description": "ステージと客席の腕が同じリズムで上がる、SOLAR TOURの一体感を代表する観客参加型ナンバー。",
      "ctaLabel": "Hands Up, Hearts Outを見る",
      "history": {
        "previousLiveVersion": {
          "releaseId": "burn-it-down-single",
          "releaseSlug": "burn-it-down",
          "trackId": "hands-up-hearts-out-live",
          "title": "Hands Up, Hearts Out - Live Version -"
        }
      }
    }
  ],
  "behavior": {
    "reuseExistingReleaseRecords": true,
    "reuseExistingTrackRecords": true,
    "reuseExistingArtwork": true,
    "reuseExistingAudio": true,
    "createDuplicateRelease": false,
    "createDuplicateTrack": false,
    "createDuplicateRecording": false,
    "createDuplicateArtwork": false,
    "preferExistingDiscographyRoute": true,
    "hideUnavailableTrackDetailCTA": true
  },
  "display": {
    "layout": "responsive-card-grid",
    "desktopColumns": 4,
    "mobileColumns": 1,
    "showArtwork": true,
    "showFormat": true,
    "showDescription": true,
    "showHistoricalRelation": false
  }
}