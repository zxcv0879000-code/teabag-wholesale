// 메뉴 배경: 조금 내리면 생김
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// 로그인한 상태면 메뉴의 "로그인"을 "회원 페이지"로
const navLogin = document.getElementById('navLogin');
try {
  if (navLogin && sessionStorage.getItem('sb_token')) {
    navLogin.textContent = '회원 페이지';
    navLogin.href = '/members';
  }
} catch {}

// 문의 폼
const form = document.getElementById('inquiryForm');
if (form) {
  const msg = document.getElementById('formMsg');
  const btn = document.getElementById('submitBtn');
  const show = (text, ok) => { msg.textContent = text; msg.className = 'form-msg ' + (ok ? 'ok' : 'err'); msg.hidden = false; };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const v = {
      name: form.name.value.trim(),
      contact: form.contact.value.trim(),
      tea_type: form.tea_type.value.trim(),
      website: form.website.value,
      consent: document.getElementById('f-consent').checked,
    };
    if (!v.name || !v.contact) return show('이름과 연락처를 적어 주세요.', false);
    if (!v.consent) return show('개인정보 수집·이용에 동의해 주세요.', false);

    btn.disabled = true;
    btn.textContent = '보내는 중…';
    try {
      const r = await fetch('/api/inquiry', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(v) });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data.error || '보내지 못했어요. 잠시 뒤 다시 시도해 주세요.');
      form.reset();
      show('문의가 접수됐어요. 확인 후 연락드릴게요.', true);
    } catch (err) {
      show(err.message || '보내지 못했어요. 잠시 뒤 다시 시도해 주세요.', false);
    } finally {
      btn.disabled = false;
      btn.textContent = '도매 단가 문의 보내기';
    }
  });
}
