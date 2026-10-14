/* Coquilles — générateurs d'articles à calculs et à compter.
   Chaque générateur renvoie un article dont le résultat est un jeton :
   la bonne valeur d'abord, puis des erreurs plausibles (souvent les erreurs classiques). */
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

  // Fabrique le jeton d'une valeur : erreur classique d'abord, puis des voisines.
  function nombre(r, juste, opts) {
    const fmt = opts.fmt || String;
    const vus = new Set([fmt(juste)]);
    const fautes = [];
    const ajouter = (v) => {
      if (!(v > 0) || fautes.length >= 2) return;
      const f = fmt(v);
      if (vus.has(f)) return;
      vus.add(f);
      fautes.push(f);
    };
    (opts.classiques || []).forEach(ajouter);
    r.melanger(opts.voisins || [juste + 1, juste - 1, juste + 2]).forEach(ajouter);
    if (fautes.length === 0) fautes.push(fmt(juste + 1));
    return `{${fmt(juste)}|${fautes.join('|')}#${opts.code || 'calc'}:${opts.detail}}`;
  }

  const gen = (def) => G.push(Object.assign({ rub: 'calc' }, def));

  // ---------- Enfants ----------
  gen({ pub: ['enfant'], niv: 1, fn(r) {
    const p = r.choix(CQ.PRENOMS), a = r.entier(3, 12), b = r.entier(2, 8), s = a + b;
    return { section: 'Récréation', titre: 'Partie de billes',
      texte: `${p} a ${a} billes. Son copain lui en donne ${b}. Maintenant, ${p} a ${nombre(r, s, { detail: `${a} + ${b} = ${s}`, voisins: [s - 1, s + 1, s + 2, s - 2] })} billes.` };
  } });

  gen({ pub: ['enfant'], niv: 1, fn(r) {
    const a = r.entier(9, 20), b = r.entier(2, a - 4), d = a - b;
    return { section: 'Cuisine', titre: 'Le goûter',
      texte: `Il y avait ${a} crêpes sur la table. Les enfants en ont mangé ${b} : il en reste ${nombre(r, d, { detail: `${a} − ${b} = ${d}`, classiques: [a + b], voisins: [d - 1, d + 1] })}.` };
  } });

  gen({ pub: ['enfant'], niv: 2, fn(r) {
    const a = r.entier(23, 58), b = r.entier(14, 39), s = a + b;
    return { section: 'École', titre: 'Collecte de bouchons',
      texte: `La classe de CM1 a ramassé ${a} bouchons et la classe de CM2 en a ramassé ${b}. Cela fait ${nombre(r, s, { detail: `${a} + ${b} = ${s}`, classiques: [s - 10], voisins: [s + 10, s - 1, s + 1] })} bouchons pour l'association.` };
  } });

  gen({ pub: ['enfant'], niv: 2, fn(r) {
    const p = r.choix(CQ.PRENOMS), prix = r.entier(2, 5), k = r.entier(2, 5), s = prix * k;
    return { section: 'Commerces', titre: 'À la papeterie',
      texte: `Un cahier coûte ${prix} €. ${p} en achète ${k} et paie ${nombre(r, s, { detail: `${k} × ${prix} = ${s}`, classiques: [prix + k], voisins: [s + prix, s - prix, s + 1] })} €.` };
  } });

  gen({ pub: ['enfant'], niv: 2, fn(r) {
    const h = r.entier(13, 17), d = r.entier(1, 3), fin = h + d;
    return { section: 'Cinéma', titre: 'Séance de cinéma',
      texte: `Le film commence à ${h} h et dure ${d === 1 ? 'une heure' : d + ' heures'}. Il finit à ${nombre(r, fin, { detail: `${h} h + ${d} h = ${fin} h`, fmt: (x) => x + ' h', voisins: [fin + 1, fin - 1] })}.` };
  } });

  gen({ pub: ['enfant'], niv: 3, fn(r) {
    const p = r.choix(CQ.PRENOMS), k = r.entier(3, 9), m = r.entier(4, 9), s = k * m;
    return { section: 'École', titre: 'Le rangement de la classe',
      texte: `${p} range ${k} boîtes de ${m} crayons. Cela fait ${nombre(r, s, { detail: `${k} × ${m} = ${s}`, voisins: [s + m, s - m, s + 1, s - 1] })} crayons en tout.` };
  } });

  gen({ pub: ['enfant'], niv: 3, fn(r) {
    const p = r.choix(CQ.PRENOMS), prix = r.entier(6, 17), rendu = 20 - prix;
    return { section: 'Commerces', titre: 'À la librairie',
      texte: `${p} achète un livre à ${prix} € et paie avec un billet de 20 €. La libraire lui rend ${nombre(r, rendu, { detail: `20 − ${prix} = ${rendu}`, voisins: [rendu + 1, rendu - 1, rendu + 2] })} €.` };
  } });

  gen({ pub: ['enfant'], niv: 3, fn(r) {
    const debut = 10 * 60 + r.choix([0, 5, 10, 15, 20, 25, 30]), d = r.choix([15, 20, 25, 30]), fin = debut + d;
    return { section: 'École', titre: 'La récréation',
      texte: `La récréation commence à ${heureMin(debut)} et dure ${d} minutes. Elle se termine à ${nombre(r, fin, { detail: `${heureMin(debut)} + ${d} minutes = ${heureMin(fin)}`, fmt: heureMin, voisins: [fin + 5, fin - 5, fin + 10] })}.` };
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
    const prix = r.entier(40, 389) * 10, billet = prix < 2000 ? r.choix([2000, 5000]) : 5000, rendu = billet - prix;
    return { section: 'Consommation', titre: 'Rendre la monnaie',
      texte: `Au marché, une cliente paie ${eurosCts(prix)} € avec un billet de ${billet / 100} €. Le marchand lui rend ${nombre(r, rendu, { detail: `${billet / 100} − ${eurosCts(prix)} = ${eurosCts(rendu)} €`, fmt: eurosCts, voisins: [rendu + 100, rendu - 100, rendu + 50, rendu - 50, rendu + 1000] })} €.` };
  } });

  gen({ pub: ['adulte'], niv: 1, fn(r) {
    const depart = 6 * 60 + r.entier(0, 156) * 5, d = r.entier(10, 34) * 5, arrivee = depart + d;
    return { section: 'Transports', titre: 'Horaires du TER',
      texte: `Parti à ${heureMin(depart)}, le TER est arrivé à ${heureMin(arrivee)}, après ${nombre(r, d, { detail: `De ${heureMin(depart)} à ${heureMin(arrivee)}, il s'écoule ${CQ.duree(d)}.`, fmt: CQ.duree, voisins: [d + 10, d - 10, d + 20, d - 20] })} de trajet.` };
  } });

  gen({ pub: ['adulte'], niv: 1, fn(r) {
    const total = r.entier(80, 240), f = r.entier(Math.round(total * 0.3), Math.round(total * 0.7)), h = total - f;
    return { section: 'Associations', titre: 'Le club de randonnée',
      texte: `Le club de randonnée compte ${total} adhérents : ${f} femmes et ${nombre(r, h, { detail: `${total} − ${f} = ${h}`, voisins: [h + 10, h - 10, h + 1, h - 1] })} hommes.` };
  } });

  const ARTICLES_SOLDES = ['Une veste', 'Une lampe', 'Une valise', 'Une montre', 'Une cafetière'];
  gen({ pub: ['adulte'], niv: 2, fn(r) {
    const prix = r.choix([40, 60, 80, 100, 120, 150, 200]), pct = r.choix([10, 20, 25, 30, 40, 50]);
    const remise = prix * pct, solde = prix * 100 - remise; // en centimes
    return { section: 'Consommation', titre: 'Soldes : faites le calcul',
      texte: `${r.choix(ARTICLES_SOLDES)} à ${prix} € est soldée à −${pct} %. Elle ne coûte plus que ${nombre(r, solde, { detail: `${pct} % de ${prix} € = ${eurosCts(remise)} € ; ${prix} − ${eurosCts(remise)} = ${eurosCts(solde)} €.`, fmt: eurosCts, classiques: [prix * 100 - pct * 100], voisins: [solde + 500, solde - 500, remise] })} €.` };
  } });

  gen({ pub: ['adulte'], niv: 2, fn(r) {
    const k = r.choix([4, 6, 8, 12]), u = r.entier(5, 18) * 5, lot = u * k; // centimes
    return { section: 'Consommation', titre: 'Le vrai prix des yaourts',
      texte: `Le lot de ${k} yaourts est vendu ${eurosCts(lot)} €, soit ${nombre(r, u, { detail: `${eurosCts(lot)} € ÷ ${k} = ${eurosCts(u)} €`, fmt: eurosCts, voisins: [u + 10, u - 10, u + 5, u - 5] })} € le yaourt.` };
  } });

  const PRODUITS_KILO = [
    { nom: 'Le paquet de @ g de café', kilos: [12, 14, 16, 20] },
    { nom: 'La barquette de @ g de fraises', kilos: [6, 8, 10, 12] },
    { nom: 'Le sachet de @ g de pâtes', kilos: [2, 4] },
    { nom: 'Le morceau de @ g de comté', kilos: [16, 20, 24] },
  ];
  gen({ pub: ['adulte'], niv: 2, fn(r) {
    const produit = r.choix(PRODUITS_KILO), kilo = r.choix(produit.kilos), g = r.choix([250, 500, 750]);
    const prix = (kilo * g) / 10; // centimes
    const calcul = g === 750 ? `${eurosCts(prix)} € ÷ 3 × 4 = ${kilo} €` : `${eurosCts(prix)} € × ${1000 / g} = ${kilo} €`;
    const classiques = g === 250 ? [kilo / 2] : g === 500 ? [kilo * 2] : [];
    return { section: 'Consommation', titre: 'Le prix au kilo',
      texte: `${produit.nom.replace('@', g)} coûte ${eurosCts(prix)} €, soit ${nombre(r, kilo, { detail: calcul, fmt: CQ.euros, classiques, voisins: [kilo + 2, kilo - 2, kilo + 1] })} € le kilo.` };
  } });

  gen({ pub: ['adulte'], niv: 2, fn(r) {
    const n = r.choix([200, 300, 400, 500, 800, 1200]), pct = r.choix([10, 15, 20, 25, 30, 40, 60, 75]), res = (n * pct) / 100;
    return { section: 'Vie locale', titre: 'Le référendum local',
      texte: `Sur ${CQ.milliers(n)} votants, ${pct} % ont voté pour le projet, soit ${nombre(r, res, { detail: `${pct} % de ${CQ.milliers(n)} = ${CQ.milliers(n)} × ${pct} ÷ 100 = ${CQ.milliers(res)}`, fmt: CQ.milliers, voisins: [res + n / 20, res - n / 20, res + 10] })} personnes.` };
  } });

  gen({ pub: ['adulte'], niv: 2, fn(r) {
    const parPers = r.choix([50, 60, 75, 100, 125]), a = r.choix([2, 4]), b = r.choix([3, 5, 6, 8].filter((x) => x !== a));
    const q = parPers * a, res = parPers * b;
    return { section: 'Cuisine', titre: 'Règle de trois en cuisine',
      texte: `Pour ${a} personnes, il faut ${q} g de farine. Pour ${b} personnes, il en faut donc ${nombre(r, res, { detail: `${q} g ÷ ${a} × ${b} = ${res} g`, classiques: [q + (b - a) * 10], voisins: [res + parPers, res - parPers] })} g.` };
  } });

  gen({ pub: ['adulte'], niv: 3, fn(r) {
    const v = r.choix([16, 18, 20, 22, 24, 26, 28, 30]), t = r.choix([90, 120, 150, 180]), dist = (v * t) / 60;
    const h = t / 60;
    const fauxDecimal = t % 60 ? Math.round(dist / (Math.floor(h) + (t % 60) / 100)) : 0;
    return { section: 'Sports', titre: 'Sortie vélo du dimanche',
      texte: `Le cycliste a parcouru ${dist} km en ${CQ.duree(t)}, soit une moyenne de ${nombre(r, v, { detail: `${CQ.duree(t)} = ${decimal(h)} h ; ${dist} ÷ ${decimal(h)} = ${v} km/h.`, classiques: [fauxDecimal], voisins: [v + 2, v - 2] })} km/h.` };
  } });

  gen({ pub: ['adulte'], niv: 3, fn(r) {
    const ht = r.entier(3, 24) * 50, ttc = (ht * 12) / 10;
    return { section: 'Pratique', titre: 'Le devis du plombier',
      texte: `Un artisan facture ${CQ.milliers(ht)} € HT. Avec une TVA de 20 %, le client paiera ${nombre(r, ttc, { detail: `${CQ.milliers(ht)} × 1,2 = ${CQ.milliers(ttc)} €`, fmt: CQ.milliers, classiques: [ht + 20], voisins: [ttc + ht / 10, ttc - ht / 10] })} € TTC.` };
  } });

  gen({ pub: ['adulte'], niv: 3, fn(r) {
    const loyer = r.choix([500, 600, 700, 800, 900, 1000, 1200]), res = Math.round(loyer * 1.21);
    return { section: 'Logement', titre: 'Deux hausses de loyer',
      texte: `Un loyer de ${CQ.milliers(loyer)} € augmente de 10 % en janvier, puis encore de 10 % en juillet. Il passe donc à ${nombre(r, res, { detail: `${CQ.milliers(loyer)} × 1,1 × 1,1 = ${CQ.milliers(res)} € : deux hausses de 10 % font +21 %, pas +20 %.`, fmt: CQ.milliers, classiques: [(loyer * 12) / 10], voisins: [res + 10] })} €.` };
  } });

  gen({ pub: ['adulte'], niv: 3, fn(r) {
    const cours = r.choix([40, 60, 80, 100, 120, 200]), res = cours * 0.75;
    return { section: 'Bourse', titre: 'Les montagnes russes',
      texte: `Une action cotée ${cours} € perd 50 % lundi, puis regagne 50 % mardi. Elle vaut désormais ${nombre(r, res, { detail: `${cours} × 0,5 = ${cours / 2} € ; ${cours / 2} × 1,5 = ${res} €. Une hausse de 50 % ne rattrape pas une baisse de 50 %.`, classiques: [cours], voisins: [res + 10] })} €.` };
  } });

  // ---------- Apprenants : nombres en lettres ----------
  const enLettres = { fmt: L };
  gen({ pub: ['apprenant'], niv: 1, fn(r) {
    const a = r.entier(3, 6), b = r.entier(2, 4), s = a + b;
    return { section: 'Restaurant', titre: 'Un déjeuner rapide',
      texte: `Un sandwich coûte ${L(a)} euros et une boisson ${L(b)} euros. Je paie ${nombre(r, s, Object.assign({ detail: `${a} + ${b} = ${s} (${L(s)})`, voisins: [s + 1, s - 1, s + 2] }, enLettres))} euros en tout.` };
  } });

  gen({ pub: ['apprenant'], niv: 1, fn(r) {
    const a = r.entier(6, 12), b = r.entier(2, 6), s = a + b;
    return { section: 'Famille', titre: 'Ma grande sœur',
      texte: `J'ai ${L(a)} ans. Ma sœur a ${L(b)} ans de plus que moi : elle a ${nombre(r, s, Object.assign({ detail: `${a} + ${b} = ${s} (${L(s)})`, voisins: [s + 1, s - 1, s + 2] }, enLettres))} ans.` };
  } });

  gen({ pub: ['apprenant'], niv: 2, fn(r) {
    const a = r.entier(18, 40), b = r.entier(5, 19), s = a + b;
    return { section: 'Famille', titre: 'Mon grand frère',
      texte: `J'ai ${L(a)} ans. Mon frère a ${L(b)} ans de plus que moi : il a ${nombre(r, s, Object.assign({ detail: `${a} + ${b} = ${s} (${L(s)})`, voisins: [s + 1, s - 1, s + 10, s - 10] }, enLettres))} ans.` };
  } });

  gen({ pub: ['apprenant'], niv: 2, fn(r) {
    const a = r.entier(12, 35), b = r.entier(10, 34), s = a + b;
    return { section: 'Commerces', titre: 'La boulangerie du quartier',
      texte: `La boulangerie a vendu ${LF(a)} baguettes le matin et ${LF(b)} l'après-midi : ${nombre(r, s, { fmt: LF, detail: `${a} + ${b} = ${s} (${LF(s)})`, voisins: [s + 1, s - 1, s + 10, s - 10] })} baguettes au total.` };
  } });

  gen({ pub: ['apprenant'], niv: 2, fn(r) {
    const depart = r.entier(6, 12), d = r.entier(2, 5), arrivee = depart + d;
    return { section: 'Transports', titre: 'Le voyage en train',
      texte: `Le train part à ${L(depart)} heures et arrive à ${L(arrivee)} heures : le voyage dure ${nombre(r, d, Object.assign({ detail: `${arrivee} − ${depart} = ${d} (${L(d)})`, voisins: [d + 1, d - 1] }, enLettres))} heures.` };
  } });

  gen({ pub: ['apprenant'], niv: 3, fn(r) {
    const nuit = r.entier(35, 49), s = nuit * 2;
    return { section: 'Voyages', titre: "Une chambre d'hôtel",
      texte: `Une nuit à l'hôtel coûte ${L(nuit)} euros. Pour deux nuits, je paie ${nombre(r, s, Object.assign({ detail: `2 × ${nuit} = ${s} (${L(s)})`, classiques: [s + 20, s - 20], voisins: [s + 1, s - 1, s + 10] }, enLettres))} euros.` };
  } });

  gen({ pub: ['apprenant'], niv: 3, fn(r) {
    let a, b;
    do { a = r.entier(35, 50); b = r.entier(30, 49); } while (a + b < 70 || a + b > 99);
    const s = a + b;
    return { section: 'Commerces', titre: 'Un samedi à la boulangerie',
      texte: `Samedi, la boulangerie a vendu ${LF(a)} baguettes le matin et ${LF(b)} l'après-midi : ${nombre(r, s, { fmt: LF, detail: `${a} + ${b} = ${s} (${LF(s)})`, classiques: [s + 20, s - 20], voisins: [s + 1, s - 1, s + 10] })} baguettes au total.` };
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
