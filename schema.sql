-- MEO Harness D1 Schema: Google Business Profile AI Review Auto-Reply & Local Keyword Rank Tracker

CREATE TABLE IF NOT EXISTS gbp_reviews (
  id TEXT PRIMARY KEY,
  store_name TEXT NOT NULL,
  reviewer_name TEXT NOT NULL,
  star_rating INTEGER NOT NULL,
  comment TEXT NOT NULL,
  sentiment TEXT NOT NULL,
  target_keywords TEXT NOT NULL,
  ai_reply_draft TEXT NOT NULL,
  reply_status TEXT NOT NULL DEFAULT 'draft_ready',
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS keyword_rankings (
  id TEXT PRIMARY KEY,
  keyword TEXT NOT NULL,
  current_rank INTEGER NOT NULL,
  previous_rank INTEGER NOT NULL,
  competitor_top1 TEXT NOT NULL,
  checked_at TEXT NOT NULL
);

INSERT OR IGNORE INTO keyword_rankings (id, keyword, current_rank, previous_rank, competitor_top1, checked_at) VALUES
  ('kw_1', '渋谷 美容室 髪質改善', 2, 5, 'SALON TOKYO 渋谷本店', '2026-10-21T00:00:00.000Z'),
  ('kw_2', '表参道 ヘッドスパ 個室', 1, 3, '自社（オーガニックサロン表参道）', '2026-10-21T00:00:00.000Z'),
  ('kw_3', '恵比寿 整体 肩こり', 3, 7, '恵比寿リカバリー整体院', '2026-10-21T00:00:00.000Z');
