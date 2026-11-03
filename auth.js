// 회원가입·로그인 공통 — Supabase Auth REST. 공개 키는 /api/auth-config 에서 받는다.
const TOKEN = 'sb_token';
const getToken = () => { try { return sessionStorage.getItem(TOKEN) || ''; } catch { return ''; } };
const setToken = (v) => { try { v ? sessionStorage.setItem(TOKEN, v) : sessionStorage.removeItem(TOKEN); } catch {} };

let cfg;
async function config() {
  if (cfg) return cfg;
  const r = await fetch('/api/auth-config');
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(d.error || '지금은 로그인을 쓸 수 없어요. 잠시 뒤 다시 시도해 주세요.');
  return (cfg = d);
}

async function auth(path, body, token) {
  const { url, key } = await config();
  const r = await fetch(`${url}/auth/v1/${path}`, {
    method: 'POST',
    headers: { apikey: key, 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(body || {}),
  });
  const d = await r.json().catch(() => ({}));
  return { ok: r.ok, status: r.status, data: d };
}

function say(el, text, ok) {
  el.textContent = text;
  el.className = 'form-msg ' + (ok ? 'ok' : 'err');
  el.hidden = !text;
}

function busy(btn, on, label) {
  btn.disabled = on;
  if (on) { btn.dataset.label = btn.textContent; btn.textContent = label; }
  else if (btn.dataset.label) btn.textContent = btn.dataset.label;
}
