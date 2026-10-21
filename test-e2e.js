const BASE = process.env.BASE_URL || 'http://localhost:8793';

async function runTests() {
  console.log('=== MEO Harness E2E Test Suite ===');
  const health = await fetch(`${BASE}/api/health`).then((r) => r.json());
  if (health.status !== 'ok') throw new Error('Health failed');
  console.log('✅ 1. Health check passed:', health.service);

  const revRes = await fetch(`${BASE}/api/reviews/ingest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      reviewer_name: '佐々木 美咲',
      star_rating: 5,
      target_keywords: '表参道 髪質改善 ヘッドスパ',
      comment: '髪がサラサラになり大満足です！',
    }),
  }).then((r) => r.json());

  if (!revRes.ok || !revRes.review.ai_reply_draft.includes('表参道 髪質改善 ヘッドスパ')) {
    throw new Error('MEO keyword injection failed');
  }
  console.log('✅ 2. GBP Review ingested & MEO keyword auto-reply generated');

  const mcpRes = await fetch(`${BASE}/mcp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'get_keyword_rankings', arguments: {} } }),
  }).then((r) => r.json());
  const ranks = JSON.parse(mcpRes.result.content[0].text);
  if (ranks.length < 3) throw new Error('Rankings check failed');
  console.log('✅ 3. MCP tool get_keyword_rankings verified');
  console.log('🎉 ALL MEO HARNESS E2E TESTS PASSED!');
}
runTests().catch((e) => { console.error(e); process.exit(1); });
