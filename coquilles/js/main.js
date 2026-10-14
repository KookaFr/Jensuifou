/* Coquilles — la une (réglages), le bilan, le partage. */
(function () {
  'use strict';
  const CQ = window.CQ;
  const $ = (id) => document.getElementById(id);

  const NIVEAUX = {
    enfant: ['CE2', 'CM1', 'CM2'],
    adulte: ['Courant', 'Exigeant', 'Expert'],
    apprenant: ['A1', 'A2', 'B1'],
  };
  const LECTEURS = { enfant: 'Enfant', adulte: 'Adulte', apprenant: 'Apprenant' };
  const TOUTES = { ortho: true, gram: true, calc: true, image: true };
  const ARTICLES_DU_JOUR = 10;
  const CASES = { parfait: '🟦', zele: '🟨', rate: '🟥' };

  const DEFAUT = { public: 'adulte', niveau: 1, vitesse: 'normale', rubriques: TOUTES };
  let reglages = Object.assign({}, DEFAUT, CQ.stock.lire('reglages', {}));
  reglages.rubriques = Object.assign({}, TOUTES, reglages.rubriques);

  let partie = null;
  let derniere = null; // dernière partie lancée, pour « Rejouer »
  let apresAide = null;

  const etoiles = (n) => '★'.repeat(n);
  const cleJour = () => `jour:${CQ.cleDuJour()}:${reglages.public}:${reglages.niveau}`;
  const cleRecord = () => `record:${reglages.public}:${reglages.niveau}`;

  function afficher(ecran) {
    ['ecran-une', 'ecran-jeu', 'ecran-bilan'].forEach((id) => { $(id).hidden = id !== ecran; });
  }

  // ---------- La une ----------
  function majUne() {
    const auj = new Date();
    $('date-edition').textContent = auj.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    $('num-edition').textContent = CQ.numeroEdition(auj);

    $('pub-' + reglages.public).checked = true;
    $('niv-' + reglages.niveau).checked = true;
    $('vit-' + reglages.vitesse).checked = true;
    Object.keys(TOUTES).forEach((r) => { $('rub-' + r).checked = !!reglages.rubriques[r]; });
    NIVEAUX[reglages.public].forEach((nom, i) => { $(`niv-${i + 1}-nom`).textContent = nom; });

    const jour = CQ.stock.lire(cleJour(), null);
    $('etat-jour').textContent = jour
      ? `Déjà jouée : ${CQ.milliers(jour.score)} points. Rejouer ne change pas ce score.`
      : `${ARTICLES_DU_JOUR} articles, la même pour tous les lecteurs`;
    const record = CQ.stock.lire(cleRecord(), 0);
    $('etat-libre').textContent = record
      ? `Record ${LECTEURS[reglages.public].toLowerCase()} ${etoiles(reglages.niveau)} : ${CQ.milliers(record)} points`
      : "Sans fin, jusqu'à la dernière plainte des lecteurs";
    majBoutonSon();
    CQ.typographier($('ecran-une'));
  }

  function lireReglages() {
    const f = $('reglages');
    reglages.public = f.querySelector('input[name=public]:checked').value;
    reglages.niveau = +f.querySelector('input[name=niveau]:checked').value;
    reglages.vitesse = f.querySelector('input[name=vitesse]:checked').value;
    const rub = {};
    f.querySelectorAll('input[name=rubrique]').forEach((c) => { rub[c.value] = c.checked; });
    reglages.rubriques = rub;
    CQ.stock.ecrire('reglages', reglages);
  }

  function majBoutonSon() {
    const b = $('btn-son');
    b.textContent = CQ.Son.actif ? 'Son activé' : 'Son coupé';
    b.setAttribute('aria-pressed', String(CQ.Son.actif));
  }

  // ---------- Lancement ----------
  function preparer(mode) {
    const base = { mode, public: reglages.public, niveau: reglages.niveau, vitesse: reglages.vitesse };
    if (mode === 'jour') {
      const r = CQ.hasard(CQ.empreinte(`${CQ.cleDuJour()}|${reglages.public}|${reglages.niveau}`));
      const pioche = CQ.creerPioche({ public: reglages.public, niveau: reglages.niveau, rubriques: TOUTES, hasard: r, stats: null });
      return Object.assign(base, { file: Array.from({ length: ARTICLES_DU_JOUR }, () => pioche.suivant()) });
    }
    const r = CQ.hasard(Date.now() ^ (Math.random() * 1e9));
    const pioche = CQ.creerPioche({ public: reglages.public, niveau: reglages.niveau, rubriques: reglages.rubriques, hasard: r, stats: CQ.stock.lire('stats', {}) });
    return Object.assign(base, { pioche });
  }

  function lancer(mode) {
    CQ.Son.reveiller();
    if (!CQ.stock.lire('aideVue', false)) {
      apresAide = () => lancer(mode);
      ouvrirAide();
      return;
    }
    derniere = mode;
    const opts = preparer(mode);
    afficher('ecran-jeu');
    partie = CQ.lancerPartie(opts, (resume) => {
      partie = null;
      montrerBilan(opts, resume);
    });
  }

  // ---------- Bilan ----------
  function montrerBilan(opts, res) {
    const jour = opts.mode === 'jour';
    const numero = CQ.numeroEdition();
    const lecteur = `${LECTEURS[opts.public]} ${etoiles(opts.niveau)}`;
    const total = res.trouvees + res.ratees;

    $('bilan-surtitre').textContent = jour ? `Édition n°${numero} · ${lecteur}` : `Partie libre · ${lecteur}`;
    $('bilan-titre').textContent = {
      bouclage: res.ratees === 0 ? 'Édition parfaite' : 'Édition bouclée',
      reputation: 'Le rédacteur en chef a arrêté les rotatives',
      abandon: 'Partie arrêtée',
    }[res.raison];
    $('bilan-score').textContent = CQ.milliers(res.score);

    let mention = '';
    if (jour) {
      const deja = CQ.stock.lire(cleJour(), null);
      if (!deja) CQ.stock.ecrire(cleJour(), { score: res.score, resultats: res.resultats, trouvees: res.trouvees, total });
      else mention = `Score retenu pour aujourd'hui : ${CQ.milliers(deja.score)} points`;
    } else {
      const record = CQ.stock.lire(cleRecord(), 0);
      if (res.score > record) {
        CQ.stock.ecrire(cleRecord(), res.score);
        mention = record ? `Nouveau record ! L'ancien : ${CQ.milliers(record)} points` : 'Premier record enregistré';
      } else {
        mention = `Record : ${CQ.milliers(record)} points`;
      }
    }
    $('bilan-record').textContent = mention;

    const grille = $('bilan-grille');
    grille.innerHTML = '';
    res.resultats.forEach((r) => {
      const c = document.createElement('i');
      c.className = 'case ' + r;
      grille.appendChild(c);
    });
    grille.setAttribute('aria-label', `${res.resultats.filter((r) => r === 'parfait').length} articles sans faute sur ${res.resultats.length}`);

    $('b-trouvees').textContent = `${res.trouvees}/${total}`;
    $('b-ratees').textContent = res.ratees;
    $('b-zeles').textContent = res.zeles;
    $('b-serie').textContent = res.meilleureSerie;

    const liste = $('bilan-pieges');
    liste.innerHTML = '';
    // Les coquilles ratées d'abord, puis les fautes de zèle.
    const pieges = res.pieges.slice().sort((a, b) => (a.quoi === 'rate' ? 0 : 1) - (b.quoi === 'rate' ? 0 : 1));
    pieges.slice(0, 8).forEach((p) => {
      const li = document.createElement('li');
      const nom = document.createElement('b');
      nom.textContent = p.nom + (p.quoi === 'zele' ? ' (tu as cru voir une faute)' : '');
      li.appendChild(nom);
      if (p.exemple) {
        const ex = document.createElement('span');
        ex.className = 'exemple';
        ex.textContent = p.exemple;
        li.appendChild(ex);
      }
      const expl = document.createElement('p');
      expl.textContent = p.expl;
      li.appendChild(expl);
      liste.appendChild(li);
    });
    $('pieges-titre').textContent = res.pieges.length ? 'À retenir' : 'Aucun piège ne t’a eu cette fois.';

    const texte = [
      jour ? `Coquilles n°${numero} · ${lecteur}` : `Coquilles · partie libre · ${lecteur}`,
      res.resultats.slice(0, 30).map((r) => CASES[r]).join(''),
      `${CQ.milliers(res.score)} points · ${res.trouvees}/${total} coquilles trouvées`,
    ].join('\n');
    const zone = $('texte-partage');
    zone.value = texte;
    zone.hidden = true;
    $('btn-partager').firstChild.textContent = 'Copier le résultat';
    $('rejouer-detail').textContent = jour ? "Rejouer l'édition du jour (hors classement)" : 'Nouvelle partie libre';

    CQ.typographier($('ecran-bilan'));
    afficher('ecran-bilan');
    $('ecran-bilan').scrollTop = 0;
  }

  function partager() {
    const zone = $('texte-partage');
    const bouton = $('btn-partager');
    const montrer = () => {
      zone.hidden = false;
      zone.focus();
      zone.select();
      bouton.firstChild.textContent = 'Sélectionne le texte ci-dessus';
    };
    try {
      navigator.clipboard.writeText(zone.value).then(() => { bouton.firstChild.textContent = 'Résultat copié'; }, montrer);
    } catch (e) {
      montrer();
    }
  }

  // ---------- Aide ----------
  function ouvrirAide() {
    $('voile-aide').hidden = false;
    $('btn-aide-ok').focus();
  }
  function fermerAide() {
    $('voile-aide').hidden = true;
    CQ.stock.ecrire('aideVue', true);
    const suite = apresAide;
    apresAide = null;
    if (suite) suite();
  }

  // ---------- Branchements ----------
  function demarrer() {
    document.documentElement.lang = 'fr';
    CQ.typographier(document.body);
    majUne();
    $('reglages').addEventListener('change', (ev) => {
      // Il faut au moins une rubrique cochée.
      if (ev.target.name === 'rubrique' && !$('reglages').querySelector('input[name=rubrique]:checked')) ev.target.checked = true;
      lireReglages();
      majUne();
    });
    $('btn-jour').addEventListener('click', () => lancer('jour'));
    $('btn-libre').addEventListener('click', () => lancer('libre'));
    $('btn-aide').addEventListener('click', ouvrirAide);
    $('btn-aide-ok').addEventListener('click', fermerAide);
    $('btn-son').addEventListener('click', () => { CQ.Son.basculer(); CQ.Son.reveiller(); majBoutonSon(); });
    $('btn-pause').addEventListener('click', () => partie && partie.pause());
    $('btn-reprendre').addEventListener('click', () => partie && partie.reprendre());
    $('btn-abandonner').addEventListener('click', () => partie && partie.abandonner());
    $('btn-partager').addEventListener('click', partager);
    $('btn-rejouer').addEventListener('click', () => lancer(derniere || 'libre'));
    $('btn-une').addEventListener('click', () => { majUne(); afficher('ecran-une'); });
    document.addEventListener('keydown', (ev) => {
      if (ev.key !== 'Escape') return;
      if (!$('voile-aide').hidden) fermerAide();
      else if (partie && $('voile-pause').hidden) partie.pause();
      else if (partie) partie.reprendre();
    });
  }

  // Dans la visionneuse Claude, une republication garde la page ouverte : on redémarre proprement.
  const hot = window.claude && window.claude.hot;
  if (hot && typeof hot.snapshot === 'function') {
    try { hot.snapshot(() => ({ reglages })); } catch (e) { /* visionneuse ancienne */ }
  }
  if (hot && typeof hot.ready === 'function') hot.ready(demarrer);
  else demarrer();
})();
