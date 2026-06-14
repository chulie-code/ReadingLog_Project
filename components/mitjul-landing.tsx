"use client";

import { useState } from "react";
import { Menu, X, PenLine, Sparkles, Target, BookOpen, ArrowRight, Check } from "lucide-react";

const ink = "#1F1E1A";
const paper = "#F7F5EF";
const surface = "#FCFBF8";
const mark = "#F4B740";
const action = "#137A5F";
const actionDark = "#0E5E48";
const muted = "#6B6862";
const line = "rgba(31,30,26,0.12)";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Gowun+Batang:wght@400;700&family=Noto+Sans+KR:wght@300;400;500;700&display=swap');

.mj * { box-sizing: border-box; margin: 0; padding: 0; }
.mj { font-family: "Noto Sans KR", system-ui, sans-serif; color: ${ink};
  background: ${paper}; line-height: 1.6; -webkit-font-smoothing: antialiased; }
.mj .serif { font-family: "Gowun Batang", "Noto Serif KR", Georgia, serif; }
.mj .container { max-width: 1080px; margin: 0 auto; padding: 0 24px; }

.mj a { color: inherit; text-decoration: none; }
.mj .nav { position: sticky; top: 0; z-index: 50; background: rgba(247,245,239,0.86);
  backdrop-filter: blur(8px); border-bottom: 1px solid ${line}; }
.mj .nav-in { display: flex; align-items: center; justify-content: space-between; height: 64px; }
.mj .logo { font-family: "Gowun Batang", serif; font-size: 22px; font-weight: 700; position: relative; }
.mj .logo::after { content: ""; position: absolute; left: 0; right: 0; bottom: -2px; height: 6px;
  background: ${mark}; opacity: 0.85; border-radius: 1px; }
.mj .nav-links { display: flex; align-items: center; gap: 28px; font-size: 15px; color: ${muted}; }
.mj .nav-links a:hover { color: ${ink}; }
.mj .menu-btn { display: none; background: none; border: none; cursor: pointer; color: ${ink}; }

.mj .btn { font-family: inherit; font-size: 15px; font-weight: 500; cursor: pointer;
  border-radius: 10px; padding: 11px 20px; display: inline-flex; align-items: center; gap: 8px;
  transition: transform .12s ease, background .15s ease, box-shadow .15s ease; border: none; }
.mj .btn:focus-visible { outline: 3px solid ${action}; outline-offset: 2px; }
.mj .btn-primary { background: ${action}; color: #fff; }
.mj .btn-primary:hover { background: ${actionDark}; transform: translateY(-1px); }
.mj .btn-primary:disabled { opacity: 0.6; cursor: default; transform: none; }
.mj .btn-ghost { background: transparent; color: ${ink}; border: 1px solid ${line}; }
.mj .btn-ghost:hover { background: ${surface}; border-color: rgba(31,30,26,0.25); }
.mj .btn-sm { padding: 8px 16px; font-size: 14px; }

.mj .hero { padding: 84px 0 72px; }
.mj .hero-grid { display: grid; grid-template-columns: 1.05fr 0.95fr; gap: 56px; align-items: center; }
.mj .eyebrow { font-size: 13px; letter-spacing: .12em; text-transform: uppercase; color: ${action};
  font-weight: 500; margin-bottom: 20px; }
.mj h1 { font-family: "Gowun Batang", serif; font-weight: 700; font-size: 56px; line-height: 1.18;
  letter-spacing: -0.01em; }
.mj .hl { position: relative; display: inline-block; }
.mj .hl > span { position: relative; z-index: 1; }
.mj .hl::before { content: ""; position: absolute; left: -0.06em; right: -0.06em; bottom: 0.08em;
  height: 0.42em; background: ${mark}; opacity: 0.62; z-index: 0; border-radius: 2px;
  transform: scaleX(0); transform-origin: left center;
  animation: hl-draw .75s cubic-bezier(.2,.7,.25,1) .4s forwards; }
@keyframes hl-draw { to { transform: scaleX(1); } }
.mj .sub { font-size: 18px; color: ${muted}; margin: 26px 0 32px; max-width: 30em; line-height: 1.7; }
.mj .cta-row { display: flex; gap: 14px; flex-wrap: wrap; }
.mj .trust { margin-top: 22px; font-size: 14px; color: ${muted}; display: flex; align-items: center; gap: 8px; }
.mj .reveal { opacity: 0; transform: translateY(14px); animation: up .65s ease-out forwards; }
.mj .d1 { animation-delay: .05s; } .mj .d2 { animation-delay: .15s; }
.mj .d3 { animation-delay: .28s; } .mj .d4 { animation-delay: .42s; }
@keyframes up { to { opacity: 1; transform: none; } }

.mj .demo { background: ${surface}; border: 1px solid ${line}; border-radius: 18px; padding: 26px;
  box-shadow: 0 24px 48px -28px rgba(31,30,26,0.28); }
.mj .demo .book { font-size: 13px; color: ${muted}; margin-bottom: 16px; display: flex; align-items: center; gap: 7px; }
.mj .demo .quote { font-family: "Gowun Batang", serif; font-size: 21px; line-height: 1.55; position: relative; display: inline; }
.mj .demo .quote .qhl { background: linear-gradient(${mark}, ${mark}) no-repeat; background-size: 100% 0.42em;
  background-position: 0 88%; padding: 0 2px; }
.mj .demo .arrow { margin: 22px 0 16px; display: flex; align-items: center; gap: 10px; color: ${muted}; font-size: 13px; }
.mj .demo .arrow .lne { flex: 1; height: 1px; background: ${line}; }
.mj .demo .action { background: rgba(19,122,95,0.08); border: 1px solid rgba(19,122,95,0.22);
  border-radius: 12px; padding: 14px 16px; display: flex; align-items: flex-start; gap: 11px; }
.mj .demo .action .ic { width: 22px; height: 22px; border-radius: 50%; background: ${action}; color: #fff;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; }
.mj .demo .action .lbl { font-size: 12px; color: ${action}; font-weight: 500; margin-bottom: 3px; }
.mj .demo .action .txt { font-size: 15px; color: ${ink}; line-height: 1.5; }

.mj .strip { border-top: 1px solid ${line}; border-bottom: 1px solid ${line}; padding: 56px 0; text-align: center; }
.mj .strip p { font-family: "Gowun Batang", serif; font-size: 28px; line-height: 1.5; max-width: 18em; margin: 0 auto; }
.mj .strip small { display: block; margin-top: 16px; font-family: "Noto Sans KR", sans-serif; font-size: 15px; color: ${muted}; }

.mj .section { padding: 80px 0; }
.mj .sec-head { margin-bottom: 44px; }
.mj .sec-head h2 { font-family: "Gowun Batang", serif; font-size: 34px; font-weight: 700; letter-spacing: -0.01em; }
.mj .sec-head .k { font-size: 13px; letter-spacing: .12em; text-transform: uppercase; color: ${action}; font-weight: 500; margin-bottom: 12px; }

.mj .feat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.mj .card { background: ${surface}; border: 1px solid ${line}; border-radius: 16px; padding: 28px; position: relative; }
.mj .card.hero-feat { border-color: rgba(19,122,95,0.4); background: rgba(19,122,95,0.04); }
.mj .card .ic-box { width: 44px; height: 44px; border-radius: 12px; background: rgba(244,183,64,0.18);
  color: #9a6a0f; display: flex; align-items: center; justify-content: center; margin-bottom: 18px; }
.mj .card.hero-feat .ic-box { background: rgba(19,122,95,0.14); color: ${actionDark}; }
.mj .card h3 { font-size: 19px; font-weight: 500; margin-bottom: 9px; }
.mj .card p { font-size: 15px; color: ${muted}; line-height: 1.65; }
.mj .tag { position: absolute; top: 20px; right: 20px; font-size: 11px; font-weight: 500;
  letter-spacing: .06em; color: ${actionDark}; background: rgba(19,122,95,0.12); padding: 4px 10px; border-radius: 20px; }

.mj .steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }
.mj .step .num { font-family: "Gowun Batang", serif; font-size: 15px; color: ${action}; font-weight: 700; letter-spacing: .05em; }
.mj .step .bar { height: 2px; background: ${line}; margin: 14px 0 18px; position: relative; }
.mj .step .bar::before { content: ""; position: absolute; left: 0; top: 0; width: 34px; height: 2px; background: ${mark}; }
.mj .step h4 { font-family: "Gowun Batang", serif; font-size: 21px; font-weight: 700; margin-bottom: 8px; }
.mj .step p { font-size: 15px; color: ${muted}; line-height: 1.6; }

.mj .final { text-align: center; padding: 88px 0; }
.mj .final .eyebrow { text-align: center; }
.mj .final h2 { font-family: "Gowun Batang", serif; font-size: 42px; font-weight: 700; line-height: 1.3; letter-spacing: -0.01em; }
.mj .signup-sub { font-size: 17px; color: ${muted}; max-width: 26em; margin: 18px auto 28px; line-height: 1.7; }
.mj .signup-form { display: flex; gap: 10px; max-width: 440px; margin: 0 auto; }
.mj .signup-input { flex: 1; font-family: inherit; font-size: 16px; padding: 12px 16px;
  border: 1px solid ${line}; border-radius: 10px; background: #fff; color: ${ink}; }
.mj .signup-input::placeholder { color: #9a978f; }
.mj .signup-input:focus { outline: none; border-color: ${action}; box-shadow: 0 0 0 3px rgba(19,122,95,0.15); }
.mj .signup-form .btn { white-space: nowrap; }
.mj .signup-done { font-size: 16px; color: ${actionDark}; background: rgba(19,122,95,0.08);
  border: 1px solid rgba(19,122,95,0.22); border-radius: 12px; padding: 15px 22px; max-width: 440px;
  margin: 0 auto; display: inline-flex; align-items: center; gap: 9px; }
.mj .signup-err { font-size: 14px; color: #a3322b; margin-top: 12px; }

.mj footer { border-top: 1px solid ${line}; padding: 36px 0; }
.mj .foot-in { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
.mj footer .links { display: flex; gap: 22px; font-size: 14px; color: ${muted}; }
.mj footer .links a:hover { color: ${ink}; }
.mj footer .copy { font-size: 13px; color: ${muted}; }

@media (max-width: 860px) {
  .mj .hero-grid { grid-template-columns: 1fr; gap: 40px; }
  .mj h1 { font-size: 42px; }
  .mj .feat-grid { grid-template-columns: 1fr; }
  .mj .steps { grid-template-columns: 1fr; gap: 22px; }
  .mj .nav-links { display: none; }
  .mj .menu-btn { display: flex; }
  .mj .final h2 { font-size: 32px; }
  .mj .strip p { font-size: 23px; }
  .mj .signup-form { flex-direction: column; }
}
@media (prefers-reduced-motion: reduce) {
  .mj * { animation: none !important; }
  .mj .hl::before { transform: scaleX(1) !important; }
  .mj .reveal { opacity: 1 !important; transform: none !important; }
}
.mj .mobile-menu { display: flex; flex-direction: column; gap: 4px; padding: 8px 24px 18px;
  border-bottom: 1px solid ${line}; background: ${paper}; }
.mj .mobile-menu a { padding: 10px 0; font-size: 16px; color: ${ink}; }
`;

export default function MitjulLanding() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  async function handleBeta() {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    try {
      // 4단계에서 Supabase에 저장하도록 연결하세요. 예:
      // await fetch("/api/beta", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      await new Promise((r) => setTimeout(r, 500));
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="mj">
      <style>{css}</style>

      <header className="nav">
        <div className="container nav-in">
          <span className="logo">밑줄</span>
          <nav className="nav-links">
            <a href="#features">기능</a>
            <a href="#how">사용법</a>
            <a href="#signup">베타 신청</a>
            <a href="/auth/login">로그인</a>
            <a href="/auth/sign-up" className="btn btn-primary btn-sm">시작하기</a>
          </nav>
          <button className="menu-btn" aria-label="메뉴 열기" onClick={() => setOpen(!open)}>
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {open && (
          <div className="mobile-menu">
            <a href="#features" onClick={() => setOpen(false)}>기능</a>
            <a href="#how" onClick={() => setOpen(false)}>사용법</a>
            <a href="#signup" onClick={() => setOpen(false)}>베타 신청</a>
            <a href="/auth/login" onClick={() => setOpen(false)}>로그인</a>
            <a href="/auth/sign-up" onClick={() => setOpen(false)}>시작하기</a>
          </div>
        )}
      </header>

      <section className="hero">
        <div className="container hero-grid">
          <div>
            <p className="eyebrow reveal d1">독서 기록 × AI · 베타 모집 중</p>
            <h1 className="reveal d2">
              밑줄 그은 문장이<br />
              <span className="hl"><span>행동이</span></span> 되도록.
            </h1>
            <p className="sub reveal d3">
              자기계발·실용서를 읽고 기록하면, AI가 핵심을 정리해 오늘 실천할 방법을 제안하고,
              그 기록을 한 권의 책으로 엮어줍니다. 읽고 흘려보내지 않는 독서.
            </p>
            <div className="cta-row reveal d4">
              <a href="#signup" className="btn btn-primary">베타테스터 신청 <ArrowRight size={17} /></a>
              <a href="#how" className="btn btn-ghost">3분 둘러보기</a>
            </div>
            <p className="trust reveal d4">
              <Check size={15} color={action} /> 준비되면 베타테스터에게 가장 먼저 알려드려요
            </p>
          </div>

          <div className="demo reveal d3" aria-label="기록이 실천 액션으로 바뀌는 예시">
            <div className="book"><PenLine size={14} /> 아주 작은 습관의 힘</div>
            <p className="quote">
              <span className="qhl">습관은 복리로 쌓인다. 매일 1%</span>씩 나아지면 1년 뒤엔 37배가 된다.
            </p>
            <div className="arrow"><span className="lne" /> AI가 실천으로 바꿔줘요 <span className="lne" /></div>
            <div className="action">
              <span className="ic"><Check size={13} /></span>
              <div>
                <div className="lbl">오늘의 실천</div>
                <div className="txt">새로 들일 습관 하나를, 이미 하고 있는 습관 바로 뒤에 붙여보기.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="strip">
        <div className="container">
          <p className="serif">읽을 때는 분명 좋았는데, 일주일 뒤엔 한 줄도 기억나지 않는다.</p>
          <small>밑줄은 그 문장을 붙잡아 두고, 다음 행동으로 이어줍니다.</small>
        </div>
      </section>

      <section className="section" id="features">
        <div className="container">
          <div className="sec-head">
            <div className="k">기능</div>
            <h2>기록에서 끝나지 않습니다</h2>
          </div>
          <div className="feat-grid">
            <div className="card">
              <div className="ic-box"><PenLine size={22} /></div>
              <h3>기록</h3>
              <p>밑줄·인용·메모를 책별로 모아요. 읽으면서 남긴 한 줄이 흩어지지 않게.</p>
            </div>
            <div className="card">
              <div className="ic-box"><Sparkles size={22} /></div>
              <h3>AI 정리</h3>
              <p>내가 주목한 문장을 AI가 핵심으로 요약하고 키워드로 묶어줘요.</p>
            </div>
            <div className="card hero-feat">
              <span className="tag">핵심</span>
              <div className="ic-box"><Target size={22} /></div>
              <h3>현실 적용</h3>
              <p>읽은 내용을 오늘 해볼 수 있는 구체적인 행동으로 바꿔 제안합니다.</p>
            </div>
            <div className="card hero-feat">
              <span className="tag">핵심</span>
              <div className="ic-box"><BookOpen size={22} /></div>
              <h3>나만의 책</h3>
              <p>흩어진 밑줄과 메모를 한 권으로 엮어요. 읽고 남긴 것들이, 내가 쓴 책이 됩니다.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="how" style={{ background: surface, borderTop: `1px solid ${line}`, borderBottom: `1px solid ${line}` }}>
        <div className="container">
          <div className="sec-head">
            <div className="k">사용법</div>
            <h2>세 걸음이면 됩니다</h2>
          </div>
          <div className="steps">
            <div className="step">
              <div className="num">01</div>
              <div className="bar" />
              <h4>밑줄 긋기</h4>
              <p>마음에 남은 문장과 생각을 책마다 기록해요.</p>
            </div>
            <div className="step">
              <div className="num">02</div>
              <div className="bar" />
              <h4>AI가 정리</h4>
              <p>흩어진 기록을 핵심과 키워드로 묶어 보여줘요.</p>
            </div>
            <div className="step">
              <div className="num">03</div>
              <div className="bar" />
              <h4>실천하기</h4>
              <p>읽은 것을 오늘의 행동으로 옮기고, 한 권의 책으로 엮어요.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="final" id="signup">
        <div className="container">
          <p className="eyebrow">베타테스터 모집</p>
          <h2 className="serif">밑줄을 가장 먼저<br />써볼 분을 찾습니다.</h2>
          <p className="signup-sub">
            출시 전 베타테스터로 함께해 주세요. 이메일을 남겨주시면 준비되는 대로 초대장을 보내드릴게요.
          </p>

          {status === "success" ? (
            <div className="signup-done">
              <Check size={18} color={actionDark} /> 신청 완료! 준비되면 가장 먼저 연락드릴게요.
            </div>
          ) : (
            <>
              <div className="signup-form">
                <input
                  type="email"
                  className="signup-input"
                  placeholder="이메일 주소"
                  aria-label="이메일 주소"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (status === "error") setStatus("idle"); }}
                  onKeyDown={(e) => { if (e.key === "Enter") handleBeta(); }}
                />
                <button
                  className="btn btn-primary"
                  onClick={() => handleBeta()}
                  disabled={status === "loading"}
                >
                  {status === "loading" ? "신청 중…" : "신청하기"} <ArrowRight size={17} />
                </button>
              </div>
              {status === "error" && <p className="signup-err">올바른 이메일 주소를 입력해 주세요.</p>}
            </>
          )}
        </div>
      </section>

      <footer>
        <div className="container foot-in">
          <span className="logo">밑줄</span>
          <div className="links">
            <a href="#features">기능</a>
            <a href="#how">사용법</a>
            <a href="#signup">베타 신청</a>
          </div>
          <span className="copy">© 2026 밑줄 (Mitjul)</span>
        </div>
      </footer>
    </div>
  );
}
