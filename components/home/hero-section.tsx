"use client";

import Link from 'next/link';

const CHIPS = [
  { initials: 'SV', name: 'Sandhya',  role: 'Manufacturing · Vijayawada', bg: 'linear-gradient(135deg,#045C00,#34D399)',  pos: { top: '6%',    left: '2%'  }, float: 'A', dur: '6s',   delay: '0s',   live: true  },
  { initials: 'SG', name: 'Sangarsh', role: 'SaaS founder · Bangalore',   bg: 'linear-gradient(135deg,#0D3934,#317559)', pos: { top: '16%',   right: '0%' }, float: 'B', dur: '7s',   delay: '0.3s', live: false },
  { initials: 'SK', name: 'Srikant',  role: 'D2C brand · Hyderabad',      bg: 'linear-gradient(135deg,#317559,#34D399)', pos: { bottom: '26%',left: '0%'  }, float: 'A', dur: '7.5s', delay: '0.6s', live: false },
  { initials: 'VJ', name: 'Vijay',    role: 'Family business · Dubai',    bg: 'linear-gradient(135deg,#045C00,#317559)', pos: { bottom: '6%', right: '2%' }, float: 'B', dur: '6.5s', delay: '0.9s', live: true  },
  { initials: 'PG', name: 'Pavani',   role: 'Agency owner · Guntur',      bg: 'linear-gradient(135deg,#34D399,#0D3934)', pos: { top: '52%',   right: '0%' }, float: 'A', dur: '8s',   delay: '1.2s', live: false },
  { initials: 'RV', name: 'Ravi',     role: 'Jeweller · Vizag',           bg: 'linear-gradient(135deg,#0D3934,#34D399)', pos: { bottom: '6%', left: '12%' }, float: 'B', dur: '7.8s', delay: '1.5s', live: false },
];

const NETWORK_PATHS = [
  'M 80 80 Q 200 200 250 250',
  'M 420 100 Q 320 200 250 250',
  'M 60 380 Q 180 320 250 250',
  'M 440 400 Q 340 320 250 250',
  'M 480 250 Q 380 250 250 250',
];

export function HeroSection() {
  return (
    <section
      className="hero-v3-section"
      style={{
        position: 'relative',
        minHeight: '100vh',
        overflowX: 'hidden',
        background: '#14231F',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '140px 24px 80px',
      }}
    >
      {/* Atmosphere gradients */}
      <div
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
          background: `
            radial-gradient(ellipse 1200px 600px at 50% 110%, rgba(52,211,153,0.18), transparent 60%),
            radial-gradient(ellipse 800px 500px at 50% -10%, rgba(4,92,0,0.35), transparent 70%)`,
        }}
      />

      {/* Grid overlay */}
      <div
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
          backgroundImage: `
            linear-gradient(rgba(52,211,153,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(52,211,153,0.04) 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
          backgroundPosition: 'center',
          maskImage: 'radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 80%)',
        }}
      />

      {/* Orb 1 */}
      <div style={{ position:'absolute', borderRadius:'50%', filter:'blur(80px)', opacity:0.5, zIndex:0, pointerEvents:'none',
        width:'380px', height:'380px', background:'#34D399', top:'10%', left:'-100px',
        animation:'hero-drift 18s ease-in-out infinite' }} />
      {/* Orb 2 */}
      <div style={{ position:'absolute', borderRadius:'50%', filter:'blur(80px)', opacity:0.5, zIndex:0, pointerEvents:'none',
        width:'460px', height:'460px', background:'#045C00', bottom:'-120px', right:'-120px',
        animation:'hero-drift 22s ease-in-out infinite reverse' }} />
      {/* Orb 3 */}
      <div style={{ position:'absolute', borderRadius:'50%', filter:'blur(80px)', opacity:0.25, zIndex:0, pointerEvents:'none',
        width:'240px', height:'240px', background:'#34D399', top:'50%', right:'20%',
        animation:'hero-drift 26s ease-in-out infinite' }} />

      {/* Two-column layout */}
      <div className="hero-v3-inner">

        {/* ── LEFT: Copy ── */}
        <div style={{ animation: 'hero-rise 0.9s cubic-bezier(0.22,1,0.36,1) both' }}>

          {/* Eyebrow */}
          <div
            className="hero-v3-eyebrow"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              padding: '8px 16px',
              background: 'rgba(13,57,52,0.7)',
              border: '1px solid rgba(52,211,153,0.25)',
              borderRadius: '999px',
              fontSize: '12px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase',
              color: '#34D399',
              backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
              marginBottom: '28px',
              animation: 'hero-rise 0.9s cubic-bezier(0.22,1,0.36,1) 0.05s both',
            }}
          >
            <span style={{
              width:'6px', height:'6px', borderRadius:'50%', background:'#34D399',
              boxShadow:'0 0 8px #34D399', flexShrink:0, display:'inline-block',
              animation:'hero-pulse 2s ease-in-out infinite',
            }} />
            A private community for people who build
          </div>

          {/* Headline */}
          <h1
            style={{
              fontWeight: 700,
              fontSize: 'clamp(40px, 5.5vw, 72px)',
              lineHeight: 1.02,
              letterSpacing: '-0.03em',
              color: '#FFFFFF',
              marginBottom: '24px',
              animation: 'hero-rise 0.9s cubic-bezier(0.22,1,0.36,1) 0.1s both',
            }}
          >
            Stop thinking{' '}
            <span style={{ color: 'rgba(255,255,255,0.32)', fontWeight: 700 }}>I</span>,
            <br />
            start thinking{' '}
            <span style={{
              background: 'linear-gradient(135deg,#34D399 0%,#045C00 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              position: 'relative',
              display: 'inline-block',
            }}>
              WE
              <span style={{
                position:'absolute', left:0, right:0, bottom:'-4px',
                height:'2px',
                background:'linear-gradient(90deg, transparent, #34D399, transparent)',
                opacity:0.6,
              }} />
            </span>.
          </h1>

          {/* Subheadline */}
          <p
            className="hero-v3-subheadline"
            style={{
              fontSize: '18px', lineHeight: 1.6, color: 'rgba(255,255,255,0.65)',
              maxWidth: '560px', marginBottom: '40px', fontWeight: 400,
              animation: 'hero-rise 0.9s cubic-bezier(0.22,1,0.36,1) 0.18s both',
            }}
          >
            WeVysya is the private community for business owners, entrepreneurs, and
            operators serious about the long game — a place to trade hard-won lessons,
            open doors for one another, and grow alongside people who actually
            understand the work.
          </p>

          {/* CTA row */}
          <div
            className="hero-v3-cta-row"
            style={{
              display: 'flex', gap: '14px', marginBottom: '48px', flexWrap: 'wrap',
              animation: 'hero-rise 0.9s cubic-bezier(0.22,1,0.36,1) 0.26s both',
            }}
          >
            <Link href="/membership">
              <button
                style={{
                  position:'relative', overflow:'hidden',
                  background:'linear-gradient(135deg,#045C00 0%,#34D399 100%)',
                  color:'#FFFFFF', padding:'16px 32px', border:'none', borderRadius:'12px',
                  fontWeight:500, fontSize:'15px', cursor:'pointer', fontFamily:'inherit',
                  display:'inline-flex', alignItems:'center', gap:'10px',
                  boxShadow:'0 0 24px rgba(52,211,153,0.35), 0 8px 32px rgba(4,92,0,0.4)',
                  transition:'transform 0.2s ease, box-shadow 0.3s ease',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 32px rgba(52,211,153,0.5), 0 12px 40px rgba(4,92,0,0.5)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 24px rgba(52,211,153,0.35), 0 8px 32px rgba(4,92,0,0.4)';
                }}
              >
                Apply to join
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                </svg>
              </button>
            </Link>

            <Link href="/about">
              <button
                style={{
                  background:'transparent', color:'#FFFFFF', padding:'16px 28px',
                  border:'1px solid rgba(52,211,153,0.3)', borderRadius:'12px',
                  fontWeight:500, fontSize:'15px', cursor:'pointer', fontFamily:'inherit',
                  display:'inline-flex', alignItems:'center', gap:'10px',
                  transition:'all 0.2s ease', backdropFilter:'blur(8px)',
                }}
                onMouseEnter={e => {
                  const btn = e.currentTarget as HTMLButtonElement;
                  btn.style.background = 'rgba(52,211,153,0.06)';
                  btn.style.borderColor = 'rgba(52,211,153,0.5)';
                }}
                onMouseLeave={e => {
                  const btn = e.currentTarget as HTMLButtonElement;
                  btn.style.background = 'transparent';
                  btn.style.borderColor = 'rgba(52,211,153,0.3)';
                }}
              >
                See who&apos;s inside
              </button>
            </Link>
          </div>

          {/* Trust row */}
          <div
            className="hero-v3-trust-row"
            style={{
              display:'flex', alignItems:'center', gap:'24px', flexWrap:'wrap',
              animation:'hero-rise 0.9s cubic-bezier(0.22,1,0.36,1) 0.34s both',
            }}
          >
            {/* Stacked avatars */}
            <div style={{ display:'flex' }}>
              {[
                { i:'SV', bg:'linear-gradient(135deg,#045C00,#34D399)' },
                { i:'SG', bg:'linear-gradient(135deg,#0D3934,#317559)' },
                { i:'VJ', bg:'linear-gradient(135deg,#317559,#34D399)' },
              ].map((a, idx) => (
                <div key={idx} style={{
                  width:'36px', height:'36px', borderRadius:'50%',
                  border:'2px solid #14231F', marginLeft: idx === 0 ? 0 : '-10px',
                  display:'grid', placeItems:'center',
                  fontSize:'13px', fontWeight:500, color:'white', background:a.bg,
                }}>{a.i}</div>
              ))}
              <div style={{
                width:'36px', height:'36px', borderRadius:'50%',
                border:'1px solid rgba(52,211,153,0.3)', marginLeft:'-10px',
                display:'grid', placeItems:'center',
                fontSize:'11px', fontWeight:500, color:'#34D399',
                background:'rgba(52,211,153,0.15)',
              }}>+2k</div>
            </div>

            <div style={{ fontSize:'13px', color:'rgba(255,255,255,0.65)', lineHeight:1.4 }}>
              <div><strong style={{ color:'#FFFFFF', fontWeight:500 }}>2,400+ vetted members</strong> · 32 countries · 40+ industries</div>
              <div><span style={{ color:'#34D399', letterSpacing:'2px', fontSize:'12px' }}>★★★★★</span> 4.9 average member rating</div>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Community orbit ── */}
        <div className="hero-v3-visual">

          {/* Rings */}
          <div className="hero-v3-ring-3" style={{ position:'absolute', top:'50%', left:'50%', width:'560px', height:'560px', borderRadius:'50%', border:'1px dashed rgba(52,211,153,0.08)', pointerEvents:'none', animation:'hero-ring-spin 100s linear infinite' }} />
          <div style={{ position:'absolute', top:'50%', left:'50%', width:'420px', height:'420px', borderRadius:'50%', border:'1px dashed rgba(52,211,153,0.12)', pointerEvents:'none', animation:'hero-ring-spin-rev 80s linear infinite' }} />
          <div style={{ position:'absolute', top:'50%', left:'50%', width:'280px', height:'280px', borderRadius:'50%', border:'1px dashed rgba(52,211,153,0.18)', pointerEvents:'none', animation:'hero-ring-spin 60s linear infinite' }} />

          {/* Network SVG lines */}
          <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', zIndex:2, opacity:0.5, pointerEvents:'none' }} viewBox="0 0 500 500" preserveAspectRatio="none">
            <defs>
              <linearGradient id="heroLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%"   stopColor="#34D399" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#34D399" stopOpacity="0"   />
              </linearGradient>
            </defs>
            {NETWORK_PATHS.map((d, i) => (
              <path key={i} d={d} stroke="url(#heroLineGrad)" strokeWidth="1" fill="none"
                strokeDasharray="3 5" style={{ animation:'hero-dash 12s linear infinite' }} />
            ))}
          </svg>

          {/* Center card */}
          <div className="hero-v3-center-card" style={{
            position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)',
            zIndex:5, width:'220px', padding:'24px',
            background:'rgba(13,57,52,0.75)', border:'1px solid rgba(52,211,153,0.25)',
            borderRadius:'16px', backdropFilter:'blur(16px)', WebkitBackdropFilter:'blur(16px)',
            boxShadow:'0 8px 40px rgba(4,92,0,0.3), 0 0 60px rgba(52,211,153,0.12)',
            textAlign:'center', animation:'hero-breathe 5s ease-in-out infinite',
          }}>
            <div style={{ fontSize:'10px', letterSpacing:'0.18em', textTransform:'uppercase', color:'#34D399', marginBottom:'12px', fontWeight:500 }}>Your circle</div>
            <div className="hero-v3-center-value" style={{ fontSize:'36px', fontWeight:700, lineHeight:1, letterSpacing:'-0.02em', marginBottom:'8px', color:'#FFFFFF' }}>2,431</div>
            <div style={{ fontSize:'12px', color:'rgba(255,255,255,0.65)', lineHeight:1.4 }}>owners, operators<br />&amp; entrepreneurs</div>
          </div>

          {/* Member chips */}
          {CHIPS.map((chip, i) => (
            <div key={i} className="hero-v3-chip" style={{
              position:'absolute', zIndex:4, display:'flex', alignItems:'center', gap:'10px',
              padding:'10px 14px 10px 10px',
              background:'rgba(13,57,52,0.7)', border:'1px solid rgba(52,211,153,0.18)',
              borderRadius:'999px', backdropFilter:'blur(12px)', WebkitBackdropFilter:'blur(12px)',
              boxShadow:'0 4px 20px rgba(4,92,0,0.2)', whiteSpace:'nowrap',
              animation:`hero-float${chip.float} ${chip.dur} ease-in-out infinite ${chip.delay}`,
              ...chip.pos as React.CSSProperties,
            }}>
              {chip.live && (
                <span style={{
                  position:'absolute', top:'8px', right:'8px',
                  width:'6px', height:'6px', borderRadius:'50%',
                  background:'#34D399', boxShadow:'0 0 8px #34D399',
                  animation:'hero-pulse 1.8s ease-in-out infinite',
                }} />
              )}
              <div className="hero-v3-chip-avatar" style={{ width:'32px', height:'32px', borderRadius:'50%', background:chip.bg, display:'grid', placeItems:'center', color:'white', fontSize:'12px', fontWeight:500, flexShrink:0 }}>
                {chip.initials}
              </div>
              <div style={{ display:'flex', flexDirection:'column', lineHeight:1.2 }}>
                <span className="hero-v3-chip-name" style={{ fontSize:'13px', fontWeight:500, color:'#FFFFFF' }}>{chip.name}</span>
                <span className="hero-v3-chip-role" style={{ fontSize:'11px', color:'rgba(255,255,255,0.65)' }}>{chip.role}</span>
              </div>
            </div>
          ))}

          {/* Topical tags */}
          {[
            { label:'Hiring · COO',              pos:{ top:'38%',    left:'8%'  }, anim:'hero-floatA 9s ease-in-out infinite 0.4s'  },
            { label:'Looking for a CA in Mumbai', pos:{ bottom:'38%', right:'14%'}, anim:'hero-floatB 10s ease-in-out infinite 1s' },
          ].map((tag, i) => (
            <div key={i} style={{
              position:'absolute', zIndex:3, padding:'6px 12px',
              background:'rgba(20,35,31,0.7)', border:'1px solid rgba(52,211,153,0.15)',
              borderRadius:'999px', fontSize:'11px', fontWeight:500, color:'rgba(255,255,255,0.85)',
              backdropFilter:'blur(8px)', animation:tag.anim,
              ...tag.pos as React.CSSProperties,
            }}>
              <span style={{ display:'inline-block', width:'5px', height:'5px', borderRadius:'50%', background:'#34D399', marginRight:'6px', verticalAlign:'middle' }} />
              {tag.label}
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position:'absolute', bottom:'30px', left:'50%', transform:'translateX(-50%)',
        zIndex:5, display:'flex', flexDirection:'column', alignItems:'center', gap:'8px',
        color:'rgba(255,255,255,0.65)', fontSize:'11px', letterSpacing:'0.15em',
        textTransform:'uppercase', fontWeight:500,
        animation:'hero-rise 1s ease 1s both',
      }} className="hidden md:flex">
        <span>Scroll</span>
        <div style={{ width:'1px', height:'36px', background:'linear-gradient(to bottom, #34D399, transparent)', animation:'hero-scroll-pulse 2.5s ease-in-out infinite' }} />
      </div>
    </section>
  );
}
