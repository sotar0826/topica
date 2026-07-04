// Cloudflare Pages Function: /api/stats
// Web Analytics（RUM）の日別PV・記事別PVを GraphQL Analytics API から取得して返す。
// APIトークンはサーバー側の秘密（env.CF_ANALYTICS_API_TOKEN）として保持し、公開HTMLには出さない。
// トークンは Account Analytics: Read 権限のもの。

const ACCOUNT_TAG = "e47e40496a834e6a3e91e6b19476e289";
const SITE_TAG = "c7cd2df2924841e28234f03cdd033f9e";
const GRAPHQL = "https://api.cloudflare.com/client/v4/graphql";

// YYYY-MM-DD（UTC）
function ymd(d) {
  return d.toISOString().slice(0, 10);
}

export async function onRequestGet(context) {
  // 環境変数の前後空白・改行を除去（CLI 登録時に混入することがあるため）
  const token = (context.env.CF_ANALYTICS_API_TOKEN || "").trim();
  if (!token) {
    return json({ error: "APIトークン未設定（Pages の環境変数 CF_ANALYTICS_API_TOKEN を設定してください）" }, 500);
  }

  // 期間：直近14日（本日含む）
  const days = Math.min(Number(new URL(context.request.url).searchParams.get("days")) || 14, 92);
  const end = new Date();
  const start = new Date(end.getTime() - (days - 1) * 86400000);
  const startStr = ymd(start);
  const endStr = ymd(end);

  const query = `query {
    viewer {
      accounts(filter: { accountTag: "${ACCOUNT_TAG}" }) {
        daily: rumPageloadEventsAdaptiveGroups(
          limit: 100,
          filter: { date_geq: "${startStr}", date_leq: "${endStr}", siteTag: "${SITE_TAG}" },
          orderBy: [date_ASC]
        ) {
          count
          sum { visits }
          dimensions { date }
        }
        byPath: rumPageloadEventsAdaptiveGroups(
          limit: 50,
          filter: { date_geq: "${startStr}", date_leq: "${endStr}", siteTag: "${SITE_TAG}" },
          orderBy: [count_DESC]
        ) {
          count
          sum { visits }
          dimensions { requestPath }
        }
      }
    }
  }`;

  let resp;
  try {
    resp = await fetch(GRAPHQL, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
  } catch (e) {
    return json({ error: "Cloudflare API への接続に失敗: " + e.message }, 502);
  }

  const data = await resp.json();
  if (data.errors && data.errors.length) {
    return json({ error: "GraphQL エラー: " + JSON.stringify(data.errors) }, 502);
  }

  const acct = data?.data?.viewer?.accounts?.[0] || {};
  const round = (n) => Math.round(n || 0);

  const daily = (acct.daily || []).map((g) => ({
    date: g.dimensions.date,
    pv: round(g.count),
    visits: round(g.sum?.visits),
  }));

  const byPath = (acct.byPath || [])
    .map((g) => ({
      path: g.dimensions.requestPath,
      pv: round(g.count),
      visits: round(g.sum?.visits),
    }))
    .filter((r) => r.pv > 0);

  const totalPv = daily.reduce((a, b) => a + b.pv, 0);
  const totalVisits = daily.reduce((a, b) => a + b.visits, 0);

  return json({
    range: { start: startStr, end: endStr, days },
    totals: { pv: totalPv, visits: totalVisits },
    daily,
    byPath,
    updated: new Date().toISOString(),
  });
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}
