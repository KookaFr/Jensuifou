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
  'js/util.js', 'js/regles.js',
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
  }
});

// 4. Pioches pour chaque public, niveau et combinaison de rubriques
const PUBLICS = ['enfant', 'adulte', 'apprenant'];
const TOUTES = { ortho: true, gram: true, typo: true, calc: true, faits: true, image: true, page: true };
const COMBINAISONS = [TOUTES].concat(Object.keys(TOUTES).map((k) => ({ [k]: true })));
const parRegle = {};
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

console.log('\nBrèves :', CQ.BREVES.length, '· images :', CQ.IMAGES.length, '· générateurs :', CQ.GENERATEURS.length);
for (const [k, v] of Object.entries(bilan)) console.log(`  ${k.padEnd(16)} ${v}`);
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
