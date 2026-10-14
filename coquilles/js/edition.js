/* Coquilles — fabrication des éditions : analyse des textes à jetons,
   choix des articles et des coquilles, révision ciblée des points faibles. */
(function () {
  'use strict';
  const CQ = window.CQ;
  const NBSP = ' ', FINE = ' ';

  // Ponctuation qui se colle au mot précédent, ou au mot suivant.
  const APRES = /^[.,;:!?…)»%€]+$/;
  const AVANT = /^[«(]+$/;
  const UNITE = /^(h|min|km|km\/h|kg|g|cm|m|°C|€|%|HT|TTC)[.,;:!?)]*$/;
  const MINUTES = /^\d{2}[.,;:!?)]*$/;
  const MILLIERS = /^\d{3}([.,;:!?)].*)?$/;

  function espaceAvant(p) {
    const c = p.charAt(0);
    if (c === ';' || c === '!' || c === '?') return FINE;
    if (c === ':' || c === '»' || c === '%' || c === '€') return NBSP;
    return '';
  }
  const texteDe = (el) => (el.type === 'jeton' ? el.correct : el.texte);
  const finitParChiffre = (el) => el && /\d$/.test(texteDe(el) + el.post);

  // Ajoute un texte libre (sans jeton) à la liste des éléments.
  function pousserTexte(etat, txt) {
    const els = etat.elements;
    const morceaux = txt.split(/([ \t\n]+)/);
    let espace = etat.debut ? true : false;
    for (const m of morceaux) {
      if (m === '') continue;
      if (/^[ \t\n]+$/.test(m)) { espace = true; continue; }
      const prec = els[els.length - 1];
      if (prec && !espace && !etat.attente) {
        prec.post += m; // collé sans espace, ex. « {à|a}. »
      } else if (prec && !etat.attente && APRES.test(m)) {
        prec.post += espaceAvant(m) + m;
      } else if (prec && !etat.attente && UNITE.test(m) && finitParChiffre(prec)) {
        prec.post += NBSP + m; // 12 %, 8 h, 40 °C
      } else if (prec && !etat.attente && prec.type === 'mot' && MINUTES.test(m) && /\sh$/.test(prec.texte + prec.post)) {
        prec.post += NBSP + m; // 9 h 40
      } else if (prec && !etat.attente && prec.type === 'mot' && MILLIERS.test(m) && /^\d{1,3}$/.test(prec.texte) && !prec.post) {
        prec.texte += FINE + m; // 10 000
      } else if (AVANT.test(m)) {
        etat.attente += m + (m === '«' ? NBSP : '');
      } else {
        els.push({ type: 'mot', texte: m, pre: etat.attente, post: '' });
        etat.attente = '';
      }
      espace = false;
    }
    etat.finEspace = espace;
    etat.debut = false;
  }

  function lireJeton(corps, avertir) {
    let code = null, detail = null;
    const diese = corps.indexOf('#');
    if (diese >= 0) {
      const meta = corps.slice(diese + 1);
      corps = corps.slice(0, diese);
      const deux = meta.indexOf(':');
      if (deux >= 0) { code = meta.slice(0, deux); detail = meta.slice(deux + 1); } else code = meta;
    }
    const options = corps.split('|');
    const correct = options[0], fautes = options.slice(1);
    if (!fautes.length) avertir(`jeton sans faute : {${corps}}`);
    if (!code) code = CQ.detecterRegle(correct, fautes[0] || '');
    if (!code) { avertir(`règle introuvable pour {${corps}}`); code = 'usage'; }
    if (!CQ.REGLES[code]) avertir(`règle inconnue « ${code} » pour {${corps}}`);
    return { type: 'jeton', correct, fautes, code, detail, pre: '', post: '' };
  }

  // « Le chat {a|à} faim. » → [mot, mot, jeton, mot]
  CQ.analyser = function (source, avertir) {
    avertir = avertir || function () {};
    const etat = { elements: [], attente: '', debut: true, finEspace: true };
    const re = /\{([^}]+)\}/g;
    let dernier = 0, m;
    while ((m = re.exec(source))) {
      pousserTexte(etat, source.slice(dernier, m.index));
      const prec = etat.elements[etat.elements.length - 1];
      if (prec && !etat.finEspace && !etat.attente) avertir(`jeton collé au mot précédent dans « ${source.slice(Math.max(0, m.index - 12), m.index + 12)} »`);
      const jeton = lireJeton(m[1], avertir);
      jeton.pre = etat.attente;
      etat.attente = '';
      etat.elements.push(jeton);
      etat.finEspace = false;
      etat.debut = false;
      dernier = re.lastIndex;
    }
    pousserTexte(etat, source.slice(dernier));
    return etat.elements;
  };

  CQ.rubriqueDe = (code) => (CQ.REGLES[code] ? CQ.REGLES[code].rub : 'gram');

  // Poids d'un code selon les erreurs passées : on revoit plus souvent ce qu'on rate.
  function faiblesse(stats, code) {
    const s = stats && stats[code];
    if (!s) return 1;
    return 1 + (3 * (s.rate + s.zele)) / (s.vu + s.zele + 3);
  }

  function combienDeCoquilles(r, niveau) {
    const x = r();
    if (niveau === 1) return x < 0.15 ? 0 : 1;
    if (niveau === 2) return x < 0.15 ? 0 : x < 0.8 ? 1 : 2;
    return x < 0.15 ? 0 : x < 0.65 ? 1 : 2;
  }

  // Transforme une fiche (brève, image, article généré) en article prêt à jouer.
  CQ.composer = function (fiche, opts) {
    const r = opts.hasard;
    const titre = CQ.analyser(fiche.titre);
    const texte = CQ.analyser(fiche.texte);
    const jetons = titre.concat(texte).filter((e) => e.type === 'jeton');
    jetons.forEach((j) => { j.coquille = false; j.affiche = j.correct; });

    let image = null;
    if (fiche.ok) {
      image = { type: 'image', code: 'image', ok: fiche.ok, ko: fiche.ko, expl: fiche.expl, coquille: false, affiche: fiche.ok };
      if (opts.rubriques.image && r.chance(0.78)) {
        image.coquille = true;
        image.affiche = r.choix(fiche.ko);
      }
    } else {
      const eligibles = jetons.filter((j) => opts.rubriques[CQ.rubriqueDe(j.code)]);
      let n = Math.min(eligibles.length, fiche.calc ? (r.chance(0.8) ? 1 : 0) : combienDeCoquilles(r, opts.niveau));
      const restants = eligibles.slice();
      while (n-- > 0 && restants.length) {
        const i = r.pondere(restants.map((j) => faiblesse(opts.stats, j.code)));
        const j = restants.splice(i, 1)[0];
        j.coquille = true;
        j.affiche = r.choix(j.fautes);
      }
    }
    return { section: fiche.section, titre, texte, image };
  };

  // Mélange sans remise, pondéré : le niveau choisi et les points faibles d'abord.
  function paquet(fiches, r, poids) {
    let restant = [];
    return function tirer() {
      if (!restant.length) restant = fiches.slice();
      const i = r.pondere(restant.map(poids));
      return restant.splice(i, 1)[0];
    };
  }

  const MELANGE = {
    enfant: { breve: 5, calc: 2, image: 3 },
    adulte: { breve: 6, calc: 3, image: 1.5 },
    apprenant: { breve: 5, calc: 2, image: 3 },
  };

  // Crée la pioche d'une partie. opts : public, niveau, rubriques, hasard, stats.
  CQ.creerPioche = function (opts) {
    const r = opts.hasard, pub = opts.public, niveau = opts.niveau, rub = opts.rubriques;
    const auNiveau = (f) => (f.niv === niveau ? 3 : 1);

    const breves = CQ.BREVES.filter((b) => b.pub === pub && b.niv <= niveau &&
      CQ.analyser(b.titre + ' ' + b.texte).some((e) => e.type === 'jeton' && rub[CQ.rubriqueDe(e.code)]));
    const poidsBreve = (b) => {
      const codes = CQ.analyser(b.texte).filter((e) => e.type === 'jeton').map((e) => e.code);
      const pire = Math.max(1, ...codes.map((c) => faiblesse(opts.stats, c)));
      return auNiveau(b) * pire;
    };
    const images = CQ.IMAGES.filter((i) => i.pub.includes(pub) && i.niv <= niveau);
    const gensCalc = CQ.GENERATEURS.filter((g) => g.rub === 'calc' && g.pub.includes(pub) && g.niv <= niveau);
    const gensImage = CQ.GENERATEURS.filter((g) => g.rub === 'image' && g.pub.includes(pub) && g.niv <= niveau);

    const sources = [];
    const melange = MELANGE[pub];
    if ((rub.ortho || rub.gram) && breves.length) {
      const tirer = paquet(breves, r, poidsBreve);
      sources.push({ poids: melange.breve, tirer });
    }
    if (rub.calc && gensCalc.length) {
      const tirer = paquet(gensCalc, r, auNiveau);
      sources.push({ poids: melange.calc, tirer: () => Object.assign(tirer().fn(r, niveau), { calc: true }) });
    }
    if (rub.image && (images.length || gensImage.length)) {
      const tirerImage = images.length ? paquet(images, r, auNiveau) : null;
      const tirerGen = gensImage.length ? paquet(gensImage, r, auNiveau) : null;
      sources.push({ poids: melange.image, tirer: () => (tirerGen && (!tirerImage || r.chance(0.35)) ? tirerGen().fn(r, niveau) : tirerImage()) });
    }
    if (!sources.length) throw new Error('Aucune rubrique disponible pour ce lecteur.');

    let derniere = -1;
    return {
      suivant() {
        // Évite trois articles de suite de la même source quand c'est possible.
        let i = r.pondere(sources.map((s) => s.poids));
        if (i === derniere && sources.length > 1 && r.chance(0.5)) i = r.pondere(sources.map((s, k) => (k === i ? 0 : s.poids)));
        derniere = i;
        return CQ.composer(sources[i].tirer(), { hasard: r, niveau, rubriques: rub, stats: opts.stats });
      },
    };
  };

  // Numéro d'édition : le n°1 est paru le 14 octobre 2026.
  CQ.cleDuJour = function (d) {
    d = d || new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  };
  CQ.numeroEdition = function (d) {
    d = d || new Date();
    const jour = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
    return Math.floor((jour - Date.UTC(2026, 9, 14)) / 86400000) + 1;
  };
})();
