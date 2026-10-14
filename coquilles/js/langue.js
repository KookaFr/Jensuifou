/* Coquilles — langue des explications.
   Les articles restent toujours en français (c'est ce qu'on apprend) ; les règles,
   les messages du marbre, le pupitre de correction, l'aide et le bilan peuvent
   être affichés dans une autre langue. Chaque langue est un fichier de
   js/langues/ qui remplit CQ.LANGUES[code] avec : nom, nomFr, ui, regles,
   details (explications des brèves, clé = texte français) et gabarits. */
(function () {
  'use strict';
  const CQ = window.CQ;
  CQ.LANGUES = CQ.LANGUES || {};
  CQ.langue = 'fr';

  const MOIS = { janvier: 1, février: 2, mars: 3, avril: 4, mai: 5, juin: 6, juillet: 7, août: 8, septembre: 9, octobre: 10, novembre: 11, décembre: 12 };
  CQ.numeroMois = (mois) => MOIS[mois];

  // Le français : textes des messages et modèles des explications fabriquées par le jeu.
  // Les textes fixes de la page (aide, pause, bilan…) sont lus dans le HTML lui-même.
  CQ.LANGUES.fr = {
    nom: 'Français', nomFr: 'français',
    ui: {
      citation: '« {x} »',
      separateur: ' ', // entre l'explication du mot et la règle générale
      page: 'page {n}',
      'ok.photo': 'Bien vu : la photo ne correspondait pas.',
      'ok.mot': 'Bien vu : {faux} → {juste}',
      'ok.corrige': 'Bien corrigé : {faux} → {juste}',
      'zele.mot': 'Faute de zèle : {juste} était juste.',
      'zele.photo': 'Faute de zèle : la photo était juste.',
      'zele.conseil': 'Ne touche que les vraies coquilles : chaque erreur coûte 40 points et ta série.',
      'rate.photo': 'Coquille imprimée : la photo ne correspondait pas.',
      'rate.mot': 'Coquille imprimée : {faux} au lieu de {juste}',
      'bat.titre': 'Bon à tirer : +{n} points.',
      'bat.detail': "L'article est parti propre, en avance sur la rotative.",
      'debut.titre': "Touche les coquilles avant qu'elles partent à l'impression.",
      'debut.detail': 'Faute, lettres inversées, calcul faux, information fausse, photo ou numéro de page qui ne colle pas : touche-la.',
      'corr.une': 'La une est la page 1. Cet article porte le numéro {n}.',
      'corr.precedent': "L'article précédent est en page {p}. Celui-ci porte le numéro {n}.",
      'corr.temps': 'Temps écoulé : il fallait {juste}.',
      'corr.passe': 'Il fallait {juste}.',
      'corr.faux': 'Bien repéré, mais il fallait {juste}, pas {propose}.',
      'aide.minutes': 'Écris le nombre de minutes.',
      'aide.heure': "Écris l'heure ou la durée avec h, par exemple 10h35.",
      'aide.virgule': 'Utilise la virgule pour les centimes, par exemple 4,60.',
      'aide.chiffres': 'Écris le nombre en chiffres.',
      'piege.zele': '{juste} était juste',
      'piege.suffixe.zele': ' (tu as cru voir une faute)',
      'piege.suffixe.correction': ' (bien repéré, mal corrigé)',
      'lecteur.enfant': 'Enfant',
      'lecteur.adulte': 'Adulte',
      'lecteur.apprenant': 'Apprenant',
      'bilan.jour': 'Édition n°{n} · {lecteur}',
      'bilan.libre': 'Partie libre · {lecteur}',
      'bilan.parfait': 'Édition parfaite',
      'bilan.boucle': 'Édition bouclée',
      'bilan.reputation': 'Le rédacteur en chef a arrêté les rotatives',
      'bilan.abandon': 'Partie arrêtée',
      'bilan.retenu': "Score retenu pour aujourd'hui : {n} points",
      'bilan.nouveau': "Nouveau record ! L'ancien : {n} points",
      'bilan.premier': 'Premier record enregistré',
      'bilan.record': 'Record : {n} points',
      'bilan.grille': '{p} articles sans faute sur {n}',
      'bilan.retenir': 'À retenir',
      'bilan.aucun': 'Aucun piège ne t’a eu cette fois.',
      'partage.jour': 'Coquilles n°{n} · {lecteur}',
      'partage.libre': 'Coquilles · partie libre · {lecteur}',
      'partage.score': '{score} points · {t}/{total} coquilles trouvées',
      'partage.copier': 'Copier le résultat',
      'partage.copie': 'Résultat copié',
      'partage.selection': 'Sélectionne le texte ci-dessus',
      'rejouer.jour': "Rejouer l'édition du jour (hors classement)",
      'rejouer.libre': 'Nouvelle partie libre',
    },
    gabarits: {
      date30: (p) => `${p.mois.charAt(0).toUpperCase() + p.mois.slice(1)} n'a que 30 jours.`,
      datefev: () => "Février n'a que 28 jours (29 les années bissextiles).",
      jour: (p) => `Nous sommes ${p.auj} : ${p.mot}, c'est ${p.juste}.`,
      sommaireOrdre: (p) => `Le sommaire suit l'ordre des pages : après ${p.rubrique} en page ${p.page}, la rubrique suivante ne peut pas être en page ${p.faux}.`,
      sommaireTotal: (p) => `Ce numéro n'a que ${p.total} pages : la page ${p.faux} n'existe pas.`,
      folioUne: () => 'La une est la page 1 : le premier article est en page 2.',
      folio: (p) => `Après la page ${p.precedente} vient la page ${p.n}.`,
      doublon: (p) => `« ${p.mot} » est imprimé deux fois de suite.`,
      majuscule: (p) => `« ${p.mot} » est un nom propre : il prend une majuscule.`,
      compter: (p) => `Le texte dit « ${p.lettres} » : il en fallait ${p.n}.`,
    },
  };

  const langue = () => CQ.LANGUES[CQ.langue] || CQ.LANGUES.fr;

  // Texte d'interface : « {x} » est remplacé par p.x.
  CQ.t = function (cle, p) {
    const L = langue();
    let s = L.ui && L.ui[cle];
    if (s === undefined) s = CQ.LANGUES.fr.ui[cle];
    if (s === undefined) return cle;
    return s.replace(/\{(\w+)\}/g, (_, k) => (p && p[k] !== undefined ? p[k] : ''));
  };

  // Explication fabriquée par le jeu (dates, sommaire, numéros de page…), dans la langue choisie.
  CQ.D = function (cle, p) {
    const g = (langue().gabarits && langue().gabarits[cle]) || CQ.LANGUES.fr.gabarits[cle];
    return g(p || {});
  };

  // Nom et explication d'une règle, dans la langue choisie.
  CQ.regle = function (code) {
    const base = CQ.REGLES[code] || CQ.REGLES.usage;
    const tr = CQ.langue !== 'fr' && langue().regles && langue().regles[code];
    return tr ? Object.assign({}, base, tr) : base;
  };

  const JAPONAIS = /[぀-ヿ㐀-鿿]/;
  // Une explication sans phrase en français (un calcul, des nombres) se lit dans toutes les langues.
  CQ.estNeutre = function (texte) {
    const reste = texte.replace(/\([^)]*\)/g, '').replace(/«[^»]*»/g, '');
    return !/[a-zàâçéèêëîïôûùœ]{3,}/i.test(reste);
  };

  // Explication propre à un mot (brève, image, article généré) dans la langue choisie,
  // ou null si elle n'est pas traduite : on affiche alors l'explication de la règle.
  CQ.detail = function (texte) {
    if (!texte || CQ.langue === 'fr') return texte || null;
    const d = langue().details;
    if (d && d[texte]) return d[texte];
    if (JAPONAIS.test(texte) || CQ.estNeutre(texte)) return texte;
    return null;
  };

  // Les textes fixes de la page portent data-t (contenu) ou data-t-aria (étiquette).
  // Le français est lu une fois dans le HTML, pour pouvoir y revenir.
  let francaisLu = false;
  function lireFrancais() {
    if (francaisLu) return;
    francaisLu = true;
    document.querySelectorAll('[data-t]').forEach((el) => {
      if (CQ.LANGUES.fr.ui[el.dataset.t] === undefined) CQ.LANGUES.fr.ui[el.dataset.t] = el.innerHTML;
    });
    document.querySelectorAll('[data-t-aria]').forEach((el) => {
      if (CQ.LANGUES.fr.ui[el.dataset.tAria] === undefined) CQ.LANGUES.fr.ui[el.dataset.tAria] = el.getAttribute('aria-label');
    });
  }

  // Zones de la page dont le texte suit la langue des explications.
  const ZONES = ['ecran-jeu', 'ecran-bilan', 'voile-aide', 'voile-pause', 'voile-correction'];

  CQ.choisirLangue = function (code) {
    lireFrancais();
    CQ.langue = CQ.LANGUES[code] ? code : 'fr';
    document.querySelectorAll('[data-t]').forEach((el) => { el.innerHTML = CQ.t(el.dataset.t); });
    document.querySelectorAll('[data-t-aria]').forEach((el) => el.setAttribute('aria-label', CQ.t(el.dataset.tAria)));
    ZONES.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.lang = CQ.langue;
        CQ.typographier(el);
      }
    });
  };
})();
