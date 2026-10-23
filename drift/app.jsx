import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

// --- CURATED DATASET (Nov 20-28 Paris) ---
const SPOTS = [
  {
    id: 'dehillerin',
    name: 'E. Dehillerin',
    tagFr: 'Cuivre & Outillage',
    tagEn: 'Heavy Copper & Cutlery',
    arr: '1er Arrondissement',
    address: '18 Rue Coquillière',
    dist: '110m',
    hours: '09:00 – 19:00 · Ouvert / Open',
    specFr: 'Cuivre massif 2.5mm–3mm étamé au feu. Queue de fonte rivetée. Aucun prix affiché : relevé au crayon et consultation du grand registre papier.',
    specEn: 'Solid 2.5–3mm hand-wiped tin copper. Riveted cast-iron handles. No price tags: cross-reference hand-punched codes in the central ledger.',
    category: 'cookware',
    coords: '48.8644° N, 2.3431° E',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1200&auto=format&fit=crop',
    details: '2.5mm Cuivre Massif · Réf. 44102 · Détaxe sur place',
    lens: {
      label: 'OCR ÉTIQUETTE / TAG DECODE',
      intel: 'DIAGNOSTIC BOUTIQUE / SHOP INTEL',
      lines: [
        { fr: 'Réf. 44102 — Sauteuse 24 cm', en: '24 cm copper sauté pan' },
        { fr: 'Étamage main · 2.5 mm', en: 'Hand-wiped tin lining · 2.5 mm wall' }
      ]
    },
    approach: { arrow: '↱', fr: 'Tourner à droite après Saint-Eustache', en: 'Turn right past Saint-Eustache onto Rue Coquillière' }
  },
  {
    id: 'chez-denise',
    name: 'Chez Denise (La Tour de Montlhéry)',
    tagFr: 'Bistrot de Nuit & Halles',
    tagEn: 'Historic All-Night Meat Counter',
    arr: '1er Arrondissement',
    address: '5 Rue des Prouvaires',
    dist: '180m',
    hours: 'Ouvert jusqu\'à 05:00 / Open until 5:00 AM',
    specFr: 'Nappes à carreaux rouges, serveurs en longs tabliers, os à moelle brûlants, tripes au bouillon et Brouilly tiré au pot.',
    specEn: 'Red checkered cloth, floor-length white aprons, roasted marrow bones, Caen-style tripe, and Beaujolais by the earthenware jug.',
    category: 'food',
    coords: '48.8619° N, 2.3458° E',
    image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=1200&auto=format&fit=crop',
    details: '4 Couverts libres au comptoir / 4 Open counter seats',
    lens: {
      label: 'OCR ARDOISE / MENU DECODE',
      intel: 'DIAGNOSTIC BISTROT / VENUE INTEL',
      lines: [
        { fr: 'Os à moelle grillé', en: 'Roasted bone marrow / sea salt' },
        { fr: 'Ris de veau au vin jaune', en: 'Crisp veal sweetbreads in Jura wine' }
      ]
    },
    approach: { arrow: '↰', fr: 'Tourner à gauche rue des Prouvaires', en: 'Turn left off Rue Saint-Honoré onto Rue des Prouvaires' }
  },
  {
    id: 'doursoux',
    name: 'Doursoux Surplus Militaire',
    tagFr: 'Toile & Bleu de Travail',
    tagEn: 'Authentic French Workwear Surplus',
    arr: '15e Arrondissement',
    address: '3 Passage Alexandre',
    dist: '340m',
    hours: '10:00 – 18:30 · Mar–Sam / Tue–Sat',
    specFr: 'Rayons d\'acier brut sans mise en scène. Véritables vestes en moleskine et sergé de coton bleu 1950–1970 à prix d\'atelier (30 €–65 €).',
    specEn: 'Raw steel shelves without boutique markups. Authentic French moleskin and indigo cotton chore coats (30 €–65 €).',
    category: 'workwear',
    coords: '48.8385° N, 2.3015° E',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=1200&auto=format&fit=crop',
    details: '30 € – 65 € · Stocks militaires & chemins de fer d\'époque',
    lens: {
      label: 'OCR ÉTIQUETTE / LABEL DECODE',
      intel: 'DIAGNOSTIC BOUTIQUE / SHOP INTEL',
      lines: [
        { fr: 'Veste de travail · Moleskine', en: 'Moleskin chore coat' },
        { fr: 'Taille 50 · Années 1960', en: 'EU 50 (≈ US 40) · 1960s stock' }
      ]
    },
    approach: { arrow: '↑', fr: 'Tout droit boulevard de Vaugirard', en: 'Straight on along Boulevard de Vaugirard to the passage' }
  },
  {
    id: 'baron-rouge',
    name: 'Le Baron Rouge',
    tagFr: 'Zinc & Huîtres au Tonneau',
    tagEn: 'Curb Wine Cask & Fresh Oysters',
    arr: '12e Arrondissement',
    address: '1 Rue Théophile Roussel',
    dist: '60m',
    hours: 'Comptoir Libre / Open Counter',
    specFr: 'Bourriche d\'huîtres ouvertes sur le trottoir le matin. Vin tiré directement de la cuve dans des bouteilles consignées.',
    specEn: 'Breton oysters shucked onto curb crates. Natural wine gravity-poured from oak barrels into refillable carafes.',
    category: 'food',
    coords: '48.8497° N, 2.3785° E',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=1200&auto=format&fit=crop',
    details: 'Sans réservation · Dégustation sur tonneau',
    lens: {
      label: 'OCR ARDOISE / WINE BOARD',
      intel: 'DIAGNOSTIC BISTROT / VENUE INTEL',
      lines: [
        { fr: 'Muscadet sur lie · au verre', en: 'Muscadet aged on lees · by the glass' },
        { fr: 'Huîtres n°3 · la douzaine', en: 'Size 3 oysters · by the dozen' }
      ]
    },
    approach: { arrow: '↱', fr: 'Tourner à droite au marché d\'Aligre', en: 'Turn right at Marché d\'Aligre' }
  }
];

const EVENTS_NOV = [
  {
    id: 'bach-cellos',
    time: '20:30 · 21 NOVEMBRE',
    titleFr: 'Suites pour Violoncelle Seul (J.S. Bach)',
    titleEn: 'Unaccompanied Cello Suites by Candlelight',
    venue: 'Église Saint-Éphrem (Ve Arr.)',
    descFr: 'Nef acoustique en pierre du XVIIe siècle. Éclairage exclusif à la bougie. 45 chaises de bois.',
    descEn: '17th-century vaulted stone chapel. Solely candlelit. 45 wooden seats, pure natural acoustics.',
    actionFr: 'Retenir 4 places',
    actionEn: 'Hold 4 seats'
  },
  {
    id: 'vernissage-estampes',
    time: '18:00 · 23 NOVEMBRE',
    titleFr: 'Vernissage : Typographie & Épreuves d\'Artiste',
    titleEn: 'Vernissage: Typography & Silver Proofs',
    venue: 'Galerie d\'Estampes (Rue Charlot, IIIe)',
    descFr: 'Portes de la cour cochère grandes ouvertes. Tirages argentiques noir et blanc, vin servi au gobelet Duralex.',
    descEn: 'Carriage courtyard wide open. Silver gelatin prints on cotton rag, natural wine in Duralex glasses.',
    actionFr: 'Ajouter au courant',
    actionEn: 'Add to drift'
  }
];

export default function App() {
  const [activeScreen, setActiveScreen] = useState('courant'); // 'courant' | 'pluie' | 'dossier' | 'cahier' | 'oeil' | 'poche'
  const [selectedSpot, setSelectedSpot] = useState(SPOTS[0]);
  const [isRaining, setIsRaining] = useState(false);
  const [chromeVisible, setChromeVisible] = useState(true);
  const [secondsRemaining, setSecondsRemaining] = useState(4);
  const timerRef = useRef(null);

  // 4-Second Auto-Decay Navigation Timer
  const resetTimer = () => {
    setChromeVisible(true);
    setSecondsRemaining(4);
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setChromeVisible(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    resetTimer();
    return () => clearInterval(timerRef.current);
  }, [activeScreen, isRaining]);

  return (
    <div className="w-full min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-start p-2 sm:p-6 select-none font-sans">

      {/* --- TOP CONTROL BAR (SYSTEM DEMO SUITE) --- */}
      <header className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-xl p-3 mb-4 shadow-xl flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-mono tracking-wider uppercase text-neutral-400">Prototype Runtime</span>
          </div>
          <div className="text-[11px] font-mono text-neutral-400">
            Chrome: <span className={chromeVisible ? "text-amber-400 font-bold" : "text-neutral-500"}>
              {chromeVisible ? `Active (${secondsRemaining}s)` : 'Hidden (Quiescent)'}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-neutral-800/80 text-xs text-neutral-400">
          <button
            onClick={() => {
              setIsRaining(!isRaining);
              if (!isRaining) setActiveScreen('pluie');
            }}
            className={`px-2.5 py-1 rounded text-[11px] font-mono transition flex items-center gap-1.5 border ${
              isRaining
                ? 'bg-sky-950/80 border-sky-500 text-sky-200'
                : 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:border-neutral-500'
            }`}
          >
            <span>{isRaining ? '🌧 Météo: Pluie / Rain' : '⛅ Météo: Sec / Dry'}</span>
          </button>
          <button
            onClick={() => setChromeVisible(!chromeVisible)}
            className="text-[11px] font-mono underline hover:text-white"
          >
            {chromeVisible ? 'Force Hide Nav' : 'Simulate Screen Tap'}
          </button>
        </div>
      </header>

      {/* --- PHONE SHELL VIEWPORT --- */}
      <main
        onClick={resetTimer}
        className="relative w-full max-w-[400px] h-[812px] rounded-[44px] overflow-hidden border-[6px] border-neutral-800 shadow-2xl bg-neutral-900"
      >
        {/* PHYSICAL SPEAKER & CAMERA NOTCH */}
        <div className="absolute top-0 inset-x-0 h-7 flex items-center justify-center z-50 pointer-events-none">
          <div className="w-36 h-5 bg-neutral-900 rounded-b-2xl border-b border-neutral-800 flex items-center justify-center">
            <div className="w-10 h-1 bg-neutral-700 rounded-full"></div>
            <div className="w-2 h-2 ml-3 bg-neutral-800 rounded-full border border-neutral-700"></div>
          </div>
        </div>

        {/* --- SCREEN RENDERER ROUTER --- */}
        <div className="w-full h-full relative overflow-hidden">
          {activeScreen === 'courant' && (
            <ScreenCourant spot={selectedSpot} onSelectSpot={setSelectedSpot} onGoDossier={() => setActiveScreen('dossier')} />
          )}

          {activeScreen === 'pluie' && (
            <ScreenPluie onDismiss={() => setActiveScreen('courant')} />
          )}

          {activeScreen === 'dossier' && (
            <ScreenDossier spot={selectedSpot} onBack={() => setActiveScreen('courant')} />
          )}

          {activeScreen === 'cahier' && (
            <ScreenCahier events={EVENTS_NOV} />
          )}

          {activeScreen === 'oeil' && (
            <ScreenOeil spot={selectedSpot} />
          )}

          {activeScreen === 'poche' && (
            <ScreenPoche spot={selectedSpot} isRaining={isRaining} onWake={() => setActiveScreen('courant')} />
          )}
        </div>

        {/* --- AMBIENT FLOATING ACTIONS --- */}
        {activeScreen !== 'poche' && (
          <div
            className={`absolute bottom-24 inset-x-4 z-40 flex items-center justify-between gap-3 transition-all duration-300 pointer-events-auto ${
              chromeVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
            }`}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveScreen(activeScreen === 'pluie' ? 'courant' : 'pluie');
                resetTimer();
              }}
              className="flex-1 py-2.5 px-3 rounded-full text-xs font-bold tracking-tight transition shadow-lg flex items-center justify-center gap-2 border bg-white text-black border-black hover:bg-neutral-200"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/>
              </svg>
              <span>Reroute</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveScreen('oeil');
                resetTimer();
              }}
              className="flex-1 py-2.5 px-3 rounded-full text-xs font-bold tracking-tight transition shadow-lg flex items-center justify-center gap-2 border bg-black text-white border-white hover:bg-neutral-900"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/>
              </svg>
              <span>Lens</span>
            </button>
          </div>
        )}

        {/* --- AUTO-HIDING BILINGUAL BOTTOM NAVIGATION: EDITORIAL FOLIO BAR --- */}
        {activeScreen !== 'poche' && (
          <nav
            className={`absolute bottom-5 inset-x-3 z-40 transition-all duration-400 ease-out ${
              chromeVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
            }`}
          >
            <div className="bg-neutral-900 border-t-2 border-white/20 p-2 shadow-2xl flex items-center justify-between text-neutral-200">
              <NavButton
                active={activeScreen === 'courant'}
                onClick={() => { setActiveScreen('courant'); resetTimer(); }}
                labelFr="COURANT" labelEn="DRIFT"
                icon={<CompassIcon />}
              />
              <NavButton
                active={activeScreen === 'pluie'}
                onClick={() => { setActiveScreen('pluie'); resetTimer(); }}
                labelFr="PLUIE" labelEn="RAIN"
                icon={<RainIcon />}
              />
              <NavButton
                active={activeScreen === 'cahier'}
                onClick={() => { setActiveScreen('cahier'); resetTimer(); }}
                labelFr="CAHIER" labelEn="REGISTER"
                icon={<BookIcon />}
              />
              <NavButton
                active={activeScreen === 'oeil'}
                onClick={() => { setActiveScreen('oeil'); resetTimer(); }}
                labelFr="L'ŒIL" labelEn="LENS"
                icon={<ApertureIcon />}
              />
              <NavButton
                active={activeScreen === 'poche'}
                onClick={() => { setActiveScreen('poche'); resetTimer(); }}
                labelFr="POCHE" labelEn="POCKET"
                icon={<PocketIcon />}
              />
            </div>
          </nav>
        )}

      </main>
    </div>
  );
}

// ==========================================
// SCREEN 1: LE COURANT (THE DRIFT)
// ==========================================
function ScreenCourant({ spot, onSelectSpot, onGoDossier }) {
  return (
    <div className="relative w-full h-full">
      {/* Background Media */}
      <img
        src={spot.image}
        alt={spot.name}
        className="w-full h-full object-cover contrast-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/70" />

      {/* Top Telemetry Header */}
      <div className="absolute top-9 inset-x-5 flex justify-between items-start z-10 font-mono text-[11px] tracking-wider text-neutral-200">
        <div>
          <span className="font-bold tracking-widest">DÉRIVE</span>
          <span className="mx-1.5 opacity-40">·</span>
          <span>{spot.arr}</span>
        </div>
        <div className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded border border-white/20">
          15:10 · 8°C
        </div>
      </div>

      {/* Ragged cut-out label over the visual */}
      <div className="absolute top-20 left-5 right-5 space-y-1.5 pointer-events-none">
        <div className="inline-block bg-white text-black font-mono text-[10px] font-bold uppercase px-2 py-0.5 tracking-wider shadow">
          {spot.arr} · {spot.dist}
        </div>
        <br />
        <h1 className="inline-block bg-white text-black font-black text-2xl tracking-tighter px-2.5 py-1 uppercase shadow leading-none">
          {spot.name}
        </h1>
      </div>

      {/* Bottom Context Details Card */}
      <div className="absolute bottom-36 inset-x-5 z-20">
        <div
          onClick={onGoDossier}
          className="cursor-pointer bg-neutral-900 border-t-2 border-white p-3.5 shadow-2xl space-y-2 hover:bg-neutral-800 transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">{spot.address}</span>
            <span className="text-xs font-mono font-bold text-white">{spot.dist}</span>
          </div>
          <p className="text-xs text-neutral-200 font-serif italic leading-snug">
            "{spot.specFr}"
          </p>
          <p className="text-[11px] text-neutral-400 font-sans leading-tight">
            {spot.specEn}
          </p>
          <div className="pt-1.5 flex justify-between items-center text-[10px] font-mono text-neutral-300 uppercase">
            <span>{spot.details}</span>
            <span className="underline font-bold text-white">OUVRIR ARCHIVE →</span>
          </div>
        </div>

        {/* Spot Carousel Switcher Dots */}
        <div className="flex justify-center items-center gap-2 mt-3">
          {SPOTS.map((s) => (
            <button
              key={s.id}
              onClick={(e) => {
                e.stopPropagation();
                onSelectSpot(s);
              }}
              className={`h-1.5 rounded-full transition-all ${
                s.id === spot.id ? 'w-6 bg-white' : 'w-1.5 bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// SCREEN 2: BIFURCATION (RAIN REROUTE)
// ==========================================
function ScreenPluie({ onDismiss }) {
  return (
    <div className="relative w-full h-full bg-neutral-950">
      <img
        src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1200&auto=format&fit=crop"
        alt="Passage des Panoramas"
        className="w-full h-full object-cover contrast-110 brightness-75"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80" />

      {/* Header */}
      <div className="absolute top-9 inset-x-5 flex justify-between items-center z-10 font-mono text-xs text-neutral-200">
        <span className="text-sky-400 font-bold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping"></span>
          BIFURCATION · AVERSE / RAIN
        </span>
        <button onClick={onDismiss} className="underline text-neutral-400 hover:text-white">FERMER / CLOSE</button>
      </div>

      <div className="absolute top-24 inset-x-5 space-y-2 pointer-events-none">
        <div className="inline-block bg-sky-500 text-black font-mono text-[10px] font-bold uppercase px-2 py-0.5">
          COUVERTURE IMMÉDIATE / SHELTER VECTOR
        </div>
        <h2 className="text-2xl font-black uppercase text-white tracking-tight leading-tight">
          Passage des Panoramas
        </h2>
        <p className="text-xs text-neutral-300 font-serif">
          Verrière de 1799. Sol sec, librairies philatéliques et comptoirs en bois chauffés.
          <span className="block text-[11px] text-neutral-400 font-sans mt-0.5">
            1799 glass arcade. Dry passage, antique print dealers, and heated timber cafes.
          </span>
        </p>
      </div>

      {/* Trajectory Legs List */}
      <div className="absolute bottom-36 inset-x-5 space-y-2 z-20">
        <div className="bg-black/85 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-xs space-y-2.5">
          <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-bold">
            ITINÉRAIRE À SEC / DRY DRIFT LEGS (80M)
          </div>

          <div className="flex items-start gap-2.5 text-neutral-200">
            <span className="font-mono text-sky-400 font-bold">01</span>
            <div>
              <div className="font-bold">Entrée Rue Vivienne (Abri immédiat)</div>
              <div className="text-[11px] text-neutral-400">Immediate sheltered entrance 80m ahead</div>
            </div>
          </div>

          <div className="flex items-start gap-2.5 text-neutral-200">
            <span className="font-mono text-sky-400 font-bold">02</span>
            <div>
              <div className="font-bold">Liaison continue : Jouffroy & Verdeau</div>
              <div className="text-[11px] text-neutral-400">Continuous sheltered crossing toward 9e Arr.</div>
            </div>
          </div>

          <button
            onClick={onDismiss}
            className="w-full mt-2 py-2 bg-sky-500 hover:bg-sky-400 text-black font-bold font-mono text-xs rounded-xl tracking-wider uppercase transition"
          >
            ENGAGER LA LIGNE / ENGAGE ROUTE
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// SCREEN 3: PLAQUE TOURNANTE & DOSSIER DÉTAIL
// ==========================================
function ScreenDossier({ spot, onBack }) {
  return (
    <div className="relative w-full h-full bg-neutral-950 overflow-y-auto pb-32">
      <div className="relative h-72 w-full">
        <img
          src={spot.image}
          alt={spot.name}
          className="w-full h-full object-cover contrast-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-black/70" />
        <button
          onClick={onBack}
          className="absolute top-9 left-5 font-mono text-xs bg-black/60 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-white flex items-center gap-1.5"
        >
          <span>←</span> RETOUR / BACK
        </button>
        <div className="absolute bottom-4 left-5 right-5">
          <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
            {spot.tagFr} · {spot.tagEn}
          </span>
          <h1 className="text-2xl font-black uppercase text-white tracking-tight">{spot.name}</h1>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Metric Badges */}
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="bg-neutral-900 border border-neutral-800 p-2.5 rounded-xl">
            <div className="text-neutral-500 text-[10px]">LOCALISATION / LOC</div>
            <div className="font-bold text-neutral-200 mt-0.5">{spot.address}</div>
            <div className="text-[10px] text-neutral-400">{spot.arr}</div>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 p-2.5 rounded-xl">
            <div className="text-neutral-500 text-[10px]">HORAIRES / ACCESS</div>
            <div className="font-bold text-neutral-200 mt-0.5">{spot.hours}</div>
            <div className="text-[10px] text-emerald-400">Direct Entry / No Queue</div>
          </div>
        </div>

        {/* Narrative & Craft Analysis */}
        <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4 space-y-2">
          <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-bold">
            DOSSIER MATIÈRE / MATERIAL ARCHIVE
          </div>
          <p className="text-xs text-neutral-200 font-serif leading-relaxed">
            {spot.specFr}
          </p>
          <p className="text-xs text-neutral-400 font-sans leading-relaxed pt-2 border-t border-neutral-800">
            {spot.specEn}
          </p>
        </div>

        {/* Spot Unique Diagnostic */}
        <div className="bg-black border border-white/10 rounded-2xl p-3.5 flex items-center justify-between text-xs font-mono">
          <div>
            <div className="text-neutral-500 text-[10px]">SPÉCIFICATION CLÉ / KEY SPEC</div>
            <div className="text-white font-bold">{spot.details}</div>
          </div>
          <button className="px-3 py-1.5 bg-white text-black font-bold rounded-lg text-[11px] hover:bg-neutral-200 transition">
            GUIDER / ROUTE
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// SCREEN 4: LE CAHIER (CULTURAL REGISTER)
// ==========================================
function ScreenCahier({ events }) {
  return (
    <div className="relative w-full h-full bg-neutral-950 p-5 pt-10 overflow-y-auto pb-32">
      <div className="flex justify-between items-baseline border-b border-white/20 pb-2 mb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold">
            LE CAHIER / THE REGISTER
          </span>
          <h1 className="text-2xl font-black uppercase text-white tracking-tight">20–28 Novembre</h1>
        </div>
        <span className="text-xs font-mono text-neutral-400">Ve / IIIe Arr.</span>
      </div>

      <div className="space-y-4">
        {events.map((evt) => (
          <div
            key={evt.id}
            className="border rounded-2xl p-4 space-y-2.5 transition bg-neutral-900 border-white/20"
          >
            <div className="flex justify-between items-center text-[10px] font-mono text-amber-400 font-bold uppercase">
              <span>{evt.time}</span>
              <span className="text-neutral-400">{evt.venue}</span>
            </div>

            <div>
              <h2 className="text-sm font-bold text-white tracking-tight leading-snug">{evt.titleFr}</h2>
              <div className="text-xs text-neutral-400 font-sans">{evt.titleEn}</div>
            </div>

            <p className="text-xs font-serif text-neutral-300 leading-relaxed">
              "{evt.descFr}"
            </p>
            <p className="text-[11px] font-sans text-neutral-400 leading-normal">
              {evt.descEn}
            </p>

            <button className="w-full py-2 bg-neutral-100 hover:bg-white text-black font-mono font-bold text-xs rounded-xl tracking-wider uppercase transition">
              {evt.actionFr} / {evt.actionEn}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// SCREEN 5: L'ŒIL (OPTICAL VIEWFINDER & OCR)
// ==========================================
function ScreenOeil({ spot }) {
  return (
    <div className="relative w-full h-full bg-black">
      {/* Viewfinder: simulated camera feed of the selected spot */}
      <img
        src={spot.image}
        alt={`Viewfinder: ${spot.name}`}
        className="w-full h-full object-cover contrast-110"
      />
      <div className="absolute inset-0 bg-black/30" />

      {/* Optical HUD Grid */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6">
        <div className="flex justify-between items-center text-[10px] font-mono text-emerald-400">
          <div className="flex items-center gap-1.5 bg-black/60 px-2 py-0.5 rounded border border-white/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            L'ŒIL ACTIF · SCANNING 60FPS
          </div>
          <span className="text-neutral-300">ISO 400 · 1/125s</span>
        </div>

        {/* Target Reticle decoding the sign, slate or label in frame */}
        <div className="self-center w-56 min-h-44 border-2 border-dashed border-amber-400/80 rounded-xl relative flex flex-col items-center justify-center p-2 text-center bg-black/40 backdrop-blur-xs">
          <span className="text-[9px] font-mono uppercase bg-amber-400 text-black px-1.5 font-bold mb-1">
            {spot.lens.label}
          </span>
          {spot.lens.lines.map((line, i) => (
            <div key={line.fr} className={i > 0 ? 'mt-1' : ''}>
              <div className="text-xs font-bold text-white leading-tight">
                {line.fr}
              </div>
              <div className="text-[10px] font-mono text-neutral-300 mt-0.5">
                [{line.en}]
              </div>
            </div>
          ))}
        </div>

        {/* Optical Analysis Card */}
        <div className="bg-black/85 backdrop-blur-xl border border-white/20 rounded-2xl p-3 text-xs font-mono space-y-1 mb-32">
          <div className="text-amber-400 font-bold text-[10px] uppercase">
            {spot.lens.intel}
          </div>
          <div className="text-white font-bold text-sm">{spot.name} — {spot.address}</div>
          <div className="text-neutral-400 text-[11px]">
            {spot.details}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// SCREEN 6: MODE POCHE (LOCK SCREEN LIVE ACTIVITY)
// ==========================================
function ScreenPoche({ spot, isRaining, onWake }) {
  return (
    <div
      onClick={onWake}
      className="relative w-full h-full bg-gradient-to-b from-neutral-900 via-neutral-950 to-black p-6 flex flex-col justify-between cursor-pointer"
    >
      {/* iOS Lock Screen Header */}
      <div className="pt-12 text-center space-y-1">
        <div className="text-xs font-mono text-neutral-400 tracking-widest uppercase">Vendredi 21 Novembre</div>
        <div className="text-6xl font-light text-white tracking-tighter">16:45</div>
      </div>

      {/* Live Activity Notification Card: next turn toward the selected spot */}
      <div className="w-full bg-neutral-900/90 border border-neutral-700/80 rounded-3xl p-4 shadow-2xl backdrop-blur-2xl space-y-3">
        <div className="flex justify-between items-center text-[10px] font-mono text-neutral-400 border-b border-neutral-800 pb-2">
          <span className="font-bold text-white flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            DÉRIVE · {spot.arr}
          </span>
          <span>16:45 · 8°C</span>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-2xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-amber-400 font-bold font-mono text-sm">
            {spot.approach.arrow}
          </div>
          <div className="flex-1">
            <div className="text-xs font-bold text-white leading-tight">
              {spot.dist} : {spot.approach.fr}
            </div>
            <div className="text-[11px] text-neutral-400 font-sans">
              {spot.approach.en}
            </div>
          </div>
        </div>

        <div className="bg-black/60 rounded-xl p-2.5 text-[11px] font-mono space-y-1 text-neutral-300 border border-neutral-800">
          <div className="flex justify-between gap-2">
            <span className="text-white font-bold">{spot.name}</span>
            <span className="text-emerald-400 shrink-0">{spot.address}</span>
          </div>
          <div className="text-neutral-400 text-[10px]">
            {isRaining ? 'Averse en cours · Reroute pour un abri / Rain: open Reroute for shelter' : `${spot.hours} · Coucher du soleil 17:02`}
          </div>
        </div>
      </div>

      {/* Swipe cue */}
      <div className="pb-4 text-center">
        <div className="w-32 h-1 bg-white/40 rounded-full mx-auto mb-2"></div>
        <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
          Toucher l'écran pour réveiller / Tap to wake
        </span>
      </div>
    </div>
  );
}

// ==========================================
// NAVIGATION ICON & BUTTON COMPONENTS
// ==========================================
function NavButton({ active, onClick, labelFr, labelEn, icon }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`flex-1 py-1 flex flex-col items-center justify-center transition-all border-b-2 ${
        active ? 'border-white text-white font-bold' : 'border-transparent text-neutral-500 hover:text-neutral-300'
      }`}
    >
      <div className="w-4 h-4 mb-0.5">{icon}</div>
      <span className="text-[9px] font-mono uppercase tracking-tight">{labelFr}</span>
      <span className="text-[7px] font-mono opacity-50 uppercase">{labelEn}</span>
    </button>
  );
}

function CompassIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
      <circle cx="12" cy="12" r="10"/>
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
    </svg>
  );
}

function RainIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
      <line x1="16" y1="13" x2="16" y2="21"/>
      <line x1="8" y1="13" x2="8" y2="21"/>
      <line x1="12" y1="15" x2="12" y2="23"/>
      <path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"/>
    </svg>
  );
}

function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  );
}

function ApertureIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
      <circle cx="12" cy="12" r="10"/>
      <line x1="14.31" y1="8" x2="20.05" y2="17.94"/>
      <line x1="9.69" y1="8" x2="21.17" y2="8"/>
      <line x1="7.38" y1="12" x2="13.12" y2="2.06"/>
      <line x1="9.69" y1="16" x2="3.95" y2="6.06"/>
      <line x1="14.31" y1="16" x2="2.83" y2="16"/>
      <line x1="16.62" y1="12" x2="10.88" y2="21.94"/>
    </svg>
  );
}

function PocketIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
      <line x1="12" y1="18" x2="12.01" y2="18"/>
    </svg>
  );
}

createRoot(document.getElementById('root')).render(<App />);
