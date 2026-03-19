import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

// ── Vintage book-binding colour palettes ──────────────────────────────────────
const PALETTES = [
  { cover: '#5a1820', mid: '#7a2232', spine: '#3a1016', text: '#f4e6c6', accent: '#c8a050' }, // Burgundy leather
  { cover: '#1a3c28', mid: '#265038', spine: '#101e16', text: '#e6d8aa', accent: '#8ab870' }, // Forest green cloth
  { cover: '#14203c', mid: '#1c2e58', spine: '#0c1428', text: '#dce8f8', accent: '#78a8c8' }, // Oxford navy
  { cover: '#4c2e10', mid: '#684018', spine: '#301e08', text: '#f0e2c0', accent: '#c8a050' }, // Tobacco saddle
  { cover: '#2e1440', mid: '#401c58', spine: '#1c0c28', text: '#e6d6f8', accent: '#a888d0' }, // Victorian plum
  { cover: '#1a2c3e', mid: '#243c56', spine: '#101c28', text: '#dae6f4', accent: '#7ca8c8' }, // Slate blue
  { cover: '#26301a', mid: '#364424', spine: '#181e10', text: '#e6e6bc', accent: '#9cb860' }, // Olive cloth
  { cover: '#4c2010', mid: '#683018', spine: '#301408', text: '#f4dec6', accent: '#d08c58' }, // Russet
  { cover: '#181820', mid: '#24242e', spine: '#0e0e14', text: '#e6e6f0', accent: '#9898c8' }, // Charcoal
  { cover: '#3a1220', mid: '#501c2e', spine: '#240c14', text: '#f4dce8', accent: '#d088a4' }, // Antique rose
  { cover: '#0c2a2a', mid: '#123838', spine: '#081818', text: '#c6e6e6', accent: '#68b8b8' }, // Teal
  { cover: '#3a2406', mid: '#4e3a0e', spine: '#261800', text: '#f4e6bc', accent: '#d0b468' }, // Caramel gold
];

const SPINE_W   = 66;                   // px — book depth / spine width
const PAGE_N    = 3;                    // decorative pages that flip
const PAGE_Z    = 1.2;                  // px — z-spacing between stacked pages
const COVER_Z   = (PAGE_N + 1) * PAGE_Z; // cover sits in front of all pages
const P3        = [0.76, 0, 0.24, 1];  // ≈ power3.inOut — premium easing

function getPalette(id = '') {
  const hash = [...id].reduce((s, c) => s + c.charCodeAt(0), 0);
  return PALETTES[hash % PALETTES.length];
}

// ── Component ─────────────────────────────────────────────────────────────────
//
// Animation phases:
//   cover — book front-facing, closed. Flag + country name visible.
//   open  — cover hinges -120°; decorative pages cascade-flip -180°
//   zoom  — scene scales up so content page fills viewport; chrome fades
//   gone  — unmount, fire onComplete
//
function BookCoverTransition({ country, onComplete }) {
  const [phase, setPhase] = useState('cover');
  const timers = useRef([]);
  const contentPageRef = useRef(null);
  const sceneRef = useRef(null);
  const [zoomTransform, setZoomTransform] = useState(null);

  const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  const after = (fn, ms) => { const id = setTimeout(fn, ms); timers.current.push(id); };

  // Auto-sequence: cover → open → zoom → gone
  useEffect(() => {
    after(() => setPhase('open'), 600);
    after(() => setPhase('zoom'), 1600);
    after(() => { setPhase('gone'); onComplete?.(); }, 2600);
    return clear;
  }, []); // eslint-disable-line

  // Compute zoom transform when entering zoom phase
  useEffect(() => {
    if (phase === 'zoom' && contentPageRef.current) {
      const rect = contentPageRef.current.getBoundingClientRect();
      const scaleX = window.innerWidth / rect.width;
      const scaleY = window.innerHeight / rect.height;
      const scale = Math.max(scaleX, scaleY);
      const translateX = (window.innerWidth / 2) - (rect.left + rect.width / 2);
      const translateY = (window.innerHeight / 2) - (rect.top + rect.height / 2);
      setZoomTransform({ scale, translateX, translateY });
    }
  }, [phase]);

  // Click anywhere to skip forward one phase
  const skip = useCallback(() => {
    clear();
    if (phase === 'cover') {
      setPhase('open');
      after(() => setPhase('zoom'), 1000);
      after(() => { setPhase('gone'); onComplete?.(); }, 2000);
    } else if (phase === 'open') {
      setPhase('zoom');
      after(() => { setPhase('gone'); onComplete?.(); }, 1000);
    } else if (phase === 'zoom') {
      setPhase('gone');
      onComplete?.();
    }
  }, [phase, onComplete]);

  if (phase === 'gone') return null;

  const pal     = getPalette(country?.id);
  const coverBg = `linear-gradient(162deg, ${pal.cover} 0%, ${pal.mid} 52%, ${pal.cover} 100%)`;
  const spineBg = `linear-gradient(to right, ${pal.spine} 0%, ${pal.cover} 35%, ${pal.cover} 65%, ${pal.spine} 100%)`;
  const innerBg = `linear-gradient(160deg, ${pal.mid} 0%, ${pal.spine} 100%)`;

  const opening = phase === 'open' || phase === 'zoom';
  const zooming = phase === 'zoom';
  const chromeFade = zooming ? 0 : 1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ cursor: 'pointer', overflow: 'hidden' }}
      onClick={skip}
    >
      {/* ── Dark backdrop ── */}
      <motion.div
        className="absolute inset-0"
        style={{ background: '#000000' }}
        animate={{ opacity: zooming ? 0 : 1 }}
        transition={{ duration: 0.85, delay: zooming ? 0.15 : 0, ease: 'easeIn' }}
      />

      {/* ── Scene wrapper — zoom transform applies here (outside perspective) ── */}
      <motion.div
        ref={sceneRef}
        style={{ position: 'relative', zIndex: 10, willChange: 'transform' }}
        animate={
          zooming && zoomTransform
            ? {
                scale: zoomTransform.scale,
                x: zoomTransform.translateX,
                y: zoomTransform.translateY,
              }
            : { scale: 1, x: 0, y: 0 }
        }
        transition={{ duration: 0.95, ease: P3 }}
      >

        {/* Ground shadow */}
        <motion.div
          style={{
            position: 'absolute',
            bottom: '-28px', left: '8%', right: '8%',
            height: '36px',
            background: 'radial-gradient(ellipse, rgba(0,0,0,0.65) 0%, transparent 72%)',
            filter: 'blur(13px)',
          }}
          animate={{ scaleX: 1.35, opacity: zooming ? 0 : 0.8 }}
          transition={{ duration: zooming ? 0.5 : 1.0, ease: P3 }}
        />

        {/* Perspective container */}
        <div style={{ perspective: '900px', perspectiveOrigin: '50% 50%' }}>

          {/* ── Book wrapper ── */}
          <motion.div
            style={{
              position: 'relative',
              width: 'clamp(280px, 40vw, 460px)',
              height: 'clamp(420px, 68vh, 680px)',
              transformStyle: 'preserve-3d',
              WebkitTransformStyle: 'preserve-3d',
            }}
            initial={{ rotateY: 0, scale: 1.07 }}
            animate={{ rotateY: 0, scale: 1.07 }}
            transition={{ duration: 1.0, ease: P3 }}
          >

            {/* ── SPINE ── */}
            <motion.div
              style={{
                position: 'absolute', top: 0, left: 0, bottom: 0,
                width: `${SPINE_W}px`,
                background: spineBg,
                zIndex: 5,
              }}
              animate={{ z: opening ? -8 : 0, opacity: chromeFade }}
              transition={{ duration: zooming ? 0.5 : 1.05, ease: P3 }}
            >
              {[{ top: 0 }, { bottom: 0 }].map((pos, i) => (
                <div key={i} style={{
                  position: 'absolute', ...pos, left: 0, right: 0, height: '8px',
                  background: `linear-gradient(to right, ${pal.accent}38, ${pal.accent}88, ${pal.accent}38)`,
                }} />
              ))}
              <div style={{
                position: 'absolute', top: 0, bottom: 0, left: '42%', width: '6px',
                background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent)',
              }} />
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden', writingMode: 'vertical-rl', transform: 'rotate(180deg)',
              }}>
                <span style={{
                  color: `${pal.accent}58`, letterSpacing: '0.22em',
                  fontSize: '10px', fontWeight: 600, textTransform: 'uppercase',
                  maxHeight: '60%', overflow: 'hidden',
                }}>
                  {country?.name}
                </span>
              </div>
            </motion.div>

            {/* ── PAGE BLOCK — right edge (stacked paper texture) ── */}
            <motion.div
              style={{
                position: 'absolute',
                top: '4px', bottom: '4px', right: 0,
                width: '9px',
                background: `repeating-linear-gradient(
                  0deg,
                  rgba(220,185,120,0.14) 0px, rgba(220,185,120,0.14) 1px,
                  rgba(0,0,0,0.12)       1px, rgba(0,0,0,0.12)       2px,
                  transparent            2px, transparent             5px
                )`,
                borderRadius: '0 1px 1px 0',
                zIndex: 3,
              }}
              animate={{
                scaleY: opening ? 0.97 : 1,
                x: opening ? 1 : 0,
                opacity: chromeFade,
              }}
              transition={{ duration: zooming ? 0.5 : 1.05, ease: P3 }}
            />

            {/* ── CONTENT PAGE — dark rectangle that matches app background ── */}
            <div
              ref={contentPageRef}
              style={{
                position: 'absolute',
                top: '3px', bottom: '3px',
                left: `${SPINE_W + 2}px`,
                right: '3px',
                background: '#000000',
                zIndex: 0,
                borderRadius: '0 2px 2px 0',
              }}
            >
              {/* Spine gutter shadow — fades during zoom */}
              <motion.div
                style={{
                  position: 'absolute', top: 0, left: 0, bottom: 0, width: '2rem',
                  background: 'linear-gradient(to right, rgba(0,0,0,0.25), transparent)',
                }}
                animate={{ opacity: zooming ? 0 : 1 }}
                transition={{ duration: 0.5, ease: P3 }}
              />
              {/* Subtle inner border — fades during zoom */}
              <motion.div
                style={{
                  position: 'absolute', inset: 0,
                  boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.04)',
                  borderRadius: '0 2px 2px 0',
                  pointerEvents: 'none',
                }}
                animate={{ opacity: zooming ? 0 : 1 }}
                transition={{ duration: 0.5, ease: P3 }}
              />
            </div>

            {/* ── DECORATIVE PAGES — cascade-flip when cover opens ── */}
            {Array.from({ length: PAGE_N }, (_, i) => {
              const zBase = (PAGE_N - i) * PAGE_Z;
              return (
                <motion.div
                  key={`page-${i}`}
                  style={{
                    position: 'absolute',
                    top: '3px', bottom: '3px',
                    left: `${SPINE_W + 2}px`,
                    right: '3px',
                    transformOrigin: 'left center',
                    transformStyle: 'preserve-3d',
                    WebkitTransformStyle: 'preserve-3d',
                  }}
                  initial={{ rotateY: 0, z: zBase }}
                  animate={{
                    rotateY: opening ? -180 : 0,
                    z:       opening ? -zBase : zBase,
                    opacity: chromeFade,
                  }}
                  transition={{
                    rotateY: { duration: 0.7, ease: P3, delay: opening ? 0.38 + i * 0.15 : 0 },
                    z:       { duration: 0.7, ease: P3, delay: opening ? 0.38 + i * 0.15 : 0 },
                    opacity: { duration: zooming ? 0.5 : 0.7, ease: P3 },
                  }}
                >
                  {/* Front face — parchment with ruled lines */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: `linear-gradient(to right, #e4d8c0 0%, #f0e8d4 6%, #f6f0e0 100%)`,
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    borderRadius: '0 2px 2px 0',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      position: 'absolute', top: 0, left: 0, bottom: 0, width: '2rem',
                      background: 'linear-gradient(to right, rgba(0,0,0,0.12), transparent)',
                    }} />
                    <div style={{
                      position: 'absolute', top: '12%', left: '15%', right: '10%', bottom: '12%',
                      background: `repeating-linear-gradient(
                        0deg,
                        transparent 0px, transparent 26px,
                        rgba(170,155,130,0.12) 26px, rgba(170,155,130,0.12) 27px
                      )`,
                    }} />
                    {i === 0 && (
                      <div style={{
                        position: 'absolute', inset: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        opacity: 0.06, fontSize: 'clamp(4rem, 12vw, 8rem)',
                        pointerEvents: 'none', userSelect: 'none',
                      }}>
                        {country?.flag}
                      </div>
                    )}
                  </div>

                  {/* Back face */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: `linear-gradient(to right, #f0e8d4 0%, #ece4cc 80%, #e0d6be 100%)`,
                    transform: 'rotateY(180deg)',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    borderRadius: '0 2px 2px 0',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      position: 'absolute', top: 0, left: 0, bottom: 0, width: '2rem',
                      background: 'linear-gradient(to right, rgba(0,0,0,0.10), transparent)',
                    }} />
                  </div>
                </motion.div>
              );
            })}

            {/* ── FRONT COVER HINGE ── */}
            <motion.div
              style={{
                position: 'absolute',
                top: 0, bottom: 0,
                left: `${SPINE_W}px`, right: 0,
                transformOrigin: 'left center',
                transformStyle: 'preserve-3d',
                WebkitTransformStyle: 'preserve-3d',
              }}
              initial={{ z: COVER_Z }}
              animate={{
                rotateY: opening ? -120 : 0,
                z: COVER_Z,
                opacity: chromeFade,
              }}
              transition={{
                rotateY: { duration: 1.05, ease: P3 },
                z:       { duration: 1.05, ease: P3 },
                opacity: { duration: zooming ? 0.5 : 1.05, ease: P3 },
              }}
            >
              {/* Outer face — cover exterior */}
              <div style={{
                position: 'absolute', inset: 0,
                background: coverBg,
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                overflow: 'hidden',
              }}>
                {/* Specular highlight */}
                <motion.div
                  style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
                  animate={{
                    background: opening
                      ? 'radial-gradient(ellipse at 10% 20%, rgba(255,255,255,0.04) 0%, transparent 50%)'
                      : 'radial-gradient(ellipse at 82% 12%, rgba(255,255,255,0.13) 0%, transparent 56%)',
                  }}
                  transition={{ duration: 1.05, ease: P3 }}
                />

                {/* Spine-joint shadow */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, bottom: 0, width: '3.5rem',
                  background: 'linear-gradient(to right, rgba(0,0,0,0.65), transparent)',
                  pointerEvents: 'none',
                }} />

                {/* Page-edge texture */}
                <div style={{
                  position: 'absolute', top: 0, right: 0, bottom: 0, width: '1rem',
                  background: `repeating-linear-gradient(
                    0deg,
                    rgba(200,155,90,0.09) 0px, rgba(200,155,90,0.09) 1px,
                    rgba(0,0,0,0.16)      1px, rgba(0,0,0,0.16)      2px,
                    transparent           2px, transparent            5px
                  )`,
                  pointerEvents: 'none',
                }} />

                {/* Inner decorative border */}
                <div style={{
                  position: 'absolute',
                  top: '1.1rem', left: '2rem', right: '1.1rem', bottom: '1.1rem',
                  border: `1px solid ${pal.accent}28`,
                  pointerEvents: 'none',
                }} />

                {/* ── Cover content ── */}
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  padding: '2.5rem 2rem',
                }}>
                  <motion.div
                    style={{ textAlign: 'center', width: '100%' }}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.6, ease: 'easeOut' }}
                  >
                    <p style={{
                      color: `${pal.accent}85`, fontSize: '9px',
                      letterSpacing: '0.5em', textTransform: 'uppercase', marginBottom: '1.6rem',
                    }}>
                      Cultural Guide
                    </p>

                    <div style={{
                      fontSize: 'clamp(3.8rem, 9vw, 6.5rem)', lineHeight: 1,
                      filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.8))',
                      marginBottom: '1.5rem',
                    }}>
                      {country?.flag}
                    </div>

                    <h2 style={{
                      color: pal.text, letterSpacing: '0.12em', lineHeight: 1.1,
                      fontSize: 'clamp(1.3rem, 3vw, 2.2rem)',
                      fontWeight: 700, textTransform: 'uppercase', margin: 0,
                    }}>
                      {country?.name}
                    </h2>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.9rem', marginTop: '1.1rem' }}>
                      <div style={{ height: '1px', flex: 1, maxWidth: '52px', background: `${pal.accent}42` }} />
                      <span style={{ color: `${pal.accent}70`, fontSize: '9px', letterSpacing: '0.32em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                        {country?.region}
                      </span>
                      <div style={{ height: '1px', flex: 1, maxWidth: '52px', background: `${pal.accent}42` }} />
                    </div>

                    <motion.p
                      style={{ color: `${pal.text}32`, fontSize: '8px', letterSpacing: '0.42em', textTransform: 'uppercase', marginTop: '2.2rem' }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: phase === 'cover' ? [0, 0.9, 0.9, 0] : 0 }}
                      transition={{ delay: 0.36, duration: 1.55, times: [0, 0.14, 0.74, 1] }}
                    >
                      tap to skip
                    </motion.p>
                  </motion.div>
                </div>
              </div>

              {/* Inner face — endpaper */}
              <div style={{
                position: 'absolute', inset: 0,
                background: innerBg,
                transform: 'rotateY(180deg)',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
              }} />
            </motion.div>{/* end cover hinge */}

          </motion.div>{/* end book */}
        </div>{/* end perspective */}
      </motion.div>{/* end scene */}
    </div>
  );
}

export default BookCoverTransition;
