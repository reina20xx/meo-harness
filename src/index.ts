import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { handleMcpRequest } from './agent/mcp';

export type Bindings = {
  DB: D1Database;
  STATIC_HTML?: string;
};

const app = new Hono<{ Bindings: Bindings }>();
app.use('*', cors());

export function generateMeoReply(input: {
  store_name: string;
  reviewer_name: string;
  star_rating: number;
  comment: string;
  target_keywords?: string;
}) {
  const stars = Number(input.star_rating || 5);
  const kws = input.target_keywords || '渋谷 髪質改善 トリートメント';
  const sentiment = stars >= 4 ? 'positive' : stars === 3 ? 'neutral' : 'negative_care';

  let ai_reply_draft = '';
  if (stars >= 4) {
    ai_reply_draft = `${input.reviewer_name}様、この度は「${input.store_name}」へご来店いただき、また嬉しい口コミをご投稿いただき誠にありがとうございます！\n「${input.comment.slice(0, 35)}」とのお言葉、スタッフ一同大変励みになります。当店では${kws}にこだわり、お客様一人ひとりに合わせた丁寧な施術を心がけております。次回も${input.reviewer_name}様にお会いできることを楽しみにお待ちしております！`;
  } else {
    ai_reply_draft = `${input.reviewer_name}様、この度は「${input.store_name}」へご来店いただいたにもかかわらず、ご期待に添えない点があり誠に申し訳ございませんでした。\nいただいた「${input.comment.slice(0, 35)}」という貴重なご意見を真摯に受け止め、${kws}のサービス品質およびオペレーションの改善を徹底してまいります。貴重なご指摘をいただきありがとうございました。`;
  }

  return { sentiment, ai_reply_draft };
}

app.get('/api/health', (c) =>
  c.json({
    status: 'ok',
    service: 'meo-harness',
    architecture: 'Cloudflare Workers + D1 + GBP Review AI + Local Rank Tracker + MCP',
    cost: '¥0/month (Replaces MEOチェキ / 口コミコム / ¥50,000/mo MEO Agencies)',
  })
);

app.get('/api/dashboard', async (c) => {
  const reviews = (await c.env.DB.prepare('SELECT * FROM gbp_reviews ORDER BY created_at DESC').all()).results || [];
  const rankings = (await c.env.DB.prepare('SELECT * FROM keyword_rankings ORDER BY current_rank ASC').all()).results || [];

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((s: number, r: any) => s + Number(r.star_rating), 0) / reviews.length).toFixed(1)
      : '4.9';

  return c.json({
    metrics: {
      total_reviews: reviews.length,
      average_rating: Number(avgRating),
      tracked_keywords: rankings.length,
      estimated_agency_saved_jpy: 45000,
    },
    reviews,
    rankings,
  });
});

app.post('/api/reviews/ingest', async (c) => {
  const body = await c.req.json<{
    store_name?: string;
    reviewer_name: string;
    star_rating: number;
    comment: string;
    target_keywords?: string;
  }>();

  const store_name = body.store_name || 'オーガニックサロン表参道';
  const target_keywords = body.target_keywords || '表参道 髪質改善 ヘッドスパ';
  const gen = generateMeoReply({ ...body, store_name, target_keywords });
  const id = `rev_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  const now = new Date().toISOString();

  await c.env.DB.prepare(
    `INSERT INTO gbp_reviews (id, store_name, reviewer_name, star_rating, comment, sentiment, target_keywords, ai_reply_draft, reply_status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'auto_replied', ?)`
  )
    .bind(id, store_name, body.reviewer_name, Number(body.star_rating), body.comment, gen.sentiment, target_keywords, gen.ai_reply_draft, now)
    .run();

  return c.json({
    ok: true,
    review: { id, store_name, ...body, ...gen, reply_status: 'auto_replied', created_at: now },
  });
});

app.post('/mcp', async (c) => {
  const body = await c.req.json();
  return c.json(await handleMcpRequest(body, c.env));
});

app.get('/', (c) => (c.env.STATIC_HTML ? c.html(c.env.STATIC_HTML) : c.text('MEO Harness API running')));

export default app;
