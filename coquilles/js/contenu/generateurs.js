/* Coquilles — générateurs d'articles à calculs et à compter.
   Un article de calcul enchaîne deux résultats. Les données de départ sont justes ;
   la coquille tombe sur l'un des résultats, et les suivants restent calculés avec
   les vraies valeurs : la valeur fautive est donc toujours repérable.
   Chaque résultat est un jeton : la bonne valeur, trois erreurs plausibles (les
   erreurs classiques d'abord) et, après « = », la réponse que le joueur doit retrouver. */
(function () {
  'use strict';
  const CQ = window.CQ;
  const G = (CQ.GENERATEURS = []);
  const L = CQ.enLettres;
  const LF = CQ.enLettresF; // au féminin : vingt et une baguettes
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const decimal = (x) => String(Math.round(x * 100) / 100).replace('.', ',');
  const heureMin = (t) => CQ.heure(Math.floor(t / 60), t % 60);
  const eurosCts = (c) => CQ.euros(c / 100);
  const heures = (x) => x + ' h';

  // Fabrique le jeton d'un résultat. opts : detail, fmt, pas, min, classiques, voisins, code, chiffres.
  function nombre(r, juste, opts) {
    const fmt = opts.fmt || String;
    const pas = opts.pas || 1;
    const min = opts.min || 1;
    const vus = new Set([fmt(juste)]);
    const fautes = [];
    const ajouter = (v) => {
      if (!(v >= min) || fautes.length >= 3) return;
      const f = fmt(v);
      if (vus.has(f)) return;
      vus.add(f);
      fautes.push(f);
    };
    (opts.classiques || []).forEach(ajouter);
    r.melanger(opts.voisins || [juste + pas, juste - pas, juste + 2 * pas]).forEach(ajouter);
    [1, -1, 2, -2, 3, -3, 4, 5, 6].forEach((k) => ajouter(juste + k * pas));
    const valeur = opts.chiffres ? String(juste) : fmt(juste);
    return `{${fmt(juste)}|${fautes.join('|')}#${opts.code || 'calc'}=${valeur}:${opts.detail}}`;
  }

  const gen = (def) => G.push(Object.assign({ rub: 'calc' }, def));

  // ---------- Enfants, CE2 : additions et soustractions ----------
  gen({ pub: ['enfant'], niv: 1, fn(r) {
    const p = r.choix(CQ.PRENOMS), a = r.entier(4, 12), b = r.entier(2, 8), s = a + b, c = r.entier(2, s - 3), reste = s - c;
    return { section: 'Récréation', titre: 'Partie de billes',
      texte: `${p} a ${a} billes. Son copain lui en donne ${b} : ${p} en a donc ${nombre(r, s, { detail: `${a} + ${b} = ${s}`, voisins: [s + 1, s - 1, s + 2, s + 10] })}. À la récré, ${p} en perd ${c} : il lui en reste ${nombre(r, reste, { detail: `${s} − ${c} = ${reste}`, classiques: [s + c], voisins: [reste + 1, reste - 1, reste + 2] })}.` };
  } });

  gen({ pub: ['enfant'], niv: 1, fn(r) {
    const a = r.entier(12, 20), b = r.entier(3, a - 4), d = a - b, e = r.entier(2, 6), t = d + e;
    return { section: 'Cuisine', titre: 'Le goûter',
      texte: `Il y avait ${a} crêpes sur la table. Les enfants en mangent ${b} : il en reste ${nombre(r, d, { detail: `${a} − ${b} = ${d}`, classiques: [a + b], voisins: [d + 1, d - 1] })}. Papi en fait ${e} de plus : cela fait ${nombre(r, t, { detail: `${d} + ${e} = ${t}`, voisins: [t + 1, t - 1, t + 2] })} crêpes.` };
  } });

  gen({ pub: ['enfant'], niv: 1, fn(r) {
    const a = r.entier(8, 15), m = r.entier(2, 7), s = a + m, d = r.entier(2, s - 4), reste = s - d;
    return { section: 'Transports', titre: 'Le bus de ramassage',
      texte: `Dans le bus, il y a ${a} enfants. À l'arrêt, ${m} enfants montent : ils sont maintenant ${nombre(r, s, { detail: `${a} + ${m} = ${s}`, voisins: [s + 1, s - 1, s + 2] })}. Plus loin, ${d} enfants descendent : il en reste ${nombre(r, reste, { detail: `${s} − ${d} = ${reste}`, classiques: [s + d], voisins: [reste + 1, reste - 1] })}.` };
  } });

  gen({ pub: ['enfant'], niv: 1, fn(r) {
    const f = r.entier(5, 12), g = r.entier(5, 12), s = f + g, k = r.entier(3, s - 3), reste = s - k;
    return { section: 'École', titre: 'Dans la cour',
      texte: `Dans la cour, ${f} filles et ${g} garçons jouent : cela fait ${nombre(r, s, { detail: `${f} + ${g} = ${s}`, voisins: [s + 1, s - 1, s + 10] })} enfants. ${k} enfants rentrent en classe : ${nombre(r, reste, { detail: `${s} − ${k} = ${reste}`, voisins: [reste + 1, reste - 1, reste + 2] })} restent dehors.` };
  } });

  // ---------- Enfants, CM1 : nombres jusqu'à 100, tables, monnaie, heures ----------
  gen({ pub: ['enfant'], niv: 2, fn(r) {
    const a = r.entier(23, 58), b = r.entier(14, 39), s = a + b, manque = 100 - s;
    return { section: 'École', titre: 'Collecte de bouchons',
      texte: `La classe de CM1 a ramassé ${a} bouchons et la classe de CM2 en a ramassé ${b} : cela fait ${nombre(r, s, { detail: `${a} + ${b} = ${s}`, classiques: [s - 10], voisins: [s + 10, s - 1, s + 1] })} bouchons. Il en faut 100 pour remplir le sac : il en manque encore ${nombre(r, manque, { detail: `100 − ${s} = ${manque}`, voisins: [manque + 10, manque - 10, manque + 1, manque - 1] })}.` };
  } });

  gen({ pub: ['enfant'], niv: 2, fn(r) {
    const p = r.choix(CQ.PRENOMS), prix = r.entier(2, 5), k = r.entier(2, 3), tot = prix * k, rendu = 20 - tot;
    return { section: 'Commerces', titre: 'À la papeterie',
      texte: `Un cahier coûte ${prix} €. ${p} en achète ${k} et paie ${nombre(r, tot, { detail: `${k} × ${prix} = ${tot}`, classiques: [prix + k], voisins: [tot + prix, tot - prix, tot + 1] })} €. Avec un billet de 20 €, on lui rend ${nombre(r, rendu, { detail: `20 − ${tot} = ${rendu}`, voisins: [rendu + 1, rendu - 1, rendu + 2, rendu + 10] })} €.` };
  } });

  gen({ pub: ['enfant'], niv: 2, fn(r) {
    const h = r.entier(13, 16), d = r.entier(1, 2), fin = h + d, gouter = fin + 1;
    return { section: 'Cinéma', titre: 'Séance de cinéma',
      texte: `Le film commence à ${h} h et dure ${d === 1 ? 'une heure' : d + ' heures'} : il finit à ${nombre(r, fin, { detail: `${h} h + ${d} h = ${fin} h`, fmt: heures, voisins: [fin + 1, fin - 1, fin + 2] })}. Le goûter est servi une heure plus tard, à ${nombre(r, gouter, { detail: `${fin} h + 1 h = ${gouter} h`, fmt: heures, voisins: [gouter + 1, gouter - 1, gouter + 2] })}.` };
  } });

  gen({ pub: ['enfant'], niv: 2, fn(r) {
    const rangs = r.entier(3, 6), parRang = r.entier(4, 9), s = rangs * parRang, manges = r.entier(3, 9), reste = s - manges;
    return { section: 'Jardin', titre: 'Les salades du potager',
      texte: `Les élèves ont planté ${rangs} rangs de ${parRang} salades : cela fait ${nombre(r, s, { detail: `${rangs} × ${parRang} = ${s}`, classiques: [rangs + parRang], voisins: [s + parRang, s - parRang, s + 1] })} salades. Les lapins en mangent ${manges} : il en reste ${nombre(r, reste, { detail: `${s} − ${manges} = ${reste}`, voisins: [reste + 1, reste - 1, reste + 10] })}.` };
  } });

  // ---------- Enfants, CM2 : chaînes plus longues, minutes, divisions ----------
  gen({ pub: ['enfant'], niv: 3, fn(r) {
    const p = r.choix(CQ.PRENOMS), k = r.entier(4, 9), m = r.entier(6, 9), s = k * m, d = r.entier(5, 15), reste = s - d;
    return { section: 'École', titre: 'Le rangement de la classe',
      texte: `${p} range ${k} boîtes de ${m} crayons : cela fait ${nombre(r, s, { detail: `${k} × ${m} = ${s}`, voisins: [s + m, s - m, s + 1, s - 1] })} crayons. ${p} en donne ${d} à la classe voisine : il en reste ${nombre(r, reste, { detail: `${s} − ${d} = ${reste}`, voisins: [reste + 1, reste - 1, reste + 10, reste - 10] })}.` };
  } });

  gen({ pub: ['enfant'], niv: 3, fn(r) {
    const p = r.choix(CQ.PRENOMS), livre = r.entier(8, 14), stylo = r.entier(2, 5), tot = livre + stylo, rendu = 20 - tot;
    return { section: 'Commerces', titre: 'À la librairie',
      texte: `${p} achète un livre à ${livre} € et un stylo à ${stylo} € : cela fait ${nombre(r, tot, { detail: `${livre} + ${stylo} = ${tot}`, voisins: [tot + 1, tot - 1, tot + 2, tot + 10] })} €. Avec un billet de 20 €, la libraire lui rend ${nombre(r, rendu, { detail: `20 − ${tot} = ${rendu}`, voisins: [rendu + 1, rendu - 1, rendu + 2] })} €.` };
  } });

  gen({ pub: ['enfant'], niv: 3, fn(r) {
    const debut = 10 * 60 + r.choix([0, 5, 10, 15, 20, 25, 30]), d = r.choix([15, 20, 25, 30]), fin = debut + d, reprise = fin + 5;
    return { section: 'École', titre: 'La récréation',
      texte: `La récréation commence à ${heureMin(debut)} et dure ${d} minutes : elle finit à ${nombre(r, fin, { detail: `${heureMin(debut)} + ${d} minutes = ${heureMin(fin)}`, fmt: heureMin, pas: 5 })}. La classe reprend 5 minutes plus tard, à ${nombre(r, reprise, { detail: `${heureMin(fin)} + 5 minutes = ${heureMin(reprise)}`, fmt: heureMin, pas: 5 })}.` };
  } });

  gen({ pub: ['enfant'], niv: 3, fn(r) {
    const taille = r.entier(4, 6), groupes = r.entier(4, 7), eleves = taille * groupes, adultes = r.entier(1, 2), total = groupes * adultes;
    return { section: 'Sorties', titre: 'Sortie au château',
      texte: `${eleves} élèves partent visiter le château. On forme des groupes de ${taille} : cela fait ${nombre(r, groupes, { detail: `${eleves} ÷ ${taille} = ${groupes}`, voisins: [groupes + 1, groupes - 1, groupes + 2] })} groupes. Avec ${adultes === 1 ? 'un adulte' : 'deux adultes'} par groupe, il faut ${nombre(r, total, { detail: `${groupes} × ${adultes} = ${total}`, voisins: [total + 1, total - 1, total + 2] })} accompagnateurs.` };
  } });

  // ---------- Dates impossibles (tous publics) ----------
  const MOIS_30 = ['avril', 'juin', 'septembre', 'novembre'];
  const PHRASES_DATE = {
    enfant: [
      { section: 'École', titre: "Le spectacle de fin d'année", phrase: 'Le spectacle de danse aura lieu le @. Les parents sont invités.' },
      { section: 'École', titre: 'Sortie au zoo', phrase: 'La sortie au zoo est prévue le @. Pensez à prendre un pique-nique !' },
    ],
    adulte: [
      { section: 'Agenda', titre: 'Réunion publique', phrase: 'La réunion publique sur le nouveau quartier est fixée au @, à 19 h.' },
      { section: 'Agenda', titre: "Le salon de l'habitat", phrase: "Le salon de l'habitat ouvrira ses portes le @ au parc des expositions." },
      { section: 'Concours', titre: 'Concours photo', phrase: 'Les photos du concours doivent être déposées à la mairie avant le @ à midi.' },
    ],
    apprenant: [
      { section: 'Invitations', titre: "Fête d'anniversaire", phrase: "Mon anniversaire est le @ : venez à la fête !" },
      { section: 'Agenda', titre: 'Cours de français', phrase: 'Les cours de français reprennent le @.' },
    ],
  };
  ['enfant', 'adulte', 'apprenant'].forEach((pub) => {
    gen({ pub: [pub], niv: pub === 'adulte' ? 1 : 3, fn(r) {
      const fevrier = r.chance(0.25);
      const mois = fevrier ? 'février' : r.choix(MOIS_30);
      const max = fevrier ? 28 : 30;
      const jour = r.entier(max - 9, max);
      const detail = fevrier ? "Février n'a que 28 jours (29 les années bissextiles)." : `${cap(mois)} n'a que 30 jours.`;
      const modele = r.choix(PHRASES_DATE[pub]);
      const jeton = `{${jour} ${mois}|${fevrier ? r.choix([30, 31]) : 31} ${mois}#date:${detail}}`;
      return { section: modele.section, titre: modele.titre, texte: modele.phrase.replace('@', jeton) };
    } });
  });

  // ---------- Adultes ----------
  gen({ pub: ['adulte'], niv: 1, fn(r) {
    const q = r.entier(2, 3), baguette = r.choix([105, 110, 115, 120, 125, 130]), pain = r.entier(18, 32) * 10;
    const tot = q * baguette + pain, billet = tot < 1000 ? 10 : 20, rendu = billet * 100 - tot;
    return { section: 'Consommation', titre: 'Rendre la monnaie',
      texte: `Une cliente achète ${q} baguettes à ${eurosCts(baguette)} € et un pain aux céréales à ${eurosCts(pain)} € : elle paie ${nombre(r, tot, { detail: `${q} × ${eurosCts(baguette)} + ${eurosCts(pain)} = ${eurosCts(tot)} €`, fmt: eurosCts, pas: 10, classiques: [baguette + pain], voisins: [tot + 100, tot - 100, tot + 50, tot - 50] })} €. Avec un billet de ${billet} €, on lui rend ${nombre(r, rendu, { detail: `${billet} − ${eurosCts(tot)} = ${eurosCts(rendu)} €`, fmt: eurosCts, pas: 10, voisins: [rendu + 100, rendu - 100, rendu + 50, rendu - 50] })} €.` };
  } });

  gen({ pub: ['adulte'], niv: 1, fn(r) {
    const depart = 6 * 60 + r.entier(0, 150) * 5, d = r.entier(10, 34) * 5, arrivee = depart + d;
    const corresp = r.choix([15, 20, 25, 35, 40]), repart = arrivee + corresp;
    return { section: 'Transports', titre: 'Horaires du TER',
      texte: `Parti à ${heureMin(depart)}, le TER est arrivé à Lyon à ${heureMin(arrivee)}, soit ${nombre(r, d, { detail: `De ${heureMin(depart)} à ${heureMin(arrivee)}, il s'écoule ${CQ.duree(d)}.`, fmt: CQ.duree, pas: 5, voisins: [d + 10, d - 10, d + 20, d - 20] })} de trajet. Avec ${corresp} minutes de correspondance, le voyageur repart à ${nombre(r, repart, { detail: `${heureMin(arrivee)} + ${corresp} minutes = ${heureMin(repart)}`, fmt: heureMin, pas: 5, voisins: [repart + 10, repart - 10, repart + 60] })}.` };
  } });

  gen({ pub: ['adulte'], niv: 1, fn(r) {
    const total = r.entier(80, 240), f = r.entier(Math.round(total * 0.3), Math.round(total * 0.7)), h = total - f;
    const nouveaux = r.entier(8, 30), apres = total + nouveaux;
    return { section: 'Associations', titre: 'Le club de randonnée',
      texte: `Le club de randonnée compte ${total} adhérents : ${f} femmes et ${nombre(r, h, { detail: `${total} − ${f} = ${h}`, voisins: [h + 10, h - 10, h + 1, h - 1] })} hommes. Avec ${nouveaux} nouvelles inscriptions, il comptera bientôt ${nombre(r, apres, { detail: `${total} + ${nouveaux} = ${apres}`, voisins: [apres + 10, apres - 10, apres + 1] })} membres.` };
  } });

  const ARTICLES_SOLDES = ['Une veste', 'Une lampe', 'Une valise', 'Une montre', 'Une cafetière'];
  gen({ pub: ['adulte'], niv: 2, fn(r) {
    const prix = r.choix([40, 60, 80, 100, 120, 150, 200]), pct = r.choix([10, 20, 25, 30, 40, 50]);
    const remise = prix * pct, solde = prix * 100 - remise; // en centimes
    return { section: 'Consommation', titre: 'Soldes : faites le calcul',
      texte: `${r.choix(ARTICLES_SOLDES)} à ${prix} € est soldée à −${pct} % : la remise est de ${nombre(r, remise, { detail: `${pct} % de ${prix} € = ${prix} × ${pct} ÷ 100 = ${eurosCts(remise)} €`, fmt: eurosCts, pas: 100, classiques: [pct * 100], voisins: [remise + 500, remise - 500, remise + 1000] })} €, et elle ne coûte plus que ${nombre(r, solde, { detail: `${prix} − ${eurosCts(remise)} = ${eurosCts(solde)} €`, fmt: eurosCts, pas: 100, classiques: [prix * 100 - pct * 100], voisins: [solde + 500, solde - 500, solde + 1000] })} €.` };
  } });

  gen({ pub: ['adulte'], niv: 2, fn(r) {
    const k1 = r.choix([4, 6]), k2 = r.choix([8, 12]), u1 = r.entier(8, 14) * 5, u2 = u1 + r.choix([-10, -5, 5]);
    const lot1 = u1 * k1, lot2 = u2 * k2;
    const conclusion = u2 < u1 ? 'le grand lot est plus avantageux' : 'le petit lot revient moins cher';
    return { section: 'Consommation', titre: 'Le vrai prix des yaourts',
      texte: `Le lot de ${k1} yaourts coûte ${eurosCts(lot1)} €, soit ${nombre(r, u1, { detail: `${eurosCts(lot1)} € ÷ ${k1} = ${eurosCts(u1)} €`, fmt: eurosCts, pas: 5, voisins: [u1 + 10, u1 - 10, u1 + 5] })} € le pot. Le lot de ${k2} coûte ${eurosCts(lot2)} €, soit ${nombre(r, u2, { detail: `${eurosCts(lot2)} € ÷ ${k2} = ${eurosCts(u2)} €`, fmt: eurosCts, pas: 5, voisins: [u2 + 10, u2 - 10, u2 + 5] })} € le pot : ${conclusion}.` };
  } });

  const PRODUITS_KILO = [
    { petit: 'Le paquet de @ g de café', grand: "Le paquet d'un kilo", kilos: [12, 14, 16, 20] },
    { petit: 'Le morceau de @ g de comté', grand: "Le morceau d'un kilo", kilos: [16, 20, 24] },
  ];
  gen({ pub: ['adulte'], niv: 2, fn(r) {
    const produit = r.choix(PRODUITS_KILO), kilo = r.choix(produit.kilos), g = r.choix([250, 500]);
    const prix = (kilo * g) / 10, economie = r.entier(1, 4), grand = kilo - economie; // prix en centimes
    return { section: 'Consommation', titre: 'Le prix au kilo',
      texte: `${produit.petit.replace('@', g)} coûte ${eurosCts(prix)} €, soit ${nombre(r, kilo, { detail: `${eurosCts(prix)} € × ${1000 / g} = ${kilo} €`, fmt: CQ.euros, classiques: [g === 250 ? kilo / 2 : kilo * 2], voisins: [kilo + 2, kilo - 2] })} € le kilo. ${produit.grand} coûte ${grand} € : on économise ${nombre(r, economie, { detail: `${kilo} − ${grand} = ${economie} €`, fmt: CQ.euros, voisins: [economie + 1, economie + 2, economie - 1] })} € par kilo.` };
  } });

  gen({ pub: ['adulte'], niv: 2, fn(r) {
    const n = r.choix([200, 300, 400, 500, 800, 1200]), pct = r.choix([10, 15, 20, 25, 30, 40, 60, 75]), oui = (n * pct) / 100, autres = n - oui;
    return { section: 'Vie locale', titre: 'Le référendum local',
      texte: `Sur ${CQ.milliers(n)} votants, ${pct} % ont voté pour le projet, soit ${nombre(r, oui, { detail: `${pct} % de ${CQ.milliers(n)} = ${CQ.milliers(n)} × ${pct} ÷ 100 = ${CQ.milliers(oui)}`, fmt: CQ.milliers, pas: 10, voisins: [oui + n / 20, oui - n / 20, oui + 10] })} personnes. Les ${nombre(r, autres, { detail: `${CQ.milliers(n)} − ${CQ.milliers(oui)} = ${CQ.milliers(autres)}`, fmt: CQ.milliers, pas: 10, voisins: [autres + 10, autres - 10, autres + 100] })} autres ont voté contre ou blanc.` };
  } });

  gen({ pub: ['adulte'], niv: 2, fn(r) {
    const parPers = r.choix([50, 60, 75, 100, 125]), a = r.choix([2, 4]), b = r.choix([3, 5, 6, 8].filter((x) => x !== a));
    const q = parPers * a, res = parPers * b;
    return { section: 'Cuisine', titre: 'Règle de trois en cuisine',
      texte: `Pour ${a} personnes, il faut ${q} g de farine, soit ${nombre(r, parPers, { detail: `${q} ÷ ${a} = ${parPers} g`, pas: 5, voisins: [parPers + 10, parPers - 10, parPers + 25] })} g par personne. Pour ${b} personnes, il en faut donc ${nombre(r, res, { detail: `${parPers} × ${b} = ${res} g`, pas: 10, voisins: [res + parPers, res - parPers, res + 50] })} g.` };
  } });

  gen({ pub: ['adulte'], niv: 3, fn(r) {
    const v = r.choix([16, 18, 20, 22, 24, 26, 28, 30]), t = r.choix([90, 120, 150, 180]), dist = (v * t) / 60;
    const t2 = r.choix([60, 90, 120, 150, 180].filter((x) => x !== t)), dist2 = (v * t2) / 60;
    const fauxDecimal = t % 60 ? Math.round(dist / (Math.floor(t / 60) + (t % 60) / 100)) : 0;
    return { section: 'Sports', titre: 'Sortie vélo du dimanche',
      texte: `Le cycliste a parcouru ${dist} km en ${CQ.duree(t)}, soit une moyenne de ${nombre(r, v, { detail: `${CQ.duree(t)} = ${decimal(t / 60)} h ; ${dist} ÷ ${decimal(t / 60)} = ${v} km/h.`, classiques: [fauxDecimal], voisins: [v + 2, v - 2, v + 4] })} km/h. À ce rythme, il lui faudrait ${nombre(r, t2, { detail: `${dist2} ÷ ${v} = ${decimal(t2 / 60)} h, soit ${CQ.duree(t2)}.`, fmt: CQ.duree, pas: 15, voisins: [t2 + 30, t2 - 30, t2 + 15] })} pour parcourir ${dist2} km.` };
  } });

  gen({ pub: ['adulte'], niv: 3, fn(r) {
    const ht = r.entier(3, 24) * 50, tva = ht / 5, ttc = ht + tva;
    return { section: 'Pratique', titre: 'Le devis du plombier',
      texte: `Un artisan facture ${CQ.milliers(ht)} € HT. La TVA à 20 % s'élève à ${nombre(r, tva, { detail: `20 % de ${CQ.milliers(ht)} = ${CQ.milliers(ht)} ÷ 5 = ${CQ.milliers(tva)} €`, fmt: CQ.milliers, pas: 10, classiques: [20], voisins: [tva + ht / 10, tva - ht / 10, tva + 10] })} €, soit ${nombre(r, ttc, { detail: `${CQ.milliers(ht)} + ${CQ.milliers(tva)} = ${CQ.milliers(ttc)} €`, fmt: CQ.milliers, pas: 10, classiques: [ht + 20], voisins: [ttc + ht / 10, ttc - ht / 10] })} € TTC.` };
  } });

  gen({ pub: ['adulte'], niv: 3, fn(r) {
    const loyer = r.choix([500, 600, 700, 800, 900, 1000, 1200]), l1 = (loyer * 11) / 10, l2 = Math.round((loyer * 121) / 100);
    return { section: 'Logement', titre: 'Deux hausses de loyer',
      texte: `Un loyer de ${CQ.milliers(loyer)} € augmente de 10 % en janvier, à ${nombre(r, l1, { detail: `${CQ.milliers(loyer)} + 10 % = ${CQ.milliers(loyer)} × 1,1 = ${CQ.milliers(l1)} €`, fmt: CQ.milliers, pas: 10, voisins: [l1 + 10, l1 - 10, l1 + 100] })} €, puis encore de 10 % en juillet, à ${nombre(r, l2, { detail: `${CQ.milliers(l1)} × 1,1 = ${CQ.milliers(l2)} € : deux hausses de 10 % font +21 %, pas +20 %.`, fmt: CQ.milliers, pas: 10, classiques: [(loyer * 12) / 10], voisins: [l2 + 10, l2 - 10] })} €.` };
  } });

  gen({ pub: ['adulte'], niv: 3, fn(r) {
    const cours = r.choix([40, 60, 80, 100, 120, 200]), c1 = cours / 2, c2 = (c1 * 3) / 2;
    return { section: 'Bourse', titre: 'Les montagnes russes',
      texte: `Une action cotée ${cours} € perd 50 % lundi : elle vaut ${nombre(r, c1, { detail: `${cours} ÷ 2 = ${c1} €`, pas: 5, voisins: [c1 + 10, c1 - 10, c1 + 5] })} €. Mardi, elle regagne 50 % : elle vaut ${nombre(r, c2, { detail: `${c1} + 50 % = ${c1} × 1,5 = ${c2} €. Une hausse de 50 % ne rattrape pas une baisse de 50 %.`, pas: 5, classiques: [cours], voisins: [c2 + 10, c2 - 10] })} €.` };
  } });

  // ---------- Apprenants : nombres en lettres, réponse en chiffres ----------
  const enLettres = { fmt: L, chiffres: true, min: 2 };
  const enLettresF = { fmt: LF, chiffres: true, min: 2 };
  const T = (r, juste, opts, lettres) => nombre(r, juste, Object.assign({}, opts, lettres || enLettres));

  gen({ pub: ['apprenant'], niv: 1, fn(r) {
    const a = r.entier(3, 5), b = r.entier(2, 3), s = a + b, rendu = 10 - s;
    return { section: 'Restaurant', titre: 'Un déjeuner rapide',
      texte: `Un sandwich coûte ${L(a)} euros et une boisson ${L(b)} euros : je paie ${T(r, s, { detail: `${a} + ${b} = ${s} (${L(s)})`, voisins: [s + 1, s - 1, s + 2] })} euros. Je donne dix euros : on me rend ${T(r, rendu, { detail: `10 − ${s} = ${rendu} (${L(rendu)})`, voisins: [rendu + 1, rendu + 2, rendu - 1] })} euros.` };
  } });

  gen({ pub: ['apprenant'], niv: 1, fn(r) {
    const a = r.entier(8, 12), b = r.entier(2, 5), c = r.entier(2, 4);
    return { section: 'Famille', titre: 'Mon frère et ma sœur',
      texte: `J'ai ${L(a)} ans. Ma sœur a ${L(b)} ans de plus que moi : elle a ${T(r, a + b, { detail: `${a} + ${b} = ${a + b} (${L(a + b)})`, voisins: [a + b + 1, a + b - 1, a + b + 2] })} ans. Mon frère a ${L(c)} ans de moins que moi : il a ${T(r, a - c, { detail: `${a} − ${c} = ${a - c} (${L(a - c)})`, voisins: [a - c + 1, a - c - 1, a + c] })} ans.` };
  } });

  gen({ pub: ['apprenant'], niv: 2, fn(r) {
    const a = r.entier(18, 35), b = r.entier(5, 19), s = a + b, ecart = r.entier(24, 30), pere = s + ecart;
    return { section: 'Famille', titre: 'Mon grand frère',
      texte: `J'ai ${L(a)} ans. Mon frère a ${L(b)} ans de plus que moi : il a ${T(r, s, { detail: `${a} + ${b} = ${s} (${L(s)})`, voisins: [s + 1, s - 1, s + 10, s - 10] })} ans. Notre père a ${L(ecart)} ans de plus que lui : il a ${T(r, pere, { detail: `${s} + ${ecart} = ${pere} (${L(pere)})`, voisins: [pere + 1, pere - 1, pere + 10, pere - 10] })} ans.` };
  } });

  gen({ pub: ['apprenant'], niv: 2, fn(r) {
    const a = r.entier(12, 35), b = r.entier(10, 30), s = a + b, reste = r.entier(3, 9), prepare = s + reste;
    return { section: 'Commerces', titre: 'La boulangerie du quartier',
      texte: `La boulangerie a vendu ${LF(a)} baguettes le matin et ${LF(b)} l'après-midi : ${T(r, s, { detail: `${a} + ${b} = ${s} (${LF(s)})`, voisins: [s + 1, s - 1, s + 10, s - 10] }, enLettresF)} baguettes au total. Il en reste ${LF(reste)} : elle en avait préparé ${T(r, prepare, { detail: `${s} + ${reste} = ${prepare} (${LF(prepare)})`, voisins: [prepare + 1, prepare - 1, prepare + 10] }, enLettresF)}.` };
  } });

  gen({ pub: ['apprenant'], niv: 2, fn(r) {
    const depart = r.entier(6, 11), d = r.entier(2, 4), arrivee = depart + d;
    return { section: 'Transports', titre: 'Le voyage en train',
      texte: `Le train part à ${L(depart)} heures et arrive à ${L(arrivee)} heures : le voyage dure ${T(r, d, { detail: `${arrivee} − ${depart} = ${d} (${L(d)})`, voisins: [d + 1, d - 1, d + 2] })} heures. Le retour dure une heure de plus : ${T(r, d + 1, { detail: `${d} + 1 = ${d + 1} (${L(d + 1)})`, voisins: [d + 2, d, d + 3] })} heures.` };
  } });

  gen({ pub: ['apprenant'], niv: 3, fn(r) {
    const nuit = r.entier(35, 49), s = nuit * 2, dej = r.entier(6, 9), total = s + 2 * dej;
    return { section: 'Voyages', titre: "Une chambre d'hôtel",
      texte: `Une nuit à l'hôtel coûte ${L(nuit)} euros. Pour deux nuits, je paie ${T(r, s, { detail: `2 × ${nuit} = ${s} (${L(s)})`, classiques: [s + 20, s - 20], voisins: [s + 1, s - 1, s + 10] })} euros. Avec deux petits-déjeuners à ${L(dej)} euros, le total est de ${T(r, total, { detail: `${s} + 2 × ${dej} = ${total} (${L(total)})`, classiques: [s + dej], voisins: [total + 1, total - 1, total + 10] })} euros.` };
  } });

  gen({ pub: ['apprenant'], niv: 3, fn(r) {
    let a, b;
    do { a = r.entier(35, 50); b = r.entier(30, 49); } while (a + b < 70 || a + b > 99);
    const s = a + b, reste = 100 - s;
    return { section: 'Commerces', titre: 'Un samedi à la boulangerie',
      texte: `Samedi, la boulangerie a vendu ${LF(a)} baguettes le matin et ${LF(b)} l'après-midi : ${T(r, s, { detail: `${a} + ${b} = ${s} (${LF(s)})`, classiques: [s + 20, s - 20], voisins: [s + 1, s - 1, s + 10] }, enLettresF)} baguettes au total. Elle en avait préparé cent : il en reste ${T(r, reste, { detail: `100 − ${s} = ${reste} (${LF(reste)})`, voisins: [reste + 1, reste - 1, reste + 10] }, enLettresF)}.` };
  } });

  // ---------- Mise en page : le sommaire ----------
  const RUBRIQUES_SOMMAIRE = ['Vie locale', 'Économie', 'Culture', 'Sports', 'Météo', 'Jeux', 'Petites annonces', 'Programme télé', 'Courrier des lecteurs'];
  gen({ pub: ['enfant', 'adulte', 'apprenant'], niv: 1, rub: 'page', fn(r) {
    const total = r.choix([12, 16, 20, 24]);
    const sections = r.melanger(RUBRIQUES_SOMMAIRE).slice(0, 4);
    const pages = r.melanger(Array.from({ length: total - 2 }, (_, i) => i + 2)).slice(0, 4).sort((a, b) => a - b);
    const k = r.entier(1, 3);
    let faux, detail;
    if (k < 3 && pages[k - 1] > 2 && r.chance(0.5)) {
      faux = Math.max(2, pages[k - 1] - r.entier(1, 3));
      detail = `Le sommaire suit l'ordre des pages : après ${sections[k - 1]} en page ${pages[k - 1]}, la rubrique suivante ne peut pas être en page ${faux}.`;
    } else {
      faux = total + r.entier(2, 9);
      detail = `Ce numéro n'a que ${total} pages : la page ${faux} n'existe pas.`;
    }
    const ligne = (i) => `${sections[i]}, page ${i === k ? `{${pages[i]}|${faux}#sommaire:${detail}}` : pages[i]}.`;
    return { section: 'Sommaire', titre: 'Dans ce numéro',
      texte: `Ce numéro compte ${total} pages. ` + [0, 1, 2, 3].map(ligne).join(' ') };
  } });

  // ---------- Faits : âge et année de naissance ----------
  const ANNEE = new Date().getFullYear();
  const AINES = { f: ['Jeanne', 'Marcelle', 'Yvette', 'Simone', 'Odette', 'Paulette'], m: ['Marcel', 'René', 'Lucien', 'André', 'Robert', 'Gaston'] };
  const NOMS = ['Martin', 'Dubois', 'Lefèvre', 'Moreau', 'Girard', 'Fontaine', 'Mercier'];
  gen({ pub: ['adulte'], niv: 2, rub: 'faits', fn(r) {
    const f = r.chance(0.5), age = r.entier(70, 104), annee = ANNEE - age;
    return { section: 'Carnet', titre: f ? 'Une doyenne en pleine forme' : 'Un doyen en pleine forme',
      texte: `${f ? 'Née' : 'Né'} en ${annee}, ${r.choix(f ? AINES.f : AINES.m)} ${r.choix(NOMS)} fête aujourd'hui ses ${nombre(r, age, { code: 'age', detail: `${ANNEE} − ${annee} = ${age}`, voisins: [age + 10, age - 10, age + 1, age - 1] })} ans. ${f ? 'Elle' : 'Il'} vit toujours dans sa maison du centre-bourg.` };
  } });
  gen({ pub: ['enfant'], niv: 3, rub: 'faits', fn(r) {
    const age = r.entier(60, 85), annee = ANNEE - age;
    return { section: 'Famille', titre: "L'anniversaire de mamie",
      texte: `Mamie Louise est née en ${annee}. Cette année, elle fête ses ${nombre(r, age, { code: 'age', detail: `${ANNEE} − ${annee} = ${age}`, voisins: [age + 10, age - 10, age + 1] })} ans : toute la famille sera là !` };
  } });
  gen({ pub: ['apprenant'], niv: 3, rub: 'faits', fn(r) {
    const age = r.entier(70, 95), annee = ANNEE - age;
    return { section: 'Famille', titre: 'Ma grand-mère',
      texte: `Ma grand-mère est née en ${annee}. Cette année, elle a ${nombre(r, age, Object.assign({ code: 'age', detail: `${ANNEE} − ${annee} = ${age} (${L(age)})`, classiques: [age + 20, age - 20], voisins: [age + 1, age - 1] }, enLettres))} ans.` };
  } });

  // ---------- Faits : le jour de la semaine, par rapport à la date du journal ----------
  const JOURS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  const dateLongue = (d, jour) => `${JOURS[jour === undefined ? d.getDay() : jour]} ${d.getDate() === 1 ? '1er' : d.getDate()} ${MOIS[d.getMonth()]}`;
  const ECARTS_JOUR = [
    { n: 1, mot: 'demain', temps: 'futur' }, { n: 2, mot: 'après-demain', temps: 'futur' },
    { n: 7, mot: 'dans une semaine', temps: 'futur' }, { n: -1, mot: 'hier', temps: 'passe' },
  ];
  const PHRASES_JOUR = {
    enfant: {
      futur: [{ titre: 'Sortie à la piscine', phrase: 'La sortie à la piscine aura lieu @.' }, { titre: 'Le goûter de la classe', phrase: 'Le goûter de la classe est prévu @.' }],
      passe: [{ titre: 'Visite au musée', phrase: 'La classe a visité le musée @.' }],
    },
    adulte: {
      futur: [{ titre: 'Conseil municipal', phrase: 'Le conseil municipal se réunira @, à 18 h 30.' }, { titre: 'Encombrants', phrase: 'La collecte des encombrants passera @.' }, { titre: 'Vide-grenier', phrase: 'Les inscriptions au vide-grenier fermeront @.' }],
      passe: [{ titre: 'Marché nocturne', phrase: "Le marché nocturne s'est tenu @, sous la pluie." }],
    },
    apprenant: {
      futur: [{ titre: 'Cours de français', phrase: 'Mon cours de français aura lieu @.' }, { titre: 'Musée fermé', phrase: 'Le musée sera fermé @.' }],
      passe: [{ titre: 'Au cinéma', phrase: 'Je suis allé au cinéma @.' }],
    },
  };
  ['enfant', 'adulte', 'apprenant'].forEach((pub) => {
    gen({ pub: [pub], niv: pub === 'enfant' ? 2 : 1, rub: 'faits', fn(r) {
      const auj = new Date();
      const ecart = r.choix(ECARTS_JOUR);
      const d = new Date(auj.getFullYear(), auj.getMonth(), auj.getDate() + ecart.n);
      const juste = dateLongue(d);
      const fautes = [1, -1].map((x) => dateLongue(d, (d.getDay() + x + 7) % 7));
      const modele = r.choix(PHRASES_JOUR[pub][ecart.temps]);
      const detail = `Nous sommes ${dateLongue(auj)} : ${ecart.mot}, c'est ${juste}.`;
      return { section: 'Agenda', titre: modele.titre,
        texte: modele.phrase.replace('@', `${ecart.mot}, {${juste}|${r.melanger(fautes).join('|')}#jour:${detail}}`) };
    } });
  });

  // ---------- Images à compter ----------
  G.push({ pub: ['enfant', 'apprenant'], niv: 1, rub: 'image', fn(r, niveau) {
    const objet = r.choix(CQ.OBJETS_A_COMPTER), p = r.choix(CQ.PRENOMS);
    const [min, max] = niveau === 1 ? [2, 5] : niveau === 2 ? [3, 7] : [4, 8];
    const n = r.entier(min, max);
    return { section: 'Photo du jour', titre: objet.titre,
      texte: cap(objet.phrase(p, L(n))),
      ok: objet.e.repeat(n), ko: [objet.e.repeat(n + 1), objet.e.repeat(n - 1)],
      expl: `Le texte dit « ${L(n)} » : il en fallait ${n}.` };
  } });
})();
