import type { Bindings } from '../index';

export async function handleMcpRequest(req: any, env: Bindings) {
  const { id, method, params } = req;
  if (method === 'initialize') {
    return {
      jsonrpc: '2.0',
      id,
      result: { protocolVersion: '2024-11-05', serverInfo: { name: 'meo-harness-mcp', version: '1.0.0' }, capabilities: { tools: {} } },
    };
  }
  if (method === 'tools/list') {
    return {
      jsonrpc: '2.0',
      id,
      result: {
        tools: [
          {
            name: 'list_gbp_reviews',
            description: 'Googleビジネスプロフィールの口コミ一覧とAI自動返信文面を取得します',
            inputSchema: { type: 'object', properties: {} },
          },
          {
            name: 'get_keyword_rankings',
            description: 'MEO対策キーワードの現在のGoogleマップ検索順位と前回比を取得します',
            inputSchema: { type: 'object', properties: {} },
          },
        ],
      },
    };
  }
  if (method === 'tools/call') {
    const toolName = params?.name;
    if (toolName === 'list_gbp_reviews') {
      const res = await env.DB.prepare('SELECT * FROM gbp_reviews ORDER BY created_at DESC').all();
      return { jsonrpc: '2.0', id, result: { content: [{ type: 'text', text: JSON.stringify(res.results || [], null, 2) }] } };
    }
    if (toolName === 'get_keyword_rankings') {
      const res = await env.DB.prepare('SELECT * FROM keyword_rankings ORDER BY current_rank ASC').all();
      return { jsonrpc: '2.0', id, result: { content: [{ type: 'text', text: JSON.stringify(res.results || [], null, 2) }] } };
    }
  }
  return { jsonrpc: '2.0', id, error: { code: -32601, message: 'Method not found' } };
}
