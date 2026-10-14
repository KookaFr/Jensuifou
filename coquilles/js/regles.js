/* Coquilles — règles expliquées après chaque coquille trouvée, ratée ou imaginée.
   Chaque règle appartient à une rubrique : ortho, gram, typo, calc, faits, image ou page. */
(function () {
  'use strict';
  const CQ = window.CQ;

  CQ.RUBRIQUES = {
    ortho: 'Orthographe',
    gram: 'Grammaire',
    typo: 'Typographie',
    calc: 'Calcul',
    faits: 'Faits',
    image: 'Images',
    page: 'Pages',
  };

  CQ.REGLES = {
    // Homophones grammaticaux
    a: { nom: 'a / à', rub: 'gram', expl: "« a » est le verbe avoir : on peut dire « avait ». Sinon, on écrit « à »." },
    et: { nom: 'et / est', rub: 'gram', expl: "« est » est le verbe être : on peut dire « était ». Sinon, on écrit « et »." },
    son: { nom: 'son / sont', rub: 'gram', expl: "« sont » est le verbe être : on peut dire « étaient ». « son » se remplace par « mon »." },
    on: { nom: 'on / ont', rub: 'gram', expl: "« ont » est le verbe avoir : on peut dire « avaient ». « on » se remplace par « il »." },
    ou: { nom: 'ou / où', rub: 'gram', expl: "« ou » veut dire « ou bien ». « où » indique un lieu ou un moment." },
    ce: { nom: 'ce / se', rub: 'gram', expl: "« se » va avec un verbe (il se lave). « ce » va avec un nom (ce matin) ou « que » (ce que je veux)." },
    ces: { nom: "ces / ses / c'est / s'est", rub: 'gram', expl: "« c'est » = cela est. « s'est » précède un participe (il s'est levé). « ces » montre (ces jours-ci). « ses » = les siens." },
    leur: { nom: 'leur / leurs', rub: 'gram', expl: "Devant un verbe, « leur » (= à eux) ne prend jamais de « s ». Devant un nom au pluriel, on écrit « leurs »." },
    quel: { nom: "quel / qu'elle", rub: 'gram', expl: "« qu'elle » se remplace par « qu'il ». « quel » s'accorde avec le nom : quelle idée, quelles que soient les causes." },
    quand: { nom: 'quand / quant', rub: 'gram', expl: "« quand » = lorsque. « quant à » = en ce qui concerne." },
    quoique: { nom: 'quoique / quoi que', rub: 'gram', expl: "« quoique » = bien que. « quoi que » = quelle que soit la chose que (quoi que tu fasses)." },
    quelque: { nom: 'quelque / quelques', rub: 'gram', expl: "Devant un nombre, « quelque » veut dire « environ » et reste invariable : quelque 2 000 logements." },
    la: { nom: 'la / là', rub: 'gram', expl: "« là » indique un lieu : on peut dire « ici ». « la » est un article (la rue) ou un pronom (je la vois)." },
    mes: { nom: 'mes / mais', rub: 'gram', expl: "« mes » = les miens (mes cahiers). « mais » marque une opposition (petit mais costaud)." },
    peu: { nom: 'peu / peut / peux', rub: 'gram', expl: "« peux », « peut » : verbe pouvoir, on peut dire « pouvait ». « peu » veut dire « pas beaucoup »." },
    tout: { nom: 'tout devant un adjectif', rub: 'gram', expl: "Devant un adjectif, « tout » (= entièrement) reste invariable, sauf devant un adjectif féminin qui commence par une consonne : tout émues, mais toutes contentes." },
    couleur: { nom: 'Adjectifs de couleur', rub: 'gram', expl: "Les couleurs qui viennent d'un nom (marron, orange, cerise) restent invariables : des chaussures marron. Exceptions : rose, mauve, fauve, pourpre s'accordent." },
    demi: { nom: 'demi', rub: 'gram', expl: "Avant le nom, « demi » est invariable et suivi d'un trait d'union : une demi-heure. Après le nom, il s'accorde en genre : une heure et demie." },
    subj: { nom: 'Indicatif ou subjonctif', rub: 'gram', expl: "Après « il faut que », « je veux que », « bien que », le verbe se met au subjonctif (il faut que tu viennes). Après « après que », on garde l'indicatif." },
    bel: { nom: 'beau / bel, nouveau / nouvel', rub: 'gram', expl: "Devant un nom masculin qui commence par une voyelle ou un h muet : bel, nouvel, vieil (un bel hôtel, le nouvel an)." },
    depuis: { nom: 'depuis ou il y a', rub: 'gram', expl: "« depuis » : l'action dure encore (j'habite ici depuis deux ans). « il y a » : l'action est terminée (je suis arrivé il y a deux ans)." },
    pres: { nom: 'près / prêt', rub: 'gram', expl: "« prêt à » = disposé à (il est prêt à partir). « près de » = à côté de, ou presque." },

    // Verbes et accords
    inf: { nom: 'Infinitif ou participe', rub: 'gram', expl: "Après « aller », « pour », « de »… on met l'infinitif. Astuce : remplace par « vendre » ou « vendu »." },
    ez: { nom: '-ez ou -er', rub: 'gram', expl: "Avec « vous », le verbe conjugué finit par -ez (vous chantez, ne cliquez pas). Astuce : remplace par « prenez »." },
    verbe: { nom: 'Accord du verbe', rub: 'gram', expl: "Le verbe s'accorde avec son sujet : ils chantent, nous chantons. « on » se conjugue comme « il »." },
    pluriel: { nom: 'Pluriel des noms', rub: 'gram', expl: "Au pluriel, les noms prennent un -s. Les mots en -eau, -au, -eu prennent un -x (des oiseaux, des jeux), et ceux en -al deviennent -aux (des chevaux)." },
    accord: { nom: "Accord de l'adjectif", rub: 'gram', expl: "L'adjectif s'accorde en genre et en nombre avec le nom : des fleurs blanches, un appartement lumineux." },
    ppe: { nom: 'Participe passé avec être', rub: 'gram', expl: "Avec être, le participe passé s'accorde avec le sujet : elles sont parties." },
    ppa: { nom: 'Participe passé avec avoir', rub: 'gram', expl: "Avec avoir, le participe passé s'accorde avec le COD seulement s'il est placé avant : les pommes que j'ai achetées." },
    ppr: { nom: 'Participe des verbes pronominaux', rub: 'gram', expl: "Avec un verbe pronominal, l'accord se fait avec le COD placé avant. Quand « se » n'est pas COD (se rendre compte, se succéder), le participe reste invariable." },
    futcond: { nom: 'Futur ou conditionnel', rub: 'gram', expl: "-rai = futur (je viendrai demain). -rais = conditionnel (je viendrais si je pouvais). Astuce : remplace par « il » : il viendra / il viendrait." },
    si: { nom: 'Si + conditionnel', rub: 'gram', expl: "Après le « si » de condition, jamais de conditionnel : si j'avais su, je serais venu." },
    neg: { nom: 'La négation', rub: 'gram', expl: "À l'écrit, la négation a deux parties : ne… pas, ne… jamais, ne… rien. Avec « on », on écrit « on n'a pas » : la liaison cache le « n' »." },

    // Orthographe d'usage
    usage: { nom: "Orthographe d'usage", rub: 'ortho', expl: "Pas de règle simple : ce mot s'écrit comme ça. À mémoriser." },
    mbp: { nom: 'm devant m, b, p', rub: 'ortho', expl: "Devant m, b ou p, le n devient m : emporter, champion, pompier. Exceptions : bonbon, bonbonne, néanmoins." },
    ge: { nom: 'ge / ç devant a, o', rub: 'ortho', expl: "Pour garder le son doux devant a ou o, on écrit « ge » ou « ç » : nous mangeons, nous commençons." },
    ss: { nom: 's ou ss', rub: 'ortho', expl: "Entre deux voyelles, un seul s fait le son [z] (une rose, un poison). Pour garder le son [s], on double : un poisson, un dessert." },
    eil: { nom: '-eil ou -eille', rub: 'ortho', expl: "Les noms masculins finissent par -ail, -eil, -euil (le travail, le soleil) ; les noms féminins par -aille, -eille, -euille (la paille, l'abeille, la feuille)." },
    vingt: { nom: 'vingt et cent', rub: 'ortho', expl: "« vingt » et « cent » prennent un -s quand ils sont multipliés et terminent le nombre : quatre-vingts, deux cents, mais quatre-vingt-trois." },

    // Français langue étrangère
    genre: { nom: 'Le genre des noms', rub: 'gram', expl: "Chaque nom a un genre qu'on apprend avec lui : un restaurant, une baguette." },
    etav: { nom: 'Être ou avoir', rub: 'gram', expl: "On dit « être content », mais « avoir faim », « avoir froid », « avoir trente ans »." },
    aux: { nom: 'Passé composé : être ou avoir', rub: 'gram', expl: "Les verbes de mouvement (aller, venir, partir, arriver, revenir…) et les verbes pronominaux se conjuguent avec « être »." },
    prep: { nom: 'à, en, au + lieu', rub: 'gram', expl: "à + ville (à Lyon), en + pays féminin (en France), au + pays masculin (au Japon), aux + pays pluriel (aux États-Unis)." },
    contr: { nom: 'au, du, des', rub: 'gram', expl: "à + le = au, de + le = du, de + les = des : je vais au marché, il vient du Japon." },
    elision: { nom: "L'élision", rub: 'gram', expl: "Devant une voyelle ou un h muet, le et la deviennent l' : l'équipe, l'eau." },
    conj: { nom: 'Conjugaison', rub: 'gram', expl: "Verbe irrégulier : sa conjugaison s'apprend par cœur." },
    partitif: { nom: 'Négation et partitif', rub: 'gram', expl: "Après une négation, du, de la, des deviennent « de » : je ne bois pas de vin." },
    qte: { nom: 'Les quantités', rub: 'gram', expl: "Après une quantité (beaucoup, peu, un kilo), on met « de » : beaucoup de monde." },
    poss: { nom: 'Les possessifs', rub: 'gram', expl: "Le possessif s'accorde avec ce qu'on possède : son ami, sa sœur, ses amis." },
    faire: { nom: 'Il fait beau', rub: 'gram', expl: "Pour la météo, on dit « il fait beau », « il fait froid », pas « il est »." },
    yen: { nom: 'y ou en', rub: 'gram', expl: "« y » remplace un lieu (j'y vais, j'y suis allé). « en » remplace « de + nom » (j'en viens, j'en veux)." },
    pron: { nom: 'le, les ou leur', rub: 'gram', expl: "« les » remplace un COD (je les vois). « leur » remplace « à eux, à elles » (je leur parle)." },
    rel: { nom: 'qui, que, dont, où', rub: 'gram', expl: "« qui » est sujet (les groupes qui jouent), « que » est complément (les groupes que nous avons vus), « dont » remplace « de… » (le film dont je parle), « où » remplace un lieu ou un moment." },

    // Calcul et logique
    calc: { nom: 'Calcul', rub: 'calc', expl: 'Le résultat ne correspond pas aux nombres du texte.' },
    date: { nom: 'Date impossible', rub: 'calc', expl: "Avril, juin, septembre et novembre ont 30 jours ; février en a 28 (29 les années bissextiles)." },

    // Images
    image: { nom: 'Image', rub: 'image', expl: "La photo ne correspond pas au texte." },

    // Typographie : les coquilles d'imprimerie au sens propre
    lettres: { nom: "Coquille d'imprimerie", rub: 'typo', expl: "Des lettres ont été inversées, oubliées ou doublées en composant le texte. On relit lentement, mot par mot." },
    doublon: { nom: 'Mot répété', rub: 'typo', expl: "Le même mot est imprimé deux fois de suite. L'œil saute facilement ce genre de répétition, surtout en fin de ligne." },
    majuscule: { nom: 'Majuscule', rub: 'typo', expl: "Les noms propres (personnes, villes, pays, rues) et les noms d'habitants (les Français) prennent une majuscule. La langue et l'adjectif n'en prennent pas : le français, un vin français." },
    accentmaj: { nom: 'Accent sur la majuscule', rub: 'typo', expl: "En français, les majuscules gardent leurs accents : État, Élise, À bientôt." },

    // Vérification des faits
    fait: { nom: 'Vérification des faits', rub: 'faits', expl: "L'information est fausse. Avant de publier, on vérifie chaque fait." },
    titre: { nom: 'Titre trompeur', rub: 'faits', expl: "Le titre doit dire la même chose que l'article." },
    coherence: { nom: "Cohérence de l'article", rub: 'faits', expl: "Un même nom doit s'écrire pareil d'un bout à l'autre de l'article, titre compris." },
    age: { nom: 'Âge et année de naissance', rub: 'faits', expl: "L'âge doit correspondre à l'année de naissance." },
    jour: { nom: 'Jour de la semaine', rub: 'faits', expl: "Le jour de la semaine doit correspondre à la date. La date du journal est affichée sur la rotative." },

    // Mise en page
    folio: { nom: 'Numéro de page', rub: 'page', expl: "Les pages se suivent : après la page 4 vient la page 5. La dernière page imprimée est indiquée sur la rotative." },
    sommaire: { nom: 'Sommaire', rub: 'page', expl: "Le sommaire suit l'ordre des pages et ne peut pas renvoyer au-delà de la dernière page du numéro." },
  };

  // Familles de mots qui se confondent : la règle se devine toute seule.
  const FAMILLES = [
    [['a', 'à'], 'a'],
    [['et', 'est'], 'et'],
    [['son', 'sont'], 'son'],
    [['on', 'ont'], 'on'],
    [['ou', 'où'], 'ou'],
    [['ce', 'se'], 'ce'],
    [['ces', 'ses', "c'est", "s'est"], 'ces'],
    [['leur', 'leurs'], 'leur'],
    [['quel', 'quels', 'quelle', 'quelles', "qu'elle", "qu'elles"], 'quel'],
    [['quand', 'quant', "qu'en"], 'quand'],
    [['la', 'là', "l'a"], 'la'],
    [['mes', 'mais', 'mets', 'met'], 'mes'],
    [['peu', 'peut', 'peux'], 'peu'],
  ];

  CQ.detecterRegle = function (correct, faute) {
    const c = CQ.normaliser(correct), f = CQ.normaliser(faute);
    for (const [mots, code] of FAMILLES) {
      if (mots.includes(c) && mots.includes(f)) return code;
    }
    return null;
  };
})();
