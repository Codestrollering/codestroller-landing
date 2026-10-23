import React, { useState, useRef } from 'react';
import { createRoot } from 'react-dom/client';

// --- CURATED DATASET (Paris, 20–28 novembre) ---
const SPOTS = [
  {
    id: 'dehillerin',
    short: 'Dehillerin',
    name: 'E. Dehillerin',
    tagFr: 'Cuivre & Outillage',
    tagEn: 'Heavy Copper & Cutlery',
    arr: '1er Arrondissement',
    arrShort: '1er Arr.',
    address: '18 Rue Coquillière',
    dist: 110,
    hours: '09:00 – 19:00',
    hoursNote: 'Ouvert / Open',
    specFr: 'Cuivre massif 2.5mm–3mm étamé au feu. Queue de fonte rivetée. Aucun prix affiché : relevé au crayon et consultation du grand registre papier.',
    specEn: 'Solid 2.5–3mm hand-wiped tin copper. Riveted cast-iron handles. No price tags: cross-reference hand-punched codes in the central ledger.',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1200&auto=format&fit=crop',
    tone: '#7a5236',
    details: '2.5mm Cuivre Massif · Réf. 44102 · Détaxe sur place',
    lens: {
      label: 'Étiquette / Price tag',
      intel: 'Diagnostic boutique / Shop intel',
      lines: [
        { fr: 'Réf. 44102 — Sauteuse 24 cm', en: '24 cm copper sauté pan' },
        { fr: 'Étamage main · 2.5 mm', en: 'Hand-wiped tin lining · 2.5 mm wall' }
      ]
    },
    approach: { arrow: '↱', fr: 'Tourner à droite après Saint-Eustache', en: 'Turn right past Saint-Eustache onto Rue Coquillière' }
  },
  {
    id: 'chez-denise',
    short: 'Denise',
    name: 'Chez Denise',
    tagFr: 'Bistrot de Nuit & Halles',
    tagEn: 'Historic All-Night Meat Counter',
    arr: '1er Arrondissement',
    arrShort: '1er Arr.',
    address: '5 Rue des Prouvaires',
    dist: 180,
    hours: "Jusqu'à 05:00",
    hoursNote: 'Open until 5 AM',
    specFr: 'Nappes à carreaux rouges, serveurs en longs tabliers, os à moelle brûlants, tripes au bouillon et Brouilly tiré au pot.',
    specEn: 'Red checkered cloth, floor-length white aprons, roasted marrow bones, Caen-style tripe, and Beaujolais by the earthenware jug.',
    image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=1200&auto=format&fit=crop',
    tone: '#6e2a24',
    details: 'La Tour de Montlhéry · 4 couverts libres au comptoir',
    lens: {
      label: 'Ardoise / Menu board',
      intel: 'Diagnostic bistrot / Venue intel',
      lines: [
        { fr: 'Os à moelle grillé', en: 'Roasted bone marrow, sea salt' },
        { fr: 'Ris de veau au vin jaune', en: 'Crisp veal sweetbreads in Jura wine' }
      ]
    },
    approach: { arrow: '↰', fr: 'Tourner à gauche rue des Prouvaires', en: 'Turn left off Rue Saint-Honoré onto Rue des Prouvaires' }
  },
  {
    id: 'doursoux',
    short: 'Doursoux',
    name: 'Doursoux',
    tagFr: 'Toile & Bleu de Travail',
    tagEn: 'French Workwear Surplus',
    arr: '15e Arrondissement',
    arrShort: '15e Arr.',
    address: '3 Passage Alexandre',
    dist: 340,
    hours: '10:00 – 18:30',
    hoursNote: 'Mar–Sam / Tue–Sat',
    specFr: "Rayons d'acier brut sans mise en scène. Véritables vestes en moleskine et sergé de coton bleu 1950–1970 à prix d'atelier (30 €–65 €).",
    specEn: 'Raw steel shelves without boutique markups. Authentic French moleskin and indigo cotton chore coats (30 €–65 €).',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=1200&auto=format&fit=crop',
    tone: '#334458',
    details: "30 € – 65 € · Stocks militaires & chemins de fer d'époque",
    lens: {
      label: 'Étiquette / Garment label',
      intel: 'Diagnostic boutique / Shop intel',
      lines: [
        { fr: 'Veste de travail · Moleskine', en: 'Moleskin chore coat' },
        { fr: 'Taille 50 · Années 1960', en: 'EU 50 (≈ US 40) · 1960s stock' }
      ]
    },
    approach: { arrow: '↑', fr: 'Tout droit boulevard de Vaugirard', en: 'Straight on along Boulevard de Vaugirard to the passage' }
  },
  {
    id: 'baron-rouge',
    short: 'Baron',
    name: 'Le Baron Rouge',
    tagFr: 'Zinc & Huîtres au Tonneau',
    tagEn: 'Wine Casks & Fresh Oysters',
    arr: '12e Arrondissement',
    arrShort: '12e Arr.',
    address: '1 Rue Théophile Roussel',
    dist: 60,
    hours: 'Comptoir libre',
    hoursNote: 'Open counter',
    specFr: "Bourriche d'huîtres ouvertes sur le trottoir le matin. Vin tiré directement de la cuve dans des bouteilles consignées.",
    specEn: 'Breton oysters shucked onto curb crates. Natural wine gravity-poured from oak barrels into refillable carafes.',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=1200&auto=format&fit=crop',
    tone: '#5a1f2b',
    details: 'Sans réservation · Dégustation sur tonneau',
    lens: {
      label: 'Ardoise / Wine board',
      intel: 'Diagnostic bistrot / Venue intel',
      lines: [
        { fr: 'Muscadet sur lie · au verre', en: 'Muscadet aged on lees · by the glass' },
        { fr: 'Huîtres n°3 · la douzaine', en: 'Size 3 oysters · by the dozen' }
      ]
    },
    approach: { arrow: '↱', fr: "Tourner à droite au marché d'Aligre", en: "Turn right at Marché d'Aligre" }
  }
];

const SHELTER = {
  name: 'Passage des Panoramas',
  image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1200&auto=format&fit=crop',
  tone: '#5f5038',
  descFr: 'Verrière de 1799. Sol sec, librairies philatéliques et comptoirs en bois chauffés.',
  descEn: '1799 glass arcade. Dry passage, antique print dealers, and heated timber cafes.',
  legs: [
    { fr: 'Entrée rue Vivienne', en: 'Sheltered entrance 80 m ahead' },
    { fr: 'Liaison continue : Jouffroy & Verdeau', en: 'Covered crossing toward the 9e' }
  ],
  approach: { arrow: '↑', fr: 'Abri à 80 m : entrée rue Vivienne', en: 'Shelter in 80 m: Rue Vivienne entrance' }
};

const EVENTS_NOV = [
  {
    id: 'bach-cellos',
    time: '20:30',
    date: '21 Novembre',
    titleFr: 'Suites pour Violoncelle Seul (J.S. Bach)',
    titleEn: 'Unaccompanied Cello Suites by Candlelight',
    venue: 'Église Saint-Éphrem (Ve Arr.)',
    descFr: 'Nef acoustique en pierre du XVIIe siècle. Éclairage exclusif à la bougie. 45 chaises de bois.',
    descEn: '17th-century vaulted stone chapel. Solely candlelit. 45 wooden seats, pure natural acoustics.',
    actionFr: 'Retenir 4 places',
    actionEn: 'Hold 4 seats',
    doneFr: '4 places retenues',
    doneEn: '4 seats held'
  },
  {
    id: 'vernissage-estampes',
    time: '18:00',
    date: '23 Novembre',
    titleFr: "Vernissage : Typographie & Épreuves d'Artiste",
    titleEn: 'Vernissage: Typography & Silver Proofs',
    venue: "Galerie d'Estampes (Rue Charlot, IIIe)",
    descFr: 'Portes de la cour cochère grandes ouvertes. Tirages argentiques noir et blanc, vin servi au gobelet Duralex.',
    descEn: 'Carriage courtyard wide open. Silver gelatin prints on cotton rag, natural wine in Duralex glasses.',
    actionFr: 'Ajouter au courant',
    actionEn: 'Add to my drift',
    doneFr: 'Ajouté au courant',
    doneEn: 'Added to my drift'
  }
];

const SCREENS = [
  { id: 'intro', fr: 'Introduction', en: 'Intro' },
  { id: 'courant', fr: 'Courant', en: 'Drift' },
  { id: 'reroute', fr: 'Bifurquer', en: 'Reroute' },
  { id: 'dossier', fr: 'Dossier', en: 'File' },
  { id: 'cahier', fr: 'Cahier', en: 'Register' },
  { id: 'lens', fr: "L'Œil", en: 'Lens' },
  { id: 'poche', fr: 'Poche', en: 'Pocket' }
];

const INTRO_KEY = 'drift-intro-seen';
const readIntroSeen = () => { try { return localStorage.getItem(INTRO_KEY) === '1'; } catch (e) { return false; } };
const writeIntroSeen = () => { try { localStorage.setItem(INTRO_KEY, '1'); } catch (e) { /* storage unavailable */ } };

export default function App() {
  const [screen, setScreenRaw] = useState(() => (readIntroSeen() ? 'courant' : 'intro'));
  const [introStep, setIntroStep] = useState(0);
  const [spotIndex, setSpotIndex] = useState(0);
  const [raining, setRaining] = useState(false);
  const [reason, setReason] = useState(null); // 'rain' | 'closed' | 'less'
  const [pocketTarget, setPocketTarget] = useState('spot'); // 'spot' | 'shelter'
  const [held, setHeld] = useState({});
  const [chromeHidden, setChromeHidden] = useState(false);

  const spot = SPOTS[spotIndex];

  // Every screen change brings the bottom bar back
  const setScreenAndShow = (id) => { setChromeHidden(false); setScreenRaw(id); };
  const toggleChrome = () => setChromeHidden((h) => !h);
  const onScrollChrome = useScrollHide(setChromeHidden);
  const setScreen = setScreenAndShow;
  const go = (id) => {
    if (id === 'intro') setIntroStep(0);
    if (id === 'reroute') setReason(raining ? 'rain' : null);
    if (id === 'poche') setPocketTarget('spot');
    setScreen(id);
  };
  const finishIntro = () => { writeIntroSeen(); setScreen('courant'); };
  const pickSpot = (i) => { setSpotIndex(i); setScreen('courant'); };
  const toggleRain = () => {
    const next = !raining;
    setRaining(next);
    if (!next && reason === 'rain') setReason(null);
  };

  const showActions = ['courant', 'cahier'].includes(screen);
  const showNav = !['intro', 'poche'].includes(screen);

  return (
    <div className="page">
      <aside className="side">
        <div>
          <div className="side-eyebrow">20–28 Novembre</div>
          <h1 className="side-title">Drift</h1>
          <p className="side-tag">
            Une semaine à pied dans Paris.
            <span>A week on foot in Paris.</span>
          </p>
        </div>
        <div style={{ display: 'grid', gap: 22 }}>
          <ol className="side-index">
            {SCREENS.map((s, i) => (
              <li key={s.id}>
                <button aria-current={screen === s.id} onClick={() => go(s.id)}>
                  <span className="n">{String(i).padStart(2, '0')}</span>
                  <span>{s.fr}</span>
                  <span className="en">{s.en}</span>
                </button>
              </li>
            ))}
          </ol>
          <div className="side-tools">
            <button className="toggle" aria-pressed={raining} onClick={toggleRain}>
              <span>Simuler la pluie / Rain</span>
              <span className="pill" />
            </button>
            <button className="toggle" aria-pressed={chromeHidden} onClick={toggleChrome} disabled={!showNav}>
              <span>Masquer / Hide nav</span>
              <span className="pill" />
            </button>
          </div>
        </div>
      </aside>

      <section className="stage">
        <div className="phone">
          <div className="notch"><i /><b /></div>

          {screen === 'intro' && (
            <Intro step={introStep} setStep={setIntroStep} onDone={finishIntro} />
          )}
          {screen === 'courant' && (
            <Courant
              spot={spot} spotIndex={spotIndex} raining={raining}
              onPick={setSpotIndex}
              onOpen={() => setScreen('dossier')}
              onRainReroute={() => { setReason('rain'); setScreen('reroute'); }}
              chromeHidden={chromeHidden} onToggleChrome={toggleChrome}
            />
          )}
          {screen === 'reroute' && (
            <Reroute
              spotIndex={spotIndex} raining={raining} reason={reason} setReason={setReason}
              onBack={() => setScreen('courant')}
              onPick={pickSpot}
              onShelter={() => { setPocketTarget('shelter'); setScreen('poche'); }}
              onScroll={onScrollChrome}
            />
          )}
          {screen === 'dossier' && (
            <Dossier
              spot={spot}
              onBack={() => setScreen('courant')}
              onGuide={() => { setPocketTarget('spot'); setScreen('poche'); }}
              onScroll={onScrollChrome}
            />
          )}
          {screen === 'cahier' && (
            <Cahier held={held} onToggle={(id) => setHeld({ ...held, [id]: !held[id] })} onScroll={onScrollChrome} />
          )}
          {screen === 'lens' && (
            <Lens spot={spot} onClose={() => setScreen('courant')} chromeHidden={chromeHidden} onToggleChrome={toggleChrome} />
          )}
          {screen === 'poche' && (
            <Pocket spot={spot} target={pocketTarget} raining={raining} onWake={() => setScreen('courant')} />
          )}

          {showActions && (
            <div className={`actions ${chromeHidden ? 'hidden' : ''}`} aria-hidden={chromeHidden} inert={chromeHidden ? '' : undefined}>
              <button
                className={`act reroute ${raining ? 'alert' : ''}`}
                onClick={() => go('reroute')}
              >
                <RerouteIcon /> Reroute
              </button>
              <button className="act lens" onClick={() => setScreen('lens')}>
                <LensIcon /> Lens
              </button>
            </div>
          )}

          {showNav && (
            <nav className={`nav ${chromeHidden ? 'hidden' : ''}`} aria-label="Drift" aria-hidden={chromeHidden} inert={chromeHidden ? '' : undefined}>
              <NavButton current={['courant', 'dossier', 'reroute'].includes(screen)} onClick={() => setScreen('courant')} fr="Courant" en="Drift" icon={<CompassIcon />} />
              <NavButton current={screen === 'cahier'} onClick={() => setScreen('cahier')} fr="Cahier" en="Register" icon={<BookIcon />} />
              <NavButton current={false} onClick={() => go('poche')} fr="Poche" en="Pocket" icon={<PocketIcon />} />
            </nav>
          )}

          {showNav && chromeHidden && (
            <button className="chrome-handle" onClick={() => setChromeHidden(false)} aria-label="Show the menu">
              <i />
              <span>Menu</span>
            </button>
          )}
        </div>
      </section>
    </div>
  );
}

// ==========================================
// SHARED PIECES
// ==========================================
// Scrolling down hides the bottom bar; scrolling up (or reaching the top) brings it back
function useScrollHide(setHidden) {
  const last = useRef(0);
  return (e) => {
    const y = e.currentTarget.scrollTop;
    const dy = y - last.current;
    if (y < 24) setHidden(false);
    else if (dy > 6) setHidden(true);
    else if (dy < -6) setHidden(false);
    last.current = y;
  };
}

// A tap on open space (not on a card, button or link) toggles the bottom bar
const isOpenSpace = (target) => !target.closest('button, a, .card, .intel');

function Photo({ src, tone, alt }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="photo" style={{ '--tone': tone }}>
      {!failed && <img src={src} alt={alt} onError={() => setFailed(true)} />}
    </div>
  );
}

function Status({ label, onPhoto }) {
  return (
    <div className={`status ${onPhoto ? 'on-photo' : 'on-paper'}`}>
      <span className="brand">Drift</span>
      <span className="here">{label}</span>
      <span className="wx">15:10 · 8°</span>
    </div>
  );
}

function Cut({ tag, name }) {
  return (
    <div className="cut">
      {tag && <span className="tag">{tag}</span>}
      <span className="name">{name}</span>
    </div>
  );
}

function NavButton({ current, onClick, fr, en, icon }) {
  return (
    <button aria-current={current} onClick={onClick}>
      {icon}
      <span className="fr">{fr.toUpperCase()}</span>
      <span className="en">{en.toUpperCase()}</span>
    </button>
  );
}

// ==========================================
// 00 · INTRODUCTION (ONBOARDING)
// ==========================================
const INTRO_STEPS = [
  {
    eyebrow: '20–28 Novembre · Paris',
    title: 'Drift',
    lede: 'A week on foot in Paris. Drift shows a few places worth walking to near where you are: workshops, zinc counters, candlelit chapels. No ratings and no queues.',
    fr: 'Une semaine à pied dans Paris.',
    art: 'cover'
  },
  {
    eyebrow: '01 · Courant / The drift',
    title: 'Walk to what’s near.',
    lede: 'Swipe between places, or tap their names under the card. Open a card for the full file, then tap Guide me and put your phone away. The next turn waits on your lock screen. Tap the photo to hide the menu bar, and tap again to bring it back.',
    fr: 'Glissez, choisissez, marchez.',
    art: 'walk'
  },
  {
    eyebrow: '02 · Reroute',
    title: 'Plans change. Tap Reroute.',
    lede: 'Tell Drift what changed and it redraws the walk.',
    howto: [
      ['Il pleut / Rain', 'A dry route through the covered passages.'],
      ['C’est fermé / Closed', 'Skip to the next place on your list.'],
      ['Moins marcher / Tired', 'The closest place to you right now.']
    ],
    note: 'When rain starts, the Reroute button turns blue and a banner offers the dry route.',
    art: 'reroute'
  },
  {
    eyebrow: '03 · Lens',
    title: 'Point. Read. Order.',
    lede: 'Tap Lens and hold your camera up to a chalkboard menu, a price tag or a garment label. Drift reads the French and lays the English right under each line.',
    fr: 'Le français reste, la traduction s’ajoute.',
    art: 'lens'
  }
];

function Intro({ step, setStep, onDone }) {
  const s = INTRO_STEPS[step];
  const last = step === INTRO_STEPS.length - 1;
  const startX = useRef(null);
  return (
    <div
      className="intro"
      onTouchStart={(e) => { startX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (startX.current == null) return;
        const dx = e.changedTouches[0].clientX - startX.current;
        if (dx < -40 && !last) setStep(step + 1);
        if (dx > 40 && step > 0) setStep(step - 1);
        startX.current = null;
      }}
    >
      <div className="intro-top">
        <span>{s.eyebrow}</span>
        {!last && <button onClick={onDone}>Passer / Skip</button>}
      </div>

      <div className="intro-body">
      <div className="intro-art">
        {s.art === 'cover' && (
          <div className="cover">
            <Photo src={SPOTS[1].image} tone={SPOTS[1].tone} alt="" />
            <Cut tag="Paris · 20–28 nov." name="À pied" />
          </div>
        )}
        {s.art === 'walk' && <WalkArt />}
        {s.art === 'reroute' && <RerouteArt />}
        {s.art === 'lens' && <LensArt />}
      </div>

      <h2>{s.title}</h2>
      <p className="lede">{s.lede}</p>
      {s.fr && <p className="lede-fr">{s.fr}</p>}
      {s.howto && (
        <ul className="howto">
          {s.howto.map(([k, v]) => <li key={k}><b>{k}</b><span>{v}</span></li>)}
        </ul>
      )}
      {s.note && <p className="lede-fr" style={{ fontSize: 14 }}>{s.note}</p>}
      </div>

      <div className="intro-foot">
        <div className="dots">{INTRO_STEPS.map((_, i) => <i key={i} className={i <= step ? 'on' : ''} />)}</div>
        <button className="primary" onClick={() => (last ? onDone() : setStep(step + 1))}>
          <span className="fr">{last ? 'Commencer' : 'Suivant'}</span>
          <span className="en">{last ? 'Start drifting' : 'Next'}</span>
        </button>
      </div>
    </div>
  );
}

function WalkArt() {
  return (
    <svg viewBox="0 0 320 210" role="img" aria-label="A walking route from your position to E. Dehillerin, with the next turn shown on the lock screen">
      <g stroke="#ddd5c7" strokeWidth="10" fill="none">
        <path d="M0 120H320M0 60H320M40 0V210M150 0V210M250 0V210" />
      </g>
      <path d="M40 176V120H150V60H244" fill="none" stroke="#161412" strokeWidth="3" />
      <circle cx="40" cy="176" r="11" fill="#161412" opacity="0.12" />
      <circle cx="40" cy="176" r="6" fill="#161412" />
      <text x="54" y="190" fontFamily="IBM Plex Mono, monospace" fontSize="9" letterSpacing="1.2" fill="#6f6961">VOUS / YOU</text>
      <rect x="244" y="54" width="12" height="12" fill="#161412" />
      <rect x="166" y="28" width="130" height="18" fill="#161412" />
      <text x="174" y="41" fontFamily="IBM Plex Mono, monospace" fontSize="9" letterSpacing="1.2" fill="#f2ede4">E. DEHILLERIN · 110M</text>
      <rect x="184" y="136" width="120" height="58" rx="12" fill="#161412" />
      <text x="198" y="157" fontFamily="IBM Plex Mono, monospace" fontSize="8" letterSpacing="1.2" fill="#8f897f">ÉCRAN VERROUILLÉ</text>
      <text x="198" y="181" fontFamily="Newsreader, Georgia, serif" fontSize="20" fill="#f2ede4">↱ 110 m</text>
    </svg>
  );
}

function RerouteArt() {
  const drops = [[30, 20], [70, 34], [110, 14], [150, 30], [196, 18], [236, 34], [280, 16], [56, 64], [256, 70], [300, 50]];
  return (
    <svg viewBox="0 0 320 210" role="img" aria-label="An exposed route crossed out and a new dry route through a covered passage">
      {drops.map(([x, y]) => <path key={`${x}-${y}`} d={`M${x} ${y}l-5 12`} stroke="#2f6385" strokeWidth="1.5" opacity="0.5" />)}
      <path d="M30 170H290V60" fill="none" stroke="#a39c91" strokeWidth="2.5" strokeDasharray="6 6" />
      <text x="290" y="190" textAnchor="end" fontFamily="IBM Plex Mono, monospace" fontSize="9" letterSpacing="1.2" fill="#a39c91">À DÉCOUVERT / EXPOSED</text>
      <rect x="110" y="104" width="100" height="30" fill="#fbf8f2" stroke="#161412" strokeWidth="1.5" />
      <path d="M118 104l8-10M134 104l8-10M150 104l8-10M166 104l8-10M182 104l8-10M198 104l8-10M110 94H216" stroke="#161412" strokeWidth="1.2" />
      <path d="M30 170L110 119H210L290 60" fill="none" stroke="#2f6385" strokeWidth="3.5" />
      <circle cx="30" cy="170" r="6" fill="#161412" />
      <rect x="284" y="54" width="12" height="12" fill="#161412" />
      <text x="160" y="152" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="9" letterSpacing="1.2" fill="#2f6385">PASSAGE DES PANORAMAS</text>
    </svg>
  );
}

function LensArt() {
  return (
    <svg viewBox="0 0 320 210" role="img" aria-label="A chalkboard menu with English translations placed under each French line">
      <rect x="64" y="36" width="192" height="122" fill="#23201c" />
      <text x="160" y="66" textAnchor="middle" fontFamily="Newsreader, Georgia, serif" fontStyle="italic" fontSize="17" fill="#f2ede4">Os à moelle grillé</text>
      <rect x="92" y="74" width="136" height="18" fill="#f2ede4" />
      <text x="160" y="87" textAnchor="middle" fontFamily="Archivo, Arial, sans-serif" fontSize="10" fill="#161412">Roasted bone marrow</text>
      <text x="160" y="118" textAnchor="middle" fontFamily="Newsreader, Georgia, serif" fontStyle="italic" fontSize="17" fill="#f2ede4">Ris de veau au vin jaune</text>
      <rect x="82" y="126" width="156" height="18" fill="#f2ede4" />
      <text x="160" y="139" textAnchor="middle" fontFamily="Archivo, Arial, sans-serif" fontSize="10" fill="#161412">Veal sweetbreads, Jura wine</text>
      <g stroke="#161412" strokeWidth="2.5" fill="none">
        <path d="M48 46V24H70M250 24H272V46M272 148V170H250M70 170H48V148" />
      </g>
      <text x="160" y="196" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="9" letterSpacing="1.6" fill="#6f6961">VISER · LIRE · COMMANDER</text>
    </svg>
  );
}

// ==========================================
// 01 · COURANT (THE DRIFT)
// ==========================================
function Courant({ spot, spotIndex, raining, onPick, onOpen, onRainReroute, chromeHidden, onToggleChrome }) {
  const startX = useRef(null);
  return (
    <div
      className="screen dark"
      onClick={(e) => { if (isOpenSpace(e.target)) onToggleChrome(); }}
      onTouchStart={(e) => { startX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (startX.current == null) return;
        const dx = e.changedTouches[0].clientX - startX.current;
        if (dx < -40) onPick((spotIndex + 1) % SPOTS.length);
        if (dx > 40) onPick((spotIndex - 1 + SPOTS.length) % SPOTS.length);
        startX.current = null;
      }}
    >
      <Photo src={spot.image} tone={spot.tone} alt={spot.name} />
      <Status label={spot.arrShort} onPhoto />

      {raining && (
        <button className="rain-banner" onClick={onRainReroute}>
          <RainIcon />
          <span>
            <b>Il pleut / Rain starting</b>
            <span>Tap for a dry route under cover</span>
          </span>
          <span className="go">→</span>
        </button>
      )}

      <div className={`courant-cut ${raining ? 'pushed' : ''}`}>
        <Cut tag={`${spot.arr} · ${spot.dist}m`} name={spot.name} />
      </div>

      <div className={`card ${chromeHidden ? 'low' : ''}`}>
        <div className="card-row">
          <span>{spot.address}</span>
          <span>{spot.dist}m</span>
        </div>
        <p className="quote">“{spot.specFr}”</p>
        <p className="en-copy">{spot.specEn}</p>
        <p className="spec">{spot.details}</p>
        <button className="link" onClick={onOpen}>Ouvrir le dossier / Open file</button>
        <div className="spot-tabs">
          {SPOTS.map((s, i) => (
            <button key={s.id} aria-current={i === spotIndex} onClick={() => onPick(i)}>{s.short}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 02 · BIFURQUER (REROUTE)
// ==========================================
function Reroute({ spotIndex, raining, reason, setReason, onBack, onPick, onShelter, onScroll }) {
  const nextIndex = (spotIndex + 1) % SPOTS.length;
  const nearestIndex = SPOTS
    .map((s, i) => ({ i, d: s.dist }))
    .filter((x) => x.i !== spotIndex)
    .sort((a, b) => a.d - b.d)[0].i;

  return (
    <div className="screen paper">
      <Status label="Reroute" />
      <div className="scroll" onScroll={onScroll}>
        <div className="page-pad">
          <button className="back" onClick={onBack}>← Retour / Back</button>
          <div className="eyebrow">Bifurquer · Reroute</div>
          <h2 className="display">Qu’est-ce qui change ?</h2>
          <p className="display-en">What changed? Drift redraws the walk.</p>

          <div className="reasons">
            <button aria-pressed={reason === 'rain'} onClick={() => setReason('rain')}>
              <RainIcon /><span className="fr">Il pleut</span><span className="en">Rain{raining ? ' · now' : ''}</span>
            </button>
            <button aria-pressed={reason === 'closed'} onClick={() => setReason('closed')}>
              <ClosedIcon /><span className="fr">C’est fermé</span><span className="en">It’s closed</span>
            </button>
            <button aria-pressed={reason === 'less'} onClick={() => setReason('less')}>
              <FeetIcon /><span className="fr">Moins marcher</span><span className="en">I’m tired</span>
            </button>
          </div>

          {!reason && <p className="hint">Choose one and Drift suggests a new direction.</p>}

          {reason === 'rain' && (
            <>
              <div className="plate">
                <Photo src={SHELTER.image} tone={SHELTER.tone} alt={SHELTER.name} />
                <Cut tag="Abri · Shelter · 80m" name={SHELTER.name} />
              </div>
              <p className="body-fr" style={{ fontSize: 16, fontStyle: 'italic', marginTop: 14 }}>{SHELTER.descFr}</p>
              <p className="en-copy">{SHELTER.descEn}</p>
              <ol className="legs">
                {SHELTER.legs.map((l, i) => (
                  <li key={l.fr}><span className="n">{String(i + 1).padStart(2, '0')}</span><div><b>{l.fr}</b><span>{l.en}</span></div></li>
                ))}
              </ol>
              <button className="primary rain" onClick={onShelter}>
                <span className="fr">Prendre la route à sec</span>
                <span className="en">Take the dry route</span>
              </button>
            </>
          )}

          {(reason === 'closed' || reason === 'less') && (
            <AltSpot
              spot={SPOTS[reason === 'closed' ? nextIndex : nearestIndex]}
              why={reason === 'closed' ? 'Suivant sur la liste / Next on your list' : 'Le plus proche / Closest to you'}
              onGo={() => onPick(reason === 'closed' ? nextIndex : nearestIndex)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function AltSpot({ spot, why, onGo }) {
  return (
    <div className="alt-card">
      <div className="eyebrow">{why}</div>
      <div className="name">{spot.name}</div>
      <div className="card-row" style={{ color: '#6f6961' }}>
        <span>{spot.address} · {spot.arrShort}</span><span>{spot.dist}m</span>
      </div>
      <p className="en-copy" style={{ marginTop: 10 }}>{spot.tagFr} · {spot.tagEn}</p>
      <button className="primary" onClick={onGo}>
        <span className="fr">Y aller</span>
        <span className="en">Go there instead</span>
      </button>
    </div>
  );
}

// ==========================================
// 03 · DOSSIER (PLACE FILE)
// ==========================================
function Dossier({ spot, onBack, onGuide, onScroll }) {
  return (
    <div className="screen paper">
      <div className="scroll" onScroll={onScroll}>
        <div className="hero">
          <Photo src={spot.image} tone={spot.tone} alt={spot.name} />
          <Status label="Dossier" onPhoto />
          <button className="back" onClick={onBack}>← Retour / Back</button>
          <Cut tag={`${spot.tagFr} · ${spot.tagEn}`} name={spot.name} />
        </div>
        <div className="dossier-body">
          <div className="facts">
            <div><span className="eyebrow">Adresse</span><b>{spot.address}</b><span>{spot.arr} · {spot.dist}m</span></div>
            <div><span className="eyebrow">Horaires</span><b>{spot.hours}</b><span>{spot.hoursNote}</span></div>
          </div>

          <div className="section-label">Dossier matière / Material file</div>
          <p className="body-fr">{spot.specFr}</p>
          <p className="en-copy">{spot.specEn}</p>

          <div className="section-label">Spécification clé / Key spec</div>
          <p className="spec" style={{ marginTop: 0 }}>{spot.details}</p>

          <button className="primary" onClick={onGuide}>
            <span className="fr">Guider</span>
            <span className="en">Guide me · phone in pocket</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 04 · LE CAHIER (THE REGISTER)
// ==========================================
function Cahier({ held, onToggle, onScroll }) {
  return (
    <div className="screen paper">
      <Status label="Cahier" />
      <div className="scroll" onScroll={onScroll}>
        <div className="page-pad">
          <div className="eyebrow">Le Cahier · The Register</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12 }}>
            <h2 className="display" style={{ fontSize: 44 }}>20–28<br />novembre</h2>
            <span className="eyebrow" style={{ paddingBottom: 8 }}>Ve / IIIe</span>
          </div>
          <p className="display-en">Two evenings worth planning the week around.</p>
          <div className="events" style={{ marginTop: 16 }}>
            {EVENTS_NOV.map((evt) => (
              <article className="event" key={evt.id}>
                <div className="when">{evt.time}<span>{evt.date.toUpperCase()}</span></div>
                <div>
                  <div className="venue">{evt.venue}</div>
                  <h3>{evt.titleFr}</h3>
                  <p className="t-en">{evt.titleEn}</p>
                  <p className="q">“{evt.descFr}”</p>
                  <p className="en-copy">{evt.descEn}</p>
                  <button className="outline" aria-pressed={!!held[evt.id]} onClick={() => onToggle(evt.id)}>
                    <span className="fr">{held[evt.id] ? `✓ ${evt.doneFr}` : evt.actionFr}</span>
                    <span className="en">{held[evt.id] ? evt.doneEn : evt.actionEn}</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 05 · L'ŒIL (LENS)
// ==========================================
function Lens({ spot, onClose, chromeHidden, onToggleChrome }) {
  return (
    <div className="screen dark" onClick={(e) => { if (isOpenSpace(e.target)) onToggleChrome(); }}>
      <Photo src={spot.image} tone={spot.tone} alt={`Camera view at ${spot.name}`} />
      <div className="lens-shade" />
      <div className="lens-top">
        <span className="live"><i /> L’Œil · Lens</span>
        <button className="close" onClick={onClose}>✕ Fermer</button>
      </div>

      <div className="reticle">
        <span className="c tl" /><span className="c tr" /><span className="c bl" /><span className="c br" />
        <span className="chip">{spot.lens.label}</span>
        {spot.lens.lines.map((line) => (
          <div className="line" key={line.fr}>
            <div className="fr">{line.fr}</div>
            <span className="tr-en">{line.en}</span>
          </div>
        ))}
      </div>
      <div className="lens-hint">Hold steady over a menu, tag or label.</div>

      <div className={`intel ${chromeHidden ? 'low' : ''}`}>
        <div className="eyebrow">{spot.lens.intel}</div>
        <div className="name">{spot.name} · {spot.address}</div>
        <p>{spot.details}</p>
      </div>
    </div>
  );
}

// ==========================================
// 06 · POCHE (LOCK SCREEN LIVE ACTIVITY)
// ==========================================
function Pocket({ spot, target, raining, onWake }) {
  const shelter = target === 'shelter';
  const step = shelter ? SHELTER.approach : spot.approach;
  const dist = shelter ? 80 : spot.dist;
  return (
    <button className="lock" onClick={onWake} aria-label="Wake the phone and return to Drift">
      <div className="lock-time">
        <div className="d">Vendredi 21 Novembre</div>
        <div className="t">16:45</div>
      </div>

      <div className="live-card">
        <div className="live-head">
          <b><i /> Drift · {shelter ? '2e Arr.' : spot.arrShort}</b>
          <span>16:45 · 8°</span>
        </div>
        <div className="turn">
          <div className="arrow">{step.arrow}</div>
          <div>
            <b>{dist} m · {step.fr}</b>
            <span>{step.en}</span>
          </div>
        </div>
        <div className="dest">
          <span className="n">{shelter ? SHELTER.name : spot.name}</span>
          <span className="m">
            {shelter
              ? 'Route à sec / Dry route'
              : raining
                ? 'Averse en cours · Reroute pour un abri / Rain: open Drift to Reroute'
                : `${spot.address} · ${spot.hours} · Coucher du soleil 17:02`}
          </span>
        </div>
      </div>

      <div className="lock-foot">
        <em>Phone in pocket. The next turn stays here.</em>
        <i />
        <span>Toucher pour réveiller / Tap to wake</span>
      </div>
    </button>
  );
}

// ==========================================
// ICONS
// ==========================================
function CompassIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}
function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}
function PocketIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  );
}
function RerouteIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
    </svg>
  );
}
function LensIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="3" /><path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" />
    </svg>
  );
}
function RainIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <line x1="16" y1="13" x2="16" y2="21" /><line x1="8" y1="13" x2="8" y2="21" /><line x1="12" y1="15" x2="12" y2="23" />
      <path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25" />
    </svg>
  );
}
function ClosedIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="4" y="3" width="16" height="18" /><path d="M9 9l6 6M15 9l-6 6" />
    </svg>
  );
}
function FeetIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
    </svg>
  );
}

createRoot(document.getElementById('root')).render(<App />);
