/* Coquilles — utilitaires partagés (hasard reproductible, nombres, stockage). */
(function () {
  'use strict';
  const CQ = (window.CQ = window.CQ || {});

  // Générateur pseudo-aléatoire reproductible (mulberry32) : même graine, même édition.
  CQ.hasard = function (graine) {
    let a = graine >>> 0;
    const r = function () {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    r.entier = (min, max) => min + Math.floor(r() * (max - min + 1));
    r.choix = (liste) => liste[Math.floor(r() * liste.length)];
    r.chance = (p) => r() < p;
    r.melanger = (liste) => {
      const l = liste.slice();
      for (let i = l.length - 1; i > 0; i--) {
        const j = Math.floor(r() * (i + 1));
        [l[i], l[j]] = [l[j], l[i]];
      }
      return l;
    };
    // Tire un indice selon des poids positifs.
    r.pondere = (poids) => {
      const total = poids.reduce((s, p) => s + p, 0);
      let x = r() * total;
      for (let i = 0; i < poids.length; i++) {
        x -= poids[i];
        if (x < 0) return i;
      }
      return poids.length - 1;
    };
    return r;
  };

  // Empreinte FNV-1a d'une chaîne, pour fabriquer une graine.
  CQ.empreinte = function (texte) {
    let h = 0x811c9dc5;
    for (let i = 0; i < texte.length; i++) {
      h ^= texte.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    return h >>> 0;
  };

  const UNITES = ['zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf',
    'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize'];
  const DIZAINES = ['', 'dix', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante'];

  // Nombres en lettres, orthographe traditionnelle (vingt et un, quatre-vingts).
  CQ.enLettres = function enLettres(n) {
    if (n < 17) return UNITES[n];
    if (n < 20) return 'dix-' + UNITES[n - 10];
    if (n < 70) {
      const d = Math.floor(n / 10), u = n % 10;
      if (u === 0) return DIZAINES[d];
      if (u === 1) return DIZAINES[d] + ' et un';
      return DIZAINES[d] + '-' + UNITES[u];
    }
    if (n < 80) return n === 71 ? 'soixante et onze' : 'soixante-' + enLettres(n - 60);
    if (n < 100) return n === 80 ? 'quatre-vingts' : 'quatre-vingt-' + enLettres(n - 80);
    if (n < 1000) {
      const c = Math.floor(n / 100), reste = n % 100;
      const cent = c === 1 ? 'cent' : UNITES[c] + ' cent';
      if (reste === 0) return c > 1 ? cent + 's' : cent;
      return cent + ' ' + enLettres(reste);
    }
    return String(n);
  };

  // Au féminin : un → une (vingt et une baguettes, quatre-vingt-une pages).
  CQ.enLettresF = function (n) {
    return CQ.enLettres(n).replace(/(^|[ -])un$/, '$1une');
  };

  // 6.5 → « 6,50 » ; 12 → « 12 ».
  CQ.euros = function (x) {
    const arrondi = Math.round(x * 100) / 100;
    return Number.isInteger(arrondi) ? String(arrondi) : arrondi.toFixed(2).replace('.', ',');
  };

  // Grands nombres avec espace fine : 12500 → « 12 500 ».
  CQ.milliers = function (n) {
    return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  // (9, 5) → « 9 h 05 » ; (14, 0) → « 14 h ».
  CQ.heure = function (h, m) {
    return m === 0 ? h + ' h' : h + ' h ' + String(m).padStart(2, '0');
  };

  // Durée en minutes → « 1 h 25 » ou « 45 minutes ».
  CQ.duree = function (minutes) {
    const h = Math.floor(minutes / 60), m = minutes % 60;
    if (h === 0) return m + ' minutes';
    return m === 0 ? h + (h > 1 ? ' heures' : ' heure') : h + ' h ' + String(m).padStart(2, '0');
  };

  // Stockage local tolérant : un navigateur privé ou bloqué ne casse pas le jeu.
  CQ.stock = {
    lire(cle, defaut) {
      try {
        const v = localStorage.getItem('coquilles:' + cle);
        return v == null ? defaut : JSON.parse(v);
      } catch (e) {
        return defaut;
      }
    },
    ecrire(cle, valeur) {
      try {
        localStorage.setItem('coquilles:' + cle, JSON.stringify(valeur));
      } catch (e) { /* stockage indisponible : on continue sans */ }
    },
  };

  // Typographie française à l'affichage : apostrophe courbe, espaces insécables
  // avant ; ! ? : » et après «. Idempotent : on peut l'appliquer deux fois.
  CQ.typo = function (s) {
    return s
      .replace(/'/g, '\u2019')
      .replace(/ ([;!?])/g, '\u202F$1')
      .replace(/ ([:»])/g, '\u00A0$1')
      .replace(/« /g, '«\u00A0');
  };

  // Applique CQ.typo à tous les textes affichés sous un élément.
  CQ.typographier = function (racine) {
    const marcheur = document.createTreeWalker(racine, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) => (/^(SCRIPT|STYLE|TEXTAREA)$/.test(n.parentNode.nodeName) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
    });
    for (let n = marcheur.nextNode(); n; n = marcheur.nextNode()) {
      const v = CQ.typo(n.nodeValue);
      if (v !== n.nodeValue) n.nodeValue = v;
    }
  };

  CQ.normaliser = function (s) {
    return s.replace(/’/g, "'").toLowerCase();
  };
})();
