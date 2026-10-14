/* Coquilles — brèves pour les personnes qui apprennent le français (A1 à B1).
   Les pièges visés : genre des noms, être/avoir, prépositions de lieu, contractions,
   conjugaisons irrégulières, partitifs, accords. */
(function () {
  'use strict';
  const CQ = window.CQ;
  const B = (CQ.BREVES = CQ.BREVES || []);
  const ajouter = (pub, liste) => liste.forEach((b) => B.push(Object.assign({ pub }, b)));

  ajouter('apprenant', [
    // Niveau 1 : genre, être/avoir, à/en/au, au/du, élision
    { niv: 1, section: 'Ville', titre: 'Bienvenue à Lyon',
      texte: "Marco habite {à|en|au#prep:Devant une ville, on dit « à » : à Lyon.} {Lyon|Lille#coherence:Le titre parle de Lyon.} depuis un an. Il travaille dans {un|une#genre:« restaurant » est masculin : un restaurant.} restaurant italien. Le soir, il prend {le|la#genre:« métro » est masculin : le métro.} métro pour rentrer." },
    { niv: 1, section: 'Vacances', titre: 'La famille Martin en vacances',
      texte: "La famille Martin part {en|au|à#prep:« Espagne » est un pays féminin : en Espagne.} Espagne cet été. Les enfants {sont|ont#etav:On dit « être content ».} très contents. Ils vont {au|à le#contr} bord de la mer tous les jours." },
    { niv: 1, section: 'Courses', titre: 'Au marché',
      texte: "Sofia achète {une|un#genre:« baguette » est féminin : une baguette.} baguette {et|est} {du|de le#contr} fromage. Elle {a|est#etav:On dit « avoir faim ».} faim !" },
    { niv: 1, section: 'Travail', titre: 'Le nouveau collègue',
      texte: "Kenji vient {du|de le#contr} Japon. Il {a|est#etav:On dit « avoir trente ans ».} trente ans et il parle trois langues. {L'équipe|La équipe#elision} est contente de travailler avec lui." },
    { niv: 1, section: 'Météo', titre: '{Beau temps|Pluie#titre:L\'article dit qu\'il fait beau.} sur Nice',
      texte: "Aujourd'hui, il {fait|est#faire} beau à Nice, mais le matin il {fait|est#faire} froid. Prenez {un|une#genre:« pull » est masculin : un pull.} pull !" },
    { niv: 1, section: 'Ville', titre: 'Une nouvelle boulangerie',
      texte: "{Une|Un#genre:« boulangerie » est féminin : une boulangerie.} nouvelle boulangerie ouvre rue Victor-Hugo. Le pain est très bon et {les|le#pluriel:Au pluriel, l'article est « les » : les croissants.} croissants aussi. Elle {est|et} ouverte tous les jours." },
    { niv: 1, section: 'Loisirs', titre: 'Le week-end de Paula',
      texte: "Le samedi, Paula {va|vais#conj:aller : je vais, tu vas, il/elle va.} à la piscine. Le dimanche, elle {fait|faire#conj:faire : je fais, tu fais, il/elle fait.} du vélo avec {ses|son#poss:« amis » est au pluriel : ses amis.} amis." },
    { niv: 1, section: 'Sorties', titre: 'Concert à la plage',
      texte: "Ce soir, il y a {un|une#genre:« concert » est masculin : un concert.} concert {à la|au#genre:« plage » est féminin : à la plage.} plage. C'est {gratuit|gratuite#accord:Après « c'est », l'adjectif reste au masculin : c'est gratuit.} ! Les musiciens viennent {des|de les#contr} États-Unis." },
    { niv: 1, section: 'Études', titre: 'La rentrée universitaire',
      texte: "Les étudiants {étrangers|étranger#accord} arrivent {en|au|à#prep:« France » est un pays féminin : en France.} France. Ils cherchent {un|une#genre:« logement » est masculin : un logement.} logement près de l'université." },
    { niv: 1, section: 'Ville', titre: 'Le café du coin',
      texte: "Le café du coin {est|et} ouvert tous les jours. On peut y boire {un|une#genre:« café » est masculin : un café.} café ou {une|un#genre:« limonade » est féminin : une limonade.} limonade. Le serveur {s'appelle|s'appele#usage:appeler → il s'appelle (deux l).} Ahmed." },

    // Niveau 2 : passé composé, partitif, quantités, verbes irréguliers
    { niv: 2, section: 'Voyages', titre: 'Un été à Rome',
      texte: "L'été dernier, nous {sommes|avons#aux:« aller » se conjugue avec être : nous sommes allés.} allés à Rome. Nous {avons|sommes#aux:« visiter » se conjugue avec avoir.} visité le Colisée et nous avons mangé des glaces {délicieuses|délicieux#accord:« glaces » est féminin pluriel : délicieuses.}." },
    { niv: 2, section: 'Voyages', titre: 'Le retour de Clara',
      texte: "{Clara|Carla#coherence:Le titre parle du retour de Clara.} {est|a#aux:« revenir » se conjugue avec être.} revenue du Canada hier soir. Elle est {arrivée|arrivé#ppe:Clara est une femme : elle est arrivée.} à l'aéroport à minuit. Ses parents l'attendaient." },
    { niv: 2, section: 'Restaurant', titre: 'Au restaurant',
      texte: "Je ne bois pas {de|du#partitif} vin, je préfère {l'eau|la eau#elision}. Mon ami prend {de la|du#genre:« soupe » est féminin : de la soupe.} soupe et une salade {verte|vert#accord}." },
    { niv: 2, section: 'Fêtes', titre: 'Le marché de Noël',
      texte: "Il y a beaucoup {de|du#qte} monde au marché de Noël. Les enfants {font|faisent#conj:faire : nous faisons, vous faites, ils font.} des photos avec le père Noël. Il {fait|est#faire} très froid, alors on boit du chocolat chaud." },
    { niv: 2, section: 'Sorties', titre: 'Une fête chez moi',
      texte: "Samedi, nous {faisons|fesons#conj:faire : nous faisons (on prononce « fe », mais on écrit « fai »).} une fête chez moi. Mes amis {viennent|venent#conj:venir : ils viennent.} avec des gâteaux. Vous {pouvez|pouvons#conj:pouvoir : vous pouvez.} venir aussi !" },
    { niv: 2, section: 'Travail', titre: "Un entretien d'embauche",
      texte: "Je cherche un emploi depuis trois mois. Hier, {j'ai|je suis#aux:« passer un entretien » (avec un complément) se conjugue avec avoir.} passé un entretien dans une banque. La directrice était très {gentille|gentil#accord} et elle va me {rappeler|rappelé#inf} vendredi." },
    { niv: 2, section: 'Courses', titre: 'Les Français et le pain',
      texte: "Les Français {mangent|mange#verbe} beaucoup {de|du#qte} pain. Ils {l'achètent|l'achetent#usage:acheter → ils achètent (accent grave).} souvent {à la|au#genre:« boulangerie » est féminin : à la boulangerie.} boulangerie." },
    { niv: 2, section: 'Logement', titre: 'Appartement à louer',
      texte: "Appartement {lumineux|lumineuse#accord:« appartement » est masculin : lumineux.} de trois pièces, {au|à le#contr} centre-ville. La cuisine est {équipée|équipé#accord} et il y a {un|une#genre:« balcon » est masculin : un balcon.} grand balcon." },
    { niv: 2, section: 'Santé', titre: 'Chez le médecin',
      texte: "Ma fille {a|est#etav:On dit « avoir mal ».} mal à la gorge. Le médecin lui a donné {un|une#genre:« sirop » est masculin : un sirop.} sirop. Elle doit rester {à la|au#genre:« maison » est féminin : à la maison.} maison deux jours." },

    // Niveau 3 : accords du participe, y/en, pronoms, qui/que
    { niv: 3, section: 'Vacances', titre: 'Lucie et Marie en Bretagne',
      texte: "Lucie et Marie {sont|ont#aux:« partir » se conjugue avec être.} parties en Bretagne. Elles se sont {baignées|baigné#ppr:« se baigner » : accord avec le sujet, Lucie et Marie.} tous les jours, même quand il {faisait|était#faire} froid." },
    { niv: 3, section: 'Voyages', titre: 'Marseille, coup de cœur',
      texte: "Tu connais Marseille ? {J'y|J'en#yen} suis allé l'année dernière. Les calanques ? Je {les|leur#pron} ai trouvées magnifiques. Il faut absolument {y|en#yen} aller !" },
    { niv: 3, section: 'Travail', titre: 'Le stage de Youssef',
      texte: "{Youssef|Yassine#coherence:Le titre parle du stage de Youssef.} a fait un stage dans une entreprise {où|ou} il a beaucoup appris. Ses collègues {l'ont|l'a#verbe} bien aidé. Il espère {qu'on|qu'ont#on} lui proposera un contrat." },
    { niv: 3, section: 'Cuisine', titre: 'La recette des crêpes',
      texte: "Pour faire des crêpes, il faut {de la|du#genre:« farine » est féminin : de la farine.} farine, des œufs et {du|de la#genre:« lait » est masculin : du lait.} lait. Pour des crêpes salées, on ne met pas {de|du#partitif} sucre." },
    { niv: 3, section: 'Transports', titre: 'À la gare',
      texte: "Le train pour Bordeaux part {du|de la#genre:« quai » est masculin : du quai.} quai numéro 3. Les voyageurs {doivent|doit#verbe} se présenter dix minutes avant le départ. Le bar {se trouve|se trouvent#verbe} dans la voiture 4." },
    { niv: 3, section: 'Culture', titre: 'La fête de la musique',
      texte: "Le 21 juin, on {joue|jouent#verbe:« on » se conjugue comme « il » : on joue.} de la musique dans toutes les rues. Les groupes {que|qui#rel} nous avons {vus|vu#ppa:Le COD « que » (les groupes) est placé avant : vus.} étaient excellents." },
  ]);
})();
