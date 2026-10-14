/* Coquilles — la partie : les épreuves montent vers la rotative,
   le joueur touche les coquilles avant l'impression. */
(function () {
  'use strict';
  const CQ = window.CQ;
  const $ = (id) => document.getElementById(id);

  const TRAVERSEE = { tranquille: 46, normale: 32, rapide: 22 }; // secondes pour traverser l'écran
  const ECART = 22;          // px entre deux épreuves
  const TURBO = 9;           // accélération après un « bon à tirer »
  const ACCELERATION = 0.03; // +3 % de vitesse par article imprimé…
  const ACCELERATION_MAX = 1.7; // … jusqu'à +70 %
  const PTS = { trouve: 100, serie: 20, zele: 40, propre: 25, calcul: 50, repere: 20 };
  const DUREE_CORRECTION = { tranquille: 30, normale: 20, rapide: 12 }; // secondes pour corriger un résultat
  CQ.REPUTATION = 5;

  const typo = CQ.typo;
  // Codes dont le détail suffit : inutile d'y ajouter la règle générale.
  const SEUL_DETAIL = ['usage', 'calc', 'date', 'fait', 'age', 'jour', 'sommaire', 'titre', 'coherence', 'majuscule', 'doublon', 'folio'];

  const libelle = (e, v) => (e.code === 'folio' ? 'page ' + v : `« ${typo(v)} »`);

  function explication(e) {
    if (e.type === 'image') return e.expl;
    if (e.detail) return typo(e.detail);
    const r = CQ.REGLES[e.code];
    return r ? typo(r.expl) : '';
  }

  // Lance une partie. opts : mode, public, niveau, vitesse, rubriques, pioche ou file.
  CQ.lancerPartie = function (opts, quandFinie) {
    const plateau = $('plateau'), rail = $('rail'), marbre = $('marbre'), rotative = $('rotative');
    const etat = {
      cartes: [], servis: 0, imprimes: 0,
      score: 0, serie: 0, meilleureSerie: 0, reputation: CQ.REPUTATION,
      trouvees: 0, ratees: 0, zeles: 0, corrJustes: 0, corrTotal: 0,
      resultats: [], pieges: new Map(),
      enCours: true, enPause: false, turbo: null, dernier: 0, raf: 0, H: 0, vitesse: 0,
    };
    const stats = CQ.stock.lire('stats', {});

    function noter(code, quoi) {
      const s = stats[code] || (stats[code] = { vu: 0, trouve: 0, rate: 0, zele: 0 });
      s[quoi]++;
    }

    function retenir(e, quoi) {
      const cle = e.code + (e.detail ? ':' + e.detail : '');
      if (etat.pieges.has(cle)) return;
      const regle = CQ.REGLES[e.code] || CQ.REGLES.usage;
      etat.pieges.set(cle, {
        quoi,
        nom: regle.nom,
        exemple: e.type === 'image' ? '' : quoi === 'zele' ? `${libelle(e, e.correct)} était juste` : `${libelle(e, e.affiche)} → ${libelle(e, e.correct)}`,
        expl: e.type === 'image' ? e.expl : e.detail ? typo(e.detail) + (SEUL_DETAIL.includes(e.code) ? '' : ' ' + typo(regle.expl)) : typo(regle.expl),
      });
    }

    // ---------- Affichage ----------
    function dire(type, titre, detail) {
      marbre.dataset.etat = type;
      $('marbre-titre').textContent = typo(titre);
      $('marbre-detail').textContent = typo(detail || '');
      marbre.classList.remove('neuf');
      void marbre.offsetWidth;
      marbre.classList.add('neuf');
    }

    function majTableau() {
      $('hud-score').textContent = CQ.milliers(etat.score);
      const serie = $('hud-serie');
      serie.textContent = '×' + etat.serie;
      serie.classList.toggle('chaud', etat.serie >= 3);
      const pastilles = $('hud-reputation');
      if (pastilles.children.length !== CQ.REPUTATION) {
        pastilles.innerHTML = '';
        for (let i = 0; i < CQ.REPUTATION; i++) pastilles.appendChild(document.createElement('i'));
      }
      Array.from(pastilles.children).forEach((p, i) => p.classList.toggle('perdue', i >= etat.reputation));
      pastilles.setAttribute('aria-label', `${etat.reputation} sur ${CQ.REPUTATION}`);
      $('hud-tirage').textContent = 1 + etat.imprimes; // la une, page 1, est déjà imprimée
    }

    function flotter(texte, ev, negatif) {
      const r = plateau.getBoundingClientRect();
      const d = document.createElement('div');
      d.className = 'points' + (negatif ? ' negatif' : '');
      d.textContent = texte;
      d.style.left = ev.clientX - r.left + 'px';
      d.style.top = ev.clientY - r.top + 'px';
      plateau.appendChild(d);
      setTimeout(() => d.remove(), 850);
    }

    function eclair(type) {
      rotative.classList.remove('flash-ok', 'flash-rate');
      void rotative.offsetWidth;
      rotative.classList.add('flash-' + type);
      setTimeout(() => rotative.classList.remove('flash-' + type), 260);
    }

    // ---------- Épreuves ----------
    function remplir(parent, elements, items) {
      elements.forEach((e, k) => {
        if (k > 0) parent.appendChild(document.createTextNode(' '));
        if (e.pre) parent.appendChild(document.createTextNode(typo(e.pre)));
        const s = document.createElement('span');
        s.className = 'm';
        s.dataset.i = items.length;
        s.textContent = e.type !== 'jeton' ? typo(e.texte) : e.espace ? typo(e.affiche) : typo(e.affiche).replace(/ /g, '\u00A0');
        parent.appendChild(s);
        items.push({ el: s, data: e, etat: null });
        if (e.post) parent.appendChild(document.createTextNode(typo(e.post)));
      });
    }

    function construire(article) {
      const el = document.createElement('article');
      el.className = 'epreuve';
      const items = [];

      const tete = document.createElement('div');
      tete.className = 'tete';
      const gauche = document.createElement('div');
      gauche.className = 'tete-gauche';
      if (article.folio) {
        const folio = document.createElement('span');
        folio.className = 'm folio';
        folio.dataset.i = items.length;
        folio.textContent = 'p.\u00A0' + article.folio.affiche;
        items.push({ el: folio, data: article.folio, etat: null });
        gauche.append(folio);
      }
      const section = document.createElement('span');
      section.className = 'section';
      section.textContent = article.section;
      gauche.append(section);
      const bat = document.createElement('button');
      bat.type = 'button';
      bat.className = 'bat';
      bat.textContent = 'Bon à tirer';
      tete.append(gauche, bat);

      const titre = document.createElement('h2');
      titre.className = 'titre';
      remplir(titre, article.titre, items);
      el.append(tete, titre);

      if (article.image) {
        const photo = document.createElement('figure');
        photo.className = 'photo';
        photo.dataset.i = items.length;
        photo.setAttribute('role', 'img');
        photo.setAttribute('aria-label', "Photo de l'article");
        photo.textContent = article.image.affiche;
        items.push({ el: photo, data: article.image, etat: null });
        el.append(photo);
      }

      const corps = document.createElement('p');
      corps.className = 'corps';
      remplir(corps, article.texte, items);
      el.append(corps);

      const coquilles = items.filter((it) => it.data.coquille).length;
      return { el, items, coquilles, restantes: coquilles, zele: false, y: 0, h: 0 };
    }

    function placer(c) {
      c.el.style.transform = 'translate3d(0,' + c.y.toFixed(1) + 'px,0)';
    }

    function marquerPremiere() {
      etat.cartes.forEach((c, i) => c.el.classList.toggle('premiere', i === 0));
    }

    function ajouterCarte(y) {
      let article;
      if (opts.file) {
        if (etat.servis >= opts.file.length) return false;
        article = opts.file[etat.servis];
      } else {
        article = opts.pioche.suivant();
      }
      etat.servis++;
      const c = construire(article);
      c.y = y;
      rail.appendChild(c.el);
      c.h = c.el.offsetHeight;
      placer(c);
      etat.cartes.push(c);
      marquerPremiere();
      return true;
    }

    // ---------- Gestes ----------
    function toucher(c, it, ev) {
      if (it.etat) return;
      const e = it.data;
      if (e.coquille && e.valeur !== undefined) {
        demanderCorrection(c, it, ev);
        return;
      }
      if (e.coquille) {
        it.etat = 'corrige';
        c.restantes--;
        etat.serie++;
        etat.meilleureSerie = Math.max(etat.meilleureSerie, etat.serie);
        const pts = PTS.trouve + PTS.serie * (etat.serie - 1);
        etat.score += pts;
        etat.trouvees++;
        if (e.type === 'image') {
          it.el.textContent = e.ok;
        } else {
          it.el.dataset.correction = typo(e.correct);
        }
        it.el.classList.add('corrige');
        flotter('+' + pts, ev);
        dire('ok', e.type === 'image' ? 'Bien vu : la photo ne correspondait pas.' : `Bien vu : ${libelle(e, e.affiche)} → ${libelle(e, e.correct)}`, explication(e));
        noter(e.code, 'trouve');
        CQ.Son.jouer('trouve', etat.serie);
      } else {
        it.etat = 'zele';
        it.el.classList.add('zele');
        c.zele = true;
        etat.serie = 0;
        etat.score = Math.max(0, etat.score - PTS.zele);
        etat.zeles++;
        flotter('−' + PTS.zele, ev, true);
        if (e.type === 'jeton') {
          dire('zele', `Faute de zèle : ${libelle(e, e.correct)} était juste.`, explication(e));
          noter(e.code, 'zele');
          retenir(e, 'zele');
        } else if (e.type === 'image') {
          dire('zele', 'Faute de zèle : la photo était juste.', e.expl);
        } else {
          dire('zele', `Faute de zèle : « ${typo(e.texte)} » était juste.`, "Ne touche que les vraies coquilles : chaque erreur coûte 40 points et ta série.");
        }
        CQ.Son.jouer('zele');
        CQ.vibrer(40);
      }
      majTableau();
      c.h = c.el.offsetHeight;
    }

    // ---------- Corriger un résultat : trois propositions (niveaux 1 et 2) ou le clavier (niveau 3) ----------
    let correction = null;

    function melanger(liste) {
      const l = liste.slice();
      for (let i = l.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [l[i], l[j]] = [l[j], l[i]];
      }
      return l;
    }

    function aideSaisie(e) {
      if (/minute/.test(e.correct)) return 'Écris le nombre de minutes.';
      if (/\sh(\s|$)|heure/.test(e.correct)) return "Écris l'heure ou la durée avec h, par exemple 10h35.";
      if (e.correct.includes(',')) return 'Utilise la virgule pour les centimes, par exemple 4,60.';
      if (/[a-z]/.test(e.correct)) return 'Écris le nombre en chiffres.';
      return '';
    }

    function majSaisie() {
      $('corr-saisie').textContent = correction.saisie || '?';
      $('corr-saisie').classList.toggle('vide', !correction.saisie);
      $('corr-valider').disabled = !/\d/.test(correction.saisie);
    }

    function demanderCorrection(c, it, ev) {
      const e = it.data;
      it.etat = 'enCours';
      etat.enPause = true;
      rotative.classList.add('arret');
      const clavier = opts.niveau >= 3;
      correction = { c, it, ev, clavier, saisie: '' };

      const contexte = $('corr-contexte');
      contexte.textContent = '';
      if (e.code === 'folio') {
        const n = +e.correct;
        contexte.textContent = typo(n === 2 ? `La une est la page 1. Cet article porte le numéro ${e.affiche}.` : `L'article précédent est en page ${n - 1}. Celui-ci porte le numéro ${e.affiche}.`);
      } else {
        const copie = it.el.closest('.corps, .titre').cloneNode(true);
        const cible = copie.querySelector(`[data-i="${it.el.dataset.i}"]`);
        if (cible) cible.classList.add('cible');
        contexte.append(...copie.childNodes);
      }

      $('corr-choix').hidden = clavier;
      $('corr-pave').hidden = !clavier;
      if (clavier) {
        $('corr-aide').textContent = typo(aideSaisie(e));
        majSaisie();
      } else {
        const zone = $('corr-choix');
        zone.textContent = '';
        melanger([e.correct].concat(e.fautes.filter((f) => f !== e.affiche).slice(0, 2))).forEach((v) => {
          const b = document.createElement('button');
          b.type = 'button';
          b.className = 'btn choix-valeur';
          b.dataset.valeur = v;
          b.textContent = typo(e.code === 'folio' ? 'page ' + v : v).replace(/ /g, '\u00A0');
          zone.appendChild(b);
        });
      }

      const duree = DUREE_CORRECTION[opts.vitesse || 'normale'];
      const barre = $('corr-chrono');
      barre.style.transition = 'none';
      barre.style.transform = 'scaleX(1)';
      void barre.offsetWidth;
      barre.style.transition = `transform ${duree}s linear`;
      barre.style.transform = 'scaleX(0)';
      correction.minuteur = setTimeout(() => conclure(null, 'temps'), duree * 1000);

      $('voile-correction').hidden = false;
      const premier = $('voile-correction').querySelector(clavier ? '#corr-passer' : '.choix-valeur');
      if (premier) premier.focus({ preventScroll: true });
    }

    function conclure(reponse, raison) {
      if (!correction) return;
      const { c, it, ev, clavier } = correction;
      clearTimeout(correction.minuteur);
      correction = null;
      $('voile-correction').hidden = true;

      const e = it.data;
      const juste = reponse !== null && (clavier ? CQ.memeValeur(reponse, e.valeur) : reponse === e.correct);
      it.etat = 'corrige';
      c.restantes--;
      it.el.dataset.correction = typo(e.correct);
      it.el.classList.add('corrige');
      etat.trouvees++;
      etat.corrTotal++;
      if (juste) {
        etat.corrJustes++;
        etat.serie++;
        etat.meilleureSerie = Math.max(etat.meilleureSerie, etat.serie);
        const pts = PTS.trouve + PTS.calcul + PTS.serie * (etat.serie - 1);
        etat.score += pts;
        flotter('+' + pts, ev);
        dire('ok', `Bien corrigé : ${libelle(e, e.affiche)} → ${libelle(e, e.correct)}`, explication(e));
        noter(e.code, 'trouve');
        CQ.Son.jouer('trouve', etat.serie);
      } else {
        etat.serie = 0;
        c.zele = true;
        etat.score += PTS.repere;
        flotter('+' + PTS.repere, ev);
        const proposee = reponse === null ? '' : clavier ? reponse : typo(reponse);
        // Nombre écrit en lettres : on redonne aussi les chiffres, « treize » (13).
        const attendu = libelle(e, e.correct) + (CQ.memeValeur(e.valeur, e.correct) ? '' : ` (${e.valeur})`);
        const titre = raison === 'temps' ? `Temps écoulé : il fallait ${attendu}.`
          : raison === 'passe' ? `Il fallait ${attendu}.`
          : `Bien repéré, mais il fallait ${attendu}, pas ${e.code === 'folio' ? 'page ' + proposee : '« ' + proposee + ' »'}.`;
        dire('zele', titre, explication(e));
        noter(e.code, 'rate');
        retenir(e, 'correction');
        CQ.Son.jouer('zele');
      }
      majTableau();
      c.h = c.el.offsetHeight;
      etat.enPause = false;
      etat.dernier = 0;
      rotative.classList.remove('arret');
    }

    function surCorrection(ev) {
      if (!correction) return;
      const choix = ev.target.closest('.choix-valeur');
      if (choix) return conclure(choix.dataset.valeur, 'choix');
      if (ev.target.closest('#corr-passer')) return conclure(null, 'passe');
      const touche = ev.target.closest('[data-touche]');
      if (touche) saisir(touche.dataset.touche);
    }

    function saisir(t) {
      if (!correction || !correction.clavier) return;
      if (t === 'valider') {
        if (/\d/.test(correction.saisie)) conclure(correction.saisie, 'saisie');
        return;
      }
      if (t === 'effacer') correction.saisie = correction.saisie.slice(0, -1);
      else if (correction.saisie.length < 8) correction.saisie += t;
      majSaisie();
    }

    function surClavier(ev) {
      if (!correction) return;
      const k = ev.key;
      if (k === 'Escape') { ev.preventDefault(); conclure(null, 'passe'); return; }
      if (!correction.clavier) return;
      if (/^[0-9]$/.test(k)) saisir(k);
      else if (k === ',' || k === '.') saisir(',');
      else if (k === 'h' || k === 'H') saisir('h');
      else if (k === 'Backspace') saisir('effacer');
      else if (k === 'Enter') saisir('valider');
      else return;
      ev.preventDefault();
    }

    function bonATirer(c) {
      if (c !== etat.cartes[0] || c.tamponnee) return;
      c.tamponnee = true;
      c.el.classList.add('tamponnee');
      etat.turbo = c;
      if (c.restantes === 0) c.bonus = 20 + Math.round(80 * Math.min(1, Math.max(0, (c.y + c.h) / etat.H)));
      CQ.Son.jouer('tampon');
    }

    function carteDe(el) {
      const article = el && el.closest('.epreuve');
      return etat.cartes.find((c) => c.el === article);
    }

    function surPointeur(ev) {
      if (!etat.enCours || etat.enPause) return;
      const cible = ev.target.closest('.m, .photo');
      if (!cible) return;
      const c = carteDe(cible);
      if (!c || c.tamponnee) return;
      ev.preventDefault();
      toucher(c, c.items[+cible.dataset.i], ev);
    }

    function surClic(ev) {
      if (!etat.enCours || etat.enPause) return;
      const bat = ev.target.closest('.bat');
      if (bat) bonATirer(carteDe(bat));
    }

    // ---------- Impression ----------
    function imprimer(c) {
      c.el.remove();
      etat.imprimes++;
      if (etat.turbo === c) etat.turbo = null;
      c.items.forEach((it) => { if (it.data.coquille) noter(it.data.code, 'vu'); });
      const restantes = c.items.filter((it) => it.data.coquille && it.etat !== 'corrige');
      if (restantes.length) {
        etat.reputation--;
        etat.ratees += restantes.length;
        etat.serie = 0;
        etat.resultats.push('rate');
        restantes.forEach((it) => { noter(it.data.code, 'rate'); retenir(it.data, 'rate'); });
        const e = restantes[0].data;
        dire('rate', e.type === 'image' ? 'Coquille imprimée : la photo ne correspondait pas.' : `Coquille imprimée : ${libelle(e, e.affiche)} au lieu de ${libelle(e, e.correct)}`, explication(e));
        eclair('rate');
        CQ.Son.jouer('rate');
        CQ.vibrer([30, 50, 30]);
      } else {
        etat.score += PTS.propre + (c.bonus || 0);
        etat.resultats.push(c.zele ? 'zele' : 'parfait');
        eclair('ok');
        CQ.Son.jouer('imprime');
        if (c.bonus) dire('ok', `Bon à tirer : +${c.bonus + PTS.propre} points.`, "L'article est parti propre, en avance sur la rotative.");
      }
      majTableau();
      marquerPremiere();
      if (etat.reputation <= 0) finir('reputation');
    }

    // ---------- Boucle ----------
    function avancer(dt) {
      const acceleration = Math.min(ACCELERATION_MAX, 1 + ACCELERATION * etat.imprimes);
      const v = etat.vitesse * acceleration * (etat.turbo ? TURBO : 1);
      let prec = null;
      for (const c of etat.cartes) {
        c.y -= v * dt;
        if (prec && c.y < prec.y + prec.h + ECART) c.y = prec.y + prec.h + ECART;
        placer(c);
        prec = c;
      }
      while (etat.enCours && etat.cartes.length && etat.cartes[0].y + etat.cartes[0].h <= 0) imprimer(etat.cartes.shift());
      if (!etat.enCours) return;
      const der = etat.cartes[etat.cartes.length - 1];
      if (!der || der.y + der.h + ECART <= etat.H) {
        const servie = ajouterCarte(der ? der.y + der.h + ECART : etat.H);
        if (!servie && !etat.cartes.length) finir('bouclage');
      }
    }

    function boucle(t) {
      if (!etat.enCours) return;
      const dt = etat.dernier ? Math.min(0.05, (t - etat.dernier) / 1000) : 0;
      etat.dernier = t;
      if (!etat.enPause) avancer(dt);
      etat.raf = requestAnimationFrame(boucle);
    }

    function mesurer() {
      etat.H = plateau.clientHeight;
      etat.vitesse = etat.H / TRAVERSEE[opts.vitesse || 'normale'];
      etat.cartes.forEach((c) => { c.h = c.el.offsetHeight; });
    }

    function surVisibilite() {
      if (document.hidden && etat.enCours && !etat.enPause) controle.pause();
    }

    function finir(raison) {
      if (!etat.enCours) return;
      etat.enCours = false;
      cancelAnimationFrame(etat.raf);
      rotative.classList.add('arret');
      rail.removeEventListener('pointerdown', surPointeur);
      rail.removeEventListener('click', surClic);
      $('voile-correction').removeEventListener('click', surCorrection);
      document.removeEventListener('keydown', surClavier);
      window.removeEventListener('resize', mesurer);
      document.removeEventListener('visibilitychange', surVisibilite);
      CQ.stock.ecrire('stats', stats);
      CQ.Son.jouer('fin');
      quandFinie({
        raison,
        score: etat.score,
        trouvees: etat.trouvees,
        ratees: etat.ratees,
        zeles: etat.zeles,
        corrJustes: etat.corrJustes,
        corrTotal: etat.corrTotal,
        meilleureSerie: etat.meilleureSerie,
        resultats: etat.resultats,
        pieges: Array.from(etat.pieges.values()),
      });
    }

    const controle = {
      pause() {
        if (!etat.enCours || correction) return;
        etat.enPause = true;
        rotative.classList.add('arret');
        $('voile-pause').hidden = false;
        $('btn-reprendre').focus();
      },
      reprendre() {
        if (!etat.enCours || correction) return;
        $('voile-pause').hidden = true;
        etat.enPause = false;
        etat.dernier = 0;
        rotative.classList.remove('arret');
      },
      abandonner() {
        $('voile-pause').hidden = true;
        finir('abandon');
      },
    };

    // ---------- Démarrage ----------
    rail.innerHTML = '';
    plateau.querySelectorAll('.points').forEach((p) => p.remove());
    rotative.classList.remove('arret', 'flash-ok', 'flash-rate');
    marbre.dataset.etat = '';
    $('marbre-titre').textContent = typo("Touche les coquilles avant qu'elles partent à l'impression.");
    $('marbre-detail').textContent = typo('Faute, lettres inversées, calcul faux, information fausse, photo ou numéro de page qui ne colle pas : touche-la.');
    $('hud-date').textContent = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
    majTableau();
    mesurer();
    rail.addEventListener('pointerdown', surPointeur);
    rail.addEventListener('click', surClic);
    $('voile-correction').addEventListener('click', surCorrection);
    document.addEventListener('keydown', surClavier);
    window.addEventListener('resize', mesurer);
    document.addEventListener('visibilitychange', surVisibilite);
    ajouterCarte(Math.round(etat.H * 0.3));
    etat.raf = requestAnimationFrame(boucle);
    return controle;
  };
})();
