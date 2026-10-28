import React from 'react';

// Generated from "Meherdeep Thakur Portfolio.dc.html". Props: headline, showAvailability.
class App extends React.Component {
  state = { edu: 0, sticky: true };
  eduRef = React.createRef();
  eduInner = React.createRef();
  hdrRef = React.createRef();
  progRef = React.createRef();
  setupMotion() {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ease = 'cubic-bezier(.2,.7,.2,1)';
    const root = this.hdrRef.current && this.hdrRef.current.parentElement;
    if (!root || reduce) return;
    const main = root.querySelector('main');
    const sections = [...main.children].filter(n => n.tagName === 'SECTION');
    // hero: staggered entrance on load
    const hero = sections[0];
    const heroEls = [...hero.querySelectorAll(':scope > div > *, :scope > figure')];
    heroEls.forEach((el, i) => el.animate(
      [{ opacity: 0, transform: el.tagName === 'FIGURE' ? 'scale(.94)' : 'translateY(28px)' }, { opacity: 1, transform: 'none' }],
      { duration: 900, delay: 80 + i * 90, easing: ease, fill: 'both' }));
    // scroll reveals
    const sel = 'h2, h3, p, article, li, figure, [role="tablist"], section[aria-label="Credentials"] > div > div, #capabilities > div > div, #education > div > div:first-child';
    const seen = new Set();
    const targets = [];
    sections.slice(1).forEach(sec => {
      sec.querySelectorAll(sel).forEach(el => {
        if (el.closest('#edu-track, [style*="translateX"]') && el.tagName !== 'ARTICLE') return;
        for (let p = el.parentElement; p && p !== sec; p = p.parentElement) if (seen.has(p)) return;
        seen.add(el); targets.push(el);
      });
    });
    this._anims = new Map();
    targets.forEach(el => {
      const a = el.animate([{ opacity: 0, transform: 'translateY(32px)' }, { opacity: 1, transform: 'none' }],
        { duration: 800, easing: ease, fill: 'both' });
      a.pause(); a.currentTime = 0;
      this._anims.set(el, a);
    });
    this._io = new IntersectionObserver(entries => {
      const vis = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      vis.forEach((e, i) => {
        const a = this._anims.get(e.target); if (!a) return;
        a.effect.updateTiming({ delay: Math.min(i, 6) * 80 });
        a.play(); this._io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    targets.forEach(el => this._io.observe(el));
    // section headings: subtle parallax drift for depth
    this._drift = sections.slice(1).map(s => s.querySelector('h2')).filter(Boolean);
  }
  componentDidMount() {
    this._layout = () => {
      const hh = this.hdrRef.current ? this.hdrRef.current.offsetHeight : 64;
      document.documentElement.style.setProperty('--hdr', hh + 'px');
      const inner = this.eduInner.current; if (!inner) return;
      const prev = inner.style.position; inner.style.position = 'static';
      const fits = window.innerWidth >= 720 && inner.offsetHeight <= window.innerHeight - hh;
      inner.style.position = prev;
      if (fits !== this.state.sticky) this.setState({ sticky: fits });
    };
    this._onResize = () => { this._layout(); this._onScroll(); };
    window.addEventListener('resize', this._onResize);
    this._onProg = () => {
      if (this._raf) return;
      this._raf = requestAnimationFrame(() => {
        this._raf = 0;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (this.progRef.current) this.progRef.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
      });
    };
    window.addEventListener('scroll', this._onProg, { passive: true });
    this.setupMotion();
    this._onScroll = () => {
      if (!this.state.sticky) return;
      const el = this.eduRef.current; if (!el) return;
      const r = el.getBoundingClientRect();
      const span = el.offsetHeight - window.innerHeight;
      const prog = Math.min(Math.max(-r.top / Math.max(span, 1), 0), 0.999);
      const i = Math.floor(prog * 3);
      if (i !== this.state.edu) this.setState({ edu: i });
    };
    window.addEventListener('scroll', this._onScroll, { passive: true });
    this._layout();
    this._onScroll();
  }
  componentWillUnmount() { window.removeEventListener('scroll', this._onProg); if (this._io) this._io.disconnect(); window.removeEventListener('scroll', this._onScroll); window.removeEventListener('resize', this._onResize); }
  setEdu(i) {
    i = Math.min(Math.max(i, 0), 2);
    const el = this.eduRef.current;
    if (!el || !this.state.sticky) return this.setState({ edu: i });
    const span = el.offsetHeight - window.innerHeight;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + span * (i + 0.5) / 3, behavior: 'smooth' });
  }
  renderVals() {
    const e = this.state.edu;
    const tabs = {};
    [0, 1, 2].forEach(i => {
      const on = i === e;
      tabs['go' + i] = () => this.setEdu(i);
      tabs['tabBg' + i] = on ? '#141313' : '#FFFFFF';
      tabs['tabFg' + i] = on ? '#FFFFFF' : '#404040';
      tabs['tabBorder' + i] = on ? '#141313' : '#D4D4D4';
    });
    const edu = {
      ...tabs,
      eduRef: this.eduRef,
      eduInner: this.eduInner,
      hdrRef: this.hdrRef,
      progRef: this.progRef,
      eduH: this.state.sticky ? '300vh' : 'auto',
      eduPos: this.state.sticky ? 'sticky' : 'static',
      eduOffset: `-${e * 100}%`,
      eduCounter: `0${e + 1} / 03`,
      eduPrev: () => this.setEdu(e - 1),
      eduNext: () => this.setEdu(e + 1),
      onTouchStart: ev => { this._tx = ev.touches[0].clientX; },
      onTouchEnd: ev => { const d = ev.changedTouches[0].clientX - (this._tx ?? 0); if (Math.abs(d) > 40) this.setEdu(e + (d < 0 ? 1 : -1)); }
    };
    const h = this.props.headline ?? "Builder → Backer";
    return {
      ...edu,
      isD: h === "Launch to scale",
      isE: h === "Build, ship, invest",
      isF: h === "Frontier → products",
      isG: h === "Builder, operator, investor",
      isA: h === "Builder → Backer",
      isB: h === "Operator's view",
      isC: h === "Three roles",
      showAvail: this.props.showAvailability ?? true,
      year: new Date().getFullYear()
    };
  }

  render() {
    const { progRef, hdrRef, showAvail, isA, isB, isC, isD, isE, isF, isG, eduRef, eduH, eduInner, eduPos, eduCounter, eduPrev, eduNext, go0, tabBorder0, tabBg0, tabFg0, go1, tabBorder1, tabBg1, tabFg1, go2, tabBorder2, tabBg2, tabFg2, onTouchStart, onTouchEnd, eduOffset, year } = this.renderVals();
    return (
      <>
      <div data-theme="clean" style={{ minHeight: "100vh", background: "#FFFFFF" }}>
        <div ref={progRef} aria-hidden="true" style={{ position: "fixed", top: "0", left: "0", right: "0", height: "3px", background: "#3375CA", transformOrigin: "0 50%", transform: "scaleX(0)", zIndex: "30", pointerEvents: "none" }} />
        <header ref={hdrRef} style={{ position: "sticky", top: "0", zIndex: "10", background: "rgba(255,255,255,0.9)", backdropFilter: "blur(10px)", borderBottom: "1px solid #E6E6E6" }}>
          <nav style={{ maxWidth: "1440px", margin: "0 auto", padding: "8px clamp(20px,4vw,48px)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "24px", flexWrap: "wrap" }}>
            <a href="#top" style={{ fontFamily: "Arial,'Helvetica Neue',Helvetica,sans-serif", fontWeight: "700", fontSize: "22px", letterSpacing: "-0.01em" }}>
              {"Meherdeep Thakur"}
            </a>
            <div style={{ display: "flex", alignItems: "center", gap: "24px", flexWrap: "nowrap", overflowX: "auto", maxWidth: "100%", WebkitOverflowScrolling: "touch", scrollbarWidth: "none", fontSize: "14px", lineHeight: "1", color: "#404040" }}>
              <a href="#now" style={{ padding: "14px 0", whiteSpace: "nowrap" }}>
                {"Now"}
              </a>
              <a href="#work" style={{ padding: "14px 0", whiteSpace: "nowrap" }}>
                {"Work"}
              </a>
              <a href="#investing" style={{ padding: "14px 0", whiteSpace: "nowrap" }}>
                {"Investing"}
              </a>
              <a href="#education" style={{ padding: "14px 0", whiteSpace: "nowrap" }}>
                {"Education"}
              </a>
              <a href="https://medium.com/@meherdeept" target="_blank" rel="noopener" style={{ display: "inline-flex", alignItems: "center", gap: "4px", lineHeight: "1", padding: "14px 0", whiteSpace: "nowrap" }}>
                {"Writing"}
                <span aria-hidden="true" style={{ fontSize: "11px", lineHeight: "1", fontFamily: "Arial,sans-serif" }}>
                  {"↗︎"}
                </span>
              </a>
            </div>
            <a className="dch1" href="#contact" style={{ fontSize: "14px", padding: "9px 16px", border: "1px solid #141313", borderRadius: "999px" }}>
              {"Get in touch"}
            </a>
          </nav>
        </header>
        <main id="top">
          <section style={{ maxWidth: "1440px", margin: "0 auto", padding: "clamp(56px,9vw,120px) clamp(20px,4vw,48px) clamp(48px,7vw,88px)", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,420px),1fr))", gap: "clamp(40px,6vw,80px)", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
              {showAvail && (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", alignSelf: "start", padding: "8px 16px", borderRadius: "999px", background: "#E1F9DB", fontFamily: "Arial,'Helvetica Neue',Helvetica,sans-serif", fontSize: "12px", letterSpacing: "0.06em", textTransform: "uppercase", color: "#14532D" }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "rgb(0, 158, 15)" }} />
                    {" Open to work"}
                  </div>
                </>
              )}
              {isA && (
                <>
                  <h1 style={{ margin: "0", fontFamily: "Arial,'Helvetica Neue',Helvetica,sans-serif", fontWeight: "700", fontSize: "clamp(38px,6.4vw,96px)", lineHeight: "1.02", letterSpacing: "-0.025em", textWrap: "balance" }}>
                    {"I take AI products from 0 to 1. "}
                    <em style={{ fontStyle: "normal", color: "#3375CA" }}>
                      {"Next, I want to back the founders who do."}
                    </em>
                  </h1>
                </>
              )}
              {isB && (
                <>
                  <h1 style={{ margin: "0", fontFamily: "Arial,'Helvetica Neue',Helvetica,sans-serif", fontWeight: "700", fontSize: "clamp(38px,6.4vw,96px)", lineHeight: "1.02", letterSpacing: "-0.025em", textWrap: "balance" }}>
                    {"An operator’s view of AI, "}
                    <em style={{ fontStyle: "normal", color: "#3375CA" }}>
                      {"from the builder’s seat and the investor’s."}
                    </em>
                  </h1>
                </>
              )}
              {isC && (
                <>
                  <h1 style={{ margin: "0", fontFamily: "Arial,'Helvetica Neue',Helvetica,sans-serif", fontWeight: "700", fontSize: "clamp(38px,6.4vw,96px)", lineHeight: "1.02", letterSpacing: "-0.025em", textWrap: "balance" }}>
                    {"Product manager. Founder. "}
                    <em style={{ fontStyle: "normal", color: "#3375CA" }}>
                      {"Future investor in AI-native companies."}
                    </em>
                  </h1>
                </>
              )}
              {isD && (
                <>
                  <h1 style={{ margin: "0", fontFamily: "Arial,'Helvetica Neue',Helvetica,sans-serif", fontWeight: "700", fontSize: "clamp(38px,6.4vw,96px)", lineHeight: "1.02", letterSpacing: "-0.025em", textWrap: "balance" }}>
                    {"Building AI products from first launch to global scale. "}
                    <em style={{ fontStyle: "normal", color: "#3375CA" }}>
                      {"And backing the founders who build them."}
                    </em>
                  </h1>
                </>
              )}
              {isE && (
                <>
                  <h1 style={{ margin: "0", fontFamily: "Arial,'Helvetica Neue',Helvetica,sans-serif", fontWeight: "700", fontSize: "clamp(38px,6.4vw,96px)", lineHeight: "1.02", letterSpacing: "-0.025em", textWrap: "balance" }}>
                    {"I build, ship and invest in AI. "}
                    <em style={{ fontStyle: "normal", color: "#3375CA" }}>
                      {"From startups to big tech to venture."}
                    </em>
                  </h1>
                </>
              )}
              {isF && (
                <>
                  <h1 style={{ margin: "0", fontFamily: "Arial,'Helvetica Neue',Helvetica,sans-serif", fontWeight: "700", fontSize: "clamp(38px,6.4vw,96px)", lineHeight: "1.02", letterSpacing: "-0.025em", textWrap: "balance" }}>
                    {"Turning frontier AI into products people use, "}
                    <em style={{ fontStyle: "normal", color: "#3375CA" }}>
                      {"and spotting the companies that will do it next."}
                    </em>
                  </h1>
                </>
              )}
              {isG && (
                <>
                  <h1 style={{ margin: "0", fontFamily: "Arial,'Helvetica Neue',Helvetica,sans-serif", fontWeight: "700", fontSize: "clamp(38px,6.4vw,96px)", lineHeight: "1.02", letterSpacing: "-0.025em", textWrap: "balance" }}>
                    {"Product leader in AI. "}
                    <em style={{ fontStyle: "normal", color: "#3375CA" }}>
                      {"Builder, operator, investor."}
                    </em>
                  </h1>
                </>
              )}
              <p style={{ margin: "0", maxWidth: "56ch", fontSize: "clamp(17px,1.4vw,19px)", lineHeight: "1.6", color: "#475467", textWrap: "pretty", width: "555px", height: "99px" }}>
                {"I’m Meherdeep (Meher) Thakur, an AI product manager, founder, VC Investor, and former developer relations manager, now pursuing a dual-degree of an MBA and MS in AI at Columbia University. "}
              </p>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <a className="dch2" href="#work" style={{ fontSize: "15px", padding: "13px 22px", background: "#141313", color: "#FFFFFF", borderRadius: "999px" }}>
                  {"See selected work"}
                </a>
                <a className="dch3" href="https://www.linkedin.com/in/meherdeep/" target="_blank" rel="noopener" style={{ display: "inline-flex", alignItems: "center", gap: "10px", fontSize: "15px", padding: "13px 22px", border: "1px solid #D4D4D4", borderRadius: "999px" }}>
                  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" style={{ flex: "none", display: "block" }}>
                    <rect width="24" height="24" rx="4" fill="#0A66C2" />
                    <path fill="#FFFFFF" d="M7.1 9.5H4.6V19h2.5V9.5zM5.85 5A1.45 1.45 0 1 0 5.85 7.9 1.45 1.45 0 0 0 5.85 5zM19.4 13.6c0-2.6-1.4-4.3-3.7-4.3-1.3 0-2.2.7-2.6 1.4V9.5h-2.4V19h2.5v-4.8c0-1.3.4-2.4 1.8-2.4 1.4 0 1.9 1.1 1.9 2.5V19h2.5v-5.4z" />
                  </svg>
                  {"LinkedIn ↗"}
                </a>
              </div>
            </div>
            <figure style={{ margin: "0", display: "flex", flexDirection: "column", gap: "12px", maxWidth: "440px", justifySelf: "end", width: "100%" }}>
              <div style={{ position: "relative", width: "100%", aspectRatio: "1/1", borderRadius: "50%", overflow: "hidden", background: "#EBF1FA" }}>
                <img src="assets/meherdeep-thakur-headshot-cutout.png" alt="Meherdeep Thakur, AI product manager and founder, in New York" width="1000" height="1000" fetchPriority="high" decoding="async" style={{ position: "relative", width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 0%", transform: "scale(1.08)", transformOrigin: "50% 0%", display: "block" }} />
              </div>
            </figure>
          </section>
          <section aria-label="Credentials" style={{ borderTop: "1px solid #E6E6E6", borderBottom: "1px solid #E6E6E6" }}>
            <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "0 clamp(20px,4vw,48px)", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,220px),1fr))" }}>
              <div style={{ padding: "24px 24px 24px 0", display: "flex", flexDirection: "column", gap: "6px" }}>
                <span style={{ fontFamily: "Arial,'Helvetica Neue',Helvetica,sans-serif", fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#6D6D6D" }}>
                  {"Building"}
                </span>
                <span style={{ fontSize: "16px" }}>
                  {"Co-Founder & CTO, Optivoy"}
                </span>
              </div>
              <div style={{ padding: "24px 24px 24px 0", display: "flex", flexDirection: "column", gap: "6px" }}>
                <span style={{ fontFamily: "Arial,'Helvetica Neue',Helvetica,sans-serif", fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#6D6D6D" }}>
                  {"Venture Capital"}
                </span>
                <span style={{ fontSize: "16px" }}>
                  {"Venture Fellow, Laconia Capital"}
                </span>
                <span style={{ fontSize: "16px" }}>
                  {"Venture Intern, NewsBreak"}
                </span>
              </div>
              <div style={{ padding: "24px 24px 24px 0", display: "flex", flexDirection: "column", gap: "6px" }}>
                <span style={{ fontFamily: "Arial,'Helvetica Neue',Helvetica,sans-serif", fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#6D6D6D" }}>
                  {"Product"}
                </span>
                <span style={{ fontSize: "16px" }}>
                  {"PM, Conversational AI at Agora"}
                </span>
              </div>
              <div style={{ padding: "24px 24px 24px 0", display: "flex", flexDirection: "column", gap: "6px" }}>
                <span style={{ fontFamily: "Arial,'Helvetica Neue',Helvetica,sans-serif", fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#6D6D6D" }}>
                  {"Founder"}
                </span>
                <span style={{ fontSize: "16px" }}>
                  {"PayCrunch, backed by "}
                  <span style={{ color: "#F26522", fontWeight: "600" }}>
                    {"Y Combinator"}
                  </span>
                </span>
              </div>
            </div>
          </section>
          <section id="now" style={{ maxWidth: "1440px", margin: "0 auto", padding: "clamp(64px,9vw,112px) clamp(20px,4vw,48px)" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(24px,5vw,72px)" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", flex: "1 1 260px" }}>
                <span style={{ fontFamily: "Arial,'Helvetica Neue',Helvetica,sans-serif", fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#3375CA" }}>
                  {"01 · Now"}
                </span>
                <h2 style={{ margin: "0", fontFamily: "Arial,'Helvetica Neue',Helvetica,sans-serif", fontWeight: "700", fontSize: "clamp(32px,3.6vw,44px)", lineHeight: "1.1", letterSpacing: "-0.02em" }}>
                  {"What I’m working on"}
                </h2>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0", flex: "999 1 min(100%,560px)", minWidth: "0" }}>
                <a className="dch4" href="https://optivoy.ai/" target="_blank" rel="noopener" style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) auto", gap: "16px", alignItems: "start", padding: "24px 0", borderTop: "1px solid #141313" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span style={{ flex: "none", width: "44px", height: "44px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <img src="https://www.google.com/s2/favicons?domain=optivoy.ai&sz=128" alt="Optivoy logo" width="64" height="64" loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
                      </span>
                      <span style={{ fontSize: "20px", fontWeight: "500" }}>
                        {"Co-Founder & CTO, Optivoy"}
                      </span>
                    </span>
                    <span style={{ fontSize: "16px", lineHeight: "1.55", color: "#475467", maxWidth: "60ch", textWrap: "pretty" }}>
                      {"An AI-first travel booking platform that optimizes flights and hotels against your credit-card rewards and loyalty points."}
                    </span>
                  </div>
                  <span style={{ fontFamily: "Arial,'Helvetica Neue',Helvetica,sans-serif", fontSize: "13px" }}>
                    {"optivoy.ai ↗"}
                  </span>
                </a>
                <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) auto", gap: "16px", alignItems: "start", padding: "24px 0", borderTop: "1px solid #E6E6E6" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <span style={{ fontSize: "20px", fontWeight: "500" }}>
                      {"MBAxMS, Columbia University"}
                    </span>
                    <span style={{ fontSize: "16px", lineHeight: "1.55", color: "#475467", maxWidth: "60ch", textWrap: "pretty" }}>
                      {"Finance & Strategy at Columbia Business School and AI at Columbia Engineering. Active in "}
                      <span style={{ fontFamily: "-apple-system, \"system-ui\", \"Helvetica Neue\", Helvetica, Arial, sans-serif" }}>
                        {"Venture Capital, CEO Club, "}
                      </span>
                      {"Quant Markets & Trading, Technology, FinTech & Blockchain, and AI clubs."}
                    </span>
                  </div>
                  <span style={{ fontFamily: "Arial,'Helvetica Neue',Helvetica,sans-serif", fontSize: "13px", color: "#6D6D6D" }}>
                    {"2025–27"}
                  </span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) auto", gap: "16px", alignItems: "start", padding: "24px 0", borderTop: "1px solid #E6E6E6", borderBottom: "1px solid #E6E6E6" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <span style={{ fontSize: "20px", fontWeight: "500" }}>
                      {"Recruiting for Venture Capital"}
                      <br />
                    </span>
                    <span style={{ fontSize: "16px", lineHeight: "1.55", color: "#475467", maxWidth: "60ch", textWrap: "pretty" }}>
                      {"Early-stage investment with a focus on AI, FinTech, and Healthcare."}
                    </span>
                  </div>
                  <span style={{ fontFamily: "Arial,'Helvetica Neue',Helvetica,sans-serif", fontSize: "13px", color: "#6D6D6D" }}>
                    {"Ongoing"}
                  </span>
                </div>
              </div>
            </div>
          </section>
          <section id="work" style={{ background: "#141313", color: "#FFFFFF" }}>
            <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "clamp(64px,9vw,112px) clamp(20px,4vw,48px)", display: "flex", flexDirection: "column", gap: "clamp(40px,6vw,64px)" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "720px" }}>
                <span style={{ fontFamily: "Arial,'Helvetica Neue',Helvetica,sans-serif", fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#8DB4EA" }}>
                  {"02 · Selected work"}
                </span>
                <h2 style={{ margin: "0", fontFamily: "Arial,'Helvetica Neue',Helvetica,sans-serif", fontWeight: "700", fontSize: "clamp(32px,3.6vw,44px)", lineHeight: "1.1", letterSpacing: "-0.02em", textWrap: "balance" }}>
                  {"Three bets, three seats: product, founder, investor."}
                </h2>
              </div>
              <article style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,340px),1fr))", gap: "clamp(24px,4vw,56px)", paddingTop: "32px", borderTop: "1px solid #393939" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <span style={{ flex: "none", width: "44px", height: "44px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <img src="assets/logo-agora-mark.png" alt="Agora logo" width="64" height="64" loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
                    </span>
                    <span style={{ fontFamily: "Arial,'Helvetica Neue',Helvetica,sans-serif", fontSize: "12px", color: "#A3A3A3", letterSpacing: "0.04em" }}>
                      {"AGORA · PRODUCT MANAGER · 2024–25"}
                    </span>
                  </div>
                  <h3 style={{ margin: "0", fontFamily: "Arial,'Helvetica Neue',Helvetica,sans-serif", fontWeight: "700", fontSize: "clamp(26px,2.6vw,34px)", lineHeight: "1.15" }}>
                    {"Launching Agora’s Conversational AI SDK"}
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "14px", paddingTop: "6px" }}>
                    <span style={{ fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#A3A3A3" }}>
                      {"Skills in play"}
                    </span>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", maxWidth: "560px" }}>
                      <span className="dch5" style={{ fontSize: "14px", padding: "9px 16px", borderRadius: "999px", border: "1px solid #393939", color: "#E6E6E6", cursor: "default", transition: "background 200ms,border-color 200ms,color 200ms" }}>
                        {"Go-to-market strategy"}
                      </span>
                      <span className="dch6" style={{ fontSize: "14px", padding: "9px 16px", borderRadius: "999px", border: "1px solid #393939", color: "#E6E6E6", cursor: "default", transition: "background 200ms,border-color 200ms,color 200ms" }}>
                        {"Product positioning"}
                      </span>
                      <span className="dch7" style={{ fontSize: "14px", padding: "9px 16px", borderRadius: "999px", border: "1px solid #393939", color: "#E6E6E6", cursor: "default", transition: "background 200ms,border-color 200ms,color 200ms" }}>
                        {"Cross-functional leadership"}
                      </span>
                      <span className="dch8" style={{ fontSize: "14px", padding: "9px 16px", borderRadius: "999px", border: "1px solid #393939", color: "#E6E6E6", cursor: "default", transition: "background 200ms,border-color 200ms,color 200ms" }}>
                        {"Launch planning"}
                      </span>
                      <span className="dch9" style={{ fontSize: "14px", padding: "9px 16px", borderRadius: "999px", border: "1px solid #393939", color: "#E6E6E6", cursor: "default", transition: "background 200ms,border-color 200ms,color 200ms" }}>
                        {"Developer experience"}
                      </span>
                      <span className="dch10" style={{ fontSize: "14px", padding: "9px 16px", borderRadius: "999px", border: "1px solid #393939", color: "#E6E6E6", cursor: "default", transition: "background 200ms,border-color 200ms,color 200ms" }}>
                        {"Conversion optimization"}
                      </span>
                      <span className="dch11" style={{ fontSize: "14px", padding: "9px 16px", borderRadius: "999px", border: "1px solid #393939", color: "#E6E6E6", cursor: "default", transition: "background 200ms,border-color 200ms,color 200ms" }}>
                        {"Conversational AI"}
                      </span>
                    </div>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: "1px", background: "#393939", alignSelf: "start" }}>
                  <div style={{ background: "#141313", padding: "20px 20px 20px 0", display: "flex", flexDirection: "column", gap: "6px" }}>
                    <span style={{ fontFamily: "Arial,'Helvetica Neue',Helvetica,sans-serif", fontWeight: "700", fontSize: "clamp(30px,4.2vw,44px)", lineHeight: "1", overflowWrap: "anywhere" }}>
                      {"+18%"}
                    </span>
                    <span style={{ fontSize: "14px", color: "#A3A3A3" }}>
                      {"sign-up rate"}
                    </span>
                  </div>
                  <div style={{ background: "#141313", padding: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
                    <span style={{ fontFamily: "Arial,'Helvetica Neue',Helvetica,sans-serif", fontWeight: "700", fontSize: "clamp(30px,4.2vw,44px)", lineHeight: "1", overflowWrap: "anywhere" }}>
                      {"+22%"}
                    </span>
                    <span style={{ fontSize: "14px", color: "#A3A3A3" }}>
                      {"page visits"}
                    </span>
                  </div>
                  <div style={{ background: "#141313", padding: "20px 20px 20px 0", display: "flex", flexDirection: "column", gap: "6px" }}>
                    <span style={{ fontFamily: "Arial,'Helvetica Neue',Helvetica,sans-serif", fontWeight: "700", fontSize: "clamp(30px,4.2vw,44px)", lineHeight: "1", overflowWrap: "anywhere" }}>
                      {"−30%"}
                    </span>
                    <span style={{ fontSize: "14px", color: "#A3A3A3" }}>
                      {"time to sign up"}
                    </span>
                  </div>
                  <div style={{ background: "#141313", padding: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
                    <span style={{ fontFamily: "Arial,'Helvetica Neue',Helvetica,sans-serif", fontWeight: "700", fontSize: "clamp(30px,4.2vw,44px)", lineHeight: "1", overflowWrap: "anywhere" }}>
                      {"$6M"}
                    </span>
                    <span style={{ fontSize: "14px", color: "#A3A3A3" }}>
                      {"new revenue from the low-code UIKit"}
                    </span>
                  </div>
                </div>
              </article>
              <article style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,340px),1fr))", gap: "clamp(24px,4vw,56px)", paddingTop: "32px", borderTop: "1px solid #393939" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <span style={{ flex: "none", width: "44px", height: "44px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <img src="assets/logo-paycrunch-mark.png" alt="PayCrunch logo" width="64" height="64" loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
                    </span>
                    <span style={{ fontFamily: "Arial,'Helvetica Neue',Helvetica,sans-serif", fontSize: "12px", color: "#A3A3A3", letterSpacing: "0.04em" }}>
                      {"PAYCRUNCH · CO-FOUNDER & CTO · 2020–22"}
                    </span>
                  </div>
                  <h3 style={{ margin: "0", fontFamily: "Arial,'Helvetica Neue',Helvetica,sans-serif", fontWeight: "700", fontSize: "clamp(26px,2.6vw,34px)", lineHeight: "1.15" }}>
                    {"From zero to 10K users: a Gen Z credit builder"}
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "14px", paddingTop: "6px" }}>
                    <span style={{ fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#A3A3A3" }}>
                      {"Skills in play"}
                    </span>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", maxWidth: "560px" }}>
                      <span className="dch12" style={{ fontSize: "14px", padding: "9px 16px", borderRadius: "999px", border: "1px solid #393939", color: "#E6E6E6", cursor: "default", transition: "background 200ms,border-color 200ms,color 200ms" }}>
                        {"0 → 1 product building"}
                      </span>
                      <span className="dch13" style={{ fontSize: "14px", padding: "9px 16px", borderRadius: "999px", border: "1px solid #393939", color: "#E6E6E6", cursor: "default", transition: "background 200ms,border-color 200ms,color 200ms" }}>
                        {"Fundraising"}
                      </span>
                      <span className="dch14" style={{ fontSize: "14px", padding: "9px 16px", borderRadius: "999px", border: "1px solid #393939", color: "#E6E6E6", cursor: "default", transition: "background 200ms,border-color 200ms,color 200ms" }}>
                        {"Engineering leadership"}
                      </span>
                      <span className="dch15" style={{ fontSize: "14px", padding: "9px 16px", borderRadius: "999px", border: "1px solid #393939", color: "#E6E6E6", cursor: "default", transition: "background 200ms,border-color 200ms,color 200ms" }}>
                        {"Risk & fraud modeling"}
                      </span>
                      <span className="dch16" style={{ fontSize: "14px", padding: "9px 16px", borderRadius: "999px", border: "1px solid #393939", color: "#E6E6E6", cursor: "default", transition: "background 200ms,border-color 200ms,color 200ms" }}>
                        {"Python · SQL"}
                      </span>
                      <span className="dch17" style={{ fontSize: "14px", padding: "9px 16px", borderRadius: "999px", border: "1px solid #393939", color: "#E6E6E6", cursor: "default", transition: "background 200ms,border-color 200ms,color 200ms" }}>
                        {"Bank partnerships"}
                      </span>
                      <span className="dch18" style={{ fontSize: "14px", padding: "9px 16px", borderRadius: "999px", border: "1px solid #393939", color: "#E6E6E6", cursor: "default", transition: "background 200ms,border-color 200ms,color 200ms" }}>
                        {"Growth & community"}
                      </span>
                    </div>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: "1px", background: "#393939", alignSelf: "start" }}>
                  <div style={{ background: "#141313", padding: "20px 20px 20px 0", display: "flex", flexDirection: "column", gap: "6px" }}>
                    <span style={{ fontFamily: "Arial,'Helvetica Neue',Helvetica,sans-serif", fontWeight: "700", fontSize: "clamp(30px,4.2vw,44px)", lineHeight: "1", overflowWrap: "anywhere" }}>
                      {"$500K"}
                    </span>
                    <span style={{ fontSize: "14px", color: "#A3A3A3" }}>
                      {"raised from Y Combinator"}
                    </span>
                  </div>
                  <div style={{ background: "#141313", padding: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
                    <span style={{ fontFamily: "Arial,'Helvetica Neue',Helvetica,sans-serif", fontWeight: "700", fontSize: "clamp(30px,4.2vw,44px)", lineHeight: "1", overflowWrap: "anywhere" }}>
                      {"10K+"}
                    </span>
                    <span style={{ fontSize: "14px", color: "#A3A3A3" }}>
                      {"users in two months"}
                    </span>
                  </div>
                  <div style={{ background: "#141313", padding: "20px 20px 20px 0", display: "flex", flexDirection: "column", gap: "6px" }}>
                    <span style={{ fontFamily: "Arial,'Helvetica Neue',Helvetica,sans-serif", fontWeight: "700", fontSize: "clamp(30px,4.2vw,44px)", lineHeight: "1", overflowWrap: "anywhere" }}>
                      {"$10M+"}
                    </span>
                    <span style={{ fontSize: "14px", color: "#A3A3A3" }}>
                      {"speculative losses cut by risk models"}
                    </span>
                  </div>
                  <div style={{ background: "#141313", padding: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
                    <span style={{ fontFamily: "Arial,'Helvetica Neue',Helvetica,sans-serif", fontWeight: "700", fontSize: "clamp(30px,4.2vw,44px)", lineHeight: "1", overflowWrap: "anywhere" }}>
                      {"+60%"}
                    </span>
                    <span style={{ fontSize: "14px", color: "#A3A3A3" }}>
                      {"users from 57 campus creators & ambassadors"}
                    </span>
                  </div>
                </div>
              </article>
              <article style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,340px),1fr))", gap: "clamp(24px,4vw,56px)", paddingTop: "32px", borderTop: "1px solid #393939" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <span style={{ flex: "none", width: "44px", height: "44px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <img src="https://www.google.com/s2/favicons?domain=newsbreak.com&sz=128" alt="NewsBreak logo" width="64" height="64" loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
                    </span>
                    <span style={{ fontFamily: "Arial,'Helvetica Neue',Helvetica,sans-serif", fontSize: "12px", color: "#A3A3A3", letterSpacing: "0.04em" }}>
                      {"NEWSBREAK · VENTURE INTERN · SUMMER 2026"}
                    </span>
                  </div>
                  <h3 style={{ margin: "0", fontFamily: "Arial,'Helvetica Neue',Helvetica,sans-serif", fontWeight: "700", fontSize: "clamp(26px,2.6vw,34px)", lineHeight: "1.15" }}>
                    {"Spotting a new venture and incubating it: ClipCues"}
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "14px", paddingTop: "6px" }}>
                    <span style={{ fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#A3A3A3" }}>
                      {"Skills in play"}
                    </span>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", maxWidth: "560px" }}>
                      <span className="dch19" style={{ fontSize: "14px", padding: "9px 16px", borderRadius: "999px", border: "1px solid #393939", color: "#E6E6E6", cursor: "default", transition: "background 200ms,border-color 200ms,color 200ms" }}>
                        {"Opportunity sizing"}
                      </span>
                      <span className="dch20" style={{ fontSize: "14px", padding: "9px 16px", borderRadius: "999px", border: "1px solid #393939", color: "#E6E6E6", cursor: "default", transition: "background 200ms,border-color 200ms,color 200ms" }}>
                        {"Venture incubation"}
                      </span>
                      <span className="dch21" style={{ fontSize: "14px", padding: "9px 16px", borderRadius: "999px", border: "1px solid #393939", color: "#E6E6E6", cursor: "default", transition: "background 200ms,border-color 200ms,color 200ms" }}>
                        {"Vendor diligence"}
                      </span>
                      <span className="dch22" style={{ fontSize: "14px", padding: "9px 16px", borderRadius: "999px", border: "1px solid #393939", color: "#E6E6E6", cursor: "default", transition: "background 200ms,border-color 200ms,color 200ms" }}>
                        {"Pricing strategy"}
                      </span>
                      <span className="dch23" style={{ fontSize: "14px", padding: "9px 16px", borderRadius: "999px", border: "1px solid #393939", color: "#E6E6E6", cursor: "default", transition: "background 200ms,border-color 200ms,color 200ms" }}>
                        {"AI data pipelines"}
                      </span>
                      <span className="dch24" style={{ fontSize: "14px", padding: "9px 16px", borderRadius: "999px", border: "1px solid #393939", color: "#E6E6E6", cursor: "default", transition: "background 200ms,border-color 200ms,color 200ms" }}>
                        {"Analytics product"}
                      </span>
                      <span className="dch25" style={{ fontSize: "14px", padding: "9px 16px", borderRadius: "999px", border: "1px solid #393939", color: "#E6E6E6", cursor: "default", transition: "background 200ms,border-color 200ms,color 200ms" }}>
                        {"Pilot to commercial"}
                      </span>
                    </div>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: "1px", background: "#393939", alignSelf: "start" }}>
                  <div style={{ background: "#141313", padding: "20px 20px 20px 0", display: "flex", flexDirection: "column", gap: "6px" }}>
                    <span style={{ fontFamily: "Arial,'Helvetica Neue',Helvetica,sans-serif", fontWeight: "700", fontSize: "clamp(30px,4.2vw,44px)", lineHeight: "1", overflowWrap: "anywhere" }}>
                      {"400+"}
                    </span>
                    <span style={{ fontSize: "14px", color: "#A3A3A3" }}>
                      {"creators across 3 pilot brands"}
                    </span>
                  </div>
                  <div style={{ background: "#141313", padding: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
                    <span style={{ fontFamily: "Arial,'Helvetica Neue',Helvetica,sans-serif", fontWeight: "700", fontSize: "clamp(30px,4.2vw,44px)", lineHeight: "1", overflowWrap: "anywhere" }}>
                      {"4×"}
                    </span>
                    <span style={{ fontSize: "14px", color: "#A3A3A3" }}>
                      {"creative variants per campaign"}
                    </span>
                  </div>
                  <div style={{ background: "#141313", padding: "20px 20px 20px 0", display: "flex", flexDirection: "column", gap: "6px" }}>
                    <span style={{ fontFamily: "Arial,'Helvetica Neue',Helvetica,sans-serif", fontWeight: "700", fontSize: "clamp(30px,4.2vw,44px)", lineHeight: "1", overflowWrap: "anywhere" }}>
                      {"65%"}
                    </span>
                    <span style={{ fontSize: "14px", color: "#A3A3A3" }}>
                      {"gross margin held"}
                    </span>
                  </div>
                  <div style={{ background: "#141313", padding: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
                    <span style={{ fontFamily: "Arial,'Helvetica Neue',Helvetica,sans-serif", fontWeight: "700", fontSize: "clamp(30px,4.2vw,44px)", lineHeight: "1", overflowWrap: "anywhere" }}>
                      {"3d → min"}
                    </span>
                    <span style={{ fontSize: "14px", color: "#A3A3A3" }}>
                      {"campaign reconciliation time"}
                    </span>
                  </div>
                </div>
              </article>
            </div>
          </section>
          <section id="experience" style={{ maxWidth: "1440px", margin: "0 auto", padding: "clamp(64px,9vw,112px) clamp(20px,4vw,48px)" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(24px,5vw,72px)" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", flex: "1 1 260px" }}>
                <span style={{ fontFamily: "Arial,'Helvetica Neue',Helvetica,sans-serif", fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#3375CA" }}>
                  {"03 · Track record"}
                </span>
                <h2 style={{ margin: "0", fontFamily: "Arial,'Helvetica Neue',Helvetica,sans-serif", fontWeight: "700", fontSize: "clamp(32px,3.6vw,44px)", lineHeight: "1.1", letterSpacing: "-0.02em" }}>
                  {"Experience"}
                </h2>
              </div>
              <ol style={{ listStyle: "none", margin: "0", padding: "0", flex: "999 1 min(100%,560px)", minWidth: "0", display: "flex", flexDirection: "column" }}>
                <li style={{ display: "flex", flexWrap: "wrap", gap: "8px 24px", padding: "20px 0", borderTop: "1px solid #141313" }}>
                  <span style={{ flex: "0 0 150px", fontFamily: "Arial,'Helvetica Neue',Helvetica,sans-serif", fontSize: "13px", color: "#6D6D6D", paddingTop: "3px" }}>
                    {"2026 to Now"}
                  </span>
                  <div style={{ display: "flex", gap: "16px", alignItems: "flex-start", flex: "1 1 280px", minWidth: "0" }}>
                    <span style={{ flex: "none", width: "44px", height: "44px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <img src="https://www.google.com/s2/favicons?domain=optivoy.ai&sz=128" alt="Optivoy logo" width="64" height="64" loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
                    </span>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <span style={{ fontSize: "18px", fontWeight: "500" }}>
                        {"Optivoy"}
                      </span>
                      <span style={{ fontSize: "15px", color: "#475467" }}>
                        {"Co-Founder & CTO"}
                      </span>
                    </div>
                  </div>
                </li>
                <li style={{ display: "flex", flexWrap: "wrap", gap: "8px 24px", padding: "20px 0", borderTop: "1px solid #E6E6E6" }}>
                  <span style={{ flex: "0 0 150px", fontFamily: "Arial,'Helvetica Neue',Helvetica,sans-serif", fontSize: "13px", color: "#6D6D6D", paddingTop: "3px" }}>
                    {"2026"}
                  </span>
                  <div style={{ display: "flex", gap: "16px", alignItems: "flex-start", flex: "1 1 280px", minWidth: "0" }}>
                    <span style={{ flex: "none", width: "44px", height: "44px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <img src="assets/logo-laconia-symbol.png" alt="Laconia Capital logo" width="64" height="64" loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
                    </span>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <span style={{ fontSize: "18px", fontWeight: "500" }}>
                        {"Laconia Capital"}
                      </span>
                      <span style={{ fontSize: "15px", color: "#475467" }}>
                        {"Venture Fellow · New York, NY"}
                      </span>
                    </div>
                  </div>
                </li>
                <li style={{ display: "flex", flexWrap: "wrap", gap: "8px 24px", padding: "20px 0", borderTop: "1px solid #E6E6E6" }}>
                  <span style={{ flex: "0 0 150px", fontFamily: "Arial,'Helvetica Neue',Helvetica,sans-serif", fontSize: "13px", color: "#6D6D6D", paddingTop: "3px" }}>
                    {"May to Aug 2026"}
                  </span>
                  <div style={{ display: "flex", gap: "16px", alignItems: "flex-start", flex: "1 1 280px", minWidth: "0" }}>
                    <span style={{ flex: "none", width: "44px", height: "44px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <img src="https://www.google.com/s2/favicons?domain=newsbreak.com&sz=128" alt="NewsBreak logo" width="64" height="64" loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
                    </span>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <span style={{ fontSize: "18px", fontWeight: "500" }}>
                        {"NewsBreak"}
                      </span>
                      <span style={{ fontSize: "15px", color: "#475467" }}>
                        {"Venture Intern · Mountain View, CA"}
                      </span>
                    </div>
                  </div>
                </li>
                <li style={{ display: "flex", flexWrap: "wrap", gap: "8px 24px", padding: "20px 0", borderTop: "1px solid #E6E6E6" }}>
                  <span style={{ flex: "0 0 150px", fontFamily: "Arial,'Helvetica Neue',Helvetica,sans-serif", fontSize: "13px", color: "#6D6D6D", paddingTop: "3px" }}>
                    {"2019 to 2025"}
                  </span>
                  <div style={{ display: "flex", gap: "16px", alignItems: "flex-start", flex: "1 1 280px", minWidth: "0" }}>
                    <span style={{ flex: "none", width: "44px", height: "44px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <img src="assets/logo-agora-mark.png" alt="Agora logo" width="64" height="64" loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
                    </span>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <span style={{ fontSize: "18px", fontWeight: "500" }}>
                        {"Agora"}
                      </span>
                      <span style={{ fontSize: "15px", color: "#475467", lineHeight: "1.5" }}>
                        {"Product Manager (2024–25) · Developer Relations (2021–25) · SDE Intern (2019–21)"}
                      </span>
                    </div>
                  </div>
                </li>
                <li style={{ display: "flex", flexWrap: "wrap", gap: "8px 24px", padding: "20px 0", borderTop: "1px solid #E6E6E6", borderBottom: "1px solid #E6E6E6" }}>
                  <span style={{ flex: "0 0 150px", fontFamily: "Arial,'Helvetica Neue',Helvetica,sans-serif", fontSize: "13px", color: "#6D6D6D", paddingTop: "3px" }}>
                    {"2020 to 2022"}
                  </span>
                  <div style={{ display: "flex", gap: "16px", alignItems: "flex-start", flex: "1 1 280px", minWidth: "0" }}>
                    <span style={{ flex: "none", width: "44px", height: "44px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <img src="assets/logo-paycrunch-mark.png" alt="PayCrunch logo" width="64" height="64" loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
                    </span>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <span style={{ fontSize: "18px", fontWeight: "500" }}>
                        {"PayCrunch "}
                        <span style={{ fontFamily: "Arial,'Helvetica Neue',Helvetica,sans-serif", fontSize: "11px", fontWeight: "400", padding: "2px 6px", border: "1px solid #F26522", color: "#F26522", fontWeight: "600", borderRadius: "3px", marginLeft: "6px", verticalAlign: "middle" }}>
                          {"YC"}
                        </span>
                      </span>
                      <span style={{ fontSize: "15px", color: "#475467" }}>
                        {"Co-Founder & CTO · Bangalore"}
                      </span>
                    </div>
                  </div>
                </li>
              </ol>
            </div>
          </section>
          <section id="investing" style={{ background: "#F8F8F8", borderTop: "1px solid #E6E6E6", borderBottom: "1px solid #E6E6E6" }}>
            <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "clamp(64px,9vw,112px) clamp(20px,4vw,48px)", display: "flex", flexDirection: "column", gap: "clamp(36px,5vw,56px)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,360px),1fr))", gap: "24px clamp(24px,5vw,72px)", alignItems: "end" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <span style={{ fontFamily: "Arial,'Helvetica Neue',Helvetica,sans-serif", fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#3375CA" }}>
                    {"04 · Investing"}
                  </span>
                  <h2 style={{ margin: "0", fontFamily: "Arial,'Helvetica Neue',Helvetica,sans-serif", fontWeight: "700", fontSize: "clamp(32px,3.6vw,44px)", lineHeight: "1.1", letterSpacing: "-0.02em", textWrap: "balance" }}>
                    {"Investment theses"}
                  </h2>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,300px),1fr))", gap: "20px" }}>
                <article style={{ background: "#FFFFFF", border: "1px solid #E6E6E6", borderRadius: "4px", padding: "28px", display: "flex", flexDirection: "column", gap: "14px" }}>
                  <span style={{ fontFamily: "Arial,'Helvetica Neue',Helvetica,sans-serif", fontSize: "12px", color: "#6D6D6D" }}>
                    {"Thesis 01 · Infra"}
                  </span>
                  <h3 style={{ margin: "0", fontFamily: "Arial,'Helvetica Neue',Helvetica,sans-serif", fontWeight: "700", fontSize: "26px", lineHeight: "1.2" }}>
                    {"Voice becomes the default interface for AI agents"}
                  </h3>
                  <p style={{ margin: "0", fontSize: "15px", lineHeight: "1.6", color: "#475467", textWrap: "pretty" }}>
                    {"Real-time, interruptible voice turns agents into coworkers instead of chatbots. Value will go to the latency, orchestration and vertical-workflow layers, not to thin wrappers."}
                  </p>
                </article>
                <article style={{ background: "#FFFFFF", border: "1px solid #E6E6E6", borderRadius: "4px", padding: "28px", display: "flex", flexDirection: "column", gap: "14px" }}>
                  <span style={{ fontFamily: "Arial,'Helvetica Neue',Helvetica,sans-serif", fontSize: "12px", color: "#6D6D6D" }}>
                    {"Thesis 02 · Marketing"}
                  </span>
                  <h3 style={{ margin: "0", fontFamily: "Arial,'Helvetica Neue',Helvetica,sans-serif", fontWeight: "700", fontSize: "26px", lineHeight: "1.2" }}>
                    {"AI-native creators are the new performance channel"}
                  </h3>
                  <p style={{ margin: "0", fontSize: "15px", lineHeight: "1.6", color: "#475467", textWrap: "pretty" }}>
                    {"When making a creative costs almost nothing, the advantage shifts to how fast you can iterate and how well you can measure. Tooling that connects creator output to spend data across platforms is still mostly unbuilt."}
                  </p>
                </article>
                <article style={{ background: "#FFFFFF", border: "1px solid #E6E6E6", borderRadius: "4px", padding: "28px", display: "flex", flexDirection: "column", gap: "14px" }}>
                  <span style={{ fontFamily: "Arial,'Helvetica Neue',Helvetica,sans-serif", fontSize: "12px", color: "#6D6D6D" }}>
                    {"Thesis 03 · FinTech"}
                  </span>
                  <h3 style={{ margin: "0", fontFamily: "Arial,'Helvetica Neue',Helvetica,sans-serif", fontWeight: "700", fontSize: "26px", lineHeight: "1.2" }}>
                    {"Behavioral data will underwrite the next generation of borrowers"}
                  </h3>
                  <p style={{ margin: "0", fontSize: "15px", lineHeight: "1.6", color: "#475467", textWrap: "pretty" }}>
                    {"Gen Z and thin-file consumers fall outside traditional credit scoring. LLM-assisted underwriting that uses behavioral signals can open up this market without blowing up loss rates."}
                  </p>
                </article>
              </div>
            </div>
          </section>
          <section id="capabilities" style={{ maxWidth: "1440px", margin: "0 auto", padding: "clamp(64px,9vw,112px) clamp(20px,4vw,48px)", display: "flex", flexDirection: "column", gap: "40px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <span style={{ fontFamily: "Arial,'Helvetica Neue',Helvetica,sans-serif", fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#3375CA" }}>
                {"05 · Capabilities"}
              </span>
              <h2 style={{ margin: "0", fontFamily: "Arial,'Helvetica Neue',Helvetica,sans-serif", fontWeight: "700", fontSize: "clamp(32px,3.6vw,44px)", lineHeight: "1.1", letterSpacing: "-0.02em" }}>
                {"What I bring to a team"}
              </h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,260px),1fr))", gap: "32px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", paddingTop: "20px", borderTop: "1px solid #141313" }}>
                <h3 style={{ margin: "0", fontSize: "17px", fontWeight: "600" }}>
                  {"Product & GTM"}
                </h3>
                <p style={{ margin: "0", fontSize: "15px", lineHeight: "1.7", color: "#475467" }}>
                  {"Roadmapping · PRDs · Customer research · Pricing & monetization · Launch strategy · KPIs/OKRs · Jira, Confluence, Figma"}
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", paddingTop: "20px", borderTop: "1px solid #141313" }}>
                <h3 style={{ margin: "0", fontSize: "17px", fontWeight: "600" }}>
                  {"AI & Engineering"}
                </h3>
                <p style={{ margin: "0", fontSize: "15px", lineHeight: "1.7", color: "#475467" }}>
                  {"LLM pipelines & agents · Python, R · Flutter, Kotlin, Java · JS/React · AWS, GCP · BigQuery, SQL"}
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", paddingTop: "20px", borderTop: "1px solid #141313" }}>
                <h3 style={{ margin: "0", fontSize: "17px", fontWeight: "600" }}>
                  {"Venture & Finance"}
                </h3>
                <p style={{ margin: "0", fontSize: "15px", lineHeight: "1.7", color: "#475467" }}>
                  {"Market sizing · Opportunity assessment · Financial modeling · Unit economics · Risk & underwriting · Due Diligence"}
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", paddingTop: "20px", borderTop: "1px solid #141313" }}>
                <h3 style={{ margin: "0", fontSize: "17px", fontWeight: "600" }}>
                  {"Developer Evangelism"}
                </h3>
                <p style={{ margin: "0", fontSize: "15px", lineHeight: "1.7", color: "#475467" }}>
                  {"Technical storytelling · Conference talks · Tutorials & docs · Community building · "}
                  <a href="https://medium.com/@meherdeept" target="_blank" rel="noopener" style={{ textDecoration: "underline", textUnderlineOffset: "3px" }}>
                    {"Writing on Medium ↗"}
                  </a>
                </p>
              </div>
            </div>
          </section>
          <section id="education" ref={eduRef} style={{ borderTop: "1px solid #E6E6E6", height: `${eduH}`, position: "relative" }}>
            <div ref={eduInner} style={{ position: `${eduPos}`, top: "var(--hdr,64px)", minHeight: "calc(100vh - var(--hdr,64px))", boxSizing: "border-box", maxWidth: "1440px", margin: "0 auto", padding: "clamp(32px,5vh,64px) clamp(20px,4vw,48px)", display: "flex", flexDirection: "column", justifyContent: "center", gap: "clamp(20px,3vh,36px)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: "24px", flexWrap: "wrap" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <span style={{ fontFamily: "Arial,'Helvetica Neue',Helvetica,sans-serif", fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#3375CA" }}>
                    {"06 · Education"}
                  </span>
                  <h2 style={{ margin: "0", fontFamily: "Arial,'Helvetica Neue',Helvetica,sans-serif", fontWeight: "700", fontSize: "clamp(32px,3.6vw,44px)", lineHeight: "1.1", letterSpacing: "-0.02em" }}>
                    {"Education"}
                    <br />
                  </h2>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <span style={{ fontSize: "14px", color: "#6D6D6D", fontVariantNumeric: "tabular-nums" }}>
                    {eduCounter}
                  </span>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button className="dch26" type="button" onClick={eduPrev} aria-label="Previous school" style={{ width: "44px", height: "44px", borderRadius: "50%", border: "1px solid #141313", background: "#FFFFFF", color: "#141313", fontSize: "18px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {"←"}
                    </button>
                    <button className="dch27" type="button" onClick={eduNext} aria-label="Next school" style={{ width: "44px", height: "44px", borderRadius: "50%", border: "1px solid #141313", background: "#FFFFFF", color: "#141313", fontSize: "18px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {"→"}
                    </button>
                  </div>
                </div>
              </div>
              <div role="tablist" style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <button type="button" onClick={go0} aria-label="Show Columbia Business School" style={{ fontFamily: "Arial,'Helvetica Neue',Helvetica,sans-serif", fontSize: "14px", fontWeight: "700", padding: "10px 16px", borderRadius: "999px", border: `1px solid ${tabBorder0}`, background: `${tabBg0}`, color: `${tabFg0}`, cursor: "pointer" }}>
                  {"Columbia Business School"}
                </button>
                <button type="button" onClick={go1} aria-label="Show Columbia Engineering" style={{ fontFamily: "Arial,'Helvetica Neue',Helvetica,sans-serif", fontSize: "14px", fontWeight: "700", padding: "10px 16px", borderRadius: "999px", border: `1px solid ${tabBorder1}`, background: `${tabBg1}`, color: `${tabFg1}`, cursor: "pointer" }}>
                  {"Columbia Engineering"}
                </button>
                <button type="button" onClick={go2} aria-label="Show VIT" style={{ fontFamily: "Arial,'Helvetica Neue',Helvetica,sans-serif", fontSize: "14px", fontWeight: "700", padding: "10px 16px", borderRadius: "999px", border: `1px solid ${tabBorder2}`, background: `${tabBg2}`, color: `${tabFg2}`, cursor: "pointer" }}>
                  {"VIT"}
                </button>
              </div>
              <div style={{ overflow: "hidden" }} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
                <div style={{ display: "flex", transition: "transform 500ms cubic-bezier(.2,.7,.2,1)", transform: `translateX(${eduOffset})` }}>
                  <article data-screen-label="Education 01" style={{ flex: "0 0 100%", minWidth: "0", boxSizing: "border-box", paddingRight: "2px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,380px),1fr))", gap: "clamp(24px,4vw,56px)", alignItems: "start" }}>
                    <figure style={{ margin: "0", display: "flex", flexDirection: "column", gap: "10px" }}>
                      <div style={{ position: "relative", aspectRatio: "4/3", maxHeight: "44vh", width: "100%", borderRadius: "16px", overflow: "hidden", background: "#EBF1FA" }}>
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/David_Geffen_Hall_-_Columbia_Business_School_(52009919930).jpg?width=1400" alt="David Geffen Hall, Columbia Business School" width="1400" height="1050" loading="lazy" decoding="async" style={{ position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                        <div style={{ position: "absolute", left: "16px", bottom: "16px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                          <span style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.06em", textTransform: "uppercase", padding: "7px 12px", borderRadius: "999px", background: "#FFFFFF", color: "#141313" }}>
                            {"New York, NY"}
                          </span>
                        </div>
                      </div>
                    </figure>
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px", minWidth: "0" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <span style={{ fontSize: "13px", color: "#6D6D6D" }}>
                          {"2025 to 2027"}
                        </span>
                        <h3 style={{ margin: "0", fontFamily: "Arial,'Helvetica Neue',Helvetica,sans-serif", fontWeight: "700", fontSize: "clamp(26px,2.8vw,36px)", lineHeight: "1.1", letterSpacing: "-0.02em" }}>
                          {"Columbia Business School"}
                        </h3>
                        <span style={{ fontSize: "16px", color: "#475467" }}>
                          {"MBA, Finance & Strategy"}
                        </span>
                      </div>
                      <ul style={{ listStyle: "none", margin: "0", padding: "0", display: "flex", flexDirection: "column" }}>
                        <li style={{ display: "flex", flexDirection: "column", gap: "4px", padding: "16px 0", borderTop: "1px solid #E6E6E6" }}>
                          <span style={{ fontSize: "12px", letterSpacing: "0.06em", textTransform: "uppercase", color: "#3375CA", fontWeight: "700" }}>
                            {"Founder"}
                          </span>
                          <span style={{ fontSize: "18px", fontWeight: "700", color: "#141313" }}>
                            {"Founders & Builders Club"}
                          </span>
                          <span style={{ fontSize: "15px", lineHeight: "1.55", color: "#475467", textWrap: "pretty" }}>
                            {"A community of 100+ entrepreneurs across the CBS network."}
                          </span>
                        </li>
                        <li style={{ display: "flex", flexDirection: "column", gap: "4px", padding: "16px 0", borderTop: "1px solid #E6E6E6" }}>
                          <span style={{ fontSize: "12px", letterSpacing: "0.06em", textTransform: "uppercase", color: "#3375CA", fontWeight: "700" }}>
                            {"President"}
                          </span>
                          <span style={{ fontSize: "18px", fontWeight: "700", color: "#141313" }}>
                            {"Quantitative Markets & Trading Club"}
                          </span>
                        </li>
                        <li style={{ display: "flex", flexDirection: "column", gap: "4px", padding: "16px 0", borderTop: "1px solid #E6E6E6" }}>
                          <span style={{ fontSize: "12px", letterSpacing: "0.06em", textTransform: "uppercase", color: "#3375CA", fontWeight: "700" }}>
                            {"Cohort"}
                          </span>
                          <span style={{ fontSize: "18px", fontWeight: "700", color: "#141313" }}>
                            {"Cluster Y"}
                          </span>
                        </li>
                      </ul>
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        <span style={{ fontSize: "12px", letterSpacing: "0.06em", textTransform: "uppercase", color: "#6D6D6D", fontWeight: "700" }}>
                          {"Also a member of"}
                        </span>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                          <span style={{ fontSize: "13px", padding: "6px 12px", border: "1px solid #D4D4D4", borderRadius: "999px", color: "#404040", background: "#FFFFFF" }}>
                            {"Venture Capital Club"}
                          </span>
                          <span style={{ fontSize: "13px", padding: "6px 12px", border: "1px solid #D4D4D4", borderRadius: "999px", color: "#404040", background: "#FFFFFF" }}>
                            {"Private Equity Club"}
                          </span>
                          <span style={{ fontSize: "13px", padding: "6px 12px", border: "1px solid #D4D4D4", borderRadius: "999px", color: "#404040", background: "#FFFFFF" }}>
                            {"Artificial Intelligence Club"}
                          </span>
                          <span style={{ fontSize: "13px", padding: "6px 12px", border: "1px solid #D4D4D4", borderRadius: "999px", color: "#404040", background: "#FFFFFF" }}>
                            {"Technology Club"}
                          </span>
                          <span style={{ fontSize: "13px", padding: "6px 12px", border: "1px solid #D4D4D4", borderRadius: "999px", color: "#404040", background: "#FFFFFF" }}>
                            {"FinTech Club"}
                          </span>
                          <span style={{ fontSize: "13px", padding: "6px 12px", border: "1px solid #D4D4D4", borderRadius: "999px", color: "#404040", background: "#FFFFFF" }}>
                            {"CEO Club"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                  <article data-screen-label="Education 02" style={{ flex: "0 0 100%", minWidth: "0", boxSizing: "border-box", paddingRight: "2px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,380px),1fr))", gap: "clamp(24px,4vw,56px)", alignItems: "start" }}>
                    <figure style={{ margin: "0", display: "flex", flexDirection: "column", gap: "10px" }}>
                      <div style={{ position: "relative", aspectRatio: "4/3", maxHeight: "44vh", width: "100%", borderRadius: "16px", overflow: "hidden", background: "#EBF1FA" }}>
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Columbia_University_-_Low_Memorial_Library_(48170370506).jpg?width=1400" alt="Low Memorial Library, Columbia University" width="1400" height="1050" loading="lazy" decoding="async" style={{ position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                        <div style={{ position: "absolute", left: "16px", bottom: "16px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                          <span style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.06em", textTransform: "uppercase", padding: "7px 12px", borderRadius: "999px", background: "#FFFFFF", color: "#141313" }}>
                            {"New York, NY"}
                          </span>
                        </div>
                      </div>
                    </figure>
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px", minWidth: "0" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <span style={{ fontSize: "13px", color: "#6D6D6D" }}>
                          {"2025 to 2027"}
                        </span>
                        <h3 style={{ margin: "0", fontFamily: "Arial,'Helvetica Neue',Helvetica,sans-serif", fontWeight: "700", fontSize: "clamp(26px,2.8vw,36px)", lineHeight: "1.1", letterSpacing: "-0.02em" }}>
                          {"Columbia Engineering"}
                        </h3>
                        <span style={{ fontSize: "16px", color: "#475467" }}>
                          {"MS, Artificial Intelligence"}
                        </span>
                      </div>
                      <ul style={{ listStyle: "none", margin: "0", padding: "0", display: "flex", flexDirection: "column" }}>
                        <li style={{ display: "flex", flexDirection: "column", gap: "4px", padding: "16px 0", borderTop: "1px solid #E6E6E6" }}>
                          <span style={{ fontSize: "12px", letterSpacing: "0.06em", textTransform: "uppercase", color: "#3375CA", fontWeight: "700" }}>
                            {"Lead"}
                          </span>
                          <span style={{ fontSize: "18px", fontWeight: "700", color: "#141313" }}>
                            {"Quantitative Markets Club"}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </article>
                  <article data-screen-label="Education 03" style={{ flex: "0 0 100%", minWidth: "0", boxSizing: "border-box", paddingRight: "2px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,380px),1fr))", gap: "clamp(24px,4vw,56px)", alignItems: "start" }}>
                    <figure style={{ margin: "0", display: "flex", flexDirection: "column", gap: "10px" }}>
                      <div style={{ position: "relative", aspectRatio: "4/3", maxHeight: "44vh", width: "100%", borderRadius: "16px", overflow: "hidden", background: "#EBF1FA" }}>
                        <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Technology_Tower(VIT).jpg?width=1400" alt="Technology Tower, Vellore Institute of Technology" width="1400" height="1050" loading="lazy" decoding="async" style={{ position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                        <div style={{ position: "absolute", left: "16px", bottom: "16px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                          <span style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.06em", textTransform: "uppercase", padding: "7px 12px", borderRadius: "999px", background: "#FFFFFF", color: "#141313" }}>
                            {"Vellore, India"}
                          </span>
                        </div>
                      </div>
                    </figure>
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px", minWidth: "0" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <span style={{ fontSize: "13px", color: "#6D6D6D" }}>
                          {"2017 to 2021"}
                        </span>
                        <h3 style={{ margin: "0", fontFamily: "Arial,'Helvetica Neue',Helvetica,sans-serif", fontWeight: "700", fontSize: "clamp(26px,2.8vw,36px)", lineHeight: "1.1", letterSpacing: "-0.02em" }}>
                          {"Vellore Institute of Technology"}
                        </h3>
                        <span style={{ fontSize: "16px", color: "#475467" }}>
                          {"B.Tech, Computer Science"}
                        </span>
                      </div>
                      <ul style={{ listStyle: "none", margin: "0", padding: "0", display: "flex", flexDirection: "column" }}>
                        <li style={{ display: "flex", flexDirection: "column", gap: "4px", padding: "16px 0", borderTop: "1px solid #E6E6E6" }}>
                          <span style={{ fontSize: "12px", letterSpacing: "0.06em", textTransform: "uppercase", color: "#3375CA", fontWeight: "700" }}>
                            {"Management Lead"}
                          </span>
                          <span style={{ fontSize: "18px", fontWeight: "700", color: "#141313" }}>
                            {"Google Developer Group"}
                          </span>
                        </li>
                        <li style={{ display: "flex", flexDirection: "column", gap: "4px", padding: "16px 0", borderTop: "1px solid #E6E6E6" }}>
                          <span style={{ fontSize: "12px", letterSpacing: "0.06em", textTransform: "uppercase", color: "#3375CA", fontWeight: "700" }}>
                            {"Research"}
                          </span>
                          <span style={{ fontSize: "18px", fontWeight: "700", color: "#141313" }}>
                            {"Real-time object detection"}
                          </span>
                          <span style={{ fontSize: "15px", lineHeight: "1.55", color: "#475467", textWrap: "pretty" }}>
                            {"Published research while studying computer science."}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </article>
                </div>
              </div>
            </div>
          </section>
          <section id="contact" style={{ background: "#141313", color: "#FFFFFF" }}>
            <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "clamp(72px,10vw,128px) clamp(20px,4vw,48px) 40px", display: "flex", flexDirection: "column", gap: "56px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "860px" }}>
                <span style={{ fontFamily: "Arial,'Helvetica Neue',Helvetica,sans-serif", fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#8DB4EA" }}>
                  {"07 · Contact"}
                </span>
                <h2 style={{ margin: "0", fontFamily: "Arial,'Helvetica Neue',Helvetica,sans-serif", fontWeight: "700", fontSize: "clamp(40px,5.6vw,72px)", lineHeight: "1.05", letterSpacing: "-0.025em", textWrap: "balance" }}>
                  {"Building in AI, investing in it, or hiring for it? "}
                  <em style={{ fontStyle: "normal", color: "#8DB4EA" }}>
                    {"Let’s talk."}
                  </em>
                </h2>
                <a className="dch28" href="mailto:meherdeept@gmail.com" style={{ color: "#FFFFFF", fontSize: "clamp(20px,2.2vw,28px)", textDecoration: "underline", textUnderlineOffset: "6px", textDecorationThickness: "1px", alignSelf: "start" }}>
                  {"meherdeept@gmail.com"}
                </a>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "24px", flexWrap: "wrap", paddingTop: "24px", borderTop: "1px solid #393939", fontSize: "14px", color: "#A3A3A3" }}>
                <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
                  <a className="dch29" href="https://www.linkedin.com/in/meherdeep/" target="_blank" rel="noopener me" style={{ color: "#FFFFFF" }}>
                    {"LinkedIn ↗"}
                  </a>
                  <a className="dch30" href="https://github.com/Meherdeep" target="_blank" rel="noopener me" style={{ color: "#FFFFFF" }}>
                    {"GitHub ↗"}
                  </a>
                  <a className="dch31" href="https://medium.com/@meherdeept" target="_blank" rel="noopener me" style={{ color: "#FFFFFF" }}>
                    {"Medium ↗"}
                  </a>
                </div>
                <span>
                  {"© "}{year}{" Meherdeep Thakur · New York"}
                </span>
              </div>
            </div>
          </section>
        </main>
      </div>
      </>
    );
  }
}

export default App;
