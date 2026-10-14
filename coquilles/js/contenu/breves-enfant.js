/* Coquilles — brèves pour les enfants (8-11 ans).
   Syntaxe : {forme correcte|faute 1|faute 2#règle:explication propre à ce mot}.
   La règle se devine seule pour les homophones courants (a/à, et/est, son/sont…). */
(function () {
  'use strict';
  const CQ = window.CQ;
  const B = (CQ.BREVES = CQ.BREVES || []);
  const ajouter = (pub, liste) => liste.forEach((b) => B.push(Object.assign({ pub }, b)));

  ajouter('enfant', [
    // Niveau 1 : a/à, et/est, pluriel, m devant m-b-p
    { niv: 1, section: 'École', titre: 'La kermesse',
      texte: "Samedi, la kermesse {a|à} lieu dans la cour de l'école. Les parents {et|est} les enfants tiendront les stands {à|a} partir de dix heures." },
    { niv: 1, section: 'Nature', titre: 'Un hérisson au jardin',
      texte: "Tom {a|à} trouvé un hérisson sous un tas de feuilles. Il {est|et} tout petit {et|est} il dort beaucoup. Tom lui donne {à|a} boire." },
    { niv: 1, section: 'Sports', titre: 'Victoire au football',
      texte: "Les {joueurs|joueur#pluriel} de Saint-Malo ont gagné leur match trois {buts|but#pluriel} à zéro. Le gardien {a|à} arrêté un penalty {à|a} la dernière minute." },
    { niv: 1, section: 'Météo', titre: 'Grand soleil demain',
      texte: "Demain, il fera beau {et|est} chaud sur toute la région. Pensez {à|a} boire de l'eau {et|est} {à|a} porter un chapeau." },
    { niv: 1, section: 'Ville', titre: 'La boulangerie de la place',
      texte: "La boulangerie {a|à} ouvert {à|a} six heures. Les {croissants|croissant#pluriel} sont encore chauds {et|est} bien dorés." },
    { niv: 1, section: 'Nature', titre: 'Les {oiseaux|oiseaus#pluriel:Les mots en -eau prennent un x au pluriel : des oiseaux, des bateaux.} du parc',
      texte: "Au printemps, les {oiseaux|oiseaus#pluriel:Les mots en -eau prennent un x au pluriel : des oiseaux, des bateaux.} construisent leur nid dans les {arbres|arbre#pluriel}. La mésange {a|à} déjà pondu six œufs." },
    { niv: 1, section: 'Culture', titre: 'Une nouvelle bibliothèque',
      texte: "La ville {a|à} ouvert une bibliothèque {à|a} côté de la mairie. On peut y emprunter des {livres|livre#pluriel} {et|est} des bandes dessinées." },
    { niv: 1, section: 'Sports', titre: 'Le {champion|chanpion#mbp} de saut',
      texte: "Léo {a|à} sauté un mètre vingt ! Le jeune {champion|chanpion#mbp} {emporte|enporte#mbp} la médaille d'or {et|est} un {bonbon|bombon#mbp:« bonbon » est une exception : il garde son n devant le b.} géant." },
    { niv: 1, section: 'Faits divers', titre: 'Le chat et les pompiers',
      texte: "Un chat était coincé en haut d'un {arbre|arbres#pluriel:Un seul arbre : pas de s.}. Les {pompiers|ponpiers#mbp} sont arrivés avec une grande {échelle|échèle#usage:échelle : é, puis deux l.} {et|est} ils ont sauvé le chat." },
    { niv: 1, section: 'École', titre: "C'est la rentrée !",
      texte: "Lundi, les {élèves|élève#pluriel} retrouvent leur classe {et|est} leur maîtresse. Chacun {a|à} un cartable tout neuf {et|est} des crayons bien taillés." },
    { niv: 1, section: 'Fêtes', titre: "Le carnaval de l'école",
      texte: "Mardi, l'école fête le carnaval. Lucas {a|à} un costume de pirate {et|est} Jade {est|et} déguisée en princesse. Le défilé part {à|a} quatorze heures." },
    { niv: 1, section: 'Météo', titre: 'La neige est tombée',
      texte: "Cette nuit, la neige {est|et} tombée sur la ville. Les {enfants|enfant#pluriel} lancent des boules de neige {et|est} font des glissades. Attention {à|a} ne pas tomber !" },
    { niv: 1, section: 'Nature', titre: 'Une {ombre|onbre#mbp} dans la forêt',
      texte: "Zoé {a|à} vu une {ombre|onbre#mbp} passer entre les arbres. C'était un cerf ! Il {a|à} de grands bois {et|est} il court très vite." },

    // Niveau 2 : son/sont, on/ont, ou/où, infinitif, ge/ç, accord du verbe
    { niv: 2, section: 'Ville', titre: 'Le marché du dimanche',
      texte: "Les marchands {sont|son} installés depuis l'aube. {On|Ont} y trouve des fruits, des légumes {ou|où} du fromage. Paul vend {son|sont} miel près de la fontaine." },
    { niv: 2, section: 'École', titre: 'La classe verte',
      texte: "Les élèves de CM1 {sont|son} partis en classe verte. Ils {ont|on} dormi dans un chalet {où|ou} il n'y avait pas de télé. Ils vont {rentrer|rentré#inf} vendredi." },
    { niv: 2, section: 'Sciences', titre: 'Une éclipse de Soleil',
      texte: "Mardi, la Lune va {passer|passé#inf} devant le Soleil. Pour {regarder|regardé#inf} l'éclipse, il faut des lunettes spéciales. Sans elles, {on|ont} risque de s'abîmer les yeux." },
    { niv: 2, section: 'Sports', titre: 'Le tournoi de judo',
      texte: "Samedi, nous {commençons|commencons#ge} le tournoi à neuf heures. Les judokas ont {mangé|manger#inf} des pâtes la veille pour avoir de l'énergie. Qui va {gagner|gagné#inf} ?" },
    { niv: 2, section: 'Ville', titre: 'La piscine rouvre',
      texte: "Après des travaux, la piscine {a|à} enfin rouvert. Les {enfants|enfant#pluriel} {peuvent|peut#verbe} de nouveau nager le mercredi. Le grand bassin {est|et} chauffé." },
    { niv: 2, section: 'École', titre: "Le potager de l'école",
      texte: "Les élèves {ont|on} planté des tomates {et|est} des radis. Chaque matin, ils {arrosent|arrose#verbe} le potager. {Où|Ou} mettre les citrouilles ? Au fond du jardin !" },
    { niv: 2, section: 'Vacances', titre: 'Nous {voyageons|voyagons#ge} en train',
      texte: "Nous {voyageons|voyagons#ge} jusqu'à la mer. Le train va {partir|parti#inf} {à|a} midi. Mes cousins {sont|son} déjà sur le quai." },
    { niv: 2, section: 'Faits divers', titre: 'Le perroquet bavard',
      texte: "Un perroquet s'est échappé de sa cage. Les voisins {ont|on} entendu un oiseau {crier|crié#inf} « Bonjour ! » dans le parc. Ses propriétaires {sont|son} venus le chercher." },
    { niv: 2, section: 'Ville', titre: 'La fête des voisins',
      texte: "Vendredi soir, {on|ont} organise un repas dans la rue. Chacun apporte un plat {ou|où} un dessert. Les enfants {jouent|joue#verbe} au ballon jusqu'à la nuit." },
    { niv: 2, section: 'Nature', titre: "Les grenouilles de l'étang",
      texte: "Au bord de l'étang, les grenouilles {chantent|chante#verbe} tous les soirs. Elles {sont|son} vertes {et|est} elles {sautent|saute#verbe} très loin." },
    { niv: 2, section: 'Santé', titre: 'Nous {mangeons|mangons#ge} trop de sucre',
      texte: "Selon une étude, les enfants {mangent|mange#verbe} trop de bonbons. Le docteur conseille de {boire|boit#inf} de l'eau {et|est} de {croquer|croqué#inf} des fruits." },

    // Niveau 3 : ce/se, c'est/s'est, ces/ses, leur, accords
    { niv: 3, section: 'Fêtes', titre: 'Le cirque arrive en ville',
      texte: "Le cirque {s'est|c'est} installé sur la place. {C'est|S'est} le plus grand chapiteau de la région ! Les clowns {se|ce} maquillent avant le spectacle." },
    { niv: 3, section: 'École', titre: 'Deux nouvelles élèves',
      texte: "Inès et sa sœur sont {arrivées|arrivés|arrivé#ppe:Inès et sa sœur : deux filles, donc « arrivées ».} du Portugal en septembre. Elles {se|ce} sont vite fait des amies. {Ces|Ses} jours-ci, elles apprennent le français à toute vitesse." },
    { niv: 3, section: 'Nature', titre: 'Le jardin en fleurs',
      texte: "Le jardin public est plein de tulipes {blanches|blanche|blancs#accord} et de rosiers {fleuris|fleuri#accord}. {Ce|Se} printemps est très doux." },
    { niv: 3, section: 'Culture', titre: 'Le concours de dessin',
      texte: "Les gagnants du concours de dessin {ont|on} été applaudis. La mairie {leur|leurs} a offert des livres. {Ces|Ses} jours-ci, leurs œuvres sont {exposées|exposés#ppe:Les œuvres (féminin pluriel) sont exposées.} à la médiathèque." },
    { niv: 3, section: 'Faits divers', titre: 'Le chien perdu',
      texte: "Hier, un chien {s'est|c'est} perdu dans le quartier. Ses maîtres l'ont cherché partout. Finalement, il était caché chez la voisine, {ce|se} petit coquin !" },
    { niv: 3, section: 'Sports', titre: 'Les basketteuses en finale',
      texte: "Les filles du club {sont|son} {qualifiées|qualifiés#ppe:Les filles : féminin pluriel, donc « qualifiées ».} pour la finale. Elles {se|ce} préparent depuis des mois. {C'est|S'est} leur première finale !" },
    { niv: 3, section: 'Sciences', titre: 'Les dinosaures au musée',
      texte: "Le musée présente des squelettes {géants|géant#accord} de dinosaures. Les plus {anciens|ancien#accord} ont 150 millions d'années. Les enfants {se|ce} prennent en photo devant le T-rex." },
    { niv: 3, section: 'Hiver', titre: 'Les {bonshommes|bonhommes#pluriel:Au pluriel, on écrit « des bonshommes » : les deux parties du mot prennent un s.} de neige',
      texte: "Les enfants ont fait trois {bonshommes|bonhommes#pluriel:Au pluriel, on écrit « des bonshommes » : les deux parties du mot prennent un s.} de neige. Ils {leur|leurs} ont mis des écharpes {et|est} des {chapeaux|chapeaus#pluriel:Les mots en -eau prennent un x au pluriel.}." },
    { niv: 3, section: 'Ville', titre: 'Le parc agrandi',
      texte: "Le parc {s'est|c'est} agrandi : {c'est|s'est} maintenant le plus grand de la ville. Les jeux {sont|son} {installés|installé#ppe} près du lac {où|ou} nagent les canards." },
  ]);
})();
