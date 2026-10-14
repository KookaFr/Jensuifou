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
    let code = null, detail = null, valeur = null;
    const diese = corps.indexOf('#');
    if (diese >= 0) {
      const meta = corps.slice(diese + 1);
      corps = corps.slice(0, diese);
      const deux = meta.indexOf(':');
      if (deux >= 0) { code = meta.slice(0, deux); detail = meta.slice(deux + 1); } else code = meta;
      // « #calc=12:… » : la réponse que le joueur doit retrouver.
      const egal = code.indexOf('=');
      if (egal >= 0) { valeur = code.slice(egal + 1); code = code.slice(0, egal); }
    }
    const options = corps.split('|');
    const correct = options[0], fautes = options.slice(1);
    if (!fautes.length) avertir(`jeton sans faute : {${corps}}`);
    if (!code) code = CQ.detecterRegle(correct, fautes[0] || '');
    if (!code) { avertir(`règle introuvable pour {${corps}}`); code = 'usage'; }
    if (!CQ.REGLES[code]) avertir(`règle inconnue « ${code} » pour {${corps}}`);
    const jeton = { type: 'jeton', correct, fautes, code, detail, pre: '', post: '' };
    if (valeur !== null) jeton.valeur = valeur;
    return jeton;
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

  // ---------- Coquilles d'imprimerie, posées sur n'importe quel mot ----------
  const LETTRES = /^[a-zàâäçéèêëîïôöùûüÿœæ]+$/;
  const PONCT_FIN = /^(.*?)([.,;:!?…)»]*)$/;
  const NOM_PROPRE = /^[A-ZÀÂÇÉÈÊÎÔÛ][a-zàâäçéèêëîïôöùûüÿœ'’-]+$/;
  const PETITS_MOTS = ['le', 'la', 'les', 'de', 'des', 'du', 'un', 'une', 'et', 'en', 'au', 'aux', 'il', 'elle', 'on', 'sur', 'pour', 'dans', 'avec', 'par'];
  // Mots dont la minuscule est admise ou trop discutable pour en faire une coquille.
  const MAJUSCULE_LIBRE = ['Soleil', 'Lune', 'Terre', 'Marché', 'Exposition', 'Révolution', 'T-rex', 'Le', 'La', 'Les'];
  const SANS_ACCENT = { 'É': 'E', 'È': 'E', 'Ê': 'E', 'À': 'A', 'Â': 'A', 'Î': 'I', 'Ô': 'O', 'Ç': 'C' };
  const POIDS_TYPO = { lettres: 3, doublon: 2, majuscule: 1.5, accentmaj: 1.2 };

  function debutDePhrase(liste, k) {
    if (k === 0) return true;
    if (liste[k].pre.includes('«')) return true;
    const prec = liste[k - 1];
    return /[.!?…]$/.test(texteDe(prec) + prec.post);
  }

  // Inverse deux lettres voisines, en oublie une ou en double une.
  function abimer(r, mot) {
    const n = mot.length, essais = { inverse: [], oubli: [], double: [] };
    for (let i = 1; i < n - 2; i++) if (mot[i] !== mot[i + 1]) essais.inverse.push(mot.slice(0, i) + mot[i + 1] + mot[i] + mot.slice(i + 2));
    if (n >= 7) for (let i = 1; i < n - 1; i++) essais.oubli.push(mot.slice(0, i) + mot.slice(i + 1));
    for (let i = 1; i < n - 1; i++) {
      if (/[bcdfglmnprst]/.test(mot[i]) && mot[i] !== mot[i - 1] && mot[i] !== mot[i + 1]) essais.double.push(mot.slice(0, i + 1) + mot.slice(i));
    }
    const sortes = ['inverse', 'oubli', 'double'].filter((s) => essais[s].length);
    if (!sortes.length) return null;
    const sorte = sortes[r.pondere(sortes.map((s) => (s === 'inverse' ? 3 : 1)))];
    return r.choix(essais[sorte]);
  }

  function poserTypo(r, titre, texte) {
    const candidats = { lettres: [], doublon: [], majuscule: [], accentmaj: [] };
    [titre, texte].forEach((liste) => liste.forEach((e, k) => {
      if (e.type !== 'mot') return;
      const [, coeur, ponct] = e.texte.match(PONCT_FIN);
      if (!coeur) return;
      const ref = { e, coeur, ponct };
      if (LETTRES.test(coeur) && coeur.length >= 6) candidats.lettres.push(ref);
      if (liste === texte && PETITS_MOTS.includes(coeur) && !ponct && !e.post && !e.pre) candidats.doublon.push(ref);
      if (NOM_PROPRE.test(coeur) && !debutDePhrase(liste, k) && !MAJUSCULE_LIBRE.includes(coeur)) candidats.majuscule.push(ref);
      if (SANS_ACCENT[coeur[0]]) candidats.accentmaj.push(ref);
    }));
    const sortes = Object.keys(candidats).filter((s) => candidats[s].length);
    if (!sortes.length) return false;
    const sorte = sortes[r.pondere(sortes.map((s) => POIDS_TYPO[s]))];
    const { e, coeur, ponct } = r.choix(candidats[sorte]);
    let faute = null, detail = null;
    if (sorte === 'lettres') faute = abimer(r, coeur);
    if (sorte === 'doublon') { faute = coeur + ' ' + coeur; detail = CQ.D('doublon', { mot: coeur }); }
    if (sorte === 'majuscule') { faute = coeur[0].toLowerCase() + coeur.slice(1); detail = CQ.D('majuscule', { mot: coeur }); }
    if (sorte === 'accentmaj') faute = SANS_ACCENT[coeur[0]] + coeur.slice(1);
    if (!faute || faute === coeur) return false;
    delete e.texte;
    Object.assign(e, { type: 'jeton', correct: coeur, fautes: [faute], code: sorte, detail, coquille: true, affiche: faute, espace: sorte === 'doublon', post: ponct + e.post });
    return true;
  }

  // Numéro de page (folio) d'un article.
  function folio(r, n, actif) {
    const fautes = [n + 1, n - 1];
    const inverse = +String(n).split('').reverse().join('');
    fautes.push(n >= 10 && inverse !== n && n % 10 ? inverse : n + 2);
    const f = {
      type: 'jeton', code: 'folio', correct: String(n), valeur: String(n), fautes: fautes.filter((x) => x >= 1).map(String),
      detail: n === 2 ? CQ.D('folioUne') : CQ.D('folio', { precedente: n - 1, n }),
      coquille: false, affiche: String(n), pre: '', post: '',
    };
    if (actif && r.chance(0.12)) {
      f.coquille = true;
      f.affiche = r.choix(f.fautes);
    }
    return f;
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
      // Les candidats : les jetons des rubriques choisies, plus une coquille d'imprimerie possible.
      const candidats = jetons.filter((j) => opts.rubriques[CQ.rubriqueDe(j.code)]).map((j) => ({ j, poids: faiblesse(opts.stats, j.code) }));
      if (opts.rubriques.typo) candidats.push({ typo: true, poids: (fiche.genere ? 0.35 : 0.8) * faiblesse(opts.stats, 'lettres') });
      let n = Math.min(candidats.length, fiche.genere ? (r.chance(0.7) ? 1 : 0) : combienDeCoquilles(r, opts.niveau));
      while (n-- > 0 && candidats.length) {
        const choisi = candidats.splice(r.pondere(candidats.map((c) => c.poids)), 1)[0];
        if (choisi.typo) {
          poserTypo(r, titre, texte);
        } else {
          choisi.j.coquille = true;
          choisi.j.affiche = r.choix(choisi.j.fautes);
        }
      }
    }
    if (fiche.ok && opts.rubriques.typo && r.chance(0.15)) poserTypo(r, titre, texte);
    return {
      section: fiche.section, titre, texte, image,
      folio: opts.folio ? folio(r, opts.folio, opts.rubriques.page && !opts.folioPrecedentFaux) : null,
    };
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
    enfant: { breve: 5, calc: 2, image: 3, faits: 1, page: 0.6 },
    adulte: { breve: 6, calc: 3, image: 1.5, faits: 1.5, page: 0.8 },
    apprenant: { breve: 5, calc: 2, image: 3, faits: 1.2, page: 0.6 },
  };

  // Crée la pioche d'une partie. opts : public, niveau, rubriques, hasard, stats.
  CQ.creerPioche = function (opts) {
    const r = opts.hasard, pub = opts.public, niveau = opts.niveau, rub = opts.rubriques;
    const auNiveau = (f) => (f.niv === niveau ? 3 : 1);

    // Avec la typographie ou les pages, toute brève peut porter une coquille.
    const porteuses = rub.typo || rub.page;
    const breves = CQ.BREVES.filter((b) => b.pub === pub && b.niv <= niveau && (porteuses ||
      CQ.analyser(b.titre + ' ' + b.texte).some((e) => e.type === 'jeton' && rub[CQ.rubriqueDe(e.code)])));
    const poidsBreve = (b) => {
      const codes = CQ.analyser(b.texte).filter((e) => e.type === 'jeton').map((e) => e.code);
      const pire = Math.max(1, ...codes.map((c) => faiblesse(opts.stats, c)));
      return auNiveau(b) * pire;
    };
    const images = CQ.IMAGES.filter((i) => i.pub.includes(pub) && i.niv <= niveau);
    const generateurs = (cle) => CQ.GENERATEURS.filter((g) => g.rub === cle && g.pub.includes(pub) && g.niv <= niveau);
    const gensImage = generateurs('image');

    const sources = [];
    const melange = MELANGE[pub];
    if (breves.length) {
      const tirer = paquet(breves, r, poidsBreve);
      sources.push({ poids: melange.breve, tirer });
    }
    ['calc', 'faits', 'page'].forEach((cle) => {
      const gens = generateurs(cle);
      if (!rub[cle] || !gens.length) return;
      const tirer = paquet(gens, r, auNiveau);
      sources.push({ poids: melange[cle], tirer: () => Object.assign(tirer().fn(r, niveau), { genere: true }) });
    });
    if (rub.image && (images.length || gensImage.length)) {
      const tirerImage = images.length ? paquet(images, r, auNiveau) : null;
      const tirerGen = gensImage.length ? paquet(gensImage, r, auNiveau) : null;
      sources.push({ poids: melange.image, tirer: () => (tirerGen && (!tirerImage || r.chance(0.35)) ? tirerGen().fn(r, niveau) : tirerImage()) });
    }
    if (!sources.length) throw new Error('Aucune rubrique disponible pour ce lecteur.');

    let derniere = -1;
    let page = 1; // la une est la page 1
    let folioPrecedentFaux = false;
    return {
      suivant() {
        // Évite deux articles de suite de la même source, une fois sur deux.
        let i = r.pondere(sources.map((s) => s.poids));
        if (i === derniere && sources.length > 1 && r.chance(0.5)) i = r.pondere(sources.map((s, k) => (k === i ? 0 : s.poids)));
        derniere = i;
        page++;
        const article = CQ.composer(sources[i].tirer(), { hasard: r, niveau, rubriques: rub, stats: opts.stats, folio: page, folioPrecedentFaux });
        folioPrecedentFaux = article.folio.coquille;
        return article;
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
