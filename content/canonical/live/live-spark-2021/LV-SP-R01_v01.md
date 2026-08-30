asset_id: LV-SP-R01
asset_name: Related releases module
campaign: LIVE SPARK 2021
asset_type: OTHER
content_type: component_configuration

component:
  type: RELATED_RELEASES
  placement: Related
  source_of_truth: Discography
  duplication_policy: REFERENCE_ONLY

heading:
  label: RELATED RELEASES
  display: true

items:
  - canonical_title: IGNITION
    entity_type: RELEASE
    relation: ERA_CONTEXT
    resolve_from: Discography
    canonical_id: RESOLVE_AT_BUILD
    artwork: USE_CANONICAL_RELEASE_ASSET
    destination: USE_CANONICAL_RELEASE_ROUTE
    note: "SPARKへ至るメジャーデビュー初期の主要リリースとして接続"

  - canonical_title: BURN IT DOWN
    entity_type: RELEASE
    relation: PERFORMANCE_CONTEXT
    resolve_from: Discography
    canonical_id: RESOLVE_AT_BUILD
    artwork: USE_CANONICAL_RELEASE_ASSET
    destination: USE_CANONICAL_RELEASE_ROUTE
    note: "SPARK公演内パフォーマンスとの連続性を示す主要リリースとして接続"

additional_items:
  strategy: CANONICAL_ONLY
  behavior: >
    LIVE SPARK 2021との関連がDiscographyまたは確定済みRecordingデータで
    明示されているリリースのみ追加可能。
  unresolved_items: DO_NOT_RENDER
  max_items: 4

rendering:
  layout:
    desktop: horizontal_cards
    mobile: stacked_cards
  show_artwork: true
  show_release_title: true
  show_release_type: true
  show_release_date: USE_CANONICAL_VALUE_IF_AVAILABLE
  show_description: false
  card_click_target: CANONICAL_RELEASE_ROUTE

data_rules:
  - "リリース情報をLIVE ARCHIVE側へ複製しない"
  - "タイトル・アートワーク・公開情報はDiscography正本を参照する"
  - "Recording単位の関連付けが必要な場合も既存Recording IDを参照する"
  - "LIVE SPARK専用の疑似Release / Recordingを生成しない"
  - "未確定セットリストから関連リリースを推測しない"
  - "廃止・置換済みデータを固定値として保持しない"

fallback:
  if_discography_reference_missing: HIDE_ITEM
  if_all_items_missing: HIDE_MODULE

editorial_role:
  purpose: >
    SPARKを単独の過去公演として閉じず、
    同時期のIGNITE Discographyへ戻れる導線を提供する。
  primary_connections:
    - IGNITION
    - BURN IT DOWN

status:
  configuration: READY
  canonical_reference_resolution: BUILD_TIME