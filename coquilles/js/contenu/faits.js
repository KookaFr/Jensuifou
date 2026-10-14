/* Coquilles — brèves à vérifier : informations fausses glissées dans le texte.
   Les faits retenus sont stables et vérifiables ; le détail donne la bonne réponse. */
(function () {
  'use strict';
  const CQ = window.CQ;
  const B = (CQ.BREVES = CQ.BREVES || []);
  const ajouter = (pub, liste) => liste.forEach((b) => B.push(Object.assign({ pub }, b)));

  ajouter('enfant', [
    { niv: 1, section: 'Sciences', titre: 'Le tour du Soleil',
      texte: "La Terre fait le tour du Soleil en {un an|un jour|un mois#fait:La Terre tourne autour du Soleil en un an. En un jour, elle fait un tour sur elle-même.}." },
    { niv: 1, section: 'Nature', titre: 'Huit pattes',
      texte: "Contrairement aux insectes, qui ont six pattes, l'araignée en a {huit|six|dix#fait:L'araignée a huit pattes : ce n'est pas un insecte.}." },
    { niv: 1, section: 'Géographie', titre: 'La capitale',
      texte: "{Paris|Lyon|Marseille#fait:La capitale de la France est Paris.} est la capitale de la France. C'est aussi la plus grande ville du pays." },
    { niv: 1, section: 'Calendrier', titre: 'Une année bien remplie',
      texte: "Une semaine compte {sept|six|huit#fait:Une semaine compte sept jours.} jours et une année compte {douze|dix|onze#fait:Une année compte douze mois.} mois." },
    { niv: 1, section: 'Animaux', titre: 'À la ferme',
      texte: "Dans le pré, la vache {meugle|aboie|miaule#fait:La vache meugle, le chien aboie, le chat miaule.} pour appeler son veau." },
    { niv: 2, section: 'Sciences', titre: "Quand l'eau gèle",
      texte: "Quand il fait très froid, l'eau se transforme en glace. Elle gèle à {0|10|100#fait:L'eau gèle à 0 °C et bout à 100 °C.} °C." },
    { niv: 2, section: 'Nature', titre: 'La baleine',
      texte: "La baleine vit dans la mer, mais elle respire de l'air : c'est un {mammifère|poisson#fait:La baleine est un mammifère : elle respire de l'air et allaite ses petits.}." },
    { niv: 2, section: 'Géographie', titre: 'Le plus long fleuve',
      texte: "La {Loire|Seine#fait:La Loire, longue d'environ 1 000 km, est le plus long fleuve de France. La Seine mesure environ 780 km.} est le plus long fleuve de France. Elle se jette dans l'océan Atlantique." },
    { niv: 2, section: 'Nature', titre: 'Du cocon au papillon',
      texte: "Avant de devenir un papillon, l'insecte est une {chenille|grenouille|abeille#fait:Le papillon commence sa vie en chenille, puis se transforme dans une chrysalide.}." },
    { niv: 3, section: 'Histoire', titre: 'La fête du 14 juillet',
      texte: "Le 14 juillet, on fête la prise de la Bastille, qui a eu lieu en {1789|1689|1889#fait:La Bastille a été prise le 14 juillet 1789.}." },
    { niv: 3, section: 'Sciences', titre: 'Les planètes',
      texte: "Il y a {huit|neuf|sept#fait:Depuis 2006, on compte huit planètes dans le système solaire : Pluton est une planète naine.} planètes dans le système solaire." },
    { niv: 3, section: 'Géographie', titre: 'Le Mont-Blanc',
      texte: "Le Mont-Blanc est le plus haut sommet {des Alpes|des Pyrénées#fait:Le Mont-Blanc se trouve dans les Alpes. Le plus haut sommet des Pyrénées est l'Aneto, en Espagne.}." },
  ]);

  ajouter('adulte', [
    { niv: 1, section: 'Santé', titre: 'Urgences : les bons numéros',
      texte: "En cas d'urgence médicale, composez le {15|17|18#fait:15 : SAMU (urgence médicale). 17 : police. 18 : pompiers. Le 112 fonctionne partout en Europe.}, ou le 112 depuis n'importe quel pays d'Europe." },
    { niv: 1, section: 'Secours', titre: 'Un incendie ? Le 18',
      texte: "Pour signaler un incendie, composez le {18|15|17#fait:18 : pompiers. 15 : SAMU. 17 : police.} : les pompiers sont joignables jour et nuit." },
    { niv: 1, section: 'Pratique', titre: 'Achats en ligne : vos droits',
      texte: "Pour un achat sur internet, vous disposez de {14|7|30#fait:Le délai légal de rétractation pour un achat à distance est de 14 jours.} jours pour changer d'avis, sans avoir à vous justifier." },
    { niv: 1, section: 'Pratique', titre: "Passage à l'heure d'hiver",
      texte: "Dans la nuit de samedi à dimanche, nous passons à l'heure d'hiver : à 3 h du matin, il sera {2 h|4 h#fait:À l'heure d'hiver, on recule d'une heure : à 3 h, il est 2 h.}." },
    { niv: 2, section: 'Histoire', titre: 'La fin de la peine de mort',
      texte: "La peine de mort a été abolie en France en {1981|1971|1991#fait:La loi abolissant la peine de mort, portée par Robert Badinter, date de 1981.}." },
    { niv: 2, section: 'Histoire', titre: 'Le premier vote des femmes',
      texte: "Les Françaises ont voté pour la première fois en {1945|1925|1965#fait:Le droit de vote des femmes date de 1944 ; elles ont voté pour la première fois en 1945.}." },
    { niv: 2, section: 'Sciences', titre: 'La lumière du Soleil',
      texte: "La lumière du Soleil met environ {huit minutes|huit secondes|huit heures#fait:La lumière du Soleil met environ 8 minutes et 20 secondes pour atteindre la Terre.} pour nous parvenir." },
    { niv: 2, section: 'Institutions', titre: 'Le quinquennat',
      texte: "Depuis 2002, le président de la République est élu pour {cinq|sept|quatre#fait:Le mandat présidentiel dure cinq ans depuis la réforme de 2000, appliquée à partir de 2002.} ans." },
    { niv: 2, section: 'Économie', titre: "L'euro dans nos poches",
      texte: "Les pièces et les billets en euros circulent en France depuis le 1er janvier {2002|1999|2005#fait:L'euro existe depuis 1999 pour les banques ; les pièces et les billets sont arrivés le 1er janvier 2002.}." },
    { niv: 2, section: 'Langue', titre: 'Majuscule ou pas ?',
      texte: "Les {Belges|belges#majuscule:Les habitants d'un pays prennent une majuscule : les Belges.} parlent {français|Français#majuscule:Les langues ne prennent pas de majuscule : parler français.}, néerlandais ou allemand." },
    { niv: 3, section: 'Sciences', titre: 'Notre squelette',
      texte: "Le squelette d'un adulte compte {206|306|106#fait:Le squelette adulte compte 206 os ; celui d'un bébé en a davantage, qui se soudent en grandissant.} os." },
    { niv: 3, section: 'Géographie', titre: 'Le fleuve du Sud-Ouest',
      texte: "La {Garonne|Loire|Seine#fait:La Garonne traverse Toulouse et Bordeaux. La Loire passe par Orléans et Nantes, la Seine par Paris et Rouen.} traverse Toulouse et Bordeaux, puis forme l'estuaire de la Gironde avec la Dordogne." },
    { niv: 3, section: 'Patrimoine', titre: 'La tour Eiffel',
      texte: "La tour Eiffel a été inaugurée en {1889|1789|1937#fait:La tour Eiffel a été construite pour l'Exposition universelle de 1889.}, pour l'Exposition universelle." },
  ]);

  ajouter('apprenant', [
    { niv: 1, section: 'Culture', titre: 'La fête nationale',
      texte: "En France, la fête nationale a lieu le {14 juillet|1er mai|25 décembre#fait:La fête nationale est le 14 juillet. Le 1er mai est la fête du Travail, le 25 décembre est Noël.}." },
    { niv: 1, section: 'Culture', titre: 'Le drapeau français',
      texte: "Le drapeau français est bleu, blanc et {rouge|vert|jaune#fait:Le drapeau français est bleu, blanc, rouge.}." },
    { niv: 1, section: 'Calendrier', titre: 'Les jours de la semaine',
      texte: "Après lundi, il y a {mardi|jeudi|dimanche#fait:Lundi, mardi, mercredi, jeudi, vendredi, samedi, dimanche.}, puis mercredi." },
    { niv: 1, section: 'Calendrier', titre: 'Noël',
      texte: "Noël est le 25 {décembre|novembre|janvier#fait:Noël est le 25 décembre.}. En France, c'est l'hiver." },
    { niv: 1, section: 'Pratique', titre: 'Appeler les pompiers',
      texte: "Pour appeler les pompiers, on compose le {18|15|17#fait:18 : pompiers. 15 : SAMU (médecin). 17 : police. 112 : urgences dans toute l'Europe.}." },
    { niv: 2, section: 'Géographie', titre: 'Les voisins de la France',
      texte: "La France a une frontière avec l'Espagne, l'Italie et {l'Allemagne|le Portugal#fait:La France n'a pas de frontière avec le Portugal : l'Espagne est entre les deux.}." },
    { niv: 2, section: 'Géographie', titre: 'Une capitale',
      texte: "Bruxelles est la capitale de la {Belgique|Suisse#fait:Bruxelles est la capitale de la Belgique ; Berne est celle de la Suisse.}." },
    { niv: 2, section: "L'heure", titre: 'Midi et minuit',
      texte: "Midi, c'est {douze heures|zéro heure#fait:Midi = 12 h. Minuit = 0 h.}. Minuit, c'est zéro heure." },
    { niv: 2, section: 'Langue', titre: 'Majuscule ou pas ?',
      texte: "Les {Français|français#majuscule:Les habitants prennent une majuscule : les Français.} parlent {français|Français#majuscule:La langue ne prend pas de majuscule : parler français.} et mangent du fromage {français|Français#majuscule:L'adjectif ne prend pas de majuscule : un fromage français.}." },
    { niv: 3, section: 'Langue', titre: 'Le français dans le monde',
      texte: "Le français est la langue officielle de la France, mais aussi du {Québec|Mexique#fait:Au Canada, le français est la langue officielle du Québec. Au Mexique, on parle espagnol.}." },
    { niv: 3, section: 'Géographie', titre: 'Paris et son fleuve',
      texte: "Paris est traversée par la {Seine|Loire|Garonne#fait:La Seine traverse Paris. La Loire passe à Orléans et Nantes, la Garonne à Toulouse et Bordeaux.}." },
  ]);
})();
