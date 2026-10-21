# 【完全無料・OSS】月額5万円のMEO代行・口コミ管理SaaSを不要にする、Googleマップ自動運用＆AI口コミ返信エンジン「MEO Harness」を公開しました

美容室・整体院・クリニック・飲食店などの店舗ビジネスにおいて、**Googleマップ（Googleビジネスプロフィール）の上位表示（MEO対策）**は集客の生命線です。
しかし、多くの店舗オーナーが以下のようなコストの悩みを抱えています。

- MEO運用代行会社に頼むと**月額3万〜5万円（年間36万〜60万円）**の固定費がかかる
- MEO順位チェック＆口コミ管理SaaS（MEOチェキ、口コミコム等）も毎月数千円〜数万円の費用がかかる
- 日々の施術や営業が忙しく、口コミへの返信が後回しになり、Googleマップの評価アルゴリズムで不利になる

この課題を解決するため、Cloudflare Workers + D1 の完全無料枠（月額0円）で動作し、AIエージェント（MCP）から操作できるGoogleマップ自動運用エンジン **「MEO Harness」** をMITライセンスのOSSとして公開しました！

🔗 **GitHubリポジトリ**: https://github.com/reina20xx/meo-harness

---

## MEO Harness の3大コア機能

### 1. MEO対策キーワードを自然に織り交ぜる「口コミAI自動返信」
Googleマップの順位評価において、「口コミ本文」および「オーナーからの返信文面」に含まれる地域名・サービス名のキーワード関連性は非常に重要です。
MEO Harness は、投稿された星評価とコメントを解析し、対策したいキーワード（例：`表参道 髪質改善 ヘッドスパ`）を不自然にならないよう文脈に織り交ぜた感謝返信を即座に自動生成します。

```typescript
// 星4〜5の高評価には対策キーワードを自然に盛り込み、低評価には誠実な改善返信を生成
if (stars >= 4) {
  ai_reply_draft = `${input.reviewer_name}様、この度は「${input.store_name}」へご来店いただき誠にありがとうございます！...当店では${kws}にこだわり...`;
}
```

### 2. 地域×業種キーワードの検索順位トラッカー
「渋谷 美容室 髪質改善」「表参道 ヘッドスパ 個室」などの重要キーワードについて、現在の順位・前回順位との比較・競合1位店舗をCloudflare D1データベースで一元管理します。

### 3. Claude Code / Cursor と直結する「MCP Server」内蔵
普段使っているAIツールから自然言語で店舗のMEO状況を確認できます。
- 「今週のGoogleマップの口コミ一覧とAI返信案を出して」➔ `list_gbp_reviews`
- 「対策キーワードの最新順位と前回比を見せて」➔ `get_keyword_rankings`

---

## 5分で試せるクイックスタート

```bash
git clone https://github.com/reina20xx/meo-harness.git
cd meo-harness
npm install
npm run dev
```

先に公開した予約管理エンジン **「Reserve Harness」** と組み合わせれば、店舗の「Googleマップ集客（MEO）➔ LINE予約 ➔ 顧客カルテ管理」までが**完全無料（月額0円）**で一気通貫します。ぜひご活用ください！

🔗 **GitHub**: https://github.com/reina20xx/meo-harness
