import assert from "node:assert/strict";

const origin = new URL(process.env.SMOKE_BASE_URL || "http://127.0.0.1:3000");
assert.ok(["127.0.0.1", "localhost", "[::1]"].includes(origin.hostname), "検証先はループバックのみ指定できます。");

async function request(path, status = 200) {
  const response = await fetch(new URL(path, origin), { signal: AbortSignal.timeout(30_000) });
  assert.equal(response.status, status, `${path}: HTTP ${status}`);
  return response;
}

const start = Date.now();
const health = await (await request("/api/health")).json();
assert.equal(health.status, "ok");
assert.equal(health.service, "ics-lab-web");
assert.equal(health.runtime, "not_configured");
assert.ok(Date.parse(health.timestamp) >= start - 1000);
assert.ok(Date.parse(health.timestamp) <= Date.now());

const catalog = await (await request("/api/labs")).json();
assert.equal(catalog.meta.total, 3);
assert.equal(catalog.data.length, 3);
assert.deepEqual(catalog.data.map((lab) => lab.id), ["water-01", "power-01", "rail-01"]);
for (const lab of catalog.data) {
  assert.equal(lab.status, "coming_soon");
  assert.deepEqual(await (await request(`/api/labs/${lab.slug}`)).json(), { data: lab });
  const html = await (await request(`/labs/${lab.slug}`)).text();
  for (const text of [lab.title, ...lab.objectives, ...lab.assets, "準備中", "VM接続は次フェーズで対応"]) assert.ok(html.includes(text), `${lab.slug}: ${text}`);
  assert.match(html, /<button[^>]*disabled/, "演習開始は非活性");
}

for (const path of ["/", "/labs", "/dashboard"]) {
  const html = await (await request(path)).text();
  for (const text of ["ICS Lab", 'lang="ja"', "<header", "<nav", "<footer"]) assert.ok(html.includes(text), `${path}: ${text}`);
  if (path === "/dashboard") {
    assert.ok(html.includes("開発プレビュー"));
    assert.ok(html.includes("学習履歴は未実装"));
  } else {
    for (const lab of catalog.data) assert.ok(html.includes(`/labs/${lab.slug}`), `${path}: ${lab.slug}への導線`);
  }
}

assert.ok((await (await request("/labs/unknown", 404)).text()).includes("指定されたページはありません。"));
assert.equal((await (await request("/api/labs/unknown", 404)).json()).error.code, "LAB_NOT_FOUND");
await request("/unknown", 404);
assert.equal((await fetch(new URL("/api/labs", origin), { method: "POST" })).status, 405);
await request("/api/runtime/start", 404);
console.log("PASS: 全画面・3シナリオ・共通UI・全API・404・405・未接続状態をHTTPで確認しました。");
