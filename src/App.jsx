import { useState, useEffect } from "react";

// ============================================================================
// DATA
// ============================================================================

const QUESTIONS = [
  { id: "q1", trait: "confiance", text: "Face à un échec, tu as tendance à...",
    options: [
      { label: "Abandonner et passer à autre chose", value: 1 },
      { label: "Ruminer un moment avant de retenter", value: 3 },
      { label: "Changer de méthode et retenter vite", value: 5 },
    ]},
  { id: "q2", trait: "confiance", text: "Dans un groupe, tu préfères...",
    options: [
      { label: "Observer avant de parler", value: 2 },
      { label: "Attendre qu'on te demande ton avis", value: 3 },
      { label: "Donner ton avis spontanément", value: 5 },
    ]},
  { id: "q3", trait: "confiance", text: "Une critique sur ton travail, ça te touche...",
    options: [
      { label: "Plusieurs jours", value: 1 },
      { label: "Une soirée, puis ça passe", value: 3 },
      { label: "Quelques minutes tout au plus", value: 5 },
    ]},
  { id: "q4", trait: "attention", text: "Quand tu lis ou travailles, ton esprit part ailleurs...",
    options: [
      { label: "Très souvent, presque toutes les minutes", value: 1 },
      { label: "De temps en temps", value: 3 },
      { label: "Rarement, je reste concentré longtemps", value: 5 },
    ]},
  { id: "q5", trait: "attention", text: "Ton téléphone vibre pendant une tâche importante, tu...",
    options: [
      { label: "Regardes tout de suite", value: 1 },
      { label: "Résistes un peu puis regardes", value: 3 },
      { label: "Ignores jusqu'à la fin de la tâche", value: 5 },
    ]},
  { id: "q6", trait: "resilience", text: "Une mauvaise nouvelle inattendue, ta première réaction...",
    options: [
      { label: "Ça me bloque un bon moment", value: 1 },
      { label: "Je digère, puis j'agis", value: 3 },
      { label: "Je cherche direct une solution", value: 5 },
    ]},
  { id: "q7", trait: "resilience", text: "Quand un projet ne va pas comme prévu...",
    options: [
      { label: "Je perds toute motivation", value: 1 },
      { label: "Je m'accorde une pause avant de reprendre", value: 3 },
      { label: "Je vois ça comme un ajustement normal", value: 5 },
    ]},
  { id: "q8", trait: "social", text: "Rencontrer de nouvelles personnes, pour toi c'est...",
    options: [
      { label: "Plutôt épuisant", value: 1 },
      { label: "Ça dépend du contexte", value: 3 },
      { label: "Plutôt stimulant", value: 5 },
    ]},
  { id: "q9", trait: "social", text: "Demander de l'aide à quelqu'un, tu trouves ça...",
    options: [
      { label: "Difficile, je préfère me débrouiller seul", value: 1 },
      { label: "Faisable si vraiment nécessaire", value: 3 },
      { label: "Naturel, je n'hésite pas", value: 5 },
    ]},
  { id: "q10", trait: "attention", text: "En fin de journée, tu sens que ton attention...",
    options: [
      { label: "S'est éparpillée sur plein de petites choses", value: 1 },
      { label: "A tenu, avec quelques baisses", value: 3 },
      { label: "Est restée stable sur l'essentiel", value: 5 },
    ]},
];

const TRAITS = {
  confiance: {
    label: "Confiance",
    low: "Tu doutes souvent de toi avant même d'essayer. On travaille sur des petites preuves concrètes de ta valeur, pas des affirmations vagues.",
    mid: "Ta confiance tient, mais elle vacille sous pression. On construit des points d'appui solides pour les moments qui comptent.",
    high: "Tu rebondis bien après un échec. On peut affiner ça pour que ça tienne aussi dans les situations à fort enjeu.",
  },
  attention: {
    label: "Attention",
    low: "Ton esprit part vite ailleurs. On commence par des exercices courts pour rallonger progressivement tes plages de concentration.",
    mid: "Tu tiens le cap avec quelques baisses. Un entraînement régulier peut stabiliser ça sur des sessions plus longues.",
    high: "Ta concentration est déjà un point fort. On peut la canaliser vers des objectifs plus ambitieux.",
  },
  resilience: {
    label: "Résilience",
    low: "Les coups durs te marquent longtemps. On pose des routines simples pour rebondir plus vite, sans nier ce que tu ressens.",
    mid: "Tu absorbes les chocs avec un temps de digestion. On peut raccourcir ce temps sans le supprimer.",
    high: "Tu vois déjà les obstacles comme des ajustements. On peut en faire une vraie force que tu identifies consciemment.",
  },
  social: {
    label: "Aisance sociale",
    low: "Le contact social te coûte de l'énergie. On y va à ton rythme, sans forcer un profil extraverti qui ne te correspond pas.",
    mid: "Ça dépend beaucoup du contexte pour toi. On repère ce qui te met à l'aise pour le reproduire plus souvent.",
    high: "Tu es à l'aise avec les autres. On peut se concentrer sur la profondeur des liens plutôt que leur nombre.",
  },
};

const ARCHETYPES = {
  confiance: { key: "confiance", name: "LE MOTEUR", text: "Ta force, c'est l'élan : tu avances même sans certitude. Ce qui peut te freiner, c'est de tenir cet élan dans la durée sans t'épuiser." },
  attention: { key: "attention", name: "L'OBSERVATEUR", text: "Ta force, c'est la capacité à te poser et à remarquer ce que d'autres survolent. Ce qui peut te freiner, c'est de transformer cette observation en action." },
  resilience: { key: "resilience", name: "LE BÂTISSEUR", text: "Ta force, c'est de continuer à construire même après un coup dur. Ce qui peut te freiner, c'est de t'accorder le temps de souffler avant de repartir." },
  social: { key: "social", name: "LE RASSEMBLEUR", text: "Ta force, c'est la facilité à créer du lien avec les autres. Ce qui peut te freiner, c'est de te retrouver seul face à toi-même." },
};

const HOW_IT_WORKS = [
  { n: "01", title: "Réponds", text: "Dix questions courtes, trois minutes, aucune inscription requise." },
  { n: "02", title: "Découvre", text: "Un score sur chaque axe et un archétype qui résume ton profil." },
  { n: "03", title: "Progresse", text: "Des exercices hebdomadaires ciblés sur ton point faible réel." },
];

const FAQ = [
  { q: "Est-ce un vrai diagnostic médical ?", a: "Non. C'est un outil d'auto-évaluation qui donne un point de départ, pas un diagnostic clinique. Pour toute question de santé, un professionnel reste la bonne adresse." },
  { q: "Je peux annuler quand je veux ?", a: "Oui, l'abonnement au programme est sans engagement, tu arrêtes quand tu veux." },
  { q: "La séance individuelle, c'est avec qui ?", a: "Avec un coach qui prend le temps de comprendre ta situation et de bâtir un plan concret avec toi." },
];

const BOOST_EXERCISES = [
  { id: "b1", title: "Trois gratitudes", time: "2 min", text: "Note trois choses, petites ou grandes, pour lesquelles tu es reconnaissant aujourd'hui. Sois précis plutôt que général." },
  { id: "b2", title: "Respiration 4-7-8", time: "3 min", text: "Inspire 4 secondes, retiens 7 secondes, expire 8 secondes. Répète 4 fois. Ça calme le système nerveux presque instantanément." },
  { id: "b3", title: "Reformule la pensée", time: "5 min", text: "Prends une pensée négative du jour et écris-la. Puis demande-toi : est-ce vraiment aussi grave, tout le temps, et de ma faute ? Réécris-la de façon plus juste." },
  { id: "b4", title: "Marche courte", time: "10 min", text: "Sors marcher 10 minutes, sans téléphone si possible. Le mouvement et la lumière naturelle font une vraie différence sur l'humeur." },
  { id: "b5", title: "Un message qui compte", time: "2 min", text: "Envoie un message à quelqu'un juste pour prendre des nouvelles ou dire merci. Le lien social est un des leviers les plus fiables contre le moral bas." },
  { id: "b6", title: "Ta petite victoire", time: "2 min", text: "Note une chose, même minime, que tu as réussi à faire aujourd'hui. Le cerveau a besoin de preuves concrètes, pas juste de bonnes intentions." },
];

// Remplace ce lien par ton vrai lien Stripe une fois créé.
const PAYMENT_LINK = "https://buy.stripe.com/REMPLACE_PAR_TON_LIEN";

// Photos placeholder — à remplacer par tes propres visuels.
const HERO_IMAGE = "https://picsum.photos/seed/strive-hero/1200/1400";
const ARCHETYPE_IMAGES = {
  confiance: "https://picsum.photos/seed/moteur/600/600",
  attention: "https://picsum.photos/seed/observateur/600/600",
  resilience: "https://picsum.photos/seed/batisseur/600/600",
  social: "https://picsum.photos/seed/rassembleur/600/600",
};

const PALETTE = {
  bg: "#0D0F1A",
  panel: "rgba(255,255,255,0.04)",
  white: "#F4F6FB",
  muted: "rgba(244,246,251,0.6)",
  line: "rgba(244,246,251,0.14)",
  teal: "#2FE0C6",
  magenta: "#F0529B",
  orange: "#FFA35C",
  gold: "#FFC24B",
};

const GRADIENT_COOL = `linear-gradient(120deg, ${PALETTE.teal}, ${PALETTE.magenta})`;
const GRADIENT_WARM = `linear-gradient(120deg, ${PALETTE.gold}, ${PALETTE.orange})`;

// ============================================================================
// HELPERS
// ============================================================================

function computeScores(answers) {
  const sums = {}, counts = {};
  QUESTIONS.forEach((q) => {
    const v = answers[q.id];
    if (v == null) return;
    sums[q.trait] = (sums[q.trait] || 0) + v;
    counts[q.trait] = (counts[q.trait] || 0) + 1;
  });
  const avg = {};
  Object.keys(sums).forEach((t) => { avg[t] = sums[t] / counts[t]; });
  return avg;
}

function tierFor(score) {
  if (score <= 2.3) return "low";
  if (score <= 3.8) return "mid";
  return "high";
}

function computeArchetype(scores) {
  const entries = Object.entries(scores);
  if (entries.length === 0) return null;
  const [strongestKey] = entries.reduce((a, b) => (b[1] > a[1] ? b : a));
  const [, weakestScore] = entries.reduce((a, b) => (b[1] < a[1] ? b : a));
  return { archetype: ARCHETYPES[strongestKey], growthScore: weakestScore };
}

// ============================================================================
// SMALL UI PIECES
// ============================================================================

function GradientText({ children, gradient, style }) {
  return (
    <span style={{
      background: gradient,
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      color: "transparent",
      ...style,
    }}>
      {children}
    </span>
  );
}

function GlassPanel({ children, style, maxWidth }) {
  return (
    <div style={{
      background: PALETTE.panel,
      border: `1px solid ${PALETTE.line}`,
      borderRadius: 20,
      backdropFilter: "blur(10px)",
      maxWidth,
      ...style,
    }}>
      {children}
    </div>
  );
}

function PrimaryButton({ children, onClick, gradient = GRADIENT_COOL, as = "button", href, style }) {
  const shared = {
    display: "inline-block",
    background: gradient,
    color: "#0D0F1A",
    border: "none",
    borderRadius: 999,
    padding: "16px 34px",
    fontSize: 15,
    fontWeight: 400,
    cursor: "pointer",
    textDecoration: "none",
    ...style,
  };
  if (as === "a") {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="cta display" style={shared}>
        {children}
      </a>
    );
  }
  return (
    <button className="cta display" onClick={onClick} style={shared}>
      {children}
    </button>
  );
}

// ============================================================================
// MAIN APP
// ============================================================================

export default function App() {
  const [stage, setStage] = useState("landing"); // landing | quiz | result | boost | tracking
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [boostDone, setBoostDone] = useState({});
  const [goal, setGoal] = useState("");
  const [goalDraft, setGoalDraft] = useState("");
  const [lastResult, setLastResult] = useState(null);

  const scores = stage === "result" ? computeScores(answers) : {};
  const result = stage === "result" ? computeArchetype(scores) : null;

  // Remember the most recent completed diagnostic so the tracking tab can use it.
  useEffect(() => {
    if (stage === "result" && result) setLastResult(result);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  const startQuiz = () => { setAnswers({}); setStep(0); setStage("quiz"); };
  const goTo = (s) => setStage(s);

  const answer = (value) => {
    const q = QUESTIONS[step];
    const next = { ...answers, [q.id]: value };
    setAnswers(next);
    if (step + 1 < QUESTIONS.length) setStep(step + 1);
    else setStage("result");
  };

  const toggleBoost = (id) => setBoostDone((prev) => ({ ...prev, [id]: !prev[id] }));

  const saveGoal = () => {
    if (goalDraft.trim()) setGoal(goalDraft.trim());
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: PALETTE.bg,
      color: PALETTE.white,
      display: "flex",
      justifyContent: "center",
      padding: "60px 24px",
      position: "relative",
      overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        .display { font-family: 'Anton', sans-serif; text-transform: uppercase; letter-spacing: 0.5px; }
        .sans { font-family: 'Inter', sans-serif; }
        .tag { font-family: 'Inter', sans-serif; text-transform: uppercase; letter-spacing: 2px; }

        @keyframes driftA { 0%, 100% { transform: translate(0,0) scale(1); } 50% { transform: translate(60px, 40px) scale(1.15); } }
        @keyframes driftB { 0%, 100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-50px, -30px) scale(1.1); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .stage-in { animation: fadeUp 450ms ease both; }

        input:focus { border-color: ${PALETTE.teal} !important; }

        button.opt {
          transition: background 200ms ease, border-color 200ms ease, transform 200ms ease;
        }
        button.opt:hover {
          border-color: ${PALETTE.teal} !important;
          background: rgba(47,224,198,0.08) !important;
          transform: translateX(4px);
        }
        .cta { transition: transform 220ms cubic-bezier(.2,.8,.2,1), filter 220ms ease; }
        .cta:hover { transform: scale(1.03); filter: brightness(1.08); }
        .bar-fill { transition: width 700ms cubic-bezier(.2,.8,.2,1); }
        .nav-link { transition: color 200ms ease; }
      `}</style>

      {/* fluid gradient blobs */}
      <div style={{ position: "absolute", top: "-10%", left: "-10%", width: 480, height: 480, borderRadius: "50%", background: PALETTE.magenta, filter: "blur(140px)", opacity: 0.26, animation: "driftA 16s ease-in-out infinite", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-15%", right: "-10%", width: 520, height: 520, borderRadius: "50%", background: PALETTE.teal, filter: "blur(150px)", opacity: 0.2, animation: "driftB 18s ease-in-out infinite", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "30%", right: "20%", width: 320, height: 320, borderRadius: "50%", background: PALETTE.orange, filter: "blur(130px)", opacity: 0.14, animation: "driftA 22s ease-in-out infinite", pointerEvents: "none" }} />

      <div key={stage} className="stage-in" style={{ maxWidth: stage === "landing" ? 980 : 560, width: "100%", position: "relative" }}>

        {/* NAV */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: stage === "landing" ? 56 : 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
            <button className="display nav-link" onClick={() => goTo("landing")} style={{ fontSize: 18, background: "transparent", border: "none", color: PALETTE.white, cursor: "pointer", padding: 0 }}>
              STRIVE
            </button>
            <button className="sans nav-link" onClick={() => goTo("boost")} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 13, color: stage === "boost" ? PALETTE.teal : PALETTE.muted }}>
              Boost
            </button>
            <button className="sans nav-link" onClick={() => goTo("tracking")} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 13, color: stage === "tracking" ? PALETTE.teal : PALETTE.muted }}>
              Suivi
            </button>
          </div>
          {stage !== "landing" && (
            <button className="sans nav-link" onClick={() => goTo("landing")} style={{ background: "transparent", border: "none", color: PALETTE.muted, fontSize: 13, cursor: "pointer" }}>
              ← Accueil
            </button>
          )}
        </div>

        {/* ============================== LANDING ============================== */}
        {stage === "landing" && (
          <div>
            <div style={{ display: "flex", gap: 56, flexWrap: "wrap-reverse", alignItems: "center" }}>
              <div style={{ flex: "1 1 380px" }}>
                <p className="tag" style={{ fontSize: 12, color: PALETTE.muted, marginBottom: 24 }}>
                  Diagnostic — 10 questions
                </p>
                <h1 className="display" style={{ fontSize: 56, lineHeight: 0.95, margin: "0 0 30px" }}>
                  Connais
                  <br />
                  ta force.
                </h1>
                <p className="sans" style={{ fontSize: 16, color: PALETTE.muted, lineHeight: 1.7, margin: "0 0 40px", maxWidth: 400 }}>
                  Confiance, attention, résilience, aisance sociale. Dix questions,
                  un profil précis, et un plan pour progresser — pas un contenu
                  générique.
                </p>
                <PrimaryButton onClick={startQuiz}>Commencer</PrimaryButton>
              </div>

              <div style={{ flex: "1 1 320px", position: "relative", aspectRatio: "5 / 6", overflow: "hidden", borderRadius: 24 }}>
                <img
                  src={HERO_IMAGE}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(1) contrast(1.1)", display: "block" }}
                />
                <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, transparent 40%, ${PALETTE.bg} 100%)` }} />
              </div>
            </div>

            {/* Goal setting */}
            <GlassPanel style={{ marginTop: 90, padding: "28px 26px" }}>
              <p className="tag" style={{ fontSize: 12, color: PALETTE.muted, marginBottom: 14 }}>Ton but</p>
              {!goal ? (
                <div>
                  <p className="sans" style={{ fontSize: 15, color: PALETTE.white, lineHeight: 1.6, margin: "0 0 18px" }}>
                    Avant de commencer, formule un objectif concret. Ça donne un fil conducteur à tout ce que tu feras ici.
                  </p>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <input
                      className="sans"
                      value={goalDraft}
                      onChange={(e) => setGoalDraft(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && saveGoal()}
                      placeholder="Ex. : Oser prendre la parole en cours d'ici juin"
                      style={{
                        flex: "1 1 260px",
                        background: "rgba(255,255,255,0.06)",
                        border: `1px solid ${PALETTE.line}`,
                        borderRadius: 12,
                        padding: "13px 16px",
                        color: PALETTE.white,
                        fontSize: 14,
                        outline: "none",
                      }}
                    />
                    <PrimaryButton onClick={saveGoal} style={{ padding: "13px 22px", fontSize: 13, borderRadius: 12 }}>
                      Fixer
                    </PrimaryButton>
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                  <p className="sans" style={{ fontSize: 16, color: PALETTE.white, lineHeight: 1.5, margin: 0 }}>{goal}</p>
                  <button className="sans" onClick={() => { setGoal(""); setGoalDraft(""); }} style={{ background: "transparent", border: "none", color: PALETTE.muted, fontSize: 12, cursor: "pointer", textDecoration: "underline" }}>
                    Modifier
                  </button>
                </div>
              )}
            </GlassPanel>

            {/* How it works */}
            <div style={{ marginTop: 70, borderTop: `1px solid ${PALETTE.line}`, paddingTop: 48 }}>
              <p className="tag" style={{ fontSize: 12, color: PALETTE.muted, marginBottom: 32 }}>Comment ça marche</p>
              <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
                {HOW_IT_WORKS.map((s, i) => (
                  <div key={i} style={{ flex: "1 1 220px" }}>
                    <GradientText gradient={GRADIENT_COOL} style={{ fontSize: 34, fontFamily: "Anton, sans-serif" }}>{s.n}</GradientText>
                    <h3 className="display" style={{ fontSize: 20, margin: "14px 0 10px" }}>{s.title}</h3>
                    <p className="sans" style={{ fontSize: 14, color: PALETTE.muted, lineHeight: 1.6, margin: 0 }}>{s.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Four traits */}
            <div style={{ marginTop: 90, borderTop: `1px solid ${PALETTE.line}`, paddingTop: 48 }}>
              <p className="tag" style={{ fontSize: 12, color: PALETTE.muted, marginBottom: 32 }}>Les quatre axes mesurés</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24 }}>
                {Object.keys(TRAITS).map((t) => (
                  <GlassPanel key={t} style={{ padding: 18 }}>
                    <div style={{ aspectRatio: "1 / 1", overflow: "hidden", marginBottom: 16, borderRadius: 14 }}>
                      <img src={ARCHETYPE_IMAGES[t]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(1) contrast(1.1)" }} />
                    </div>
                    <h3 className="display" style={{ fontSize: 17, margin: "0 0 8px" }}>{TRAITS[t].label}</h3>
                    <p className="sans" style={{ fontSize: 13.5, color: PALETTE.muted, lineHeight: 1.55, margin: 0 }}>{TRAITS[t].mid}</p>
                  </GlassPanel>
                ))}
              </div>
            </div>

            {/* Pricing */}
            <div style={{ marginTop: 90, maxWidth: 460 }}>
              <p className="tag" style={{ fontSize: 12, color: PALETTE.muted, marginBottom: 24 }}>Tarifs</p>
              <GlassPanel style={{ padding: "8px 24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0" }}>
                  <span className="sans" style={{ fontSize: 14, color: PALETTE.muted }}>Diagnostic</span>
                  <span className="display" style={{ fontSize: 16 }}>GRATUIT</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderTop: `1px solid ${PALETTE.line}`, borderBottom: `1px solid ${PALETTE.line}` }}>
                  <span className="sans" style={{ fontSize: 14, color: PALETTE.white }}>Programme complet</span>
                  <GradientText gradient={GRADIENT_WARM} style={{ fontSize: 20, fontFamily: "Anton, sans-serif" }}>9€/MOIS</GradientText>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0" }}>
                  <span className="sans" style={{ fontSize: 14, color: PALETTE.muted }}>Séance individuelle</span>
                  <span className="display" style={{ fontSize: 16 }}>39€</span>
                </div>
              </GlassPanel>
              <div style={{ marginTop: 24 }}>
                <PrimaryButton onClick={startQuiz} style={{ padding: "16px 36px", fontSize: 14 }}>Faire le diagnostic</PrimaryButton>
              </div>
            </div>

            {/* Early access note (honest placeholder until real reviews exist) */}
            <div style={{ marginTop: 90, borderTop: `1px solid ${PALETTE.line}`, paddingTop: 48 }}>
              <GlassPanel style={{ padding: "28px 26px", maxWidth: 520 }}>
                <p className="tag" style={{ fontSize: 12, color: PALETTE.muted, marginBottom: 14 }}>Tout début</p>
                <p className="sans" style={{ fontSize: 15, color: PALETTE.white, lineHeight: 1.65, margin: 0 }}>
                  STRIVE vient de démarrer, il n'y a pas encore d'avis à afficher —
                  et on préfère ne rien inventer plutôt que de mettre de faux
                  témoignages. Fais partie des premiers à tester le diagnostic.
                </p>
              </GlassPanel>
            </div>

            {/* FAQ */}
            <div style={{ marginTop: 90, borderTop: `1px solid ${PALETTE.line}`, paddingTop: 48, paddingBottom: 20 }}>
              <p className="tag" style={{ fontSize: 12, color: PALETTE.muted, marginBottom: 32 }}>Questions fréquentes</p>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {FAQ.map((f, i) => (
                  <div key={i} style={{ padding: "22px 0", borderBottom: `1px solid ${PALETTE.line}` }}>
                    <h4 className="sans" style={{ fontSize: 15.5, fontWeight: 600, margin: "0 0 8px" }}>{f.q}</h4>
                    <p className="sans" style={{ fontSize: 14, color: PALETTE.muted, lineHeight: 1.6, margin: 0, maxWidth: 520 }}>{f.a}</p>
                  </div>
                ))}
              </div>
            </div>

            <p className="sans" style={{ fontSize: 12, color: PALETTE.muted, marginTop: 40, textAlign: "center" }}>
              STRIVE — un outil d'auto-évaluation, pas un substitut à un avis médical.
            </p>
          </div>
        )}

        {/* ============================== QUIZ ============================== */}
        {stage === "quiz" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
              <span className="display" style={{ fontSize: 15, color: PALETTE.muted }}>
                {String(step + 1).padStart(2, "0")} / {String(QUESTIONS.length).padStart(2, "0")}
              </span>
              <div style={{ display: "flex", gap: 5, flex: 1, marginLeft: 20 }}>
                {QUESTIONS.map((_, i) => (
                  <div key={i} style={{
                    height: 4, flex: 1, borderRadius: 2,
                    background: i <= step ? GRADIENT_COOL : PALETTE.line,
                    transition: "background 400ms ease",
                  }} />
                ))}
              </div>
            </div>

            <h2 className="display" style={{ fontSize: 28, lineHeight: 1.2, marginBottom: 34 }}>
              {QUESTIONS[step].text}
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {QUESTIONS[step].options.map((opt, i) => (
                <button
                  key={i}
                  className="opt sans"
                  onClick={() => answer(opt.value)}
                  style={{
                    textAlign: "left",
                    background: PALETTE.panel,
                    border: `1px solid ${PALETTE.line}`,
                    borderRadius: 14,
                    backdropFilter: "blur(10px)",
                    color: PALETTE.white,
                    padding: "18px 20px",
                    fontSize: 16,
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ============================== RESULT ============================== */}
        {stage === "result" && result && (
          <div>
            <div style={{ display: "flex", gap: 28, marginBottom: 48, alignItems: "flex-start", flexWrap: "wrap" }}>
              <div style={{ width: 96, height: 96, flexShrink: 0, overflow: "hidden", borderRadius: "50%", border: `2px solid ${PALETTE.teal}` }}>
                <img src={ARCHETYPE_IMAGES[result.archetype.key]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(1) contrast(1.1)" }} />
              </div>
              <div style={{ flex: "1 1 260px" }}>
                <p className="tag" style={{ fontSize: 12, color: PALETTE.muted, marginBottom: 10 }}>Ton profil</p>
                <h2 className="display" style={{ fontSize: 38, lineHeight: 1, margin: "0 0 16px" }}>{result.archetype.name}</h2>
                <p className="sans" style={{ fontSize: 15, color: PALETTE.muted, lineHeight: 1.65, margin: 0, maxWidth: 440 }}>{result.archetype.text}</p>
                {result.growthScore <= 2 && (
                  <p className="sans" style={{ fontSize: 13, color: PALETTE.muted, marginTop: 16, lineHeight: 1.6, fontStyle: "italic" }}>
                    Si ça pèse vraiment sur ton quotidien, ça vaut le coup d'en
                    parler aussi à un professionnel de santé — un questionnaire
                    en ligne ne remplace jamais un vrai diagnostic.
                  </p>
                )}
              </div>
            </div>

            <div style={{ borderTop: `1px solid ${PALETTE.line}`, paddingTop: 30 }}>
              {Object.keys(TRAITS).map((t, idx) => {
                const s = scores[t];
                if (s == null) return null;
                const tier = tierFor(s);
                const locked = idx > 0;
                const pct = Math.max(4, Math.min(100, (s / 5) * 100));
                return (
                  <div key={t} style={{ marginBottom: 28 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                      <span className="tag" style={{ fontSize: 12, color: PALETTE.muted }}>{TRAITS[t].label}</span>
                      <span className="display" style={{ fontSize: 15 }}>{s.toFixed(1)}</span>
                    </div>
                    <div style={{ height: 5, background: PALETTE.line, marginBottom: 12, borderRadius: 3, overflow: "hidden" }}>
                      <div className="bar-fill" style={{ height: "100%", width: `${pct}%`, borderRadius: 3, background: GRADIENT_COOL }} />
                    </div>
                    <p className="sans" style={{
                      fontSize: 14.5, lineHeight: 1.6, margin: 0,
                      color: locked ? "transparent" : PALETTE.muted,
                      textShadow: locked ? "0 0 8px rgba(244,246,251,0.4)" : "none",
                    }}>
                      {TRAITS[t][tier]}
                    </p>
                  </div>
                );
              })}
            </div>

            <GlassPanel style={{ marginTop: 10, padding: "26px 24px" }}>
              <p className="sans" style={{ fontSize: 14, color: PALETTE.white, lineHeight: 1.7, margin: "0 0 18px" }}>
                Le reste de ton profil, avec des exercices adaptés chaque
                semaine, fait partie du programme complet à{" "}
                <GradientText gradient={GRADIENT_WARM} style={{ fontSize: 16, fontFamily: "Anton, sans-serif" }}>9€/MOIS</GradientText>.
              </p>
              <PrimaryButton as="a" href={PAYMENT_LINK} gradient={GRADIENT_WARM}>Débloquer mon profil</PrimaryButton>
            </GlassPanel>

            <button
              className="sans"
              onClick={startQuiz}
              style={{ marginTop: 24, display: "block", background: "transparent", color: PALETTE.muted, border: "none", fontSize: 13, cursor: "pointer", textDecoration: "underline", padding: 0 }}
            >
              Refaire le diagnostic
            </button>
          </div>
        )}

        {/* ============================== BOOST ============================== */}
        {stage === "boost" && (
          <div>
            <p className="tag" style={{ fontSize: 12, color: PALETTE.muted, marginBottom: 10 }}>Boost du moral</p>
            <h2 className="display" style={{ fontSize: 30, lineHeight: 1.1, margin: "0 0 14px" }}>Re-booste-toi en 10 minutes.</h2>
            <p className="sans" style={{ fontSize: 15, color: PALETTE.muted, lineHeight: 1.6, margin: "0 0 36px", maxWidth: 440 }}>
              Six petits exercices, indépendants du diagnostic. Coche ceux que
              tu fais aujourd'hui — pas besoin de tous les faire d'un coup.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {BOOST_EXERCISES.map((ex) => {
                const done = !!boostDone[ex.id];
                return (
                  <button
                    key={ex.id}
                    onClick={() => toggleBoost(ex.id)}
                    className="sans"
                    style={{
                      textAlign: "left", display: "flex", gap: 16, alignItems: "flex-start",
                      background: PALETTE.panel, border: `1px solid ${done ? PALETTE.teal : PALETTE.line}`,
                      borderRadius: 16, backdropFilter: "blur(10px)", padding: "18px 20px",
                      cursor: "pointer", transition: "border-color 250ms ease, opacity 250ms ease",
                      opacity: done ? 0.6 : 1,
                    }}
                  >
                    <span style={{
                      width: 22, height: 22, borderRadius: "50%", flexShrink: 0, marginTop: 2,
                      border: `2px solid ${done ? PALETTE.teal : PALETTE.line}`,
                      background: done ? GRADIENT_COOL : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, color: "#0D0F1A", transition: "all 250ms ease",
                    }}>
                      {done ? "✓" : ""}
                    </span>
                    <span style={{ flex: 1 }}>
                      <span style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                        <span style={{ fontSize: 15.5, fontWeight: 600, textDecoration: done ? "line-through" : "none", color: PALETTE.white }}>
                          {ex.title}
                        </span>
                        <span className="tag" style={{ fontSize: 11, color: PALETTE.muted }}>{ex.time}</span>
                      </span>
                      <span style={{ display: "block", fontSize: 13.5, color: PALETTE.muted, lineHeight: 1.55 }}>{ex.text}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="sans" style={{ fontSize: 12, color: PALETTE.muted, marginTop: 28, lineHeight: 1.6, fontStyle: "italic" }}>
              Si le moral bas dure depuis plusieurs semaines ou s'installe, ces
              exercices ne remplacent pas l'avis d'un professionnel de santé.
            </p>
          </div>
        )}

        {/* ============================== TRACKING ============================== */}
        {stage === "tracking" && (
          <div>
            <p className="tag" style={{ fontSize: 12, color: PALETTE.muted, marginBottom: 10 }}>Suivi personnel</p>
            <h2 className="display" style={{ fontSize: 30, lineHeight: 1.1, margin: "0 0 14px" }}>Ta progression, semaine après semaine.</h2>

            {goal && (
              <p className="sans" style={{ fontSize: 14, color: PALETTE.teal, marginBottom: 28 }}>Ton but : {goal}</p>
            )}

            {!lastResult ? (
              <div>
                <p className="sans" style={{ fontSize: 15, color: PALETTE.muted, lineHeight: 1.65, margin: "0 0 28px", maxWidth: 440 }}>
                  Fais d'abord le diagnostic pour débloquer ton suivi personnel — il se construit à partir de tes résultats.
                </p>
                <PrimaryButton onClick={startQuiz}>Faire le diagnostic</PrimaryButton>
              </div>
            ) : (
              <div>
                <p className="sans" style={{ fontSize: 15, color: PALETTE.muted, lineHeight: 1.65, margin: "0 0 32px", maxWidth: 440 }}>
                  Ton dernier profil : <span style={{ color: PALETTE.white, fontWeight: 600 }}>{lastResult.archetype.name}</span>.
                  Le suivi personnel te donne des conseils concrets chaque semaine pour faire évoluer ce profil.
                </p>

                <GlassPanel style={{ padding: "24px 24px", position: "relative", overflow: "hidden" }}>
                  <p className="tag" style={{ fontSize: 11, color: PALETTE.muted, marginBottom: 16 }}>Conseils de la semaine</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14, filter: "blur(5px)", userSelect: "none" }}>
                    {Object.keys(TRAITS).map((t) => (
                      <p key={t} className="sans" style={{ fontSize: 14, color: PALETTE.white, lineHeight: 1.6, margin: 0 }}>
                        {TRAITS[t].label} — {TRAITS[t].mid}
                      </p>
                    ))}
                  </div>
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16, background: "rgba(13,15,26,0.55)" }}>
                    <span className="sans" style={{ fontSize: 13.5, color: PALETTE.white, textAlign: "center", maxWidth: 260 }}>
                      Le suivi personnel complet fait partie du programme.
                    </span>
                    <PrimaryButton as="a" href={PAYMENT_LINK} gradient={GRADIENT_WARM} style={{ padding: "13px 28px", fontSize: 13 }}>
                      Débloquer le suivi — 9€/mois
                    </PrimaryButton>
                  </div>
                </GlassPanel>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
