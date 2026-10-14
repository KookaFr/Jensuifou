/* Coquilles — brèves pour les adultes francophones.
   Syntaxe : {forme correcte|faute 1|faute 2#règle:explication propre à ce mot}. */
(function () {
  'use strict';
  const CQ = window.CQ;
  const B = (CQ.BREVES = CQ.BREVES || []);
  const ajouter = (pub, liste) => liste.forEach((b) => B.push(Object.assign({ pub }, b)));

  ajouter('adulte', [
    // Niveau 1 : homophones courants, infinitif, -ez
    { niv: 1, section: 'Économie', titre: 'Le prix du café grimpe',
      texte: "Le prix du café {a|à} augmenté de 12 % en un an. Les torréfacteurs {sont|son} inquiets {et|est} certains envisagent de {changer|changé#inf} de fournisseurs." },
    { niv: 1, section: 'Vie locale', titre: 'Travaux rue Pasteur',
      texte: "Les travaux de la rue Pasteur {ont|on} pris du retard. La circulation sera {coupée|coupé|couper#ppe:La circulation sera coupée : le participe s'accorde avec « la circulation ».} jusqu'à vendredi. Les riverains {peuvent|peut#verbe} se garer place du Marché." },
    { niv: 1, section: 'Santé', titre: 'Grippe : pensez au vaccin',
      texte: "La campagne de vaccination contre la grippe {a|à} commencé. Les pharmaciens {sont|son} prêts {à|a} vacciner sans rendez-vous." },
    { niv: 1, section: 'Culture', titre: 'Le jazz fait le plein',
      texte: "Le festival {a|à} attiré plus de 10 000 spectateurs. Les concerts {se|ce} sont {déroulés|déroulé#ppe:« Se dérouler » se conjugue avec être : accord avec « les concerts ».} sous un soleil radieux {et|est} l'ambiance était excellente." },
    { niv: 1, section: 'Numérique', titre: 'La fibre arrive aux Lilas',
      texte: "Le quartier des Lilas {est|et} enfin raccordé à la fibre. La {connexion|connection#usage:« connection » est anglais ; en français, on écrit « connexion ».} sera dix fois plus rapide. Les habitants {peuvent|peut#verbe} dès maintenant {souscrire|souscrit#inf} un abonnement." },
    { niv: 1, section: 'Société', titre: 'Le covoiturage progresse',
      texte: "De plus en plus de salariés {ont|on} choisi le covoiturage pour {aller|allé#inf} au travail. {On|Ont} estime que cela divise par deux le coût des trajets." },
    { niv: 1, section: 'Sports', titre: 'Marathon : record battu',
      texte: "Le marathon de la ville {s'est|c'est} couru dimanche. Le vainqueur {a|à} battu le record de l'épreuve de deux minutes. Les {coureurs|coureur#pluriel} ont été {encouragés|encouragé|encourager#ppe:Avec être, accord avec le sujet : les coureurs ont été encouragés.} tout au long du parcours." },
    { niv: 1, section: 'Pratique', titre: 'Arnaques par SMS : prudence',
      texte: "Des SMS frauduleux circulent en ce moment. Ils invitent {à|a} régler une amende {ou|où} des frais de livraison. Ne cliquez jamais sur le lien {et|est} ne {communiquez|communiquer#ez} pas vos coordonnées bancaires." },
    { niv: 1, section: 'Vie locale', titre: 'Le marché de Noël',
      texte: "Les chalets {sont|son} {installés|installé#ppe} sur la place depuis lundi. Les visiteurs pourront y {acheter|acheté#inf} des cadeaux {et|est} déguster du vin chaud." },
    { niv: 1, section: 'Santé', titre: 'Canicule : les bons réflexes',
      texte: "Avec la vague de chaleur, il faut {boire|boit#inf} régulièrement, même sans soif. Évitez de {sortir|sorti#inf} aux heures les plus chaudes {et|est} fermez les volets dans la journée." },
    { niv: 1, section: 'Vie locale', titre: 'Le vide-grenier du quartier',
      texte: "Le vide-grenier {a|à} lieu dimanche de 8 h à 18 h. Les exposants {doivent|doit#verbe} s'inscrire {à|a} la mairie. {On|Ont} attend plus de cent stands." },

    // Niveau 2 : leur, quel/qu'elle, quant, futur/conditionnel, participe avec avoir, vingt/cent
    { niv: 2, section: 'Vie locale', titre: 'Le budget voté',
      texte: "Le budget {a|à} été adopté hier soir. {Apparemment|Apparament#usage:apparemment : deux p, deux m.}, l'opposition n'était pas au complet. Le maire {leur|leurs} a promis un nouveau débat en janvier." },
    { niv: 2, section: 'Entreprise', titre: 'Une réunion interminable',
      texte: "{Quelle|Qu'elle} réunion ! Les participants pensaient {qu'elle|quelle} durerait une heure ; elle {s'est|c'est} achevée à 22 heures." },
    { niv: 2, section: 'Économie', titre: 'Le chômage recule',
      texte: "Selon les derniers chiffres, le chômage {a|à} reculé de 0,3 point. {Quant|Quand} aux embauches, elles {ont|on} progressé dans le bâtiment." },
    { niv: 2, section: 'Pratique', titre: 'Déménager sans stress',
      texte: "Avant de déménager, pensez à {prévenir|prévenu#inf} votre assurance et votre banque de votre nouvelle {adresse|addresse#usage:Un seul d en français : adresse (deux en anglais : address).}. Un conseil : si j'étais vous, je {ferais|ferai#futcond:Avec « si j'étais vous », on emploie le conditionnel : je ferais.} suivre mon courrier." },
    { niv: 2, section: 'Sports', titre: 'Le nouveau gymnase',
      texte: "Le gymnase, dont les travaux {ont|on} duré deux ans, sera inauguré lundi. Les associations sportives {l'attendaient|l'attendait#verbe} avec impatience. Les clubs {devront|devrons#verbe} réserver leurs créneaux en ligne." },
    { niv: 2, section: 'Cuisine', titre: 'Recette : courgettes farcies',
      texte: "Les courgettes que j'ai {achetées|acheté|achetés#ppa:Le COD « que » (les courgettes) est placé avant : achetées.} au marché étaient superbes. Je les ai {farcies|farci#ppa:Le COD « les » (les courgettes) est placé avant : farcies.} avec de la viande {et|est} du riz." },
    { niv: 2, section: 'Transports', titre: 'Grève jeudi dans les transports',
      texte: "Une grève est prévue jeudi. La direction {prévoit|prévois#verbe} un bus sur deux et les usagers {seront|serons#verbe} informés en temps réel. « Je {prendrai|prendrais#futcond:Une décision certaine (« c'est décidé ») s'écrit au futur : je prendrai.} mon vélo, c'est décidé », confie une habitante." },
    { niv: 2, section: 'Culture', titre: 'Le Rex fête ses {quatre-vingts|quatre-vingt#vingt} ans',
      texte: "Le cinéma Le Rex fête ses {quatre-vingts|quatre-vingt#vingt} ans. Pour l'occasion, {deux cents|deux cent#vingt} places seront offertes. La salle a été {rénovée|rénové#ppe} l'an dernier." },
    { niv: 2, section: 'Environnement', titre: 'Les retraités nettoient les berges',
      texte: "Une vingtaine de retraités {se|ce} sont réunis pour nettoyer les berges du fleuve. Ils {comptent|compte#verbe} renouveler l'opération chaque mois. Les déchets {ramassés|ramassé#accord} rempliraient un camion." },
    { niv: 2, section: 'Mobilité', titre: 'Des pistes cyclables plus {confortables|comfortables#usage:« comfortable » est anglais ; en français : confortable.}',
      texte: "La métropole poursuit le {développement|dévelopement|dévellopement#usage:développement : deux p, un seul l.} de son réseau cyclable. Selon une enquête, les cyclistes {trouvent|trouve#verbe} les nouvelles pistes plus {confortables|comfortables#usage:« comfortable » est anglais ; en français : confortable.}." },
    { niv: 2, section: 'Numérique', titre: 'Mots de passe : les erreurs à éviter',
      texte: "Un bon mot de passe {doit|doivent#verbe} compter au moins douze caractères. Évitez votre date de naissance {ou|où} le nom de votre chat, et ne {réutilisez|réutiliser#ez} jamais le même partout." },

    // Niveau 3 : participes difficiles, quoique, quelque, si + conditionnel, faux amis
    { niv: 3, section: 'Social', titre: 'Réforme : les syndicats mobilisés',
      texte: "Les mesures que le gouvernement a {prises|pris#ppa:Le COD « que » (les mesures, féminin pluriel) est placé avant : prises.} n'ont pas convaincu. Les syndicats, {quoiqu'ils|quoi qu'ils#quoique} soient divisés, appellent à manifester." },
    { niv: 3, section: 'Économie', titre: 'Un écart dans les comptes',
      texte: "La comptable s'est {rendu|rendue#ppr:« Se rendre compte » : le participe reste invariable.} compte d'une erreur dans le bilan. Les sommes qu'elle a {vérifiées|vérifié#ppa:Le COD « qu' » (les sommes) est placé avant : vérifiées.} montrent un écart de 3 000 €. {Quelles|Quels|Qu'elles} que soient les causes, un audit aura lieu." },
    { niv: 3, section: 'Sports', titre: 'Une saison {exceptionnelle|exceptionelle#usage:exceptionnelle : deux n.}',
      texte: "Le club féminin a vécu une saison {exceptionnelle|exceptionelle#usage:exceptionnelle : deux n.}. Les joueuses se sont {succédé|succédées#ppr:« Se succéder » : on succède à quelqu'un, « se » n'est pas COD, le participe reste invariable.} au poste de capitaine, et toutes se sont {imposées|imposé#ppr:« S'imposer » : « se » est COD et placé avant, accord au féminin pluriel.} comme des leaders." },
    { niv: 3, section: 'Patrimoine', titre: 'Le {dilemme|dilemne#usage:dilemme : deux m, pas de n.} de la mairie',
      texte: "La rénovation de l'église pose un {dilemme|dilemne#usage:dilemme : deux m, pas de n.} à la municipalité : les travaux coûteraient {davantage|d'avantage#usage:« davantage » (= plus) s'écrit en un seul mot.} que prévu. Les élus sont {censés|sensés#usage:« censé » = supposé ; « sensé » = raisonnable.} trancher avant l'été." },
    { niv: 3, section: 'Logement', titre: "Les loyers s'envolent",
      texte: "Les loyers ont grimpé de 8 % en deux ans. Beaucoup de familles sont {prêtes|près|prête#pres:« prêtes à » = disposées à, accordé avec « familles ».} à quitter le centre-ville, alors que {quelque|quelques#quelque} 2 000 logements restent vacants." },
    { niv: 3, section: 'Vie locale', titre: 'Fusion des communes',
      texte: "Les deux communes ont {fusionné|fusionnées#ppa:Avec avoir et sans COD, le participe reste invariable : elles ont fusionné.} le 1er janvier. Si le projet {avait|aurait#si} échoué, la dette serait devenue trop lourde. Les habitants, {quel|quels|qu'elle} que soit leur avis, gardent leur code postal." },
    { niv: 3, section: 'Travail', titre: 'Télétravail : bilan mitigé',
      texte: "Les salariés que nous avons {interrogés|interrogé#ppa:Le COD « que » (les salariés) est placé avant : interrogés.} apprécient le télétravail. Mais beaucoup se sont {plaints|plaint#ppr:« Se plaindre » : accord avec le sujet.} de l'isolement. « {On n'a|On a#neg} pas vu nos collègues depuis des mois », confie l'un d'eux." },
    { niv: 3, section: 'Culture', titre: 'Le {langage|language#usage:« language » est anglais ; en français : langage.} des ados',
      texte: "Une linguiste publie un livre sur le {langage|language#usage:« language » est anglais ; en français : langage.} des adolescents. Les expressions qu'elle a {recueillies|recueilli#ppa:Le COD « qu' » (les expressions) est placé avant : recueillies.} viennent souvent de l'anglais." },
    { niv: 3, section: 'Santé', titre: 'Déserts médicaux : la commune agit',
      texte: "Pour {pallier la|pallier à la#usage:On dit « pallier quelque chose », sans « à ».} pénurie de médecins, la commune finance un cabinet. Deux généralistes s'y sont {installés|installé#ppe} en septembre ; une troisième les rejoindra au printemps." },
    { niv: 3, section: 'Transports', titre: 'Le périphérique, un {cauchemar|cauchemard#usage:cauchemar : pas de d à la fin, malgré « cauchemarder ».}',
      texte: "Le chantier du périphérique tourne au {cauchemar|cauchemard#usage:cauchemar : pas de d à la fin, malgré « cauchemarder ».}. Les embouteillages se sont {multipliés|multiplié#ppr:« Se multiplier » : accord avec le sujet, les embouteillages.} et les commerçants {craignent|craigne#verbe} une baisse de fréquentation." },
  ]);
})();
