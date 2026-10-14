#!/usr/bin/env node
/* Vérifie le contenu de Coquilles : syntaxe des jetons, règles connues,
   générateurs sans NaN, pioches jouables pour chaque public et niveau.
   Usage : node outils/verifier.js [--exemples] */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const racine = path.join(__dirname, '..');
const FICHIERS = [
  'js/util.js', 'js/langue.js', 'js/langues/ja.js', 'js/regles.js',
  'js/contenu/breves-enfant.js', 'js/contenu/breves-adulte.js', 'js/contenu/breves-apprenant.js', 'js/contenu/faits.js',
  'js/contenu/images.js', 'js/contenu/generateurs.js', 'js/edition.js',
];

const ctx = { window: {}, console };
vm.createContext(ctx);
for (const f of FICHIERS) vm.runInContext(fs.readFileSync(path.join(racine, f), 'utf8'), ctx, { filename: f });
const CQ = ctx.window.CQ;

let erreurs = 0;
const erreur = (msg) => { erreurs++; console.log('✗ ' + msg); };
const POST_OK = /^([  ]?(h|min|km|km\/h|kg|g|cm|m|°C|€|%|HT|TTC|\d{2})?[.,;:!?…)»%€]*)*$/;

function verifierElements(elements, ou) {
  for (const e of elements) {
    if (!POST_OK.test(e.post)) erreur(`${ou} : ponctuation collée suspecte « ${e.post} » après « ${e.texte || e.correct} »`);
    if (e.type !== 'jeton') continue;
    if (e.fautes.includes(e.correct)) erreur(`${ou} : la faute est identique à la forme correcte « ${e.correct} »`);
    if (new Set(e.fautes).size !== e.fautes.length) erreur(`${ou} : fautes en double dans {${e.correct}|${e.fautes.join('|')}}`);
    for (const t of [e.correct, ...e.fautes]) {
      if (/NaN|undefined|Infinity|null/.test(t)) erreur(`${ou} : valeur invalide « ${t} »`);
    }
    // Les résultats à corriger : réponse présente, cohérente, et trois mauvaises propositions.
    if (['calc', 'age', 'folio'].includes(e.code)) {
      if (e.valeur === undefined) { erreur(`${ou} : pas de réponse attendue pour « ${e.correct} »`); continue; }
      const enLettres = /[a-z]/.test(CQ.normValeur(e.correct).replace(/h/g, ''));
      const coherente = enLettres ? [CQ.enLettres(+e.valeur), CQ.enLettresF(+e.valeur)].includes(e.correct) : CQ.memeValeur(e.valeur, e.correct);
      if (!coherente) erreur(`${ou} : la réponse « ${e.valeur} » ne correspond pas à « ${e.correct} »`);
      if (e.fautes.length < 3) erreur(`${ou} : seulement ${e.fautes.length} mauvaises propositions pour « ${e.correct} »`);
      if (!enLettres && e.fautes.some((f) => CQ.memeValeur(f, e.valeur))) erreur(`${ou} : une faute vaut la bonne réponse (${e.correct})`);
    }
  }
}

function rendu(article) {
  const txt = (els) => els.map((e) => e.pre + (e.type === 'jeton' ? (e.coquille ? `[${e.affiche}→${e.correct}]` : e.correct) : e.texte) + e.post).join(' ');
  const folio = article.folio ? (article.folio.coquille ? `p.[${article.folio.affiche}→${article.folio.correct}] ` : `p.${article.folio.correct} `) : '';
  let s = `${folio}[${article.section}] ${txt(article.titre)}\n  ${txt(article.texte)}`;
  if (article.image) s += `\n  photo : ${article.image.affiche}${article.image.coquille ? ` (fausse, il fallait ${article.image.ok})` : ''}`;
  return s;
}

// 1. Brèves écrites à la main
for (const b of CQ.BREVES) {
  const ou = `brève « ${b.titre} » (${b.pub})`;
  const avertir = (m) => erreur(`${ou} : ${m}`);
  const els = CQ.analyser(b.titre, avertir).concat(CQ.analyser(b.texte, avertir));
  verifierElements(els, ou);
  if (!els.some((e) => e.type === 'jeton')) erreur(`${ou} : aucun jeton`);
  if (![1, 2, 3].includes(b.niv)) erreur(`${ou} : niveau invalide`);
  if (!b.section) erreur(`${ou} : section manquante`);
}

// 2. Articles illustrés
for (const i of CQ.IMAGES) {
  const ou = `image « ${i.titre} »`;
  if (!i.ok || !i.ko || !i.ko.length || i.ko.includes(i.ok)) erreur(`${ou} : photos ok/ko invalides`);
  if (/[{}]/.test(i.texte)) erreur(`${ou} : les articles illustrés n'ont pas de jeton`);
  verifierElements(CQ.analyser(i.texte, (m) => erreur(`${ou} : ${m}`)), ou);
}

// 3. Générateurs, sur de nombreux tirages
CQ.GENERATEURS.forEach((g, k) => {
  for (let essai = 0; essai < 400; essai++) {
    const r = CQ.hasard(1000 * k + essai);
    const niveau = Math.max(g.niv, 1 + (essai % 3));
    const fiche = g.fn(r, niveau);
    const ou = `générateur n°${k} « ${fiche.titre} »`;
    const brut = JSON.stringify(fiche);
    if (/NaN|undefined|Infinity/.test(brut)) { erreur(`${ou} : ${brut}`); break; }
    const els = CQ.analyser(fiche.titre, (m) => erreur(`${ou} : ${m}`)).concat(CQ.analyser(fiche.texte, (m) => erreur(`${ou} : ${m}`)));
    verifierElements(els, ou);
    if (g.rub === 'calc' && !els.some((e) => e.type === 'jeton')) erreur(`${ou} : pas de jeton de calcul`);
    if (els.filter((e) => e.code === 'calc').length === 1) erreur(`${ou} : un seul résultat, la coquille serait toujours au même endroit`);
  }
});

// 4. Pioches pour chaque public, niveau et combinaison de rubriques
const PUBLICS = ['enfant', 'adulte', 'apprenant'];
const TOUTES = { ortho: true, gram: true, typo: true, calc: true, faits: true, image: true, page: true };
const COMBINAISONS = [TOUTES].concat(Object.keys(TOUTES).map((k) => ({ [k]: true })));
const parRegle = {};
const position = { avant: 0, dernier: 0 };
const bilan = {};
for (const pub of PUBLICS) {
  for (const niveau of [1, 2, 3]) {
    for (const rub of COMBINAISONS) {
      let pioche;
      try {
        pioche = CQ.creerPioche({ public: pub, niveau, rubriques: rub, hasard: CQ.hasard(niveau * 7 + pub.length), stats: {} });
      } catch (e) {
        if (Object.keys(rub).length === 4) erreur(`pioche ${pub}/${niveau} : ${e.message}`);
        continue;
      }
      let coquilles = 0, vides = 0, folioFaux = false;
      for (let n = 0; n < 60; n++) {
        const a = pioche.suivant();
        const ou = `pioche ${pub}/${niveau}/${Object.keys(rub).join('+')}`;
        const jetons = a.titre.concat(a.texte, a.folio ? [a.folio] : []).filter((e) => e.type === 'jeton');
        for (const j of jetons) {
          if (j.coquille && j.affiche === j.correct) erreur(`${ou} : coquille identique à la forme correcte « ${j.correct} »`);
          if (j.coquille && !rub[CQ.rubriqueDe(j.code)]) erreur(`${ou} : coquille « ${j.code} » hors des rubriques choisies`);
          if (j.coquille) parRegle[j.code] = (parRegle[j.code] || 0) + 1;
          if (j.coquille && j.code === 'calc') {
            const calculs = jetons.filter((x) => x.code === 'calc');
            position[calculs.indexOf(j) === calculs.length - 1 ? 'dernier' : 'avant'] += 1;
          }
          if (!CQ.REGLES[j.code]) erreur(`${ou} : règle inconnue « ${j.code} »`);
        }
        if (a.folio && a.folio.correct !== String(n + 2)) erreur(`${ou} : la page ${n + 2} porte le numéro ${a.folio.correct}`);
        if (a.folio && a.folio.coquille && folioFaux) erreur(`${ou} : deux numéros de page faux de suite (page ${n + 2})`);
        folioFaux = a.folio && a.folio.coquille;
        const c = jetons.filter((e) => e.coquille).length + (a.image && a.image.coquille ? 1 : 0);
        coquilles += c;
        if (!c) vides++;
      }
      if (Object.keys(rub).length === 4) bilan[`${pub} niv.${niveau}`] = `${(coquilles / 60).toFixed(2)} coquille(s)/article, ${vides}/60 sans faute`;
    }
  }
}

// 5. Langues des explications : tout doit être traduit pour les apprenants.
const html = fs.readFileSync(path.join(racine, 'index.html'), 'utf8');
const clesPage = [...html.matchAll(/data-t(?:-aria)?="([^"]+)"/g)].map((m) => m[1]);
const clesUi = Object.keys(CQ.LANGUES.fr.ui).concat(clesPage);
for (const code of Object.keys(CQ.LANGUES).filter((c) => c !== 'fr')) {
  const L = CQ.LANGUES[code];
  const manque = (quoi) => erreur(`langue ${code} : ${quoi}`);
  for (const k of clesUi) if (!L.ui || L.ui[k] === undefined) manque(`texte d'interface « ${k} » non traduit`);
  for (const k of Object.keys(CQ.LANGUES.fr.gabarits)) if (!L.gabarits || !L.gabarits[k]) manque(`modèle « ${k} » non traduit`);
  for (const k of Object.keys(CQ.REGLES)) if (!L.regles || !L.regles[k] || !L.regles[k].nom || !L.regles[k].expl) manque(`règle « ${k} » non traduite`);
  for (const k of Object.keys(L.details || {})) {
    if (/[|{}#]/.test(L.details[k])) manque(`la traduction de « ${k} » contient | { } ou #`);
  }
  CQ.langue = code;
  const nonTraduit = new Set();
  const controler = (texte, ou) => { if (texte && CQ.detail(texte) === null) nonTraduit.add(`${ou} : ${texte}`); };
  for (const b of CQ.BREVES.filter((b) => b.pub === 'apprenant')) {
    for (const e of CQ.analyser(b.titre + ' ' + b.texte)) if (e.type === 'jeton') controler(e.detail, `brève « ${b.titre} »`);
  }
  for (const i of CQ.IMAGES.filter((i) => i.pub.includes('apprenant'))) controler(i.expl, `image « ${i.titre} »`);
  for (const niveau of [1, 2, 3]) {
    const p = CQ.creerPioche({ public: 'apprenant', niveau, rubriques: TOUTES, hasard: CQ.hasard(77 + niveau), stats: {} });
    for (let n = 0; n < 300; n++) {
      const a = p.suivant();
      for (const e of a.titre.concat(a.texte, a.folio ? [a.folio] : [])) if (e.type === 'jeton') controler(e.detail, `article « ${a.titre.map((x) => x.texte || x.correct).join(' ')} »`);
      if (a.image) controler(a.image.expl, 'photo');
    }
  }
  CQ.langue = 'fr';
  for (const x of nonTraduit) manque(`explication non traduite — ${x}`);
  console.log(`Langue ${code} : ${Object.keys(L.details || {}).length} explications, ${Object.keys(L.regles || {}).length} règles, ${Object.keys(L.ui || {}).length} textes d'interface.`);
}

console.log('\nBrèves :', CQ.BREVES.length, '· images :', CQ.IMAGES.length, '· générateurs :', CQ.GENERATEURS.length);
for (const [k, v] of Object.entries(bilan)) console.log(`  ${k.padEnd(16)} ${v}`);
console.log(`Calculs : coquille sur le dernier résultat ${position.dernier} fois, sur un résultat intermédiaire ${position.avant} fois`);
console.log('Coquilles tirées par règle :', Object.entries(parRegle).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join(', '));

if (process.argv.includes('--exemples')) {
  for (const pub of PUBLICS) {
    for (const niveau of [1, 3]) {
      console.log(`\n===== ${pub}, niveau ${niveau} =====`);
      const p = CQ.creerPioche({ public: pub, niveau, rubriques: COMBINAISONS[0], hasard: CQ.hasard(42 + niveau), stats: {} });
      for (let n = 0; n < 8; n++) console.log(rendu(p.suivant()));
    }
  }
}

console.log(erreurs ? `\n${erreurs} erreur(s).` : '\nContenu valide.');
process.exit(erreurs ? 1 : 0);
